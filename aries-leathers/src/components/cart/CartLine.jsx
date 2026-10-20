import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Minus, Plus } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import { useCurrency } from '../../hooks/useCurrency'
import { MAX_QTY } from '../../config/store'

export default function CartLine({ line, compact = false, onQty, onRemove, onSave, onNavigate }) {
  const { format } = useCurrency()
  const { product } = line
  const options = [line.size && `Size ${line.size}`, line.color].filter(Boolean).join(' · ')

  return (
        <motion.li
      layout
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, x: 80, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 4 }}
      className="group flex gap-4 border-b border-line py-5"
    >
      <Link
        to={`/products/${product.id}`}
        onClick={onNavigate}
        className={`aspect-[4/5] shrink-0 overflow-hidden bg-stone ${compact ? 'w-20' : 'w-24 md:w-32'}`}
      >
        <SmartImage src={product.images?.[0]} alt={product.name} className="h-full w-full" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/products/${product.id}`}
              onClick={onNavigate}
              className={`line-clamp-2 font-display leading-snug text-ink transition-colors hover:text-oxblood ${compact ? 'text-base' : 'text-lg'}`}
            >
              {product.name}
            </Link>
            {options && <p className="mt-1 text-xs text-muted">{options}</p>}
            {!compact && <p className="mt-1 text-xs text-muted">{format(line.unit)} each</p>}
          </div>
          <p className="shrink-0 text-sm font-medium text-ink">{format(line.total)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <div className="flex items-center border border-line">
            <button
              onClick={() => onQty(line.key, line.qty - 1)}
              disabled={line.qty <= 1}
              aria-label="Decrease quantity"
              className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-stone disabled:opacity-30"
            >
              <Minus size={12} />
            </button>
            <span className="w-7 text-center text-xs" aria-live="polite">{line.qty}</span>
            <button
              onClick={() => onQty(line.key, line.qty + 1)}
              disabled={line.qty >= MAX_QTY}
              aria-label="Increase quantity"
              className="grid h-8 w-8 place-items-center text-ink transition-colors hover:bg-stone disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex gap-4 text-[11px] uppercase tracking-[0.15em]">
            {onSave && (
              <button onClick={() => onSave(line.key)} className="text-muted transition-colors hover:text-oxblood">
                Save for later
              </button>
            )}
            <button onClick={() => onRemove(line.key)} className="text-muted transition-colors hover:text-oxblood">
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  )
}