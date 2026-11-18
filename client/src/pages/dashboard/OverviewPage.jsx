import { Link } from 'react-router'
import { ArrowRight, CalendarCheck, Heart, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAsync } from '../../hooks/useAsync'
import { bookingService } from '../../services/bookingService'
import { savedService } from '../../services/savedService'
import { reviewService } from '../../services/reviewService'
import { bookingGroup } from '../../utils/bookingStatus'
import Spinner from '../../components/common/Spinner'
import { EmptyState, ErrorState } from '../../components/common/StateMessage'
import BookingItem from '../../components/dashboard/BookingItem'

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <Link to={to} className="group rounded-lg bg-white p-5 ring-1 ring-charcoal/5 transition-shadow hover:shadow-md">
      <Icon className="h-5 w-5 text-mountain" aria-hidden="true" />
      <p className="mt-3 font-display text-3xl text-charcoal">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-charcoal/70">
        {label}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </p>
    </Link>
  )
}

function OverviewPage() {
  const { t } = useTranslation()
  const { data, error, reload } = useAsync(
    () => Promise.all([bookingService.mine(), savedService.list(), reviewService.mine()]),
    [],
  )

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!data) return <Spinner />

  const [bookings, saved, reviews] = data
  const upcoming = bookings.filter((booking) => bookingGroup(booking) === 'upcoming')
  const nextTrip = upcoming[0]

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarCheck} label={t('dashboard.overview.upcoming')} value={upcoming.length} to="/dashboard/bookings" />
        <StatCard icon={Heart} label={t('dashboard.overview.saved')} value={saved.length} to="/dashboard/saved" />
        <StatCard icon={MessageSquare} label={t('dashboard.overview.reviews')} value={reviews.length} to="/dashboard/reviews" />
      </div>

      <section>
        <h2 className="font-display text-2xl text-charcoal">{t('dashboard.overview.nextTrip')}</h2>
        <div className="mt-4">
          {nextTrip ? (
            <BookingItem booking={nextTrip} onChanged={reload} />
          ) : (
            <EmptyState
              title={t('dashboard.overview.noTrips')}
              text={t('dashboard.overview.noTripsText')}
              action={<Link to="/explore" className="btn-primary">{t('nav.explore')}</Link>}
            />
          )}
        </div>
      </section>
    </div>
  )
}

export default OverviewPage
