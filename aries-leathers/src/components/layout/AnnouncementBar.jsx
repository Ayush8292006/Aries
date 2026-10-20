const MESSAGES = [
  'Complimentary shipping on qualifying orders',
  'Handcrafted since 1992',
  '100% genuine leather',
  'Made to order in our Mumbai workshop',
  'Worldwide delivery',
  '4.8★ rated on Etsy',
]

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {MESSAGES.map((m) => (
        <span key={m} className="flex items-center">
          <span className="px-8 text-[11px] font-medium uppercase tracking-[0.28em] text-ink/80 transition-colors duration-300 hover:text-oxblood">
            {m}
          </span>
          <span className="ann-star text-[10px] text-oxblood">✦</span>
        </span>
      ))}
    </div>
  )
}

export default function AnnouncementBar() {
  return (
    <div className="ann-bar relative overflow-hidden border-b border-line bg-[#F8F4EE]">
      <style>{`
        @keyframes ann-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes ann-shine  { 0% { transform: translateX(-120%) } 60%,100% { transform: translateX(120%) } }
        @keyframes ann-twinkle { 0%,100% { opacity: .5; transform: scale(.85) rotate(0deg) } 50% { opacity: 1; transform: scale(1.15) rotate(90deg) } }
        .ann-track { animation: ann-scroll 40s linear infinite; }
        .ann-bar:hover .ann-track { animation-play-state: paused; }
        .ann-shine { animation: ann-shine 6s ease-in-out infinite; }
        .ann-star  { display: inline-block; animation: ann-twinkle 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ann-track, .ann-shine, .ann-star { animation: none; } }
      `}</style>

      {/* Chalti sunehri chamak */}
      <span className="ann-shine pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-linear-to-r from-transparent via-gold/20 to-transparent" />

      {/* Kinaron par fade */}
      <span className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 bg-linear-to-r from-[#F8F4EE] to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 bg-linear-to-l from-[#F8F4EE] to-transparent" />

      <div className="ann-track flex w-max py-2.5">
        <Row />
        <Row />
      </div>
    </div>
  )
}