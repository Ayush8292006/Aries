import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import logo from '../../assets/logo.png'
import { SITE } from '../../config/site'

const EASE = [0.22, 1, 0.36, 1]

export default function Brand({ compact = false, dark = false, hideTextOnMobile = false, onClick }) {
  const size = compact ? 'h-10 w-10' : 'h-12 w-12'

  return (
    <Link
      to="/"
      onClick={onClick}
      className="group flex shrink-0 items-center gap-3"
      aria-label={`${SITE.name} home`}
    >
      {/* ===== Logo ===== */}
      <span style={{ perspective: 500 }} className="shrink-0">
        <motion.span
          initial={{ rotateY: -60, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 1, ease: EASE }}
          className={`relative block overflow-hidden rounded-md ${size} ${dark ? 'bg-bone p-0.5' : ''}
                      transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:[transform:rotateY(-18deg)_rotateX(6deg)_scale(1.05)]`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img src={logo} alt="" className="h-full w-full rounded-[5px] object-contain" />
          {/* Hover par ek baar chamak */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-full w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/50 to-transparent transition-[left] duration-700 ease-out group-hover:left-full"
          />
        </motion.span>
      </span>

      {/* ===== Text ===== */}
      <div className={`overflow-hidden leading-none ${hideTextOnMobile ? 'hidden sm:block' : ''}`}>
        <motion.p
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className={`font-display font-semibold tracking-[0.28em] transition-[letter-spacing] duration-500 ease-out group-hover:tracking-[0.34em] ${
            compact ? 'text-lg' : 'text-xl'
          } ${dark ? 'text-bone' : 'text-ink'}`}
        >
          ARIES
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={`mt-1 text-[8px] font-medium tracking-[0.38em] ${dark ? 'text-gold-light' : 'text-oxblood'}`}
        >
          LEATHERS · EST. {SITE.since}
        </motion.p>
      </div>
    </Link>
  )
}