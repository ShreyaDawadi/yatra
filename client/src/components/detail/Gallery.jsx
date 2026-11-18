import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ListingImage from '../listings/ListingImage'
import PhotoCredit from './PhotoCredit'

function Gallery({ listing }) {
  const { t } = useTranslation()
  const images = [...new Set([listing.image_url, ...(listing.gallery ?? [])].filter(Boolean))]
  const credits = listing.image_credits ?? []
  const [index, setIndex] = useState(0)

  const current = images[index]
  const credit = credits.find((item) => item.url === current)

  if (images.length <= 1) {
    return (
      <div>
        <div className="aspect-[16/7] overflow-hidden rounded-lg">
          <ListingImage listing={listing} src={images[0]} />
        </div>
        <PhotoCredit credit={credit} className="mt-2" />
      </div>
    )
  }

  function go(step) {
    setIndex((value) => (value + step + images.length) % images.length)
  }

  return (
    <div>
      <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-charcoal/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <ListingImage listing={listing} src={current} />
          </motion.div>
        </AnimatePresence>

        <button type="button" onClick={() => go(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow" aria-label={t('detail.previousPhoto')}>
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => go(1)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow" aria-label={t('detail.nextPhoto')}>
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <PhotoCredit credit={credit} className="mt-2" />

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-md ring-2 ${imageIndex === index ? 'ring-gold' : 'ring-transparent opacity-70'}`}
            aria-label={t('detail.photoNumber', { index: imageIndex + 1 })}
            aria-current={imageIndex === index}
          >
            <ListingImage listing={listing} src={image} />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Gallery
