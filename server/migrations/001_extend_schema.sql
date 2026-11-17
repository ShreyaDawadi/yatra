-- 001_extend_schema.sql
-- Adds trek and hotel details, hotel room types, guest details on bookings,
-- profile phone, review editing, saved listings, newsletter, contact
-- messages and password reset tokens.
--
-- Run once, from the server folder:
--   psql -U postgres -d yatra -v ON_ERROR_STOP=1 --single-transaction -f migrations/001_extend_schema.sql

-- 1. Listings: extra detail columns -----------------------------------------

ALTER TABLE listings
  ADD COLUMN difficulty     VARCHAR(20),
  ADD COLUMN max_altitude_m INTEGER,
  ADD COLUMN best_season    VARCHAR(100),
  ADD COLUMN best_season_np VARCHAR(100),
  ADD COLUMN itinerary      JSONB,
  ADD COLUMN included       TEXT[],
  ADD COLUMN excluded       TEXT[],
  ADD COLUMN amenities      TEXT[],
  ADD COLUMN star_rating    INTEGER,
  ADD COLUMN gallery        TEXT[],
  ADD COLUMN route          JSONB;

ALTER TABLE listings
  ADD CONSTRAINT listings_type_check
    CHECK (type IN ('trek', 'hotel', 'sightseeing')),
  ADD CONSTRAINT listings_difficulty_check
    CHECK (difficulty IS NULL OR difficulty IN ('easy', 'moderate', 'challenging', 'strenuous')),
  ADD CONSTRAINT listings_star_rating_check
    CHECK (star_rating IS NULL OR star_rating BETWEEN 1 AND 5),
  ADD CONSTRAINT listings_max_altitude_check
    CHECK (max_altitude_m IS NULL OR max_altitude_m > 0);

-- 2. Hotel room types -------------------------------------------------------

CREATE TABLE room_types (
  id              SERIAL PRIMARY KEY,
  listing_id      INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  name_np         VARCHAR(100),
  price_per_night NUMERIC(10,2) NOT NULL CHECK (price_per_night > 0),
  max_guests      INTEGER NOT NULL CHECK (max_guests BETWEEN 1 AND 10),
  total_rooms     INTEGER NOT NULL CHECK (total_rooms >= 1),
  created_at      TIMESTAMP DEFAULT now()
);

CREATE INDEX room_types_listing_id_idx ON room_types (listing_id);

-- 3. Bookings: room type, rooms and guest details ---------------------------

ALTER TABLE bookings
  ADD COLUMN room_type_id     INTEGER REFERENCES room_types(id),
  ADD COLUMN rooms            INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN guest_name       VARCHAR(255),
  ADD COLUMN guest_email      VARCHAR(255),
  ADD COLUMN guest_phone      VARCHAR(30),
  ADD COLUMN special_requests TEXT;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_rooms_check
    CHECK (rooms BETWEEN 1 AND 10),
  ADD CONSTRAINT bookings_status_check
    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  ADD CONSTRAINT bookings_people_check
    CHECK (number_of_people BETWEEN 1 AND 100);

CREATE INDEX bookings_user_id_idx ON bookings (user_id);
CREATE INDEX bookings_room_type_date_idx ON bookings (room_type_id, booking_date);

-- 4. Users: phone number for the profile ------------------------------------

ALTER TABLE users ADD COLUMN phone VARCHAR(30);

-- 5. Reviews: editing and one review per user per listing -------------------

ALTER TABLE reviews
  ADD COLUMN updated_at TIMESTAMP,
  ADD CONSTRAINT reviews_listing_user_unique UNIQUE (listing_id, user_id);

-- 6. Saved listings (wishlist) ----------------------------------------------

CREATE TABLE saved_listings (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, listing_id)
);

-- 7. Newsletter subscribers -------------------------------------------------

CREATE TABLE newsletter_subscribers (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- 8. Contact form messages --------------------------------------------------

CREATE TABLE contact_messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- 9. Password reset tokens --------------------------------------------------

CREATE TABLE password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used_at    TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
