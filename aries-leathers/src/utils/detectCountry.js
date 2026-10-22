import { COUNTRIES } from '../config/currency'

/**
 * Buyer ka desh apne aap pehchano — bina popup, bina permission.
 * 1) Device ka time zone  2) Browser language region  3) null
 */

const TIMEZONE_COUNTRY = {
  // India
  'Asia/Kolkata': 'IN',
  'Asia/Calcutta': 'IN',
  // UK
  'Europe/London': 'GB',
  'Europe/Belfast': 'GB',
  // Europe
  'Europe/Berlin': 'DE',
  'Europe/Busingen': 'DE',
  'Europe/Paris': 'FR',
  'Europe/Rome': 'IT',
  'Europe/Madrid': 'ES',
  'Atlantic/Canary': 'ES',
  'Africa/Ceuta': 'ES',
  'Europe/Amsterdam': 'NL',
  'Europe/Zurich': 'CH',
  // Middle East
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  // Asia Pacific
  'Asia/Singapore': 'SG',
  'Asia/Tokyo': 'JP',
  'Pacific/Auckland': 'NZ',
  'Pacific/Chatham': 'NZ',
  // Canada
  'America/Toronto': 'CA',
  'America/Montreal': 'CA',
  'America/Vancouver': 'CA',
  'America/Edmonton': 'CA',
  'America/Winnipeg': 'CA',
  'America/Regina': 'CA',
  'America/Halifax': 'CA',
  'America/St_Johns': 'CA',
  'America/Moncton': 'CA',
  'America/Whitehorse': 'CA',
  'America/Yellowknife': 'CA',
  'America/Iqaluit': 'CA',
  // USA
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Denver': 'US',
  'America/Phoenix': 'US',
  'America/Los_Angeles': 'US',
  'America/Anchorage': 'US',
  'America/Detroit': 'US',
  'America/Boise': 'US',
  'America/Juneau': 'US',
  'Pacific/Honolulu': 'US',
}

const SUPPORTED = new Set(COUNTRIES.map((c) => c.code))
const supported = (code) => (code && SUPPORTED.has(code) ? code : null)

function fromTimeZone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (TIMEZONE_COUNTRY[tz]) return TIMEZONE_COUNTRY[tz]
    if (tz.startsWith('Australia/')) return 'AU'
    if (/^America\/(Indiana|Kentucky|North_Dakota)\//.test(tz)) return 'US'
  } catch {
    /* Intl unavailable */
  }
  return null
}

function fromLanguage() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const lang of langs) {
    const region = lang?.split('-')[1]?.toUpperCase()
    if (supported(region)) return region
  }
  return null
}

/** Supported country code ya null */
export function detectCountry() {
  if (typeof window === 'undefined') return null
  return supported(fromTimeZone()) ?? fromLanguage()
}