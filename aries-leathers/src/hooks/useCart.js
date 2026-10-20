import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

export function useCart() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useCart must be used inside <ShopProvider>')
  return ctx
}