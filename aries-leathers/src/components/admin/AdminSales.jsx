import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Check, Megaphone, Pencil, Percent, Plus, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SmartImage from '../ui/SmartImage'
import { GhostButton, Input, Label, Panel, PrimaryButton, StatusBadge, Toggle } from './AdminFormBits'
import { usePromotions } from '../../hooks/usePromotions'
import { useProducts } from '../../hooks/useProducts'
import { useCurrency } from '../../hooks/useCurrency'
import { CATEGORIES } from '../../config/site'
import { formatWhen, saleAppliesTo, scheduleStatus, toInputDate } from '../../utils/promotions'

const SCOPES = [
  { id: 'all', label: 'Whole store' },
  { id: 'category', label: 'Categories' },
  { id: 'products', label: 'Selected products' },
]

const scopeSummary = (sale) => {
  if (sale.scope === 'category') {
    const names = (sale.categories ?? []).map((slug) => CATEGORIES.find((c) => c.slug === slug)?.name ?? slug)
    return names.length ? names.join(', ') : 'No categories'
  }
  if (sale.scope === 'products') return `${(sale.productIds ?? []).length} selected products`
  return 'Whole store'
}

/* ================= Form ================= */
function SaleForm({ initial, onSave, onClose }) {
  const { rawProducts } = useProducts()
  const { formatPrice } = useCurrency()
  const isEdit = !!initial

  const [form, setForm] = useState(() => ({
    name: initial?.name ?? '',
    percent: initial?.percent?.toString() ?? '',
    badge: initial?.badge ?? '',
    scope: initial?.scope ?? 'all',
    categories: initial?.categories ?? [],
    productIds: initial?.productIds ?? [],
    startsAt: toInputDate(initial?.startsAt),
    endsAt: toInputDate(initial?.endsAt),
    showBanner: initial?.showBanner ?? true,
    bannerText: initial?.bannerText ?? '',
    active: initial?.active ?? true,
  }))
  const [errors, setErrors] = useState({})
  const [productQuery, setProductQuery] = useState('')

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }
  const toggleIn = (field, value) =>
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((x) => x !== value) : [...f[field], value],
    }))

  const percent = Number(form.percent)
  const draft = { ...form, percent }
  const affected = rawProducts.filter((p) => saleAppliesTo(draft, p))
  const example = affected[0]

  const pickList = rawProducts.filter((p) => p.name.toLowerCase().includes(productQuery.toLowerCase()))

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 3) e.name = 'Give the sale a name'
    if (!(percent >= 1 && percent <= 90)) e.percent = 'Enter 1–90%'
    if (form.scope === 'category' && form.categories.length === 0) e.scope = 'Choose at least one category'
    if (form.scope === 'products' && form.productIds.length === 0) e.scope = 'Choose at least one product'
    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) e.endsAt = 'End must be after start'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    onSave({
      ...(initial ?? {}),
      name: form.name.trim(),
      percent,
      badge: form.badge.trim(),
      scope: form.scope,
      categories: form.scope === 'category' ? form.categories : [],
      productIds: form.scope === 'products' ? form.productIds : [],
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '',
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : '',
      showBanner: form.showBanner,
      bannerText: form.bannerText.trim(),
      active: form.active,
    })
  }

  return (
    <Panel
      title={isEdit ? 'Edit sale' : 'New sale'}
      subtitle="Prices drop automatically for the products in this sale while it is live."
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <GhostButton type="button" onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton type="submit" form="sale-form">{isEdit ? 'Save changes' : 'Create sale'}</PrimaryButton>
        </div>
      }
    >
      <form id="sale-form" onSubmit={submit} noValidate className="space-y-6">
        <Input label="Sale name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Diwali Sale" autoFocus />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Discount (%)" type="number" min="1" max="90" step="1" value={form.percent} onChange={set('percent')} error={errors.percent} />
          <Input label="Product badge" hint="Optional" value={form.badge} onChange={set('badge')} placeholder={percent ? `${percent}% off` : 'e.g. Diwali Sale'} />
        </div>

        {/* Scope */}
        <div>
          <Label>Applies to</Label>
          <div className="grid grid-cols-3 border border-line">
            {SCOPES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setForm((f) => ({ ...f, scope: s.id }))
                  setErrors((er) => ({ ...er, scope: undefined }))
                }}
                aria-pressed={form.scope === s.id}
                className={`py-3 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                  form.scope === s.id ? 'bg-ink text-bone' : 'text-ink hover:bg-ivory'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {errors.scope && <p className="mt-1.5 text-xs text-oxblood-light">{errors.scope}</p>}

          {form.scope === 'category' && (
            <div className="mt-4 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const on = form.categories.includes(c.slug)
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggleIn('categories', c.slug)}
                    aria-pressed={on}
                    className={`flex items-center gap-2 border px-4 py-2 text-sm transition-colors ${
                      on ? 'border-ink bg-ink text-bone' : 'border-line text-ink hover:border-ink'
                    }`}
                  >
                    {on && <Check size={13} />} {c.name}
                  </button>
                )
              })}
            </div>
          )}

          {form.scope === 'products' && (
            <div className="mt-4 border border-line">
              <div className="flex items-center gap-2 border-b border-line px-3">
                <Search size={14} className="text-muted" />
                <input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Search products"
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted"
                />
                <span className="shrink-0 text-xs text-muted">{form.productIds.length} selected</span>
              </div>
              <ul className="max-h-64 overflow-y-auto" data-lenis-prevent>
                {pickList.map((p) => {
                  const on = form.productIds.includes(p.id)
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => toggleIn('productIds', p.id)}
                        aria-pressed={on}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${on ? 'bg-ivory' : 'hover:bg-ivory/60'}`}
                      >
                        <span className={`grid h-5 w-5 shrink-0 place-items-center border ${on ? 'border-ink bg-ink text-bone' : 'border-line'}`}>
                          {on && <Check size={12} />}
                        </span>
                        <span className="aspect-[4/5] w-8 shrink-0 bg-stone">
                          <SmartImage src={p.images?.[0]} alt="" className="h-full w-full" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-ink">{p.name}</span>
                        <span className="text-xs text-muted">{formatPrice(p.price)}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="border-l-2 border-oxblood bg-ivory px-4 py-3 text-sm text-charcoal">
          <strong className="text-ink">{affected.length}</strong> {affected.length === 1 ? 'product' : 'products'} affected
          {example && percent > 0 && (
            <>
              {' '}· e.g. {example.name}: <span className="line-through">{formatPrice(example.price)}</span>{' '}
              → <strong className="text-oxblood">{formatPrice(Math.round(example.price * (100 - percent)) / 100)}</strong>
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Starts" hint="Empty = now" type="datetime-local" value={form.startsAt} onChange={set('startsAt')} />
          <Input label="Ends" hint="Empty = no end" type="datetime-local" value={form.endsAt} onChange={set('endsAt')} error={errors.endsAt} />
        </div>

        <Toggle
          checked={form.showBanner}
          onChange={(v) => setForm((f) => ({ ...f, showBanner: v }))}
          label="Show in announcement bar"
          description="Adds a message to the strip at the top of every page while the sale is live."
        />
        {form.showBanner && (
          <Input
            label="Banner message"
            hint="Optional"
            value={form.bannerText}
            onChange={set('bannerText')}
            placeholder={`${form.name || 'Sale'} — ${percent || 'X'}% off ${form.scope === 'all' ? 'everything' : 'selected pieces'}`}
          />
        )}

        <Toggle
          checked={form.active}
          onChange={(v) => setForm((f) => ({ ...f, active: v }))}
          label="Active"
          description="Turn off to pause the sale without deleting it."
        />
      </form>
    </Panel>
  )
}

