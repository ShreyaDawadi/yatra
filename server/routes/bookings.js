const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

function todayInNepal() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' });
}

function isValidDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

router.post('/', requireAuth, async (req, res) => {
  const { listing_id, booking_date, number_of_people } = req.body || {};

  const listingId = Number(listing_id);
  const people = Number(number_of_people);

  if (!Number.isInteger(listingId) || listingId < 1 || listingId > 2147483647) {
    return res.status(400).json({ error: 'A valid listing_id is required' });
  }

  if (!Number.isInteger(people) || people < 1 || people > 100) {
    return res.status(400).json({ error: 'number_of_people must be a whole number from 1 to 100' });
  }

  if (!isValidDateString(booking_date)) {
    return res.status(400).json({ error: 'booking_date must be a real date in YYYY-MM-DD format' });
  }

  if (booking_date < todayInNepal()) {
    return res.status(400).json({ error: 'booking_date cannot be in the past' });
  }
  try {
    const listingResult = await pool.query(
      'SELECT id, max_group_size FROM listings WHERE id = $1',
      [listingId]
    );
    const listing = listingResult.rows[0];

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.max_group_size !== null && people > listing.max_group_size) {
      return res.status(400).json({ error: `This listing allows at most ${listing.max_group_size} people per booking` });
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, listing_id, booking_date, number_of_people, total_price)
       VALUES ($1, $2, $3, $4, (SELECT price FROM listings WHERE id = $2) * $4::integer)
       RETURNING id, user_id, listing_id, to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
                 number_of_people, total_price, status, created_at`,
      [req.user.id, listingId, booking_date, people]
    );

    res.status(201).json({ booking: result.rows[0] });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'That listing or user no longer exists' });
    }
    console.error('Create booking error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id,
              b.listing_id,
              l.name AS listing_name,
              l.name_np AS listing_name_np,
              l.type AS listing_type,
              l.city AS listing_city,
              to_char(b.booking_date, 'YYYY-MM-DD') AS booking_date,
              b.number_of_people,
              b.total_price,
              b.status,
              b.created_at
       FROM bookings b
       JOIN listings l ON l.id = b.listing_id
       WHERE b.user_id = $1
       ORDER BY b.booking_date, b.id`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get my bookings error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  const bookingId = Number(req.params.id);

  if (!Number.isInteger(bookingId) || bookingId < 1 || bookingId > 2147483647) {
    return res.status(400).json({ error: 'Invalid booking id' });
  }

  try {
    const result = await pool.query(
      `UPDATE bookings
       SET status = 'cancelled'
       WHERE id = $1
         AND user_id = $2
         AND status <> 'cancelled'
         AND booking_date >= $3
       RETURNING id, listing_id, to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
                 number_of_people, total_price, status, created_at`,
      [bookingId, req.user.id, todayInNepal()]
    );

    if (result.rows.length > 0) {
      return res.json({ booking: result.rows[0] });
    }

    const check = await pool.query(
      `SELECT status
       FROM bookings
       WHERE id = $1 AND user_id = $2`,
      [bookingId, req.user.id]
    );
    const existing = check.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (existing.status === 'cancelled') {
      return res.status(400).json({ error: 'This booking is already cancelled' });
    }

    return res.status(400).json({ error: 'Past bookings cannot be cancelled' });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});
module.exports = router;