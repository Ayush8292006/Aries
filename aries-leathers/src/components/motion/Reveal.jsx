import { motion } from 'motion/react'

export default function Reveal({ children, delay = 0, y = 40, rotateX = 12, amount = 0.2, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, rotateX, transformPerspective: 1000 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}