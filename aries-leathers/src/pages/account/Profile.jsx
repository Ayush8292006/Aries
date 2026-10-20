import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Heart, LayoutDashboard, LogOut, Mail, Package, Pencil, ShoppingBag } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Container from '../../components/ui/Container'
import Flag from '../../components/ui/Flag'
import TiltCard from '../../components/ui/TiltCard'
import CountrySelect from '../../components/ui/CountrySelect'
import Field from '../../components/checkout/Field'
import SplitReveal from '../../components/motion/SplitReveal'
import CountUp from '../../components/motion/CountUp'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useCurrency } from '../../hooks/useCurrency'
import { getUserOrders } from '../../utils/orders'
import { formatCurrency } from '../../utils/currency'
import { SITE } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]

const stagger = (delay = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay, delayChildren } },
})
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/* ================= CARD (3D entry) ================= */
function Card({ title, subtitle, action, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={{ transformPerspective: 1200, transformOrigin: 'top' }}
      className="border border-line bg-ivory p-6 transition-shadow duration-500 hover:shadow-lift md:p-8"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl leading-none text-ink">{title}</h2>
          {subtitle && <p className="mt-2 text-xs text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  )
}

/* ================= MEMBER CARD (3D) ================= */
function MemberCard({ user, country, currency, memberSince }) {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -40, y: 30 }}
      animate={{ opacity: 1, rotateY: 0, y: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
      style={{ transformPerspective: 1400 }}
      className="w-full max-w-sm"
    >
      <TiltCard max={14} innerClassName="rounded-2xl">
        <div
          className="relative aspect-[1.6] overflow-hidden rounded-2xl bg-linear-to-br from-oxblood-light via-oxblood to-oxblood-deep p-6 text-bone shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Stitching border */}
          <div className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-bone/25" />
          <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full border border-bone/10" />

          <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(30px)' }}>
            <div>
              <p className="font-display text-xl tracking-[0.25em]">ARIES</p>
              <p className="text-[8px] uppercase tracking-[0.35em] text-gold-light">Leathers · Est. 1992</p>
            </div>
            <span className="flex items-center gap-2 rounded-full bg-ink/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]">
              <Flag code={country.code} /> {currency.code}
            </span>
          </div>

          <div className="relative mt-6 h-7 w-10 rounded-md bg-gold-light/80" style={{ transform: 'translateZ(20px)' }} />

          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between" style={{ transform: 'translateZ(40px)' }}>
            <div className="min-w-0">
              <p className="text-[9px] uppercase tracking-[0.3em] text-bone/60">Member</p>
              <p className="truncate font-display text-2xl">{user.name}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-bone/60">Since {memberSince}</p>
            </div>
            <p className="font-display text-5xl leading-none text-gold-light/90">{currency.symbol}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

/* ================= PAGE ================= */
export default function Profile() {
  const { user, logout, updateUser, isAdmin } = useAuth()
  const { country, currency, ratesMeta } = useCurrency()
  const { totals, wishlist } = useCart()
  const navigate = useNavigate()

  const orders = getUserOrders(user.id)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [nameError, setNameError] = useState('')

  const memberSince = new Date(user.createdAt).toLocaleDateString(country.locale, { month: 'long', year: 'numeric' })

  const saveName = (e) => {
    e.preventDefault()
    if (name.trim().length < 2) {
      setNameError('Enter your full name')
      return
    }
    updateUser({ name: name.trim() })
    setEditing(false)
    toast.success('Profile updated')
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    toast.success('Signed out')
  }

  const stats = [
    { label: 'Orders', value: orders.length },
    { label: 'Favourites', value: wishlist.length },
    { label: 'In cart', value: totals.count },
  ]

  const quickLinks = [
    { icon: Package, label: 'My orders', to: '/orders', count: orders.length },
    { icon: Heart, label: 'Favourites', to: '/wishlist', count: wishlist.length },
    { icon: ShoppingBag, label: 'Cart', to: '/cart', count: totals.count },
    ...(isAdmin ? [{ icon: LayoutDashboard, label: 'Admin dashboard', to: '/admin' }] : []),
  ]

  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-ink text-bone">
        <p
          aria-hidden
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-display text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(237,230,218,0.06)]"
        >
          {user.name[0]?.toUpperCase()}
        </p>

        <Container className="relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-6">
              {/* Avatar with rotating ring */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="relative grid h-24 w-24 shrink-0 place-items-center md:h-28 md:w-28"
              >
                <motion.span
                  className="absolute inset-0 rounded-full border border-dashed border-gold-light/50"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                />
                <span className="grid h-[82%] w-[82%] place-items-center rounded-full bg-linear-to-br from-oxblood-light to-oxblood-deep font-display text-4xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)] md:text-5xl">
                  {user.name[0]?.toUpperCase()}
                </span>
              </motion.div>

              <div className="min-w-0">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light"
                >
                  My account
                </motion.p>
                <h1 className="mt-2 truncate font-display text-4xl tracking-tight md:text-6xl">
                  <SplitReveal key={user.name} text={user.name} delay={0.25} />
                </h1>
              </div>
            </div>

            <motion.div
              variants={stagger(0.08, 0.5)}
              initial="hidden"
              animate="show"
              className="mt-6 flex flex-wrap items-center gap-2 text-xs"
            >
              <motion.span variants={rise} className="border border-bone/15 px-3 py-1.5 text-bone/80">{user.email}</motion.span>
              <motion.span variants={rise} className="flex items-center gap-2 border border-bone/15 px-3 py-1.5 text-bone/80">
                <Flag code={country.code} /> {country.name} · {currency.code}
              </motion.span>
              <motion.span variants={rise} className="border border-bone/15 px-3 py-1.5 text-bone/60">Member since {memberSince}</motion.span>
              {isAdmin && (
                <motion.span variants={rise} className="bg-gold-light px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
                  Admin
                </motion.span>
              )}
            </motion.div>

            <motion.div
              variants={stagger(0.1, 0.7)}
              initial="hidden"
              animate="show"
              className="mt-10 grid max-w-md grid-cols-3 divide-x divide-bone/15 border-y border-bone/15"
            >
              {stats.map((s) => (
                <motion.div key={s.label} variants={rise} className="py-5 text-center">
                  <p className="font-display text-4xl text-gold-light">
                    <CountUp to={s.value} duration={1.4} />
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-bone/50">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="flex flex-col items-center gap-6 lg:col-span-5 lg:items-end">
            <MemberCard user={user} country={country} currency={currency} memberSince={memberSince} />
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="group relative flex items-center gap-2 overflow-hidden border border-bone/30 px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone"
            >
              <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
              <LogOut size={14} strokeWidth={1.5} className="relative" />
              <span className="relative">Sign out</span>
            </motion.button>
          </div>
        </Container>
      </section>

      {/* ===== Body ===== */}
      <section className="bg-bone">
        <Container className="grid gap-6 py-10 md:py-14 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {/* Account details */}
            <Card
              title="Account details"
              subtitle="Your name appears on orders and shipping labels."
              action={
                !editing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 border border-line px-3 py-1.5 text-xs text-charcoal transition-colors hover:border-ink"
                  >
                    <Pencil size={12} /> Edit
                  </motion.button>
                )
              }
            >
              <AnimatePresence mode="wait" initial={false}>
                {editing ? (
                  <motion.form
                    key="edit"
                    onSubmit={saveName}
                    noValidate
                    initial={{ opacity: 0, rotateX: -20, y: 10 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: 20, y: -10 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ transformPerspective: 1000 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    <Field
                      label="Full name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setNameError('')
                      }}
                      error={nameError}
                      autoComplete="name"
                      className="sm:col-span-2"
                    />
                    <div className="flex gap-3 sm:col-span-2">
                      <button className="bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-oxblood">
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(false)
                          setName(user.name)
                          setNameError('')
                        }}
                        className="border border-line px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:border-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.dl
                    key="view"
                    initial={{ opacity: 0, rotateX: 20, y: -10 }}
                    animate={{ opacity: 1, rotateX: 0, y: 0 }}
                    exit={{ opacity: 0, rotateX: -20, y: 10 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    style={{ transformPerspective: 1000 }}
                    className="grid gap-px bg-line text-sm sm:grid-cols-2"
                  >
                    {[
                      ['Full name', user.name],
                      ['Email', user.email],
                    ].map(([label, value]) => (
                      <div key={label} className="bg-ivory py-3 sm:pr-6">
                        <dt className="text-[10px] uppercase tracking-[0.15em] text-muted">{label}</dt>
                        <dd className="mt-1 truncate text-ink">{value}</dd>
                      </div>
                    ))}
                  </motion.dl>
                )}
              </AnimatePresence>
            </Card>

            {/* Country & currency */}
            <Card title="Country and currency" subtitle="Prices across the whole site follow this setting." delay={0.05}>
              <div className="grid items-start gap-6 sm:grid-cols-[1fr_auto]">
                <div>
                  <CountrySelect label="Shopping from" />
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    Changing your country updates every price, your cart and checkout instantly. Past orders keep the currency
                    and total they were placed in.
                  </p>
                </div>
                <div className="flex h-full min-w-40 flex-col items-center justify-center border border-line bg-cream px-6 py-5 text-center" style={{ perspective: 600 }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currency.code}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="font-display text-6xl leading-none text-oxblood">{currency.symbol}</p>
                      <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-ink">{currency.code}</p>
                      <p className="text-[11px] text-muted">{currency.name}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <p className="mt-6 border-t border-line pt-4 text-[11px] text-muted">
                Exchange rates: {ratesMeta.source} · updated {ratesMeta.updatedAt}
              </p>
            </Card>

            {/* Recent orders */}
            <Card
              title="Recent orders"
              subtitle="Shown in the currency you paid in."
              delay={0.1}
              action={
                orders.length > 0 && (
                  <Link to="/orders" className="group inline-flex items-center gap-2 text-xs text-charcoal">
                    View all
                    <span className="h-px w-5 bg-ink transition-all duration-500 group-hover:w-10 group-hover:bg-oxblood" />
                  </Link>
                )
              }
            >
              {orders.length === 0 ? (
                <div className="flex flex-col items-start gap-4 text-sm text-muted">
                  You haven't placed an order yet.
                  <Link to="/products" className="bg-ink px-6 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone hover:bg-oxblood">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <motion.ul
                  variants={stagger(0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="divide-y divide-line border-y border-line"
                >
                  {orders.slice(0, 3).map((o) => (
                    <motion.li key={o.id} variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}>
                      <Link to={`/order-success/${o.id}`} className="group flex items-center justify-between gap-4 py-4 transition-transform duration-500 hover:translate-x-2">
                        <div className="flex min-w-0 items-center gap-4">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-oxblood transition-colors duration-500 group-hover:bg-oxblood group-hover:text-bone">
                            <Package size={16} strokeWidth={1.5} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm text-ink">{o.id}</p>
                            <p className="text-xs text-muted">
                              {new Date(o.createdAt).toLocaleDateString(o.currency.locale, { dateStyle: 'medium' })} · {o.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <div>
                            <p className="font-display text-xl text-ink">{formatCurrency(o.totals.total, o.currency.code, o.currency.locale)}</p>
                            <p className="flex items-center justify-end gap-1.5 text-[11px] text-muted">
                              <Flag code={o.country.code} /> {o.currency.code}
                            </p>
                          </div>
                          <ArrowUpRight size={16} className="text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-oxblood" />
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </Card>
          </div>

          {/* ===== Sidebar ===== */}
          <aside className="space-y-6 lg:col-span-4">
            <motion.div
              variants={stagger(0.08, 0.2)}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-px border border-line bg-line"
            >
              {quickLinks.map(({ icon: Icon, label, to, count }) => (
                <motion.div key={label} variants={rise} className="bg-ivory">
                  <Link to={to} className="group flex h-full flex-col justify-between gap-6 p-5 transition-all duration-500 hover:-translate-y-1 hover:bg-cream">
                    <span className="flex items-start justify-between">
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-line text-oxblood transition-all duration-500 group-hover:border-oxblood group-hover:bg-oxblood group-hover:text-bone">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <ArrowUpRight size={16} className="text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-oxblood" />
                    </span>
                    <span>
                      {count !== undefined && <span className="block font-display text-3xl text-ink">{count}</span>}
                      <span className="text-xs uppercase tracking-[0.15em] text-charcoal">{label}</span>
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="relative overflow-hidden bg-ink p-6 text-bone md:p-8"
            >
              <motion.span
                aria-hidden
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-bone/10"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <p className="relative font-display text-3xl">Need help?</p>
              <p className="relative mt-2 text-sm text-bone/60">
                Custom sizes, colours or an order question — we usually reply within a few hours.
              </p>
              <div className="relative mt-6 space-y-3 text-sm">
                <a href={`mailto:${SITE.email}`} className="group flex items-center gap-3 break-all text-bone/80 transition-colors hover:text-bone">
                  <Mail size={16} strokeWidth={1.5} className="shrink-0 text-gold-light transition-transform group-hover:-translate-y-0.5" /> {SITE.email}
                </a>
                <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-bone/80 transition-colors hover:text-bone">
                  <FaWhatsapp size={16} className="shrink-0 text-gold-light transition-transform group-hover:-translate-y-0.5" /> Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </aside>
        </Container>
      </section>
    </>
  )
}