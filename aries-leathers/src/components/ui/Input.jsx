import { useEffect, useId, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'motion/react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({ label, icon: Icon, error, type = 'text', className = '', ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const controls = useAnimationControls()

  // Error aate hi box hilta hai
  useEffect(() => {
    if (error) controls.start({ x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.45 } })
  }, [error, controls])

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
        {label}
      </label>
      <motion.div
        animate={controls}
        className={`group relative flex h-12 items-center gap-3 border bg-cream px-4 transition-all duration-300
                    focus-within:bg-white focus-within:shadow-[0_10px_28px_-12px_rgba(107,30,34,0.35)]
                    ${error ? 'border-oxblood-light' : 'border-line hover:border-ink/40 focus-within:border-ink/60'}`}
      >
        {Icon && (
          <Icon
            size={17}
            strokeWidth={1.5}
            className={`shrink-0 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-oxblood ${error ? 'text-oxblood-light' : 'text-muted'}`}
          />
        )}
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
                    className="h-full w-full bg-transparent text-base text-ink outline-none placeholder:text-muted/70 sm:text-sm"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="text-muted transition-all duration-300 hover:scale-110 hover:text-oxblood"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={show ? 'off' : 'on'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {show ? <EyeOff size={17} strokeWidth={1.5} /> : <Eye size={17} strokeWidth={1.5} />}
              </motion.span>
            </AnimatePresence>
          </button>
        )}

        {/* Focus par neeche bharti oxblood line */}
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-oxblood transition-transform duration-500 ease-out group-focus-within:scale-x-100" />
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            className="mt-1.5 text-xs text-oxblood-light"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}