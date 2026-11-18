import { useState } from 'react'
import { typeMeta } from '../../utils/listingTypes'
import MountainArt from '../common/MountainArt'

function ListingImage({ listing, src, className = '' }) {
  const [failed, setFailed] = useState(false)
  const meta = typeMeta(listing?.type)
  const Icon = meta.icon
  const imageUrl = src ?? listing?.image_url

  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={listing?.name ?? ''}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${meta.tone} ${className}`}>
      <MountainArt className="absolute inset-0 h-full w-full" />
      <Icon className="absolute left-4 top-4 h-6 w-6 text-cream/80" aria-hidden="true" />
    </div>
  )
}

export default ListingImage
