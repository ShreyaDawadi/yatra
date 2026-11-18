import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { authService } from '../../services/authService'
import AuthLayout from '../../components/auth/AuthLayout'
import FormField from '../../components/forms/FormField'
import FormAlert from '../../components/forms/FormAlert'

function ResetPasswordPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const tokenLooksValid = /^[0-9a-f]{64}$/.test(token)
  const [done, setDone] = useState(false)

  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, { message: t('validation.passwordLength') }),
          confirmPassword: z.string(),
        })
        .refine((values) => values.password === values.confirmPassword, {
          message: t('validation.passwordsMatch'),
          path: ['confirmPassword'],
        }),
    [t],
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { password: '', confirmPassword: '' } })

  async function onSubmit({ password }) {
    try {
      await authService.resetPassword({ token, new_password: password })
      setDone(true)
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <AuthLayout title={t('auth.resetTitle')} subtitle={t('auth.resetSubtitle')}>
      {!tokenLooksValid && (
        <div className="space-y-5">
          <FormAlert>{t('auth.invalidLink')}</FormAlert>
          <Link to="/forgot-password" className="btn-secondary w-full">{t('auth.requestNewLink')}</Link>
        </div>
      )}

      {tokenLooksValid && done && (
        <div className="space-y-5">
          <FormAlert type="success">{t('auth.resetSuccess')}</FormAlert>
          <Link to="/login" className="btn-primary w-full">{t('nav.login')}</Link>
        </div>
      )}

      {tokenLooksValid && !done && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormAlert>
            {errors.root?.message}
            {errors.root && (
              <>
                {' '}
                <Link to="/forgot-password" className="font-semibold underline">{t('auth.requestNewLink')}</Link>
              </>
            )}
          </FormAlert>

          <FormField id="password" label={t('auth.newPassword')} error={errors.password?.message} hint={t('validation.passwordLength')}>
            <input id="password" type="password" autoComplete="new-password" className="field-input" aria-invalid={Boolean(errors.password)} {...register('password')} />
          </FormField>

          <FormField id="confirmPassword" label={t('auth.confirmPassword')} error={errors.confirmPassword?.message}>
            <input id="confirmPassword" type="password" autoComplete="new-password" className="field-input" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
          </FormField>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
            {isSubmitting ? t('common.loading') : t('auth.resetButton')}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ResetPasswordPage
