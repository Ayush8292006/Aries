import { useContext } from 'react'
import { PromotionsContext } from '../context/PromotionsContext'

export function usePromotions() {
  const ctx = useContext(PromotionsContext)
  if (!ctx) throw new Error('usePromotions must be used inside <PromotionsProvider>')
  return ctx
}