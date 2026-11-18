import { useMemo } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useAsync } from '../../hooks/useAsync'
import { savedService } from '../../services/savedService'
import Spinner from '../../components/common/Spinner'
import { EmptyState, ErrorState } from '../../components/common/StateMessage'
import ListingGrid from '../../components/listings/ListingGrid'

function SavedPage() {
  const { t } = useTranslation()
  const { data: saved, error, reload } = useAsync(() => savedService.list(), [])
  const savedIds = useMemo(() => new Set((saved ?? []).map((listing) => listing.id)), [saved])

  async function handleUnsave(listingId) {
    await savedService.unsave(listingId)
    reload()
  }

  if (error) return <ErrorState error={error} onRetry={reload} />
  if (!saved) return <Spinner />

  return (
    <div>
      <h2 className="font-display text-2xl text-charcoal">{t('dashboard.nav.saved')}</h2>
      <div className="mt-6">
        {saved.length === 0 ? (
          <EmptyState
            title={t('dashboard.saved.empty')}
            text={t('dashboard.saved.emptyText')}
            action={<Link to="/explore" className="btn-primary">{t('nav.explore')}</Link>}
          />
        ) : (
          <ListingGrid listings={saved} savedIds={savedIds} onToggleSave={handleUnsave} className="sm:grid-cols-2 xl:grid-cols-3" />
        )}
      </div>
    </div>
  )
}

export default SavedPage
