export default function Flag({ code, className = '' }) {
  const c = code?.toLowerCase()
  if (!c) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${c}.png`}
      srcSet={`https://flagcdn.com/w80/${c}.png 2x`}
      alt=""
      loading="lazy"
      className={`h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${className}`}
    />
  )
}