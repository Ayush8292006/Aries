import { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyContext } from './CurrencyContext'
import {
  CURRENCIES, RATES_META, STATIC_RATES, STORAGE_KEY, getCountry,
} from '../config/currency'
import { convertCurrency, formatCurrency } from '../utils/currency'
import { detectCountry } from '../utils/detectCountry'

// Jo desh hamari list mein nahi hai, unke liye US Dollar
const INTERNATIONAL_FALLBACK = 'US'

function readSavedCountry() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return getCountry(saved?.countryCode) ? saved.countryCode : null
  } catch {
    return null
  }
}

/** Pehle buyer ki chuni hui country, warna apne aap pehchani hui */
function initialCountry() {
  return readSavedCountry() ?? detectCountry() ?? INTERNATIONAL_FALLBACK
}

export default function CurrencyProvider({ children }) {
  const [selectedCode, setSelectedCode] = useState(initialCountry)
  const [isManual, setIsManual] = useState(() => readSavedCountry() !== null)

  // Abhi static rates. Live rates chahiye to yahan fetch karke setRates() karna.
  const [rates] = useState(STATIC_RATES)

  const country = getCountry(selectedCode) ?? getCountry(INTERNATIONAL_FALLBACK)
  const currency = CURRENCIES[country.currency]

  /** Buyer khud country badle — yaad rakho */
  const setCountry = useCallback((code) => {
    const next = getCountry(code)
    if (!next) return
    setSelectedCode(next.code)
    setIsManual(true)
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          countryCode: next.code,
          currencyCode: next.currency,
          currencySymbol: CURRENCIES[next.currency].symbol,
        })
      )
    } catch {
      /* storage unavailable — state still works for this session */
    }
  }, [])

  // Doosre tab mein country badle to yahan bhi update ho
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setSelectedCode(initialCountry())
        setIsManual(readSavedCountry() !== null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const value = useMemo(() => {
    /** Base (USD) amount → selected currency NUMBER */
    const convert = (baseAmount) => convertCurrency(baseAmount, currency.code, { rates })
    /** Selected-currency number → display string */
    const format = (amount) => formatCurrency(amount, currency.code, country.locale)

    return {
      country,
      currency,
      countryCode: country.code,
      // Country hamesha set hai (auto ya buyer ki choice), popup ki zaroorat nahi
      isCountrySelected: true,
      isAutoDetected: !isManual,
      setCountry,
      rates,
      ratesMeta: RATES_META,
      convert,
      format,
      /** Base (USD) amount → seedha display string */
      formatPrice: (baseAmount) => format(convert(baseAmount)),
    }
  }, [country, currency, isManual, rates, setCountry])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}