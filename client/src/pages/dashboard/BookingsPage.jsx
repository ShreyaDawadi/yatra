import { useState } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAsync } from '../../hooks/useAsync'
import { bookingService } from '../../services/bookingService'
import { bookingGroup } from '../../utils/bookingStatus'
import Spinner from '../../components/common/Spinner'
import { EmptyState, ErrorState } from '../../components/common/StateMessage'
import BookingItem from '../../components/dashboard/BookingItem'

const TABS = ['upcoming', 'past', 'cancelled']

function BookingsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState('upcoming')
  const { data: bookings, error, reload } = useAsync(() => bookingService.mine(), [])

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!bookings) return <Spinner />

  const counts = Object.fromEntries(TABS.map((key) => [key, bookings.filter((booking) => bookingGroup(booking) === key).length]))
  let shown = bookings.filter((booking) => bookingGroup(booking) === tab)
  if (tab !== 'upcoming') shown = [...shown].reverse()

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">{t('dashboard.nav.bookings')}</h2>

      <div role="tablist" className="mt-4 flex gap-2 overflow-x-auto border-b border-charcoal/10">
        {TABS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium ${
              tab === key ? 'border-forest text-forest' : 'border-transparent text-charcoal/60 hover:text-charcoal'
            }`}
          >
            {t(`dashboard.bookings.tabs.${key}`)} ({counts[key]})
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4" role="tabpanel">
        {shown.length === 0 ? (
          <EmptyState
            title={t(`dashboard.bookings.empty.${tab}`)}
            action={tab === 'upcoming' ? <Link to="/explore" className="btn-primary">{t('nav.explore')}</Link> : null}
          />
        ) : (
          shown.map((booking) => <BookingItem key={booking.id} booking={booking} onChanged={reload} />)
        )}
      </div>
    </div>
  )
}

export default BookingsPage
