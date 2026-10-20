import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { useCurrency } from '../hooks/useCurrency'
import { CURRENCIES, getCountry } from '../config/currency'
import { ADMIN_DEMO, SESSION_KEY, USERS_KEY } from '../config/auth'
import { readJSON, removeKey, writeJSON } from '../utils/storage'

// Demo ke liye password ko SHA-256 hash karke rakhte hain (plain text nahi)
async function hashPassword(password) {
  const data = new TextEncoder().encode(password)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function toPublic(user) {
  const copy = { ...user }
  delete copy.passwordHash
  return copy
}

function localeFields(code) {
  const c = getCountry(code)
  return { country: c.code, currencyCode: c.currency, currencySymbol: CURRENCIES[c.currency].symbol }
}

function saveUser(updated) {
  const users = readJSON(USERS_KEY, [])
  writeJSON(USERS_KEY, users.map((u) => (u.id === updated.id ? updated : u)))
}

function readSessionUser() {
  const id = readJSON(SESSION_KEY, null)
  if (!id) return null
  const found = readJSON(USERS_KEY, []).find((u) => u.id === id)
  return found ? toPublic(found) : null
}

export default function AuthProvider({ children }) {
  const { setCountry, countryCode, isCountrySelected } = useCurrency()
  const [user, setUser] = useState(readSessionUser)

  // Admin demo account ek baar bana do
  useEffect(() => {
    ;(async () => {
      if (readJSON(USERS_KEY, []).some((u) => u.email === ADMIN_DEMO.email)) return
      const passwordHash = await hashPassword(ADMIN_DEMO.password)
      const latest = readJSON(USERS_KEY, [])
      if (latest.some((u) => u.email === ADMIN_DEMO.email)) return
      writeJSON(USERS_KEY, [
        ...latest,
        {
          id: 'admin-demo',
          name: ADMIN_DEMO.name,
          email: ADMIN_DEMO.email,
          passwordHash,
          role: 'admin',
          ...localeFields('IN'),
          createdAt: new Date().toISOString(),
        },
      ])
    })()
  }, [])

  // User kahin se bhi country badle (navbar, profile) → account mein bhi save
  useEffect(() => {
    if (!user || !isCountrySelected || user.country === countryCode) return
    const stored = readJSON(USERS_KEY, []).find((u) => u.id === user.id)
    if (!stored) return
    const updated = { ...stored, ...localeFields(countryCode) }
    saveUser(updated)
    setUser(toPublic(updated))
  }, [countryCode, isCountrySelected, user])

  const signup = useCallback(
    async ({ name, email, password, country }) => {
      const users = readJSON(USERS_KEY, [])
      const normalizedEmail = email.trim().toLowerCase()
      if (users.some((u) => u.email === normalizedEmail)) {
        throw new Error('An account with this email already exists. Try signing in.')
      }
      if (!getCountry(country)) throw new Error('Select your country to continue.')

      const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await hashPassword(password),
        role: 'customer',
        ...localeFields(country),
        createdAt: new Date().toISOString(),
      }

      writeJSON(USERS_KEY, [...users, newUser])
      writeJSON(SESSION_KEY, newUser.id)
      setUser(toPublic(newUser))
      setCountry(newUser.country)
      return toPublic(newUser)
    },
    [setCountry]
  )

  // country sirf tab pass karo jab user ne login form par country BADLI ho
  const login = useCallback(
    async ({ email, password, country }) => {
      const users = readJSON(USERS_KEY, [])
      const found = users.find((u) => u.email === email.trim().toLowerCase())
      const passwordHash = await hashPassword(password)

      if (!found || found.passwordHash !== passwordHash) {
        throw new Error('Incorrect email or password.')
      }

      let account = found
      if (country && getCountry(country) && country !== found.country) {
        account = { ...found, ...localeFields(country) }
        saveUser(account)
      }

      writeJSON(SESSION_KEY, account.id)
      setUser(toPublic(account))
      setCountry(account.country)
      return toPublic(account)
    },
    [setCountry]
  )

  const logout = useCallback(() => {
    removeKey(SESSION_KEY)
    setUser(null)
  }, [])

  const updateUser = useCallback(
    (patch) => {
      if (!user) return
      const stored = readJSON(USERS_KEY, []).find((u) => u.id === user.id)
      if (!stored) return
      const updated = { ...stored, ...patch }
      saveUser(updated)
      setUser(toPublic(updated))
    },
    [user]
  )

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      signup,
      login,
      logout,
      updateUser,
    }),
    [user, signup, login, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}