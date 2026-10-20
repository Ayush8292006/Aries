import { useEffect, useState } from 'react'
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
      className={`group flex h-10 items-center gap-2 rounded-full border border-line bg-cream px-4 transition-all duration-300 hover:border-ink/40 focus-within:border-ink focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(22,20,18,0.08)] ${className}`}
    >
      <Search
        size={16}
        strokeWidth={1.75}
        className="shrink-0 text-muted transition-all duration-300 group-hover:text-ink group-focus-within:scale-110 group-focus-within:text-oxblood"
      />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for jackets, blazers and more"
        aria-label="Search products"
        className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-muted"
      />
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
        `group flex flex-col items-center gap-0.5 px-1 transition-colors duration-300 ${isActive ? 'text-oxblood' : 'text-ink hover:text-oxblood'}`
      }
    >
      <span className="relative grid h-9 w-9 place-items-center">
        <span className="absolute inset-0 scale-0 rounded-full bg-oxblood/10 transition-transform duration-300 ease-out group-hover:scale-100" />
        <Icon
          size={20}
          strokeWidth={1.6}
          className="relative transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110"
        />
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className="absolute -right-0.5 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-oxblood px-1 text-[10px] font-semibold leading-none text-bone"
          >
            {count > 9 ? '9+' : count}
          </motion.span>
        )}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
    </NavLink>
  )
}

/* ===== Desktop links with sliding hover pill ===== */
function NavLinks() {
  const [hovered, setHovered] = useState(null)
  const { pathname } = useLocation()

  return (
    <nav onMouseLeave={() => setHovered(null)} className="hidden items-center gap-1 lg:flex" aria-label="Main">
      {NAV_LINKS.map((link) => {
        const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to)
        const isHover = hovered === link.to
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            onMouseEnter={() => setHovered(link.to)}
            onFocus={() => setHovered(link.to)}
            onBlur={() => setHovered(null)}
            className="relative px-4 py-2.5 text-[13px] font-semibold uppercase tracking-wider"
          >
            {isHover && (
              <motion.span
                layoutId="nav-hover-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                isHover ? 'text-bone' : isActive ? 'text-oxblood' : 'text-ink'
              }`}
            >
              {link.label}
            </span>
            {isActive && (
              <motion.span
                layoutId="nav-active-dot"
                className="absolute -bottom-1.5 left-0 right-0 mx-auto h-1.5 w-1.5 rounded-full bg-oxblood"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}

/* ===== Mobile drawer ===== */
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
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
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
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Brand compact onClick={onClose} />
              <button onClick={onClose} aria-label="Close menu" className="p-1 text-ink transition-transform duration-300 hover:rotate-90">
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
                        `group flex items-center justify-between border-b border-line px-5 py-4 text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-cream ${
                          isActive ? 'text-oxblood' : 'text-ink'
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
  const [menuOpen, setMenuOpen] = useState(false)

  const actions = [
    { icon: User, label: user ? 'Profile' : 'Login', to: '/profile' },
    { icon: Heart, label: 'Favourites', to: '/wishlist', count: wishlist.length },
    { icon: ShoppingBag, label: 'Cart', to: '/cart', count: totals.count },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={`sticky top-0 z-50 border-b border-line transition-all duration-300 ${
          scrolled ? 'bg-bone/90 shadow-[0_4px_16px_rgba(22,20,18,0.08)] backdrop-blur-md' : 'bg-bone'
        }`}
      >
        <Container className="flex h-[72px] items-center gap-6 lg:gap-8">
          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-1 p-1 text-ink lg:hidden">
            <Menu size={22} strokeWidth={1.6} />
          </button>

          {/* Logo */}
          <Brand compact hideTextOnMobile />

          {/* Links */}
          <NavLinks />

          {/* Search (desktop/tablet) */}
          <SearchBox className="ml-auto hidden w-full max-w-sm md:flex" />

          {/* Country + actions */}
          <div className="ml-auto flex items-center gap-4 md:ml-0 md:gap-4">
            <CountrySelect variant="compact" className="hidden md:block" />
            <div className="hidden items-center gap-3 sm:flex">
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
      </motion.header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} actions={actions} />
    </>
  )
}