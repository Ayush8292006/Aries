export default function SectionTitle({ eyebrow, title, subtitle, action, align = 'center', className = '' }) {
  const eyebrowEl = eyebrow && (
    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">{eyebrow}</p>
  )

  if (align === 'left') {
    return (
      <div className={`mb-10 flex flex-wrap items-end justify-between gap-4 ${className}`}>
        <div>
          {eyebrowEl}
          <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 max-w-md text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
    )
  }

  return (
    <div className={`mb-12 text-center ${className}`}>
      {eyebrowEl}
      <h2 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-md text-sm text-muted">{subtitle}</p>}
    </div>
  )
}