import { BedDouble, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { listingService } from '../../services/listingService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice, localized } from '../../utils/format'
import Spinner from '../common/Spinner'
import { ErrorState } from '../common/StateMessage'

function RoomsSection({ listingId, checkIn, nights, guests, rooms, onReserve }) {
  const { t, i18n } = useTranslation()
  const hasDates = Boolean(checkIn && nights)

  const roomTypes = useAsync(
    () => listingService.rooms(listingId, hasDates ? { check_in: checkIn, nights } : {}),
    [listingId, checkIn, nights, hasDates],
  )

  if (roomTypes.error) {
    return <ErrorState error={roomTypes.error} onRetry={roomTypes.reload} />
  }

  if (!roomTypes.data) {
    return <Spinner />
  }

  return (
    <div className="space-y-4">
      {!hasDates && <p className="text-sm text-charcoal/70">{t('detail.pickDates')}</p>}

      {roomTypes.data.map((room) => {
        const capacity = room.max_guests * rooms
        const available = room.rooms_available
        const soldOut = hasDates && available !== null && available < rooms
        const tooManyGuests = guests > capacity
        const canReserve = hasDates && !soldOut && !tooManyGuests

        return (
          <article key={room.id} className="flex flex-col gap-4 rounded-lg bg-white p-5 ring-1 ring-charcoal/5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-display text-xl text-charcoal">
                <BedDouble className="h-5 w-5 text-mountain" aria-hidden="true" />
                {localized(room, 'name', i18n.language)}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-charcoal/70">
                <Users className="h-4 w-4" aria-hidden="true" />
                {t('detail.maxGuests', { count: room.max_guests })}
              </p>
              {hasDates && available !== null && (
                <p className={`mt-1 text-sm font-medium ${soldOut ? 'text-red-700' : 'text-mountain'}`}>
                  {soldOut ? t('detail.soldOut') : t('detail.roomsLeft', { count: available })}
                </p>
              )}
              {tooManyGuests && <p className="mt-1 text-sm text-red-700">{t('booking.errors.capacity', { count: capacity })}</p>}
            </div>

            <div className="flex items-center gap-4 sm:flex-col sm:items-end">
              <p>
                <span className="text-lg font-semibold">{formatPrice(room.price_per_night)}</span>
                <span className="ml-1 text-sm text-charcoal/60">{t('card.perNight')}</span>
              </p>
              <button type="button" disabled={!canReserve} onClick={() => onReserve(room)} className="btn-primary">
                {t('detail.reserve')}
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default RoomsSection
