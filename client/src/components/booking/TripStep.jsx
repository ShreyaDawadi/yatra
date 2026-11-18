import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { formatPrice, localized, todayInNepal } from '../../utils/format'
import { clampInt, validateTrip } from '../../utils/booking'
import FormField from '../forms/FormField'
import Spinner from '../common/Spinner'

function TripStep({ listing, trip, onChange, rooms, onNext }) {
  const { t, i18n } = useTranslation()
  const [showErrors, setShowErrors] = useState(false)
  const isHotel = listing.type === 'hotel'
  const selectedRoom = rooms?.find((room) => room.id === trip.roomTypeId) ?? null
  const errors = validateTrip(listing, trip, selectedRoom)

  function errorFor(field) {
    if (!showErrors || !errors[field]) return null
    return t(errors[field].key, errors[field].values)
  }

  function update(field, value) {
    onChange({ ...trip, [field]: value })
  }

  function handleNext(event) {
    event.preventDefault()
    if (Object.keys(errors).length > 0) {
      setShowErrors(true)
      return
    }
    onNext()
  }

  return (
    <form onSubmit={handleNext} noValidate className="space-y-6">
      <h2 className="font-display text-2xl text-charcoal">{t('booking.tripTitle')}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="trip-date" label={isHotel ? t('booking.checkIn') : t('booking.date')} error={errorFor('date')}>
          <input id="trip-date" type="date" min={todayInNepal()} value={trip.date} onChange={(event) => update('date', event.target.value)} className="field-input" />
        </FormField>

        {isHotel && (
          <FormField id="trip-nights" label={t('booking.nights')} error={errorFor('nights')}>
            <input id="trip-nights" type="number" min={1} max={30} value={trip.nights} onChange={(event) => update('nights', clampInt(event.target.value, 1, 30, 1))} className="field-input" />
          </FormField>
        )}

        <FormField id="trip-travelers" label={isHotel ? t('booking.guests') : t('booking.travelers')} error={errorFor('travelers')}>
          <input id="trip-travelers" type="number" min={1} max={isHotel ? 40 : listing.max_group_size ?? 100} value={trip.travelers} onChange={(event) => update('travelers', clampInt(event.target.value, 1, 100, 1))} className="field-input" />
        </FormField>

        {isHotel && (
          <FormField id="trip-rooms" label={t('booking.rooms')} error={errorFor('rooms')}>
            <input id="trip-rooms" type="number" min={1} max={10} value={trip.rooms} onChange={(event) => update('rooms', clampInt(event.target.value, 1, 10, 1))} className="field-input" />
          </FormField>
        )}
      </div>

      {isHotel && (
        <fieldset>
          <legend className="field-label">{t('booking.chooseRoom')}</legend>
          {!rooms && <Spinner />}
          <div className="space-y-3">
            {rooms?.map((room) => {
              const available = room.rooms_available
              const unavailable = available !== null && available !== undefined && available < trip.rooms
              return (
                <label
                  key={room.id}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded-md p-4 ring-1 transition-colors ${
                    trip.roomTypeId === room.id ? 'bg-forest/5 ring-2 ring-forest' : 'bg-white ring-charcoal/10 hover:ring-charcoal/30'
                  } ${unavailable ? 'opacity-60' : ''}`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="room"
                      value={room.id}
                      checked={trip.roomTypeId === room.id}
                      onChange={() => update('roomTypeId', room.id)}
                      className="accent-forest"
                    />
                    <span>
                      <span className="block font-medium text-charcoal">{localized(room, 'name', i18n.language)}</span>
                      <span className="text-sm text-charcoal/60">
                        {t('detail.maxGuests', { count: room.max_guests })}
                        {available !== null && available !== undefined && ` · ${unavailable ? t('detail.soldOut') : t('detail.roomsLeft', { count: available })}`}
                      </span>
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block font-semibold">{formatPrice(room.price_per_night)}</span>
                    <span className="text-xs text-charcoal/60">{t('card.perNight')}</span>
                  </span>
                </label>
              )
            })}
          </div>
          {errorFor('room') && <p className="field-error">{errorFor('room')}</p>}
        </fieldset>
      )}

      <div className="flex justify-end">
        <button type="submit" className="btn-primary px-8">{t('booking.next')}</button>
      </div>
    </form>
  )
}

export default TripStep
