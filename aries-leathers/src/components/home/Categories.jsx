import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import SmartImage from '../ui/SmartImage'
import TiltCard from '../ui/TiltCard'
import Reveal from '../motion/Reveal'
import SplitReveal from '../motion/SplitReveal'
import { CATEGORIES } from '../../config/site'
import { CATEGORY_IMAGES } from '../../data/home'
import { useProducts } from '../../hooks/useProducts'

export default function Categories() {
  const { products } = useProducts()
  const count = (slug) => products.filter((p) => p.category === slug).length

  return (
    <section id="categories" className="scroll-mt-24 bg-ivory py-28">
      <Container>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Collections</p>
            </Reveal>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
              <SplitReveal text="Shop by category" />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <Link to="/products" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
              View all
              <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-5 lg:gap-x-5">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link to={`/products?category=${c.slug}`} className="group block">
                <TiltCard max={4} glare={false}>
                  <SmartImage
                    src={CATEGORY_IMAGES[c.slug]}
                    alt={c.name}
                    label={c.name}
                    className="aspect-[3/4] w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                  />
                </TiltCard>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl text-ink">{c.name}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {count(c.slug)} {count(c.slug) === 1 ? 'piece' : 'pieces'}
                    </p>
                  </div>
                  <span className="mb-2 h-px w-6 shrink-0 bg-ink/40 transition-all duration-500 group-hover:w-12 group-hover:bg-oxblood" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}