const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const {
  parseId,
  isValidDateString,
  todayInNepal,
  isValidEmail,
  cleanOptionalText,
} = require('../utils/validators');

const router = express.Router();

const BOOKING_COLUMNS = `id, listing_id, room_type_id, to_char(booking_date, 'YYYY-MM-DD') AS booking_date,
  number_of_people, nights, rooms, total_price, status,
  guest_name, guest_email, guest_phone, special_requests, created_at`;

function readGuestDetails(body) {
  const name = cleanOptionalText(body.guest_name, 255);
  const email = cleanOptionalText(body.guest_email, 255);
  const phone = cleanOptionalText(body.guest_phone, 30);
  const requests = cleanOptionalText(body.special_requests, 1000);

  if (!name) {
    return { error: 'guest_name is required (up to 255 characters)' };
  }
  if (!email || !isValidEmail(email)) {
    return { error: 'guest_email must be a valid email address' };
  }
  if (phone === undefined || (phone !== null && !/^[0-9+\-\s()]{7,30}$/.test(phone))) {
    return { error: 'guest_phone may contain only digits, spaces, +, - and brackets' };
  }
  if (requests === undefined) {
    return { error: 'special_requests must be text of up to 1000 characters' };
  }

  return { guest: { name, email: email.toLowerCase(), phone, requests } };
}

async function createHotelBooking(req, res, { listingId, bookingDate, people, guest }) {
  const body = req.body;
  const roomTypeId = parseId(body.room_type_id);
  const nights = Number(body.nights);
  const rooms = body.rooms === undefined ? 1 : Number(body.rooms);

  if (roomTypeId === null) {
    return res.status(400).json({ error: 'Hotel bookings need a valid room_type_id' });
  }
  if (!Number.isInteger(nights) || nights < 1 || nights > 30) {
    return res.status(400).json({ error: 'Hotel bookings need nights: a whole number from 1 to 30' });
  }
  if (!Number.isInteger(rooms) || rooms < 1 || rooms > 10) {
    return res.status(400).json({ error: 'rooms must be a whole number from 1 to 10' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const roomResult = await client.query(
      `SELECT id, max_guests, total_rooms
       FROM room_types
       WHERE id = $1 AND listing_id = $2
       FOR UPDATE`,
      [roomTypeId, listingId]
    );
    const room = roomResult.rows[0];

    if (!room) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'That room type does not belong to this hotel' });
    }

    if (people > room.max_guests * rooms) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        error: `${rooms} room(s) of this type fit at most ${room.max_guests * rooms} guests`,
      });
    }

    const bookedResult = await client.query(
      `SELECT COALESCE(SUM(rooms), 0)::int AS booked
       FROM bookings
       WHERE room_type_id = $1
         AND status <> 'cancelled'
         AND booking_date < $2::date + $3::int
         AND booking_date + nights > $2::date`,
      [roomTypeId, bookingDate, nights]
    );
    const roomsLeft = room.total_rooms - bookedResult.rows[0].booked;

    if (roomsLeft < rooms) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        error: roomsLeft === 0
          ? 'No rooms of this type are available for those dates'
          : `Only ${roomsLeft} room(s) of this type are available for those dates`,
      });
    }

    const result = await client.query(
      `INSERT INTO bookings
         (user_id, listing_id, room_type_id, booking_date, number_of_people, nights, rooms,
          total_price, guest_name, guest_email, guest_phone, special_requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7,
               (SELECT price_per_night FROM room_types WHERE id = $3) * $6::integer * $7::integer,
               $8, $9, $10, $11)
       RETURNING ${BOOKING_COLUMNS}`,
      [req.user.id, listingId, roomTypeId, bookingDate, people, nights, rooms,
        guest.name, guest.email, guest.phone, guest.requests]
    );

    await client.query('COMMIT');
    return res.status(201).json({ booking: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    if (err.code === '23503') {
      return res.status(400).json({ error: 'That listing or user no longer exists' });
    }
    console.error('Create hotel booking error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  } finally {
    client.release();
  }
}

router.post('/', requireAuth, async (req, res) => {
  const body = req.body || {};
  req.body = body;

  const listingId = parseId(body.listing_id);
  const people = Number(body.number_of_people);
  const bookingDate = body.booking_date;

  if (listingId === null) {
    return res.status(400).json({ error: 'A valid listing_id is required' });
  }
  if (!Number.isInteger(people) || people < 1 || people > 100) {
    return res.status(400).json({ error: 'number_of_people must be a whole number from 1 to 100' });
  }
  if (!isValidDateString(bookingDate)) {
    return res.status(400).json({ error: 'booking_date must be a real date in YYYY-MM-DD format' });
  }
  if (bookingDate < todayInNepal()) {
    return res.status(400).json({ error: 'booking_date cannot be in the past' });
  }

  const { guest, error } = readGuestDetails(body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const listingResult = await pool.query(
      'SELECT id, type, max_group_size FROM listings WHERE id = $1',
      [listingId]
    );
    const listing = listingResult.rows[0];

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.type === 'hotel') {
      return createHotelBooking(req, res, { listingId, bookingDate, people, guest });
    }

    if (listing.max_group_size !== null && people > listing.max_group_size) {
      return res.status(400).json({
        error: `This listing allows at most ${listing.max_group_size} people per booking`,
      });
    }

    const result = await pool.query(
      `INSERT INTO bookings
         (user_id, listing_id, booking_date, number_of_people, total_price,
          guest_name, guest_email, guest_phone, special_requests)
       VALUES ($1, $2, $3, $4,
               (SELECT price FROM listings WHERE id = $2) * $4::integer,
               $5, $6, $7, $8)
       RETURNING ${BOOKING_COLUMNS}`,
      [req.user.id, listingId, bookingDate, people,
        guest.name, guest.email, guest.phone, guest.requests]
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
              l.image_url AS listing_image_url,
              b.room_type_id,
              rt.name AS room_type_name,
              rt.name_np AS room_type_name_np,
              to_char(b.booking_date, 'YYYY-MM-DD') AS booking_date,
              b.number_of_people,
              b.nights,
              b.rooms,
              b.total_price,
              b.status,
              b.guest_name,
              b.guest_email,
              b.guest_phone,
              b.special_requests,
              b.created_at
       FROM bookings b
       JOIN listings l ON l.id = b.listing_id
       LEFT JOIN room_types rt ON rt.id = b.room_type_id
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
  const bookingId = parseId(req.params.id);

  if (bookingId === null) {
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
       RETURNING ${BOOKING_COLUMNS}`,
      [bookingId, req.user.id, todayInNepal()]
    );

    if (result.rows.length > 0) {
      return res.json({ booking: result.rows[0] });
    }

    const check = await pool.query(
      'SELECT status FROM bookings WHERE id = $1 AND user_id = $2',
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
