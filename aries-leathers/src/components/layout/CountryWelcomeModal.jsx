import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import logo from '../../assets/logo.png'
import CountrySelect from '../ui/CountrySelect'
import { useCurrency } from '../../hooks/useCurrency'
import { CURRENCIES, getCountry } from '../../config/currency'

export default function CountryWelcomeModal() {
  const { isCountrySelected, setCountry } = useCurrency()
  const [choice, setChoice] = useState('')
  const [error, setError] = useState('')

  const open = !isCountrySelected

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const chosen = getCountry(choice)

  const handleContinue = () => {
    if (!choice) {
      setError('Please select your country to continue')
      return
    }
    setCountry(choice)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
      <div className="absolute inset-0 animate-fade-in bg-charcoal/30 backdrop-blur-sm" />

      <div className="relative w-full max-w-md animate-fade-up rounded-3xl border border-line bg-white px-8 pb-8 pt-10 text-center shadow-3d">
        <img src={logo} alt="Aries Leathers" className="mx-auto h-16 w-16 rounded-2xl shadow-lift" />
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dark">Welcome to</p>
        <h2 id="welcome-title" className="mt-1 font-display text-3xl tracking-tight">Aries Leathers</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted">Select your country to see prices in your local currency.</p>

        <div className="mt-8 text-left">
          <CountrySelect
            value={choice}
            onChange={(code) => {
              setChoice(code)
              setError('')
            }}
            label="Country / Region"
            error={error}
          />
          {chosen && (
            <p className="mt-2 text-xs text-muted">
              Prices will be shown in{' '}
              <span className="font-semibold text-charcoal">
                {CURRENCIES[chosen.currency].name} ({CURRENCIES[chosen.currency].symbol})
              </span>
            </p>
          )}
        </div>

        <button
          onClick={handleContinue}
          className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white shadow-press transition-all duration-300 ease-luxe hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0"
        >
          Continue Shopping
          <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>

        <p className="mt-4 text-[11px] text-muted">You can change this anytime from your profile.</p>
      </div>
    </div>
  )
}