import Container from '../ui/Container'
import Reveal from '../motion/Reveal'
import ScrollRevealText from '../motion/ScrollRevealText'
import CountUp from '../motion/CountUp'
import { STATS } from '../../data/home'

export default function Story() {
  return (
    <section className="bg-ink py-32 text-bone md:py-40">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold">Our story</p>
          </Reveal>
          <ScrollRevealText
            className="mt-10 font-display text-3xl leading-[1.35] md:text-5xl"
            text="Since 1992, every Aries piece has been cut, stitched and burnished by hand — from full-grain leather that only grows more beautiful with every year you carry it."
          />

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-6 border-t border-bone/15 pt-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl text-gold-light md:text-5xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-bone/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}