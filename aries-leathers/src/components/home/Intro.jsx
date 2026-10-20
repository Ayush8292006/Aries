import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Container from '../ui/Container'
import Price from '../ui/Price'
import Reveal from '../motion/Reveal'
import SplitReveal from '../motion/SplitReveal'
import ImageReveal from '../motion/ImageReveal'
import { FEATURED, HOME_IMAGES } from '../../data/home'

export default function Intro() {
  return (
    <section className="overflow-hidden bg-bone py-28 md:py-36">
      <Container className="grid items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Est. 1992 · Handcrafted</p>
          </Reveal>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight text-ink md:text-7xl">
            <SplitReveal text="Leather made to" className="block" />
            <SplitReveal text="be handed down." className="block italic text-oxblood" delay={0.15} />
          </h1>

          <Reveal delay={0.3}>
            <p className="mt-8 max-w-sm text-[15px] leading-relaxed text-muted">
             Handmade leather jackets, pants, vests and seat pads — cut and stitched by hand in our Mumbai workshop since 1992.
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-10 flex flex-wrap items-center gap-8">
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
            >
              Shop collection
              <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <a href="#craft" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
              Our craft
              <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
            </a>
          </Reveal>
        </div>

        <div className="relative md:col-span-7">
          <ImageReveal
            src={HOME_IMAGES.intro}
            alt="Aries Leathers signature bag"
            label="Hero product photo"
            className="aspect-[4/5] w-full md:ml-auto md:w-[78%]"
          />
          <ImageReveal
            src={HOME_IMAGES.introDetail}
            alt="Hand-stitched leather detail"
            label="Detail photo"
            parallax={70}
            delay={0.3}
            className="absolute -bottom-10 left-0 hidden aspect-square w-[40%] border-[10px] border-bone md:block"
          />
          <Reveal delay={0.6} className="absolute right-4 top-4 md:right-6 md:top-6">
            <div className="bg-bone/95 px-5 py-4 shadow-card">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted">Signature</p>
              <p className="mt-1 font-display text-lg">{FEATURED.name}</p>
              <Price amount={FEATURED.price} className="mt-1 text-sm" />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}