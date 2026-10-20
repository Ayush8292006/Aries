import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import Price from '../ui/Price'
import SmartImage from '../ui/SmartImage'
import TiltCard from '../ui/TiltCard'
import { useWishlist } from '../../hooks/useWishlist'

export default function ProductCard({ p }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const liked = isWishlisted(p.id)
  const image = p.images?.[0] ?? p.image
  const hoverImage = p.images?.[1] ?? p.hoverImage

  const handleHeart = () => {
    const added = toggleWishlist(p.id)
    toast.success(added ? 'Saved to favourites' : 'Removed from favourites')
  }

  return (
    <article className="group">
      <TiltCard max={4} glare={false}>
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          <Link to={`/products/${p.id}`} aria-label={p.name} className="absolute inset-0">
            <SmartImage
              src={image}
              alt={p.name}
              label={p.name}
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
            />
            {hoverImage && (
              <SmartImage
                src={hoverImage}
                alt=""
                hideOnError
                className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            )}
          </Link>

          {p.tag && (
            <span className="pointer-events-none absolute left-3 top-3 bg-bone/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-ink">
              {p.tag}
            </span>
          )}

          <button
            onClick={handleHeart}
            aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
            aria-pressed={liked}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-bone/90 text-ink transition-all duration-300 hover:scale-110 hover:text-oxblood"
          >
            <Heart size={16} strokeWidth={1.5} className={liked ? 'fill-oxblood text-oxblood' : ''} />
          </button>

          <Link
            to={`/products/${p.id}`}
            className="absolute inset-x-3 bottom-3 hidden translate-y-3 items-center justify-center bg-ink py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-bone opacity-0 transition-all duration-500 ease-luxe hover:bg-oxblood group-hover:translate-y-0 group-hover:opacity-100 md:flex"
          >
            Select size
          </Link>
        </div>
      </TiltCard>

      <div className="mt-4">
        <h3 className="truncate font-display text-lg leading-snug text-ink">
          <Link to={`/products/${p.id}`} className="transition-colors hover:text-oxblood">{p.name}</Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted">{p.material}</p>
        <Price amount={p.price} mrp={p.mrp} className="mt-2 text-sm text-ink" />
      </div>
    </article>
  )
}