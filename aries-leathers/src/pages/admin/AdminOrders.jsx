import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Flag from '../ui/Flag'
import SmartImage from '../ui/SmartImage'
import { getOrders, updateOrderStatus } from '../../utils/orders'
import { formatCurrency } from '../../utils/currency'

const STATUSES = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
const sortByDate = (list) => [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

export default function AdminOrders() {
  const [orders, setOrders] = useState(() => sortByDate(getOrders()))
  const [openId, setOpenId] = useState(null)

  const changeStatus = (id, status) => {
    setOrders(sortByDate(updateOrderStatus(id, status)))
    toast.success(`Order marked ${status}`)
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <Package size={42} strokeWidth={1} className="text-muted" />
        <p className="mt-6 font-display text-3xl text-ink">No orders yet</p>
        <p className="mt-2 text-sm text-muted">Orders placed in this browser will appear here.</p>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-6 text-xs text-muted">Every order is shown in the currency the customer paid in.</p>
      <ul className="space-y-3">
        {orders.map((o) => {
          const fmt = (n) => formatCurrency(n, o.currency.code, o.currency.locale)
          const open = openId === o.id
          return (
            <li key={o.id} className="border border-line bg-ivory">
              <div className="grid items-center gap-4 p-5 md:grid-cols-12">
                <button onClick={() => setOpenId(open ? null : o.id)} className="flex items-center gap-3 text-left md:col-span-4" aria-expanded={open}>
                  <ChevronDown size={16} className={`shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ink">{o.id}</span>
                    <span className="block text-xs text-muted">
                      {o.customer.name} · {new Date(o.createdAt).toLocaleDateString(o.currency.locale, { dateStyle: 'medium' })}
                    </span>
                  </span>
                </button>
                <p className="text-xs text-muted md:col-span-3">{o.payment.label}</p>
                <p className="flex items-center gap-2 font-display text-xl text-ink md:col-span-2">
                  <Flag code={o.country.code} /> {fmt(o.totals.total)}
                </p>
                <div className="md:col-span-3 md:text-right">
                  <select
                    value={o.status}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                    aria-label="Order status"
                    className="border border-line bg-bone px-3 py-2 text-xs text-ink outline-none focus:border-ink"
                  >
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="grid gap-8 border-t border-line p-5 md:grid-cols-2">
                      <ul className="space-y-3">
                        {o.items.map((it) => (
                          <li key={`${it.productId}-${it.size}-${it.color}`} className="flex items-center gap-3 text-sm">
                            <div className="aspect-[4/5] w-10 shrink-0 bg-stone">
                              <SmartImage src={it.image} alt="" className="h-full w-full" />
                            </div>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-ink">{it.name}</span>
                              <span className="text-xs text-muted">{[it.size, it.color, `× ${it.qty}`].filter(Boolean).join(' · ')}</span>
                            </span>
                            <span className="text-ink">{fmt(it.total)}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Ship to</p>
                          <p className="mt-1 text-ink">
                            {o.address.fullName}, {o.address.line1}, {o.address.city} {o.address.postal}, {o.country.name}
                          </p>
                          <p className="text-xs text-muted">{o.address.phone} · {o.address.email}</p>
                        </div>
                        <div className="space-y-1 border-t border-line pt-3">
                          <div className="flex justify-between"><span className="text-muted">Subtotal</span><span>{fmt(o.totals.subtotal)}</span></div>
                          {o.totals.discount > 0 && <div className="flex justify-between"><span className="text-muted">Discount</span><span className="text-oxblood">− {fmt(o.totals.discount)}</span></div>}
                          <div className="flex justify-between"><span className="text-muted">Shipping</span><span>{o.totals.shipping === 0 ? 'Free' : fmt(o.totals.shipping)}</span></div>
                          <div className="flex justify-between font-medium"><span>Total ({o.currency.code})</span><span>{fmt(o.totals.total)}</span></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </div>
  )
}