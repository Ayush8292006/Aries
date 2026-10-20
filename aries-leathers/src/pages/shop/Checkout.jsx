import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Lock, ShoppingBag, Truck, Zap } from 'lucide-react'
import Container from '../../components/ui/Container'
import Flag from '../../components/ui/Flag'
import TiltCard from '../../components/ui/TiltCard'
import CountrySelect from '../../components/ui/CountrySelect'
import CheckoutSteps from '../../components/checkout/CheckoutSteps'
import OrderSummary from '../../components/checkout/OrderSummary'
import MobileSummary from '../../components/checkout/MobileSummary'
import Field from '../../components/checkout/Field'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { useCurrency } from '../../hooks/useCurrency'
import { computeTotals } from '../../utils/pricing'
import { readDraft, saveDraft } from '../../utils/orders'
import { SHIPPING_METHODS } from '../../config/store'
import { SITE } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]
const METHOD_ICONS = { standard: Truck, express: Zap }

// ===== Validation rules (har field ke liye) =====
const RULES = {
  fullName: (v) => (v.trim().length < 2 ? 'Enter your full name' : ''),
  email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? 'Enter a valid email' : ''),
  phone: (v) => {
    const d = v.replace(/\D/g, '')
    return d.length < 7 || d.length > 15 ? 'Enter a valid phone number' : ''
  },
  line1: (v) => (v.trim().length < 3 ? 'Enter your street address' : ''),
  city: (v) => (!v.trim() ? 'Enter your city' : ''),
  postal: (v) => (!v.trim() ? 'Enter your postal code' : ''),
}
const REQUIRED = Object.keys(RULES)
const SECTION_FIELDS = {
  contact: ['fullName', 'email', 'phone'],
  address: ['line1', 'city', 'postal'],
}

