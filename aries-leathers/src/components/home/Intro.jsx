import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Price from '../ui/Price'
import SplitReveal from '../motion/SplitReveal'
import ImageReveal from '../motion/ImageReveal'
import { FEATURED, HOME_IMAGES } from '../../data/home'

const EASE = [0.22, 1, 0.36, 1]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.9, delay, ease: EASE },
})

const DETAILS = [
  { label: 'Since', value: '1992' },
  { label: 'Workshop', value: 'Mumbai, India' },
  { label: 'Every piece', value: 'Made to measure' },
]

export default function Intro() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // Alag speed = gehrai
  const mainY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const smallY = useTransform(scrollYProgress, [0, 1], [120, -120])
  const cardY = useTransform(scrollYProgress, [0, 1], [60, -30])

  return (
    <section ref={ref} className="relative overflow-hidden bg-bone py-24 md:py-36">
      {/* Side mein khada text */}
      <p
        aria-hidden
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.5em] text-muted/70 xl:block"
      >
        Handmade in Mumbai — Since 1992
      </p>

      <Container className="grid items-center gap-16 md:grid-cols-12 md:gap-10">
        {/* ===== Text ===== */}
        <div className="md:col-span-5">
          <motion.p
            {...fadeUp(0)}
            className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
          >
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 40 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: EASE }}
              className="h-px bg-gold"
            />
            The House of Aries
          </motion.p>

          <h2 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-[4.25rem]">
            <SplitReveal text="Leather made to" className="block" />
            <SplitReveal text="be handed down." className="block italic text-oxblood" delay={0.15} />
          </h2>

          <motion.p {...fadeUp(0.25)} className="mt-8 max-w-md text-[15px] leading-[1.8] text-muted">
            For over three decades our family workshop in Mumbai has cut and stitched every jacket, trouser and vest by
            hand — from genuine hides, to your measurements, built to wear in rather than wear out.
          </motion.p>

          <motion.dl
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } } }}
            className="mt-10 grid grid-cols-3 border-y border-line"
          >
            {DETAILS.map((d, i) => (
              <motion.div
                key={d.label}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                className={`py-5 ${i > 0 ? 'border-l border-line pl-4' : ''}`}
              >
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">{d.label}</dt>
                <dd className="mt-1.5 font-display text-lg text-ink md:text-xl">{d.value}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div {...fadeUp(0.45)} className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              to="/products"
              className="group relative inline-flex items-center gap-3 overflow-hidden bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone"
            >
              <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative flex items-center gap-3">
                Shop the collection
                <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/about"
              className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:text-oxblood"
            >
              Our story
              <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
            </Link>
          </motion.div>
        </div>

        {/* ===== Photos ===== */}
        <div className="relative md:col-span-7">
          {/* Badi photo */}
          <motion.div style={{ y: mainY }} className="relative ml-auto w-[88%] md:w-[80%]">
            <div className="group overflow-hidden shadow-lift">
              <div className="transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.05]">
                <ImageReveal
                  src={HOME_IMAGES.intro}
                  alt="Aries Leathers suede jacket, handmade in Mumbai"
                  label="Aries Leathers"
                  parallax={50}
                  className="aspect-[4/5] w-full"
                />
              </div>
            </div>

            {/* Signature card */}
            <motion.div style={{ y: cardY }} className="absolute -bottom-8 right-4 z-10 md:-right-6">
              <motion.div {...fadeUp(0.7)} className="min-w-[220px] border border-line bg-bone px-6 py-5 shadow-lift">
                <p className="text-[10px] uppercase tracking-[0.25em] text-oxblood">Signature</p>
                <p className="mt-1.5 font-display text-xl text-ink">{FEATURED.name}</p>
                <div className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-3">
                  <Price amount={FEATURED.price} className="text-sm text-ink" />
                  <Link
                    to="/products?category=jackets"
                    className="group inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
                  >
                    View
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Chhoti photo */}
          <motion.div
            style={{ y: smallY }}
            className="absolute -bottom-6 left-0 z-10 hidden w-[38%] border-[10px] border-bone shadow-lift md:block"
          >
            <div className="group overflow-hidden">
              <div className="transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.06]">
                <ImageReveal
                  src={HOME_IMAGES.auth}
                  alt="Handmade leather blazer"
                  label="Leather blazer"
                  delay={0.3}
                  className="aspect-[3/4] w-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}