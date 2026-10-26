/**
 * PROMOTIONS — coupon codes aur sales ke helpers.
 * ------------------------------------------------------------
 * Saare amounts BASE CURRENCY (USD) mein store hote hain,
 * customer ko dikhate waqt unki currency mein convert hote hain.
 * Frontend demo: sab kuch isi browser ke localStorage mein save hota hai.
 */

export const COUPONS_KEY = 'aries_coupons_v1'
export const SALES_KEY = 'aries_sales_v1'

// Pehli baar ke coupons (pehle config/store.js mein PROMO_CODES the)
export const SEED_COUPONS = [
  {
    code: 'ARIES10',
    label: '10% off your order',
    type: 'percent',
    value: 10,
    minOrder: 0,
    startsAt: '',
    endsAt: '',
    maxUses: 0,
    active: true,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    code: 'WELCOME5',
    label: '5% welcome discount',
    type: 'percent',
    value: 5,
    minOrder: 0,
    startsAt: '',
    endsAt: '',
    maxUses: 0,
    active: true,
    createdAt: '2026-10-01T00:00:00.000Z',
  },
]

export const SEED_SALES = []

/** 'active' | 'scheduled' | 'expired' | 'paused' */
export function scheduleStatus(item, now = Date.now()) {
  if (!item.active) return 'paused'
  if (item.startsAt && new Date(item.startsAt).getTime() > now) return 'scheduled'
  if (item.endsAt && new Date(item.endsAt).getTime() < now) return 'expired'
  return 'active'
}

export const STATUS_STYLES = {
  active: { label: 'Live', className: 'bg-[#2F5D3A] text-bone' },
  scheduled: { label: 'Scheduled', className: 'bg-gold text-ink' },
  expired: { label: 'Ended', className: 'bg-line text-muted' },
  paused: { label: 'Paused', className: 'border border-line text-muted' },
}

/** Kya yeh sale is product par lagti hai? */
export function saleAppliesTo(sale, product) {
  if (sale.scope === 'category') return (sale.categories ?? []).includes(product.category)
  if (sale.scope === 'products') return (sale.productIds ?? []).includes(product.id)
  return true // 'all'
}

/** Product par sabse badi chal rahi sale (ya null) */
export function bestSaleFor(product, sales, now = Date.now()) {
  let best = null
  for (const s of sales) {
    if (scheduleStatus(s, now) !== 'active' || !saleAppliesTo(s, product)) continue
    if (!best || s.percent > best.percent) best = s
  }
  return best
}

/** Product par sale lagao — price kam, purana price strike ke liye */
export function applySale(product, sale) {
  if (!sale) return product
  const price = Math.round(product.price * (100 - sale.percent)) / 100
  return {
    ...product,
    price,
    regularPrice: product.price,
    mrp: Math.max(Number(product.mrp) || 0, product.price),
    tag: sale.badge?.trim() || `${sale.percent}% off`,
    sale: { id: sale.id, name: sale.name, percent: sale.percent, endsAt: sale.endsAt || null },
  }
}

/** Coupon customer ko kaise dikhe — "10% off" / "₹1,667 off" */
export function couponLabel(coupon, formatBase) {
  if (coupon.label?.trim()) return coupon.label.trim()
  return coupon.type === 'fixed' ? `${formatBase(coupon.value)} off your order` : `${coupon.value}% off your order`
}

export const normalizeCode = (code) => String(code ?? '').trim().toUpperCase()

/** datetime-local input ke liye: ISO → 'YYYY-MM-DDTHH:mm' */
export function toInputDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function formatWhen(value) {
  if (!value) return null
  return new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export const newId = (prefix) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`