import { useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { Copy, Pencil, Plus, Ticket, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { GhostButton, Input, Label, Panel, PrimaryButton, StatusBadge, Toggle } from './AdminFormBits'
import { usePromotions } from '../../hooks/usePromotions'
import { useCurrency } from '../../hooks/useCurrency'
import { BASE_CURRENCY } from '../../config/currency'
import { couponLabel, formatWhen, normalizeCode, scheduleStatus, toInputDate } from '../../utils/promotions'

const usd = (n) => `$${Number(n).toFixed(2).replace(/\.00$/, '')}`

/* ================= Form ================= */
function CouponForm({ initial, existingCodes, onSave, onClose }) {
  const isEdit = !!initial
  const [form, setForm] = useState(() => ({
    code: initial?.code ?? '',
    label: initial?.label ?? '',
    type: initial?.type ?? 'percent',
    value: initial?.value?.toString() ?? '',
    minOrder: initial?.minOrder ? String(initial.minOrder) : '',
    maxUses: initial?.maxUses ? String(initial.maxUses) : '',
    startsAt: toInputDate(initial?.startsAt),
    endsAt: toInputDate(initial?.endsAt),
    active: initial?.active ?? true,
  }))
  const [errors, setErrors] = useState({})
  const { formatPrice, currency } = useCurrency()

  const set = (field) => (e) => {
    const value = field === 'code' ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : e.target.value
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const value = Number(form.value)
  const preview =
    value > 0 ? (form.type === 'percent' ? `${value}% off` : `${formatPrice(value)} off (${usd(value)})`) : '—'

  const validate = () => {
    const e = {}
    const code = normalizeCode(form.code)
    if (code.length < 3 || code.length > 20) e.code = 'Use 3–20 letters or numbers'
    else if (existingCodes.includes(code) && code !== initial?.code) e.code = 'This code already exists'
    if (!(value > 0)) e.value = 'Enter a discount'
    else if (form.type === 'percent' && value > 90) e.value = 'Maximum 90%'
    if (form.minOrder && !(Number(form.minOrder) >= 0)) e.minOrder = 'Enter a valid amount'
    if (form.maxUses && !(Number.isInteger(Number(form.maxUses)) && Number(form.maxUses) >= 0)) e.maxUses = 'Enter a whole number'
    if (form.startsAt && form.endsAt && new Date(form.endsAt) <= new Date(form.startsAt)) e.endsAt = 'End must be after start'
    return e
  }

  const submit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    onSave(
      {
        ...(initial ?? {}),
        code: normalizeCode(form.code),
        label: form.label.trim(),
        type: form.type,
        value,
        minOrder: Number(form.minOrder) || 0,
        maxUses: Number(form.maxUses) || 0,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '',
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : '',
        active: form.active,
      },
      initial?.code ?? null
    )
  }

  return (
    <Panel
      title={isEdit ? 'Edit coupon' : 'New coupon'}
      subtitle={`Amounts are in ${BASE_CURRENCY}. Customers see them in their own currency.`}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <GhostButton type="button" onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton type="submit" form="coupon-form">{isEdit ? 'Save changes' : 'Create coupon'}</PrimaryButton>
        </div>
      }
    >
      <form id="coupon-form" onSubmit={submit} noValidate className="space-y-6">
        <Input label="Coupon code" hint="Letters and numbers" value={form.code} onChange={set('code')} error={errors.code} placeholder="DIWALI20" autoFocus />

        <div>
          <Label>Discount type</Label>
          <div className="grid grid-cols-2 border border-line">
            {[
              { id: 'percent', label: 'Percentage (%)' },
              { id: 'fixed', label: `Fixed amount (${BASE_CURRENCY})` },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                aria-pressed={form.type === t.id}
                className={`py-3 text-xs uppercase tracking-[0.15em] transition-colors ${
                  form.type === t.id ? 'bg-ink text-bone' : 'text-ink hover:bg-ivory'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={form.type === 'percent' ? 'Discount (%)' : `Discount (${BASE_CURRENCY})`}
            type="number"
            min="0"
            step={form.type === 'percent' ? '1' : '0.01'}
            value={form.value}
            onChange={set('value')}
            error={errors.value}
          />
          <Input
            label={`Minimum order (${BASE_CURRENCY})`}
            hint="Optional"
            type="number"
            min="0"
            step="0.01"
            value={form.minOrder}
            onChange={set('minOrder')}
            error={errors.minOrder}
          />
        </div>

        <div className="border-l-2 border-oxblood bg-ivory px-4 py-3 text-sm text-charcoal">
          Customer in {currency.code} sees: <strong className="text-ink">{preview}</strong>
          {Number(form.minOrder) > 0 && <> · on orders over <strong className="text-ink">{formatPrice(Number(form.minOrder))}</strong></>}
        </div>

        <Input label="Customer message" hint="Optional" value={form.label} onChange={set('label')} placeholder="e.g. Diwali special — 20% off" />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Starts" hint="Optional" type="datetime-local" value={form.startsAt} onChange={set('startsAt')} />
          <Input label="Ends" hint="Optional" type="datetime-local" value={form.endsAt} onChange={set('endsAt')} error={errors.endsAt} />
        </div>

        <Input
          label="Usage limit"
          hint="Leave empty for unlimited"
          type="number"
          min="0"
          step="1"
          value={form.maxUses}
          onChange={set('maxUses')}
          error={errors.maxUses}
        />

        <Toggle
          checked={form.active}
          onChange={(v) => setForm((f) => ({ ...f, active: v }))}
          label="Active"
          description="Turn off to pause this code without deleting it."
        />
      </form>
    </Panel>
  )
}

/* ================= List ================= */
export default function AdminCoupons() {
  const { coupons, saveCoupon, deleteCoupon, toggleCoupon, countUses, now } = usePromotions()
  const { formatPrice } = useCurrency()
  const [formState, setFormState] = useState(null) // null | { coupon?: object }
  const [confirmCode, setConfirmCode] = useState(null)

  const list = useMemo(
    () =>
      coupons.map((c) => ({ ...c, status: scheduleStatus(c, now), uses: countUses(c.code) })),
    [coupons, now, countUses]
  )
  const liveCount = list.filter((c) => c.status === 'active').length

  const handleSave = (coupon, originalCode) => {
    // eslint-disable-next-line no-unused-vars
    const { status, uses, ...clean } = coupon // sirf list ke liye the
    saveCoupon(clean, originalCode)
    toast.success(originalCode ? 'Coupon updated' : 'Coupon created')
    setFormState(null)
  }

  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success(`${code} copied`)
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-3xl text-ink">Coupon codes</p>
          <p className="mt-1 text-sm text-muted">
            {coupons.length} {coupons.length === 1 ? 'code' : 'codes'} · {liveCount} live. Customers enter these on the cart page.
          </p>
        </div>
        <PrimaryButton onClick={() => setFormState({})}>
          <Plus size={14} strokeWidth={1.5} /> New coupon
        </PrimaryButton>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center border border-dashed border-line py-16 text-center">
          <Ticket size={40} strokeWidth={1} className="text-muted" />
          <p className="mt-4 font-display text-2xl text-ink">No coupons yet</p>
          <p className="mt-1 text-sm text-muted">Create your first discount code.</p>
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-12 gap-4 border-b border-line pb-3 text-[10px] uppercase tracking-[0.15em] text-muted md:grid">
            <span className="col-span-3">Code</span>
            <span className="col-span-2">Discount</span>
            <span className="col-span-2">Validity</span>
            <span className="col-span-1">Used</span>
            <span className="col-span-1">Status</span>
            <span className="col-span-3 text-right">Actions</span>
          </div>

          <ul className="divide-y divide-line border-b border-line">
            {list.map((c) => (
              <li key={c.code} className="grid grid-cols-2 items-center gap-4 py-4 md:grid-cols-12">
                <div className="col-span-2 md:col-span-3">
                  <button
                    onClick={() => copy(c.code)}
                    title="Copy code"
                    className="group inline-flex items-center gap-2 border border-dashed border-oxblood/50 px-3 py-1.5 font-display text-lg tracking-[0.15em] text-oxblood"
                  >
                    {c.code}
                    <Copy size={12} className="opacity-0 transition-opacity group-hover:opacity-100" />
                  </button>
                  <p className="mt-1 truncate text-xs text-muted">{couponLabel(c, formatPrice)}</p>
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-ink">{c.type === 'percent' ? `${c.value}% off` : `${usd(c.value)} off`}</p>
                  {c.minOrder > 0 && <p className="text-xs text-muted">Min {usd(c.minOrder)}</p>}
                </div>

                <div className="text-xs text-muted md:col-span-2">
                  {c.startsAt || c.endsAt ? (
                    <>
                      {c.startsAt && <p>From {formatWhen(c.startsAt)}</p>}
                      {c.endsAt && <p>Until {formatWhen(c.endsAt)}</p>}
                    </>
                  ) : (
                    <p>No end date</p>
                  )}
                </div>

                <p className="text-sm text-ink md:col-span-1">
                  {c.uses}
                  <span className="text-muted">{c.maxUses > 0 ? ` / ${c.maxUses}` : ''}</span>
                </p>

                <div className="md:col-span-1">
                  <StatusBadge status={c.status} />
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-3">
                  {confirmCode === c.code ? (
                    <>
                      <span className="text-xs text-muted">Delete?</span>
                      <button
                        onClick={() => {
                          deleteCoupon(c.code)
                          setConfirmCode(null)
                          toast.success('Coupon deleted')
                        }}
                        className="bg-oxblood px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-bone"
                      >
                        Yes
                      </button>
                      <button onClick={() => setConfirmCode(null)} className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-ink">
                        No
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          toggleCoupon(c.code)
                          toast.success(c.active ? `${c.code} paused` : `${c.code} activated`)
                        }}
                        className="border border-line px-3 py-2 text-[10px] uppercase tracking-[0.15em] text-ink hover:border-ink"
                      >
                        {c.active ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => setFormState({ coupon: c })}
                        aria-label={`Edit ${c.code}`}
                        className="grid h-9 w-9 place-items-center border border-line text-ink hover:border-ink"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setConfirmCode(c.code)}
                        aria-label={`Delete ${c.code}`}
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
        </>
      )}

      <AnimatePresence>
        {formState && (
          <CouponForm
            initial={formState.coupon}
            existingCodes={coupons.map((c) => c.code)}
            onSave={handleSave}
            onClose={() => setFormState(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}