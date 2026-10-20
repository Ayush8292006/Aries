import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ArrowUp, Mail, Phone } from 'lucide-react'
import { FaEtsy, FaFacebookF, FaInstagram, FaPinterestP, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Container from '../ui/Container'
import Brand from '../ui/Brand'
import { CATEGORIES, SITE } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]

const SOCIALS = [
  { icon: FaInstagram, href: SITE.socials.instagram, label: 'Instagram' },
  { icon: FaFacebookF, href: SITE.socials.facebook, label: 'Facebook' },
  { icon: FaPinterestP, href: SITE.socials.pinterest, label: 'Pinterest' },
  { icon: FaEtsy, href: SITE.socials.etsy, label: 'Etsy' },
]

const LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'My Profile', to: '/profile' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Favourites', to: '/wishlist' },
  { label: 'Cart', to: '/cart' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

function scrollTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.4 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

function FooterHeading({ children }) {
  return <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold md:mb-5">{children}</h4>
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 py-0.5 text-[13px] text-bone/60 transition-colors duration-300 hover:text-bone md:text-sm"
    >
      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
      {children}
    </Link>
  )
}

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email')
      return
    }
    toast.success('Thank you for subscribing!')
    setEmail('')
  }

  const phoneHref = `tel:${SITE.phone.replace(/\s/g, '')}`

  return (
    <footer className="relative overflow-hidden bg-ink text-bone">
      {/* Peeche bada halka naam */}
      <p
        aria-hidden
        className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[28vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(237,230,218,0.05)] md:text-[18vw]"
      >
        ARIES
      </p>

      {/* ===== Newsletter ===== */}
      <Container className="relative pt-12 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="grid items-center gap-6 border border-gold/20 bg-ink-light/40 p-6 text-center sm:p-8 md:grid-cols-2 md:gap-8 md:p-12 md:text-left"
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-gold">Newsletter</p>
            <h3 className="mt-3 font-display text-3xl tracking-tight md:text-4xl">Join the Aries Circle</h3>
            <p className="mt-2 text-sm text-bone/60">New collections, private offers and leather-care tips.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="h-12 w-full border border-bone/15 bg-transparent px-4 text-base text-bone outline-none transition-colors placeholder:text-bone/40 focus:border-gold sm:h-14 sm:border-r-0 sm:text-sm"
            />
            <button className="group relative flex h-12 shrink-0 items-center justify-center gap-2 overflow-hidden bg-gold px-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink sm:h-14">
              <span className="absolute inset-0 -translate-x-full bg-bone transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative flex items-center gap-2">
                Subscribe <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </form>
        </motion.div>
      </Container>

      {/* ===== Main: phone 2 col · tablet 3 col · laptop 5 col ===== */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
      >
        <Container className="relative grid grid-cols-2 gap-x-6 gap-y-10 py-10 sm:grid-cols-3 md:gap-x-10 md:py-16 lg:grid-cols-5 lg:gap-12">
          {/* Brand — phone/tablet par poori chaudai */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 flex flex-col items-center border-b border-bone/10 pb-10 text-center sm:col-span-3 md:items-start md:text-left lg:col-span-2 lg:border-0 lg:pb-0"
          >
            <Brand dark />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-bone/60">
              {SITE.tagline}. Handcrafted from genuine leather in {SITE.location} since {SITE.since}.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-bone/15 text-bone/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-ink"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Phone par jaldi contact buttons */}
            <div className="mt-8 grid w-full grid-cols-3 gap-2 sm:hidden">
              {[
                { icon: Phone, label: 'Call', href: phoneHref },
                { icon: FaWhatsapp, label: 'WhatsApp', href: `https://wa.me/${SITE.whatsapp}`, external: true },
                { icon: Mail, label: 'Email', href: `mailto:${SITE.email}` },
              ].map(({ icon: Icon, label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  className="flex flex-col items-center gap-2 border border-bone/15 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-bone/80 transition-colors active:bg-gold active:text-ink"
                >
                  <Icon size={18} className="text-gold" />
                  {label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Shop */}
          <motion.div variants={fadeUp}>
            <FooterHeading>Shop</FooterHeading>
            <ul className="space-y-2.5 md:space-y-3">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <FooterLink to={`/products?category=${c.slug}`}>{c.name}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Explore */}
          <motion.div variants={fadeUp}>
            <FooterHeading>Explore</FooterHeading>
            <ul className="space-y-2.5 md:space-y-3">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Get in Touch — tablet aur laptop par */}
          <motion.div variants={fadeUp} className="hidden sm:block">
            <FooterHeading>Get in Touch</FooterHeading>
            <ul className="space-y-4 text-sm text-bone/60">
              <li>
                <a href={`mailto:${SITE.email}`} className="flex items-start gap-3 break-all transition-colors hover:text-gold">
                  <Mail size={16} className="mt-0.5 shrink-0 text-gold" /> {SITE.email}
                </a>
              </li>
              <li>
                <a href={phoneHref} className="flex items-center gap-3 transition-colors hover:text-gold">
                  <Phone size={16} className="shrink-0 text-gold" /> {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition-colors hover:text-gold"
                >
                  <FaWhatsapp size={16} className="shrink-0 text-gold" /> Chat on WhatsApp
                </a>
              </li>
            </ul>
          </motion.div>
        </Container>
      </motion.div>

      {/* ===== Bottom bar ===== */}
      <div className="relative border-t border-bone/10">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 text-center text-xs text-bone/40 md:flex-row md:text-left">
          <div>
            <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            <p className="mt-1 font-display text-sm italic text-bone/50 md:hidden">Handcrafted with pride since {SITE.since}</p>
          </div>

          <p className="hidden font-display text-sm italic md:block">Handcrafted with pride since {SITE.since}</p>

          <button
            onClick={scrollTop}
            className="group flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-bone/60 transition-colors hover:text-gold"
          >
            Back to top
            <span className="grid h-9 w-9 place-items-center rounded-full border border-bone/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
              <ArrowUp size={15} />
            </span>
          </button>
        </Container>
      </div>
    </footer>
  )
}