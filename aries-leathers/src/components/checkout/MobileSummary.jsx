import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, ShoppingBag } from 'lucide-react'
import { useCurrency } from '../../hooks/useCurrency'

/** Mobile par order summary ek band bar mein — tap karke kholo */
export default function MobileSummary({ total, children }) {
  const [open, setOpen] = useState(false)
  const { format } = useCurrency()

  return (
    <div className="mb-8 lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border border-line bg-ivory px-5 py-4 text-sm"
      >
        <span className="flex items-center gap-2 text-ink">
          <ShoppingBag size={16} strokeWidth={1.5} />
          {open ? 'Hide' : 'Show'} order summary
          <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </span>
        <span className="font-display text-xl text-ink">{format(total)}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}