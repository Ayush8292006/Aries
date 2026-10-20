import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import ProductCard from '../product/ProductCard'
import Reveal from '../motion/Reveal'
import SplitReveal from '../motion/SplitReveal'
import { useProducts } from '../../hooks/useProducts'

export default function Trending() {
  const { products } = useProducts()
  const bestsellers = products.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="bg-bone py-28">
      <Container>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Most loved</p>
            </Reveal>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
              <SplitReveal text="Bestsellers" />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <Link to="/products" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
              Shop all
              <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
          {bestsellers.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}