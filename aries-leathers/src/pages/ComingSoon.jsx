import { Link } from 'react-router-dom'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import SplitReveal from '../components/motion/SplitReveal'

export default function ComingSoon({ title }) {
  return (
    <section className="bg-bone">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Being crafted</p>
        </Reveal>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
          <SplitReveal text={title} delay={0.1} />
        </h1>
        <Reveal delay={0.3}>
          <p className="mt-4 max-w-sm text-sm text-muted">This page is being handcrafted. Please check back soon.</p>
        </Reveal>
        <Reveal delay={0.45}>
          <Link to="/" className="mt-10 inline-block bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood">
            Back to home
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}