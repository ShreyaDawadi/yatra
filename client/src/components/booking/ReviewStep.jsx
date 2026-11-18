import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { addDays, formatDate, formatPrice, localized } from '../../utils/format'
import { estimateTotal } from '../../utils/booking'
import FormAlert from '../forms/FormAlert'

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-charcoal/60">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  )
}

function ReviewStep({ listing, trip, room, guest, submitting, error, onBack, onConfirm }) {
  const { t, i18n } = useTranslation()
  const language = i18n.language
  const isHotel = listing.type === 'hotel'
  const total = estimateTotal(listing, trip, room)

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-charcoal">{t('booking.reviewTitle')}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg bg-cream p-5">
          <h3 className="font-semibold text-charcoal">{t('booking.summary')}</h3>
          <dl className="mt-2 divide-y divide-charcoal/10">
            <Row label={t(`types.${listing.type}`)} value={localized(listing, 'name', language)} />
            {isHotel ? (
              <>
                <Row label={t('booking.room')} value={localized(room, 'name', language)} />
                <Row label={t('booking.checkIn')} value={formatDate(trip.date, language)} />
                <Row label={t('booking.checkOut')} value={formatDate(addDays(trip.date, trip.nights), language)} />
                <Row label={t('booking.guests')} value={trip.travelers} />
              </>
            ) : (
              <>
                <Row label={t('booking.date')} value={formatDate(trip.date, language)} />
                <Row label={t('booking.travelers')} value={trip.travelers} />
              </>
            )}
            <Row label={t('booking.guestName')} value={guest.guest_name} />
            <Row label={t('booking.guestEmail')} value={guest.guest_email} />
            {guest.guest_phone && <Row label={t('booking.guestPhone')} value={guest.guest_phone} />}
          </dl>
          {guest.special_requests && (
            <p className="mt-3 text-sm text-charcoal/70">
              <span className="font-medium text-charcoal">{t('booking.specialRequests')}:</span> {guest.special_requests}
            </p>
          )}
        </section>

        <section className="rounded-lg bg-white p-5 ring-1 ring-charcoal/10">
          <h3 className="font-semibold text-charcoal">{t('booking.priceBreakdown')}</h3>
          <dl className="mt-2 divide-y divide-charcoal/10">
            {isHotel ? (
              <>
                <Row label={t('booking.pricePerNight')} value={formatPrice(room?.price_per_night)} />
                <Row label={t('booking.nights')} value={`× ${trip.nights}`} />
                <Row label={t('booking.rooms')} value={`× ${trip.rooms}`} />
              </>
            ) : (
              <>
                <Row label={t('booking.pricePerPerson')} value={formatPrice(listing.price)} />
                <Row label={t('booking.travelers')} value={`× ${trip.travelers}`} />
              </>
            )}
          </dl>
          <div className="mt-3 flex items-center justify-between border-t-2 border-charcoal pt-3">
            <span className="font-semibold">{t('booking.estimatedTotal')}</span>
            <span className="font-display text-2xl">{formatPrice(total)}</span>
          </div>
          <p className="mt-2 text-xs text-charcoal/60">{t('booking.serverNote')}</p>
        </section>
      </div>

      <p className="flex items-start gap-2 rounded-md bg-gold/15 p-3 text-sm text-charcoal/80">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {t('booking.noPayment')}
      </p>

      <FormAlert>{error}</FormAlert>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} disabled={submitting} className="btn-secondary">{t('booking.back')}</button>
        <button type="button" onClick={onConfirm} disabled={submitting} className="btn-primary px-8">
          {submitting ? t('booking.confirming') : t('booking.confirm')}
        </button>
      </div>
    </div>
  )
}

export default ReviewStep
