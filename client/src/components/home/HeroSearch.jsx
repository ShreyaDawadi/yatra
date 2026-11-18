import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CalendarDays, MapPin, Search, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DESTINATIONS } from '../../utils/destinations'
import { todayInNepal } from '../../utils/format'

const CATEGORY_PATHS = {
  all: '/explore',
  trek: '/treks',
  hotel: '/hotels',
  sightseeing: '/tours',
}

function HeroSearch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [category, setCategory] = useState('all')
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState(2)

  function handleSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('search', destination.trim())
    if (date) params.set('date', date)
    if (travelers) params.set('travelers', String(travelers))
    const query = params.toString()
    navigate(`${CATEGORY_PATHS[category]}${query ? `?${query}` : ''}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-lg bg-white p-3 shadow-xl ring-1 ring-charcoal/5 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr_auto] lg:items-end lg:gap-0 lg:p-2"
      aria-label={t('search.label')}
    >
      <label className="block rounded-md px-3 py-2 lg:border-r lg:border-charcoal/10">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal/60">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {t('search.destination')}
        </span>
        <input
          type="text"
          list="destination-options"
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
          placeholder={t('search.destinationPlaceholder')}
          className="mt-1 w-full bg-transparent text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
        />
        <datalist id="destination-options">
          {DESTINATIONS.map((item) => (
            <option key={item.key} value={item.city} />
          ))}
        </datalist>
      </label>

      <label className="block rounded-md px-3 py-2 lg:border-r lg:border-charcoal/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">{t('search.category')}</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-charcoal focus:outline-none"
        >
          <option value="all">{t('typesPlural.all')}</option>
          <option value="trek">{t('typesPlural.trek')}</option>
          <option value="hotel">{t('typesPlural.hotel')}</option>
          <option value="sightseeing">{t('typesPlural.sightseeing')}</option>
        </select>
      </label>

      <label className="block rounded-md px-3 py-2 lg:border-r lg:border-charcoal/10">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal/60">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
          {t('search.date')}
        </span>
        <input
          type="date"
          min={todayInNepal()}
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-1 w-full bg-transparent text-sm text-charcoal focus:outline-none"
        />
      </label>

      <label className="block rounded-md px-3 py-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal/60">
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
          {t('search.travelers')}
        </span>
        <input
          type="number"
          min={1}
          max={20}
          value={travelers}
          onChange={(event) => setTravelers(Math.min(20, Math.max(1, Number(event.target.value) || 1)))}
          className="mt-1 w-full bg-transparent text-sm text-charcoal focus:outline-none"
        />
      </label>

      <button type="submit" className="btn-primary h-12 sm:col-span-2 lg:col-span-1 lg:ml-2 lg:px-6">
        <Search className="h-4 w-4" aria-hidden="true" />
        {t('search.submit')}
      </button>
    </form>
  )
}

export default HeroSearch
