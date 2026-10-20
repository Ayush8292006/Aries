import { useCurrency } from '../../hooks/useCurrency'

export default function Price({ amount, mrp, className = '' }) {
  const { formatPrice } = useCurrency()
  const discount = mrp && mrp > amount ? Math.round((1 - amount / mrp) * 100) : 0

  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${className}`}>
      <span className="font-semibold">{formatPrice(amount)}</span>
      {discount > 0 && (
        <>
          <span className="text-xs text-muted line-through">{formatPrice(mrp)}</span>
          <span className="text-xs font-medium text-offer">{discount}% OFF</span>
        </>
      )}
    </p>
  )
}