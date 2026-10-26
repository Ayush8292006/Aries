import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, PackageSearch, Search, Tag, X } from 'lucide-react'
import Container from '../../components/ui/Container'
import SmartImage from '../../components/ui/SmartImage'
import Price from '../../components/ui/Price'
import Reveal from '../../components/motion/Reveal'
import { useProducts } from '../../hooks/useProducts'
import { PROMO_CODES } from '../../config/store'
import {
  BLOG_AUDIENCES,
  BLOG_TOPICS,
  SORTED_POSTS,
  formatPostDate,
  postMatchesFilter,
  postMatchesQuery,
  readTime,
} from '../../data/blog'

const EASE = [0.22, 1, 0.36, 1]
const PAGE_SIZE = 4

/* ================= Small pieces ================= */

function SidebarHeading({ children }) {
  return (
    <h3 className="border-b border-line pb-3 text-[11px] font-medium uppercase tracking-[0.25em] text-ink">{children}</h3>
  )
}

function PostMeta({ post, light = false }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs ${light ? 'text-bone/70' : 'text-muted'}`}>
      By <span className={`font-medium uppercase tracking-wide ${light ? 'text-bone' : 'text-ink'}`}>{post.author}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden>·</span>
      {readTime(post)} min read
    </p>
  )
}

function PromoChip({ code }) {
  const promo = PROMO_CODES[code]
  if (!promo) return null
  return (
    <span className="inline-flex items-center gap-2 border border-dashed border-oxblood bg-oxblood/5 px-3 py-1.5 text-xs font-medium text-oxblood">
      <Tag size={13} strokeWidth={1.75} />
      Use code <strong className="tracking-wider">{code}</strong> · {promo.percent}% off
    </span>
  )
}

/* ================= Featured (sabse naya) article ================= */

function FeaturedPost({ post }) {
  return (
    <Reveal>
      <article className="group relative overflow-hidden bg-ink text-bone">
        <Link to={`/blog/${post.slug}`} className="block" aria-label={post.title}>
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9]">
            <SmartImage
              src={post.image}
              alt={post.title}
              label={post.title}
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1400ms] ease-luxe group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" />
          </div>
        </Link>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-gold-light">
            Latest · {post.category}
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight md:text-5xl">
            <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-gold-light">
              {post.title}
            </Link>
          </h2>
          <div className="mt-4">
            <PostMeta post={post} light />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Link
              to={`/blog/${post.slug}`}
              className="group/btn relative inline-flex items-center gap-3 overflow-hidden bg-bone px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-out group-hover/btn:translate-x-0" />
              <span className="relative flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-bone">
                Read article
                <ArrowRight size={14} strokeWidth={1.5} />
              </span>
            </Link>
            {post.promoCode && PROMO_CODES[post.promoCode] && (
              <span className="inline-flex items-center gap-2 border border-dashed border-gold-light px-3 py-1.5 text-xs text-gold-light">
                <Tag size={13} strokeWidth={1.75} />
                Code <strong className="tracking-wider">{post.promoCode}</strong>
              </span>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}

/* ================= Normal article card ================= */

function PostCard({ post, index }) {
  return (
    <Reveal delay={(index % 2) * 0.08}>
      <article className="group">
        <Link to={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-stone" aria-label={post.title}>
          <SmartImage
            src={post.image}
            alt={post.title}
            label={post.title}
            className="absolute inset-0"
            imgClassName="transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 bg-bone/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
            {post.category}
          </span>
        </Link>

        <div className="mt-5">
          <PostMeta post={post} />
          <h2 className="mt-3 font-display text-2xl leading-snug text-ink md:text-[1.75rem]">
            <Link to={`/blog/${post.slug}`} className="transition-colors hover:text-oxblood">
              {post.title}
            </Link>
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal/80">{post.excerpt}</p>

          {post.promoCode && (
            <div className="mt-4">
              <PromoChip code={post.promoCode} />
            </div>
          )}

          <Link
            to={`/blog/${post.slug}`}
            className="group/btn mt-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
          >
            Read article
            <span className="h-px w-6 bg-current transition-all duration-500 group-hover/btn:w-10" />
          </Link>
        </div>
      </article>
    </Reveal>
  )
}

/* ================= Sidebar ================= */

function FilterList({ title, items, active, onSelect }) {
  return (
    <div>
      <SidebarHeading>{title}</SidebarHeading>
      <ul className="mt-4 space-y-1">
        {items.map((item) => {
          const isActive = active === item.name
          return (
            <li key={item.name}>
              <button
                onClick={() => onSelect(isActive ? '' : item.name)}
                aria-pressed={isActive}
                className={`flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors hover:text-oxblood ${
                  isActive ? 'font-medium text-oxblood' : 'text-charcoal'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className={`h-px transition-all duration-300 ${isActive ? 'w-4 bg-oxblood' : 'w-0 bg-transparent'}`} />
                  {item.name}
                </span>
                <span className="text-xs text-muted">{item.count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Sidebar({ query, onQuery, filter, onFilter }) {
  const { products } = useProducts()
  const [text, setText] = useState(query)
  useEffect(() => setText(query), [query])

  const featured = useMemo(() => products.filter((p) => p.featured).slice(0, 3), [products])
  const recent = SORTED_POSTS.slice(0, 4)

  return (
    <div className="space-y-10 lg:sticky lg:top-28">
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onQuery(text.trim())
        }}
        role="search"
        className="group flex items-center gap-3 border-b-2 border-ink/20 pb-2 transition-colors focus-within:border-ink"
      >
        <Search size={16} strokeWidth={1.5} className="shrink-0 text-muted group-focus-within:text-oxblood" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search articles…"
          aria-label="Search articles"
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted md:text-sm"
        />
        {text && (
          <button
            type="button"
            onClick={() => {
              setText('')
              onQuery('')
            }}
            aria-label="Clear search"
            className="text-muted hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
      </form>

      <FilterList title="Topics" items={BLOG_TOPICS} active={filter} onSelect={onFilter} />
      <FilterList title="Shop for" items={BLOG_AUDIENCES} active={filter} onSelect={onFilter} />

      {/* Recent */}
      <div>
        <SidebarHeading>Recent articles</SidebarHeading>
        <ul className="mt-4 space-y-4">
          {recent.map((post) => (
            <li key={post.slug}>
              <Link to={`/blog/${post.slug}`} className="group flex gap-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden bg-stone">
                  <SmartImage src={post.image} alt="" className="absolute inset-0" />
                </span>
                <span>
                  <span className="line-clamp-2 text-sm leading-snug text-charcoal transition-colors group-hover:text-oxblood">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">{formatPostDate(post.date)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured products */}
      {featured.length > 0 && (
        <div>
          <SidebarHeading>Featured products</SidebarHeading>
          <ul className="mt-4 space-y-4">
            {featured.map((p) => (
              <li key={p.id}>
                <Link to={`/products/${p.id}`} className="group flex gap-3">
                  <span className="relative aspect-[4/5] w-16 shrink-0 overflow-hidden bg-stone">
                    <SmartImage
                      src={p.images?.[0]}
                      alt={p.name}
                      className="absolute inset-0"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg text-ink transition-colors group-hover:text-oxblood">
                      {p.name}
                    </span>
                    <Price amount={p.price} mrp={p.mrp} className="mt-1 text-xs text-ink" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/products"
            className="group mt-5 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
          >
            Shop all
            <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
          </Link>
        </div>
      )}
    </div>
  )
}

/* ================= Page ================= */

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const query = (params.get('q') || '').trim()
  const filter = params.get('topic') || ''
  const [visible, setVisible] = useState(PAGE_SIZE)

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  // Filter / search badle to list shuru se
  useEffect(() => setVisible(PAGE_SIZE), [query, filter])

  const results = useMemo(
    () => SORTED_POSTS.filter((p) => postMatchesFilter(p, filter) && postMatchesQuery(p, query)),
    [query, filter]
  )

  const isFiltering = Boolean(query || filter)
  const featured = !isFiltering ? results[0] : null
  const list = featured ? results.slice(1) : results
  const shown = list.slice(0, visible)

  return (
    <>
      {/* ===== Header ===== */}
      <section className="relative overflow-hidden border-b border-line bg-ivory">
        <p
          aria-hidden
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[16vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(107,30,34,0.07)]"
        >
          JOURNAL
        </p>
        <Container className="relative py-14 md:py-20">
          <nav className="text-xs text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-oxblood">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">Journal</span>
          </nav>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
          >
            <span className="h-px w-10 bg-gold" />
            The Aries Journal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-4 font-display text-5xl tracking-tight text-ink md:text-7xl"
          >
            Offers <em className="text-oxblood">&amp;</em> Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted"
          >
            Leather care, sizing help, styling ideas and the latest offers from our Mumbai workshop.
          </motion.p>
        </Container>
      </section>

      {/* ===== Body ===== */}
      <section className="bg-bone">
        <Container className="grid gap-14 py-12 md:py-16 lg:grid-cols-12 lg:gap-16">
          {/* Main */}
          <div className="lg:col-span-8">
            {/* Active filters */}
            {isFiltering && (
              <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-line pb-5 text-sm">
                <span className="text-muted">
                  {results.length} {results.length === 1 ? 'article' : 'articles'}
                </span>
                {filter && (
                  <button
                    onClick={() => setParam('topic', '')}
                    className="inline-flex items-center gap-2 border border-ink px-3 py-1 text-xs text-ink transition-colors hover:bg-ink hover:text-bone"
                  >
                    {filter} <X size={12} />
                  </button>
                )}
                {query && (
                  <button
                    onClick={() => setParam('q', '')}
                    className="inline-flex items-center gap-2 border border-ink px-3 py-1 text-xs text-ink transition-colors hover:bg-ink hover:text-bone"
                  >
                    “{query}” <X size={12} />
                  </button>
                )}
              </div>
            )}

            {featured && (
              <div className="mb-16">
                <FeaturedPost post={featured} />
              </div>
            )}

            {shown.length > 0 ? (
              <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
                {shown.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            ) : (
              !featured && (
                <div className="flex flex-col items-center py-20 text-center">
                  <PackageSearch size={44} strokeWidth={1} className="text-oxblood" />
                  <p className="mt-6 font-display text-3xl text-ink">No articles found</p>
                  <p className="mt-2 text-sm text-muted">Try a different search or topic.</p>
                  <button
                    onClick={() => setParams(new URLSearchParams(), { replace: true })}
                    className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
                  >
                    View all articles
                  </button>
                </div>
              )
            )}

            {/* Load more */}
            {list.length > 0 && (
              <div className="mt-16 flex flex-col items-center gap-5 border-t border-line pt-10">
                <p className="text-sm text-muted">
                  Showing {shown.length + (featured ? 1 : 0)} of {results.length} articles
                </p>
                {visible < list.length && (
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="border border-ink px-10 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-bone"
                  >
                    Load more
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <Sidebar
              query={query}
              onQuery={(v) => setParam('q', v)}
              filter={filter}
              onFilter={(v) => setParam('topic', v)}
            />
          </aside>
        </Container>
      </section>
    </>
  )
}