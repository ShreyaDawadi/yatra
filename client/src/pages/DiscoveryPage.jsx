import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { listingService } from '../services/listingService'
import { useAsync } from '../hooks/useAsync'
import { useSavedListings } from '../hooks/useSavedListings'
import PageTransition from '../components/layout/PageTransition'
import FilterPanel from '../components/listings/FilterPanel'
import { readFilters } from '../utils/filters'
import ListingGrid, { ListingGridSkeleton } from '../components/listings/ListingGrid'
import { EmptyState, ErrorState } from '../components/common/StateMessage'

const SORTS = ['recommended', 'price_asc', 'price_desc', 'rating', 'popular', 'duration']
const TRIP_KEYS = ['date', 'travelers']
const PAGE_KEYS = { trek: 'treks', hotel: 'hotels', sightseeing: 'tours', '': 'explore' }

function DiscoveryPage({ type }) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const { savedIds, toggle } = useSavedListings()

  const filters = readFilters(searchParams)
  const sort = SORTS.includes(searchParams.get('sort')) ? searchParams.get('sort') : 'recommended'
  const pageKey = PAGE_KEYS[type] ?? 'explore'

  const results = useAsync(() => listingService.list({ ...filters, type, sort }), [filters, type, sort])
  const allOfType = useAsync(() => listingService.list({ type }), [type])

  const cities = useMemo(
    () => [...new Set((allOfType.data ?? []).map((listing) => listing.city))].sort(),
    [allOfType.data],
  )

  const linkSearch = useMemo(() => {
    const params = new URLSearchParams()
    for (const key of TRIP_KEYS) {
      if (searchParams.get(key)) params.set(key, searchParams.get(key))
    }
    const query = params.toString()
    return query ? `?${query}` : ''
  }, [searchParams])

  function writeParams(nextFilters, nextSort) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(nextFilters)) {
      if (String(value).trim() !== '') params.set(key, String(value).trim())
    }
    for (const key of TRIP_KEYS) {
      if (searchParams.get(key)) params.set(key, searchParams.get(key))
    }
    if (nextSort !== 'recommended') params.set('sort', nextSort)
    setSearchParams(params)
  }

  function applyFilters(nextFilters) {
    writeParams(nextFilters, sort)
    setShowFilters(false)
  }

  function clearFilters() {
    writeParams({}, sort)
    setShowFilters(false)
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length
  const listings = results.data ?? []

  const panel = (
    <FilterPanel
      key={searchParams.toString()}
      type={type}
      filters={filters}
      cities={cities}
      onApply={applyFilters}
      onClear={clearFilters}
    />
  )

  return (
    <PageTransition>
      <section className="border-b border-charcoal/10 bg-white">
        <div className="container-page py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mountain">{t(`discovery.${pageKey}.eyebrow`)}</p>
          <h1 className="mt-2 font-display text-4xl text-charcoal sm:text-5xl">{t(`discovery.${pageKey}.title`)}</h1>
          <p className="mt-3 max-w-2xl text-charcoal/70">{t(`discovery.${pageKey}.subtitle`)}</p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">{panel}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-charcoal/70" aria-live="polite">
              {results.loading ? t('common.loading') : t('discovery.results', { count: listings.length })}
            </p>

            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setShowFilters((open) => !open)} className="btn-secondary py-2 lg:hidden" aria-expanded={showFilters}>
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                {t('filters.title')}
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-forest px-1.5 text-xs text-cream">{activeFilterCount}</span>
                )}
              </button>

              <label htmlFor="sort" className="sr-only">{t('filters.sort')}</label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => writeParams(filters, event.target.value)}
                className="field-input w-auto py-2"
              >
                {SORTS.map((option) => (
                  <option key={option} value={option}>{t(`sort.${option}`)}</option>
                ))}
              </select>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 overflow-hidden lg:hidden"
              >
                {panel}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6">
            {results.error && <ErrorState error={results.error} onRetry={results.reload} />}
            {!results.error && results.loading && !results.data && <ListingGridSkeleton />}
            {!results.error && results.data && listings.length === 0 && (
              <EmptyState
                title={t('discovery.emptyTitle')}
                text={t('discovery.emptyText')}
                action={
                  <button type="button" onClick={clearFilters} className="btn-secondary">
                    {t('filters.clear')}
                  </button>
                }
              />
            )}
            {!results.error && listings.length > 0 && (
              <div className={results.loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                <ListingGrid listings={listings} linkSearch={linkSearch} savedIds={savedIds} onToggleSave={toggle} />
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default DiscoveryPage
