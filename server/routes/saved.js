const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { parseId } = require('../utils/validators');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT l.id, l.type, l.name, l.name_np, l.city, l.price, l.duration_days,
              l.image_url, s.created_at AS saved_at
       FROM saved_listings s
       JOIN listings l ON l.id = s.listing_id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get saved listings error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/:listingId', requireAuth, async (req, res) => {
  const listingId = parseId(req.params.listingId);
  if (listingId === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  try {
    await pool.query(
      `INSERT INTO saved_listings (user_id, listing_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, listing_id) DO NOTHING`,
      [req.user.id, listingId]
    );

    res.status(201).json({ saved: true, listing_id: listingId });
  } catch (err) {
    if (err.code === '23503') {
      return res.status(404).json({ error: 'Listing not found' });
    }
    console.error('Save listing error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.delete('/:listingId', requireAuth, async (req, res) => {
  const listingId = parseId(req.params.listingId);
  if (listingId === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  try {
    await pool.query(
      'DELETE FROM saved_listings WHERE user_id = $1 AND listing_id = $2',
      [req.user.id, listingId]
    );

    res.status(204).end();
  } catch (err) {
    console.error('Unsave listing error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
