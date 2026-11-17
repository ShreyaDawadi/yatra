const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { parseId, isValidDateString } = require('../utils/validators');

const router = express.Router();

const LISTING_SELECT = `
  SELECT l.*, r.average_rating, COALESCE(r.review_count, 0) AS review_count
  FROM listings l
  LEFT JOIN (
    SELECT listing_id, ROUND(AVG(rating), 1) AS average_rating, COUNT(*)::int AS review_count
    FROM reviews
    GROUP BY listing_id
  ) r ON r.listing_id = l.id
`;

router.get('/', async (req, res) => {
  const { type, city, search } = req.query;

  const conditions = [];
  const values = [];

  if (type !== undefined) {
    const allowedTypes = ['trek', 'hotel', 'sightseeing'];
    if (typeof type !== 'string' || !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'type must be trek, hotel or sightseeing' });
    }
    values.push(type);
    conditions.push(`l.type = $${values.length}`);
  }

  if (typeof city === 'string' && city.trim() !== '') {
    values.push(city.trim());
    conditions.push(`LOWER(l.city) = LOWER($${values.length})`);
  }

  if (typeof search === 'string' && search.trim() !== '') {
    values.push(`%${search.trim()}%`);
    conditions.push(`(l.name ILIKE $${values.length} OR l.name_np ILIKE $${values.length})`);
  }

  let sql = LISTING_SELECT;
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY l.id';

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  try {
    const result = await pool.query(`${LISTING_SELECT} WHERE l.id = $1`, [id]);
    const listing = result.rows[0];

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (err) {
    console.error('Get listing error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.get('/:id/rooms', async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  const { check_in, nights } = req.query;
  const hasDates = check_in !== undefined || nights !== undefined;
  const nightsNumber = Number(nights);

  if (hasDates) {
    if (!isValidDateString(check_in)) {
      return res.status(400).json({ error: 'check_in must be a real date in YYYY-MM-DD format' });
    }
    if (!Number.isInteger(nightsNumber) || nightsNumber < 1 || nightsNumber > 30) {
      return res.status(400).json({ error: 'nights must be a whole number from 1 to 30' });
    }
  }

  try {
    const listingResult = await pool.query('SELECT type FROM listings WHERE id = $1', [id]);
    const listing = listingResult.rows[0];

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (listing.type !== 'hotel') {
      return res.status(400).json({ error: 'Only hotels have rooms' });
    }

    const result = await pool.query(
      `SELECT rt.id, rt.name, rt.name_np, rt.price_per_night, rt.max_guests, rt.total_rooms,
              CASE WHEN $2::date IS NULL THEN NULL
                   ELSE (rt.total_rooms - COALESCE(SUM(b.rooms), 0))::int
              END AS rooms_available
       FROM room_types rt
       LEFT JOIN bookings b
         ON b.room_type_id = rt.id
        AND b.status <> 'cancelled'
        AND b.booking_date < $2::date + $3::int
        AND b.booking_date + b.nights > $2::date
       WHERE rt.listing_id = $1
       GROUP BY rt.id
       ORDER BY rt.price_per_night`,
      [id, hasDates ? check_in : null, hasDates ? nightsNumber : null]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get rooms error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  try {
    const listingResult = await pool.query('SELECT id FROM listings WHERE id = $1', [id]);
    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name AS user_name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.listing_id = $1
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get reviews error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/:id/reviews', requireAuth, async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  const { rating, comment } = req.body || {};
  const ratingNumber = Number(rating);

  if (!Number.isInteger(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
    return res.status(400).json({ error: 'rating must be a whole number from 1 to 5' });
  }

  let cleanComment = null;
  if (comment !== undefined && comment !== null) {
    if (typeof comment !== 'string') {
      return res.status(400).json({ error: 'comment must be text' });
    }
    cleanComment = comment.trim() || null;
    if (cleanComment && cleanComment.length > 1000) {
      return res.status(400).json({ error: 'comment must be 1000 characters or fewer' });
    }
  }

  try {
    const listingResult = await pool.query('SELECT id FROM listings WHERE id = $1', [id]);
    if (listingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    const existing = await pool.query(
      'SELECT id FROM reviews WHERE listing_id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'You have already reviewed this listing' });
    }

    const result = await pool.query(
      `INSERT INTO reviews (listing_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, listing_id, rating, comment, created_at`,
      [id, req.user.id, ratingNumber, cleanComment]
    );

    res.status(201).json({ review: result.rows[0] });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(400).json({ error: 'That listing or user no longer exists' });
    }
    console.error('Create review error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;