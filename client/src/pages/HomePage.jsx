import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, CalendarCheck, Clock, Languages, Leaf, MapPin, Mountain, Quote, Sun, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { listingService } from '../services/listingService'
import { reviewService } from '../services/reviewService'
import { useAsync } from '../hooks/useAsync'
import { useSavedListings } from '../hooks/useSavedListings'
import { DESTINATIONS } from '../utils/destinations'
import { firstName, localized, toNumber } from '../utils/format'
import HeroSearch from '../components/home/HeroSearch'
import NewsletterSection from '../components/home/NewsletterSection'
import MountainArt from '../components/common/MountainArt'
import SectionHeading from '../components/common/SectionHeading'
import Reveal from '../components/common/Reveal'
import { StarRow } from '../components/common/Rating'
import { ErrorState } from '../components/common/StateMessage'
import ListingGrid, { ListingGridSkeleton } from '../components/listings/ListingGrid'

function byRating(a, b) {
  const ratingA = toNumber(a.average_rating) ?? -1
  const ratingB = toNumber(b.average_rating) ?? -1
  return ratingB - ratingA || b.review_count - a.review_count || a.id - b.id
}

function byPopularity(a, b) {
  return b.booking_count - a.booking_count || byRating(a, b)
}

function Hero() {
  const { t } = useTranslation()
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <section className="relative isolate overflow-hidden bg-forest">
      {!photoFailed && (
        <img
          src="/images/hero.jpg"
          alt=""
          onError={() => setPhotoFailed(true)}
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        />
      )}
      <MountainArt withSun={photoFailed} className="absolute inset-x-0 bottom-0 -z-10 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/40 via-transparent to-forest/60" />

      <div className="container-page pb-20 pt-20 sm:pt-28 lg:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-gold"
        >
          {t('home.eyebrow')}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-3xl font-display text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl"
        >
          {t('home.heroTitle')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-xl text-lg text-cream/80"
        >
          {t('home.heroSubtitle')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-10 max-w-5xl"
        >
          <HeroSearch />
        </motion.div>
      </div>
    </section>
  )
}

function Destinations({ listings }) {
  const { t } = useTranslation()

  const counts = useMemo(() => {
    const map = {}
    for (const listing of listings ?? []) {
      map[listing.city] = (map[listing.city] ?? 0) + 1
    }
    return map
  }, [listings])

  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow={t('home.destinationsEyebrow')} title={t('home.destinationsTitle')} subtitle={t('home.destinationsSubtitle')} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((destination, index) => (
          <Reveal key={destination.key} delay={index * 0.05}>
            <Link
              to={`/explore?city=${encodeURIComponent(destination.city)}`}
              className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-lg bg-forest p-5 text-cream"
            >
              <MountainArt className="absolute inset-0 h-full w-full opacity-80 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative">
                <p className="font-display text-2xl">{t(`destinations.${destination.key}.name`)}</p>
                <p className="mt-1 text-sm text-cream/80">{t(`destinations.${destination.key}.text`)}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold">
                  {t('home.experienceCount', { count: counts[destination.city] ?? 0 })}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ListingSection({ eyebrow, title, subtitle, linkTo, listings, loading, error, onRetry, savedIds, onToggleSave, gridClass }) {
  const { t } = useTranslation()

  return (
    <section className="container-page py-16">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} linkTo={linkTo} linkLabel={t('common.viewAll')} />
      <div className="mt-10">
        {error && <ErrorState error={error} onRetry={onRetry} />}
        {!error && loading && !listings && <ListingGridSkeleton count={3} />}
        {!error && listings && (
          <ListingGrid listings={listings} savedIds={savedIds} onToggleSave={onToggleSave} className={gridClass} />
        )}
      </div>
    </section>
  )
}

function TrekRoutes({ treks }) {
  const { t, i18n } = useTranslation()
  if (!treks?.length) return null

  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <SectionHeading eyebrow={t('home.routesEyebrow')} title={t('home.routesTitle')} subtitle={t('home.routesSubtitle')} linkTo="/treks" linkLabel={t('common.viewAll')} />
        <ol className="mt-10 divide-y divide-charcoal/10 border-y border-charcoal/10">
          {treks.map((trek, index) => (
            <Reveal key={trek.id} delay={index * 0.04}>
              <li>
                <Link to={`/listings/${trek.id}`} className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 sm:grid-cols-[3rem_1.6fr_1fr_1fr_1fr_auto]">
                  <span className="font-display text-2xl text-gold">{String(index + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="block font-display text-xl text-charcoal group-hover:text-forest">{localized(trek, 'name', i18n.language)}</span>
                    <span className="text-sm text-charcoal/60">{trek.location_detail}</span>
                  </span>
                  <span className="hidden items-center gap-1.5 text-sm text-charcoal/70 sm:inline-flex">
                    <Clock className="h-4 w-4 text-mountain" aria-hidden="true" />
                    {t('card.days', { count: trek.duration_days })}
                  </span>
                  <span className="hidden items-center gap-1.5 text-sm text-charcoal/70 sm:inline-flex">
                    <Mountain className="h-4 w-4 text-mountain" aria-hidden="true" />
                    {t('card.altitude', { value: trek.max_altitude_m?.toLocaleString('en-US') })}
                  </span>
                  <span className="hidden items-center gap-1.5 text-sm text-charcoal/70 sm:inline-flex">
                    <TrendingUp className="h-4 w-4 text-mountain" aria-hidden="true" />
                    {trek.difficulty ? t(`difficulty.${trek.difficulty}`) : ''}
                  </span>
                  <ArrowRight className="h-5 w-5 text-charcoal/40 transition-transform group-hover:translate-x-1 group-hover:text-forest" aria-hidden="true" />
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

function WhyYatra() {
  const { t } = useTranslation()
  const items = [
    { key: 'local', icon: MapPin },
    { key: 'pricing', icon: BadgeCheck },
    { key: 'flexible', icon: CalendarCheck },
    { key: 'bilingual', icon: Languages },
  ]

  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow={t('why.eyebrow')} title={t('why.title')} align="center" />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, icon: Icon }, index) => (
          <Reveal key={key} delay={index * 0.08}>
            <div className="border-t-2 border-gold pt-5">
              <Icon className="h-6 w-6 text-forest" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl text-charcoal">{t(`why.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{t(`why.${key}.text`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Testimonials() {
  const { t, i18n } = useTranslation()
  const { data: reviews } = useAsync(() => reviewService.recent(), [])

  if (!reviews?.length) return null

  return (
    <section className="bg-white py-20">
      <div className="container-page">
        <SectionHeading eyebrow={t('home.testimonialsEyebrow')} title={t('home.testimonialsTitle')} subtitle={t('home.testimonialsSubtitle')} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 0.06}>
              <figure className="flex h-full flex-col rounded-lg bg-cream p-6">
                <Quote className="h-6 w-6 text-gold" aria-hidden="true" />
                <StarRow value={review.rating} className="mt-3" />
                <blockquote className="mt-3 flex-1 text-charcoal/80">“{review.comment}”</blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold text-charcoal">{firstName(review.user_name)}</span>
                  <span className="text-charcoal/60"> · </span>
                  <Link to={`/listings/${review.listing_id}`} className="text-mountain hover:underline">
                    {localized({ name: review.listing_name, name_np: review.listing_name_np }, 'name', i18n.language)}
                  </Link>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Inspiration() {
  const { t } = useTranslation()
  const items = [
    { key: 'seasons', icon: Sun, linkTo: '/treks' },
    { key: 'altitude', icon: Mountain, linkTo: '/treks?sort=duration' },
    { key: 'culture', icon: Leaf, linkTo: '/tours' },
  ]

  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow={t('inspiration.eyebrow')} title={t('inspiration.title')} />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map(({ key, icon: Icon, linkTo }, index) => (
          <Reveal key={key} delay={index * 0.08}>
            <article className="flex h-full flex-col rounded-lg bg-white p-6 ring-1 ring-charcoal/5">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-forest/5">
                <Icon className="h-5 w-5 text-forest" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl text-charcoal">{t(`inspiration.${key}.title`)}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">{t(`inspiration.${key}.text`)}</p>
              <Link to={linkTo} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-mountain">
                {t(`inspiration.${key}.link`)}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function HomePage() {
  const { t } = useTranslation()
  const { data: listings, loading, error, reload } = useAsync(() => listingService.list({}), [])
  const { savedIds, toggle } = useSavedListings()

  const sections = useMemo(() => {
    if (!listings) return null
    const ofType = (type) => listings.filter((listing) => listing.type === type)
    return {
      treks: [...ofType('trek')].sort(byRating).slice(0, 3),
      hotels: [...ofType('hotel')].sort(byRating).slice(0, 3),
      tours: [...ofType('sightseeing')].sort(byPopularity).slice(0, 4),
      routes: [...ofType('trek')].sort(byPopularity),
    }
  }, [listings])

  const shared = { loading, error, onRetry: reload, savedIds, onToggleSave: toggle }

  return (
    <>
      <Hero />
      <Destinations listings={listings} />
      <ListingSection
        {...shared}
        eyebrow={t('typesPlural.trek')}
        title={t('home.featuredTreks')}
        subtitle={t('home.featuredTreksSubtitle')}
        linkTo="/treks"
        listings={sections?.treks}
      />
      <ListingSection
        {...shared}
        eyebrow={t('typesPlural.hotel')}
        title={t('home.recommendedHotels')}
        subtitle={t('home.recommendedHotelsSubtitle')}
        linkTo="/hotels"
        listings={sections?.hotels}
      />
      <ListingSection
        {...shared}
        eyebrow={t('typesPlural.sightseeing')}
        title={t('home.popularTours')}
        subtitle={t('home.popularToursSubtitle')}
        linkTo="/tours"
        listings={sections?.tours}
        gridClass="sm:grid-cols-2 xl:grid-cols-4"
      />
      <TrekRoutes treks={sections?.routes} />
      <WhyYatra />
      <Testimonials />
      <Inspiration />
      <NewsletterSection />
    </>
  )
}

export default HomePage
