import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X, ArrowRight } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'

const EASE = [0.22, 1, 0.36, 1]

export default function ClotheslineHero() {
  const { products } = useProducts()
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const displayProducts = products.slice(0, 8)

  return (
    <section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#1a1a1a] pt-20 text-bone">
      
      {/* Header */}
      <div className="relative z-10 mx-auto mt-10 max-w-3xl px-6 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-bone/60">
          New Collection — Premium Streetwear
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.1] tracking-tight text-white md:text-7xl">
          Layers that hang right.
        </h1>
      </div>

      {/* Clothesline Area */}
      <div className="relative mt-20 flex w-full items-start justify-center pb-20">
        
        {/* Rope */}
        <svg
          className="absolute top-10 h-24 w-full min-w-[1200px]"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 20 Q 600 120 1200 20"
            fill="none"
            stroke="#555"
            strokeWidth="2.5"
          />
        </svg>

        {/* Continuous left drift */}
        <motion.div
          className="relative z-10 mt-14 flex w-full max-w-[1400px] items-start justify-between px-4 md:px-10"
          animate={{ x: [0, -80] }}                    // moves left
          transition={{
            duration: 12,                              // ← change this for speed (lower = faster)
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          {displayProducts.map((product, i) => {
            const total = displayProducts.length - 1
            const progress = i / total
            const curveY = Math.sin(progress * Math.PI) * 60

            const swingDelay = (i * 0.5) % 2.8
            const swingDuration = 3.2 + (i % 3) * 0.35

            return (
              <motion.div
                key={product.id}
                className="relative flex cursor-pointer flex-col items-center origin-top"
                style={{ top: curveY }}
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: EASE }}
                onClick={() => setSelected(product)}
                whileHover={{ scale: 1.07, transition: { duration: 0.3 } }}
              >
                {/* Natural swing */}
                <motion.div
                  className="flex flex-col items-center"
                  animate={{
                    rotate: [2.8, -2.8, 2.8],
                    y: [0, 5, 0]
                  }}
                  transition={{
                    duration: swingDuration,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: swingDelay
                  }}
                  whileHover={{
                    rotate: [8, -8, 8],
                    y: [0, 7, 0],
                    transition: { duration: 1.6, ease: 'easeInOut', repeat: Infinity }
                  }}
                >
                  {/* Hanger */}
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-px bg-white/30" />
                    <div className="h-3 w-3 rounded-full border border-white/40 bg-transparent" />
                    <div className="h-8 w-16 rounded-t-full border-t-2 border-white/50" />
                    <div className="h-6 w-20" />
                  </div>

                  {/* Product */}
                  <div className="group relative -mt-10 aspect-[3/4] w-[80px] overflow-hidden bg-[#2a2a2a] md:w-[120px] lg:w-[150px]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute right-0 top-2 border border-white/20 bg-ink px-2 py-0.5 text-[10px] text-bone shadow-sm">
                      ${product.price}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex w-full items-end justify-between px-8 pb-8">
        <div>
          <p className="text-sm font-medium text-bone">Sweatshirt</p>
          <p className="text-xs text-bone/60">$165.00</p>
        </div>
        <div className="max-w-xs text-right">
          <p className="text-xs leading-relaxed text-bone/80">
            Crafted in heavyweight fleece.<br />
            Cut oversized. Made to last.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 border-b border-bone/50 pb-1 text-[11px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold-light hover:text-gold-light"
          >
            Shop the Collection
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden border border-white/10 bg-[#1a1a1a] shadow-2xl md:flex-row"
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/80 text-bone backdrop-blur transition-colors hover:bg-oxblood"
              >
                <X size={20} />
              </button>

              <div className="h-[50vh] w-full bg-[#2a2a2a] md:h-auto md:w-3/5">
                <img
                  src={selected.images[0]}
                  alt={selected.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-8 md:w-2/5 md:p-12">
                <p className="text-[10px] uppercase tracking-[0.2em] text-bone/50">
                  {selected.category}
                </p>
                <h2 className="mt-2 font-display text-3xl text-white">
                  {selected.name}
                </h2>
                <p className="mt-2 text-lg text-bone">${selected.price}</p>
                <p className="mt-6 text-sm leading-relaxed text-bone/70">
                  {selected.description}
                </p>

                <button
                  onClick={() => navigate(`/products/${selected.id}`)}
                  className="mt-8 flex w-full items-center justify-center gap-2 bg-bone py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold hover:text-ink"
                >
                  View Product <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}