import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, Copy, Link2, Tag } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Container from '../../components/ui/Container'
import SmartImage from '../../components/ui/SmartImage'
import ProductCard from '../../components/product/ProductCard'
import Reveal from '../../components/motion/Reveal'
import { useProducts } from '../../hooks/useProducts'
import { useCart } from '../../hooks/useCart'
import { PROMO_CODES } from '../../config/store'
import { SORTED_POSTS, formatPostDate, getPost, readTime } from '../../data/blog'

const EASE = [0.22, 1, 0.36, 1]

/* ===== Article ka ek block ===== */
function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-12 font-display text-3xl leading-tight text-ink md:text-4xl">{block.text}</h2>
    case 'list':
      return (
        <ul className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-[17px] leading-[1.75] text-charcoal">
              <span className="mt-[0.85em] h-px w-4 shrink-0 bg-oxblood" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'quote':
      return (
        <blockquote className="my-12 border-l-2 border-oxblood pl-6 font-display text-2xl italic leading-snug text-ink md:text-3xl">
          {block.text}
        </blockquote>
      )
    default:
      return <p className="mt-6 text-[17px] leading-[1.85] text-charcoal">{block.text}</p>
  }
}

/* ===== Promo code box ===== */
function PromoBox({ code }) {
  const promo = PROMO_CODES[code]
  const { applyPromo } = useCart()
  const [copied, setCopied] = useState(false)

  if (!promo) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy — please type the code at checkout')
    }
  }

  const apply = () => {
    if (applyPromo(code)) toast.success(`${code} applied to your cart`)
  }

  return (
    <div className="my-12 border border-oxblood/30 bg-ivory p-6 md:p-8">
      <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-oxblood">
        <Tag size={14} strokeWidth={1.75} /> Your offer
      </p>
      <p className="mt-3 font-display text-2xl text-ink md:text-3xl">{promo.label}</p>

      <div className="mt-6 flex flex-wrap items-stretch gap-3">
        <span className="grid place-items-center border-2 border-dashed border-oxblood px-6 py-3 font-display text-2xl tracking-[0.2em] text-oxblood">
          {code}
        </span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 border border-ink px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-bone"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy code'}
        </button>
        <button
          onClick={apply}
          className="inline-flex items-center gap-2 bg-ink px-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:bg-oxblood"
        >
          Apply to my cart
        </button>
      </div>
      <p className="mt-4 text-xs text-muted">The discount is shown in your order summary at checkout.</p>
    </div>
  )
}

/* ===== Share ===== */
function Share({ title }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied')
    } catch {
      toast.error('Could not copy the link')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted">Share</span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on WhatsApp"
        className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-oxblood hover:text-oxblood"
      >
        <FaWhatsapp size={15} />
      </a>
      <button
        onClick={copyLink}
        aria-label="Copy link"
        className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink transition-colors hover:border-oxblood hover:text-oxblood"
      >
        <Link2 size={15} />
      </button>
    </div>
  )
}

/* ===== Page ===== */
function PostView({ post }) {
  const { getProduct } = useProducts()
  const products = useMemo(() => (post.productIds ?? []).map(getProduct).filter(Boolean), [post, getProduct])

  // Pichhla / agla article
  const index = SORTED_POSTS.findIndex((p) => p.slug === post.slug)
  const newer = SORTED_POSTS[index - 1]
  const older = SORTED_POSTS[index + 1]
  const more = SORTED_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3)

  // Upar padhne ki progress line
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <>
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-oxblood"
      />

      {/* ===== Header ===== */}
      <section className="bg-ivory">
        <Container className="pt-10 md:pt-14">
          <nav className="text-xs text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-oxblood">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="transition-colors hover:text-oxblood">Journal</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{post.category}</span>
          </nav>

          <div className="mx-auto mt-10 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex flex-wrap items-center justify-center gap-2"
            >
              <Link
                to={`/blog?topic=${encodeURIComponent(post.category)}`}
                className="bg-oxblood px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-ink"
              >
                {post.category}
              </Link>
              {(post.tags ?? []).map((t) => (
                <Link
                  key={t}
                  to={`/blog?topic=${encodeURIComponent(t)}`}
                  className="border border-line px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-ink"
                >
                  {t}
                </Link>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="mt-6 font-display text-4xl leading-[1.1] tracking-tight text-ink md:text-6xl"
            >
              {post.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-muted"
            >
              By <span className="font-medium uppercase tracking-wide text-ink">{post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden>·</span>
              {readTime(post)} min read
            </motion.p>
          </div>

          {/* Photo — aadhi header mein, aadhi neeche ke section mein */}
          <div className="relative z-10 mx-auto mt-12 max-w-5xl translate-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: EASE }}
              className="relative aspect-[16/10] overflow-hidden bg-stone shadow-lift md:aspect-[16/8]"
            >
              <SmartImage src={post.image} alt={post.title} label={post.title} className="absolute inset-0" />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ===== Article ===== */}
      <section className="bg-bone pb-20 pt-28 md:pb-28">
        <Container>
          <article className="mx-auto max-w-2xl">
            <p className="font-display text-2xl leading-snug text-ink md:text-[1.75rem]">{post.excerpt}</p>

            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            {post.promoCode && <PromoBox code={post.promoCode} />}

            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-y border-line py-6">
              <Share title={post.title} />
              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
              >
                <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform group-hover:-translate-x-1" />
                All articles
              </Link>
            </div>

            {/* Pichhla / agla */}
            {(older || newer) && (
              <nav className="mt-10 grid gap-6 sm:grid-cols-2" aria-label="More articles">
                {older ? (
                  <Link to={`/blog/${older.slug}`} className="group block">
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted">
                      <ArrowLeft size={12} /> Previous
                    </span>
                    <span className="mt-2 block font-display text-xl leading-snug text-ink transition-colors group-hover:text-oxblood">
                      {older.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {newer && (
                  <Link to={`/blog/${newer.slug}`} className="group block sm:text-right">
                    <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted sm:justify-end">
                      Next <ArrowRight size={12} />
                    </span>
                    <span className="mt-2 block font-display text-xl leading-snug text-ink transition-colors group-hover:text-oxblood">
                      {newer.title}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>
        </Container>
      </section>

      {/* ===== Is article ke products ===== */}
      {products.length > 0 && (
        <section className="border-t border-line bg-ivory py-20">
          <Container>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Shop the story</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">Pieces from this article</h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
              {products.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ===== Aur articles ===== */}
      {more.length > 0 && (
        <section className="bg-bone py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-3xl tracking-tight text-ink md:text-4xl">Keep reading</h2>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
              >
                All articles
                <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
              </Link>
            </div>
            <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-3">
              {more.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <Link to={`/blog/${p.slug}`} className="group block">
                    <span className="relative block aspect-[16/10] overflow-hidden bg-stone">
                      <SmartImage
                        src={p.image}
                        alt={p.title}
                        label={p.title}
                        className="absolute inset-0"
                        imgClassName="transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-4 block text-[10px] uppercase tracking-[0.25em] text-oxblood">{p.category}</span>
                    <span className="mt-2 block font-display text-xl leading-snug text-ink transition-colors group-hover:text-oxblood">
                      {p.title}
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPost(slug)

  if (!post) {
    return (
      <section className="bg-bone">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-4xl text-ink">Article not found</p>
          <p className="mt-3 text-sm text-muted">This article may have been moved or removed.</p>
          <Link
            to="/blog"
            className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
          >
            Back to the journal
          </Link>
        </Container>
      </section>
    )
  }

  // key se doosre article par jaate hi sab reset
  return <PostView key={post.slug} post={post} />
}