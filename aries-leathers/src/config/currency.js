/**
 * CURRENCY CONFIGURATION
 * ------------------------------------------------------------------
 * - Saare product prices BASE_CURRENCY (USD) mein store hote hain.
 * - Display ke time selected currency mein convert hote hain.
 * - Yeh exchange rates STATIC DEMO VALUES hain — live nahi hain.
 *   Inhe manually update karo, ya baad mein CurrencyProvider mein
 *   live rates API connect kar sakte ho.
 */

export const BASE_CURRENCY = 'USD'
export const DEFAULT_COUNTRY = 'IN'
export const STORAGE_KEY = 'aries_locale'

// decimals = kitne decimal places dikhane hain / round karna hai
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 0 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', decimals: 2 },
  SAR: { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal', decimals: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', decimals: 2 },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', decimals: 2 },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
}

// 1 USD = X units. STATIC DEMO RATES — NOT LIVE.
export const STATIC_RATES = {
  USD: 1,
  INR: 83.33,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.37,
  AUD: 1.52,
  AED: 3.6725,
  SAR: 3.75,
  SGD: 1.34,
  NZD: 1.66,
  CHF: 0.88,
  JPY: 150,
}

export const RATES_META = {
  base: BASE_CURRENCY,
  source: 'Static demo rates (not live)',
  updatedAt: '2026-10-20',
}

// locale = number formatting style (e.g. India: 1,00,000 | Germany: 1.000,00)
export const COUNTRIES = [
  { code: 'IN', name: 'India', currency: 'INR', locale: 'en-IN' },
  { code: 'US', name: 'United States', currency: 'USD', locale: 'en-US' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', locale: 'en-GB' },
  { code: 'CA', name: 'Canada', currency: 'CAD', locale: 'en-CA' },
  { code: 'AU', name: 'Australia', currency: 'AUD', locale: 'en-AU' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', locale: 'en-AE' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', locale: 'en-SA' },
  { code: 'DE', name: 'Germany', currency: 'EUR', locale: 'de-DE' },
  { code: 'FR', name: 'France', currency: 'EUR', locale: 'fr-FR' },
  { code: 'IT', name: 'Italy', currency: 'EUR', locale: 'it-IT' },
  { code: 'ES', name: 'Spain', currency: 'EUR', locale: 'es-ES' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR', locale: 'nl-NL' },
  { code: 'SG', name: 'Singapore', currency: 'SGD', locale: 'en-SG' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD', locale: 'en-NZ' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF', locale: 'de-CH' },
  { code: 'JP', name: 'Japan', currency: 'JPY', locale: 'ja-JP' },
]

export const getCountry = (code) => COUNTRIES.find((c) => c.code === code) ?? null