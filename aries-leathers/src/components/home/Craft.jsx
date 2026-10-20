import Container from '../ui/Container'
import Reveal from '../motion/Reveal'
import SplitReveal from '../motion/SplitReveal'
import ImageReveal from '../motion/ImageReveal'
import { CRAFT_STEPS, HOME_IMAGES } from '../../data/home'

export default function Craft() {
  return (
    <section id="craft" className="scroll-mt-24 bg-oxblood py-28 text-bone md:py-36">
      <Container className="grid items-center gap-14 md:grid-cols-12">
        <ImageReveal
          src={HOME_IMAGES.craft}
          alt="Artisan hand-stitching leather"
          label="Workshop photo"
          className="aspect-[4/5] md:col-span-6"
        />

        <div className="md:col-span-5 md:col-start-8">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light">The craft</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight md:text-6xl">
            <SplitReveal text="From hide" className="block" />
            <SplitReveal text="to heirloom." className="block italic" delay={0.15} />
          </h2>

          <ol className="mt-12 border-t border-bone/15">
            {CRAFT_STEPS.map((s, i) => (
              <li key={s.title} className="group border-b border-bone/15">
                <Reveal delay={i * 0.08} className="flex gap-6 py-6">
                  <span className="pt-1.5 font-display text-sm text-gold-light">0{i + 1}</span>
                  <div>
                    <p className="font-display text-2xl transition-transform duration-500 ease-luxe group-hover:translate-x-1.5">{s.title}</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-bone/65">{s.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}