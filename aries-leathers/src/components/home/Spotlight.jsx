import { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import { SEED_PRODUCTS } from '../../data/products' // <- apne products file ka sahi path

const EASE = [0.22, 1, 0.36, 1]

// PageTransition.jsx bhi inhi keys ko padhta hai
export const RETURN_KEY = 'aries_return_scroll'
export const REVEAL_KEY = 'aries_reveal'

const featured = SEED_PRODUCTS.filter((p) => p.featured)
const RACK = featured.length >= 5 ? featured : SEED_PRODUCTS.slice(0, 8)
const COUNT = RACK.length
const STEP = (Math.PI * 2) / COUNT

const productUrl = (p) => `/products/${p.id}` // <- apna product route

/** Gol ring par ghoomta card. theta = 0 -> bilkul saamne */
function RackCard({ product, index, p, onPick }) {
  const [hovered, setHovered] = useState(false)

  const theta = useTransform(p, (v) => (index - v) * STEP)
  const depth = useTransform(theta, (t) => (Math.cos(t) + 1) / 2)

  const x = useTransform(theta, (t) => `calc(var(--rx) * ${Math.sin(t).toFixed(4)})`)
  const y = useTransform(theta, (t) => `calc(var(--ry) * ${Math.cos(t).toFixed(4)})`)

  // ---- Hover spring (0 -> 1), drives all hover effects on the motion track ----
  const hoverMV = useMotionValue(0)
  useEffect(() => {
    hoverMV.set(hovered ? 1 : 0)
  }, [hovered, hoverMV])
  const hoverSpring = useSpring(hoverMV, { stiffness: 300, damping: 24, mass: 0.5 })

  // Base scale from depth + hover lift on top
  const baseScale = useTransform(depth, (d) => 0.55 + d * 0.8)
  const scale = useTransform([baseScale, hoverSpring], ([s, h]) => s * (1 + h * 0.12))

  const opacity = useTransform(depth, (d) => 0.15 + 0.85 * Math.pow(d, 1.6))
  const zIndex = useTransform([depth, hoverSpring], ([d, h]) => Math.round(d * 100) + (h > 0.5 ? 50 : 0))

  // Inner image zoom
  const imgScale = useTransform(hoverSpring, (h) => 1 + h * 0.14)
  const overlayOpacity = useTransform(hoverSpring, [0, 1], [0, 1])

  // Shadow elevation
  const boxShadow = useTransform(
    hoverSpring,
    [0, 1],
    [
      '0 8px 24px -8px rgba(0,0,0,0.35)',
      '0 24px 60px -12px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06)',
    ],
  )

  return (
    <motion.button
      type="button"
      data-card={product.id}
      onClick={() => onPick(index)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={product.name}
      style={{
        x,
        y,
        scale,
        opacity,
        zIndex,
        boxShadow,
        width: 'var(--cw)',
        marginLeft: 'calc(var(--cw) / -2)',
        marginTop: 'calc(var(--cw) * -0.667)',
        top: 'var(--cy)',
      }}
      className="absolute left-1/2 aspect-3/4 cursor-pointer overflow-hidden bg-ink-light will-change-transform"
    >
      {/* Image with smooth inner zoom */}
      <motion.img
        src={product.images[0]}
        alt={product.name}
        draggable={false}
        loading="lazy"
        style={{ scale: imgScale }}
        className="h-full w-full object-cover"
      />

      {/* Premium gradient overlay — fades in on hover */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: overlayOpacity,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Subtle inner border shine */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: overlayOpacity,
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
        }}
      />
    </motion.button>
  )
}

export default function Spotlight() {
  const ref = useRef(null)
  const navigate = useNavigate()
  const navType = useNavigationType()
  const { pathname } = useLocation()
  const [active, setActive] = useState(0)
  const [opening, setOpening] = useState(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.6 })
  const p = useTransform(smooth, [0, 1], [0, COUNT - 1])

  useMotionValueEvent(p, 'change', (v) => {
    setActive(Math.min(COUNT - 1, Math.max(0, Math.round(v))))
  })

  // Back par scroll restore hone tak spring ko seedha jump karao (rack ghoomta na dikhe)
  const settling = useRef(navType === 'POP')
  const timer = useRef(null)
  if (settling.current && !timer.current && typeof window !== 'undefined') {
    timer.current = setTimeout(() => (settling.current = false), 1200)
  }
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (settling.current) smooth.jump(v)
  })

  const goTo = (i) => {
    const el = ref.current
    if (!el) return
    const range = el.offsetHeight - window.innerHeight
    const target = Math.min(COUNT - 1, Math.max(0, i))
    const top = el.offsetTop + (range * target) / (COUNT - 1)
    const lenis = window.__lenis
    if (lenis) lenis.scrollTo(top, { duration: 1.1 })
    else window.scrollTo({ top, behavior: 'smooth' })
  }

  const openProduct = (i) => {
    const product = RACK[i]
    const to = productUrl(product)
    try {
      sessionStorage.setItem(RETURN_KEY, JSON.stringify({ path: pathname, y: window.scrollY }))
    } catch {
      /* ignore */
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = document.querySelector(`[data-card="${product.id}"]`)
    if (reduce || !el) return navigate(to)

    try {
      sessionStorage.setItem(REVEAL_KEY, '1')
    } catch {
      /* ignore */
    }
    const r = el.getBoundingClientRect()
    setOpening({ rect: { top: r.top, left: r.left, width: r.width, height: r.height }, src: product.images[0], to })
  }

  const onPick = (i) => (i === active ? openProduct(i) : goTo(i))
  const current = RACK[active]

  return (
    <section ref={ref} className="relative bg-ink text-bone" style={{ height: `${COUNT * 55 + 100}vh` }}>
      <div
        className="sticky top-0 h-svh overflow-hidden"
        style={{
          '--cw': 'clamp(92px, min(12vw, 15svh), 150px)',
          '--rx': 'min(34vw, 460px)',
          '--ry': 'min(13svh, 150px)',
          '--cy': 'calc(100% - var(--ry) - var(--cw) * 0.9 - 12px)',
        }}
      >
        <Container className="grid h-full grid-rows-[auto_minmax(0,1fr)_auto] pb-6 pt-20 md:pt-24">
          {/* Counter */}
          <p className="relative z-30 bg-ink pb-3 text-center font-display text-3xl leading-none md:text-4xl">
            {active + 1}
            <span className="text-bone/35"> / {COUNT}</span>
          </p>

          {/* Rack */}
          <div className="relative min-h-0 overflow-hidden">
            {RACK.map((product, i) => (
              <RackCard key={product.id} product={product} index={i} p={p} onPick={onPick} />
            ))}
          </div>

          {/* Info */}
          <div className="relative z-30 flex flex-col items-center gap-4 bg-ink pt-4">
            <div className="h-[50px] text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: EASE }}
                >
                  <p className="font-display text-xl leading-tight md:text-2xl">{current.name}</p>
                  <p className="mt-1 text-sm text-bone/65">${current.price.toFixed(2)}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                aria-label="Previous"
                className="p-2 text-bone/70 transition-colors hover:text-bone disabled:opacity-25"
              >
                <ArrowLeft size={20} strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => openProduct(active)}
                className="bg-bone px-9 py-3.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-oxblood hover:text-bone"
              >
                View item
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                disabled={active === COUNT - 1}
                aria-label="Next"
                className="p-2 text-bone/70 transition-colors hover:text-bone disabled:opacity-25"
              >
                <ArrowRight size={20} strokeWidth={1.25} />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Card phailkar poori screen banta hai, phir page khulta hai */}
      <AnimatePresence>
        {opening && (
          <motion.div
            key="opening"
            className="fixed z-[200] overflow-hidden bg-ink"
            initial={{ ...opening.rect }}
            animate={{ top: 0, left: 0, width: '100vw', height: '100svh' }}
            transition={{ duration: 0.7, ease: EASE }}
            onAnimationComplete={() => navigate(opening.to)}
          >
            <img src={opening.src} alt="" className="h-full w-full object-cover" />
            <motion.div
              className="absolute inset-0 bg-ink"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}