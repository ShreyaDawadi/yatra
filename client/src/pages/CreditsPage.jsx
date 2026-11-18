import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { listingService } from '../services/listingService'
import { useAsync } from '../hooks/useAsync'
import { localized } from '../utils/format'
import PageTransition from '../components/layout/PageTransition'
import Spinner from '../components/common/Spinner'
import { ErrorState } from '../components/common/StateMessage'
import PhotoCredit from '../components/detail/PhotoCredit'
import { SITE_PHOTOS } from '../utils/sitePhotos'

function CreditsPage() {
  const { t, i18n } = useTranslation()
  const { data: listings, error, reload } = useAsync(() => listingService.list({}), [])

  const rows = (listings ?? []).flatMap((listing) =>
    (listing.image_credits ?? []).map((credit) => ({ listing, credit })),
  )
  const listingUrls = new Set(rows.map((row) => row.credit.url))
  const siteOnly = SITE_PHOTOS.filter((photo) => !listingUrls.has(photo.url))

  return (
    <PageTransition className="container-page py-12">
      <h1 className="font-display text-4xl text-charcoal">{t('credits.title')}</h1>
      <p className="mt-3 max-w-2xl text-charcoal/70">{t('credits.intro')}</p>

      {siteOnly.length > 0 && (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {siteOnly.map((credit) => (
            <li key={credit.url} className="flex gap-3 rounded-lg bg-white p-3 ring-1 ring-charcoal/5">
              <img src={credit.url} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded object-cover" />
              <div className="min-w-0">
                <p className="font-medium text-charcoal">{t('credits.homepage')}</p>
                <PhotoCredit credit={credit} className="mt-1" />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        {error && <ErrorState error={error} onRetry={reload} />}
        {!listings && !error && <Spinner />}
        {rows.length > 0 && (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ listing, credit }) => (
              <li key={credit.url} className="flex gap-3 rounded-lg bg-white p-3 ring-1 ring-charcoal/5">
                <img src={credit.url} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded object-cover" />
                <div className="min-w-0">
                  <Link to={`/listings/${listing.id}`} className="font-medium text-charcoal hover:text-forest">
                    {localized(listing, 'name', i18n.language)}
                  </Link>
                  <PhotoCredit credit={credit} className="mt-1" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTransition>
  )
}

export default CreditsPage
