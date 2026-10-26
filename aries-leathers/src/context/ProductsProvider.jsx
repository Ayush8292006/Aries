import { useCallback, useEffect, useMemo, useState } from 'react'
import { ProductsContext } from './ProductsContext'
import { SEED_PRODUCTS } from '../data/products'
import { readJSON, writeJSON } from '../utils/storage'
import { applySale } from '../utils/promotions'
import { usePromotions } from '../hooks/usePromotions'

// Apni purani file mein jo key thi wahi rakhna (jaise 'aries_products_v3')
const STORAGE_KEY = 'aries_products_v3'

function loadProducts() {
  const saved = readJSON(STORAGE_KEY, null)
  return Array.isArray(saved) && saved.length ? saved : SEED_PRODUCTS
}

export default function ProductsProvider({ children }) {
  // rawProducts = asli catalogue (admin yahi edit karta hai, price BASE USD)
  const [rawProducts, setRawProducts] = useState(loadProducts)
  const { getSaleFor } = usePromotions()

  // Admin ke changes refresh ke baad bhi rahein
  useEffect(() => {
    writeJSON(STORAGE_KEY, rawProducts)
  }, [rawProducts])

  // products = customer ko dikhne wale (chal rahi sale ke saath)
  const products = useMemo(() => rawProducts.map((p) => applySale(p, getSaleFor(p))), [rawProducts, getSaleFor])

  const getProduct = useCallback((id) => products.find((p) => p.id === id) ?? null, [products])
  const getRawProduct = useCallback((id) => rawProducts.find((p) => p.id === id) ?? null, [rawProducts])

  // ===== Admin — price hamesha BASE USD mein, sale ke bina =====
  const addProduct = useCallback((product) => {
    setRawProducts((prev) => [{ ...product, createdAt: new Date().toISOString() }, ...prev])
  }, [])

  const updateProduct = useCallback((id, patch) => {
    setRawProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }, [])

  const deleteProduct = useCallback((id) => {
    setRawProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const resetProducts = useCallback(() => setRawProducts(SEED_PRODUCTS), [])

  const value = useMemo(
    () => ({ products, rawProducts, getProduct, getRawProduct, addProduct, updateProduct, deleteProduct, resetProducts }),
    [products, rawProducts, getProduct, getRawProduct, addProduct, updateProduct, deleteProduct, resetProducts]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}