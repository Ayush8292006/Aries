import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import SplitReveal from '../motion/SplitReveal'
import { SPOTLIGHT } from '../../data/home'
import jacketImg from '../../assets/signature-jacket.png'

const EASE = [0.22, 1, 0.36, 1]

/** Khoobi card — jacket ke side mein */
function Feature({ progress, start, index, title, text, align }) {
  const opacity = useTransform(progress, [start, start + 0.08], [0, 1])
  const x = useTransform(progress, [start, start + 0.08], [align === 'left' ? -50 : 50, 0])

  return (
    <motion.div
      style={{ opacity, x }}
      className={`border border-gold/25 bg-ink-light/70 p-6 backdrop-blur-sm ${align === 'right' ? 'text-right' : ''}`}
    >
      <div className={`flex items-center gap-3 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className="font-display text-sm text-gold">{String(index + 1).padStart(2, '0')}</span>
        <span className="h-px w-10 bg-gold/60" />
      </div>
      <p className="mt-3 font-display text-2xl text-bone xl:text-3xl">{title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-bone/85">{text}</p>
    </motion.div>
  )
}

export default function Spotlight() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Spring = makkhan jaisa smooth, scroll kitna bhi jhatke se ho
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6 })

  // Jacket baayein-daayein ghoomti hai aur end mein seedhi ruk jaati hai
  const rotateY = useTransform(smooth, [0, 0.3, 0.6, 0.85, 1], [-40, 32, -22, 0, 0])
  const rotateX = useTransform(smooth, [0, 0.5, 1], [10, 2, 0])
  const scale = useTransform(smooth, [0, 0.15, 0.85, 1], [0.82, 1, 1, 0.96])
  const floatY = useTransform(smooth, [0, 0.25, 0.5, 0.75, 1], [30, -10, 8, -6, 0])

  // Ghoomne ke saath chamak aur shadow
  const sheenX = useTransform(rotateY, [-40, 40], ['-60%', '60%'])
  const shadowScale = useTransform(rotateY, [-40, 0, 40], [0.75, 1, 0.75])
  const glow = useTransform(smooth, [0, 0.2], [0.2, 1])

  const ctaOpacity = useTransform(smooth, [0.82, 0.95], [0, 1])
  const ctaY = useTransform(smooth, [0.82, 0.95], [30, 0])

  // Phone ke liye: abhi kaunsi khoobi dikhe
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(SPOTLIGHT.features.length - 1, Math.max(0, Math.floor((v - 0.1) / 0.18)))
    setActive(i)
  })

  const features = SPOTLIGHT.features
  const starts = [0.1, 0.28, 0.46, 0.64]

  const jacket = (
    <div className="relative mx-auto w-[72vw] max-w-[440px] lg:w-[30vw]" style={{ perspective: 1400 }}>
      {/* Studio light */}
      <motion.div
        aria-hidden
        style={{ opacity: glow }}
        className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,141,87,0.25),transparent_62%)]"
      />

      <motion.div style={{ rotateY, rotateX, scale, y: floatY, transformStyle: 'preserve-3d' }} className="relative">
        <div
          className="relative aspect-square overflow-hidden"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 62% 66% at 50% 48%, #000 58%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 62% 66% at 50% 48%, #000 58%, transparent 100%)',
          }}
        >
          <img src={jacketImg} alt="Aries signature leather jacket" className="h-full w-full object-cover" draggable={false} />
          {/* Ghoomti chamak */}
          <motion.span
            aria-hidden
            style={{ x: sheenX }}
            className="pointer-events-none absolute inset-y-0 left-1/4 w-1/2 skew-x-[-15deg] bg-linear-to-r from-transparent via-white/15 to-transparent mix-blend-screen"
          />
        </div>
      </motion.div>

      {/* Zameen par shadow */}
      <motion.div
        aria-hidden
        style={{ scaleX: shadowScale }}
        className="mx-auto -mt-6 h-8 w-3/4 rounded-[50%] bg-black/80 blur-2xl"
      />
    </div>
  )

  return (
    <section ref={ref} className="relative h-[320vh] bg-ink text-bone">
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <Container className="flex h-full flex-col pb-8 pt-20 md:pb-10 md:pt-24">
          {/* ===== Title ===== */}
          <div className="text-center lg:text-left">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">Signature piece</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-bone md:text-6xl">
              <SplitReveal text={`The ${SPOTLIGHT.name}`} />
            </h2>
          </div>

          {/* ===== Laptop: khoobi · jacket · khoobi ===== */}
          <div className="hidden flex-1 items-center gap-10 lg:grid lg:grid-cols-[1fr_auto_1fr] xl:gap-16">
            <div className="space-y-6">
              {features.slice(0, 2).map((f, i) => (
                <Feature key={f.title} progress={smooth} start={starts[i]} index={i} align="left" {...f} />
              ))}
            </div>
            {jacket}
            <div className="space-y-6">
              {features.slice(2).map((f, i) => (
                <Feature key={f.title} progress={smooth} start={starts[i + 2]} index={i + 2} align="right" {...f} />
              ))}
            </div>
          </div>

          {/* ===== Phone / tablet: jacket + ek khoobi ===== */}
          <div className="flex flex-1 flex-col items-center justify-center gap-6 lg:hidden">
            {jacket}
            <div className="relative h-[120px] w-full max-w-md">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="absolute inset-0 border border-gold/25 bg-ink-light/70 p-5 text-center backdrop-blur-sm"
                >
                  <p className="font-display text-sm text-gold">
                    {String(active + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                  </p>
                  <p className="mt-1 font-display text-xl text-bone">{features[active].title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-bone/85">{features[active].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ===== CTA ===== */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex flex-col items-center justify-between gap-4 sm:flex-row"
          >
            <p className="text-center text-sm text-bone/80 sm:text-left">
              Distressed full-grain leather · Plaid flannel lining · Made to measure
            </p>
            <Link
              to="/products?category=jackets"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-bone px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink"
            >
              <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative flex items-center gap-3 transition-colors duration-500 group-hover:text-bone">
                Shop jackets
                <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}