import { Star } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toNumber } from '../../utils/format'

export function RatingSummary({ rating, count, className = '' }) {
  const { t } = useTranslation()
  const value = toNumber(rating)

  if (value === null) {
    return <span className={`text-sm text-charcoal/50 ${className}`}>{t('card.noReviews')}</span>
  }

  return (
    <span className={`inline-flex items-center gap-1 text-sm text-charcoal/80 ${className}`}>
      <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
      <span className="font-semibold">{value.toFixed(1)}</span>
      <span className="text-charcoal/50">({t('card.reviewCount', { count })})</span>
    </span>
  )
}

export function StarRow({ value, size = 'h-4 w-4', className = '' }) {
  const { t } = useTranslation()
  const rounded = Math.round(toNumber(value) ?? 0)

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={t('card.starsOutOfFive', { count: rounded })}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${star <= rounded ? 'fill-gold text-gold' : 'text-charcoal/20'}`}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}
