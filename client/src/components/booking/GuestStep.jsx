import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import FormField from '../forms/FormField'

const PHONE_PATTERN = /^[0-9+\-\s()]{7,30}$/

function GuestStep({ defaultValues, onBack, onNext }) {
  const { t } = useTranslation()

  const schema = useMemo(
    () =>
      z.object({
        guest_name: z.string().trim().min(1, { message: t('validation.nameRequired') }).max(255),
        guest_email: z.email({ message: t('validation.email') }),
        guest_phone: z
          .string()
          .trim()
          .refine((value) => value === '' || PHONE_PATTERN.test(value), { message: t('validation.phone') }),
        special_requests: z.string().max(1000, { message: t('validation.tooLong', { max: 1000 }) }),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), defaultValues })

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate className="space-y-6">
      <h2 className="font-display text-2xl text-charcoal">{t('booking.guestTitle')}</h2>
      <p className="text-sm text-charcoal/70">{t('booking.guestIntro')}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="guest_name" label={t('booking.guestName')} error={errors.guest_name?.message}>
          <input id="guest_name" type="text" autoComplete="name" className="field-input" {...register('guest_name')} />
        </FormField>
        <FormField id="guest_email" label={t('booking.guestEmail')} error={errors.guest_email?.message}>
          <input id="guest_email" type="email" autoComplete="email" className="field-input" {...register('guest_email')} />
        </FormField>
        <FormField id="guest_phone" label={t('booking.guestPhone')} error={errors.guest_phone?.message} hint={t('booking.optional')}>
          <input id="guest_phone" type="tel" autoComplete="tel" className="field-input" {...register('guest_phone')} />
        </FormField>
      </div>

      <FormField id="special_requests" label={t('booking.specialRequests')} error={errors.special_requests?.message} hint={t('booking.optional')}>
        <textarea id="special_requests" rows={3} placeholder={t('booking.requestsPlaceholder')} className="field-input" {...register('special_requests')} />
      </FormField>

      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">{t('booking.back')}</button>
        <button type="submit" className="btn-primary px-8">{t('booking.next')}</button>
      </div>
    </form>
  )
}

export default GuestStep
