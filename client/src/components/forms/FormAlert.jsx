import { AlertCircle, CheckCircle2 } from 'lucide-react'

function FormAlert({ type = 'error', children, className = '' }) {
  if (!children) return null

  const isError = type === 'error'
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-md p-3 text-sm ${
        isError ? 'bg-red-50 text-red-800 ring-1 ring-red-200' : 'bg-mountain/10 text-forest ring-1 ring-mountain/20'
      } ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export default FormAlert
