import { motion } from 'motion/react'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function SubmitButton({ loading, children }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      className="group relative flex w-full items-center justify-center overflow-hidden bg-ink py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone shadow-[0_14px_30px_-12px_rgba(22,20,18,0.7)] transition-shadow duration-500 hover:shadow-[0_18px_40px_-12px_rgba(107,30,34,0.7)] disabled:cursor-wait disabled:opacity-80"
    >
      <style>{`
        @keyframes btn-shine { 0% { left: -60% } 55%, 100% { left: 130% } }
        .btn-shine { animation: btn-shine 3.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .btn-shine { animation: none; } }
      `}</style>

      {/* Hover par oxblood fill */}
      <span className="absolute inset-0 -translate-x-full bg-oxblood transition-transform duration-500 ease-out group-hover:translate-x-0" />
      {/* Chamak */}
      <span className="btn-shine pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-20deg] bg-linear-to-r from-transparent via-white/25 to-transparent" />

      <span className="relative flex items-center gap-3">
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            {children}
            <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1.5" />
          </>
        )}
      </span>
    </motion.button>
  )
}