import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthLayout from '../../components/auth/AuthLayout'
import Input from '../../components/ui/Input'
import SubmitButton from '../../components/ui/SubmitButton'
import CountrySelect from '../../components/ui/CountrySelect'
import { useAuth } from '../../hooks/useAuth'
import { useCurrency } from '../../hooks/useCurrency'
import { ADMIN_DEMO } from '../../config/auth'
import { CURRENCIES, getCountry } from '../../config/currency'

export default function Login() {
  const { login } = useAuth()
  const { countryCode, isCountrySelected } = useCurrency()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [country, setCountryChoice] = useState(isCountrySelected ? countryCode : '')
  const [countryTouched, setCountryTouched] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined, form: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.password) e.password = 'Enter your password'
    if (!country) e.country = 'Select your country to continue'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    setLoading(true)
    try {
      const user = await login({
        email: form.email,
        password: form.password,
        country: countryTouched ? country : undefined,
      })
      const c = getCountry(user.country)
      toast.success(`Welcome back, ${user.name.split(' ')[0]} · Prices in ${CURRENCIES[c.currency].code}`)
      navigate(user.role === 'admin' && from === '/' ? '/admin' : from, { replace: true })
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setLoading(false)
    }
  }

  const fillAdmin = () => {
    setForm({ email: ADMIN_DEMO.email, password: ADMIN_DEMO.password })
    setErrors({})
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Good to see you again."
      footer={
        <>
          New to Aries Leathers?{' '}
          <Link to="/signup" state={location.state} className="font-medium text-oxblood underline-offset-4 hover:underline">
            Create an account
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

        <Input label="Email" icon={Mail} type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />
        <Input label="Password" icon={Lock} type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={update('password')} error={errors.password} />

        <div>
          <CountrySelect
            value={country}
            onChange={(code) => {
              setCountryChoice(code)
              setCountryTouched(true)
              setErrors((er) => ({ ...er, country: undefined }))
            }}
            label="Shopping from"
            error={errors.country}
          />
          <p className="mt-1.5 text-xs text-muted">Leave as is to use the country saved on your account.</p>
        </div>

        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>

      <div className="mt-6 flex items-center justify-between gap-3 border border-dashed border-gold px-4 py-3 text-xs">
        <div className="min-w-0">
          <p className="font-medium uppercase tracking-[0.15em] text-gold-dark">Admin demo</p>
          <p className="mt-0.5 truncate text-muted">{ADMIN_DEMO.email} · {ADMIN_DEMO.password}</p>
        </div>
        <button
          type="button"
          onClick={fillAdmin}
          className="shrink-0 border border-line bg-bone px-4 py-1.5 font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
        >
          Use
        </button>
      </div>
    </AuthLayout>
  )
}