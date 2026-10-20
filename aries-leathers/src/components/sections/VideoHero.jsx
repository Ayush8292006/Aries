import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Volume2, VolumeX } from 'lucide-react'
import SplitReveal from '../motion/SplitReveal'

const EASE = [0.22, 1, 0.36, 1]

export default function VideoHero({
  src = '/videos/hero.mp4',
  poster,                  // e.g. '/videos/hero-poster.jpg' (optional)
  bg = '#0A2A23',
  showText = true,         // video par brand text dikhana hai ya nahi
  showSoundToggle = true,  // video mein awaaz nahi hai to false kar do
}) {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const radius = useTransform(scrollYProgress, [0, 1], [0, 48])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const toggleSound = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    if (!video.muted) video.play().catch(() => {})
  }

  return (
    <section ref={sectionRef} data-bg={bg} className="relative h-[calc(100svh-7.25rem)] min-h-[520px]">
      <motion.div style={{ scale, borderRadius: radius }} className="relative h-full w-full overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Text padhne layak rahe + agle section mein smooth blend */}
        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/5 to-emerald-deep/85" />

        {showText && (
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-16 text-center text-ivory md:pb-20"
          >
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold"
            >
              Est. 1992
            </motion.p>
            <div className="mt-4 font-display text-5xl tracking-tight md:text-8xl">
              <SplitReveal text="Aries Leathers" delay={0.35} />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              className="mt-4 font-display text-lg italic text-ivory/80 md:text-2xl"
            >
              All kinds of leather goods
            </motion.p>
          </motion.div>
        )}

        {showSoundToggle && (
          <button
            onClick={toggleSound}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
            className="absolute bottom-6 right-6 grid h-11 w-11 place-items-center rounded-full border border-ivory/25 bg-black/20 text-ivory backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-gold hover:text-gold"
          >
            {muted ? <VolumeX size={18} strokeWidth={1.5} /> : <Volume2 size={18} strokeWidth={1.5} />}
          </button>
        )}
      </motion.div>
    </section>
  )
}