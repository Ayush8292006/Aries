import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ExternalLink, Heart, Minus, Plus, Ruler, Scissors, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import Container from '../../components/ui/Container'
import Price from '../../components/ui/Price'
import SmartImage from '../../components/ui/SmartImage'
import Flag from '../../components/ui/Flag'
import ProductCard from '../../components/product/ProductCard'
import Reveal from '../../components/motion/Reveal'
import { useProducts } from '../../hooks/useProducts'
import { useCurrency } from '../../hooks/useCurrency'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { CATEGORIES } from '../../config/site'
import { MAX_QTY } from '../../config/store'
import { getVariantExtra, getVariantPrice, hasVariantPricing } from '../../utils/variantPrice'

const EASE = [0.22, 1, 0.36, 1]

const COLOR_HEX = {
  black: '#1B1B1B', brown: '#7A4A2A', 'dark brown': '#4A2C1C', 'cognac brown': '#9A5A2E',
  'espresso brown': '#3B2416', tan: '#C19A6B', blue: '#2C4A8A', navy: '#1F2A44',
  gray: '#8A8A8A', charcoal: '#3A3A3A', white: '#F3F0EA', olive: '#6B6B3A',
  red: '#8A1F1F', beige: '#D9C7A7', burgundy: '#5E1A24',
  mustard: '#C9962B', orange: '#C2622D', 'royal blue': '#2A4FA8', 'powder blue': '#9DB7D5', 'distressed brown': '#5C3A24',
}
const LIGHT_SWATCHES = ['#F3F0EA', '#D9C7A7', '#C19A6B', '#9DB7D5', '#C9962B']

