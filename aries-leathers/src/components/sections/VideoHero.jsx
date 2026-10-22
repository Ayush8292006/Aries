import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { ArrowDown, ArrowRight, Star, Volume2, VolumeX } from 'lucide-react'

const EASE = [0.22, 1, 0.36, 1]

/** Ek line jo page khulne par neeche se uthti hai, aur scroll par apni speed se upar jaati hai */
function RiseLine({ children, delay, y, className = '' }) {
  return (
    <motion.span style={{ y }} className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </motion.span>
  )
}

export default function VideoHero({
  src = '/videos/hero.mp4',
  poster, // e.g. '/videos/hero-poster.jpg' (optional)
  objectPosition = 'center', // 'center', 'top', '50% 30%'...
  showText = true,
  showSoundToggle = true,
}) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  // Spring = scroll ke saath smooth chalna
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  // Video
  const scale = useTransform(progress, [0, 1], [1, 0.88])
  const radius = useTransform(progress, [0, 1], [0, 40])
  const videoY = useTransform(progress, [0, 1], ['0%', '10%'])
  const videoDim = useTransform(progress, [0, 1], [0, 0.55])

  // Text — alag speed se upar
  const line1Y = useTransform(progress, [0, 1], [0, -220])
  const line2Y = useTransform(progress, [0, 1], [0, -140])
  const eyebrowY = useTransform(progress, [0, 1], [0, -260])
  const rowY = useTransform(progress, [0, 1], [0, -80])
  const textOpacity = useTransform(progress, [0, 0.55], [1, 0])
  const scrollHintOpacity = useTransform(progress, [0, 0.15], [1, 0])

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (!video.muted) video.play().catch(() => {})
  }

  return (
    <section ref={sectionRef} className="relative h-svh min-h-[640px] bg-ink">
      <motion.div style={{ scale, borderRadius: radius }} className="relative h-full w-full overflow-hidden">
        {/* Video — scroll par halka parallax */}
        <motion.div style={{ y: videoY }} className="absolute inset-0">
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ objectPosition }}
            src={src}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </motion.div>

        {/* Chhaya: upar navbar ke liye, neeche text ke liye */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/55 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-ink via-ink/65 to-transparent" />
        {/* Scroll par video halka gehra */}
        <motion.div aria-hidden style={{ opacity: videoDim }} className="absolute inset-0 bg-ink" />

        {/* Scroll nishaan — right side */}
        <motion.a
          href="#categories"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          style={{ opacity: scrollHintOpacity }}
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-bone/70 transition-colors hover:text-gold-light md:flex lg:right-12"
        >
          <span className="[writing-mode:vertical-rl]">Scroll</span>
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
            <ArrowDown size={14} strokeWidth={1.5} />
          </motion.span>
        </motion.a>

        {/* ===== Text ===== */}
        {showText && (
          <motion.div
            style={{ opacity: textOpacity }}
            className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 md:pb-12 lg:px-16 lg:pb-14"
          >
            <div className="mx-auto w-full max-w-[1400px] text-bone">
              {/* Eyebrow */}
              <motion.div style={{ y: eyebrowY }}>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                  className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.4em] text-gold-light md:text-[11px]"
                >
                  <span className="h-px w-10 bg-gold" />
                  Aries Leathers · Est. 1992 · Mumbai
                </motion.p>
              </motion.div>

              {/* Heading */}
              <h1 className="mt-5 max-w-4xl font-display text-[11vw] font-medium leading-[1] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                <RiseLine delay={0.45} y={line1Y}>
                  Handcrafted leather,
                </RiseLine>
                <RiseLine delay={0.6} y={line2Y} className="italic text-gold-light">
                  made to last.
                </RiseLine>
              </h1>

              {/* Neeche ki line: buttons · rating */}
              <motion.div style={{ y: rowY }}>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
                  className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-bone/15 pt-6 md:mt-10"
                >
                  <div className="flex flex-wrap items-center gap-6">
                    <Link
                      to="/products"
                      className="group relative inline-flex items-center gap-3 overflow-hidden bg-bone px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink md:text-[12px]"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-out group-hover:translate-x-0" />
                      <span className="relative flex items-center gap-3 transition-colors duration-500 group-hover:text-bone">
                        Shop collection
                        <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
                      </span>
                    </Link>
                    <Link
                      to="/about"
                      className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-bone transition-colors hover:text-gold-light md:text-[12px]"
                    >
                      Our story
                      <span className="h-px w-8 bg-current transition-all duration-500 group-hover:w-12" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-bone/20 bg-black/25 px-4 py-2 backdrop-blur-md">
                      <Star size={13} className="fill-gold text-gold" />
                      <span className="text-xs text-bone/90">
                        <span className="font-semibold text-bone">4.8</span> · 46 reviews on Etsy
                      </span>
                    </div>
                    {showSoundToggle && (
                      <button
                        onClick={toggleSound}
                        aria-label={muted ? 'Unmute video' : 'Mute video'}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-bone/25 bg-black/25 text-bone backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-gold-light"
                      >
                        {muted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
                      </button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}