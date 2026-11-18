import { todayInNepal } from './format'

export function bookingGroup(booking) {
  if (booking.status === 'cancelled') return 'cancelled'
  return booking.booking_date >= todayInNepal() ? 'upcoming' : 'past'
}

export const STATUS_STYLES = {
  pending: 'bg-gold/20 text-charcoal',
  confirmed: 'bg-mountain/15 text-forest',
  cancelled: 'bg-charcoal/10 text-charcoal/60',
}