function Accordion({ id, title, open, onToggle, children }) {
  const isOpen = open === id
  return (
    <div className="border-b border-line">
      <button
        onClick={() => onToggle(isOpen ? null : id)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-5 text-left text-[12px] font-medium uppercase tracking-[0.2em] text-ink"
      >
        {title}
        <Plus size={16} strokeWidth={1.5} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm leading-relaxed text-charcoal/80">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===== UPDATED PREMIUM GALLERY =====
function Gallery({ images, name }) {
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 })

  const handleMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ 
      on: true, 
      x: ((e.clientX - r.left) / r.width) * 100, 
      y: ((e.clientY - r.top) / r.height) * 100 
    })
  }

  return (
    <div className="flex flex-col-reverse gap-3 lg:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto lg:w-20 lg:flex-col lg:overflow-visible" data-lenis-prevent>
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`aspect-[4/5] w-16 shrink-0 overflow-hidden border-2 transition-all duration-300 lg:w-full ${
                active === i ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <SmartImage src={src} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}

      <div
        onMouseMove={handleMove}
        onMouseLeave={() => setZoom((z) => ({ ...z, on: false }))}
        className="relative aspect-[4/5] flex-1 cursor-zoom-in overflow-hidden bg-stone"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {/* Premium inner zoom logic */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: zoom.on ? 1.8 : 1,
                transformOrigin: zoom.on ? `${zoom.x}% ${zoom.y}%` : 'center center'
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30, 
                mass: 0.5,
                // Smooth fallback for exit
                scale: { duration: 0.4, ease: EASE } 
              }}
            >
              <SmartImage src={images[active]} alt={name} label={name} className="h-full w-full" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function OptionHeading({ label, value, extra }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
        {label}
        {value && <span className="ml-2 normal-case tracking-normal text-muted">— {value}</span>}
      </p>
      {extra}
    </div>
  )
}

function ProductView({ product }) {
  const { products } = useProducts()
  const { country, currency, formatPrice } = useCurrency()
  const { addItem, openCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const [qty, setQty] = useState(1)
  const [size, setSize] = useState(null)
  const [color, setColor] = useState(product.colors?.[0] ?? null)
  const [sizeError, setSizeError] = useState(false)
  const [open, setOpen] = useState('description')

  const variant = getVariantPrice(product, { size, color })
  const varies = hasVariantPricing(product)

  const liked = isWishlisted(product.id)
  const category = CATEGORIES.find((c) => c.slug === product.category)
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, 4)

  const handleAdd = () => {
    if (product.sizes?.length && !size) {
      setSizeError(true)
      toast.error('Select a size first')
      return
    }
    addItem({ productId: product.id, size, color, qty })
    openCart()
  }

  const handleHeart = () => {
    const added = toggleWishlist(product.id)
    toast.success(added ? 'Saved to favourites' : 'Removed from favourites')
  }

  return (
    <>
      <section className="bg-bone">
        <Container className="py-8 md:py-12">
          <nav className="mb-8 text-xs text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-oxblood">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/products?category=${product.category}`} className="transition-colors hover:text-oxblood">
              {category?.name ?? 'Shop'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <motion.div
              className="lg:col-span-7"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <Gallery images={product.images ?? []} name={product.name} />
            </motion.div>

            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            >
              <div className="lg:sticky lg:top-28">
                <div className="flex flex-wrap gap-2">
                  {product.tag && (
                    <span className="bg-oxblood px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-bone">{product.tag}</span>
                  )}
                  <span className="border border-line px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal">Made to order</span>
                </div>

                <h1 className="mt-5 font-display text-4xl leading-tight tracking-tight text-ink md:text-5xl">{product.name}</h1>
                <p className="mt-2 text-sm text-muted">{product.material}</p>

                <div className="relative mt-6 h-9 overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={variant.price}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-100%', opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <Price amount={variant.price} mrp={variant.mrp} className="text-2xl text-ink" />
                    </motion.div>
                  </AnimatePresence>
                </div>
                {varies && !size && (
                  <p className="mt-1 text-xs text-muted">From price shown · final price depends on the size you choose.</p>
                )}
                {variant.extra > 0 && (
                  <p className="mt-1 text-xs text-muted">
                    Includes {formatPrice(variant.extra)} for{' '}
                    {[size, getVariantExtra(product, { color }) > 0 ? color : null].filter(Boolean).join(' · ')}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-2 text-xs text-muted">
                  <Flag code={country.code} /> Prices in {currency.name} ({currency.code}) · Free shipping
                </p>

                {product.colors?.length > 0 && (
                  <div className="mt-8">
                    <OptionHeading label="Colour" value={color} />
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((c) => {
                        const hex = COLOR_HEX[c.toLowerCase()] ?? '#C9BBA6'
                        const active = color === c
                        return (
                          <button
                            key={c}
                            onClick={() => setColor(c)}
                            aria-label={c}
                            aria-pressed={active}
                            title={c}
                            className={`grid h-9 w-9 place-items-center rounded-full border-2 transition-all duration-300 ${
                              active ? 'border-ink' : 'border-transparent hover:border-line'
                            }`}
                          >
                            <span
                              className="grid h-7 w-7 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
                              style={{ background: hex }}
                            >
                              {active && <Check size={13} className={LIGHT_SWATCHES.includes(hex) ? 'text-ink' : 'text-bone'} />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {product.sizes?.length > 0 && (
                  <div className="mt-8">
                    <OptionHeading
                      label="Size"
                      value={size}
                      extra={
                        <button
                          onClick={() => setOpen('fit')}
                          className="flex items-center gap-1.5 text-xs text-charcoal underline underline-offset-4 hover:text-oxblood"
                        >
                          <Ruler size={13} strokeWidth={1.5} /> Size guide
                        </button>
                      }
                    />
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setSize(s)
                            setSizeError(false)
                          }}
                          aria-pressed={size === s}
                          className={`min-w-12 border px-3 py-2.5 text-xs font-medium transition-colors duration-300 ${
                            size === s
                              ? 'border-ink bg-ink text-bone'
                              : sizeError
                                ? 'border-oxblood-light text-charcoal hover:border-ink'
                                : 'border-line text-charcoal hover:border-ink'
                          }`}
                        >
                          <span className="block">{s}</span>
                          {varies && (
                            <span className={`mt-0.5 block whitespace-nowrap text-[10px] font-normal ${size === s ? 'text-bone/75' : 'text-muted'}`}>
                              {formatPrice(getVariantPrice(product, { size: s, color }).price)}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                    {sizeError && <p className="mt-2 text-xs text-oxblood-light">Please select a size</p>}
                    {size === 'Custom' && (
                      <p className="mt-3 border-l-2 border-oxblood bg-ivory px-4 py-3 text-xs leading-relaxed text-charcoal">
                        We'll contact you after your order for your chest, shoulder, sleeve and waist measurements.
                      </p>
                    )}
                  </div>
                )}

                <div className="mt-8 flex items-stretch gap-3">
                  <div className="flex items-center border border-line">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="grid h-full w-11 place-items-center text-ink transition-colors hover:bg-stone"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                      aria-label="Increase quantity"
                      className="grid h-full w-11 place-items-center text-ink transition-colors hover:bg-stone"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-ink py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
                  >
                    Add to cart
                  </button>

                  <button
                    onClick={handleHeart}
                    aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
                    aria-pressed={liked}
                    className="grid w-14 place-items-center border border-line text-ink transition-colors hover:border-oxblood hover:text-oxblood"
                  >
                    <Heart size={18} strokeWidth={1.5} className={liked ? 'fill-oxblood text-oxblood' : ''} />
                  </button>
                </div>

                <ul className="mt-6 space-y-2.5 text-sm text-charcoal">
                  <li className="flex items-center gap-3">
                    <Scissors size={16} strokeWidth={1.5} className="text-oxblood" /> Handmade to order in our Mumbai workshop
                  </li>
                  <li className="flex items-center gap-3">
                    <Truck size={16} strokeWidth={1.5} className="text-oxblood" /> Ships in 6–9 working days · Free worldwide shipping
                  </li>
                </ul>

                <div className="mt-8 border-t border-line">
                  <Accordion id="description" title="Description" open={open} onToggle={setOpen}>
                    {product.description}
                  </Accordion>
                  <Accordion id="details" title="Details" open={open} onToggle={setOpen}>
                    <ul className="space-y-1.5">
                      {(product.details ?? []).map((d) => (
                        <li key={d} className="flex gap-2">
                          <span className="text-oxblood">—</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                  <Accordion id="fit" title="Size and fit" open={open} onToggle={setOpen}>
                    Choose your usual size, or select <strong>Custom</strong> for a made-to-measure fit. For jackets we need
                    chest, shoulder and sleeve length; for pants, waist, hips, thigh, rise and inseam. Measure over light clothing
                    with a soft tape.
                  </Accordion>
                  <Accordion id="shipping" title="Shipping and returns" open={open} onToggle={setOpen}>
                    Every piece is made to order and dispatched in 6–9 working days with free tracked shipping from India.
                    Returns are accepted within 14 days if unused and in original condition. Custom-size orders can't be returned.
                    Import duties, where applicable, are paid by the buyer.
                  </Accordion>
                </div>

                {product.etsyUrl && (
                  <a
                    href={product.etsyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-xs text-muted underline underline-offset-4 transition-colors hover:text-oxblood"
                  >
                    Also available on our Etsy shop <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-ivory">
          <Container className="py-20">
            <Reveal>
              <h2 className="mb-12 font-display text-3xl tracking-tight text-ink md:text-4xl">You may also like</h2>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { getProduct } = useProducts()
  const product = getProduct(id)

  if (!product) {
    return (
      <section className="bg-bone">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
          <p className="font-display text-4xl text-ink">Product not found</p>
          <p className="mt-3 text-sm text-muted">This piece may have been moved or is no longer available.</p>
          <Link
            to="/products"
            className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
          >
            Browse all products
          </Link>
        </Container>
      </section>
    )
  }

  return <ProductView key={product.id} product={product} />
}