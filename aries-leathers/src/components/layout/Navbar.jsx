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
      className={`flex h-10 items-center gap-2 border border-line bg-cream px-3 transition-colors focus-within:border-ink focus-within:bg-white ${className}`}
    >
      <Search size={16} strokeWidth={1.75} className="shrink-0 text-muted" />
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
        `group flex flex-col items-center gap-1 px-1 transition-colors ${isActive ? 'text-oxblood' : 'text-ink hover:text-oxblood'}`
      }
    >
      <span className="relative">
        <Icon size={20} strokeWidth={1.6} />
        {count > 0 && (
          <span className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-oxblood px-1 text-[10px] font-semibold leading-none text-bone">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
    </NavLink>
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
            className="absolute inset-0 bg-ink/40"
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
            transition={{ duration: 0.35, ease: EASE }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Brand compact onClick={onClose} />
              <button onClick={onClose} aria-label="Close menu" className="p-1 text-ink">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" data-lenis-prevent>
              <nav className="border-b border-line">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between border-b border-line px-5 py-4 text-sm font-semibold uppercase tracking-wider last:border-b-0 ${
                        isActive ? 'text-oxblood' : 'text-ink'
                      }`
                    }
                  >
                    {link.label}
                    <ChevronRight size={16} className="text-muted" />
                  </NavLink>
                ))}
              </nav>

              <p className="px-5 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-wider text-muted">Categories</p>
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to={`/products?category=${c.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-5 py-3 text-sm text-ink hover:text-oxblood"
                >
                  {c.name}
                  <ChevronRight size={14} className="text-muted" />
                </Link>
              ))}
            </div>

            <div className="border-t border-line px-5 py-4">
              <div className="flex justify-around">
                {actions.map((a) => (
                  <Link key={a.label} to={a.to} onClick={onClose} className="flex flex-col items-center gap-1 text-ink">
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
      <header
        className={`sticky top-0 z-50 border-b border-line bg-bone transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_4px_16px_rgba(22,20,18,0.08)]' : ''
        }`}
      >
        <Container className="flex h-[72px] items-center gap-6 lg:gap-10">
          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="-ml-1 p-1 text-ink lg:hidden">
            <Menu size={22} strokeWidth={1.6} />
          </button>

          {/* Logo */}
          <Brand compact hideTextOnMobile />

          {/* Links */}
          <nav className="hidden h-full items-stretch gap-8 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative flex items-center text-[13px] font-semibold uppercase tracking-wider transition-colors
                   after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-oxblood after:transition-transform after:duration-300
                   ${isActive ? 'text-oxblood after:scale-x-100' : 'text-ink after:scale-x-0 hover:text-oxblood hover:after:scale-x-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search (desktop/tablet) */}
          <SearchBox className="ml-auto hidden w-full max-w-sm md:flex" />

          {/* Country + actions */}
          <div className="ml-auto flex items-center gap-4 md:ml-0 md:gap-5">
            <CountrySelect variant="compact" className="hidden md:block" />
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
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} actions={actions} />
    </>
  )
}