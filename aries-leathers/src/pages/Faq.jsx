import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Mail, MessageCircleQuestion, Phone, Plus, Search, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Container from '../components/ui/Container'
import { SITE } from '../config/site'
import { FAQ_COUNT, FAQ_TOPICS } from '../data/faq'

const EASE = [0.22, 1, 0.36, 1]

function matches(item, query) {
  if (!query) return true
  const hay = `${item.q} ${item.a}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w))
}

/* ===== Ek sawaal ===== */
function Question({ id, item, open, onToggle, number }) {
  const isOpen = open === id
  return (
    <div className={`border-b border-line transition-colors duration-300 ${isOpen ? 'bg-ivory/60' : ''}`}>
      <h3>
        <button
          onClick={() => onToggle(isOpen ? null : id)}
          aria-expanded={isOpen}
          aria-controls={`${id}-answer`}
          className="group flex w-full items-start gap-5 px-1 py-6 text-left md:px-4"
        >
          <span className="mt-1 w-6 shrink-0 font-display text-sm text-muted">{String(number).padStart(2, '0')}</span>
          <span
            className={`flex-1 font-display text-xl leading-snug transition-colors md:text-2xl ${
              isOpen ? 'text-oxblood' : 'text-ink group-hover:text-oxblood'
            }`}
          >
            {item.q}
          </span>
          <span
            className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
              isOpen ? 'rotate-45 border-oxblood bg-oxblood text-bone' : 'border-line text-ink group-hover:border-ink'
            }`}
          >
            <Plus size={15} strokeWidth={1.5} />
          </span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-answer`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pb-7 pl-12 pr-12 text-[15px] leading-relaxed text-charcoal md:pl-[3.75rem] md:pr-16">
              {item.a.split('\n\n').map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Faq() {
  const [topic, setTopic] = useState('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState('orders-0') // pehla sawaal khula

  const sections = useMemo(
    () =>
      FAQ_TOPICS.filter((t) => topic === 'all' || t.id === topic)
        .map((t) => ({ ...t, items: t.items.map((item, i) => ({ ...item, id: `${t.id}-${i}` })).filter((item) => matches(item, query.trim())) }))
        .filter((t) => t.items.length > 0),
    [topic, query]
  )
  const resultCount = sections.reduce((n, t) => n + t.items.length, 0)

  // Google ke liye FAQ structured data
  const schema = useMemo(
    () =>
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_TOPICS.flatMap((t) =>
          t.items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          }))
        ),
      }),
    []
  )

  let counter = 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      {/* ===== Header ===== */}
      <section className="relative overflow-hidden border-b border-line bg-ivory">
        <p
          aria-hidden
          className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[16vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(107,30,34,0.07)]"
        >
          HELP
        </p>
        <Container className="relative py-14 md:py-20">
          <nav className="text-xs text-muted" aria-label="Breadcrumb">
            <Link to="/" className="transition-colors hover:text-oxblood">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">FAQ</span>
          </nav>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-6 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood"
          >
            <span className="h-px w-10 bg-gold" />
            Help centre
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-4 font-display text-5xl tracking-tight text-ink md:text-7xl"
          >
            Frequently asked <em className="text-oxblood">questions</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted"
          >
            Everything about orders, shipping, sizing and caring for your leather — {FAQ_COUNT} answers in one place.
          </motion.p>

          {/* Search */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
            onSubmit={(e) => e.preventDefault()}
            role="search"
            className="group mt-10 flex max-w-xl items-center gap-3 border-b-2 border-ink/20 pb-2 transition-colors focus-within:border-ink"
          >
            <Search size={18} strokeWidth={1.5} className="shrink-0 text-muted group-focus-within:text-oxblood" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a question — e.g. shipping, returns, custom size"
              aria-label="Search questions"
              className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-muted"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-ink">
                <X size={16} />
              </button>
            )}
          </motion.form>
        </Container>
      </section>

      {/* ===== Body ===== */}
      <section className="bg-bone">
        <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-12 lg:gap-16">
          {/* Topics */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <p className="mb-4 hidden text-[11px] font-medium uppercase tracking-[0.25em] text-ink lg:block">Topics</p>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0" data-lenis-prevent>
                {[{ id: 'all', title: 'All questions' }, ...FAQ_TOPICS].map((t) => {
                  const active = topic === t.id
                  const count = t.id === 'all' ? FAQ_COUNT : t.items.length
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTopic(t.id)}
                      aria-pressed={active}
                      className={`relative flex shrink-0 items-center justify-between gap-4 border px-4 py-2.5 text-left text-sm transition-colors duration-300 lg:border-0 lg:px-3 ${
                        active ? 'border-ink text-bone' : 'border-line text-charcoal hover:text-oxblood'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="faq-topic"
                          className="absolute inset-0 bg-ink"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative">{t.title}</span>
                      <span className={`relative text-xs ${active ? 'text-bone/60' : 'text-muted'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Questions */}
          <div className="lg:col-span-9">
            {query && (
              <p className="mb-6 text-sm text-muted">
                {resultCount} {resultCount === 1 ? 'result' : 'results'} for “{query}”
              </p>
            )}

            {sections.length > 0 ? (
              <div className="space-y-14">
                {sections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.7, ease: EASE }}
                  >
                    <h2 className="flex items-baseline justify-between gap-4 border-b border-ink pb-4">
                      <span className="font-display text-3xl text-ink md:text-4xl">{section.title}</span>
                      <span className="text-xs text-muted">
                        {section.items.length} {section.items.length === 1 ? 'question' : 'questions'}
                      </span>
                    </h2>
                    <div>
                      {section.items.map((item) => {
                        counter += 1
                        return <Question key={item.id} id={item.id} item={item} open={open} onToggle={setOpen} number={counter} />
                      })}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20 text-center">
                <MessageCircleQuestion size={44} strokeWidth={1} className="text-oxblood" />
                <p className="mt-6 font-display text-3xl text-ink">No matching questions</p>
                <p className="mt-2 max-w-sm text-sm text-muted">Try different words, or ask us directly — we reply to every message.</p>
                <button
                  onClick={() => {
                    setQuery('')
                    setTopic('all')
                  }}
                  className="mt-8 border border-ink px-8 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-bone"
                >
                  Show all questions
                </button>
              </div>
            )}

            {/* ===== Still need help ===== */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-20 bg-ink p-8 text-bone md:p-12"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-gold-light">Still need help?</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                Talk to our <em className="text-gold-light">workshop.</em>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-bone/70">
                Questions about sizing, colours or a custom piece? Message us — we reply personally.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 border border-bone/15 px-5 py-4 transition-colors hover:border-gold"
                >
                  <FaWhatsapp size={18} className="text-gold" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-bone/50">WhatsApp</span>
                    <span className="block text-sm group-hover:text-gold-light">Chat with us</span>
                  </span>
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="group flex items-center gap-3 border border-bone/15 px-5 py-4 transition-colors hover:border-gold"
                >
                  <Mail size={18} className="shrink-0 text-gold" />
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-bone/50">Email</span>
                    <span className="block truncate text-sm group-hover:text-gold-light">{SITE.email}</span>
                  </span>
                </a>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                  className="group flex items-center gap-3 border border-bone/15 px-5 py-4 transition-colors hover:border-gold"
                >
                  <Phone size={18} className="text-gold" />
                  <span>
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-bone/50">Call</span>
                    <span className="block text-sm group-hover:text-gold-light">{SITE.phone}</span>
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  )
}