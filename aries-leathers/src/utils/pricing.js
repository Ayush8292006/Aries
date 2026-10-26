import { roundForCurrency } from './currency'

/**
 * lines: [{ unit, qty, total }] — sab SELECTED currency ke numbers
 * promo: null ya { code, label, type: 'percent' | 'fixed', percent?, amount? }
 *        (fixed ka amount pehle se selected currency mein convert hota hai)
 * shipping: selected currency mein (already converted)
 * Returns numbers — display ke liye format() alag se karo
 */
export function computeTotals(lines, currencyCode, promo = null, shipping = 0) {
  const subtotal = roundForCurrency(lines.reduce((sum, l) => sum + l.total, 0), currencyCode)

  const validPromo = promo && typeof promo === 'object' ? promo : null
  let discount = 0
  if (validPromo?.type === 'fixed') discount = Math.min(Number(validPromo.amount) || 0, subtotal)
  else if (validPromo) discount = (subtotal * (Number(validPromo.percent) || 0)) / 100
  discount = roundForCurrency(discount, currencyCode)

  const shippingRounded = roundForCurrency(shipping, currencyCode)
  const tax = 0 // Import duties (agar lagein) delivery par customer deta hai
  const total = roundForCurrency(Math.max(0, subtotal - discount) + shippingRounded + tax, currencyCode)

  return {
    count: lines.reduce((sum, l) => sum + l.qty, 0),
    subtotal,
    discount,
    shipping: shippingRounded,
    tax,
    total,
    promo: validPromo,
  }
}