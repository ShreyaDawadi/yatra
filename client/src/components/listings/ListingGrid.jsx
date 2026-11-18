import ListingCard from './ListingCard'

export function ListingGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-lg bg-white ring-1 ring-charcoal/5">
          <div className="aspect-[4/3] animate-pulse bg-charcoal/10" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-charcoal/10" />
            <div className="h-5 w-2/3 animate-pulse rounded bg-charcoal/10" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-charcoal/10" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ListingGrid({ listings, linkSearch = '', savedIds, onToggleSave, className = 'sm:grid-cols-2 xl:grid-cols-3' }) {
  return (
    <div className={`grid gap-6 ${className}`}>
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          linkSearch={linkSearch}
          isSaved={savedIds?.has(listing.id) ?? false}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  )
}

export default ListingGrid
