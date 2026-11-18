const express = require('express');
const pool = require('../db');
const { isValidEmail } = require('../utils/validators');

const router = express.Router();

router.post('/', async (req, res) => {
  const { email } = req.body || {};
  const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (!isValidEmail(cleanEmail) || cleanEmail.length > 255) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO newsletter_subscribers (email)
       VALUES ($1)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return res.json({ message: 'You are already subscribed.' });
    }

    res.status(201).json({ message: 'Thanks for subscribing!' });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
