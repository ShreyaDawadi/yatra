require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const bookingRoutes = require('./routes/bookings');
const { router: reviewRoutes } = require('./routes/reviews');
const savedRoutes = require('./routes/saved');
const newsletterRoutes = require('./routes/newsletter');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 5001;

// In production, only the deployed frontend may call the API.
// CLIENT_URL can hold several origins separated by commas.
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : null;

app.use(cors(allowedOrigins ? { origin: allowedOrigins } : undefined));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Yatra API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Could not start server on port ${PORT}:`, err.message);
    process.exit(1);
  }
  console.log(`Yatra server running on http://localhost:${PORT}`);
});
