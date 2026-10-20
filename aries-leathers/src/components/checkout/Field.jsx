import { useId } from 'react'

/** Premium floating-label input. Placeholder mat do — label hi placeholder ka kaam karta hai. */
export default function Field({ label, error, hint, className = '', type = 'text', ...props }) {
  const id = useId()

  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder=" "
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`peer h-14 w-full border bg-cream px-4 pb-2 pt-6 text-sm text-ink outline-none transition-all duration-300 focus:bg-white
                      ${error
                        ? 'border-oxblood-light'
                        : 'border-line hover:border-ink/30 focus:border-ink focus:shadow-[0_0_0_3px_rgba(22,20,18,0.06)]'}`}
          {...props}
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted transition-all duration-200
                     peer-focus:top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.15em] peer-focus:text-ink
                     peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-[10px]
                     peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.15em]"
        >
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-oxblood-light">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  )
}