/** Value badalne par text upar-neeche roll hota hai */
function Rolling({ value }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
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

/* ================= SECTION CARD (3D entry) ================= */
function Section({ n, title, subtitle, complete, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={{ transformPerspective: 1200, transformOrigin: 'top' }}
      className="group/section border border-line bg-ivory p-6 transition-all duration-500 focus-within:-translate-y-1 focus-within:border-ink/40 focus-within:shadow-lift md:p-8"
    >
      <div className="mb-7 flex items-start gap-4">
        <span
          className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-sm transition-colors duration-500 ${
            complete ? 'bg-ink text-bone' : 'bg-line text-ink group-focus-within/section:bg-oxblood group-focus-within/section:text-bone'
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {complete ? (
              <motion.span key="ok" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                <Check size={15} />
              </motion.span>
            ) : (
              <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                {n}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <div>
          <h2 className="font-display text-3xl leading-none text-ink">{title}</h2>
          {subtitle && <p className="mt-2 text-xs text-muted">{subtitle}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

/* ================= PROGRESS BAR ================= */
function Progress({ percent }) {
  const done = percent === 100
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="flex items-center gap-4 border border-line bg-ivory px-6 py-4"
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors duration-500 ${
          done ? 'bg-ink text-bone' : 'border border-line text-oxblood'
        }`}
      >
        {done ? <Check size={16} /> : <Lock size={14} strokeWidth={1.5} />}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-medium uppercase tracking-[0.15em] text-ink">{done ? 'Ready for payment' : 'Your details'}</span>
          <span className="text-muted">
            <Rolling value={`${percent}%`} /> complete
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden bg-line">
          <motion.div
            className="h-full bg-linear-to-r from-oxblood to-oxblood-light"
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </div>
      </div>
    </motion.div>
  )
}

/* ================= 3D SHIPPING LABEL ================= */
function ShippingLabel({ form, country, method }) {
  const line = (value, placeholder) => (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value || placeholder}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25 }}
        className={`block truncate ${value ? 'text-ink' : 'text-muted/60'}`}
      >
        {value || placeholder}
      </motion.span>
    </AnimatePresence>
  )

  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2]

  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -30, y: 30 }}
      animate={{ opacity: 1, rotateY: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: EASE }}
      style={{ transformPerspective: 1400 }}
    >
      <TiltCard max={10}>
        <div className="relative overflow-hidden border border-ink/80 bg-[#FBF8F2] p-6 shadow-3d" style={{ transformStyle: 'preserve-3d' }}>
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-ink pb-3">
            <div>
              <p className="font-display text-xl tracking-[0.2em] text-ink">ARIES</p>
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted">Leathers · {SITE.location}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.2em] text-muted">Service</p>
              <p className="text-xs font-semibold uppercase text-ink">{method.id === 'express' ? 'Express' : 'Standard'}</p>
            </div>
          </div>

          {/* Ship to */}
          <div className="mt-4 grid grid-cols-[1fr_auto] gap-4" style={{ transform: 'translateZ(30px)' }}>
            <div className="min-w-0 text-sm leading-relaxed">
              <p className="text-[9px] uppercase tracking-[0.25em] text-oxblood">Ship to</p>
              <div className="mt-1 font-medium">{line(form.fullName, 'Your name')}</div>
              {line(form.line1, 'Street address')}
              {form.line2 && line(form.line2, '')}
              {line([form.city, form.region].filter(Boolean).join(', '), 'City, region')}
              {line(form.postal, 'Postal code')}
              <span className="mt-1 flex items-center gap-2 text-ink">
                <Flag code={country.code} /> {country.name}
              </span>
            </div>

            {/* Stamp */}
            <motion.div
              initial={{ scale: 2, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: -14 }}
              transition={{ duration: 0.6, delay: 1.1, type: 'spring', stiffness: 200 }}
              className="grid h-20 w-20 place-items-center self-start rounded-full border-2 border-oxblood text-center text-oxblood"
              style={{ transform: 'translateZ(50px)' }}
            >
              <span className="text-[8px] font-bold uppercase leading-tight tracking-[0.15em]">
                Hand
                <br />
                made
                <br />
                1992
              </span>
            </motion.div>
          </div>

          {/* Barcode */}
          <div className="mt-5 border-t border-dashed border-ink/30 pt-4">
            <div className="flex h-10 items-stretch gap-[2px]">
              {bars.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.015 }}
                  className="origin-bottom bg-ink"
                  style={{ width: w * 2 }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] uppercase tracking-[0.2em] text-muted">
              <span>{method.eta}</span>
              <span>{form.phone || 'Phone'}</span>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

/* ================= PAGE ================= */
export default function Checkout() {
  const { user } = useAuth()
  const { lines, totals } = useCart()
  const { convert, format, currency, country } = useCurrency()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => {
    const saved = readDraft()?.address ?? {}
    return {
      fullName: saved.fullName ?? user?.name ?? '',
      email: saved.email ?? user?.email ?? '',
      phone: saved.phone ?? '',
      line1: saved.line1 ?? '',
      line2: saved.line2 ?? '',
      city: saved.city ?? '',
      region: saved.region ?? '',
      postal: saved.postal ?? '',
    }
  })
  const [shippingId, setShippingId] = useState(() => readDraft()?.shippingId ?? 'standard')
  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(0)

  if (lines.length === 0) {
    return (
      <section className="bg-bone">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <ShoppingBag size={44} strokeWidth={1} className="text-muted" />
          <p className="mt-6 font-display text-3xl text-ink">Your cart is empty</p>
          <Link to="/products" className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood">
            Shop the collection
          </Link>
        </Container>
      </section>
    )
  }

  const method = SHIPPING_METHODS.find((m) => m.id === shippingId) ?? SHIPPING_METHODS[0]
  const checkoutTotals = computeTotals(lines, currency.code, totals.promo?.code ?? null, convert(method.priceBase))

  const isValid = (name) => !RULES[name](form[name])
  const percent = Math.round((REQUIRED.filter(isValid).length / REQUIRED.length) * 100)
  const sectionDone = (key) => SECTION_FIELDS[key].every(isValid)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = {}
    REQUIRED.forEach((name) => {
      const msg = RULES[name](form[name])
      if (msg) e[name] = msg
    })
    setErrors(e)
    if (Object.keys(e).length) {
      setShake((s) => s + 1)
      document.getElementById(`field-${Object.keys(e)[0]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    saveDraft({ address: form, shippingId })
    navigate('/payment')
  }

  const field = (name, label, props = {}) => (
    <div id={`field-${name}`} className={props.full ? 'sm:col-span-2' : ''}>
      <Field label={label} value={form[name]} onChange={update(name)} error={errors[name]} {...props} full={undefined} />
    </div>
  )

  return (
    <section className="overflow-hidden bg-bone">
      <Container className="py-10 md:py-14">
        {/* ===== Header ===== */}
        <div className="mb-10 flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/cart" className="group inline-flex items-center gap-2 text-xs text-muted transition-colors hover:text-oxblood">
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to cart
              </Link>
            </motion.div>
            <h1 className="mt-4 font-display text-5xl tracking-tight text-ink md:text-7xl">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE }}
                className="inline-block"
              >
                Checkout
              </motion.span>
            </h1>
          </div>
          <CheckoutSteps current={0} />
        </div>

        <MobileSummary total={checkoutTotals.total}>
          <OrderSummary lines={lines} totals={checkoutTotals} />
        </MobileSummary>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ===== Form ===== */}
          <motion.form
            key={shake}
            onSubmit={handleSubmit}
            noValidate
            animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
            transition={{ duration: 0.45 }}
            className="space-y-6 lg:col-span-7"
          >
            <Progress percent={percent} />

            <Section n="1" title="Contact" subtitle="We'll send order updates here." complete={sectionDone('contact')} delay={0.1}>
              <div className="grid gap-4 sm:grid-cols-2">
                {field('fullName', 'Full name', { autoComplete: 'name', full: true })}
                {field('email', 'Email', { type: 'email', autoComplete: 'email' })}
                {field('phone', 'Phone', { type: 'tel', autoComplete: 'tel', hint: 'For delivery updates only' })}
              </div>
            </Section>

            <Section n="2" title="Shipping address" subtitle="Watch your label fill in as you type." complete={sectionDone('address')} delay={0.2}>
              <div className="grid gap-4 sm:grid-cols-2">
                {field('line1', 'Street address', { autoComplete: 'address-line1', full: true })}
                {field('line2', 'Apartment, landmark (optional)', { autoComplete: 'address-line2', full: true })}
                {field('city', 'City', { autoComplete: 'address-level2' })}
                {field('region', 'State / Region', { autoComplete: 'address-level1' })}
                {field('postal', 'Postal code', { autoComplete: 'postal-code' })}

                <div>
                  <div className="flex h-14 items-center justify-between gap-3 border border-line bg-cream px-4">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Country / Region</p>
                      <p className="mt-0.5 flex items-center gap-2 truncate text-sm text-ink">
                        <Flag code={country.code} /> {country.name}
                      </p>
                    </div>
                    <CountrySelect variant="compact" align="right" />
                  </div>
                  <p className="mt-1.5 text-xs text-muted">Changing country updates your currency and totals.</p>
                </div>
              </div>
            </Section>

            <Section n="3" title="Delivery" subtitle="Every piece is handmade to order." complete delay={0.3}>
              <div className="grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Delivery method">
                {SHIPPING_METHODS.map((m) => {
                  const amount = convert(m.priceBase)
                  const active = shippingId === m.id
                  const Icon = METHOD_ICONS[m.id] ?? Truck
                  return (
                    <TiltCard key={m.id} max={8} glare={false}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setShippingId(m.id)}
                        className={`relative flex w-full flex-col items-start gap-4 border p-5 text-left transition-colors duration-300 ${
                          active ? 'border-transparent bg-white' : 'border-line bg-cream hover:border-ink/40'
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="ship-active"
                            className="absolute inset-0 border-2 border-ink shadow-lift"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative flex w-full items-start justify-between">
                          <motion.span
                            animate={active ? { x: [0, 6, 0] } : { x: 0 }}
                            transition={active ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                          >
                            <Icon size={24} strokeWidth={1.25} className="text-oxblood" />
                          </motion.span>
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border transition-colors duration-300 ${
                              active ? 'border-ink bg-ink text-bone' : 'border-line'
                            }`}
                          >
                            {active && <Check size={12} />}
                          </span>
                        </span>
                        <span className="relative">
                          <span className="block text-sm font-medium text-ink">{m.label}</span>
                          <span className="text-xs text-muted">{m.eta}</span>
                        </span>
                        <span className="relative font-display text-3xl text-ink">{amount === 0 ? 'Free' : format(amount)}</span>
                      </button>
                    </TiltCard>
                  )
                })}
              </div>
            </Section>

            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex w-full items-center justify-center gap-3 overflow-hidden bg-ink py-5 text-[12px] font-medium uppercase tracking-[0.2em] text-bone shadow-press"
            >
              <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2">
                Continue to payment · <Rolling value={format(checkoutTotals.total)} />
              </span>
              <ArrowRight size={15} strokeWidth={1.5} className="relative transition-transform duration-500 group-hover:translate-x-1.5" />
            </motion.button>
          </motion.form>

          {/* ===== Right column ===== */}
          <aside className="hidden lg:col-span-5 lg:block">
            <div className="space-y-8 lg:sticky lg:top-28">
              <ShippingLabel form={form} country={country} method={method} />
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              >
                <TiltCard max={3}>
                  <OrderSummary lines={lines} totals={checkoutTotals} />
                </TiltCard>
              </motion.div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  )
}