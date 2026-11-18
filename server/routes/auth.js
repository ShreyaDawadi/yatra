const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db');
const requireAuth = require('../middleware/requireAuth');
const { cleanOptionalText } = require('../utils/validators');

const router = express.Router();
function createToken(user) {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName === '' || cleanEmail === '') {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, phone, created_at',
      [cleanName, cleanEmail, passwordHash]
    );

    const user = result.rows[0];

    const token = createToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || typeof password !== 'string' || email.trim() === '' || password === '') {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, password_hash, created_at FROM users WHERE email = $1',
      [cleanEmail]
    );

    const row = result.rows[0];

    if (!row) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, row.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      created_at: row.created_at,
    };

    const token = createToken(user);
    res.json({ user, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.patch('/me', requireAuth, async (req, res) => {
  const body = req.body || {};
  const name = cleanOptionalText(body.name, 255);
  const phone = cleanOptionalText(body.phone, 30);

  if (!name) {
    return res.status(400).json({ error: 'Name is required (up to 255 characters)' });
  }
  if (phone === undefined || (phone !== null && !/^[0-9+\-\s()]{7,30}$/.test(phone))) {
    return res.status(400).json({ error: 'Phone may contain only digits, spaces, +, - and brackets' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, phone = $2
       WHERE id = $3
       RETURNING id, name, email, phone, created_at`,
      [name, phone, req.user.id]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.patch('/me/password', requireAuth, async (req, res) => {
  const { current_password, new_password } = req.body || {};

  if (typeof current_password !== 'string' || typeof new_password !== 'string') {
    return res.status(400).json({ error: 'current_password and new_password are required' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  try {
    const result = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    const matches = await bcrypt.compare(current_password, row.password_hash);
    if (!matches) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, req.user.id]);

    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  const genericMessage = 'If an account exists for that email, a reset link has been sent.';

  if (typeof email !== 'string' || email.trim() === '') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    const user = userResult.rows[0];

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');

      await pool.query(
        'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used_at IS NULL',
        [user.id]
      );
      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, now() + interval '30 minutes')`,
        [user.id, hashToken(token)]
      );

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      console.log(`Password reset link for ${cleanEmail}: ${clientUrl}/reset-password?token=${token}`);
    }

    res.json({ message: genericMessage });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, new_password } = req.body || {};

  if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) {
    return res.status(400).json({ error: 'This reset link is invalid or has expired' });
  }
  if (typeof new_password !== 'string' || new_password.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const tokenResult = await client.query(
      `SELECT id, user_id
       FROM password_reset_tokens
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > now()
       FOR UPDATE`,
      [hashToken(token)]
    );
    const resetToken = tokenResult.rows[0];

    if (!resetToken) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This reset link is invalid or has expired' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newHash, resetToken.user_id]);
    await client.query('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [resetToken.id]);

    await client.query('COMMIT');
    res.json({ message: 'Password has been reset. You can now log in.' });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  } finally {
    client.release();
  }
});

module.exports = router;