/* ================= List ================= */
export default function AdminSales() {
  const { sales, saveSale, deleteSale, toggleSale, now } = usePromotions()
  const { rawProducts } = useProducts()
  const [formState, setFormState] = useState(null) // null | { sale?: object }
  const [confirmId, setConfirmId] = useState(null)

  const list = useMemo(
    () =>
      sales.map((s) => ({
        ...s,
        status: scheduleStatus(s, now),
        affected: rawProducts.filter((p) => saleAppliesTo(s, p)).length,
      })),
    [sales, now, rawProducts]
  )
  const live = list.filter((s) => s.status === 'active')

  const handleSave = (sale) => {
    // eslint-disable-next-line no-unused-vars
    const { status, affected, ...clean } = sale // sirf list ke liye the
    saveSale(clean)
    toast.success(sale.id ? 'Sale updated' : 'Sale created')
    setFormState(null)
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-3xl text-ink">Sales</p>
          <p className="mt-1 text-sm text-muted">
            {live.length > 0
              ? `${live.length} live now — prices on the store are already reduced.`
              : 'Run a store-wide, category or product sale. Prices update automatically.'}
          </p>
        </div>
        <PrimaryButton onClick={() => setFormState({})}>
          <Plus size={14} strokeWidth={1.5} /> New sale
        </PrimaryButton>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center border border-dashed border-line py-16 text-center">
          <Percent size={40} strokeWidth={1} className="text-muted" />
          <p className="mt-4 font-display text-2xl text-ink">No sales yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Create a sale like "Diwali Sale — 20% off jackets" and schedule when it starts and ends.
          </p>
          <PrimaryButton onClick={() => setFormState({})} className="mt-6">
            <Plus size={14} strokeWidth={1.5} /> Create first sale
          </PrimaryButton>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {list.map((s) => (
            <li key={s.id} className={`border bg-ivory p-6 ${s.status === 'active' ? 'border-oxblood/40' : 'border-line'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <StatusBadge status={s.status} />
                  <p className="mt-3 truncate font-display text-2xl text-ink">{s.name}</p>
                  <p className="mt-1 text-sm text-muted">{scopeSummary(s)}</p>
                </div>
                <p className="shrink-0 font-display text-5xl leading-none text-oxblood">
                  {s.percent}
                  <span className="text-2xl">%</span>
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-xs text-muted">
                <div>
                  <p className="uppercase tracking-[0.15em]">Products</p>
                  <p className="mt-1 text-sm text-ink">{s.affected}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.15em]">Runs</p>
                  <p className="mt-1 text-sm text-ink">
                    {s.startsAt ? formatWhen(s.startsAt) : 'Now'} → {s.endsAt ? formatWhen(s.endsAt) : 'No end'}
                  </p>
                </div>
              </div>

              {s.showBanner && (
                <p className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <Megaphone size={13} className="text-oxblood" /> Shown in announcement bar
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
                {confirmId === s.id ? (
                  <>
                    <span className="text-xs text-muted">Delete this sale?</span>
                    <button
                      onClick={() => {
                        deleteSale(s.id)
                        setConfirmId(null)
                        toast.success('Sale deleted')
                      }}
                      className="bg-oxblood px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-bone"
                    >
                      Yes
                    </button>
                    <button onClick={() => setConfirmId(null)} className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-ink">
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        toggleSale(s.id)
                        toast.success(s.active ? 'Sale paused' : 'Sale activated')
                      }}
                      className="border border-line px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-ink hover:border-ink"
                    >
                      {s.active ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setFormState({ sale: s })}
                      aria-label={`Edit ${s.name}`}
                      className="grid h-9 w-9 place-items-center border border-line text-ink hover:border-ink"
                    >
                      <Pencil size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setConfirmId(s.id)}
                      aria-label={`Delete ${s.name}`}
                      className="grid h-9 w-9 place-items-center border border-line text-ink hover:border-oxblood hover:text-oxblood"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-muted">
        If a product is in more than one live sale, the bigger discount is used. Coupon codes are applied on top of sale prices.
      </p>

      <AnimatePresence>
        {formState && <SaleForm initial={formState.sale} onSave={handleSave} onClose={() => setFormState(null)} />}
      </AnimatePresence>
    </div>
  )
}