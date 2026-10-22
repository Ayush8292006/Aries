/**
 * VARIATION PRICING — sab amounts USD (base currency) mein.
 * ------------------------------------------------------------
 * product.price = sabse chhote size ka price.
 * Har size ke hisaab se EXTRA amount judta hai.
 *
 * Kisi ek product ka apna rate chahiye to products.js mein us product mein likho:
 *   sizePrices:  { S: 0, M: 5, L: 10, XL: 15, Custom: 40 },   // extra USD
 *   colorPrices: { Tan: 8 },                                 // extra USD
 * Jo product sizePrices nahi deta, us par neeche wale DEFAULT rates lagte hain.
 */

export const DEFAULT_SIZE_EXTRAS = {
  // Jackets / blazers / vests
  XXS: 0,
  XS: 2,
  S: 4,
  M: 6,
  L: 8,
  XL: 10,
  '2XL': 14,
  '3XL': 18,
  '4XL': 22,
  '5XL': 26,

  // Trousers (waist) — har size +2
  '26': 0,
  '28': 2,
  '30': 4,
  '32': 6,
  '34': 8,
  '36': 10,
  '38': 12,
  '40': 14,
  '42': 16,
  '44': 18,
  '46': 20,
  '48': 22,
  '50': 24,

  // Seat pads — har size +2
  '10"': 0,
  '12"': 2,
  '14"': 4,
  '16"': 6,
  '18"': 8,
  '20"': 10,
  '22"': 12,

  // Cushions
  'Side chair': 0,
  'Arm chair': 10,

  // Made to measure
  Custom: 35,
}

// Category ke hisaab se alag rate
const CATEGORY_OVERRIDES = {
  trousers: { Custom: 30 },
}

/** Sirf extra amount (USD) */
export function getVariantExtra(product, { size, color } = {}) {
  if (!product) return 0
  const sizeMap = product.sizePrices ?? { ...DEFAULT_SIZE_EXTRAS, ...(CATEGORY_OVERRIDES[product.category] ?? {}) }
  const sizeExtra = size ? Number(sizeMap[size] ?? 0) : 0
  const colorExtra = color ? Number(product.colorPrices?.[color] ?? 0) : 0
  return sizeExtra + colorExtra
}

/** Variation ka final price + mrp (USD) */
export function getVariantPrice(product, options = {}) {
  const extra = getVariantExtra(product, options)
  return {
    price: product.price + extra,
    mrp: product.mrp ? product.mrp + extra : undefined,
    extra,
  }
}

/** Kya is product ka price variation se badalta hai? */
export function hasVariantPricing(product) {
  if (!product) return false
  const sizeVaries = (product.sizes ?? []).some((s) => getVariantExtra(product, { size: s }) > 0)
  const colorVaries = Object.values(product.colorPrices ?? {}).some((v) => Number(v) > 0)
  return sizeVaries || colorVaries
}