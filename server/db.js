require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Hosted databases reached over the internet usually require SSL.
  // Set DATABASE_SSL=true for those; leave it unset locally.
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

module.exports = pool;
