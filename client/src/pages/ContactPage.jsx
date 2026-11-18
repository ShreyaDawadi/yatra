import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Mail, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { contactService } from '../services/contactService'
import PageTransition from '../components/layout/PageTransition'
import FormField from '../components/forms/FormField'
import FormAlert from '../components/forms/FormAlert'

function ContactPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [sentMessage, setSentMessage] = useState('')

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, { message: t('validation.nameRequired') }).max(255),
        email: z.email({ message: t('validation.email') }),
        subject: z.string().max(255, { message: t('validation.tooLong', { max: 255 }) }),
        message: z
          .string()
          .trim()
          .min(1, { message: t('validation.required') })
          .max(5000, { message: t('validation.tooLong', { max: 5000 }) }),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', subject: '', message: '' },
  })

  async function onSubmit(values) {
    try {
      const result = await contactService.sendMessage({ ...values, subject: values.subject || null })
      setSentMessage(result.message)
      reset({ name: values.name, email: values.email, subject: '', message: '' })
    } catch (error) {
      setError('root', { message: error.message })
    }
  }

  const details = [
    { icon: Mail, label: t('contact.emailLabel'), value: 'hello@yatra.example' },
    { icon: MapPin, label: t('contact.officeLabel'), value: t('contact.office') },
    { icon: Clock, label: t('contact.replyLabel'), value: t('contact.reply') },
  ]

  return (
    <PageTransition className="container-page py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mountain">{t('contact.eyebrow')}</p>
      <h1 className="mt-2 font-display text-4xl text-charcoal sm:text-5xl">{t('contact.title')}</h1>
      <p className="mt-3 max-w-2xl text-charcoal/70">{t('contact.intro')}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 rounded-lg bg-white p-6 shadow-sm ring-1 ring-charcoal/5 sm:p-8">
          <FormAlert>{errors.root?.message}</FormAlert>
          {sentMessage && <FormAlert type="success">{sentMessage}</FormAlert>}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="contact-name" label={t('auth.name')} error={errors.name?.message}>
              <input id="contact-name" type="text" autoComplete="name" className="field-input" {...register('name')} />
            </FormField>
            <FormField id="contact-email" label={t('auth.email')} error={errors.email?.message}>
              <input id="contact-email" type="email" autoComplete="email" className="field-input" {...register('email')} />
            </FormField>
          </div>

          <FormField id="contact-subject" label={t('contact.subject')} error={errors.subject?.message} hint={t('booking.optional')}>
            <input id="contact-subject" type="text" className="field-input" {...register('subject')} />
          </FormField>

          <FormField id="contact-message" label={t('contact.message')} error={errors.message?.message}>
            <textarea id="contact-message" rows={6} placeholder={t('contact.messagePlaceholder')} className="field-input" {...register('message')} />
          </FormField>

          <button type="submit" disabled={isSubmitting} className="btn-primary px-8">
            {isSubmitting ? t('common.loading') : t('contact.send')}
          </button>
        </form>

        <aside className="space-y-4">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-3 rounded-lg bg-white p-5 ring-1 ring-charcoal/5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-mountain" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">{label}</p>
                <p className="mt-1 text-charcoal">{value}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-charcoal/60">{t('contact.demoNote')}</p>
        </aside>
      </div>
    </PageTransition>
  )
}

export default ContactPage
