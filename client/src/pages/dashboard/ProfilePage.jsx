import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import { formatDate } from '../../utils/format'
import FormField from '../../components/forms/FormField'
import FormAlert from '../../components/forms/FormAlert'

const PHONE_PATTERN = /^[0-9+\-\s()]{7,30}$/

function ProfileForm() {
  const { t, i18n } = useTranslation()
  const { user, setUser } = useAuth()
  const [saved, setSaved] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, { message: t('validation.nameRequired') }).max(255),
        phone: z.string().trim().refine((value) => value === '' || PHONE_PATTERN.test(value), { message: t('validation.phone') }),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: user.name, phone: user.phone ?? '' } })

  async function onSubmit(values) {
    setSaved(false)
    try {
      const updated = await authService.updateProfile({ name: values.name, phone: values.phone || null })
      setUser(updated)
      reset({ name: updated.name, phone: updated.phone ?? '' })
      setSaved(true)
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-lg bg-white p-6 ring-1 ring-charcoal/5">
      <h3 className="font-display text-xl text-charcoal">{t('dashboard.profile.detailsTitle')}</h3>
      <FormAlert>{errors.root?.message}</FormAlert>
      {saved && <FormAlert type="success">{t('dashboard.profile.saved')}</FormAlert>}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="profile-name" label={t('auth.name')} error={errors.name?.message}>
          <input id="profile-name" type="text" autoComplete="name" className="field-input" {...register('name')} />
        </FormField>
        <FormField id="profile-phone" label={t('booking.guestPhone')} error={errors.phone?.message} hint={t('booking.optional')}>
          <input id="profile-phone" type="tel" autoComplete="tel" className="field-input" {...register('phone')} />
        </FormField>
        <FormField id="profile-email" label={t('auth.email')} hint={t('dashboard.profile.emailFixed')}>
          <input id="profile-email" type="email" value={user.email} readOnly className="field-input bg-cream text-charcoal/70" />
        </FormField>
        <div>
          <p className="field-label">{t('dashboard.profile.memberSince')}</p>
          <p className="py-2.5 text-sm text-charcoal">{formatDate(user.created_at, i18n.language)}</p>
        </div>
      </div>

      <button type="submit" disabled={isSubmitting || !isDirty} className="btn-primary">
        {isSubmitting ? t('common.loading') : t('dashboard.profile.save')}
      </button>
    </form>
  )
}

function PasswordForm() {
  const { t } = useTranslation()
  const [done, setDone] = useState(false)

  const schema = useMemo(
    () =>
      z
        .object({
          current_password: z.string().min(1, { message: t('validation.required') }),
          new_password: z.string().min(8, { message: t('validation.passwordLength') }),
          confirm_password: z.string(),
        })
        .refine((values) => values.new_password === values.confirm_password, {
          message: t('validation.passwordsMatch'),
          path: ['confirm_password'],
        }),
    [t],
  )

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { current_password: '', new_password: '', confirm_password: '' } })

  async function onSubmit({ current_password, new_password }) {
    setDone(false)
    try {
      await authService.changePassword({ current_password, new_password })
      reset()
      setDone(true)
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-lg bg-white p-6 ring-1 ring-charcoal/5">
      <h3 className="font-display text-xl text-charcoal">{t('dashboard.profile.passwordTitle')}</h3>
      <FormAlert>{errors.root?.message}</FormAlert>
      {done && <FormAlert type="success">{t('dashboard.profile.passwordChanged')}</FormAlert>}

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField id="current_password" label={t('dashboard.profile.currentPassword')} error={errors.current_password?.message}>
          <input id="current_password" type="password" autoComplete="current-password" className="field-input" {...register('current_password')} />
        </FormField>
        <FormField id="new_password" label={t('auth.newPassword')} error={errors.new_password?.message}>
          <input id="new_password" type="password" autoComplete="new-password" className="field-input" {...register('new_password')} />
        </FormField>
        <FormField id="confirm_password" label={t('auth.confirmPassword')} error={errors.confirm_password?.message}>
          <input id="confirm_password" type="password" autoComplete="new-password" className="field-input" {...register('confirm_password')} />
        </FormField>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-secondary">
        {isSubmitting ? t('common.loading') : t('dashboard.profile.changePassword')}
      </button>
    </form>
  )
}

function ProfilePage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-charcoal">{t('dashboard.nav.profile')}</h2>
      <ProfileForm />
      <PasswordForm />
    </div>
  )
}

export default ProfilePage
