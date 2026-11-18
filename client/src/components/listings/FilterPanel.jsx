import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DIFFICULTIES } from '../../utils/listingTypes'

function FilterPanel({ type, filters, cities, onApply, onClear }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(filters)

  function update(key, value) {
    setDraft((previous) => ({ ...previous, [key]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onApply(draft)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg bg-white p-5 ring-1 ring-charcoal/5">
      <p className="font-display text-lg text-charcoal">{t('filters.title')}</p>

      <div>
        <label htmlFor="filter-search" className="field-label">{t('filters.search')}</label>
        <input
          id="filter-search"
          type="search"
          value={draft.search}
          onChange={(event) => update('search', event.target.value)}
          placeholder={t('filters.searchPlaceholder')}
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="filter-city" className="field-label">{t('filters.destination')}</label>
        <select id="filter-city" value={draft.city} onChange={(event) => update('city', event.target.value)} className="field-input">
          <option value="">{t('filters.allDestinations')}</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="field-label">{t('filters.price')}</legend>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label={t('filters.minPrice')}
            placeholder={t('filters.min')}
            value={draft.min_price}
            onChange={(event) => update('min_price', event.target.value)}
            className="field-input"
          />
          <input
            type="number"
            min={0}
            inputMode="numeric"
            aria-label={t('filters.maxPrice')}
            placeholder={t('filters.max')}
            value={draft.max_price}
            onChange={(event) => update('max_price', event.target.value)}
            className="field-input"
          />
        </div>
      </fieldset>

      {type === 'trek' && (
        <>
          <div>
            <label htmlFor="filter-difficulty" className="field-label">{t('filters.difficulty')}</label>
            <select id="filter-difficulty" value={draft.difficulty} onChange={(event) => update('difficulty', event.target.value)} className="field-input">
              <option value="">{t('filters.any')}</option>
              {DIFFICULTIES.map((level) => (
                <option key={level} value={level}>{t(`difficulty.${level}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filter-days" className="field-label">{t('filters.duration')}</label>
            <select id="filter-days" value={draft.max_days} onChange={(event) => update('max_days', event.target.value)} className="field-input">
              <option value="">{t('filters.any')}</option>
              {[4, 6, 8, 10, 14].map((days) => (
                <option key={days} value={days}>{t('filters.upToDays', { count: days })}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {type === 'hotel' && (
        <div>
          <label htmlFor="filter-stars" className="field-label">{t('filters.stars')}</label>
          <select id="filter-stars" value={draft.min_stars} onChange={(event) => update('min_stars', event.target.value)} className="field-input">
            <option value="">{t('filters.any')}</option>
            {[3, 4, 5].map((stars) => (
              <option key={stars} value={stars}>{t('filters.starsAndUp', { count: stars })}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button type="submit" className="btn-primary flex-1">{t('filters.apply')}</button>
        <button type="button" onClick={onClear} className="btn-secondary">{t('filters.clear')}</button>
      </div>
    </form>
  )
}

export default FilterPanel
