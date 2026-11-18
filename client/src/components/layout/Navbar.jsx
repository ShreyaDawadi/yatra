import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { firstName } from '../../utils/format'
import LanguageToggle from './LanguageToggle'

const NAV_LINKS = [
  { to: '/treks', key: 'nav.treks' },
  { to: '/hotels', key: 'nav.hotels' },
  { to: '/tours', key: 'nav.tours' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
]

function navClass({ isActive }) {
  return `text-sm font-medium transition-colors ${
    isActive ? 'text-forest' : 'text-charcoal/70 hover:text-forest'
  }`
}

function Navbar() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between gap-6" aria-label={t('nav.main')}>
        <Link to="/" className="font-display text-2xl font-semibold text-forest" onClick={closeMenu}>
          {t('brand.name')}
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {t(link.key)}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="btn-secondary py-2">
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                {firstName(user.name)}
              </Link>
              <button type="button" onClick={handleLogout} className="rounded-md p-2 text-charcoal/60 hover:bg-forest/5 hover:text-forest" aria-label={t('nav.logout')}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-semibold text-forest hover:text-mountain">
                {t('nav.login')}
              </Link>
              <Link to="/signup" className="btn-primary py-2">
                {t('nav.signup')}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-charcoal lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? t('common.close') : t('nav.menu')}
        >
          {menuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-charcoal/10 bg-cream lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2.5 text-base font-medium ${isActive ? 'bg-forest/5 text-forest' : 'text-charcoal/80'}`
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}

              <div className="my-2 border-t border-charcoal/10" />

              {user ? (
                <>
                  <Link to="/dashboard" onClick={closeMenu} className="rounded-md px-3 py-2.5 text-base font-medium text-charcoal/80">
                    {t('nav.dashboard')}
                  </Link>
                  <button type="button" onClick={handleLogout} className="rounded-md px-3 py-2.5 text-left text-base font-medium text-charcoal/80">
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <div className="flex gap-3 px-3 pt-1">
                  <Link to="/login" onClick={closeMenu} className="btn-secondary flex-1">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" onClick={closeMenu} className="btn-primary flex-1">
                    {t('nav.signup')}
                  </Link>
                </div>
              )}

              <LanguageToggle className="mt-2 self-start" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
