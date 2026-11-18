import { Check, Clock, MapPin, Mountain, Star, Sun, TrendingUp, Users, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { localized } from '../../utils/format'

export function DetailSection({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-charcoal/10 py-8">
      <h2 className="font-display text-2xl text-charcoal">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function FactsGrid({ listing }) {
  const { t, i18n } = useTranslation()
  const facts = []

  if (listing.duration_days && listing.type === 'trek') {
    facts.push({ icon: Clock, label: t('detail.duration'), value: t('card.days', { count: listing.duration_days }) })
  }
  if (listing.type === 'sightseeing') {
    facts.push({ icon: Clock, label: t('detail.duration'), value: t('card.dayTour') })
  }
  if (listing.difficulty) {
    facts.push({ icon: TrendingUp, label: t('detail.difficulty'), value: t(`difficulty.${listing.difficulty}`) })
  }
  if (listing.max_altitude_m) {
    facts.push({ icon: Mountain, label: t('detail.maxAltitude'), value: t('card.altitude', { value: listing.max_altitude_m.toLocaleString('en-US') }) })
  }
  if (listing.best_season) {
    facts.push({ icon: Sun, label: t('detail.bestSeason'), value: localized(listing, 'best_season', i18n.language) })
  }
  if (listing.star_rating) {
    facts.push({ icon: Star, label: t('detail.starRating'), value: t('card.stars', { count: listing.star_rating }) })
  }
  if (listing.max_group_size) {
    facts.push({ icon: Users, label: t('detail.groupSize'), value: t('detail.upToPeople', { count: listing.max_group_size }) })
  }
  if (listing.location_detail) {
    facts.push({ icon: MapPin, label: t('detail.location'), value: listing.location_detail })
  }

  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="rounded-md bg-white p-4 ring-1 ring-charcoal/5">
          <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal/60">
            <Icon className="h-3.5 w-3.5 text-mountain" aria-hidden="true" />
            {label}
          </dt>
          <dd className="mt-1.5 font-medium text-charcoal">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Itinerary({ days }) {
  const { t } = useTranslation()

  return (
    <ol className="relative space-y-5 border-l-2 border-gold/50 pl-6">
      {days.map((item) => (
        <li key={item.day} className="relative">
          <span className="absolute -left-[33px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold ring-4 ring-cream" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-wider text-mountain">{t('detail.day', { day: item.day })}</p>
          <p className="mt-0.5 text-charcoal">{item.title}</p>
        </li>
      ))}
    </ol>
  )
}

export function IncludedExcluded({ included, excluded }) {
  const { t } = useTranslation()

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {included?.length > 0 && (
        <div>
          <p className="font-semibold text-charcoal">{t('detail.included')}</p>
          <ul className="mt-3 space-y-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-charcoal/80">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-mountain" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {excluded?.length > 0 && (
        <div>
          <p className="font-semibold text-charcoal">{t('detail.excluded')}</p>
          <ul className="mt-3 space-y-2">
            {excluded.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-charcoal/80">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-red-700/70" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function Amenities({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-white px-3 py-1.5 text-sm text-charcoal/80 ring-1 ring-charcoal/10">
          {item}
        </li>
      ))}
    </ul>
  )
}
