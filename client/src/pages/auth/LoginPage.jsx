import { useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import AuthLayout from '../../components/auth/AuthLayout'
import FormField from '../../components/forms/FormField'
import FormAlert from '../../components/forms/FormAlert'

function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const schema = useMemo(
    () =>
      z.object({
        email: z.email({ message: t('validation.email') }),
        password: z.string().min(1, { message: t('validation.required') }),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  async function onSubmit(values) {
    try {
      await login(values)
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormAlert>{errors.root?.message}</FormAlert>

        <FormField id="email" label={t('auth.email')} error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className="field-input" aria-invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>

        <FormField id="password" label={t('auth.password')} error={errors.password?.message}>
          <input id="password" type="password" autoComplete="current-password" className="field-input" aria-invalid={Boolean(errors.password)} {...register('password')} />
        </FormField>

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-medium text-forest hover:text-mountain">
            {t('auth.forgotLink')}
          </Link>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? t('common.loading') : t('auth.loginButton')}
        </button>

        <p className="text-center text-sm text-charcoal/70">
          {t('auth.noAccount')}{' '}
          <Link to="/signup" state={location.state} className="font-semibold text-forest hover:text-mountain">
            {t('auth.createAccount')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
