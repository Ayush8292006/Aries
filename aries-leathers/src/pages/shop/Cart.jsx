import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Lock, RotateCcw, ShoppingBag, Tag, Truck, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '../../components/ui/Container'
import Flag from '../../components/ui/Flag'
import CartLine from '../../components/cart/CartLine'
import SplitReveal from '../../components/motion/SplitReveal'
import { useCart } from '../../hooks/useCart'
import { useCurrency } from '../../hooks/useCurrency'

const EASE = [0.22, 1, 0.36, 1]

/** Value badalne par number upar-neeche roll hota hai */
function Rolling({ value, className = '' }) {
  return (
    <span className={`relative inline-flex overflow-hidden align-bottom ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Row({ label, value, muted = false, accent = false }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex items-baseline justify-between overflow-hidden py-2 text-sm"
    >
      <span className={muted ? 'text-muted' : 'text-charcoal'}>{label}</span>
      <span className={accent ? 'font-medium text-oxblood' : muted ? 'text-muted' : 'text-ink'}>
        {typeof value === 'string' && !muted ? <Rolling value={value} /> : value}
      </span>
    </motion.div>
  )
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="flex flex-col items-center py-20 text-center"
    >
      <motion.div
        animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
        style={{ transformOrigin: 'top center' }}
        className="grid h-24 w-24 place-items-center rounded-full border border-line bg-ivory"
      >
        <ShoppingBag size={38} strokeWidth={1} className="text-oxblood" />
      </motion.div>
      <p className="mt-8 font-display text-4xl text-ink">Your cart is empty</p>
      <p className="mt-2 max-w-xs text-sm text-muted">Find a piece you'll wear for years.</p>
      <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} className="mt-8">
        <Link
          to="/products"
          className="group relative inline-flex items-center gap-3 overflow-hidden bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone"
        >
          <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
          <span className="relative">Shop the collection</span>
          <ArrowRight size={15} strokeWidth={1.5} className="relative transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function Cart() {
  const { lines, totals, updateQty, removeItem, moveToWishlist, applyPromo, removePromo } = useCart()
  const { format, country, currency } = useCurrency()
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [shake, setShake] = useState(0)

  const handlePromo = (e) => {
    e.preventDefault()
    if (!code.trim()) {
      setCodeError('Enter a promo code')
      setShake((s) => s + 1)
      return
    }
    if (applyPromo(code)) {
      toast.success('Promo code applied')
      setCode('')
      setCodeError('')
    } else {
      setCodeError("That code isn't valid. Try ARIES10.")
      setShake((s) => s + 1)
    }
  }

  const handleRemove = (key) => {
    removeItem(key)
    toast.success('Removed from cart')
  }

  const handleSave = (key) => {
    moveToWishlist(key)
    toast.success('Saved to favourites')
  }

  return (
    <>
      {/* ===== Header ===== */}
      <section className="border-b border-line bg-ivory">
        <Container className="flex flex-wrap items-end justify-between gap-6 py-14 md:py-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
            >
              Shopping bag
            </motion.p>
            <h1 className="mt-3 font-display text-5xl tracking-tight text-ink md:text-7xl">
              <SplitReveal text="Your cart" />
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="flex items-baseline gap-2 text-sm text-muted"
          >
            <span className="font-display text-3xl text-ink">
              <Rolling value={totals.count} />
            </span>
            {totals.count === 1 ? 'item' : 'items'}
          </motion.p>
        </Container>
      </section>

      <section className="bg-bone">
        <Container className="py-12 md:py-16">
          {lines.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid gap-12 lg:grid-cols-12">
              {/* ===== Items ===== */}
              <div className="lg:col-span-7 xl:col-span-8">
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
                  className="border-t border-line"
                >
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <CartLine key={line.key} line={line} onQty={updateQty} onRemove={handleRemove} onSave={handleSave} />
                    ))}
                  </AnimatePresence>
                </motion.ul>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Link to="/products" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
                    Continue shopping
                    <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
                  </Link>
                </motion.div>
              </div>

              {/* ===== Summary ===== */}
              <motion.aside
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                className="lg:col-span-5 xl:col-span-4"
              >
                <div className="border border-line bg-ivory p-6 shadow-card md:p-8 lg:sticky lg:top-28">
                  <p className="font-display text-3xl text-ink">Order summary</p>
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                    <Flag code={country.code} /> {country.name} · {currency.code} ({currency.symbol})
                  </p>

                  <div className="mt-6 border-t border-line pt-4">
                    <AnimatePresence initial={false}>
                      <Row key="sub" label={`Subtotal (${totals.count})`} value={format(totals.subtotal)} />
                      {totals.promo && (
                        <Row key="disc" label={`Discount · ${totals.promo.code}`} value={`− ${format(totals.discount)}`} accent />
                      )}
                      <Row key="ship" label="Shipping" value={totals.shipping === 0 ? 'Free' : format(totals.shipping)} />
                      <Row key="duty" label="Import duties" value="Paid on delivery, if any" muted />
                    </AnimatePresence>
                  </div>

                  <motion.div layout className="mt-4 flex items-baseline justify-between border-t border-line pt-5">
                    <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink">Total</span>
                    <span className="font-display text-4xl text-ink">
                      <Rolling value={format(totals.total)} />
                    </span>
                  </motion.div>

                  {/* Promo */}
                  <motion.div layout className="mt-6">
                    <AnimatePresence mode="wait" initial={false}>
                      {totals.promo ? (
                        <motion.div
                          key="applied"
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                          className="flex items-center justify-between border border-dashed border-oxblood/40 bg-bone px-4 py-3 text-sm"
                        >
                          <span className="flex items-center gap-2 text-oxblood">
                            <motion.span initial={{ rotate: -90 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
                              <Tag size={14} />
                            </motion.span>
                            {totals.promo.code} · {totals.promo.label}
                          </span>
                          <button onClick={removePromo} aria-label="Remove promo code" className="text-muted transition-transform hover:rotate-90 hover:text-oxblood">
                            <X size={16} />
                          </button>
                        </motion.div>
                      ) : (
                        <motion.form
                          key={`form-${shake}`}
                          onSubmit={handlePromo}
                          noValidate
                          initial={{ opacity: 0 }}
                          animate={shake ? { opacity: 1, x: [0, -8, 8, -5, 5, 0] } : { opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className={`flex border bg-bone transition-colors ${codeError ? 'border-oxblood-light' : 'border-line focus-within:border-ink'}`}>
                            <input
                              value={code}
                              onChange={(e) => {
                                setCode(e.target.value)
                                setCodeError('')
                              }}
                              placeholder="Promo code"
                              aria-label="Promo code"
                              className="w-full bg-transparent px-4 py-3 text-sm uppercase text-ink outline-none placeholder:normal-case placeholder:text-muted"
                            />
                            <button className="px-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood">Apply</button>
                          </div>
                          {codeError && <p className="mt-1.5 text-xs text-oxblood-light">{codeError}</p>}
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div layout whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="mt-6">
                    <Link
                      to="/checkout"
                      className="group relative flex items-center justify-center gap-3 overflow-hidden bg-ink py-5 text-[12px] font-medium uppercase tracking-[0.2em] text-bone"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
                      <span className="relative">Proceed to checkout</span>
                      <ArrowRight size={15} strokeWidth={1.5} className="relative transition-transform duration-500 group-hover:translate-x-1.5" />
                    </Link>
                  </motion.div>

                  <motion.ul
                    layout
                    initial="hidden"
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } } }}
                    className="mt-6 space-y-2.5 border-t border-line pt-5 text-xs text-muted"
                  >
                    {[
                      { icon: Lock, text: 'Secure demo checkout — no real payment' },
                      { icon: Truck, text: 'Free worldwide shipping from India' },
                      { icon: RotateCcw, text: 'Returns accepted within 14 days' },
                    ].map(({ icon: Icon, text }) => (
                      <motion.li
                        key={text}
                        variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                        className="flex items-center gap-3"
                      >
                        <Icon size={14} strokeWidth={1.5} className="text-oxblood" /> {text}
                      </motion.li>
                    ))}
                  </motion.ul>

                  <p className="mt-5 text-center text-[11px] leading-relaxed text-muted">
                    Changing your country updates every price instantly — your items stay in the cart.
                  </p>
                </div>
              </motion.aside>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}