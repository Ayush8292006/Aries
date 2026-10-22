import { useCallback, useEffect, useMemo, useState } from 'react'
import { ShopContext } from './ShopContext'
import { useProducts } from '../hooks/useProducts'
import { useCurrency } from '../hooks/useCurrency'
import { readJSON, writeJSON } from '../utils/storage'
import { roundForCurrency } from '../utils/currency'
import { computeTotals } from '../utils/pricing'
import { getVariantPrice } from '../utils/variantPrice'
import { MAX_QTY, PROMO_CODES } from '../config/store'

const CART_KEY = 'aries_cart'
const WISHLIST_KEY = 'aries_wishlist'
const PROMO_KEY = 'aries_promo'

const lineKey = (productId, size, color) => [productId, size ?? '', color ?? ''].join('|')
const clampQty = (q) => Math.max(1, Math.min(MAX_QTY, q))

export default function ShopProvider({ children }) {
  const { getProduct } = useProducts()
  const { convert, currency } = useCurrency()

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

  const applyPromo = useCallback((code) => {
    const normalized = code.trim().toUpperCase()
    if (!PROMO_CODES[normalized]) return false
    setPromoCode(normalized)
    return true
  }, [])

  const removePromo = useCallback(() => setPromoCode(null), [])

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
          const product = getProduct(i.productId)
          if (!product) return null
          // Size / colour ke hisaab se base (USD) price
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

  const totals = useMemo(() => computeTotals(lines, currency.code, promoCode), [lines, currency.code, promoCode])

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
    [items, lines, totals, addItem, updateQty, removeItem, clearCart, applyPromo, removePromo, drawerOpen, openCart, closeCart, wishlist, wishlistProducts, isWishlisted, toggleWishlist, moveToWishlist]
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}