import { useState } from 'react'
import { Link } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAsync } from '../../hooks/useAsync'
import { reviewService } from '../../services/reviewService'
import { formatDate, localized } from '../../utils/format'
import Spinner from '../../components/common/Spinner'
import { EmptyState, ErrorState } from '../../components/common/StateMessage'
import { StarRow } from '../../components/common/Rating'

function MyReviewItem({ review, onChanged }) {
  const { t, i18n } = useTranslation()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    try {
      await reviewService.remove(review.id)
      onChanged()
    } catch (deleteError) {
      setError(deleteError.message)
    }
  }

  return (
    <li className="rounded-lg bg-white p-5 ring-1 ring-charcoal/5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link to={`/listings/${review.listing_id}`} className="font-display text-xl text-charcoal hover:text-forest">
            {localized({ name: review.listing_name, name_np: review.listing_name_np }, 'name', i18n.language)}
          </Link>
          <p className="text-xs text-charcoal/60">
            {formatDate(review.created_at, i18n.language)}
            {review.updated_at && ` · ${t('reviews.edited')}`}
          </p>
        </div>
        <StarRow value={review.rating} />
      </div>

      {review.comment && <p className="mt-3 text-charcoal/80">{review.comment}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
        <Link to={`/listings/${review.listing_id}#reviews`} className="inline-flex items-center gap-1 font-medium text-forest hover:underline">
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          {t('dashboard.reviews.editOnListing')}
        </Link>
        {confirming ? (
          <>
            <span className="text-charcoal/70">{t('reviews.confirmDelete')}</span>
            <button type="button" onClick={handleDelete} className="font-semibold text-red-700 hover:underline">{t('reviews.yesDelete')}</button>
            <button type="button" onClick={() => setConfirming(false)} className="text-charcoal/70 hover:underline">{t('reviews.cancel')}</button>
          </>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="inline-flex items-center gap-1 font-medium text-red-700 hover:underline">
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            {t('reviews.delete')}
          </button>
        )}
      </div>
      {error && <p className="field-error">{error}</p>}
    </li>
  )
}

function MyReviewsPage() {
  const { t } = useTranslation()
  const { data: reviews, error, reload } = useAsync(() => reviewService.mine(), [])

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!reviews) return <Spinner />

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">{t('dashboard.nav.reviews')}</h2>
      <div className="mt-6">
        {reviews.length === 0 ? (
          <EmptyState title={t('dashboard.reviews.empty')} text={t('dashboard.reviews.emptyText')} />
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <MyReviewItem key={review.id} review={review} onChanged={reload} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default MyReviewsPage
