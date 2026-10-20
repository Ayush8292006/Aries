import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const canUseCursor = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CustomCursor() {
  const [enabled] = useState(canUseCursor)
  const [hovering, setHovering] = useState(false)
  const [hidden, setHidden] = useState(true)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (!enabled) return
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHidden(false)
      setHovering(!!e.target.closest?.('a, button, [role="button"], label, input, select, textarea'))
    }
    const leave = () => setHidden(true)
    window.addEventListener('pointermove', move)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference" style={{ x: sx, y: sy }}>
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
        animate={{
          width: hovering ? 56 : 26,
          height: hovering ? 56 : 26,
          opacity: hidden ? 0 : 1,
          backgroundColor: hovering ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </motion.div>
  )
}