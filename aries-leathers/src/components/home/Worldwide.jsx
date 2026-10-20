import { FaEtsy, FaInstagram } from 'react-icons/fa'
import Container from '../ui/Container'
import Flag from '../ui/Flag'
import Reveal from '../motion/Reveal'
import SplitReveal from '../motion/SplitReveal'
import { COUNTRIES } from '../../config/currency'
import { convertCurrency, formatCurrency } from '../../utils/currency'
import { SITE } from '../../config/site'
import { FEATURED } from '../../data/home'

function CountryPill({ c }) {
  const price = formatCurrency(convertCurrency(FEATURED.price, c.currency), c.currency, c.locale)
  return (
    <div className="flex shrink-0 items-center gap-3 border border-line bg-bone px-5 py-3">
      <Flag code={c.code} />
      <span className="text-sm">{c.name}</span>
      <span className="h-4 w-px bg-line" />
      <span className="text-sm font-medium text-oxblood">{price}</span>
    </div>
  )
}

function MarqueeRow({ items, reverse = false }) {
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className={`flex w-max gap-3 pr-3 group-hover:[animation-play-state:paused] ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {[...items, ...items].map((c, i) => (
          <CountryPill key={`${c.code}-${i}`} c={c} />
        ))}
      </div>
    </div>
  )
}

export default function Worldwide() {
  const half = Math.ceil(COUNTRIES.length / 2)

  return (
    <section className="overflow-hidden bg-ivory py-28">
      <Container className="mb-14 text-center">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Worldwide</p>
        </Reveal>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
          <SplitReveal text="Shipped worldwide," className="block" />
          <SplitReveal text="priced in yours." className="block italic text-oxblood" delay={0.15} />
        </h2>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
            The {FEATURED.name}, shown in {COUNTRIES.length} countries. Choose your country once and every price follows.
          </p>
        </Reveal>
      </Container>

      <div className="space-y-3">
        <MarqueeRow items={COUNTRIES.slice(0, half)} />
        <MarqueeRow items={COUNTRIES.slice(half)} reverse />
      </div>

      <Reveal delay={0.2} className="mt-14 flex flex-wrap items-center justify-center gap-10 px-4">
        <a href={SITE.socials.etsy} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
          <FaEtsy size={15} /> Read reviews on Etsy
          <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
        </a>
        <a href={SITE.socials.instagram} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
          <FaInstagram size={15} /> Follow us
          <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
        </a>
      </Reveal>
    </section>
  )
}