import { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyContext } from './CurrencyContext'
import {
  CURRENCIES, DEFAULT_COUNTRY, RATES_META, STATIC_RATES, STORAGE_KEY, getCountry,
} from '../config/currency'
import { convertCurrency, formatCurrency } from '../utils/currency'

function readSavedCountry() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return getCountry(saved?.countryCode) ? saved.countryCode : null
  } catch {
    return null
  }
}

export default function CurrencyProvider({ children }) {
  // null = user ne abhi tak country select nahi ki
  const [selectedCode, setSelectedCode] = useState(readSavedCountry)

  // Abhi static rates. Live rates chahiye to yahan fetch karke setRates() karna.
  const [rates] = useState(STATIC_RATES)

  const country = getCountry(selectedCode ?? DEFAULT_COUNTRY)
  const currency = CURRENCIES[country.currency]

  const setCountry = useCallback((code) => {
    const next = getCountry(code)
    if (!next) return
    setSelectedCode(next.code)
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
      if (e.key === STORAGE_KEY) setSelectedCode(readSavedCountry())
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
      isCountrySelected: selectedCode !== null,
      setCountry,
      rates,
      ratesMeta: RATES_META,
      convert,
      format,
      /** Base (USD) amount → seedha display string */
      formatPrice: (baseAmount) => format(convert(baseAmount)),
    }
  }, [country, currency, selectedCode, rates, setCountry])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}