import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShopContext } from './ShopContext'
import { useProducts } from '../hooks/useProducts'
import { useCurrency } from '../hooks/useCurrency'
import { usePromotions } from '../hooks/usePromotions'
import { readJSON, writeJSON } from '../utils/storage'
import { roundForCurrency } from '../utils/currency'
import { computeTotals } from '../utils/pricing'
import { getVariantPrice } from '../utils/variantPrice'
import { normalizeCode } from '../utils/promotions'
import { MAX_QTY } from '../config/store'

const CART_KEY = 'aries_cart'
const WISHLIST_KEY = 'aries_wishlist'
const PROMO_KEY = 'aries_promo'

const lineKey = (productId, size, color) => [productId, size ?? '', color ?? ''].join('|')
const clampQty = (q) => Math.max(1, Math.min(MAX_QTY, q))

export default function ShopProvider({ children }) {
  const { getProduct } = useProducts()
  const { convert, format, currency } = useCurrency()
  const { validateCoupon } = usePromotions()

  // Cart mein sirf IDs + options — price kabhi store nahi hota
  const [items, setItems] = useState(() => readJSON(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => readJSON(WISHLIST_KEY, []))
  const [promoCode, setPromoCode] = useState(() => readJSON(PROMO_KEY, null))
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => writeJSON(CART_KEY, items), [items])
  useEffect(() => writeJSON(WISHLIST_KEY, wishlist), [wishlist])
  useEffect(() => writeJSON(PROMO_KEY, promoCode), [promoCode])

  // ===== Cart actions =====
  const addItem = useCallback(({ productId, size = null, color = null, qty = 1 }) => {
    const key = lineKey(productId, size, color)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) return prev.map((i) => (i.key === key ? { ...i, qty: clampQty(i.qty + qty) } : i))
      return [...prev, { key, productId, size, color, qty: clampQty(qty) }]
    })
  }, [])

  const updateQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: clampQty(qty) } : i)))
  }, [])

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setPromoCode(null)
  }, [])

  const openCart = useCallback(() => setDrawerOpen(true), [])
  const closeCart = useCallback(() => setDrawerOpen(false), [])

  // ===== Wishlist actions =====
  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist])

  /** Returns true agar add hua, false agar remove hua */
  const toggleWishlist = useCallback(
    (id) => {
      const has = wishlist.includes(id)
      setWishlist((prev) => (has ? prev.filter((x) => x !== id) : [...prev, id]))
      return !has
    },
    [wishlist]
  )

  const moveToWishlist = useCallback(
    (key) => {
      const item = items.find((i) => i.key === key)
      if (!item) return
      setWishlist((prev) => (prev.includes(item.productId) ? prev : [...prev, item.productId]))
      setItems((prev) => prev.filter((i) => i.key !== key))
    },
    [items]
  )

  // ===== Derived (selected currency mein) =====
  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const product = getProduct(i.productId) // chal rahi sale pehle se lagi hoti hai
          if (!product) return null
          const { price: basePrice, extra: baseExtra } = getVariantPrice(product, { size: i.size, color: i.color })
          const unit = convert(basePrice) // pehle unit convert...
          return {
            ...i,
            product,
            basePrice,
            baseExtra,
            unit,
            total: roundForCurrency(unit * i.qty, currency.code), // ...phir × qty
          }
        })
        .filter(Boolean),
    [items, getProduct, convert, currency.code]
  )

  const subtotal = useMemo(
    () => roundForCurrency(lines.reduce((sum, l) => sum + l.total, 0), currency.code),
    [lines, currency.code]
  )

  // Lagaya hua code abhi bhi valid hai? (expire / minimum order / band — sab check)
  const promoCheck = useMemo(
    () => (promoCode ? validateCoupon(promoCode, { subtotal, convert, format }) : null),
    [promoCode, validateCoupon, subtotal, convert, format]
  )

  const totals = useMemo(() => {
    const t = computeTotals(lines, currency.code, promoCheck?.ok ? promoCheck.promo : null)
    return { ...t, promoError: promoCheck && !promoCheck.ok ? promoCheck.error : null, pendingCode: promoCode }
  }, [lines, currency.code, promoCheck, promoCode])

  // ===== Promo actions =====
  /** Code ka error message (ya null agar valid hai) */
  const getPromoError = useCallback(
    (code) => {
      if (!code?.trim()) return 'Enter a promo code'
      const res = validateCoupon(code, { subtotal, convert, format })
      return res.ok ? null : res.error
    },
    [validateCoupon, subtotal, convert, format]
  )

  /** true agar code lag gaya */
  const applyPromo = useCallback(
    (code) => {
      if (getPromoError(code)) return false
      setPromoCode(normalizeCode(code))
      return true
    },
    [getPromoError]
  )

  const removePromo = useCallback(() => setPromoCode(null), [])

  const wishlistProducts = useMemo(() => wishlist.map(getProduct).filter(Boolean), [wishlist, getProduct])

  const value = useMemo(
    () => ({
      // cart
      items,
      lines,
      totals,
      addItem,
      updateQty,
      removeItem,
      clearCart,
      applyPromo,
      removePromo,
      getPromoError,
      drawerOpen,
      openCart,
      closeCart,
      // wishlist
      wishlist,
      wishlistProducts,
      isWishlisted,
      toggleWishlist,
      moveToWishlist,
    }),
    [items, lines, totals, addItem, updateQty, removeItem, clearCart, applyPromo, removePromo, getPromoError, drawerOpen, openCart, closeCart, wishlist, wishlistProducts, isWishlisted, toggleWishlist, moveToWishlist]
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}