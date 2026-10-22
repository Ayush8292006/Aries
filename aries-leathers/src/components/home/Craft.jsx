import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, BadgeCheck, PenTool, Ruler, Scissors } from 'lucide-react'
import Container from '../ui/Container'
import SmartImage from '../ui/SmartImage'
import { CRAFT_STEPS, HOME_IMAGES } from '../../data/home'
import { useProducts } from '../../hooks/useProducts'

const EASE = [0.22, 1, 0.36, 1]
const ICONS = [PenTool, Scissors, Ruler, BadgeCheck]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.9, delay, ease: EASE },
})

export default function Craft() {
  const { products } = useProducts()

  // Quote ke saath ek asli product photo (blazer/coat), warna intro photo
  const quoteImage = useMemo(() => {
    const coat = products.find((p) => p.category === 'blazers-coats')
    return coat?.images?.[0] ?? HOME_IMAGES.intro
  }, [products])

  return (
    <section id="craft" className="scroll-mt-24 bg-soft py-24 md:py-32">
      <Container>
        {/* ===== Heading ===== */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            {...fadeUp(0)}
            className="flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
          >
            <span className="h-px w-10 bg-gold" />
            The Craft
            <span className="h-px w-10 bg-gold" />
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl"
          >
            From hide <em className="text-oxblood">to heirloom.</em>
          </motion.h2>
          <motion.p {...fadeUp(0.2)} className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-muted">
            Four steps, done by hand, by the same small team since 1992. No shortcuts, no machines cutting corners.
          </motion.p>
        </div>

        {/* ===== Steps ===== */}
        <div className="relative mt-16 md:mt-20">
          {/* Jodne wali line (laptop) */}
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px origin-left bg-oxblood/30 lg:block"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CRAFT_STEPS.map((s, i) => {
              const Icon = ICONS[i] ?? BadgeCheck
              return (
                <motion.article
                  key={s.title}
                  {...fadeUp(0.15 + i * 0.12)}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Icon gola */}
                  <span className="relative z-10 grid h-16 w-16 place-items-center rounded-full border border-oxblood/30 bg-soft text-oxblood transition-colors duration-500 group-hover:border-oxblood group-hover:bg-oxblood group-hover:text-bone">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>

                  {/* Card */}
                  <div className="mt-6 flex w-full flex-1 flex-col border border-line bg-bone px-6 pb-8 pt-7 transition-all duration-500 ease-luxe group-hover:-translate-y-2 group-hover:shadow-lift">
                    <span className="font-display text-5xl italic leading-none text-transparent [-webkit-text-stroke:1px_var(--color-oxblood)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 font-display text-2xl text-ink">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>

        {/* ===== Founder quote ===== */}
        <motion.div
          {...fadeUp(0.1)}
          className="mt-20 grid overflow-hidden bg-ink text-bone md:mt-24 md:grid-cols-12"
        >
          <div className="relative aspect-[4/3] md:col-span-5 md:aspect-auto md:min-h-[380px]">
            <SmartImage src={quoteImage} alt="Handmade leather coat from our Mumbai workshop" label="Aries Leathers" className="absolute inset-0" />
          </div>

          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 md:col-span-7 md:px-14 lg:px-20">
            <span className="font-display text-7xl leading-none text-gold/60">“</span>
            <blockquote className="-mt-4 font-display text-2xl leading-snug md:text-[2rem]">
              Every piece is cut, stitched and checked by hand before it leaves our workshop. If I wouldn't wear it
              myself, it doesn't go out.
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-bone/15 pt-6">
              <div>
                <p className="font-display text-xl">Anwar Ansari</p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.25em] text-gold-light">Founder · Est. 1992 · Mumbai</p>
              </div>
              <Link
                to="/about"
                className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold-light"
              >
                Our story
                <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}