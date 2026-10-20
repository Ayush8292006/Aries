import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import Flag from './Flag'
import { COUNTRIES, CURRENCIES, getCountry } from '../../config/currency'
import { useCurrency } from '../../hooks/useCurrency'

export default function CountrySelect({
  value,              // controlled value (form mein). Na do to global context use hoga
  onChange,
  variant = 'field',  // 'field' | 'compact'
  label,
  error,
  dropUp = false,     // panel upar khule (mobile drawer ke liye)
  align = 'right',    // compact panel alignment
  className = '',
}) {
  const ctx = useCurrency()
  const isControlled = value !== undefined
  const selectedCode = isControlled ? value : ctx.countryCode
  const handleChange = onChange ?? ctx.setCountry
  const selected = getCountry(selectedCode)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const searchRef = useRef(null)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.code.toLowerCase() === q
    )
  }, [query])

  // Bahar click karne par band
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Khulte hi search box par focus
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  // Keyboard se chalne par active item dikhta rahe
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const openMenu = () => {
    setQuery('')
    setActive(Math.max(0, COUNTRIES.findIndex((c) => c.code === selectedCode)))
    setOpen(true)
  }

  const toggle = () => (open ? setOpen(false) : openMenu())

  const choose = (code) => {
    handleChange(code)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (!open) return
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[active]) choose(filtered[active].code)
    }
  }

  const isCompact = variant === 'compact'
  const selectedCurrency = selected ? CURRENCIES[selected.currency] : null

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      {label && (
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-charcoal">
          {label}
        </label>
      )}

      {/* ===== Trigger ===== */}
      {isCompact ? (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Change country and currency"
          className={`flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wider shadow-card transition-all duration-300
                      hover:-translate-y-0.5 hover:shadow-lift
                      ${open ? 'border-gold' : 'border-line'}`}
        >
          <Flag code={selected?.code} />
          <span>{selectedCurrency?.code}</span>
          <span className="text-gold-dark">{selectedCurrency?.symbol}</span>
          <ChevronDown size={13} className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex h-12 w-full items-center gap-3 rounded-xl border bg-white px-4 text-left text-sm transition-all duration-300
                      ${error
                        ? 'border-red-400'
                        : open
                          ? 'border-gold shadow-[0_0_0_4px_rgba(201,164,106,0.15)]'
                          : 'border-line hover:border-charcoal/30'}`}
        >
          {selected ? (
            <>
              <Flag code={selected.code} />
              <span className="flex-1 truncate">{selected.name}</span>
              <span className="text-xs font-medium text-muted">
                {selectedCurrency.code} · <span className="text-gold-dark">{selectedCurrency.symbol}</span>
              </span>
            </>
          ) : (
            <span className="flex-1 text-muted">Select your country</span>
          )}
          <ChevronDown size={16} className={`text-muted transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {/* ===== Dropdown panel ===== */}
      <div
        className={`absolute z-50 overflow-hidden rounded-2xl border border-line bg-white shadow-lift transition-all duration-300 ease-luxe
                    ${isCompact ? `w-72 ${align === 'left' ? 'left-0' : 'right-0'}` : 'left-0 w-full'}
                    ${dropUp ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'}
                    ${open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'}`}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Search size={15} className="text-muted" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Search country or currency"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
            aria-label="Search country"
            tabIndex={open ? 0 : -1}
          />
        </div>

        <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto p-1.5">
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted">No country found</li>
          )}
          {filtered.map((c, i) => {
            const cur = CURRENCIES[c.currency]
            const isSelected = c.code === selectedCode
            return (
              <li key={c.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  tabIndex={open ? 0 : -1}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(c.code)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors
                              ${i === active ? 'bg-soft' : ''} ${isSelected ? 'font-medium' : ''}`}
                >
                  <Flag code={c.code} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-muted">{cur.code}</span>
                  <span className="w-8 text-right text-xs text-gold-dark">{cur.symbol}</span>
                  <Check size={14} className={`text-gold-dark ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}