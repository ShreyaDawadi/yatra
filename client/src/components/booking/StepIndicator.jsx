import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const STEPS = ['trip', 'guest', 'review']

function StepIndicator({ current }) {
  const { t } = useTranslation()

  return (
    <ol className="flex items-center gap-2 sm:gap-4">
      {STEPS.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step} className="flex flex-1 items-center gap-2" aria-current={active ? 'step' : undefined}>
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                done ? 'bg-mountain text-cream' : active ? 'bg-forest text-cream' : 'bg-charcoal/10 text-charcoal/60'
              }`}
            >
              {done ? <Check className="h-4 w-4" aria-hidden="true" /> : index + 1}
            </span>
            <span className={`hidden text-sm font-medium sm:inline ${active ? 'text-charcoal' : 'text-charcoal/60'}`}>
              {t(`booking.steps.${step}`)}
            </span>
            {index < STEPS.length - 1 && <span className="h-px flex-1 bg-charcoal/15" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

export default StepIndicator
