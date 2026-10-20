import { motion } from 'motion/react'
import { Check } from 'lucide-react'

const STEPS = ['Details', 'Payment', 'Confirmation']
const EASE = [0.22, 1, 0.36, 1]

export default function CheckoutSteps({ current = 0 }) {
  return (
    <ol className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em]">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={label} className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
              className={`relative grid h-8 w-8 place-items-center rounded-full border text-[11px] transition-colors duration-500 ${
                done ? 'border-ink bg-ink text-bone' : active ? 'border-oxblood bg-oxblood text-bone' : 'border-line text-muted'
              }`}
            >
              {active && (
                <motion.span
                  className="absolute inset-0 rounded-full border border-oxblood"
                  animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              {done ? <Check size={14} /> : i + 1}
            </motion.span>
            <span className={`hidden sm:inline ${active ? 'text-ink' : 'text-muted'}`}>{label}</span>
            {i < STEPS.length - 1 && (
              <span className="relative h-px w-8 overflow-hidden bg-line md:w-14">
                <motion.span
                  className="absolute inset-0 origin-left bg-oxblood"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: EASE }}
                />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}