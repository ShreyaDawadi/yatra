import { NavLink, Outlet, useNavigate } from 'react-router'
import { CalendarCheck, Heart, LayoutDashboard, LogOut, MessageSquare, UserRound } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import PageTransition from '../components/layout/PageTransition'

const LINKS = [
  { to: '/dashboard', end: true, key: 'dashboard.nav.overview', icon: LayoutDashboard },
  { to: '/dashboard/bookings', key: 'dashboard.nav.bookings', icon: CalendarCheck },
  { to: '/dashboard/saved', key: 'dashboard.nav.saved', icon: Heart },
  { to: '/dashboard/reviews', key: 'dashboard.nav.reviews', icon: MessageSquare },
  { to: '/dashboard/profile', key: 'dashboard.nav.profile', icon: UserRound },
]

function linkClass({ isActive }) {
  return `flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-forest text-cream' : 'text-charcoal/75 hover:bg-forest/5 hover:text-forest'
  }`
}

function DashboardLayout() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <PageTransition className="container-page py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mountain">{t('dashboard.eyebrow')}</p>
      <h1 className="mt-2 font-display text-4xl text-charcoal">{t('dashboard.greeting', { name: user?.name ?? '' })}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label={t('dashboard.navLabel')} className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {LINKS.map(({ to, end, key, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(key)}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-charcoal/75 hover:bg-red-50 hover:text-red-700 lg:mt-4"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {t('nav.logout')}
          </button>
        </nav>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </PageTransition>
  )
}

export default DashboardLayout
