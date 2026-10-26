import { useEffect } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { STATUS_STYLES } from '../../utils/promotions'

const EASE = [0.22, 1, 0.36, 1]

/** Side panel (form ke liye) */
export function Panel({ title, subtitle, onClose, children, footer }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.aside
        className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-bone shadow-lift"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 md:px-8">
          <div>
            <p className="font-display text-3xl text-ink">{title}</p>
            {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 text-ink transition-transform hover:rotate-90">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8" data-lenis-prevent>
          {children}
        </div>
        {footer && <div className="border-t border-line px-6 py-4 md:px-8">{footer}</div>}
      </motion.aside>
    </div>
  )
}

export function Label({ children, hint }) {
  return (
    <span className="mb-2 flex items-baseline justify-between gap-3 text-[10px] uppercase tracking-[0.15em] text-muted">
      {children}
      {hint && <span className="normal-case tracking-normal">{hint}</span>}
    </span>
  )
}

export function Input({ label, hint, error, className = '', ...props }) {
  return (
    <label className={`block ${className}`}>
      <Label hint={hint}>{label}</Label>
      <input
        {...props}
        className={`h-12 w-full border bg-cream px-4 text-sm text-ink outline-none transition-colors focus:bg-white ${
          error ? 'border-oxblood-light' : 'border-line focus:border-ink'
        }`}
      />
      {error && <span className="mt-1.5 block text-xs text-oxblood-light">{error}</span>}
    </label>
  )
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6 border border-line bg-ivory px-4 py-3">
      <span>
        <span className="block text-sm text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${checked ? 'bg-ink' : 'bg-line'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-bone shadow transition-all duration-300 ${checked ? 'left-[22px]' : 'left-0.5'}`}
        />
      </button>
    </label>
  )
}

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.paused
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] ${s.className}`}>
      {status === 'active' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bone" />}
      {s.label}
    </span>
  )
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 bg-ink px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-oxblood disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center justify-center gap-2 border border-line px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink ${className}`}
    >
      {children}
    </button>
  )
}