const express = require('express');
const pool = require('../db');
const { isValidEmail, cleanOptionalText } = require('../utils/validators');

const router = express.Router();

router.post('/', async (req, res) => {
  const body = req.body || {};
  const name = cleanOptionalText(body.name, 255);
  const email = cleanOptionalText(body.email, 255);
  const subject = cleanOptionalText(body.subject, 255);
  const message = cleanOptionalText(body.message, 5000);

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }
  if (subject === undefined) {
    return res.status(400).json({ error: 'Subject must be text of up to 255 characters' });
  }
  if (!message) {
    return res.status(400).json({ error: 'Message is required (up to 5000 characters)' });
  }

  try {
    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email.toLowerCase(), subject, message]
    );

    res.status(201).json({ message: 'Thanks for getting in touch. We will reply soon.' });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
