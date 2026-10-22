import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '../ui/Container'
import Price from '../ui/Price'
import SmartImage from '../ui/SmartImage'
import { CATEGORIES } from '../../config/site'
import { useProducts } from '../../hooks/useProducts'
import { useWishlist } from '../../hooks/useWishlist'

const COUNT = 5

/* ===== Chhota product card (bina hover feature) ===== */
function SimpleCard({ p, rank }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const liked = isWishlisted(p.id)

  const handleHeart = () => {
    const added = toggleWishlist(p.id)
    toast.success(added ? 'Saved to favourites' : 'Removed from favourites')
  }

  return (
    <article className="relative">
      <span className="pointer-events-none absolute -top-3 left-3 z-10 bg-cream px-2 font-display text-lg italic text-oxblood">
        {String(rank).padStart(2, '0')}
      </span>

      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <Link to={`/products/${p.id}`} aria-label={p.name} className="absolute inset-0">
          <SmartImage src={p.images?.[0]} alt={p.name} label={p.name} className="absolute inset-0" />
        </Link>

        {p.tag && (
          <span className="pointer-events-none absolute bottom-3 left-3 bg-bone/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
            {p.tag}
          </span>
        )}

        <button
          onClick={handleHeart}
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={liked}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bone/90 text-ink transition-colors hover:text-oxblood"
        >
          <Heart size={16} strokeWidth={1.5} className={liked ? 'fill-oxblood text-oxblood' : ''} />
        </button>
      </div>

      <div className="mt-4">
        <h3 className="truncate font-display text-lg leading-snug text-ink">
          <Link to={`/products/${p.id}`} className="transition-colors hover:text-oxblood">
            {p.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted">{p.material}</p>
        <Price amount={p.price} mrp={p.mrp} className="mt-2 text-sm text-ink" />
      </div>
    </article>
  )
}

/* ===== Bada No. 01 card ===== */
function FeatureCard({ p }) {
  return (
    <article className="relative flex h-full flex-col bg-ink text-bone">
      <Link to={`/products/${p.id}`} className="relative block flex-1 overflow-hidden" aria-label={p.name}>
        <div className="relative aspect-[4/5] h-full w-full lg:aspect-auto lg:min-h-[560px]">
          <SmartImage src={p.images?.[0]} alt={p.name} label={p.name} className="absolute inset-0" />
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/20 to-transparent" />

          <p className="absolute left-6 top-5 font-display text-6xl italic leading-none text-bone/90 md:text-7xl">
            <span className="text-2xl not-italic text-gold-light md:text-3xl">No.</span> 01
          </p>
          {p.tag && (
            <span className="absolute right-5 top-6 border border-bone/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-bone">
              {p.tag}
            </span>
          )}
        </div>
      </Link>

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold-light">Our bestseller</p>
        <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">
          <Link to={`/products/${p.id}`} className="transition-colors hover:text-gold-light">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-bone/70">{p.material}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-bone/15 pt-5">
          <Price amount={p.price} mrp={p.mrp} className="text-lg text-bone [&_.text-muted]:text-bone/50" />
          <Link
            to={`/products/${p.id}`}
            className="inline-flex items-center gap-2 bg-bone px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-oxblood hover:text-bone"
          >
            Shop now
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Trending() {
  const { products } = useProducts()
  const [tab, setTab] = useState('all')

  // Sirf wahi tabs jinmein products hain
  const tabs = useMemo(
    () => [{ slug: 'all', name: 'All' }, ...CATEGORIES.filter((c) => products.some((p) => p.category === c.slug))],
    [products]
  )

  // Featured pehle, phir baaki
  const list = useMemo(() => {
    const pool = products.filter((p) => tab === 'all' || p.category === tab)
    return [...pool].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, COUNT)
  }, [products, tab])

  const [first, ...rest] = list

  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        {/* ===== Heading ===== */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">
              <span className="h-px w-10 bg-gold" />
              Most loved
            </p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">Bestsellers</h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            The pieces our customers return to most — handmade to order in our Mumbai workshop.
          </p>
        </div>

        {/* ===== Tabs ===== */}
        <div className="-mx-4 mt-10 overflow-x-auto px-4 md:mx-0 md:px-0" data-lenis-prevent>
          <div className="flex min-w-max gap-8 border-b border-line">
            {tabs.map((t) => {
              const active = tab === t.slug
              return (
                <button
                  key={t.slug}
                  onClick={() => setTab(t.slug)}
                  className={`relative pb-4 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {t.name}
                  {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-oxblood" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* ===== Grid ===== */}
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4 lg:grid-rows-2">
          {first && (
            <div className="col-span-2 lg:row-span-2">
              <FeatureCard p={first} />
            </div>
          )}
          {rest.map((p, i) => (
            <SimpleCard key={p.id} p={p} rank={i + 2} />
          ))}
        </div>

        {/* ===== Shop all ===== */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-3 border border-ink px-10 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-bone"
          >
            Shop all pieces
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </Container>
    </section>
  )
}