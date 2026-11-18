import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

function SaveButton({ saved, onClick, className = '' }) {
  const { t } = useTranslation()

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? t('card.unsave') : t('card.save')}
      className={`rounded-full bg-white/90 p-2 shadow-sm backdrop-blur transition-colors hover:bg-white ${className}`}
    >
      <Heart className={`h-4 w-4 ${saved ? 'fill-red-600 text-red-600' : 'text-charcoal/70'}`} aria-hidden="true" />
    </motion.button>
  )
}

export default SaveButton
