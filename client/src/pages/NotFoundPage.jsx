import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import PageTransition from '../components/layout/PageTransition'

function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <PageTransition className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-7xl text-gold">404</p>
      <h1 className="mt-4 font-display text-3xl text-charcoal">{t('notFound.title')}</h1>
      <p className="mt-2 max-w-md text-charcoal/70">{t('notFound.text')}</p>
      <Link to="/" className="btn-primary mt-6">{t('notFound.home')}</Link>
    </PageTransition>
  )
}

export default NotFoundPage
