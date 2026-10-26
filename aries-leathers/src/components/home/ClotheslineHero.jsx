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

  // Infinite loop ke liye products ko duplicate kiya
  const displayProducts = [...products.slice(0, 10), ...products.slice(0, 10)]

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-[#1a1a1a] pt-28 text-bone md:pt-20">
      
      {/* Header */}
      <div className="relative z-10 mx-auto mt-4 max-w-3xl px-6 text-center md:mt-10">
        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-bone/60 md:text-[10px]">
          New Collection — Premium Streetwear
        </p>
        <h1 className="mt-3 font-display text-4xl leading-[1.1] tracking-tight text-white md:mt-4 md:text-6xl lg:text-7xl">
          Leather that speaks for itself.
        </h1>
      </div>

      {/* Clothesline Area (Products ko upar shift kiya) */}
      <div className="relative mt-4 flex w-full items-start justify-center overflow-hidden pb-10 md:mt-10 md:pb-20">
        
        {/* Rope (SVG Curve) - Adjusted for new position */}
        <svg
          className="absolute top-[-20px] h-32 w-[200vw] min-w-[1200px] md:top-[-10px] md:w-[150vw]"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path d="M 0 20 Q 600 140 1200 20" fill="none" stroke="#444" strokeWidth="2.5" />
        </svg>

        {/* Infinite Loop Container */}
        <motion.div
          className="flex items-start"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 30, // Speed (kam karein toh tez chalega)
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop'
          }}
        >
          {displayProducts.map((product, i) => {
            const cycleIndex = i % 10
            const progress = cycleIndex / 9 
            // U-Shape (Parabola) Curve
            const curveY = Math.sin(progress * Math.PI) * 50 

            return (
              <div
                key={`${product.id}-${i}`}
                className="relative mx-3 flex shrink-0 flex-col items-center cursor-pointer md:mx-6 origin-top"
                style={{ top: curveY }}
                onClick={() => setSelected(product)}
              >
                {/* Swing Animation */}
                <motion.div
                  className="flex flex-col items-center"
                  animate={{ rotate: [2, -2, 2] }}
                  transition={{
                    duration: 3 + (i % 3),
                    ease: 'easeInOut',
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  {/* Hanger (Thoda chhota kiya) */}
                  <div className="flex flex-col items-center scale-75 md:scale-90">
                    <div className="h-6 w-px bg-white/30" />
                    <div className="h-3 w-3 rounded-full border border-white/40 bg-transparent" />
                    <div className="h-8 w-16 rounded-t-full border-t-2 border-white/50" />
                    <div className="h-4 w-20" /> {/* Gap kam kiya */}
                  </div>

                  {/* Product Image (Upar shift kiya -mt-8 se) */}
                  <div className="group relative -mt-6 aspect-[3/4] w-[90px] overflow-hidden bg-[#2a2a2a] md:-mt-8 md:w-[130px] lg:w-[160px]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Price Tag */}
                    <div className="absolute right-0 top-2 border border-white/20 bg-ink px-1.5 py-0.5 text-[9px] text-bone shadow-sm md:px-2 md:text-[10px]">
                      ${product.price}
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex w-full flex-col gap-4 px-6 pb-6 md:flex-row md:items-end md:justify-between md:px-8 md:pb-8">
        <div className="hidden md:block">
          <p className="text-sm font-medium text-bone">The Aries Standard</p>
          <p className="text-xs text-bone/60">Est. 1992</p>
        </div>
        <div className="text-center md:max-w-xs md:text-right">
          <p className="text-[11px] leading-relaxed text-bone/80 md:text-xs">
            Handcrafted in Mumbai.<br className="hidden md:block" />
            Shipped worldwide.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 border-b border-bone/50 pb-1 text-[10px] uppercase tracking-[0.2em] text-bone transition-colors hover:border-gold-light hover:text-gold-light md:text-[11px]"
          >
            Shop the Collection
          </button>
        </div>
      </div>

      {/* Click Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-y-auto border border-white/10 bg-[#1a1a1a] shadow-2xl md:flex-row md:overflow-hidden"
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

              <div className="h-[40vh] w-full shrink-0 bg-[#2a2a2a] md:h-auto md:w-3/5">
                <img
                  src={selected.images[0]}
                  alt={selected.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-6 md:w-2/5 md:p-12">
                <p className="text-[9px] uppercase tracking-[0.2em] text-bone/50 md:text-[10px]">
                  {selected.category}
                </p>
                <h2 className="mt-1 font-display text-2xl text-white md:mt-2 md:text-3xl">
                  {selected.name}
                </h2>
                <p className="mt-1 text-base text-bone md:mt-2 md:text-lg">${selected.price}</p>
                <p className="mt-4 text-xs leading-relaxed text-bone/70 md:mt-6 md:text-sm">
                  {selected.description}
                </p>

                <button
                  onClick={() => navigate(`/products/${selected.id}`)}
                  className="mt-6 flex w-full items-center justify-center gap-2 bg-bone py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold hover:text-ink md:mt-8 md:py-4 md:text-[12px]"
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