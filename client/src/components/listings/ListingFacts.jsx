import { Clock, MapPin, Star, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function Fact({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-mountain" aria-hidden="true" />
      {children}
    </span>
  )
}

function ListingFacts({ listing, className = '' }) {
  const { t } = useTranslation()

  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-charcoal/70 ${className}`}>
      {listing.type === 'trek' && (
        <>
          {listing.duration_days && <Fact icon={Clock}>{t('card.days', { count: listing.duration_days })}</Fact>}
          {listing.difficulty && <Fact icon={TrendingUp}>{t(`difficulty.${listing.difficulty}`)}</Fact>}
          {listing.max_altitude_m && <Fact icon={MapPin}>{t('card.altitude', { value: listing.max_altitude_m.toLocaleString('en-US') })}</Fact>}
        </>
      )}

      {listing.type === 'hotel' && (
        <>
          {listing.star_rating && <Fact icon={Star}>{t('card.stars', { count: listing.star_rating })}</Fact>}
          {listing.location_detail && <Fact icon={MapPin}>{listing.location_detail}</Fact>}
        </>
      )}

      {listing.type === 'sightseeing' && (
        <>
          <Fact icon={Clock}>{t('card.dayTour')}</Fact>
          {listing.location_detail && <Fact icon={MapPin}>{listing.location_detail}</Fact>}
        </>
      )}
    </div>
  )
}

export default ListingFacts
