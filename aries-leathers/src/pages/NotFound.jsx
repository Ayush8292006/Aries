import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import SplitReveal from '../components/motion/SplitReveal'

export default function NotFound() {
  return (
    <section className="bg-bone">
      <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-display text-[8rem] leading-none text-oxblood md:text-[12rem]">
          <SplitReveal text="404" />
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-ink md:text-4xl">
          <SplitReveal text="This page wandered off" delay={0.2} />
        </h1>
        <Reveal delay={0.4}>
          <p className="mt-4 max-w-sm text-sm text-muted">
            The link may be broken or the piece may have moved. Let's get you back to the collection.
          </p>
        </Reveal>
        <Reveal delay={0.55} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/" className="border border-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-bone">
            Back home
          </Link>
          <Link to="/products" className="group flex items-center gap-3 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood">
            Shop the collection
            <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}