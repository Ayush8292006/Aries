import { Link } from 'react-router-dom'
import { Lock, RotateCcw, Truck } from 'lucide-react'
import SmartImage from '../ui/SmartImage'
import Flag from '../ui/Flag'
import { useCurrency } from '../../hooks/useCurrency'

function Row({ label, value, accent = false, muted = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-sm">
      <span className="text-bone/70">{label}</span>
      <span className={`text-right ${accent ? 'text-gold-light' : muted ? 'text-bone/50' : 'text-bone'}`}>{value}</span>
    </div>
  )
}

export default function OrderSummary({ lines, totals, children, className = '' }) {
  const { format, country, currency } = useCurrency()

  return (
    <div className={`bg-ink p-6 text-bone md:p-8 ${className}`}>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-2xl">Order summary</p>
        <Link to="/cart" className="text-xs text-bone/60 underline underline-offset-4 transition-colors hover:text-bone">
          Edit cart
        </Link>
      </div>
      <p className="mt-2 flex items-center gap-2 text-xs text-bone/60">
        <Flag code={country.code} /> {country.name} · Paying in {currency.code} ({currency.symbol})
      </p>

      <ul className="mt-7 max-h-80 space-y-5 overflow-y-auto pr-1" data-lenis-prevent>
        {lines.map((l) => (
          <li key={l.key} className="flex items-center gap-4">
            <div className="relative aspect-[4/5] w-16 shrink-0 bg-ink-light">
              <SmartImage src={l.product.images?.[0]} alt={l.product.name} className="h-full w-full" />
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-oxblood px-1 text-[10px] text-bone">
                {l.qty}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base">{l.product.name}</p>
              <p className="mt-0.5 text-xs text-bone/50">{[l.size && `Size ${l.size}`, l.color].filter(Boolean).join(' · ')}</p>
            </div>
            <p className="shrink-0 text-sm">{format(l.total)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-7 border-t border-bone/15 pt-5">
        <Row label={`Subtotal (${totals.count})`} value={format(totals.subtotal)} />
        {totals.promo && <Row label={`Discount · ${totals.promo.code}`} value={`− ${format(totals.discount)}`} accent />}
        <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : format(totals.shipping)} />
        <Row label="Tax and duties" value="On delivery, if any" muted />
      </div>

      <div className="mt-4 flex items-baseline justify-between border-t border-bone/15 pt-5">
        <span className="text-[12px] font-medium uppercase tracking-[0.2em]">Total</span>
        <span className="font-display text-4xl">{format(totals.total)}</span>
      </div>

      <ul className="mt-7 space-y-2.5 border-t border-bone/15 pt-6 text-xs text-bone/60">
        <li className="flex items-center gap-3"><Lock size={14} strokeWidth={1.5} className="text-gold-light" /> Secure demo checkout — no real payment</li>
        <li className="flex items-center gap-3"><Truck size={14} strokeWidth={1.5} className="text-gold-light" /> Handmade to order, shipped from India</li>
        <li className="flex items-center gap-3"><RotateCcw size={14} strokeWidth={1.5} className="text-gold-light" /> Returns accepted within 14 days</li>
      </ul>

      {children}
    </div>
  )
}