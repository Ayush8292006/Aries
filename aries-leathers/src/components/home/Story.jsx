import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Container from '../ui/Container'
import CountUp from '../motion/CountUp'
import { STATS } from '../../data/home'

const EASE = [0.22, 1, 0.36, 1]

const QUOTE =
  'Since 1992, every Aries piece has been cut, stitched and finished by hand in our Mumbai workshop — from genuine leather that only grows more beautiful with every year you wear it.'

// Aakhri kitne shabd oxblood mein
const HIGHLIGHT_FROM = QUOTE.split(' ').length - 5

/** Ek shabd — scroll ke saath halka se gehra */
function Word({ children, progress, range, highlight }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${highlight ? 'italic text-oxblood' : 'text-ink'}`}>
      {children}
    </motion.span>
  )
}

export default function Story() {
  const quoteRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: quoteRef, offset: ['start 85%', 'end 45%'] })
  const words = QUOTE.split(' ')

  return (
    <section className="bg-cream py-28 md:py-40">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
          >
            <span className="h-px w-10 bg-gold" />
            Our Story
            <span className="h-px w-10 bg-gold" />
          </motion.p>

          {/* Quote nishaan */}
          <motion.p
            aria-hidden
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-8 font-display text-8xl leading-none text-gold/70"
          >
            “
          </motion.p>

          {/* Word-by-word quote */}
          <p
            ref={quoteRef}
            className="-mt-6 font-display text-3xl leading-[1.35] md:text-5xl md:leading-[1.3]"
            aria-label={QUOTE}
          >
            {words.map((w, i) => {
              const start = i / words.length
              const end = start + 1 / words.length
              return (
                <span key={i} aria-hidden>
                  <Word progress={scrollYProgress} range={[start, end]} highlight={i >= HIGHLIGHT_FROM}>
                    {w}
                  </Word>{' '}
                </span>
              )
            })}
          </p>

          {/* Founder */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <span className="h-px w-8 bg-ink/30" />
            <p className="text-sm text-muted">
              <span className="font-display text-xl italic text-ink">Anwar Ansari</span>
              <span className="mx-2">·</span>
              Founder
            </p>
            <span className="h-px w-8 bg-ink/30" />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="mx-auto mt-20 grid max-w-3xl grid-cols-3 divide-x divide-line border-t border-line pt-10"
          >
            {STATS.map((s) => (
              <div key={s.label} className="px-2">
                <p className="font-display text-4xl text-ink md:text-6xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}