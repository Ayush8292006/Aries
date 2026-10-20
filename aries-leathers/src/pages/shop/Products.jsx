import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { LayoutGrid, PackageSearch, Rows3, Search, SlidersHorizontal, Square, X } from 'lucide-react'
import Container from '../../components/ui/Container'
import ProductCard from '../../components/product/ProductCard'
import SplitReveal from '../../components/motion/SplitReveal'
import { useProducts } from '../../hooks/useProducts'
import { useCurrency } from '../../hooks/useCurrency'
import { CATEGORIES } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]

const GENDERS = [
  { value: 'all', label: 'All' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
]

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const GRID_OPTIONS = [
  { cols: 2, icon: Square, className: 'grid-cols-2' },
  { cols: 3, icon: Rows3, className: 'grid-cols-2 md:grid-cols-3' },
  { cols: 4, icon: LayoutGrid, className: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' },
]

function matchesQuery(p, q) {
  const haystack = `${p.name} ${p.category} ${p.material} ${(p.colors ?? []).join(' ')} ${p.description}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).every((word) => haystack.includes(word))
}

/** Value badalne par text roll hota hai */
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

/* ================= FILTER PANEL ================= */
function FilterPanel({ id, category, gender, priceCap, maxBase, counts, onCategory, onGender, onPrice, onClear, formatPrice }) {
  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">Category</p>
        <ul className="mt-4 space-y-1">
          {[{ slug: 'all', name: 'All products' }, ...CATEGORIES].map((c) => {
            const active = category === c.slug
            return (
              <li key={c.slug}>
                <button
                  onClick={() => onCategory(c.slug)}
                  className={`group relative flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors duration-300 ${
                    active ? 'text-bone' : 'text-charcoal hover:text-oxblood'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={`${id}-cat`}
                      className="absolute inset-0 bg-ink"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    />
                  )}
                  <span className="relative">{c.name}</span>
                  <span className={`relative text-xs ${active ? 'text-bone/60' : 'text-muted'}`}>{counts[c.slug] ?? 0}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">Shop for</p>
        <div className="mt-4 grid grid-cols-3 border border-line">
          {GENDERS.map((g) => {
            const active = gender === g.value
            return (
              <button
                key={g.value}
                onClick={() => onGender(g.value)}
                className={`relative py-2.5 text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                  active ? 'text-bone' : 'text-charcoal hover:text-oxblood'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`${id}-gender`}
                    className="absolute inset-0 bg-oxblood"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{g.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">Price</p>
          <span className="text-sm text-charcoal">
            Up to <Rolling value={formatPrice(priceCap ?? maxBase)} />
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={maxBase}
          step={1}
          value={priceCap ?? maxBase}
          onChange={(e) => onPrice(Number(e.target.value))}
          className="mt-5 w-full accent-oxblood"
          aria-label="Maximum price"
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(maxBase)}</span>
        </div>
      </div>

      <button
        onClick={onClear}
        className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-charcoal transition-colors hover:text-oxblood"
      >
        Clear all filters
        <span className="h-px w-6 bg-charcoal transition-all duration-500 group-hover:w-10 group-hover:bg-oxblood" />
      </button>
    </div>
  )
}

/* ================= PAGE ================= */
export default function Products({ searchMode = false }) {
  const { products } = useProducts()
  const { formatPrice } = useCurrency()
  const [params, setParams] = useSearchParams()

  const category = params.get('category') || 'all'
  const gender = params.get('gender') || 'all'
  const sort = params.get('sort') || 'featured'
  const q = (params.get('q') || '').trim()

  const maxBase = useMemo(() => Math.ceil(Math.max(0, ...products.map((p) => p.price))), [products])
  const [priceCap, setPriceCap] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchText, setSearchText] = useState(q)
  const [gridCols, setGridCols] = useState(3)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || (key === 'sort' && value === 'featured')) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const clearAll = () => {
    const next = new URLSearchParams()
    if (searchMode && q) next.set('q', q)
    setParams(next, { replace: true })
    setPriceCap(null)
  }

  const counts = useMemo(() => {
    const c = { all: products.length }
    products.forEach((p) => {
      c[p.category] = (c[p.category] ?? 0) + 1
    })
    return c
  }, [products])

  const results = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (gender === 'all' || p.gender === gender || p.gender === 'unisex') &&
        (priceCap == null || p.price <= priceCap) &&
        (!q || matchesQuery(p, q))
    )
    if (sort === 'new') list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'featured') list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    return list
  }, [products, category, gender, priceCap, q, sort])

  const categoryName = CATEGORIES.find((c) => c.slug === category)?.name
  const title = searchMode ? (q ? `Results for “${q}”` : 'Search') : categoryName ?? 'All products'
  const gridClass = GRID_OPTIONS.find((g) => g.cols === gridCols)?.className

  const panelProps = {
    category,
    gender,
    priceCap,
    maxBase,
    counts,
    formatPrice,
    onCategory: (v) => setParam('category', v),
    onGender: (v) => setParam('gender', v),
    onPrice: (v) => setPriceCap(v >= maxBase ? null : v),
    onClear: clearAll,
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setParam('q', searchText.trim())
  }

  return (
    <>
      {/* ===== Header ===== */}
      <section className="relative overflow-hidden border-b border-line bg-ivory">
        <p
          aria-hidden
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[16vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(107,30,34,0.07)]"
        >
          LEATHER
        </p>

        <Container className="relative py-14 md:py-20">
          <motion.nav
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs text-muted"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="transition-colors hover:text-oxblood">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{searchMode ? 'Search' : 'Shop'}</span>
          </motion.nav>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-5xl tracking-tight text-ink md:text-7xl">
              <SplitReveal key={title} text={title} />
            </h1>
            <p className="flex items-baseline gap-2 text-sm text-muted">
              <span className="font-display text-4xl text-ink">
                <Rolling value={results.length} />
              </span>
              {results.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          {searchMode && (
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSearch}
              className="mt-8 flex max-w-xl items-center gap-3 border-b-2 border-ink/30 transition-colors focus-within:border-ink"
            >
              <Search size={18} strokeWidth={1.5} className="text-muted" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search jackets, blazers, trousers…"
                className="w-full bg-transparent py-3 text-base text-ink outline-none placeholder:text-muted"
                aria-label="Search products"
              />
              <button className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:text-oxblood">Search</button>
            </motion.form>
          )}

          {/* Category tabs */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
            className="mt-10 flex gap-2 overflow-x-auto pb-1"
            data-lenis-prevent
          >
            {[{ slug: 'all', name: 'All' }, ...CATEGORIES].map((c) => {
              const active = category === c.slug
              return (
                <motion.button
                  key={c.slug}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setParam('category', c.slug)}
                  className={`relative shrink-0 border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active ? 'border-ink text-bone' : 'border-line bg-bone text-ink hover:border-ink'
                  }`}
                >
                  {active && (
                    <motion.span layoutId="cat-tab" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                  )}
                  <span className="relative">
                    {c.name} <span className={active ? 'text-bone/50' : 'text-muted'}>{counts[c.slug] ?? 0}</span>
                  </span>
                </motion.button>
              )
            })}
          </motion.div>
        </Container>
      </section>

      {/* ===== Body ===== */}
      <section className="bg-bone">
        <Container className="grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="hidden lg:col-span-3 lg:block"
          >
            <div className="sticky top-28">
              <FilterPanel id="desk" {...panelProps} />
            </div>
          </motion.aside>

          <div className="lg:col-span-9">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mb-10 flex items-center justify-between gap-4 border-b border-line pb-5"
            >
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink lg:hidden"
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} /> Filters
              </button>

              <div className="hidden items-center gap-1 border border-line p-1 md:flex" role="radiogroup" aria-label="Grid size">
                {GRID_OPTIONS.map(({ cols, icon: Icon }) => {
                  const active = gridCols === cols
                  return (
                    <button
                      key={cols}
                      role="radio"
                      aria-checked={active}
                      aria-label={`${cols} columns`}
                      onClick={() => setGridCols(cols)}
                      className={`relative grid h-8 w-8 place-items-center transition-colors ${active ? 'text-bone' : 'text-muted hover:text-ink'}`}
                    >
                      {active && <motion.span layoutId="grid-toggle" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                      <Icon size={14} strokeWidth={1.75} className="relative" />
                    </button>
                  )
                })}
              </div>

              <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  className="border border-line bg-cream px-3 py-2 text-xs normal-case tracking-normal text-charcoal outline-none transition-colors focus:border-ink"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
            </motion.div>

            {/* Grid */}
            {results.length > 0 ? (
              <motion.div layout className={`grid gap-x-4 gap-y-14 md:gap-x-6 ${gridClass}`} style={{ perspective: 1400 }}>
                <AnimatePresence mode="popLayout">
                  {results.map((p, i) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 60, rotateX: 25 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.3 } }}
                      transition={{ duration: 0.8, delay: (i % gridCols) * 0.08, ease: EASE, layout: { duration: 0.5, ease: EASE } }}
                      style={{ transformOrigin: 'top center' }}
                    >
                      <ProductCard p={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center py-24 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2 }}
                >
                  <PackageSearch size={48} strokeWidth={1} className="text-oxblood" />
                </motion.div>
                <p className="mt-6 font-display text-4xl text-ink">No pieces match</p>
                <p className="mt-2 max-w-xs text-sm text-muted">Try a different search or clear a few filters.</p>
                <button
                  onClick={clearAll}
                  className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>
        </Container>
      </section>

      {/* ===== Mobile filter drawer ===== */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
            <motion.div
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-bone"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-5">
                <p className="font-display text-3xl text-ink">Filters</p>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="p-1 text-ink transition-transform hover:rotate-90">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8" data-lenis-prevent>
                <FilterPanel id="mob" {...panelProps} />
              </div>
              <div className="border-t border-line p-6">
                <button onClick={() => setDrawerOpen(false)} className="w-full bg-ink py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone">
                  Show {results.length} {results.length === 1 ? 'piece' : 'pieces'}
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}