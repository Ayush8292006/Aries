import { ArrowUpRight } from 'lucide-react'
import Flag from '../ui/Flag'
import { useProducts } from '../../hooks/useProducts'
import { getOrders } from '../../utils/orders'
import { formatCurrency } from '../../utils/currency'
import { readJSON } from '../../utils/storage'
import { USERS_KEY } from '../../config/auth'
import { BASE_CURRENCY, COUNTRIES, CURRENCIES, RATES_META, STATIC_RATES } from '../../config/currency'

function Stat({ label, value, sub }) {
  return (
    <div className="border border-line bg-ivory p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-3 font-display text-4xl text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  )
}

export default function AdminOverview({ onNavigate }) {
  const { products } = useProducts()
  const orders = getOrders().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const customers = readJSON(USERS_KEY, []).filter((u) => u.role !== 'admin').length

  // Revenue har currency mein ALAG — orders kabhi convert nahi hote
  const revenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => {
      const key = o.currency.code
      acc[key] = acc[key] ?? { total: 0, locale: o.currency.locale, count: 0 }
      acc[key].total += o.totals.total
      acc[key].count += 1
      return acc
    }, {})

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Products" value={products.length} sub={`${products.filter((p) => p.featured).length} featured`} />
        <Stat label="Orders" value={orders.length} sub={`${orders.filter((o) => o.status === 'Delivered').length} delivered`} />
        <Stat label="Customers" value={customers} sub="Registered in this browser" />
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Revenue by currency */}
        <div className="border border-line bg-ivory p-6 md:p-8 lg:col-span-7">
          <p className="font-display text-2xl text-ink">Revenue by currency</p>
          <p className="mt-2 text-xs text-muted">Each order keeps the currency it was paid in — totals are never mixed or converted.</p>
          {Object.keys(revenue).length === 0 ? (
            <p className="mt-6 text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {Object.entries(revenue).map(([code, r]) => (
                <li key={code} className="flex items-center justify-between py-4">
                  <span className="flex items-center gap-3 text-sm text-ink">
                    <span className="grid h-9 w-9 place-items-center bg-cream font-display text-lg text-oxblood">{CURRENCIES[code]?.symbol}</span>
                    {code} · {r.count} {r.count === 1 ? 'order' : 'orders'}
                  </span>
                  <span className="font-display text-2xl text-ink">{formatCurrency(r.total, code, r.locale)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent orders */}
        <div className="border border-line bg-ivory p-6 md:p-8 lg:col-span-5">
          <div className="flex items-baseline justify-between">
            <p className="font-display text-2xl text-ink">Recent orders</p>
            <button onClick={() => onNavigate('orders')} className="text-xs text-charcoal underline underline-offset-4 hover:text-oxblood">View all</button>
          </div>
          {orders.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No orders yet.</p>
          ) : (
            <ul className="mt-6 space-y-4">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-ink">{o.customer.name}</p>
                    <p className="text-xs text-muted">{o.id}</p>
                  </div>
                  <p className="flex items-center gap-2 text-ink">
                    <Flag code={o.country.code} /> {formatCurrency(o.totals.total, o.currency.code, o.currency.locale)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Exchange rates */}
      <div className="border border-line bg-ivory p-6 md:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-ink">Exchange rates</p>
            <p className="mt-2 text-xs text-muted">
              {RATES_META.source} · base {BASE_CURRENCY} · updated {RATES_META.updatedAt}. Edit in <code className="bg-cream px-1">src/config/currency.js</code>.
            </p>
          </div>
          <button onClick={() => onNavigate('products')} className="flex items-center gap-1 text-xs text-charcoal underline underline-offset-4 hover:text-oxblood">
            Manage products <ArrowUpRight size={12} />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(STATIC_RATES).map(([code, rate]) => {
            const c = COUNTRIES.find((x) => x.currency === code)
            return (
              <div key={code} className="bg-ivory p-4">
                <p className="flex items-center gap-2 text-xs text-muted">{c && <Flag code={c.code} />} {code}</p>
                <p className="mt-1 font-display text-xl text-ink">{rate}</p>
                <p className="text-[10px] text-muted">per 1 {BASE_CURRENCY}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}