import { useState } from 'react'
import { Link } from 'react-router'
import { CalendarDays, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { bookingService } from '../../services/bookingService'
import { addDays, formatDate, formatPrice, localized } from '../../utils/format'
import { bookingGroup, STATUS_STYLES } from '../../utils/bookingStatus'
import ListingImage from '../listings/ListingImage'

function BookingItem({ booking, onChanged }) {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const canCancel = bookingGroup(booking) === 'upcoming'

  const listing = {
    id: booking.listing_id,
    type: booking.listing_type,
    name: booking.listing_name,
    name_np: booking.listing_name_np,
    image_url: booking.listing_image_url,
  }

  async function handleCancel() {
    setBusy(true)
    setError('')
    try {
      await bookingService.cancel(booking.id)
      onChanged()
    } catch (cancelError) {
      setError(cancelError.message)
      setBusy(false)
    }
  }

  return (
    <article className="flex flex-col overflow-hidden rounded-lg bg-white ring-1 ring-charcoal/5 sm:flex-row">
      <Link to={`/listings/${booking.listing_id}`} className="aspect-[16/9] shrink-0 sm:aspect-auto sm:w-48">
        <ListingImage listing={listing} />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-mountain">
              {t(`types.${booking.listing_type}`)} · {booking.listing_city} · #{booking.id}
            </p>
            <Link to={`/listings/${booking.listing_id}`} className="font-display text-xl text-charcoal hover:text-forest">
              {localized(listing, 'name', language)}
            </Link>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending}`}>
            {t(`status.${booking.status}`)}
          </span>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-charcoal/70">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-mountain" aria-hidden="true" />
            {formatDate(booking.booking_date, language)}
            {booking.nights && ` → ${formatDate(addDays(booking.booking_date, booking.nights), language)}`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-4 w-4 text-mountain" aria-hidden="true" />
            {booking.nights
              ? t('dashboard.bookings.guestsRooms', { guests: booking.number_of_people, rooms: booking.rooms })
              : t('dashboard.bookings.people', { count: booking.number_of_people })}
          </span>
          {booking.room_type_name && <span>{localized(booking, 'room_type_name', language)}</span>}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <p>
            <span className="text-sm text-charcoal/60">{t('booking.total')} </span>
            <span className="text-lg font-semibold">{formatPrice(booking.total_price)}</span>
          </p>

          {canCancel && (
            <div className="flex items-center gap-3 text-sm">
              {confirming ? (
                <>
                  <span className="text-charcoal/70">{t('dashboard.bookings.confirmCancel')}</span>
                  <button type="button" disabled={busy} onClick={handleCancel} className="font-semibold text-red-700 hover:underline">
                    {t('dashboard.bookings.yesCancel')}
                  </button>
                  <button type="button" disabled={busy} onClick={() => setConfirming(false)} className="text-charcoal/70 hover:underline">
                    {t('dashboard.bookings.keep')}
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirming(true)} className="font-medium text-red-700 hover:underline">
                  {t('dashboard.bookings.cancel')}
                </button>
              )}
            </div>
          )}
        </div>
        {error && <p className="field-error">{error}</p>}
      </div>
    </article>
  )
}

export default BookingItem
