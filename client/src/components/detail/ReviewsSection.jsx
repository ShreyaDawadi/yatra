import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Pencil, Star, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { useAsync } from '../../hooks/useAsync'
import { listingService } from '../../services/listingService'
import { reviewService } from '../../services/reviewService'
import { firstName, formatDate, toNumber } from '../../utils/format'
import { StarRow } from '../common/Rating'
import FormAlert from '../forms/FormAlert'
import Spinner from '../common/Spinner'

function StarPicker({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <div className="flex gap-1" role="radiogroup" aria-label={t('reviews.yourRating')}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={t('reviews.starLabel', { count: star })}
          onClick={() => onChange(star)}
          className="rounded p-0.5"
        >
          <Star className={`h-7 w-7 ${star <= value ? 'fill-gold text-gold' : 'text-charcoal/25'}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

function ReviewForm({ initial, submitLabel, onSubmit, onCancel }) {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      z.object({
        rating: z.number().int().min(1, { message: t('validation.rating') }).max(5),
        comment: z.string().max(1000, { message: t('validation.tooLong', { max: 1000 }) }),
      }),
    [t],
  )

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: initial?.rating ?? 0, comment: initial?.comment ?? '' },
  })

  async function submit(values) {
    try {
      await onSubmit({ rating: values.rating, comment: values.comment.trim() || null })
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4 rounded-lg bg-white p-5 ring-1 ring-charcoal/5">
      <FormAlert>{errors.root?.message}</FormAlert>

      <div>
        <p className="field-label">{t('reviews.yourRating')}</p>
        <Controller name="rating" control={control} render={({ field }) => <StarPicker value={field.value} onChange={field.onChange} />} />
        {errors.rating && <p className="field-error">{errors.rating.message}</p>}
      </div>

      <div>
        <label htmlFor="review-comment" className="field-label">{t('reviews.comment')}</label>
        <textarea id="review-comment" rows={4} placeholder={t('reviews.commentPlaceholder')} className="field-input" {...register('comment')} />
        {errors.comment && <p className="field-error">{errors.comment.message}</p>}
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? t('common.loading') : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            {t('reviews.cancel')}
          </button>
        )}
      </div>
    </form>
  )
}

function ReviewItem({ review, isOwn, onChanged }) {
  const { t, i18n } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function handleUpdate(values) {
    await reviewService.update(review.id, values)
    setEditing(false)
    onChanged()
  }

  async function handleDelete() {
    try {
      await reviewService.remove(review.id)
      onChanged()
    } catch (error) {
      setDeleteError(error.message)
    }
  }

  if (editing) {
    return (
      <li>
        <ReviewForm initial={review} submitLabel={t('reviews.update')} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
      </li>
    )
  }

  return (
    <li className="border-b border-charcoal/10 pb-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-semibold text-cream" aria-hidden="true">
            {firstName(review.user_name).charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-semibold text-charcoal">{firstName(review.user_name)}</p>
            <p className="text-xs text-charcoal/60">
              {formatDate(review.created_at, i18n.language)}
              {review.updated_at && ` · ${t('reviews.edited')}`}
            </p>
          </div>
        </div>
        <StarRow value={review.rating} />
      </div>

      {review.comment && <p className="mt-3 text-charcoal/80">{review.comment}</p>}

      {isOwn && (
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          {confirmingDelete ? (
            <>
              <span className="text-charcoal/70">{t('reviews.confirmDelete')}</span>
              <button type="button" onClick={handleDelete} className="font-semibold text-red-700 hover:underline">{t('reviews.yesDelete')}</button>
              <button type="button" onClick={() => setConfirmingDelete(false)} className="text-charcoal/70 hover:underline">{t('reviews.cancel')}</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1 font-medium text-forest hover:underline">
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                {t('reviews.edit')}
              </button>
              <button type="button" onClick={() => setConfirmingDelete(true)} className="inline-flex items-center gap-1 font-medium text-red-700 hover:underline">
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t('reviews.delete')}
              </button>
            </>
          )}
          {deleteError && <span className="field-error">{deleteError}</span>}
        </div>
      )}
    </li>
  )
}

function RatingBreakdown({ reviews, average }) {
  const { t } = useTranslation()
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => review.rating === star).length,
  }))
  const averageNumber = toNumber(average)

  return (
    <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="text-center sm:pr-6">
        <p className="font-display text-5xl text-charcoal">{averageNumber !== null ? averageNumber.toFixed(1) : '–'}</p>
        <StarRow value={averageNumber} className="mt-1" />
        <p className="mt-1 text-sm text-charcoal/60">{t('reviews.basedOn', { count: reviews.length })}</p>
      </div>
      <ul className="space-y-1.5">
        {counts.map(({ star, count }) => (
          <li key={star} className="flex items-center gap-3 text-sm">
            <span className="w-14 text-charcoal/70">{t('reviews.starLabel', { count: star })}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-charcoal/10">
              <span className="block h-full rounded-full bg-gold" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }} />
            </span>
            <span className="w-6 text-right text-charcoal/60">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ReviewsSection({ listing, onChanged }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const location = useLocation()

  const reviews = useAsync(() => listingService.reviews(listing.id), [listing.id])
  const eligibility = useAsync(
    () => (user ? reviewService.eligibility(listing.id) : Promise.resolve(null)),
    [listing.id, user?.id ?? null],
  )

  function refresh() {
    reviews.reload()
    eligibility.reload()
    onChanged()
  }

  async function handleCreate(values) {
    await listingService.addReview(listing.id, values)
    refresh()
  }

  let formArea = null
  if (!user) {
    formArea = (
      <p className="text-sm text-charcoal/70">
        <Link to="/login" state={{ from: location.pathname }} className="font-semibold text-forest hover:underline">
          {t('reviews.loginToReview')}
        </Link>
      </p>
    )
  } else if (eligibility.data?.can_review) {
    formArea = (
      <div>
        <p className="mb-3 font-semibold text-charcoal">{t('reviews.writeTitle')}</p>
        <ReviewForm submitLabel={t('reviews.submit')} onSubmit={handleCreate} />
      </div>
    )
  } else if (eligibility.data?.review_id) {
    formArea = <p className="text-sm text-charcoal/70">{t('reviews.alreadyReviewed')}</p>
  } else if (eligibility.data && !eligibility.data.has_booking) {
    formArea = <p className="text-sm text-charcoal/70">{t('reviews.needBooking')}</p>
  }

  return (
    <div className="space-y-8">
      {reviews.data && <RatingBreakdown reviews={reviews.data} average={listing.average_rating} />}
      {formArea}
      {!reviews.data && !reviews.error && <Spinner />}
      {reviews.error && <FormAlert>{reviews.error.message}</FormAlert>}
      {reviews.data?.length === 0 && <p className="text-charcoal/70">{t('reviews.noReviews')}</p>}
      {reviews.data?.length > 0 && (
        <ul className="space-y-5">
          {reviews.data.map((review) => (
            <ReviewItem key={review.id} review={review} isOwn={user?.id === review.user_id} onChanged={refresh} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ReviewsSection
