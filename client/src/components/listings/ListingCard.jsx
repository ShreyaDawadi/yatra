import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatPrice, localized } from '../../utils/format'
import { RatingSummary } from '../common/Rating'
import ListingImage from './ListingImage'
import ListingFacts from './ListingFacts'
import SaveButton from './SaveButton'

function ListingCard({ listing, linkSearch = '', isSaved = false, onToggleSave }) {
  const { t, i18n } = useTranslation()
  const name = localized(listing, 'name', i18n.language)
  const unit = listing.type === 'hotel' ? t('card.perNight') : t('card.perPerson')

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-charcoal/5 transition-shadow hover:shadow-lg"
    >
      <Link to={`/listings/${listing.id}${linkSearch}`} className="flex flex-1 flex-col">
        <div className="aspect-[4/3] overflow-hidden">
          <ListingImage
            key={listing.id}
            listing={listing}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-mountain">
            {t(`types.${listing.type}`)} · {listing.city}
          </p>
          <h3 className="mt-1.5 font-display text-xl leading-snug text-charcoal group-hover:text-forest">{name}</h3>
          <ListingFacts listing={listing} className="mt-3" />

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <p>
              {listing.type === 'hotel' && <span className="mr-1 text-xs text-charcoal/60">{t('card.from')}</span>}
              <span className="text-lg font-semibold text-charcoal">{formatPrice(listing.price)}</span>
              <span className="ml-1 text-sm text-charcoal/60">{unit}</span>
            </p>
            <RatingSummary rating={listing.average_rating} count={listing.review_count} />
          </div>
        </div>
      </Link>

      {onToggleSave && (
        <SaveButton saved={isSaved} onClick={() => onToggleSave(listing.id)} className="absolute right-3 top-3" />
      )}
    </motion.article>
  )
}

export default ListingCard
