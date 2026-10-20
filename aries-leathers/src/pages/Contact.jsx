import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, Clock, HelpCircle, Mail, MapPin, MessageSquare, Package, Phone, Plus, Ruler, Scissors, Send, Truck } from 'lucide-react'
import { FaEtsy, FaFacebookF, FaInstagram, FaPinterestP, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Container from '../components/ui/Container'
import SmartImage from '../components/ui/SmartImage'
import TiltCard from '../components/ui/TiltCard'
import Field from '../components/checkout/Field'
import Reveal from '../components/motion/Reveal'
import SplitReveal from '../components/motion/SplitReveal'
import { useAuth } from '../hooks/useAuth'
import { SITE } from '../config/site'

const EASE = [0.22, 1, 0.36, 1]
const MAX_MESSAGE = 600

// Contact hero ki photo — koi bhi Etsy photo URL yahan daal sakte ho
const CONTACT_IMAGE = 'https://i.etsystatic.com/46094302/r/il/00f65c/8740120179/il_794xN.8740120179_s5ky.jpg'

const TOPICS = [
  { label: 'Custom order', icon: Scissors },
  { label: 'Order question', icon: Package },
  { label: 'Sizing help', icon: Ruler },
  { label: 'Something else', icon: HelpCircle },
]

const CHANNELS = [
  { icon: FaWhatsapp, label: 'WhatsApp', value: 'Fastest reply', href: `https://wa.me/${SITE.whatsapp}`, external: true },
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, '')}` },
  { icon: FaEtsy, label: 'Etsy', value: 'Message us on Etsy', href: SITE.socials.etsy, external: true },
]

const STEPS = [
  { icon: MessageSquare, title: 'Message us', text: 'Tell us the piece, the colour and any design changes you have in mind.' },
  { icon: Ruler, title: 'Share measurements', text: 'Chest, shoulder and sleeve for jackets; waist, hips, rise and inseam for trousers.' },
  { icon: Truck, title: 'We craft and ship', text: 'Your piece is cut and stitched by hand, then shipped worldwide in 6–9 working days.' },
]

const FAQS = [
  { q: 'Can I order a custom size?', a: 'Yes. Choose "Custom" when selecting your size, then send us your measurements — chest, shoulder and sleeve for jackets; waist, hips, thigh, rise and inseam for trousers.' },
  { q: 'Can I get a design in a different colour?', a: 'Most designs can be made in black, white, grey, navy, blue, several browns and tans, reds and pink. Message us with the colour you have in mind.' },
  { q: 'How long does delivery take?', a: 'Every piece is made to order and usually dispatched within 6–9 working days, with free tracked shipping from India.' },
  { q: 'What is your return policy?', a: 'Returns are accepted within 14 days if the item is unused and in its original condition. Return shipping is paid by the buyer. Custom-made orders cannot be returned.' },
  { q: 'Will I pay customs or import duties?', a: 'Depending on your country, import duties or taxes may be charged on delivery. These are paid by the buyer.' },
  { q: 'Can I cancel my order?', a: 'Yes — cancellation requests are accepted within 12 hours of purchase, before work on your piece begins.' },
]

const SOCIALS = [
  { icon: FaInstagram, label: 'Instagram', handle: '@aries_leathers', href: SITE.socials.instagram },
  { icon: FaFacebookF, label: 'Facebook', handle: 'ariesleathers', href: SITE.socials.facebook },
  { icon: FaPinterestP, label: 'Pinterest', handle: 'ariesleathers', href: SITE.socials.pinterest },
  { icon: FaEtsy, label: 'Etsy', handle: 'AriesLeathers', href: SITE.socials.etsy },
]

// Ek-ek karke aane wale items ke liye
const stagger = (delay = 0.08) => ({
  hidden: {},
  show: { transition: { staggerChildren: delay } },
})
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/* ================= HERO ================= */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -80])
  const bgX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%'])

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink text-bone">
      {/* Peeche chalta hua bada text */}
      <motion.p
        aria-hidden
        style={{ x: bgX }}
        className="pointer-events-none absolute -bottom-[4vw] left-0 select-none whitespace-nowrap font-display text-[20vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(237,230,218,0.07)]"
      >
        LET'S TALK · LET'S TALK
      </motion.p>

      <Container className="relative grid items-center gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-3 border border-bone/15 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-bone/80"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-light opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-light" />
            </span>
            Replies within a few hours
          </motion.p>

          <h1 className="mt-8 font-display text-6xl leading-[0.95] tracking-tight md:text-8xl">
            <SplitReveal text="Let's talk" className="block" delay={0.15} />
            <SplitReveal text="leather." className="block italic text-gold-light" delay={0.3} />
          </h1>

          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: EASE }}
            className="mt-8 block h-px w-24 origin-left bg-gold-light/60"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/70"
          >
            A custom size, a special colour, or a question about your order — write to the workshop and a real person will
            reply.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <motion.a
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-gold-light px-7 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
              <FaWhatsapp size={16} className="relative" />
              <span className="relative">Chat on WhatsApp</span>
            </motion.a>
            <motion.a
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              href="#message"
              className="inline-flex items-center gap-3 border border-bone/30 px-7 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-bone hover:text-ink"
            >
              Write a message
            </motion.a>
          </motion.div>
        </div>

        <div className="relative md:col-span-5 md:col-start-8">
          <motion.div
            initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.77, 0, 0.175, 1] }}
          >
            <TiltCard max={8}>
              <div className="relative aspect-[4/5] overflow-hidden">
                <motion.div style={{ y: imgY, scale: 1.15 }} className="absolute inset-0">
                  <SmartImage
                    src={CONTACT_IMAGE}
                    alt="Distressed brown leather jacket by Aries Leathers"
                    label="Aries Leathers"
                    className="h-full w-full"
                    imgClassName="object-[center_30%]"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-t from-ink/40 to-transparent" />
              </div>
            </TiltCard>
          </motion.div>

          {/* Floating WhatsApp card */}
          <motion.div
            style={{ y: cardY }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: EASE }}
            className="absolute -left-6 bottom-10 md:-left-12"
          >
            <motion.a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-4 bg-bone px-5 py-4 text-ink shadow-3d"
            >
              <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white">
                <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
                <FaWhatsapp size={20} className="relative" />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">WhatsApp</span>
                <span className="block text-sm font-medium">{SITE.phone}</span>
              </span>
            </motion.a>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

/* ================= CHANNELS ================= */
function Channels() {
  return (
    <section className="border-b border-line bg-bone" style={{ perspective: 1200 }}>
      <motion.div
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Container className="grid gap-px bg-line py-px sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map(({ icon: Icon, label, value, href, external }) => (
            <motion.div
              key={label}
              variants={{
                hidden: { opacity: 0, rotateX: -70, y: 30 },
                show: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
              style={{ transformOrigin: 'top' }}
              className="bg-bone"
            >
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="group flex h-full items-center justify-between gap-4 p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-ivory"
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-line text-oxblood transition-all duration-500 group-hover:scale-110 group-hover:border-oxblood group-hover:bg-oxblood group-hover:text-bone">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted">{label}</span>
                    <span className="mt-1 block truncate text-sm text-ink">{value}</span>
                  </span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-muted transition-all duration-500 group-hover:rotate-45 group-hover:text-oxblood" />
              </a>
            </motion.div>
          ))}
        </Container>
      </motion.div>
    </section>
  )
}

/* ================= FORM ================= */
function MessageForm() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    topic: TOPICS[0].label,
    orderId: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [shake, setShake] = useState(0)

  const set = (field) => (e) => {
    const value = field === 'message' ? e.target.value.slice(0, MAX_MESSAGE) : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters)'
    return e
  }

  const composed = [
    `Hi Aries Leathers, I'm ${form.name.trim() || '…'}${form.email.trim() ? ` (${form.email.trim()})` : ''}.`,
    `Topic: ${form.topic}`,
    form.orderId.trim() && `Order: ${form.orderId.trim()}`,
    '',
    form.message.trim() || 'Your message will appear here…',
  ]
    .filter((line) => line !== false)
    .join('\n')

  const send = (channel) => {
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      setShake((s) => s + 1)
      return
    }
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(composed)}`, '_blank', 'noopener')
      toast.success('Opening WhatsApp')
    } else {
      const subject = `[${form.topic}] ${form.name.trim()}`
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composed)}`
      toast.success('Opening your email app')
    }
  }

  return (
    <section id="message" className="scroll-mt-24 bg-bone py-20 md:py-28">
      <Container className="grid gap-10 lg:grid-cols-12">
        <motion.form
          key={shake}
          onSubmit={(e) => {
            e.preventDefault()
            send('whatsapp')
          }}
          noValidate
          variants={stagger(0.07)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
          transition={{ duration: 0.45 }}
          className="border border-line bg-ivory p-6 shadow-card md:p-10 lg:col-span-7"
        >
          <motion.p variants={rise} className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Write to us</motion.p>
          <motion.h2 variants={rise} className="mt-3 font-display text-4xl text-ink md:text-5xl">Send a message</motion.h2>

          <motion.p variants={rise} className="mt-8 text-[10px] uppercase tracking-[0.2em] text-muted">What's it about?</motion.p>
          <motion.div variants={rise} className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Topic">
            {TOPICS.map(({ label, icon: Icon }) => {
              const active = form.topic === label
              return (
                <motion.button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setForm((f) => ({ ...f, topic: label }))}
                  className={`relative flex flex-col items-start gap-3 border p-4 text-left text-xs transition-colors duration-300 ${
                    active ? 'border-ink text-bone' : 'border-line bg-cream text-ink hover:border-ink/40'
                  }`}
                >
                  {active && (
                    <motion.span layoutId="topic-active" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                  )}
                  <Icon size={18} strokeWidth={1.5} className={`relative ${active ? 'text-gold-light' : 'text-oxblood'}`} />
                  <span className="relative">{label}</span>
                </motion.button>
              )
            })}
          </motion.div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <motion.div variants={rise}>
              <Field label="Your name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
            </motion.div>
            <motion.div variants={rise}>
              <Field label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
            </motion.div>
            <motion.div variants={rise} className="sm:col-span-2">
              <Field label="Order number (optional)" value={form.orderId} onChange={set('orderId')} />
            </motion.div>

            <motion.div variants={rise} className="sm:col-span-2">
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={6}
                placeholder="Tell us about the piece, your size or your question…"
                aria-label="Message"
                className={`w-full resize-none border bg-cream px-4 py-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:bg-white ${
                  errors.message ? 'border-oxblood-light' : 'border-line focus:border-ink'
                }`}
              />
              <div className="mt-1.5 flex items-center justify-between gap-4 text-xs">
                <span className="text-oxblood-light">{errors.message}</span>
                <span className="flex items-center gap-2 text-muted">
                  <span className="h-1 w-16 overflow-hidden bg-line">
                    <motion.span
                      className="block h-full bg-oxblood"
                      animate={{ width: `${(form.message.length / MAX_MESSAGE) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </span>
                  {form.message.length}/{MAX_MESSAGE}
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={rise} className="mt-6 grid gap-3 sm:grid-cols-2">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="group relative flex items-center justify-center gap-3 overflow-hidden bg-ink py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone"
            >
              <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-luxe group-hover:translate-x-0" />
              <FaWhatsapp size={16} className="relative" />
              <span className="relative">Send on WhatsApp</span>
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => send('email')}
              className="flex items-center justify-center gap-3 border border-ink py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-bone"
            >
              <Send size={14} strokeWidth={1.5} /> Send by email
            </motion.button>
          </motion.div>
        </motion.form>

        <div className="space-y-6 lg:col-span-5">
          <Reveal delay={0.1}>
            <div className="bg-ink p-6 text-bone md:p-8">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-bone/50">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#25D366]" /> Message preview
                </p>
                <FaWhatsapp size={18} className="text-[#25D366]" />
              </div>
              <motion.div
                key={form.topic}
                initial={{ scale: 0.96, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ transformOrigin: 'top left' }}
                className="mt-5 max-w-full rounded-2xl rounded-tl-sm bg-[#1F2C26] px-5 py-4 text-sm leading-relaxed text-bone/90"
              >
                <pre className="whitespace-pre-wrap break-words font-sans">
                  {composed}
                  <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-[#25D366]" />
                </pre>
              </motion.div>
              <p className="mt-4 text-xs text-bone/50">This is exactly what we'll receive.</p>
            </div>
          </Reveal>

          <motion.div
            variants={stagger(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-px bg-line"
          >
            {[
              { icon: MapPin, label: 'Workshop', value: SITE.location },
              { icon: Clock, label: 'Response time', value: 'A few hours' },
            ].map(({ icon: Icon, label, value }) => (
              <motion.div key={label} variants={rise} className="group bg-ivory p-6">
                <Icon size={18} strokeWidth={1.5} className="text-oxblood transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-12" />
                <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted">{label}</p>
                <p className="mt-1 font-display text-xl text-ink">{value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}

/* ================= CUSTOM ORDER STEPS ================= */
function CustomSteps() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.5'] })

  return (
    <section ref={ref} className="bg-oxblood py-24 text-bone md:py-28">
      <Container>
        <div className="mb-14 max-w-xl">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light">Made for you</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
            <SplitReveal text="How a custom order works" />
          </h2>
        </div>

        <div className="relative" style={{ perspective: 1400 }}>
          {/* Steps ko jodne wali line */}
          <div className="absolute left-[16.6%] right-[16.6%] top-[68px] hidden h-px bg-bone/15 md:block" />
          <motion.div
            style={{ scaleX: scrollYProgress }}
            className="absolute left-[16.6%] right-[16.6%] top-[68px] hidden h-px origin-left bg-gold-light md:block"
          />

          <motion.ol
            variants={stagger(0.18)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="relative grid gap-6 md:grid-cols-3"
          >
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <motion.li
                key={title}
                variants={{
                  hidden: { opacity: 0, rotateY: -35, y: 40 },
                  show: { opacity: 1, rotateY: 0, y: 0, transition: { duration: 0.9, ease: EASE } },
                }}
                whileHover={{ y: -6 }}
                className="group border border-bone/10 bg-oxblood-deep/40 p-8 transition-colors duration-500 hover:border-gold-light/40 md:p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="relative grid h-14 w-14 place-items-center rounded-full border border-gold-light/30 bg-oxblood transition-colors duration-500 group-hover:bg-gold-light">
                    <Icon size={22} strokeWidth={1.25} className="text-gold-light transition-colors duration-500 group-hover:text-oxblood" />
                  </span>
                  <span className="font-display text-6xl leading-none text-bone/15 transition-colors duration-500 group-hover:text-gold-light/40">0{i + 1}</span>
                </div>
                <p className="mt-8 font-display text-3xl">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/70">{text}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Container>
    </section>
  )
}

/* ================= FAQ ================= */
function Faq({ item, index, open, onToggle }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 40 },
        show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
      }}
      className={`relative border-b border-line transition-colors duration-500 ${open ? 'bg-ivory' : 'hover:bg-ivory/50'}`}
    >
      <span className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-oxblood transition-transform duration-500 ${open ? 'scale-y-100' : 'scale-y-0'}`} />
      <button onClick={onToggle} aria-expanded={open} className="group flex w-full items-center gap-6 px-5 py-6 text-left">
        <span className="font-display text-sm text-oxblood">0{index + 1}</span>
        <span className="flex-1 font-display text-xl text-ink transition-transform duration-500 group-hover:translate-x-1 md:text-2xl">{item.q}</span>
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
            open ? 'rotate-45 border-oxblood bg-oxblood text-bone' : 'border-line text-ink group-hover:border-ink'
          }`}
        >
          <Plus size={16} strokeWidth={1.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <motion.p
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              className="max-w-2xl px-5 pb-6 pl-14 text-sm leading-relaxed text-charcoal/80"
            >
              {item.a}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Faqs() {
  const [open, setOpen] = useState(0)
  return (
    <section className="bg-bone py-24 md:py-32">
      <Container className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Good to know</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl">
            <SplitReveal text="Questions, answered" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-charcoal/75">
              Can't find what you're looking for? Send us a message and we'll help.
            </p>
          </Reveal>
        </div>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="border-t border-line lg:col-span-8"
        >
          {FAQS.map((item, i) => (
            <Faq key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

/* ================= SOCIALS ================= */
function Socials() {
  return (
    <section className="border-t border-line bg-ivory">
      <Container className="py-16">
        <Reveal>
          <p className="text-center text-[11px] font-medium uppercase tracking-[0.35em] text-muted">Follow the workshop</p>
        </Reveal>
        <motion.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 gap-px bg-line md:grid-cols-4"
        >
          {SOCIALS.map(({ icon: Icon, label, handle, href }) => (
            <motion.a
              key={label}
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
              }}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-3 bg-ivory px-4 py-8 text-center transition-colors duration-500 hover:bg-ink hover:text-bone"
            >
              <Icon size={22} className="text-oxblood transition-all duration-500 group-hover:-translate-y-1 group-hover:rotate-[360deg] group-hover:text-gold-light" />
              <span className="font-display text-xl">{label}</span>
              <span className="text-xs text-muted transition-colors group-hover:text-bone/60">{handle}</span>
            </motion.a>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default function Contact() {
  return (
    <>
      <Hero />
      <Channels />
      <MessageForm />
      <CustomSteps />
      <Faqs />
      <Socials />
    </>
  )
}