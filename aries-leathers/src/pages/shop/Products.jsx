import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { PackageSearch, Search, SlidersHorizontal, X } from 'lucide-react'
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

function matchesQuery(p, q) {
  const haystack = `${p.name} ${p.category} ${p.material} ${p.color} ${p.description}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

function FilterHeading({ children }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">{children}</p>
}

function FilterPanel({ category, gender, priceCap, maxBase, counts, onCategory, onGender, onPrice, onClear, formatPrice }) {
  return (
    <div className="space-y-10">
      <div>
        <FilterHeading>Category</FilterHeading>
        <ul className="mt-4 space-y-1">
          {[{ slug: 'all', name: 'All products' }, ...CATEGORIES].map((c) => {
            const active = category === c.slug
            return (
              <li key={c.slug}>
                <button
                  onClick={() => onCategory(c.slug)}
                  className={`group flex w-full items-center justify-between py-2 text-left text-sm transition-colors duration-300 ${active ? 'text-oxblood' : 'text-charcoal hover:text-oxblood'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`h-px bg-oxblood transition-all duration-300 ${active ? 'w-5' : 'w-0 group-hover:w-3'}`} />
                    {c.name}
                  </span>
                  <span className="text-xs text-muted">{counts[c.slug] ?? 0}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <div>
        <FilterHeading>Shop for</FilterHeading>
        <div className="mt-4 flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              onClick={() => onGender(g.value)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                gender === g.value ? 'border-ink bg-ink text-bone' : 'border-line text-charcoal hover:border-ink'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-4">
          <FilterHeading>Price</FilterHeading>
          <span className="text-sm text-charcoal">Up to {formatPrice(priceCap ?? maxBase)}</span>
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

      <button onClick={onClear} className="text-[11px] uppercase tracking-[0.2em] text-charcoal underline underline-offset-4 transition-colors hover:text-oxblood">
        Clear all filters
      </button>
    </div>
  )
}

export default function Products({ searchMode = false }) {
  const { products } = useProducts()
  const { formatPrice } = useCurrency()
  const [params, setParams] = useSearchParams()

  const category = params.get('category') || 'all'
  const gender = params.get('gender') || 'all'
  const sort = params.get('sort') || 'featured'
  const q = (params.get('q') || '').trim()

  // Price filter BASE USD mein — currency badalne par bhi sahi rehta hai
  const maxBase = useMemo(() => Math.ceil(Math.max(0, ...products.map((p) => p.price))), [products])
  const [priceCap, setPriceCap] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [searchText, setSearchText] = useState(q)

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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
    products.forEach((p) => { c[p.category] = (c[p.category] ?? 0) + 1 })
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
      <section className="border-b border-line bg-ivory">
        <Container className="py-14 md:py-20">
          <nav className="text-xs text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-oxblood">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{searchMode ? 'Search' : 'Shop'}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
            <SplitReveal key={title} text={title} />
          </h1>

          {searchMode && (
            <form onSubmit={handleSearch} className="mt-8 flex max-w-xl items-center gap-3 border-b border-ink/30 transition-colors focus-within:border-ink">
              <Search size={18} strokeWidth={1.5} className="text-muted" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search wallets, bags, belts..."
                className="w-full bg-transparent py-3 text-base text-ink outline-none placeholder:text-muted"
                aria-label="Search products"
              />
              <button className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:text-oxblood">Search</button>
            </form>
          )}

          <p className="mt-5 text-sm text-muted">
            {results.length} {results.length === 1 ? 'piece' : 'pieces'}
          </p>
        </Container>
      </section>

      {/* ===== Body ===== */}
      <section className="bg-bone">
        <Container className="grid gap-12 py-12 lg:grid-cols-12 lg:py-16">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <FilterPanel {...panelProps} />
            </div>
          </aside>

          <div className="lg:col-span-9">
            {/* Toolbar */}
            <div className="mb-10 flex items-center justify-between gap-4 border-b border-line pb-5">
              <button
                onClick={() => setDrawerOpen(true)}
                className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink lg:hidden"
              >
                <SlidersHorizontal size={16} strokeWidth={1.5} /> Filters
              </button>
              <p className="hidden text-sm text-muted lg:block">
                Showing {results.length} of {products.length}
              </p>
              <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setParam('sort', e.target.value)}
                  className="border border-line bg-bone px-3 py-2 text-xs normal-case tracking-normal text-charcoal outline-none transition-colors focus:border-ink"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Grid */}
            {results.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {results.map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <ProductCard p={p} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center py-24 text-center">
                <PackageSearch size={40} strokeWidth={1} className="text-muted" />
                <p className="mt-6 font-display text-3xl text-ink">No pieces match</p>
                <p className="mt-2 max-w-xs text-sm text-muted">Try a different search or clear a few filters.</p>
                <button
                  onClick={clearAll}
                  className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
                >
                  Clear filters
                </button>
              </div>
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
                <p className="font-display text-2xl text-ink">Filters</p>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close filters" className="p-1 text-ink">
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <FilterPanel {...panelProps} />
              </div>
              <div className="border-t border-line p-6">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-ink py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone"
                >
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