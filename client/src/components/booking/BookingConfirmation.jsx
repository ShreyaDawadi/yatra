import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { addDays, formatDate, formatPrice, localized } from '../../utils/format'

function BookingConfirmation({ booking, listing }) {
  const { t, i18n } = useTranslation()
  const language = i18n.language

  return (
    <div className="text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <CheckCircle2 className="mx-auto h-16 w-16 text-mountain" aria-hidden="true" />
      </motion.div>
      <h2 className="mt-4 font-display text-3xl text-charcoal">{t('booking.successTitle')}</h2>
      <p className="mx-auto mt-2 max-w-md text-charcoal/70">
        {t('booking.successText', { status: t(`status.${booking.status}`) })}
      </p>

      <dl className="mx-auto mt-8 max-w-md divide-y divide-charcoal/10 rounded-lg bg-cream p-5 text-left text-sm">
        <div className="flex justify-between py-2">
          <dt className="text-charcoal/60">{t('booking.reference')}</dt>
          <dd className="font-semibold">#{booking.id}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-charcoal/60">{t(`types.${listing.type}`)}</dt>
          <dd className="font-medium">{localized(listing, 'name', language)}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-charcoal/60">{booking.nights ? t('booking.checkIn') : t('booking.date')}</dt>
          <dd className="font-medium">{formatDate(booking.booking_date, language)}</dd>
        </div>
        {booking.nights && (
          <div className="flex justify-between py-2">
            <dt className="text-charcoal/60">{t('booking.checkOut')}</dt>
            <dd className="font-medium">{formatDate(addDays(booking.booking_date, booking.nights), language)}</dd>
          </div>
        )}
        <div className="flex justify-between py-2">
          <dt className="text-charcoal/60">{t('booking.status')}</dt>
          <dd className="font-medium">{t(`status.${booking.status}`)}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="font-semibold">{t('booking.total')}</dt>
          <dd className="font-display text-xl">{formatPrice(booking.total_price)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/dashboard/bookings" className="btn-primary">{t('booking.viewBookings')}</Link>
        <Link to={`/listings/${listing.id}`} className="btn-secondary">{t('booking.backToListing')}</Link>
      </div>
    </div>
  )
}

export default BookingConfirmation
