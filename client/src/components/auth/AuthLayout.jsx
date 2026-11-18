import { useTranslation } from 'react-i18next'
import MountainArt from '../common/MountainArt'
import PageTransition from '../layout/PageTransition'

function AuthLayout({ title, subtitle, children }) {
  const { t } = useTranslation()

  return (
    <PageTransition className="container-page py-12 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-charcoal/5 lg:grid-cols-2">
        <div className="relative hidden min-h-[520px] overflow-hidden bg-forest p-10 text-cream lg:flex lg:flex-col lg:justify-end">
          <MountainArt withSun className="absolute inset-0 h-full w-full" />
          <div className="relative">
            <p className="font-display text-3xl">{t('auth.sideTitle')}</p>
            <p className="mt-3 max-w-sm text-cream/80">{t('auth.sideText')}</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <h1 className="font-display text-3xl text-charcoal">{title}</h1>
          {subtitle && <p className="mt-2 text-charcoal/70">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </PageTransition>
  )
}

export default AuthLayout
