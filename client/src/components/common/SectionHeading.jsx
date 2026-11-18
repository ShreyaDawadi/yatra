import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'

function SectionHeading({ eyebrow, title, subtitle, linkTo, linkLabel, align = 'left' }) {
  const centered = align === 'center'

  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-end ${centered ? 'items-center text-center sm:flex-col sm:items-center' : 'sm:justify-between'}`}>
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mountain">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-3xl text-charcoal sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-3 text-charcoal/70">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-forest hover:text-mountain">
          {linkLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export default SectionHeading
