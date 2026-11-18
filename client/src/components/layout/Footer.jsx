import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  const exploreLinks = [
    { to: '/treks', label: t('nav.treks') },
    { to: '/hotels', label: t('nav.hotels') },
    { to: '/tours', label: t('nav.tours') },
    { to: '/explore', label: t('nav.explore') },
  ]

  const companyLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/dashboard', label: t('nav.dashboard') },
  ]

  return (
    <footer className="bg-forest text-cream">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-3xl font-semibold">{t('brand.name')}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/75">{t('footer.tagline')}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">{t('footer.explore')}</p>
          <ul className="mt-4 space-y-2.5">
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-gold">{t('footer.company')}</p>
          <ul className="mt-4 space-y-2.5">
            {companyLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-cream/80 hover:text-cream">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream/60 sm:flex-row sm:justify-between">
          <p>© {year} {t('brand.name')}. {t('footer.rights')}</p>
          <p>{t('footer.demoNote')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
