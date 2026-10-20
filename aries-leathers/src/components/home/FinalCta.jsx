import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Reveal from '../motion/Reveal'
import SplitReveal from '../motion/SplitReveal'

export default function FinalCta() {
  return (
    <section className="bg-oxblood py-32 text-center text-bone md:py-40">
      <Container>
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light">Begin your collection</p>
        </Reveal>
        <h2 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight md:text-8xl">
          <SplitReveal text="Made once." className="block" />
          <SplitReveal text="Made to last." className="block italic" delay={0.15} />
        </h2>
        <Reveal delay={0.3} className="mt-12">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 bg-bone px-10 py-5 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-bone"
          >
            Shop the collection
            <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}