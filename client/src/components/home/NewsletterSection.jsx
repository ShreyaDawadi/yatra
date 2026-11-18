import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { contactService } from '../../services/contactService'

function NewsletterSection() {
  const { t } = useTranslation()
  const [status, setStatus] = useState(null)

  const schema = useMemo(
    () => z.object({ email: z.email({ message: t('validation.email') }) }),
    [t],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  async function onSubmit({ email }) {
    setStatus(null)
    try {
      const result = await contactService.subscribe(email)
      setStatus({ type: 'success', message: result.message })
      reset()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    }
  }

  return (
    <section className="bg-forest py-16 text-cream">
      <div className="container-page grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">{t('newsletter.title')}</h2>
          <p className="mt-3 max-w-lg text-cream/75">{t('newsletter.text')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              {t('newsletter.placeholder')}
            </label>
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder={t('newsletter.placeholder')}
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
              className="flex-1 rounded-md border border-cream/20 bg-cream/10 px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
            />
            <button type="submit" disabled={isSubmitting} className="btn-gold px-6 py-3">
              <Send className="h-4 w-4" aria-hidden="true" />
              {t('newsletter.subscribe')}
            </button>
          </div>
          {errors.email && <p className="mt-2 text-sm text-gold">{errors.email.message}</p>}
          {status && (
            <p role="status" className={`mt-2 text-sm ${status.type === 'success' ? 'text-cream' : 'text-gold'}`}>
              {status.message}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default NewsletterSection
