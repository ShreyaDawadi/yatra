export function toNumber(value) {
  if (value === null || value === undefined || value === '') {
    return null
  }
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function formatPrice(value) {
  const number = toNumber(value)
  if (number === null) {
    return ''
  }
  return `$${number.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
}

export function formatDate(dateString, language = 'en') {
  if (!dateString) {
    return ''
  }
  const date = new Date(`${String(dateString).slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return String(dateString)
  }
  return date.toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

export function daysBetween(fromDate, toDate) {
  const from = new Date(`${fromDate}T00:00:00Z`)
  const to = new Date(`${toDate}T00:00:00Z`)
  return Math.round((to - from) / 86400000)
}

export function todayInNepal() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kathmandu' })
}

export function localized(item, field, language) {
  if (!item) {
    return ''
  }
  if (language === 'ne' && item[`${field}_np`]) {
    return item[`${field}_np`]
  }
  return item[field] ?? ''
}

export function firstName(fullName = '') {
  return fullName.trim().split(/\s+/)[0] || ''
}
