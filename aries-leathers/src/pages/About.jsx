import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ArrowUpRight, Hand, Quote, Ruler, Scissors, ShieldCheck, Star } from 'lucide-react'
import { FaEtsy } from 'react-icons/fa'
import Container from '../components/ui/Container'
import SmartImage from '../components/ui/SmartImage'
import Reveal from '../components/motion/Reveal'
import SplitReveal from '../components/motion/SplitReveal'
import ScrollRevealText from '../components/motion/ScrollRevealText'
import ImageReveal from '../components/motion/ImageReveal'
import CountUp from '../components/motion/CountUp'
import { useProducts } from '../hooks/useProducts'
import { CATEGORY_IMAGES, CRAFT_STEPS, HOME_IMAGES } from '../data/home'
import { SITE } from '../config/site'

const EASE = [0.22, 1, 0.36, 1]

// Sirf asli tathya — aapki Etsy shop ke "About" se
const TIMELINE = [
  { year: '1992', title: 'The first cutting table', text: 'Anwar Ansari begins working with leather in Mumbai — a trade that becomes the family’s craft.' },
  { year: '30 years', title: 'A workshop of masters', text: 'Tailors with three decades at the bench join the workshop. Every pattern is still drawn by hand.' },
  { year: '2025', title: 'Opening to the world', text: 'Aries Leathers opens on Etsy and begins shipping handmade pieces to customers worldwide.' },
  { year: '2026', title: '177 designs and counting', text: 'Jackets, blazers, trousers, vests and seat pads — every one still made to order.' },
]

// Asli 5★ reviews — Etsy shop se
const REVIEWS = [
  { name: 'Paul', text: 'The jacket is what I expected and is a great color and fit.', item: 'Lambskin leather jacket' },
  { name: 'Alex', text: 'Item came in quick and it was a perfect fit!', item: 'Red leather bomber' },
  { name: 'Jane', text: 'Very happy with the jacket. Seller communication was outstanding.', item: 'Oversized leather bomber' },
  { name: 'Etsy buyer', text: 'Great communication and great craft. Loved the trousers.', item: 'Slim fit leather trousers' },
  { name: 'Thomas', text: 'Perfect color and size and nice leather, color accurate.', item: 'Leather chair pad' },
  { name: 'Etsy buyer', text: "Honestly, I didn't have high expectations. To my amazement, it's perfect!", item: 'Leather chair pad' },
  { name: 'Peter', text: 'Thank you very much. Buy next time.', item: 'Round leather chair pad' },
]

const VALUES = [
  { icon: ShieldCheck, title: 'Genuine leather only', text: 'Lambskin, goatskin suede and full hides — never bonded, never faux.' },
  { icon: Scissors, title: 'Made in-house', text: 'No mass factory runs. Every piece is cut and stitched in our own workshop.' },
  { icon: Ruler, title: 'Made to measure', text: 'Send your measurements and colour — we build it to your exact spec.' },
  { icon: Hand, title: 'We make it right', text: "If something isn't quite right, message us and we'll sort it out." },
]

/* ================= HERO ================= */
function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-[88svh] min-h-[560px] overflow-hidden bg-ink">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <SmartImage src={HOME_IMAGES.intro} alt="" label="Aries Leathers" className="h-full w-full" imgClassName="object-[center_30%]" />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10" />

      <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-x-0 bottom-0">
        <Container className="pb-16 md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            className="text-[11px] font-medium uppercase tracking-[0.4em] text-gold-light"
          >
            Our story · {SITE.location}
          </motion.p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] tracking-tight text-bone md:text-[9rem]">
            <SplitReveal text="Since" className="block" delay={0.3} />
            <SplitReveal text="1992." className="block italic text-gold-light" delay={0.45} />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
            className="mt-6 max-w-md text-[15px] leading-relaxed text-bone/75"
          >
            Three decades, one family workshop, and a simple standard — leather made to last for years and look better with age.
          </motion.p>
        </Container>
      </motion.div>
    </section>
  )
}

