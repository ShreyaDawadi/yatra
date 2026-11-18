import { daysBetween, todayInNepal, toNumber } from './format'

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function isDateString(value) {
  return typeof value === 'string' && DATE_PATTERN.test(value)
}

export function clampInt(value, min, max, fallback) {
  const number = Number(value)
  if (!Number.isInteger(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

export function nightsBetween(checkIn, checkOut) {
  if (!isDateString(checkIn) || !isDateString(checkOut)) return null
  const nights = daysBetween(checkIn, checkOut)
  return nights >= 1 && nights <= 30 ? nights : null
}

// Mirrors the backend rules so travellers see problems before submitting.
// The server still checks everything again.
export function validateTrip(listing, trip, room) {
  const errors = {}
  const today = todayInNepal()

  if (!isDateString(trip.date)) {
    errors.date = { key: 'booking.errors.dateRequired' }
  } else if (trip.date < today) {
    errors.date = { key: 'booking.errors.datePast' }
  }

  if (listing.type === 'hotel') {
    if (!room) {
      errors.room = { key: 'booking.errors.roomRequired' }
    }
    if (!Number.isInteger(trip.nights) || trip.nights < 1 || trip.nights > 30) {
      errors.nights = { key: 'booking.errors.nightsRange' }
    }
    if (!Number.isInteger(trip.rooms) || trip.rooms < 1 || trip.rooms > 10) {
      errors.rooms = { key: 'booking.errors.roomsRange' }
    }
    if (room) {
      const capacity = room.max_guests * trip.rooms
      if (trip.travelers > capacity) {
        errors.travelers = { key: 'booking.errors.capacity', values: { count: capacity } }
      }
      if (room.rooms_available !== null && room.rooms_available !== undefined && room.rooms_available < trip.rooms) {
        errors.room = { key: 'booking.errors.notEnoughRooms', values: { count: room.rooms_available } }
      }
    }
  } else {
    const max = listing.max_group_size ?? 100
    if (!Number.isInteger(trip.travelers) || trip.travelers < 1 || trip.travelers > max) {
      errors.travelers = { key: 'booking.errors.travelersRange', values: { max } }
    }
  }

  return errors
}

export function estimateTotal(listing, trip, room) {
  if (listing.type === 'hotel') {
    const price = toNumber(room?.price_per_night)
    if (price === null) return null
    return price * trip.nights * trip.rooms
  }
  const price = toNumber(listing.price)
  return price === null ? null : price * trip.travelers
}
