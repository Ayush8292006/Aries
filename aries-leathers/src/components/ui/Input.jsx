import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function Input({ label, icon: Icon, error, type = 'text', className = '', ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
        {label}
      </label>
      <div
        className={`group flex h-12 items-center gap-3 border bg-bone px-4 transition-colors duration-300
                    ${error ? 'border-oxblood-light' : 'border-line hover:border-ink/40 focus-within:border-ink'}`}
      >
        {Icon && <Icon size={17} strokeWidth={1.5} className="shrink-0 text-muted transition-colors group-focus-within:text-ink" />}
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="text-muted transition-colors hover:text-ink"
          >
            {show ? <EyeOff size={17} strokeWidth={1.5} /> : <Eye size={17} strokeWidth={1.5} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-oxblood-light">
          {error}
        </p>
      )}
    </div>
  )
}