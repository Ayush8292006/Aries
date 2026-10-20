import { BASE_CURRENCY, CURRENCIES, STATIC_RATES } from '../config/currency'

/** Har currency ke decimal rule ke hisaab se round karo (INR/JPY → 0, baaki → 2) */
export function roundForCurrency(amount, currencyCode) {
  const decimals = CURRENCIES[currencyCode]?.decimals ?? 2
  const factor = 10 ** decimals
  return Math.round((Number(amount) + Number.EPSILON) * factor) / factor
}

/**
 * Amount ko ek currency se doosri mein convert karo.
 * Returns a NUMBER (formatted string nahi) — calculations ke liye safe.
 *
 * convertCurrency(59.99, 'INR')  →  4999
 */
export function convertCurrency(amount, toCurrency, { from = BASE_CURRENCY, rates = STATIC_RATES } = {}) {
  const value = Number(amount)
  if (!Number.isFinite(value)) return 0

  const fromRate = rates[from]
  const toRate = rates[toCurrency]
  if (!fromRate || !toRate) {
    throw new Error(`Missing exchange rate for ${!fromRate ? from : toCurrency}`)
  }

  const inBase = value / fromRate
  return roundForCurrency(inBase * toRate, toCurrency)
}

// Intl formatters banana mehenga hai, isliye cache karte hain
const formatterCache = new Map()

function getFormatter(locale, currencyCode) {
  const key = `${locale}|${currencyCode}`
  if (!formatterCache.has(key)) {
    const decimals = CURRENCIES[currencyCode]?.decimals ?? 2
    formatterCache.set(
      key,
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    )
  }
  return formatterCache.get(key)
}

/**
 * Number ko currency string mein badlo. Sirf DISPLAY ke liye.
 * Symbol hamesha hamari config se aata hai (C$, A$, د.إ etc.)
 *
 * formatCurrency(4999, 'INR', 'en-IN')   →  "₹4,999"
 * formatCurrency(59.99, 'USD', 'en-US')  →  "$59.99"
 */
export function formatCurrency(amount, currencyCode, locale = 'en-US') {
  const value = Number.isFinite(Number(amount)) ? Number(amount) : 0
  const symbol = CURRENCIES[currencyCode]?.symbol

  return getFormatter(locale, currencyCode)
    .formatToParts(value)
    .map((part) => (part.type === 'currency' && symbol ? symbol : part.value))
    .join('')
    .trim()
}