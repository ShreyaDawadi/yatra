const express = require('express');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { parseId, cleanOptionalText } = require('../utils/validators');

const router = express.Router();

function readReviewInput(body) {
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: 'rating must be a whole number from 1 to 5' };
  }

  const comment = cleanOptionalText(body.comment, 1000);
  if (comment === undefined) {
    return { error: 'comment must be text of up to 1000 characters' };
  }

  return { rating, comment };
}

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.listing_id, l.name AS listing_name, l.name_np AS listing_name_np,
              l.type AS listing_type, r.rating, r.comment, r.created_at, r.updated_at
       FROM reviews r
       JOIN listings l ON l.id = r.listing_id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Get my reviews error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.get('/eligibility/:listingId', requireAuth, async (req, res) => {
  const listingId = parseId(req.params.listingId);
  if (listingId === null) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  try {
    const result = await pool.query(
      `SELECT
         EXISTS (
           SELECT 1 FROM bookings
           WHERE user_id = $1 AND listing_id = $2 AND status <> 'cancelled'
         ) AS has_booking,
         (SELECT id FROM reviews WHERE user_id = $1 AND listing_id = $2) AS review_id`,
      [req.user.id, listingId]
    );

    const { has_booking, review_id } = result.rows[0];
    res.json({
      can_review: has_booking && review_id === null,
      has_booking,
      review_id,
    });
  } catch (err) {
    console.error('Review eligibility error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  const reviewId = parseId(req.params.id);
  if (reviewId === null) {
    return res.status(400).json({ error: 'Invalid review id' });
  }

  const { rating, comment, error } = readReviewInput(req.body || {});
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const result = await pool.query(
      `UPDATE reviews
       SET rating = $1, comment = $2, updated_at = now()
       WHERE id = $3 AND user_id = $4
       RETURNING id, listing_id, rating, comment, created_at, updated_at`,
      [rating, comment, reviewId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ review: result.rows[0] });
  } catch (err) {
    console.error('Update review error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const reviewId = parseId(req.params.id);
  if (reviewId === null) {
    return res.status(400).json({ error: 'Invalid review id' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id',
      [reviewId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Delete review error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = { router, readReviewInput };
