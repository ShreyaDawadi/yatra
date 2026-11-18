import { AlertCircle, Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ErrorState({ error, onRetry, className = '' }) {
  const { t } = useTranslation()

  return (
    <div role="alert" className={`rounded-lg border border-red-200 bg-red-50 p-6 text-center ${className}`}>
      <AlertCircle className="mx-auto h-8 w-8 text-red-700" aria-hidden="true" />
      <p className="mt-3 font-semibold text-red-900">{t('common.errorTitle')}</p>
      <p className="mt-1 text-sm text-red-800">{error?.message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-4">
          {t('common.retry')}
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action, className = '' }) {
  return (
    <div className={`rounded-lg border border-dashed border-charcoal/20 bg-white/60 p-10 text-center ${className}`}>
      <Compass className="mx-auto h-8 w-8 text-mountain" aria-hidden="true" />
      <p className="mt-3 font-display text-xl text-charcoal">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/70">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
