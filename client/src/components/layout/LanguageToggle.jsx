import { Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function LanguageToggle({ className = '' }) {
  const { t, i18n } = useTranslation()
  const nextLanguage = i18n.language === 'ne' ? 'en' : 'ne'

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(nextLanguage)}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-charcoal/80 transition-colors hover:bg-forest/5 hover:text-forest ${className}`}
      aria-label={t('common.changeLanguage')}
    >
      <Globe className="h-4 w-4" aria-hidden="true" />
      {t('common.otherLanguage')}
    </button>
  )
}

export default LanguageToggle
