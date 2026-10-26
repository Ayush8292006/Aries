import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { LayoutDashboard, Package, Percent, ShoppingBag, Ticket } from 'lucide-react'
import Container from '../../components/ui/Container'
import AdminOverview from '../../components/admin/AdminOverview'
import AdminProducts from '../../components/admin/AdminProducts'
import AdminOrders from '../../components/admin/AdminOrders'
import AdminCoupons from '../../components/admin/AdminCoupons'
import AdminSales from '../../components/admin/AdminSales'
import { useAuth } from '../../hooks/useAuth'
import { usePromotions } from '../../hooks/usePromotions'
import { scheduleStatus } from '../../utils/promotions'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'sales', label: 'Sales', icon: Percent },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const { sales, coupons, now } = usePromotions()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'overview'

  // Tab par chhota number — kitni live hain
  const liveCount = {
    sales: sales.filter((s) => scheduleStatus(s, now) === 'active').length,
    coupons: coupons.filter((c) => scheduleStatus(c, now) === 'active').length,
  }

  return (
    <>
      <section className="bg-ink text-bone">
        <Container className="pt-12 md:pt-16">
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-light">Admin · Demo mode</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight md:text-6xl">Dashboard</h1>
          <p className="mt-3 text-sm text-bone/60">
            Signed in as {user.name}. Everything here is stored in this browser only.
          </p>

          <nav className="mt-10 flex gap-1 overflow-x-auto" aria-label="Admin sections" data-lenis-prevent>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  onClick={() => setParams(id === 'overview' ? {} : { tab: id }, { replace: true })}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-5 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    active ? 'text-bone' : 'text-bone/50 hover:text-bone'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} /> {label}
                  {liveCount[id] > 0 && (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-ink">
                      {liveCount[id]}
                    </span>
                  )}
                  {active && <motion.span layoutId="admin-tab" className="absolute inset-x-0 bottom-0 h-[2px] bg-gold-light" />}
                </button>
              )
            })}
          </nav>
        </Container>
      </section>

      <section className="min-h-[60vh] bg-bone">
        <Container className="py-10 md:py-14">
          {tab === 'overview' && <AdminOverview onNavigate={(t) => setParams({ tab: t }, { replace: true })} />}
          {tab === 'products' && <AdminProducts />}
          {tab === 'orders' && <AdminOrders />}
          {tab === 'sales' && <AdminSales />}
          {tab === 'coupons' && <AdminCoupons />}
        </Container>
      </section>
    </>
  )
}