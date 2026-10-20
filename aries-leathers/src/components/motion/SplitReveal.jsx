import { motion } from 'motion/react'

const EASE = [0.22, 1, 0.36, 1]

export default function SplitReveal({ text, className = '', delay = 0, stagger = 0.07 }) {
  const words = text.split(' ')

  return (
    <motion.span
      className={className || 'inline-block'}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.06em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: '110%', rotate: 6 },
              show: { y: '0%', rotate: 0, transition: { duration: 1.1, delay: delay + i * stagger, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}