/* ================= STATEMENT ================= */
function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yUp = useTransform(scrollYProgress, [0, 1], [80, -80])
  const yDown = useTransform(scrollYProgress, [0, 1], [-60, 60])

  return (
    <section ref={ref} className="overflow-hidden bg-bone py-24 md:py-36">
      <Container className="grid items-center gap-10 md:grid-cols-12">
        <motion.div style={{ y: yUp }} className="hidden md:col-span-3 md:block">
          <SmartImage src={CATEGORY_IMAGES['blazers-coats']} alt="" className="aspect-[3/4] w-full" />
        </motion.div>

        <div className="text-center md:col-span-6">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">A family trade</p>
          </Reveal>
          <h2 className="mt-6 font-display text-4xl leading-[1.1] tracking-tight text-ink md:text-6xl">
            <SplitReveal text="We don't do" className="block" />
            <SplitReveal text="factory runs." className="block italic text-oxblood" delay={0.15} />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-md text-[15px] leading-relaxed text-charcoal/80">
              Every pattern is sketched by hand, every hide is chosen by eye, and every seam is finished by a tailor who has
              spent a lifetime at the bench.
            </p>
          </Reveal>
        </div>

        <motion.div style={{ y: yDown }} className="hidden md:col-span-3 md:block">
          <SmartImage src={CATEGORY_IMAGES.jackets} alt="" className="aspect-[3/4] w-full" />
        </motion.div>
      </Container>
    </section>
  )
}

