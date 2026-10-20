import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProductsContext } from './ProductsContext'
import { SEED_PRODUCTS } from '../data/products'
import { readJSON, writeJSON } from '../utils/storage'

const STORAGE_KEY = 'aries_products_v3'

function loadProducts() {
  const saved = readJSON(STORAGE_KEY, null)
  return Array.isArray(saved) && saved.length ? saved : SEED_PRODUCTS
}

export default function ProductsProvider({ children }) {
  const [products, setProducts] = useState(loadProducts)

  // Admin ke changes refresh ke baad bhi rahein
  useEffect(() => {
    writeJSON(STORAGE_KEY, products)
  }, [products])

  const getProduct = useCallback((id) => products.find((p) => p.id === id) ?? null, [products])

  // ===== Admin (Step 7) — price hamesha BASE USD mein =====
  const addProduct = useCallback((product) => {
    setProducts((prev) => [{ ...product, createdAt: new Date().toISOString() }, ...prev])
  }, [])

  const updateProduct = useCallback((id, patch) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const resetProducts = useCallback(() => setProducts(SEED_PRODUCTS), [])

  const value = useMemo(
    () => ({ products, getProduct, addProduct, updateProduct, deleteProduct, resetProducts }),
    [products, getProduct, addProduct, updateProduct, deleteProduct, resetProducts]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}