import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'

import { ArrowLeft, Banknote, Check, CreditCard, Loader2, Lock, MapPin, ShieldAlert, Truck } from 'lucide-react'
import Container from '../../components/ui/Container'
import Flag from '../../components/ui/Flag'
import TiltCard from '../../components/ui/TiltCard'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import OrderSummary from '../../components/checkout/OrderSummary'
import MobileSummary from '../../components/checkout/MobileSummary'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useCurrency } from '../../hooks/useCurrency'
import { computeTotals } from '../../utils/pricing'
import { clearDraft, generateOrderId, readDraft, saveOrder } from '../../utils/orders'
import { SHIPPING_METHODS } from '../../config/store'

const EASE = [0.22, 1, 0.36, 1]

function Section({ n, title, subtitle, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className="border border-line bg-ivory p-6 md:p-8"
    >
      <div className="mb-7 flex items-start gap-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink font-display text-sm text-bone">{n}</span>
        <div>
          <h2 className="font-display text-2xl leading-none text-ink">{title}</h2>
          {subtitle && <p className="mt-2 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

function MethodCard({ active, onSelect, icon: Icon, title, text, badge }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={`flex w-full flex-col items-start gap-4 border p-5 text-left transition-all duration-300 ${
        active ? 'border-ink bg-white shadow-card' : 'border-line bg-cream hover:border-ink/40'
      }`}
    >
      <span className="flex w-full items-start justify-between">
        <Icon size={24} strokeWidth={1.25} className="text-oxblood" />
        <span
          className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-300 ${
            active ? 'border-ink bg-ink text-bone' : 'border-line'
          }`}
        >
          {active && <Check size={12} />}
        </span>
      </span>
      <span>
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-ink">{title}</span>
          {badge && (
            <span className="bg-oxblood px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-bone">{badge}</span>
          )}
        </span>
        <span className="mt-1 block text-xs text-muted">{text}</span>
      </span>
    </button>
  )
}

function DemoCard({ name }) {
  return (
    <TiltCard max={10} className="mx-auto max-w-sm" innerClassName="rounded-2xl">
      <div className="relative aspect-[1.586] overflow-hidden rounded-2xl bg-ink p-6 text-bone shadow-3d">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-bone/10" />
        <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-bone/10" />
        <div className="relative flex items-start justify-between">
          <p className="font-display text-xl tracking-[0.2em]">ARIES</p>
          <span className="bg-oxblood px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em]">Demo</span>
        </div>
        <div className="relative mt-6 h-8 w-11 rounded-md bg-gold-light/80" />
        <p className="relative mt-5 font-mono text-lg tracking-[0.2em]">4242 •••• •••• 4242</p>
        <div className="relative mt-3 flex items-end justify-between text-[10px] uppercase tracking-[0.2em] text-bone/70">
          <span className="truncate">{name || 'Card holder'}</span>
          <span>12 / 30</span>
        </div>
      </div>
    </TiltCard>
  )
}

export default function Payment() {
  const { user } = useAuth()
  const { lines, totals, clearCart } = useCart()
  const { convert, format, currency, country } = useCurrency()
  const navigate = useNavigate()

  const [method, setMethod] = useState('cod')
  const [placing, setPlacing] = useState(false)
  const draft = readDraft()

  if (lines.length === 0) return <Navigate to="/cart" replace />
  if (!draft?.address) return <Navigate to="/checkout" replace />

  const ship = SHIPPING_METHODS.find((m) => m.id === draft.shippingId) ?? SHIPPING_METHODS[0]
    const finalTotals = computeTotals(lines, currency.code, totals.promo, convert(ship.priceBase))
  const a = draft.address

  const placeOrder = async () => {
    setPlacing(true)
    await new Promise((r) => setTimeout(r, method === 'demo' ? 1600 : 800))

    // Order ka FROZEN snapshot — baad mein currency badle to bhi yeh nahi badlega
    const order = {
      id: generateOrderId(),
      userId: user.id,
      customer: { name: user.name, email: user.email },
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      payment: {
        method,
        label: method === 'cod' ? 'Cash on Delivery' : 'Online payment (DEMO)',
        status: method === 'cod' ? 'Pay on delivery' : 'Paid · demo, no money charged',
      },
      country: { code: country.code, name: country.name },
      currency: { code: currency.code, symbol: currency.symbol, locale: country.locale },
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        image: l.product.images?.[0] ?? null,
        size: l.size,
        color: l.color,
        qty: l.qty,
        unit: l.unit,
        total: l.total,
      })),
      totals: {
        subtotal: finalTotals.subtotal,
        discount: finalTotals.discount,
        shipping: finalTotals.shipping,
        tax: finalTotals.tax,
        total: finalTotals.total,
      },
      promo: finalTotals.promo?.code ?? null,
      shippingMethod: { id: ship.id, label: ship.label, eta: ship.eta },
      address: a,
    }

    saveOrder(order)
    clearDraft()
    navigate(`/order-success/${order.id}`, { replace: true })
    clearCart()
  }

  const payLabel =
    method === 'cod' ? `Place order · ${format(finalTotals.total)}` : `Pay ${format(finalTotals.total)} · Demo`

  return (
    <section className="bg-bone">
      <Container className="py-10 md:py-14">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <Link to="/checkout" className="inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-oxblood">
              <ArrowLeft size={14} /> Back to details
            </Link>
            <h1 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">Payment</h1>
          </div>
          <CheckoutSteps current={1} />
        </div>

        <MobileSummary total={finalTotals.total}>
          <OrderSummary lines={lines} totals={finalTotals} />
        </MobileSummary>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-6 lg:col-span-7">
            {/* 1. Review */}
            <Section n="1" title="Review details" subtitle="Check everything before you place your order.">
              <div className="divide-y divide-line border border-line bg-cream">
                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex gap-3">
                    <MapPin size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-oxblood" />
                    <div className="text-sm">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Ship to</p>
                      <p className="mt-1 text-ink">{a.fullName} · {a.phone}</p>
                      <p className="text-charcoal/80">
                        {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}{a.region ? `, ${a.region}` : ''} {a.postal}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-charcoal/80">
                        <Flag code={country.code} /> {country.name}
                      </p>
                    </div>
                  </div>
                  <Link to="/checkout" className="shrink-0 text-xs underline underline-offset-4 hover:text-oxblood">Edit</Link>
                </div>

                <div className="flex items-start justify-between gap-4 px-5 py-4">
                  <div className="flex gap-3">
                    <Truck size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-oxblood" />
                    <div className="text-sm">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Delivery</p>
                      <p className="mt-1 text-ink">{ship.label}</p>
                      <p className="text-charcoal/80">{ship.eta} · Handmade to order</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-ink">{finalTotals.shipping === 0 ? 'Free' : format(finalTotals.shipping)}</span>
                </div>
              </div>
            </Section>

            {/* 2. Payment method */}
            <Section n="2" title="Payment method" subtitle="This is a demo store — no real money is ever charged." delay={0.05}>
              <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
                <MethodCard
                  active={method === 'cod'}
                  onSelect={() => setMethod('cod')}
                  icon={Banknote}
                  title="Cash on Delivery"
                  text="Pay in cash when your order arrives."
                />
                <MethodCard
                  active={method === 'demo'}
                  onSelect={() => setMethod('demo')}
                  icon={CreditCard}
                  title="Online payment"
                  badge="Demo payment"
                  text="A simulated card payment."
                />
              </div>

              <AnimatePresence initial={false}>
                {method === 'demo' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 border border-line bg-cream p-6">
                      <DemoCard name={a.fullName} />
                      <p className="mt-6 flex gap-3 border-l-2 border-oxblood bg-bone px-4 py-3 text-xs leading-relaxed text-charcoal">
                        <ShieldAlert size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-oxblood" />
                        <span>
                          <strong className="font-medium">DEMO PAYMENT</strong> — this is a simulation. No real payment is
                          processed, no money is charged and no card details are collected.
                        </span>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Section>

            {/* Total payable + place order */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="border border-line bg-ivory p-6 md:p-8"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Total payable</p>
                  <p className="mt-1 text-xs text-muted">{currency.name} ({currency.code})</p>
                </div>
                <p className="font-display text-4xl text-ink md:text-5xl">{format(finalTotals.total)}</p>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="mt-6 flex w-full items-center justify-center gap-3 bg-ink py-5 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood disabled:cursor-wait disabled:opacity-80"
              >
                {placing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {method === 'demo' ? 'Processing demo payment' : 'Placing your order'}
                  </>
                ) : (
                  <>
                    <Lock size={14} strokeWidth={1.5} /> {payLabel}
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
                By placing this order you agree to our terms. Your order is saved in {currency.code} and won't change if you
                switch country later.
              </p>
            </motion.div>
          </div>

          <aside className="hidden lg:col-span-5 lg:block">
            <div className="lg:sticky lg:top-28">
              <OrderSummary lines={lines} totals={finalTotals} />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}