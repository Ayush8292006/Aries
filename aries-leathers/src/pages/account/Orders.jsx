import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import Container from '../../components/ui/Container'
import SmartImage from '../../components/ui/SmartImage'
import Flag from '../../components/ui/Flag'
import Reveal from '../../components/motion/Reveal'
import SplitReveal from '../../components/motion/SplitReveal'
import { useAuth } from '../../hooks/useAuth'
import { getUserOrders } from '../../utils/orders'
import { formatCurrency } from '../../utils/currency'

export default function Orders() {
  const { user } = useAuth()
  const orders = getUserOrders(user.id)

  return (
    <>
      <section className="border-b border-line bg-ivory">
        <Container className="py-14 md:py-20">
          <h1 className="font-display text-4xl tracking-tight text-ink md:text-6xl">
            <SplitReveal text="My orders" />
          </h1>
          <p className="mt-4 text-sm text-muted">Order totals are always shown in the currency you paid in.</p>
        </Container>
      </section>

      <section className="bg-bone">
        <Container className="py-12 md:py-16">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Package size={42} strokeWidth={1} className="text-muted" />
              <p className="mt-6 font-display text-3xl text-ink">No orders yet</p>
              <Link to="/products" className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((o, i) => {
                const fmt = (n) => formatCurrency(n, o.currency.code, o.currency.locale)
                const itemCount = o.items.reduce((s, it) => s + it.qty, 0)
                return (
                  <Reveal key={o.id} delay={Math.min(i, 4) * 0.06}>
                    <Link
                      to={`/order-success/${o.id}`}
                      className="group grid gap-6 border border-line bg-ivory p-6 transition-colors duration-300 hover:border-ink md:grid-cols-12 md:items-center"
                    >
                      <div className="md:col-span-4">
                        <p className="font-display text-xl text-ink">{o.id}</p>
                        <p className="mt-1 text-xs text-muted">
                          {new Date(o.createdAt).toLocaleDateString(o.currency.locale, { dateStyle: 'medium' })} · {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </p>
                        <span className="mt-3 inline-block bg-ink px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-bone">{o.status}</span>
                      </div>

                      <div className="flex -space-x-3 md:col-span-4">
                        {o.items.slice(0, 4).map((it) => (
                          <div key={`${it.productId}-${it.size}`} className="aspect-[4/5] w-12 overflow-hidden border-2 border-ivory bg-stone">
                            <SmartImage src={it.image} alt={it.name} className="h-full w-full" />
                          </div>
                        ))}
                      </div>

                      <div className="md:col-span-4 md:text-right">
                        <p className="font-display text-2xl text-ink">{fmt(o.totals.total)}</p>
                        <p className="mt-1 flex items-center gap-2 text-xs text-muted md:justify-end">
                          <Flag code={o.country.code} /> Paid in {o.currency.code} · {o.payment.label}
                        </p>
                        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink underline-offset-4 group-hover:text-oxblood group-hover:underline">
                          View details
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}