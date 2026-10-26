import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import Container from '../ui/Container'
import SmartImage from '../ui/SmartImage'
import TiltCard from '../ui/TiltCard'
import SplitReveal from '../motion/SplitReveal'
import { CATEGORIES } from '../../config/site'
import { CATEGORY_IMAGES } from '../../data/home'
import { useProducts } from '../../hooks/useProducts'

const EASE = [0.22, 1, 0.36, 1]

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

// Taash ke patton jaisa fan
const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    y: 140,
    rotateX: 50,
    rotateZ: (i - 2) * 5,
    scale: 0.9,
  }),
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateZ: 0,
    scale: 1,
    transition: { duration: 1.1, ease: EASE },
  },
}

// Photo parde ki tarah neeche se khulti hai
const imageVariants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.35 },
  show: {
    clipPath: 'inset(0% 0% 0% 0%)',
    scale: 1,
    transition: { duration: 1.3, ease: EASE, delay: 0.25 },
  },
}

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.6 } },
}

export default function Categories() {
  const { products } = useProducts()
  const count = (slug) => products.filter((p) => p.category === slug).length

  return (
    <section id="categories" className="relative scroll-mt-24 overflow-hidden bg-ivory py-20 md:py-28">
      {/* Peeche halka bada text */}
      <motion.p
        aria-hidden
        initial={{ opacity: 0, x: 120 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none absolute -right-10 top-10 select-none whitespace-nowrap font-display text-[18vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(107,30,34,0.07)]"
      >
        COLLECTIONS
      </motion.p>

      <Container className="relative">
        {/* ===== Heading ===== */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
              className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
            >
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                className="h-px bg-gold"
              />
              Collections
            </motion.p>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
              <SplitReveal text="Shop by category" />
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
            >
              View all
              <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
            </Link>
          </motion.div>
        </div>

        {/* ===== Cards ===== */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-5 lg:gap-x-5"
          style={{ perspective: 1600 }}
        >
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.slug}
              custom={i}
              variants={cardVariants}
              style={{ transformOrigin: 'bottom center' }}
            >
              <Link to={`/products?category=${c.slug}`} className="group block">
                <TiltCard max={8}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-soft shadow-card transition-shadow duration-500 group-hover:shadow-lift">
                    <motion.div variants={imageVariants} className="absolute inset-0">
                      <SmartImage
                        src={CATEGORY_IMAGES[c.slug]}
                        alt={c.name}
                        label={c.name}
                        className="h-full w-full"
                        imgClassName="transition-transform duration-[1400ms] ease-luxe group-hover:scale-110"
                      />
                    </motion.div>

                    {/* Number */}
                    <motion.span
                      variants={textVariants}
                      className="absolute left-3 top-3 bg-bone/90 px-2 py-1 font-display text-sm text-ink backdrop-blur-sm"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.span>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-3 bottom-3 flex translate-y-6 items-center justify-between bg-bone px-4 py-3 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink">Explore</span>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.75}
                        className="text-oxblood transition-transform duration-500 group-hover:rotate-45"
                      />
                    </div>
                  </div>
                </TiltCard>

                <motion.div variants={textVariants} className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl text-ink transition-colors duration-300 group-hover:text-oxblood">
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {count(c.slug)} {count(c.slug) === 1 ? 'piece' : 'pieces'}
                    </p>
                  </div>
                  <span className="mb-2 h-px w-6 shrink-0 bg-ink/40 transition-all duration-500 group-hover:w-12 group-hover:bg-oxblood" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}