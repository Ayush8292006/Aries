import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

export function useWishlist() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useWishlist must be used inside <ShopProvider>')
  return ctx
}