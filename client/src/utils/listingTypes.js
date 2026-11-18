import { BedDouble, Landmark, Mountain } from 'lucide-react'

export const TYPE_META = {
  trek: { icon: Mountain, path: '/treks', tone: 'bg-forest' },
  hotel: { icon: BedDouble, path: '/hotels', tone: 'bg-mountain' },
  sightseeing: { icon: Landmark, path: '/tours', tone: 'bg-charcoal' },
}

export const DIFFICULTIES = ['easy', 'moderate', 'challenging', 'strenuous']

export function typeMeta(type) {
  return TYPE_META[type] ?? TYPE_META.trek
}
