import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { authService } from '../../services/authService'
import AuthLayout from '../../components/auth/AuthLayout'
import FormField from '../../components/forms/FormField'
import FormAlert from '../../components/forms/FormAlert'

function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [sentMessage, setSentMessage] = useState('')

  const schema = useMemo(() => z.object({ email: z.email({ message: t('validation.email') }) }), [t])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  async function onSubmit({ email }) {
    try {
      const result = await authService.forgotPassword(email)
      setSentMessage(result.message)
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <AuthLayout title={t('auth.forgotTitle')} subtitle={t('auth.forgotSubtitle')}>
      {sentMessage ? (
        <div className="space-y-5">
          <FormAlert type="success">{sentMessage}</FormAlert>
          <p className="rounded-md bg-gold/15 p-3 text-sm text-charcoal/80">{t('auth.devResetNote')}</p>
          <Link to="/login" className="btn-secondary w-full">{t('auth.backToLogin')}</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormAlert>{errors.root?.message}</FormAlert>

          <FormField id="email" label={t('auth.email')} error={errors.email?.message}>
            <input id="email" type="email" autoComplete="email" className="field-input" aria-invalid={Boolean(errors.email)} {...register('email')} />
          </FormField>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
            {isSubmitting ? t('common.loading') : t('auth.sendLink')}
          </button>

          <p className="text-center text-sm">
            <Link to="/login" className="font-semibold text-forest hover:text-mountain">{t('auth.backToLogin')}</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPasswordPage
