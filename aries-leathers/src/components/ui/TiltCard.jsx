import { useRef } from 'react'

/**
 * Mouse ke saath 3D mein tilt hone wala card.
 * Andar kisi element ko style={{ transform: 'translateZ(40px)' }} doge
 * to woh card se bahar "uthta" hua dikhega.
 */
export default function TiltCard({
  children,
  max = 8,          // max tilt angle (degrees)
  scale = 1.02,
  glare = true,
  className = '',
  innerClassName = '',
}) {
  const ref = useRef(null)
  const frame = useRef(0)

  const update = (vars) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v))
    })
  }

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    update({
      '--rx': `${((0.5 - y) * max * 2).toFixed(2)}deg`,
      '--ry': `${((x - 0.5) * max * 2).toFixed(2)}deg`,
      '--gx': `${(x * 100).toFixed(1)}%`,
      '--gy': `${(y * 100).toFixed(1)}%`,
      '--s': `${scale}`,
    })
  }

  const handleLeave = () => update({ '--rx': '0deg', '--ry': '0deg', '--s': '1' })

  return (
    <div className={className} style={{ perspective: '1200px' }}>
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`group/tilt relative h-full transition-transform duration-300 ease-out ${innerClassName}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale(var(--s, 1))',
        }}
      >
        {children}
        {glare && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
            style={{
              background: 'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.4), transparent 60%)',
              transform: 'translateZ(1px)',
            }}
          />
        )}
      </div>
    </div>
  )
}