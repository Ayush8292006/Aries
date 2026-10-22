import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import Container from '../ui/Container'
import Brand from '../ui/Brand'
import CountrySelect from '../ui/CountrySelect'
import { CATEGORIES, NAV_LINKS, SITE } from '../../config/site'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

const EASE = [0.22, 1, 0.36, 1]

/* ===== Hover par text roll hota hai (upar jaata hai, neeche se gold aata hai) ===== */
function RollText({ children, active = false }) {
  return (
    <span className="relative block overflow-hidden leading-[1.3]">
      <span
        className={`block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full ${
          active ? 'text-gold-light' : ''
        }`}
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full text-gold-light transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
      >
        {children}
      </span>
    </span>
  )
}

/* ===== Search box ===== */
function SearchBox({ className = '', onDone }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setQuery('')
    onDone?.()
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      className={`group relative flex h-10 items-center gap-2 border-b border-bone/30 px-1 transition-colors duration-300 hover:border-bone/60 ${className}`}
    >
      <Search
        size={16}
        strokeWidth={1.75}
        className="shrink-0 text-bone/70 transition-colors duration-300 group-hover:text-bone group-focus-within:text-gold-light"
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search jackets, blazers and more"
        aria-label="Search products"
        className="w-full bg-transparent text-base text-bone outline-none placeholder:text-bone/55 md:text-[13px]"
      />
      <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-focus-within:scale-x-100" />
    </form>
  )
}

/* ===== Icon with label + badge ===== */
function Action({ icon: Icon, label, to, count = 0 }) {
  return (
    <NavLink
      to={to}
      aria-label={count ? `${label} (${count})` : label}
      className={({ isActive }) =>
        `group flex flex-col items-center gap-1 px-1 transition-colors duration-300 ${
          isActive ? 'text-gold-light' : 'text-bone hover:text-gold-light'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="relative">
            <Icon
              size={20}
              strokeWidth={1.6}
              className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1"
            />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold leading-none text-ink"
              >
                {count > 9 ? '9+' : count}
              </motion.span>
            )}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide">
            <RollText active={isActive}>{label}</RollText>
          </span>
        </>
      )}
    </NavLink>
  )
}

/* ===== Desktop links ===== */
function NavLinks() {
  const { pathname } = useLocation()

  return (
    <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
      {NAV_LINKS.map((link) => {
        const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className="group relative py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-bone"
          >
            <RollText active={isActive}>{link.label}</RollText>
            <span
              className={`absolute inset-x-0 bottom-0 h-px bg-gold transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isActive ? 'scale-x-100' : 'origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100'
              }`}
            />
          </NavLink>
        )
      })}
    </nav>
  )
}

/* ===== Mobile drawer (halka rang) ===== */
function MobileMenu({ open, onClose, actions }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute left-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-bone"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="flex h-16 items-center justify-between bg-ink px-5">
              <Brand compact dark onClick={onClose} />
              <button onClick={onClose} aria-label="Close menu" className="p-1 text-bone transition-transform duration-300 hover:rotate-90">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              <motion.nav
                className="border-b border-line"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.div key={link.to} variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center justify-between border-b border-line px-5 py-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
                          isActive ? 'text-oxblood' : 'text-ink hover:text-oxblood'
                        }`
                      }
                    >
                      {link.label}
                      <ChevronRight size={16} className="text-muted transition-transform group-hover:translate-x-1" />
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>

              <p className="px-5 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-wider text-muted">Categories</p>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/products?category=${c.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between px-5 py-3 text-sm text-ink transition-colors hover:text-oxblood"
                >
                  {c.name}
                  <ChevronRight size={14} className="text-muted transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <div className="border-t border-line px-5 py-4">
              <div className="flex justify-around">
                {actions.map((a) => (
                  <Link key={a.label} to={a.to} onClick={onClose} className="flex flex-col items-center gap-1 text-ink hover:text-oxblood">
                    <a.icon size={20} strokeWidth={1.6} />
                    <span className="text-[10px] font-semibold uppercase">{a.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                <p className="truncate text-xs text-muted">{SITE.email}</p>
                <CountrySelect variant="compact" dropUp align="right" />
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ===== Navbar ===== */
export default function Navbar() {
  const { totals, wishlist } = useCart()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const [height, setHeight] = useState(0)

  const isHome = pathname === '/'
  const overVideo = isHome && !scrolled && !menuOpen // Home par video ke upar: bilkul transparent

  const actions = [
    { icon: User, label: user ? 'Profile' : 'Login', to: '/profile' },
    { icon: Heart, label: 'Favourites', to: '/wishlist', count: wishlist.length },
    { icon: ShoppingBag, label: 'Cart', to: '/cart', count: totals.count },
  ]

  // Navbar ki height naapo (Home par video iske neeche se shuru ho)
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const update = () => setHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Neeche scroll = chhupao, upar scroll = dikhao
  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const diff = y - lastY

      setScrolled(y > 40)

      if (y < 120) setHidden(false)
      else if (diff > 6) setHidden(true)
      else if (diff < -6) setHidden(false)

      if (Math.abs(diff) > 6) lastY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Page badalne par menu band aur navbar wapas dikhe
  useEffect(() => {
    setMenuOpen(false)
    setHidden(false)
  }, [pathname])

  const isHidden = hidden && !menuOpen

  // Background: Home = transparent / glass, baaki pages = solid kaala
  const background = !isHome
    ? `bg-ink ${scrolled ? 'shadow-[0_8px_24px_rgba(0,0,0,0.25)]' : ''}`
    : overVideo
      ? 'bg-transparent'
      : 'bg-ink/70 shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md backdrop-saturate-150'

  return (
    <>
      <header
        ref={headerRef}
        // Sirf Home par negative margin = video navbar ke peeche se shuru hota hai
        style={{ marginBottom: isHome ? -height : 0 }}
        className={`sticky top-0 z-50 text-bone transition-[transform,background-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${background}`}
      >
        {/* Home par video ke upar text padhne ke liye halki chhaya */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-black/55 to-transparent transition-opacity duration-500 ${
            overVideo ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <Container className="flex h-[72px] items-center gap-6 lg:gap-10">
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="-ml-1 p-1 text-bone transition-colors hover:text-gold-light lg:hidden"
          >
            <Menu size={22} strokeWidth={1.6} />
          </button>

          {/* Logo */}
          <Brand compact dark hideTextOnMobile />

          {/* Links */}
          <NavLinks />

          {/* Search (desktop/tablet) */}
          <SearchBox className="ml-auto hidden w-full max-w-xs md:flex" />

          {/* Country + actions */}
          <div className="ml-auto flex items-center gap-4 md:ml-0 md:gap-5">
            <CountrySelect variant="compact" className="hidden text-ink md:block" />
            <div className="hidden items-center gap-5 sm:flex">
              {actions.map((a) => (
                <Action key={a.label} {...a} />
              ))}
            </div>
            {/* Mobile: sirf cart */}
            <div className="sm:hidden">
              <Action {...actions[2]} />
            </div>
          </div>
        </Container>

        {/* Mobile search */}
        <Container className="pb-3 md:hidden">
          <SearchBox className="w-full" />
        </Container>

        {/* Neeche patli sunehri line (transparent state mein chhupi) */}
        <span
          aria-hidden
          className={`block h-px bg-linear-to-r from-transparent via-gold/40 to-transparent transition-opacity duration-500 ${
            overVideo ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} actions={actions} />
    </>
  )
}