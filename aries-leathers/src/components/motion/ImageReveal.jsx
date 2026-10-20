import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import SmartImage from '../ui/SmartImage'

export default function ImageReveal({ src, alt = '', label, className = '', parallax = 40, delay = 0, tilt = true }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  // Scroll par: neeche se 3D mein jhuka hua aata hai, phir seedha ho jata hai
  const y = useTransform(scrollYProgress, [0, 1], [-parallax, parallax])
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], tilt ? [16, 0, -6] : [0, 0, 0])
  const scale = useTransform(scrollYProgress, [0, 0.45], tilt ? [0.9, 1] : [1, 1])

  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ rotateX, scale, transformOrigin: 'center bottom' }} className="relative h-full w-full">
        <motion.div
          className="relative h-full w-full overflow-hidden"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={inView ? { clipPath: 'inset(0% 0% 0% 0%)' } : { clipPath: 'inset(100% 0% 0% 0%)' }}
          transition={{ duration: 1.2, delay, ease: [0.77, 0, 0.175, 1] }}
        >
          <motion.div style={{ y, scale: 1.15 }} className="absolute inset-0">
            <SmartImage src={src} alt={alt} label={label} className="h-full w-full" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}