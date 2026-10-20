import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Heart } from 'lucide-react'
import Container from '../../components/ui/Container'
import ProductCard from '../../components/product/ProductCard'
import SplitReveal from '../../components/motion/SplitReveal'
import { useWishlist } from '../../hooks/useWishlist'

export default function Wishlist() {
  const { wishlistProducts } = useWishlist()

  return (
    <>
      <section className="border-b border-line bg-ivory">
        <Container className="py-14 md:py-20">
          <h1 className="font-display text-4xl tracking-tight text-ink md:text-6xl">
            <SplitReveal text="Favourites" />
          </h1>
          <p className="mt-4 text-sm text-muted">
            {wishlistProducts.length} saved {wishlistProducts.length === 1 ? 'piece' : 'pieces'}
          </p>
        </Container>
      </section>

      <section className="bg-bone">
        <Container className="py-12 md:py-16">
          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Heart size={40} strokeWidth={1} className="text-muted" />
              <p className="mt-6 font-display text-3xl text-ink">Nothing saved yet</p>
              <p className="mt-2 max-w-xs text-sm text-muted">Tap the heart on any piece to keep it here.</p>
              <Link
                to="/products"
                className="mt-8 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
              >
                Explore the collection
              </Link>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {wishlistProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard p={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </Container>
      </section>
    </>
  )
}