import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag, X } from 'lucide-react'
import CartLine from './CartLine'
import { useCart } from '../../hooks/useCart'
import { useCurrency } from '../../hooks/useCurrency'

const EASE = [0.22, 1, 0.36, 1]

export default function CartDrawer() {
  const { drawerOpen, closeCart, lines, totals, updateQty, removeItem } = useCart()
  const { format, currency } = useCurrency()

  useEffect(() => {
    if (!drawerOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [drawerOpen, closeCart])

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bone shadow-3d"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <p className="font-display text-2xl text-ink">
                Your cart <span className="text-base text-muted">({totals.count})</span>
              </p>
              <button onClick={closeCart} aria-label="Close cart" className="p-1 text-ink transition-transform duration-300 hover:rotate-90">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <ShoppingBag size={36} strokeWidth={1} className="text-muted" />
                <p className="mt-5 font-display text-2xl text-ink">Your cart is empty</p>
                <Link
                  to="/products"
                  onClick={closeCart}
                  className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
                >
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartLine key={line.key} line={line} compact onQty={updateQty} onRemove={removeItem} onNavigate={closeCart} />
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-line bg-ivory px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink">Subtotal</span>
                    <span className="font-display text-2xl text-ink">{format(totals.subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    In {currency.code}. Free shipping · Promo codes at checkout.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <Link
                      to="/cart"
                      onClick={closeCart}
                      className="border border-ink py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-bone"
                    >
                      View cart
                    </Link>
                    <Link
                      to="/checkout"
                      onClick={closeCart}
                      className="bg-ink py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}