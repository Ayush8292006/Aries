import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Lock, Mail, User } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import SubmitButton from '../../components/ui/SubmitButton'
import CountrySelect from '../../components/ui/CountrySelect'
import { useAuth } from '../../hooks/useAuth'
import { useCurrency } from '../../hooks/useCurrency'
import { CURRENCIES, getCountry } from '../../config/currency'

const STRENGTH = [
  { label: 'Too weak', color: 'bg-oxblood-light' },
  { label: 'Weak', color: 'bg-oxblood-light' },
  { label: 'Fair', color: 'bg-gold' },
  { label: 'Good', color: 'bg-ink-light' },
  { label: 'Strong', color: 'bg-ink' },
]

function passwordScore(pw) {
  if (!pw) return 0
  return [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length
}

export default function Signup() {
  const { signup } = useAuth()
  const { countryCode, isCountrySelected } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [country, setCountryChoice] = useState(isCountrySelected ? countryCode : '')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const score = passwordScore(form.password)
  const chosen = getCountry(country)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined, form: undefined }))
  }

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (form.password.length < 8) e.password = 'Use at least 8 characters'
    if (form.confirm !== form.password) e.confirm = "Passwords don't match"
    if (!country) e.country = 'Select your country to continue'
    if (!agree) e.agree = 'Accept the terms to continue'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      const user = await signup({ name: form.name, email: form.email, password: form.password, country })
      toast.success(`Welcome to Aries Leathers, ${user.name.split(' ')[0]}`)
      navigate(from, { replace: true })
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      eyebrow="Join Aries"
      title="Create account"
      subtitle="Save favourites, track orders and shop in your currency."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-medium text-oxblood underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AnimatePresence>
          {errors.form && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood"
              role="alert"
            >
              {errors.form}
            </motion.p>
          )}
        </AnimatePresence>

        <Input label="Full name" icon={User} autoComplete="name" placeholder="Aarav Sharma" value={form.name} onChange={update('name')} error={errors.name} />
        <Input label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />

        <div>
          <Input label="Password" icon={Lock} type="password" autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={update('password')} error={errors.password} />
          {form.password && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-1 flex-1 transition-colors duration-300 ${i <= score ? STRENGTH[score].color : 'bg-line'}`} />
                ))}
              </div>
              <span className="w-16 text-right text-[11px] text-muted">{STRENGTH[score].label}</span>
            </div>
          )}
        </div>

        <Input label="Confirm password" icon={Lock} type="password" autoComplete="new-password" placeholder="Repeat your password" value={form.confirm} onChange={update('confirm')} error={errors.confirm} />

        <div>
          <CountrySelect
            value={country}
            onChange={(code) => {
              setCountryChoice(code)
              setErrors((er) => ({ ...er, country: undefined }))
            }}
            label="Country / Region"
            error={errors.country}
          />
          {chosen && (
            <p className="mt-1.5 text-xs text-muted">
              Prices will be shown in{' '}
              <span className="font-medium text-ink">
                {CURRENCIES[chosen.currency].name} ({CURRENCIES[chosen.currency].symbol})
              </span>
            </p>
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <button
              type="button"
              role="checkbox"
              aria-checked={agree}
              onClick={() => {
                setAgree((a) => !a)
                setErrors((er) => ({ ...er, agree: undefined }))
              }}
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border transition-colors duration-300
                          ${agree ? 'border-ink bg-ink text-bone' : errors.agree ? 'border-oxblood-light' : 'border-line hover:border-ink'}`}
            >
              {agree && <Check size={13} strokeWidth={3} />}
            </button>
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          {errors.agree && <p className="mt-1.5 text-xs text-oxblood-light">{errors.agree}</p>}
        </div>

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>
    </AuthLayout>
  )
}