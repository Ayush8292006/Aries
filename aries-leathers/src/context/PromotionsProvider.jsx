import { useCallback, useEffect, useMemo, useState } from 'react'
import { PromotionsContext } from './PromotionsContext'
import { readJSON, writeJSON } from '../utils/storage'
import { getOrders } from '../utils/orders'
import {
  COUPONS_KEY,
  SALES_KEY,
  SEED_COUPONS,
  SEED_SALES,
  bestSaleFor,
  couponLabel,
  formatWhen,
  newId,
  normalizeCode,
  scheduleStatus,
} from '../utils/promotions'

/** Kitne orders mein yeh code use hua (cancelled ko chhod kar) */
function countUses(code) {
  try {
    return getOrders().filter((o) => o.promo === code && o.status !== 'Cancelled').length
  } catch {
    return 0
  }
}

export default function PromotionsProvider({ children }) {
  const [coupons, setCoupons] = useState(() => readJSON(COUPONS_KEY, null) ?? SEED_COUPONS)
  const [sales, setSales] = useState(() => readJSON(SALES_KEY, null) ?? SEED_SALES)

  // Har minute "abhi" update — scheduled sale apne aap shuru / khatam ho
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => writeJSON(COUPONS_KEY, coupons), [coupons])
  useEffect(() => writeJSON(SALES_KEY, sales), [sales])

  /* ===== Coupons (admin) ===== */
  const saveCoupon = useCallback((coupon, originalCode = null) => {
    const code = normalizeCode(coupon.code)
    setCoupons((prev) => {
      const rest = prev.filter((c) => c.code !== (originalCode ?? code))
      return [{ ...coupon, code, createdAt: coupon.createdAt ?? new Date().toISOString() }, ...rest]
    })
  }, [])

  const deleteCoupon = useCallback((code) => setCoupons((prev) => prev.filter((c) => c.code !== code)), [])

  const toggleCoupon = useCallback(
    (code) => setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))),
    []
  )

  const getCoupon = useCallback((code) => coupons.find((c) => c.code === normalizeCode(code)) ?? null, [coupons])

  /**
   * Customer ka code check karo.
   * subtotal = selected currency mein; convert/format = useCurrency se
   * Returns { ok: true, promo } ya { ok: false, error }
   */
  const validateCoupon = useCallback(
    (rawCode, { subtotal = 0, convert, format }) => {
      const code = normalizeCode(rawCode)
      const coupon = coupons.find((c) => c.code === code)
      if (!coupon) return { ok: false, error: "That code isn't valid." }

      const status = scheduleStatus(coupon, now)
      if (status === 'paused') return { ok: false, error: 'This code is not active right now.' }
      if (status === 'scheduled') return { ok: false, error: `This code starts on ${formatWhen(coupon.startsAt)}.` }
      if (status === 'expired') return { ok: false, error: 'This code has expired.' }

      if (coupon.maxUses > 0 && countUses(code) >= coupon.maxUses) {
        return { ok: false, error: 'This code has reached its usage limit.' }
      }

      const min = coupon.minOrder > 0 ? convert(coupon.minOrder) : 0
      if (min > 0 && subtotal < min) {
        return { ok: false, error: `Spend ${format(min)} or more to use this code.` }
      }

      return {
        ok: true,
        promo: {
          code,
          label: couponLabel(coupon, (usd) => format(convert(usd))),
          type: coupon.type,
          percent: coupon.type === 'percent' ? Number(coupon.value) : undefined,
          amount: coupon.type === 'fixed' ? convert(Number(coupon.value)) : undefined,
        },
      }
    },
    [coupons, now]
  )

  /* ===== Sales (admin) ===== */
  const saveSale = useCallback((sale) => {
    setSales((prev) => {
      if (sale.id && prev.some((s) => s.id === sale.id)) return prev.map((s) => (s.id === sale.id ? sale : s))
      return [{ ...sale, id: newId('sale'), createdAt: new Date().toISOString() }, ...prev]
    })
  }, [])

  const deleteSale = useCallback((id) => setSales((prev) => prev.filter((s) => s.id !== id)), [])

  const toggleSale = useCallback(
    (id) => setSales((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))),
    []
  )

  /** Product par abhi kaunsi sale chal rahi hai */
  const getSaleFor = useCallback((product) => bestSaleFor(product, sales, now), [sales, now])

  /** Announcement bar ke liye chal rahi sales */
  const liveSales = useMemo(() => sales.filter((s) => scheduleStatus(s, now) === 'active'), [sales, now])

  const value = useMemo(
    () => ({
      now,
      coupons,
      saveCoupon,
      deleteCoupon,
      toggleCoupon,
      getCoupon,
      validateCoupon,
      countUses,
      sales,
      liveSales,
      saveSale,
      deleteSale,
      toggleSale,
      getSaleFor,
    }),
    [now, coupons, saveCoupon, deleteCoupon, toggleCoupon, getCoupon, validateCoupon, sales, liveSales, saveSale, deleteSale, toggleSale, getSaleFor]
  )

  return <PromotionsContext.Provider value={value}>{children}</PromotionsContext.Provider>
}