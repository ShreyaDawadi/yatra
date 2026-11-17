const pool = require('./db');

pool.query('SELECT COUNT(*) FROM listings')
  .then((result) => {
    console.log('Connected! Listings in database:', result.rows[0].count);
    return pool.end();
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });