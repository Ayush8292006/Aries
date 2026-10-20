import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import Container from '../../components/ui/Container'
import SmartImage from '../../components/ui/SmartImage'
import Flag from '../../components/ui/Flag'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import { useAuth } from '../../hooks/useAuth'
import { getOrder } from '../../utils/orders'
import { formatCurrency } from '../../utils/currency'

const EASE = [0.22, 1, 0.36, 1]

export default function OrderSuccess() {
  const { orderId } = useParams()
  const { user } = useAuth()
  const order = getOrder(orderId)

  if (!order || order.userId !== user.id) {
    return (
      <section className="bg-bone">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-4xl text-ink">Order not found</p>
          <Link to="/orders" className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone hover:bg-oxblood">
            View my orders
          </Link>
        </Container>
      </section>
    )
  }

  // Hamesha ORDER ki apni currency mein — current country se farak nahi padta
  const fmt = (n) => formatCurrency(n, order.currency.code, order.currency.locale)
  const a = order.address

  return (
    <section className="bg-bone">
      <Container className="py-10 md:py-16">
        <div className="mb-12 flex justify-center">
          <CheckoutSteps current={3} />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-oxblood text-bone"
          >
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.4, ease: EASE }} />
            </svg>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: EASE }}>
            <h1 className="mt-8 font-display text-4xl tracking-tight text-ink md:text-5xl">Thank you, {order.customer.name.split(' ')[0]}</h1>
            <p className="mt-3 text-sm text-muted">
              Your order <span className="font-medium text-ink">{order.id}</span> is confirmed. We'll start crafting it right away.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="mx-auto mt-12 max-w-3xl border border-line bg-ivory"
        >
          <div className="grid gap-6 border-b border-line p-6 text-sm sm:grid-cols-3 md:p-8">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Placed on</p>
              <p className="mt-1 text-ink">{new Date(order.createdAt).toLocaleString(order.currency.locale, { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Payment</p>
              <p className="mt-1 text-ink">{order.payment.label}</p>
              <p className="text-xs text-muted">{order.payment.status}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Currency</p>
              <p className="mt-1 flex items-center gap-2 text-ink">
                <Flag code={order.country.code} /> {order.currency.code} ({order.currency.symbol})
              </p>
            </div>
          </div>

          <ul className="divide-y divide-line px-6 md:px-8">
            {order.items.map((it) => (
              <li key={`${it.productId}-${it.size}-${it.color}`} className="flex gap-4 py-5">
                <div className="aspect-[4/5] w-16 shrink-0 bg-stone">
                  <SmartImage src={it.image} alt={it.name} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-ink">{it.name}</p>
                  <p className="text-xs text-muted">
                    {[it.size && `Size ${it.size}`, it.color, `Qty ${it.qty}`].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <p className="text-sm text-ink">{fmt(it.total)}</p>
              </li>
            ))}
          </ul>

          <div className="grid gap-8 border-t border-line p-6 md:grid-cols-2 md:p-8">
            <div className="text-sm">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Shipping to</p>
              <p className="mt-2 leading-relaxed text-ink">
                {a.fullName}<br />
                {a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />
                {a.city}{a.region ? `, ${a.region}` : ''} {a.postal}<br />
                {order.country.name}
              </p>
              <p className="mt-2 text-xs text-muted">{order.shippingMethod.label} · {order.shippingMethod.eta}</p>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-charcoal">Subtotal</span><span className="text-ink">{fmt(order.totals.subtotal)}</span></div>
              {order.totals.discount > 0 && (
                <div className="flex justify-between"><span className="text-charcoal">Discount · {order.promo}</span><span className="text-oxblood">− {fmt(order.totals.discount)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-charcoal">Shipping</span><span className="text-ink">{order.totals.shipping === 0 ? 'Free' : fmt(order.totals.shipping)}</span></div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink">Total</span>
                <span className="font-display text-3xl text-ink">{fmt(order.totals.total)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/orders" className="border border-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-bone">
            View my orders
          </Link>
          <Link to="/products" className="bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood">
            Continue shopping
          </Link>
        </div>
      </Container>
    </section>
  )
}