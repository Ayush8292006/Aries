import Container from '../ui/Container'
import Reveal from '../motion/Reveal'
import { PROMISES } from '../../data/home'

export default function Promises() {
  return (
    <section className="border-t border-line bg-bone py-20">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
        {PROMISES.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 0.08}>
            <div className="group">
              <Icon size={26} strokeWidth={1.25} className="text-oxblood transition-transform duration-500 ease-luxe group-hover:-translate-y-1" />
              <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  )
}