/* ================= FOUNDER ================= */
function Founder() {
  return (
    <section className="bg-ink py-28 text-bone md:py-36">
      <Container className="grid items-center gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <ImageReveal src={HOME_IMAGES.introDetail} alt="Aries Leathers label" label="Since 1992" className="aspect-[4/5] w-full" />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <Reveal>
            <Quote size={48} strokeWidth={1} className="text-gold-light" />
          </Reveal>
          <ScrollRevealText
            className="mt-6 font-display text-3xl leading-[1.3] md:text-[2.75rem]"
            text="Leather crafting isn't just a business for us — it's a family trade. I personally inspect our pieces before they leave the workshop, because we want you to love it right out of the box."
          />
          <Reveal delay={0.2} className="mt-10 flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-light/40 font-display text-2xl text-gold-light">A</span>
            <div>
              <p className="font-display text-2xl">Anwar Ansari</p>
              <p className="text-xs uppercase tracking-[0.25em] text-bone/50">Founder, Aries Leathers</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ================= TIMELINE ================= */
function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })

  return (
    <section ref={ref} className="bg-ivory py-24 md:py-32">
      <Container>
        <div className="mb-16 max-w-xl">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">The journey</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
            <SplitReveal text="From Mumbai to the world" />
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[11px] hidden h-px bg-line md:block" />
          <motion.div style={{ scaleX: scrollYProgress }} className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-oxblood md:block" />

          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {TIMELINE.map((t, i) => (
              <li key={t.title} className="relative border-l border-line pl-6 md:border-l-0 md:pl-0">
                <Reveal delay={i * 0.12}>
                  <span className="absolute -left-[6px] top-1 h-3 w-3 rounded-full bg-oxblood ring-4 ring-ivory md:relative md:left-0 md:top-0 md:block md:h-[22px] md:w-[22px] md:border-[6px] md:border-ivory" />
                  <p className="mt-0 font-display text-4xl text-oxblood md:mt-6 md:text-5xl">{t.year}</p>
                  <p className="mt-3 font-display text-2xl text-ink">{t.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{t.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}

/* ================= NUMBERS ================= */
function Numbers() {
  const items = [
    { node: <CountUp to={30} suffix="+" />, label: 'Years at the bench' },
    { node: <CountUp to={177} />, label: 'Handmade designs' },
    { node: <CountUp to={196} />, label: 'Orders on Etsy' },
    {
      node: (
        <span className="inline-flex items-center gap-2">
          4.8 <Star size={30} className="fill-gold-light text-gold-light" />
        </span>
      ),
      label: 'From 46 reviews',
    },
  ]
  return (
    <section className="bg-oxblood text-bone">
      <Container className="grid grid-cols-2 divide-bone/15 md:grid-cols-4 md:divide-x">
        {items.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="px-4 py-14 text-center">
            <p className="font-display text-5xl md:text-6xl">{s.node}</p>
            <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-bone/60">{s.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  )
}

/* ================= PROCESS ================= */
function Process() {
  return (
    <section className="bg-bone py-24 md:py-32">
      <Container className="grid items-start gap-14 md:grid-cols-12">
        <div className="md:sticky md:top-28 md:col-span-5">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">How we work</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-5xl">
            <SplitReveal text="Every piece, by hand" />
          </h2>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-charcoal/80">
              Because everything is made in-house, custom orders are always welcome — a specific fit, a particular colour,
              or a design you've been imagining.
            </p>
          </Reveal>
          <ImageReveal src={HOME_IMAGES.craft} alt="Tailoring tools" label="Workshop" className="mt-10 aspect-[4/5] w-full max-w-sm" />
        </div>

        <ol className="space-y-5 md:col-span-7">
          {CRAFT_STEPS.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.06}>
                <div className="group relative overflow-hidden border border-line bg-ivory p-8 transition-colors duration-500 hover:border-ink md:p-10">
                  <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-oxblood transition-transform duration-500 group-hover:scale-y-100" />
                  <div className="flex items-start gap-6">
                    <p className="font-display text-5xl leading-none text-oxblood/30 transition-colors duration-500 group-hover:text-oxblood">0{i + 1}</p>
                    <div>
                      <p className="font-display text-3xl text-ink">{s.title}</p>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-charcoal/80">{s.text}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}

/* ================= GALLERY ================= */
function Gallery() {
  const { products } = useProducts()
  const picks = products.filter((p) => p.featured).slice(0, 6)
  const layout = [
    'md:col-span-2 md:row-span-2',
    '',
    '',
    '',
    'md:col-span-2',
    '',
  ]

  return (
    <section className="bg-ivory py-24 md:py-32">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">From the workshop</p>
            </Reveal>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
              <SplitReveal text="Made by our hands" />
            </h2>
          </div>
          <Reveal delay={0.2}>
            <Link to="/products" className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink">
              Shop all
              <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
            </Link>
          </Reveal>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4 md:gap-4">
          {picks.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.08} className={`h-full ${layout[i] ?? ''}`}>
              <Link to={`/products/${p.id}`} className="group relative block h-full overflow-hidden bg-stone">
                <SmartImage
                  src={p.images?.[0]}
                  alt={p.name}
                  label={p.name}
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-[1200ms] ease-luxe group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 flex translate-y-4 items-end justify-between gap-3 p-5 text-bone opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-display text-xl leading-tight">{p.name}</p>
                  <ArrowUpRight size={18} className="shrink-0" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ================= REVIEWS ================= */
function ReviewCard({ r }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col justify-between border border-line bg-bone p-7 md:w-[360px]">
      <div>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={14} className="fill-gold text-gold" />
          ))}
        </div>
        <blockquote className="mt-5 font-display text-2xl leading-snug text-ink">“{r.text}”</blockquote>
      </div>
      <figcaption className="mt-6 border-t border-line pt-4 text-xs text-muted">
        <span className="font-medium text-ink">{r.name}</span> · {r.item}
      </figcaption>
    </figure>
  )
}

function Reviews() {
  return (
    <section className="overflow-hidden bg-bone py-24 md:py-32">
      <Container className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Kind words</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl tracking-tight text-ink md:text-6xl">
            <SplitReveal text="Loved worldwide" />
          </h2>
        </div>
        <Reveal delay={0.2}>
          <a
            href={SITE.socials.etsy}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.2em] text-ink"
          >
            <FaEtsy size={15} /> 4.8 on Etsy · 46 reviews
            <span className="h-px w-8 bg-ink transition-all duration-500 group-hover:w-14 group-hover:bg-oxblood" />
          </a>
        </Reveal>
      </Container>

      <div className="group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee gap-5 pr-5 group-hover:[animation-play-state:paused]">
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= VALUES ================= */
function Values() {
  return (
    <section className="bg-ink py-24 text-bone md:py-32">
      <Container>
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-gold-light">What we stand for</p>
          </Reveal>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-6xl">
            <SplitReveal text="Our promise to you" />
          </h2>
        </div>
        <div className="grid gap-px bg-bone/10 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08} className="bg-ink">
              <div className="group h-full p-8 transition-colors duration-500 hover:bg-ink-light">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-gold-light/30 transition-colors duration-500 group-hover:border-gold-light group-hover:bg-gold-light">
                  <Icon size={22} strokeWidth={1.25} className="text-gold-light transition-colors duration-500 group-hover:text-ink" />
                </span>
                <p className="mt-6 font-display text-2xl">{title}</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/65">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ================= CTA ================= */
function Cta() {
  return (
    <section className="relative overflow-hidden bg-bone py-28 text-center md:py-36">
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[20vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(107,30,34,0.08)]"
      >
        ARIES
      </p>
      <Container className="relative">
        <h2 className="font-display text-5xl tracking-tight text-ink md:text-7xl">
          <SplitReveal text="Have something" className="block" />
          <SplitReveal text="custom in mind?" className="block italic text-oxblood" delay={0.15} />
        </h2>
        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-md text-sm text-muted">Tell us the fit, the colour and the style. Our tailors will take it from there.</p>
        </Reveal>
        <Reveal delay={0.4} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-bone transition-colors duration-500 hover:bg-oxblood"
          >
            Start a custom order
            <ArrowRight size={15} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/products"
            className="border border-ink px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-500 hover:bg-ink hover:text-bone"
          >
            Shop the collection
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}

export default function About() {
  return (
    <>
      <Hero />
      <Statement />
      <Founder />
      <Timeline />
      <Numbers />
      <Process />
      <Gallery />
      <Reviews />
      <Values />
      <Cta />
    </>
  )
}