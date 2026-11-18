import { useTranslation } from 'react-i18next'
import { localized } from '../../utils/format'

function PhotoCredit({ credit, light = false, className = '' }) {
  const { t, i18n } = useTranslation()
  if (!credit) return null

  const textClass = light ? 'text-cream/70' : 'text-charcoal/60'
  const strongClass = light ? 'text-cream/90' : 'text-charcoal/80'
  const linkClass = light ? 'underline hover:text-cream' : 'underline hover:text-forest'

  return (
    <p className={`text-xs ${textClass} ${className}`}>
      {credit.area_caption && (
        <span className={`font-medium ${strongClass}`}>
          {credit.is_area_photo === false
            ? localized(credit, 'area_caption', i18n.language)
            : t('credits.areaPhoto', { place: localized(credit, 'area_caption', i18n.language) })}
          {' · '}
        </span>
      )}
      {t('credits.photoBy')}{' '}
      <a href={credit.source} target="_blank" rel="noreferrer" className={linkClass}>
        {credit.author}
      </a>
      {', '}
      <a href={credit.license_url} target="_blank" rel="noreferrer" className={linkClass}>
        {credit.license}
      </a>
      {', '}
      {t('credits.via')}
    </p>
  )
}

export default PhotoCredit
