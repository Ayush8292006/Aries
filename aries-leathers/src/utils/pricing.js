import { roundForCurrency } from './currency'
import { PROMO_CODES } from '../config/store'

/**
 * lines: [{ unit, qty, total }] — sab SELECTED currency ke numbers
 * shipping: selected currency mein (already converted)
 * Returns numbers — display ke liye format() alag se karo
 */
export function computeTotals(lines, currencyCode, promoCode, shipping = 0) {
  const subtotal = roundForCurrency(lines.reduce((sum, l) => sum + l.total, 0), currencyCode)
  const promo = promoCode ? PROMO_CODES[promoCode] : null
  const discount = promo ? roundForCurrency((subtotal * promo.percent) / 100, currencyCode) : 0
  const shippingRounded = roundForCurrency(shipping, currencyCode)
  const tax = 0 // Import duties (agar lagein) delivery par customer deta hai
  const total = roundForCurrency(subtotal - discount + shippingRounded + tax, currencyCode)

  return {
    count: lines.reduce((sum, l) => sum + l.qty, 0),
    subtotal,
    discount,
    shipping: shippingRounded,
    tax,
    total,
    promo: promo ? { code: promoCode, ...promo } : null,
  }
}