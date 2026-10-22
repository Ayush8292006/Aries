import { useEffect } from 'react'
import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]
const CURTAIN = [0.76, 0, 0.24, 1]
const MIN_MS = 2700

/**
 * Pehli baar site khulne par brand loading.
 * Kam se kam ~2.7s, aur site load hone tak (max 5s).
 * End mein poori screen upar chali jaati hai.
 */
export default function IntroLoader({ onDone }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop?.()

    let cancelled = false
    const minTime = new Promise((r) => setTimeout(r, MIN_MS))
    const pageLoaded =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((r) => window.addEventListener('load', r, { once: true }))
    const maxWait = new Promise((r) => setTimeout(r, 5000))

    Promise.all([minTime, Promise.race([pageLoaded, maxWait])]).then(() => {
      if (!cancelled) onDone()
    })

    return () => {
      cancelled = true
      document.body.style.overflow = ''
      window.__lenis?.start?.()
    }
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-ink-deep px-6 text-bone shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 1, ease: CURTAIN } }}
      role="status"
      aria-label="Loading Aries Leathers"
    >
      <style>{`
        @keyframes intro-shine { from { background-position: 150% 0; } to { background-position: -50% 0; } }
        .intro-shine {
          background: linear-gradient(110deg, transparent 35%, rgba(255,240,210,0.55) 50%, transparent 65%);
          background-size: 250% 100%;
          background-repeat: no-repeat;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: intro-shine 1.4s ease-in-out 1.15s 1 both;
        }
      `}</style>

      <div className="text-center">
        <h1>
          <span className="sr-only">Aries Leathers</span>

          {/* ARIES */}
          <span className="relative block" aria-hidden>
            <span className="flex justify-center overflow-hidden pb-3 font-display text-7xl font-medium leading-[0.9] tracking-[0.1em] sm:text-8xl md:text-[9.5rem]">
              {'ARIES'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block bg-linear-to-b from-[#F5EEE2] via-[#E9DCC4] to-[#C9A86E] bg-clip-text text-transparent"
                  initial={{ y: '110%', filter: 'blur(8px)' }}
                  animate={{ y: '0%', filter: 'blur(0px)' }}
                  transition={{ duration: 1.1, delay: 0.15 + i * 0.08, ease: EASE }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
            {/* Ek baar chamak */}
            <span className="intro-shine pointer-events-none absolute inset-0 flex justify-center pb-3 font-display text-7xl font-medium leading-[0.9] tracking-[0.1em] sm:text-8xl md:text-[9.5rem]">
              ARIES
            </span>
          </span>

          {/* ◆ LEATHERS ◆ */}
          <span className="mt-4 flex items-center justify-center gap-4 overflow-hidden md:mt-5 md:gap-6" aria-hidden>
            <motion.span
              className="text-[8px] text-gold md:text-[10px]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
            >
              ◆
            </motion.span>
            <motion.span
              className="block pl-[0.7em] text-sm font-medium tracking-[0.7em] text-gold-light sm:text-base md:text-lg"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, delay: 0.75, ease: EASE }}
            >
              LEATHERS
            </motion.span>
            <motion.span
              className="text-[8px] text-gold md:text-[10px]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
            >
              ◆
            </motion.span>
          </span>
        </h1>

        {/* Tagline */}
        <motion.p
          className="mt-10 font-display text-lg italic text-bone/70 md:mt-12 md:text-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3, ease: EASE }}
        >
          All kinds of leather goods
        </motion.p>
        <motion.p
          className="mt-3 text-[10px] uppercase tracking-[0.45em] text-bone/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.6 }}
        >
          Est. 1992 · Mumbai
        </motion.p>
      </div>
    </motion.div>
  )
}