export const FILTER_KEYS = ['search', 'city', 'difficulty', 'min_price', 'max_price', 'max_days', 'min_stars']

export function readFilters(searchParams) {
  return Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) ?? '']))
}
