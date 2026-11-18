import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { listingService } from '../services/listingService'
import { useAsync } from '../hooks/useAsync'
import { useSavedListings } from '../hooks/useSavedListings'
import { addDays, localized } from '../utils/format'
import { clampInt, isDateString, nightsBetween } from '../utils/booking'
import { typeMeta } from '../utils/listingTypes'
import PageTransition from '../components/layout/PageTransition'
import Spinner from '../components/common/Spinner'
import { EmptyState, ErrorState } from '../components/common/StateMessage'
import { RatingSummary } from '../components/common/Rating'
import SaveButton from '../components/listings/SaveButton'
import Gallery from '../components/detail/Gallery'
import { Amenities, DetailSection, FactsGrid, IncludedExcluded, Itinerary } from '../components/detail/DetailSections'
import RoomsSection from '../components/detail/RoomsSection'
import { HotelSidebar, TripSidebar } from '../components/detail/BookingSidebar'
import ReviewsSection from '../components/detail/ReviewsSection'
import LocationMap from '../components/maps/LocationMap'

function ListingDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { savedIds, toggle } = useSavedListings()

  const listingState = useAsync(() => listingService.get(id), [id])
  const listing = listingState.data && String(listingState.data.id) === String(id) ? listingState.data : null

  const initialDate = isDateString(searchParams.get('date')) ? searchParams.get('date') : ''
  const [stay, setStay] = useState(() => ({
    checkIn: initialDate,
    checkOut: initialDate ? addDays(initialDate, 1) : '',
    guests: clampInt(searchParams.get('travelers'), 1, 40, 2),
    rooms: 1,
  }))
  const nights = nightsBetween(stay.checkIn, stay.checkOut)

  if (listingState.error) {
    const notFound = [400, 404].includes(listingState.error.status)
    return (
      <PageTransition className="container-page py-16">
        {notFound ? (
          <EmptyState
            title={t('detail.notFound')}
            action={<Link to="/explore" className="btn-secondary">{t('nav.explore')}</Link>}
          />
        ) : (
          <ErrorState error={listingState.error} onRetry={listingState.reload} />
        )}
      </PageTransition>
    )
  }

  if (!listing) {
    return <Spinner fullPage />
  }

  const language = i18n.language
  const name = localized(listing, 'name', language)
  const description = localized(listing, 'description', language)
  const isHotel = listing.type === 'hotel'
  const hasIncluded = listing.included?.length > 0 || listing.excluded?.length > 0

  function handleReserve(room) {
    const params = new URLSearchParams({
      room: String(room.id),
      check_in: stay.checkIn,
      nights: String(nights),
      rooms: String(stay.rooms),
      travelers: String(stay.guests),
    })
    navigate(`/book/${listing.id}?${params}`)
  }

  return (
    <PageTransition>
      <div className="container-page py-8">
        <Link to={typeMeta(listing.type).path} className="inline-flex items-center gap-1 text-sm text-charcoal/70 hover:text-forest">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t(`typesPlural.${listing.type}`)}
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mountain">
              {t(`types.${listing.type}`)} · {listing.city}
            </p>
            <h1 className="mt-2 font-display text-4xl text-charcoal sm:text-5xl">{name}</h1>
            {language === 'en' && listing.name_np && <p className="mt-1 text-charcoal/60">{listing.name_np}</p>}
            <RatingSummary rating={listing.average_rating} count={listing.review_count} className="mt-3" />
          </div>
          <SaveButton saved={savedIds.has(listing.id)} onClick={() => toggle(listing.id)} className="ring-1 ring-charcoal/10" />
        </div>

        <div className="mt-6">
          <Gallery listing={listing} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <aside className="lg:order-last">
            <div className="lg:sticky lg:top-24">
              {isHotel ? (
                <HotelSidebar listing={listing} stay={stay} onStayChange={setStay} nights={nights} />
              ) : (
                <TripSidebar key={listing.id} listing={listing} initialDate={initialDate} initialTravelers={searchParams.get('travelers')} />
              )}
            </div>
          </aside>

          <div>
            <DetailSection id="overview" title={t('detail.overview')}>
              {description && <p className="leading-relaxed text-charcoal/80">{description}</p>}
              <div className="mt-6">
                <FactsGrid listing={listing} />
              </div>
            </DetailSection>

            {isHotel && listing.amenities?.length > 0 && (
              <DetailSection id="amenities" title={t('detail.amenities')}>
                <Amenities items={listing.amenities} />
              </DetailSection>
            )}

            {isHotel && (
              <DetailSection id="rooms" title={t('detail.rooms')}>
                <RoomsSection
                  listingId={listing.id}
                  checkIn={nights ? stay.checkIn : ''}
                  nights={nights}
                  guests={stay.guests}
                  rooms={stay.rooms}
                  onReserve={handleReserve}
                />
              </DetailSection>
            )}

            {listing.itinerary?.length > 0 && (
              <DetailSection id="itinerary" title={t('detail.itinerary')}>
                <Itinerary days={listing.itinerary} />
              </DetailSection>
            )}

            {hasIncluded && (
              <DetailSection id="included" title={t('detail.whatsIncluded')}>
                <IncludedExcluded included={listing.included} excluded={listing.excluded} />
              </DetailSection>
            )}

            <DetailSection id="map" title={listing.route?.length > 1 ? t('detail.routeMap') : t('detail.location')}>
              <LocationMap latitude={listing.latitude} longitude={listing.longitude} route={listing.route} label={name} />
            </DetailSection>

            <DetailSection id="reviews" title={t('reviews.title')}>
              <ReviewsSection listing={listing} onChanged={listingState.reload} />
            </DetailSection>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default ListingDetailPage
