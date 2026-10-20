/**
 * Pure CSS 3D leather bag — 6 faces, flap, brass buckle, handle.
 * Parent par perspective aur transformStyle: 'preserve-3d' hona chahiye.
 */
export default function LeatherBox3D({
  w = 280,
  h = 210,
  d = 90,
  light = '#B5713F',
  dark = '#6B3A1E',
  deep = '#4A2512',
  className = '',
}) {
  const faces = [
    { w, h, t: `translateZ(${d / 2}px)`, bg: `linear-gradient(150deg, ${light}, ${dark})`, front: true },
    { w, h, t: `rotateY(180deg) translateZ(${d / 2}px)`, bg: `linear-gradient(150deg, ${dark}, ${deep})` },
    { w: d, h, t: `rotateY(90deg) translateZ(${w / 2}px)`, bg: `linear-gradient(180deg, ${dark}, ${deep})` },
    { w: d, h, t: `rotateY(-90deg) translateZ(${w / 2}px)`, bg: `linear-gradient(180deg, ${dark}, ${deep})` },
    { w, h: d, t: `rotateX(90deg) translateZ(${h / 2}px)`, bg: `linear-gradient(90deg, ${light}, ${dark})` },
    { w, h: d, t: `rotateX(-90deg) translateZ(${h / 2}px)`, bg: deep },
  ]

  const handleW = w * 0.45
  const handleH = h * 0.38

  return (
    <div className={`relative ${className}`} style={{ width: w, height: h, transformStyle: 'preserve-3d' }}>
      {faces.map((f, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-[14px]"
          style={{
            width: f.w,
            height: f.h,
            marginLeft: -f.w / 2,
            marginTop: -f.h / 2,
            transform: f.t,
            background: f.bg,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 -20px 40px rgba(0,0,0,0.25)',
          }}
        >
          <div className="absolute inset-[8px] rounded-[10px] border border-dashed border-white/20" />
          {f.front && (
            <>
              <div
                className="absolute inset-x-0 top-0 h-[52%] rounded-b-[36px] rounded-t-[14px]"
                style={{ background: `linear-gradient(170deg, ${dark}, ${deep})`, boxShadow: '0 10px 18px -6px rgba(0,0,0,0.45)' }}
              >
                <div className="absolute inset-[8px] rounded-[10px_10px_28px_28px] border border-dashed border-white/20" />
              </div>
              <div className="absolute left-1/2 top-[44%] h-7 w-10 -translate-x-1/2 rounded-md border-[3px] border-[#E2B868] bg-black/20 shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
            </>
          )}
        </div>
      ))}

      {/* Handle */}
      <div
        className="absolute left-1/2 rounded-t-full border-[10px] border-b-0"
        style={{ width: handleW, height: handleH, marginLeft: -handleW / 2, top: -handleH + 6, borderColor: dark }}
      />
    </div>
  )
}