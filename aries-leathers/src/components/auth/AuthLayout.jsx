import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Globe2, PackageCheck, Scissors } from 'lucide-react'
import logo from '../../assets/logo.png'
import Container from '../ui/Container'
import SmartImage from '../ui/SmartImage'
import Flag from '../ui/Flag'
import SplitReveal from '../motion/SplitReveal'
import { HOME_IMAGES } from '../../data/home'

const EASE = [0.22, 1, 0.36, 1]
const FLAGS = ['IN', 'US', 'GB', 'AE', 'DE', 'AU']
const PERKS = [
  { icon: Scissors, text: 'Handcrafted in our Mumbai workshop since 1992' },
  { icon: Globe2, text: 'Shop in your own currency, worldwide' },
  { icon: PackageCheck, text: 'Save favourites and track every order' },
]

/** Mouse ke saath halka 3D tilt + chamak */
function TiltCard({ children }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3.5, -3.5]), { stiffness: 140, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3.5, 3.5]), { stiffness: 140, damping: 18 })
  const gx = useTransform(mx, [-0.5, 0.5], [0, 100])
  const gy = useTransform(my, [-0.5, 0.5], [0, 100])
  const glare = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, rgba(255,255,255,0.35), transparent 45%)`

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="group relative"
    >
      {children}
      <motion.span
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </motion.div>
  )
}

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-deep">
      {/* ===== Background: asli photo, dheere zoom ===== */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: [1.05, 1.15], opacity: 1 }}
        transition={{
          opacity: { duration: 1.2 },
          scale: { duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'linear' },
        }}
      >
        <SmartImage src={HOME_IMAGES.auth} alt="" label="Aries Leathers" className="h-full w-full" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-ink-deep via-ink-deep/90 to-ink-deep/55" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_20%,rgba(176,141,87,0.18),transparent_55%)]" />

      <Container className="grid min-h-[calc(100svh-7.25rem)] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* ===== Left: brand story ===== */}
        <div className="hidden text-bone lg:block">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light"
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              className="h-px bg-gold"
            />
            Aries Leathers · Since 1992
          </motion.p>

          <h2 className="mt-6 font-display text-6xl leading-[1.05] tracking-tight xl:text-7xl">
            <SplitReveal text="Leather that remembers" />
            <motion.em
              initial={{ opacity: 0, y: 30, rotateX: 40 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: EASE }}
              className="mt-2 block text-gold-light"
              style={{ transformOrigin: 'bottom' }}
            >
              every journey.
            </motion.em>
          </h2>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 1 } } }}
            className="mt-12 space-y-5"
          >
            {PERKS.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } } }}
                className="group flex items-center gap-4 text-sm text-bone/80"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold-light transition-all duration-500 group-hover:rotate-12 group-hover:bg-gold group-hover:text-ink">
                  <Icon size={18} strokeWidth={1.5} />
                </span>
                <span className="transition-colors group-hover:text-bone">{text}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
            className="mt-12 flex items-center gap-4 border-t border-bone/15 pt-8 text-xs text-bone/70"
          >
            <span className="flex gap-2">
              {FLAGS.map((c, i) => (
                <motion.span
                  key={c}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
                  className="inline-block"
                >
                  <Flag code={c} />
                </motion.span>
              ))}
            </span>
            Prices shown in your local currency
          </motion.div>
        </div>

        {/* ===== Right: form card ===== */}
        <div style={{ perspective: 1400 }}>
          <motion.div
            initial={{ opacity: 0, rotateY: -28, x: 80, scale: 0.92 }}
            animate={{ opacity: 1, rotateY: 0, x: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: EASE }}
            className="mx-auto w-full max-w-lg"
          >
            <TiltCard>
              <div className="relative overflow-hidden border border-gold/30 bg-ivory px-6 py-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] sm:px-12 sm:py-12">
                {/* Upar animated line */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.8, ease: EASE }}
                  className="absolute inset-x-0 top-0 h-[3px] origin-left bg-linear-to-r from-oxblood via-gold to-oxblood"
                />
                {/* Kone mein ghoomta halka logo */}
                <motion.img
                  src={logo}
                  alt=""
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 opacity-[0.05]"
                />

                <div className="relative">
                  <motion.img
                    src={logo}
                    alt="Aries Leathers"
                    initial={{ scale: 0, rotate: -120 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.6 }}
                    className="h-12 w-12"
                  />

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
                  >
                    {eyebrow}
                  </motion.p>
                  <h1 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
                    <SplitReveal text={title} />
                  </h1>
                  {subtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="mt-3 text-sm text-muted"
                    >
                      {subtitle}
                    </motion.p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
                    className="mt-8"
                  >
                    {children}
                  </motion.div>

                  {footer && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="mt-8 border-t border-line pt-6 text-center text-sm text-muted"
                    >
                      {footer}
                    </motion.div>
                  )}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}