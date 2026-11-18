import { Link } from 'react-router'
import { Compass, HeartHandshake, Languages, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DESTINATION_PHOTOS } from '../utils/sitePhotos'
import PageTransition from '../components/layout/PageTransition'
import Reveal from '../components/common/Reveal'
import SectionHeading from '../components/common/SectionHeading'
import PhotoCredit from '../components/detail/PhotoCredit'

const BANNER = DESTINATION_PHOTOS.mustang

function AboutPage() {
  const { t } = useTranslation()

  const values = [
    { key: 'local', icon: Compass },
    { key: 'honest', icon: ShieldCheck },
    { key: 'respect', icon: HeartHandshake },
    { key: 'access', icon: Languages },
  ]
  const steps = ['discover', 'book', 'travel']

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden bg-forest">
        <img src={BANNER.url} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest/90 via-forest/60 to-forest/20" />
        <div className="container-page py-24 sm:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{t('about.eyebrow')}</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-cream sm:text-5xl">{t('about.title')}</h1>
          <p className="mt-5 max-w-xl text-lg text-cream/85">{t('about.intro')}</p>
        </div>
        <PhotoCredit credit={BANNER} light className="absolute bottom-3 right-4" />
      </section>

      <section className="container-page grid gap-10 py-20 lg:grid-cols-2">
        <Reveal>
          <SectionHeading eyebrow={t('about.storyEyebrow')} title={t('about.storyTitle')} />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-4 leading-relaxed text-charcoal/80">
            <p>{t('about.story1')}</p>
            <p>{t('about.story2')}</p>
          </div>
        </Reveal>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <SectionHeading eyebrow={t('about.valuesEyebrow')} title={t('about.valuesTitle')} align="center" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ key, icon: Icon }, index) => (
              <Reveal key={key} delay={index * 0.08}>
                <div className="border-t-2 border-gold pt-5">
                  <Icon className="h-6 w-6 text-forest" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl text-charcoal">{t(`about.values.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{t(`about.values.${key}.text`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow={t('about.howEyebrow')} title={t('about.howTitle')} />
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((key, index) => (
            <Reveal key={key} delay={index * 0.08}>
              <li className="h-full rounded-lg bg-white p-6 ring-1 ring-charcoal/5">
                <span className="font-display text-4xl text-gold">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-xl text-charcoal">{t(`about.steps.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{t(`about.steps.${key}.text`)}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/explore" className="btn-primary">{t('about.cta')}</Link>
          <Link to="/contact" className="btn-secondary">{t('nav.contact')}</Link>
        </div>
      </section>
    </PageTransition>
  )
}

export default AboutPage
