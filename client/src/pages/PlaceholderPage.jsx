import { Link } from 'react-router'
import { Hammer } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/layout/PageTransition'

// Temporary page for routes that are built in the next steps.
function PlaceholderPage({ name }) {
  const { t } = useTranslation()

  return (
    <PageTransition className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Hammer className="h-10 w-10 text-gold" aria-hidden="true" />
      <h1 className="mt-4 font-display text-3xl text-charcoal">{t(`placeholder.pages.${name}`)}</h1>
      <p className="mt-2 max-w-md text-charcoal/70">{t('placeholder.text')}</p>
      <Link to="/" className="btn-secondary mt-6">{t('notFound.home')}</Link>
    </PageTransition>
  )
}

export default PlaceholderPage
