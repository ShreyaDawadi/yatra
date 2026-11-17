const express = require('express');
const pool = require('../db');

const router = express.Router();

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
    conditions.push(`type = $${values.length}`);
  }

  if (typeof city === 'string' && city.trim() !== '') {
    values.push(city.trim());
    conditions.push(`LOWER(city) = LOWER($${values.length})`);
  }

  if (typeof search === 'string' && search.trim() !== '') {
    values.push(`%${search.trim()}%`);
    conditions.push(`(name ILIKE $${values.length} OR name_np ILIKE $${values.length})`);
  }

  let sql = 'SELECT * FROM listings';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY id';

  try {
    const result = await pool.query(sql, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).json({ error: 'Invalid listing id' });
  }

  try {
    const result = await pool.query('SELECT * FROM listings WHERE id = $1', [id]);
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
module.exports = router;