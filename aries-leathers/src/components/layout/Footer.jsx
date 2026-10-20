import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone } from 'lucide-react'
import { FaEtsy, FaFacebookF, FaInstagram, FaPinterestP, FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Container from '../ui/Container'
import Brand from '../ui/Brand'
import { CATEGORIES, SITE } from '../../config/site'

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

function FooterHeading({ children }) {
  return <h4 className="mb-6 text-[11px] font-medium uppercase tracking-[0.3em] text-gold-light">{children}</h4>
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-2 text-sm text-bone/75 transition-colors duration-300 hover:text-bone">
      <span className="h-px w-0 bg-gold-light transition-all duration-300 group-hover:w-4" />
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
    toast.success('Thank you for subscribing')
    setEmail('')
  }

  return (
    <footer className="bg-ink text-bone">
      {/* Newsletter */}
      <div className="border-b border-bone/10">
        <Container className="grid items-center gap-8 py-16 md:grid-cols-2">
          <div>
            <h3 className="font-display text-3xl tracking-tight text-bone md:text-4xl">Join the Aries Circle</h3>
            <p className="mt-3 text-sm text-bone/70">New collections, private offers and leather-care tips.</p>
          </div>
          <form
            onSubmit={handleSubscribe}
            className="flex border-b border-bone/30 transition-colors duration-300 focus-within:border-gold-light"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-transparent py-4 text-sm text-bone outline-none placeholder:text-bone/45"
              aria-label="Email address"
            />
            <button className="group flex shrink-0 items-center gap-2 py-4 pl-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-300 hover:text-gold-light">
              Subscribe
              <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </Container>
      </div>

      {/* Links */}
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Brand dark />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-bone/70">
            {SITE.tagline}. Handcrafted from genuine leather by skilled artisans since {SITE.since}.
          </p>
          <div className="mt-8 flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-bone/25 text-bone/80 transition-all duration-300 hover:-translate-y-1 hover:border-bone hover:bg-bone hover:text-ink"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <FooterHeading>Shop</FooterHeading>
          <ul className="space-y-3">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <FooterLink to={`/products?category=${c.slug}`}>{c.name}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Explore</FooterHeading>
          <ul className="space-y-3">
            {LINKS.map((l) => (
              <li key={l.to}>
                <FooterLink to={l.to}>{l.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <FooterHeading>Get in Touch</FooterHeading>
          <ul className="space-y-4 text-sm text-bone/75">
            <li>
              <a href={`mailto:${SITE.email}`} className="flex items-start gap-3 break-all transition-colors duration-300 hover:text-bone">
                <Mail size={16} strokeWidth={1.5} className="mt-0.5 shrink-0 text-gold-light" /> {SITE.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 transition-colors duration-300 hover:text-bone">
                <Phone size={16} strokeWidth={1.5} className="shrink-0 text-gold-light" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition-colors duration-300 hover:text-bone">
                <FaWhatsapp size={16} className="shrink-0 text-gold-light" /> Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-bone/10">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-bone/55 md:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p className="font-display italic">Handcrafted with pride since {SITE.since}</p>
        </Container>
      </div>
    </footer>
  )
}