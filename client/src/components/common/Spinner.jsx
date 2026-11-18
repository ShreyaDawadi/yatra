import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function Spinner({ fullPage = false, className = '' }) {
  const { t } = useTranslation()

  const spinner = (
    <span role="status" className={`inline-flex items-center gap-2 text-sm text-charcoal/60 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin text-mountain" aria-hidden="true" />
      {t('common.loading')}
    </span>
  )

  if (fullPage) {
    return <div className="flex min-h-[50vh] items-center justify-center">{spinner}</div>
  }

  return spinner
}

export default Spinner
