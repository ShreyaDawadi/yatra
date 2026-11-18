import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CalendarDays, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatPrice, todayInNepal } from '../../utils/format'
import { clampInt, estimateTotal } from '../../utils/booking'

export function TripSidebar({ listing, initialDate, initialTravelers }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const max = listing.max_group_size ?? 100
  const [date, setDate] = useState(initialDate)
  const [travelers, setTravelers] = useState(clampInt(initialTravelers, 1, max, 2))
  const total = estimateTotal(listing, { travelers }, null)

  function handleSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams({ travelers: String(travelers) })
    if (date) params.set('date', date)
    navigate(`/book/${listing.id}?${params}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
      <p>
        <span className="font-display text-3xl text-charcoal">{formatPrice(listing.price)}</span>
        <span className="ml-1 text-sm text-charcoal/60">{t('card.perPerson')}</span>
      </p>

      <label className="block">
        <span className="field-label flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-mountain" aria-hidden="true" />
          {t('booking.date')}
        </span>
        <input type="date" min={todayInNepal()} value={date} onChange={(event) => setDate(event.target.value)} className="field-input" />
      </label>

      <label className="block">
        <span className="field-label flex items-center gap-1.5">
          <Users className="h-4 w-4 text-mountain" aria-hidden="true" />
          {t('booking.travelers')}
        </span>
        <input
          type="number"
          min={1}
          max={max}
          value={travelers}
          onChange={(event) => setTravelers(clampInt(event.target.value, 1, max, 1))}
          className="field-input"
        />
      </label>

      <div className="flex items-center justify-between border-t border-charcoal/10 pt-4">
        <span className="text-sm text-charcoal/70">{t('booking.estimatedTotal')}</span>
        <span className="text-lg font-semibold">{formatPrice(total)}</span>
      </div>
      <p className="text-xs text-charcoal/60">{t('booking.serverNote')}</p>

      <button type="submit" className="btn-primary w-full py-3">
        {t('detail.continueToBooking')}
      </button>
    </form>
  )
}

export function HotelSidebar({ listing, stay, onStayChange, nights }) {
  const { t } = useTranslation()

  function update(field, value) {
    onStayChange({ ...stay, [field]: value })
  }

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-charcoal/5">
      <p>
        <span className="mr-1 text-sm text-charcoal/60">{t('card.from')}</span>
        <span className="font-display text-3xl text-charcoal">{formatPrice(listing.price)}</span>
        <span className="ml-1 text-sm text-charcoal/60">{t('card.perNight')}</span>
      </p>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="field-label">{t('booking.checkIn')}</span>
          <input type="date" min={todayInNepal()} value={stay.checkIn} onChange={(event) => update('checkIn', event.target.value)} className="field-input px-2" />
        </label>
        <label className="block">
          <span className="field-label">{t('booking.checkOut')}</span>
          <input type="date" min={stay.checkIn || todayInNepal()} value={stay.checkOut} onChange={(event) => update('checkOut', event.target.value)} className="field-input px-2" />
        </label>
        <label className="block">
          <span className="field-label">{t('booking.guests')}</span>
          <input type="number" min={1} max={40} value={stay.guests} onChange={(event) => update('guests', clampInt(event.target.value, 1, 40, 1))} className="field-input" />
        </label>
        <label className="block">
          <span className="field-label">{t('booking.rooms')}</span>
          <input type="number" min={1} max={10} value={stay.rooms} onChange={(event) => update('rooms', clampInt(event.target.value, 1, 10, 1))} className="field-input" />
        </label>
      </div>

      {stay.checkIn && stay.checkOut && !nights && <p className="field-error">{t('detail.invalidDates')}</p>}
      {nights && <p className="text-sm text-charcoal/70">{t('booking.nightsCount', { count: nights })}</p>}

      <a href="#rooms" className="btn-primary w-full py-3">
        {t('detail.seeRooms')}
      </a>
    </div>
  )
}
