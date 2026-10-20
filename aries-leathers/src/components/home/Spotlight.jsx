import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Price from '../ui/Price'
import LeatherBox3D from '../ui/LeatherBox3D'
import SplitReveal from '../motion/SplitReveal'
import { SPOTLIGHT } from '../../data/home'

function Callout({ progress, range, title, text, pos, side }) {
  const opacity = useTransform(progress, range, [0, 1])
  const x = useTransform(progress, range, [side === 'left' ? -40 : 40, 0])
  return (
    <motion.div style={{ opacity, x }} className={`absolute z-10 hidden max-w-[240px] md:block ${pos} ${side === 'right' ? 'text-right' : ''}`}>
      <div className={`flex items-center gap-3 ${side === 'right' ? 'flex-row-reverse' : ''}`}>
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gold shadow-[0_0_0_6px_rgba(176,141,87,0.25)]" />
        <span className="h-px w-14 bg-gold/60" />
      </div>
      <p className="mt-3 font-display text-2xl text-bone">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-bone/75">{text}</p>
    </motion.div>
  )
}

export default function Spotlight() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Scroll ke saath bag poora 360° ghoomta hai
  const rotateY = useTransform(scrollYProgress, [0, 1], [-35, 325])
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [18, 6, 18])
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.75, 1, 1, 0.9])
  const ctaOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.82, 0.95], [30, 0])

  return (
    <section ref={ref} className="relative h-[300vh] bg-ink text-bone">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 grid place-items-center" style={{ perspective: 1400 }}>
          <div className="absolute top-1/2 h-16 w-72 translate-y-36 rounded-[50%] bg-black/60 blur-2xl" />
          <motion.div style={{ rotateY, rotateX, scale, transformStyle: 'preserve-3d' }} className="scale-75 md:scale-100">
            <LeatherBox3D w={300} h={220} d={90} />
          </motion.div>
        </div>

        <Container className="relative flex h-full flex-col justify-between pb-12 pt-28">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">Signature piece</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight text-bone md:text-7xl">
              <SplitReveal text={`The ${SPOTLIGHT.name}`} />
            </h2>
          </div>

          {SPOTLIGHT.features.map((f, i) => (
            <Callout key={f.title} progress={scrollYProgress} range={[0.12 + i * 0.17, 0.24 + i * 0.17]} {...f} />
          ))}

          <motion.div style={{ opacity: ctaOpacity, y: ctaY }} className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-bone/60">Handmade · Full-grain</p>
              <Price amount={SPOTLIGHT.price} mrp={SPOTLIGHT.mrp} className="mt-2 text-2xl text-bone [&_.text-muted]:text-bone/50" />
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 bg-bone px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-oxblood hover:text-bone"
            >
              Shop the Messenger
              <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </Container>
      </div>
    </section>
  )
}