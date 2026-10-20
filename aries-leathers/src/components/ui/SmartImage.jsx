import { useState } from 'react'

export default function SmartImage({ src, alt = '', label, className = '', imgClassName = '', hideOnError = false }) {
  const [failed, setFailed] = useState(!src)

  if (failed && hideOnError) return null

  return (
    <div className={`relative overflow-hidden bg-stone ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink/45">
          <span className="font-display text-5xl italic">A</span>
          {label && <span className="px-4 text-center text-[10px] uppercase tracking-[0.3em]">{label}</span>}
          <span className="text-[9px] uppercase tracking-[0.25em] text-ink/30">Photo coming soon</span>
        </div>
      )}
    </div>
  )
}