import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Info, X } from 'lucide-react'
import Field from '../checkout/Field'
import Flag from '../ui/Flag'
import SmartImage from '../ui/SmartImage'
import { CATEGORIES } from '../../config/site'
import { BASE_CURRENCY, getCountry } from '../../config/currency'
import { convertCurrency, formatCurrency } from '../../utils/currency'

const EASE = [0.22, 1, 0.36, 1]

const SIZE_PRESETS = {
  jackets: 'XXS, XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL, Custom',
  vests: 'XXS, XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL, Custom',
  pants: '26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, Custom',
  'seat-pads': '10", 12", 14", 16", 18", 20", 22"',
}

const PREVIEW_COUNTRIES = ['IN', 'US', 'GB', 'AE', 'DE']

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
const splitList = (s) => s.split(',').map((x) => x.trim()).filter(Boolean)
const splitLines = (s) => s.split('\n').map((x) => x.trim()).filter(Boolean)
const round2 = (n) => Math.round(n * 100) / 100

function TextArea({ label, value, onChange, rows = 4, hint, error }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:bg-white ${
          error ? 'border-oxblood-light' : 'border-line focus:border-ink'
        }`}
      />
      {error ? <span className="mt-1.5 block text-xs text-oxblood-light">{error}</span> : hint && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
    </label>
  )
}

function Select({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted">{label}</span>
      <select value={value} onChange={onChange} className="h-14 w-full border border-line bg-cream px-4 text-sm text-ink outline-none focus:border-ink">
        {children}
      </select>
    </label>
  )
}

export default function ProductForm({ initial, existingIds, onSave, onClose }) {
  const isEdit = !!initial
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? '',
    category: initial?.category ?? 'jackets',
    gender: initial?.gender ?? 'men',
    price: initial?.price?.toString() ?? '',
    mrp: initial?.mrp?.toString() ?? '',
    material: initial?.material ?? '',
    colors: (initial?.colors ?? []).join(', '),
    sizes: (initial?.sizes ?? []).join(', ') || SIZE_PRESETS.jackets,
    tag: initial?.tag ?? '',
    featured: initial?.featured ?? false,
    description: initial?.description ?? '',
    details: (initial?.details ?? []).join('\n'),
    images: (initial?.images ?? []).join('\n'),
  }))
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const price = Number(form.price)
  const previews = useMemo(() => {
    if (!(price > 0)) return []
    return PREVIEW_COUNTRIES.map((code) => {
      const c = getCountry(code)
      return { c, value: formatCurrency(convertCurrency(price, c.currency), c.currency, c.locale) }
    })
  }, [price])

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Enter a product name'
    if (!(price > 0)) e.price = `Enter a price in ${BASE_CURRENCY}`
    if (form.mrp && !(Number(form.mrp) >= price)) e.mrp = 'Original price must be equal to or higher than the price'
    if (form.description.trim().length < 10) e.description = 'Add a short description'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    let id = initial?.id
    if (!id) {
      const base = slugify(form.name) || 'product'
      id = base
      let n = 2
      while (existingIds.includes(id)) id = `${base}-${n++}`
    }

    onSave({
      ...(initial ?? {}),
      id,
      name: form.name.trim(),
      category: form.category,
      gender: form.gender,
      price: round2(price), // BASE CURRENCY — kabhi converted price nahi
      mrp: form.mrp ? round2(Number(form.mrp)) : undefined,
      material: form.material.trim(),
      colors: splitList(form.colors),
      sizes: splitList(form.sizes),
      tag: form.tag.trim() || undefined,
      featured: form.featured,
      description: form.description.trim(),
      details: splitLines(form.details),
      images: splitLines(form.images),
    })
  }

  const firstImage = splitLines(form.images)[0]

  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit product' : 'Add product'}>
      <motion.div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.aside
        className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-bone shadow-3d"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5 md:px-8">
          <p className="font-display text-2xl text-ink">{isEdit ? 'Edit product' : 'Add product'}</p>
          <button onClick={onClose} aria-label="Close" className="p-1 text-ink transition-transform duration-300 hover:rotate-90">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6 md:px-8" data-lenis-prevent>
            <Field label="Product name" value={form.name} onChange={set('name')} error={errors.name} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => {
                  const category = e.target.value
                  setForm((f) => ({ ...f, category, sizes: SIZE_PRESETS[category] ?? f.sizes }))
                }}
              >
                {CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </Select>
              <Select label="Shop for" value={form.gender} onChange={set('gender')}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </Select>
            </div>

            {/* Pricing */}
            <div className="border border-line bg-ivory p-5">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal">
                <Info size={15} strokeWidth={1.5} className="mt-0.5 shrink-0 text-oxblood" />
                Enter prices in the base currency (<strong className="font-medium">{BASE_CURRENCY}</strong>) only. Customers see them
                converted to their own currency automatically — never enter a converted price here.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label={`Price (${BASE_CURRENCY})`} type="number" min="0" step="0.01" value={form.price} onChange={set('price')} error={errors.price} />
                <Field label={`Original price (${BASE_CURRENCY}, optional)`} type="number" min="0" step="0.01" value={form.mrp} onChange={set('mrp')} error={errors.mrp} />
              </div>
              {previews.length > 0 && (
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted">Customers will see</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previews.map(({ c, value }) => (
                      <span key={c.code} className="flex items-center gap-2 border border-line bg-bone px-3 py-1.5 text-xs text-ink">
                        <Flag code={c.code} /> {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material" value={form.material} onChange={set('material')} />
              <Field label="Tag (optional)" value={form.tag} onChange={set('tag')} hint="e.g. New, Bestseller" />
            </div>

            <Field label="Colours" value={form.colors} onChange={set('colors')} hint="Comma separated — Black, Brown, Tan" />
            <Field label="Sizes" value={form.sizes} onChange={set('sizes')} hint="Comma separated — filled from the category preset" />

            <TextArea label="Description" value={form.description} onChange={set('description')} error={errors.description} />
            <TextArea label="Details" value={form.details} onChange={set('details')} rows={4} hint="One point per line" />

            <div className="grid gap-4 sm:grid-cols-[1fr_96px]">
              <TextArea label="Image URLs" value={form.images} onChange={set('images')} rows={4} hint="One URL per line. First image is the main photo." />
              <div className="aspect-[4/5] bg-stone sm:mt-6">
                <SmartImage key={firstImage} src={firstImage} alt="" label="Preview" className="h-full w-full" />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink">
              <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-4 w-4 accent-oxblood" />
              Show in Bestsellers on the home page
            </label>
          </div>

          <div className="flex gap-3 border-t border-line bg-ivory px-6 py-5 md:px-8">
            <button type="button" onClick={onClose} className="border border-line px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:border-ink">
              Cancel
            </button>
            <button className="flex-1 bg-ink py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood">
              {isEdit ? 'Save changes' : 'Add product'}
            </button>
          </div>
        </form>
      </motion.aside>
    </div>
  )
}