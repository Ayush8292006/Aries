import { motion } from 'motion/react'
import logo from '../../assets/logo.png'
import Container from '../ui/Container'
import SmartImage from '../ui/SmartImage'
import Flag from '../ui/Flag'
import SplitReveal from '../motion/SplitReveal'
import { HOME_IMAGES } from '../../data/home'

const EASE = [0.22, 1, 0.36, 1]
const FLAGS = ['IN', 'US', 'GB', 'AE', 'DE', 'AU']

export default function AuthLayout({ eyebrow, title, subtitle, children, footer }) {
  return (
    <section className="bg-bone">
      <Container className="grid min-h-[calc(100svh-7.25rem)] py-8 lg:grid-cols-2 lg:py-14">
        <motion.aside
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative hidden overflow-hidden lg:block"
        >
          <SmartImage src={HOME_IMAGES.auth} alt="" label="Aries Leathers" className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" />

          <div className="absolute left-10 top-10 flex items-center gap-3 text-bone">
            <img src={logo} alt="" className="h-11 w-11" />
            <div className="leading-none">
              <p className="font-display text-xl tracking-[0.2em]">ARIES</p>
              <p className="mt-1 text-[9px] tracking-[0.35em] text-gold-light">LEATHERS · EST. 1992</p>
            </div>
          </div>

          <div className="absolute inset-x-10 bottom-10 text-bone">
            <p className="font-display text-3xl leading-snug">
              Leather that remembers <em>every journey.</em>
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-bone/80">
              <span className="flex gap-1.5">
                {FLAGS.map((c) => (
                  <Flag key={c} code={c} />
                ))}
              </span>
              Prices shown in your local currency
            </div>
          </div>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="flex items-center border border-line bg-ivory px-6 py-10 sm:px-12"
        >
          <div className="mx-auto w-full max-w-md">
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
              <SplitReveal text={title} />
            </h1>
            {subtitle && <p className="mt-3 text-sm text-muted">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 border-t border-line pt-6 text-center text-sm text-muted">{footer}</div>}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}