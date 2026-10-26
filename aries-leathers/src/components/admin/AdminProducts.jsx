import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { ExternalLink, Pencil, Plus, RotateCcw, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import SmartImage from '../ui/SmartImage'
import ProductForm from './ProductForm'
import { useProducts } from '../../hooks/useProducts'
import { useCurrency } from '../../hooks/useCurrency'
import { CATEGORIES } from '../../config/site'
import { BASE_CURRENCY } from '../../config/currency'

const usd = (n) => `$${Number(n).toFixed(2)}`

export default function AdminProducts() {
  const { rawProducts, products: liveProducts, getProduct, addProduct, updateProduct, deleteProduct, resetProducts } =
    useProducts()
  // Admin hamesha ASLI price edit kare (sale ke bina)
  const products = rawProducts ?? liveProducts ?? []

  const { formatPrice, currency } = useCurrency()
  const [formState, setFormState] = useState(null) // null | { product?: object }
  const [confirmId, setConfirmId] = useState(null)
  const [query, setQuery] = useState('')

  const list = products.filter((p) =>
    `${p.name} ${p.category} ${p.material}`.toLowerCase().includes(query.toLowerCase())
  )

  const handleSave = (product) => {
    if (formState?.product) {
      updateProduct(product.id, product)
      toast.success('Product updated')
    } else {
      addProduct(product)
      toast.success('Product added')
    }
    setFormState(null)
  }

  const handleDelete = (id) => {
    deleteProduct(id)
    setConfirmId(null)
    toast.success('Product deleted')
  }

  const handleReset = () => {
    if (window.confirm('Reset all products to the original catalogue? Your changes will be lost.')) {
      resetProducts()
      toast.success('Catalogue reset')
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex h-12 w-full max-w-sm items-center gap-3 border border-line bg-ivory px-4 focus-within:border-ink">
          <Search size={16} className="text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 border border-line px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink hover:border-ink"
          >
            <RotateCcw size={14} strokeWidth={1.5} /> Reset
          </button>
          <button
            onClick={() => setFormState({})}
            className="flex items-center gap-2 bg-ink px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-oxblood"
          >
            <Plus size={14} strokeWidth={1.5} /> Add product
          </button>
        </div>
      </div>

      <p className="mb-4 text-xs text-muted">
        Base prices are stored in {BASE_CURRENCY}. The "Customer price" column shows what a shopper in your selected
        currency ({currency.code}) sees — including any sale that is live.
      </p>

      <div className="hidden grid-cols-12 gap-4 border-b border-line pb-3 text-[10px] uppercase tracking-[0.15em] text-muted md:grid">
        <span className="col-span-5">Product</span>
        <span className="col-span-2">Base price ({BASE_CURRENCY})</span>
        <span className="col-span-2">Customer price ({currency.code})</span>
        <span className="col-span-1">Status</span>
        <span className="col-span-2 text-right">Actions</span>
      </div>

      <ul className="divide-y divide-line border-b border-line">
        {list.map((p) => {
          // Customer ko abhi kya dikh raha hai (sale ke saath)
          const live = getProduct?.(p.id) ?? p
          const onSale = Boolean(live.sale)

          return (
            <li key={p.id} className="grid grid-cols-2 items-center gap-4 py-4 md:grid-cols-12">
              <div className="col-span-2 flex items-center gap-4 md:col-span-5">
                <div className="aspect-[4/5] w-14 shrink-0 bg-stone">
                  <SmartImage src={p.images?.[0]} alt={p.name} className="h-full w-full" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-lg text-ink">{p.name}</p>
                  <p className="text-xs text-muted">
                    {CATEGORIES.find((c) => c.slug === p.category)?.name ?? p.category} · {p.gender} ·{' '}
                    {p.sizes?.length ?? 0} sizes
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted md:hidden">Base ({BASE_CURRENCY})</p>
                <p className="text-sm text-ink">{usd(p.price)}</p>
                {p.mrp && <p className="text-xs text-muted line-through">{usd(p.mrp)}</p>}
              </div>

              <div className="md:col-span-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted md:hidden">Customer ({currency.code})</p>
                <p className={`text-sm ${onSale ? 'font-medium text-oxblood' : 'text-ink'}`}>{formatPrice(live.price)}</p>
                {onSale && <p className="text-xs text-muted line-through">{formatPrice(p.price)}</p>}
              </div>

              <div className="flex flex-wrap gap-1 md:col-span-1">
                {onSale && (
                  <span className="bg-gold px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-ink">
                    Sale −{live.sale.percent}%
                  </span>
                )}
                {p.featured && (
                  <span className="bg-oxblood px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-bone">Featured</span>
                )}
                {!onSale && !p.featured && <span className="text-xs text-muted">—</span>}
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2 md:col-span-2">
                {confirmId === p.id ? (
                  <>
                    <span className="text-xs text-muted">Delete?</span>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-oxblood px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-bone"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-[0.15em] text-ink"
                    >
                      No
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/products/${p.id}`}
                      aria-label="View on store"
                      className="grid h-9 w-9 place-items-center border border-line text-ink hover:border-ink"
                    >
                      <ExternalLink size={14} strokeWidth={1.5} />
                    </Link>
                    <button
                      onClick={() => setFormState({ product: p })}
                      aria-label="Edit"
                      className="grid h-9 w-9 place-items-center border border-line text-ink hover:border-ink"
                    >
                      <Pencil size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      onClick={() => setConfirmId(p.id)}
                      aria-label="Delete"
                      className="grid h-9 w-9 place-items-center border border-line text-ink hover:border-oxblood hover:text-oxblood"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>
            </li>
          )
        })}
        {list.length === 0 && (
          <li className="py-12 text-center text-sm text-muted">
            {products.length === 0 ? 'No products found.' : `No products match "${query}".`}
          </li>
        )}
      </ul>

      <AnimatePresence>
        {formState && (
          <ProductForm
            initial={formState.product}
            existingIds={products.map((p) => p.id)}
            onSave={handleSave}
            onClose={() => setFormState(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}