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

function SignupPage() {
  const { t } = useTranslation()
  const { signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const schema = useMemo(
    () =>
      z
        .object({
          name: z.string().trim().min(1, { message: t('validation.nameRequired') }).max(255),
          email: z.email({ message: t('validation.email') }),
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
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  async function onSubmit({ name, email, password }) {
    try {
      await signup({ name, email, password })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <AuthLayout title={t('auth.signupTitle')} subtitle={t('auth.signupSubtitle')}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormAlert>{errors.root?.message}</FormAlert>

        <FormField id="name" label={t('auth.name')} error={errors.name?.message}>
          <input id="name" type="text" autoComplete="name" className="field-input" aria-invalid={Boolean(errors.name)} {...register('name')} />
        </FormField>

        <FormField id="email" label={t('auth.email')} error={errors.email?.message}>
          <input id="email" type="email" autoComplete="email" className="field-input" aria-invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>

        <FormField id="password" label={t('auth.password')} error={errors.password?.message} hint={t('validation.passwordLength')}>
          <input id="password" type="password" autoComplete="new-password" className="field-input" aria-invalid={Boolean(errors.password)} {...register('password')} />
        </FormField>

        <FormField id="confirmPassword" label={t('auth.confirmPassword')} error={errors.confirmPassword?.message}>
          <input id="confirmPassword" type="password" autoComplete="new-password" className="field-input" aria-invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3">
          {isSubmitting ? t('common.loading') : t('auth.signupButton')}
        </button>

        <p className="text-center text-sm text-charcoal/70">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" state={location.state} className="font-semibold text-forest hover:text-mountain">
            {t('nav.login')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}

export default SignupPage
