/**
 * BLOG / JOURNAL DATA
 * ------------------------------------------------------------
 * Naya article jodna ho to BLOG_POSTS mein ek naya object add karo.
 *  - slug        : URL mein aata hai → /blog/<slug>  (unique, chhote akshar, dash se)
 *  - category    : main topic (sidebar "Topics" mein dikhta hai)
 *  - tags        : Men / Women / Home waghera (sidebar "Shop for" mein)
 *  - date        : 'YYYY-MM-DD'
 *  - image       : badi photo
 *  - promoCode   : (optional) config/store.js ke PROMO_CODES mein se koi code
 *  - productIds  : (optional) article ke neeche dikhne wale products (products.js ke id)
 *  - content     : article ka text — har block ek paragraph / heading / list / quote
 *      { type: 'p', text }  { type: 'h2', text }  { type: 'list', items: [] }  { type: 'quote', text }
 */

const ETSY = 'https://i.etsystatic.com/46094302/r/il'
const etsy = (hash, id, key) => `${ETSY}/${hash}/${id}/il_794xN.${id}_${key}.jpg`

export const BLOG_POSTS = [
  {
    slug: 'extra-10-off-your-first-order',
    title: 'Get an additional 10% off your first order with Aries Leathers',
    excerpt:
      'Welcome to Aries Leathers — home of handmade biker jackets, bomber jackets, leather blazers and more. Your first order is special to us, so here is 10% off.',
    category: 'Offers & Discounts',
    tags: ['Men', 'Women'],
    author: 'Aries Team',
    date: '2026-10-20',
    image: etsy('267345', '8611484318', 'dzte'),
    promoCode: 'ARIES10',
    productIds: ['quilted-moto-jacket', 'black-slim-biker-jacket', 'womens-cropped-biker-jacket'],
    content: [
      {
        type: 'p',
        text: 'Welcome to Aries Leathers. For over three decades our workshop in Mumbai has made leather apparel by hand — biker and motorcycle jackets, bombers, blazers, coats, trousers and vests.',
      },
      {
        type: 'p',
        text: 'Your first order with us is special, so we would like to make it a little easier. Use the code below at checkout to take an additional 10% off.',
      },
      { type: 'h2', text: 'How to use your code' },
      {
        type: 'list',
        items: [
          'Choose your piece, colour and size — or select Custom for a made-to-measure fit.',
          'Add it to your cart and open the cart page.',
          'Enter ARIES10 in the promo code box and tap Apply.',
          'Your 10% discount is shown in your order summary before you pay.',
        ],
      },
      {
        type: 'quote',
        text: 'Every piece is cut and stitched to order, so what you receive is made for you — not pulled from a shelf.',
      },
      {
        type: 'p',
        text: 'Have a question about sizing or colours before you order? Message us on WhatsApp or email — we reply to every message personally.',
      },
    ],
  },
  {
    slug: 'how-to-care-for-your-leather-jacket',
    title: "How to care for your leather jacket: a tailor's guide",
    excerpt:
      'A well-cared-for leather jacket only gets better with age. Our step-by-step guide to cleaning, conditioning and storing your lambskin piece.',
    category: 'Leather Care',
    tags: ['Men', 'Women'],
    author: 'Aries Team',
    date: '2026-10-12',
    image: etsy('5fadc9', '8412332382', 'faii'),
    productIds: ['black-slim-biker-jacket', 'red-leather-bomber-jacket', 'a2-aviator-flight-jacket'],
    content: [
      {
        type: 'p',
        text: 'Genuine leather is a natural material. Treat it a little like skin — keep it clean, keep it moisturised and keep it away from extremes — and it will soften and age beautifully for years.',
      },
      { type: 'h2', text: 'Everyday cleaning' },
      {
        type: 'list',
        items: [
          'Wipe off dust and marks with a soft, slightly damp cloth. Never soak the leather.',
          'For small spots, use a cleaner made for leather — test it on the inside of a cuff first.',
          'Let it dry naturally at room temperature, away from heaters, hair dryers and direct sun.',
        ],
      },
      { type: 'h2', text: 'Conditioning' },
      {
        type: 'p',
        text: 'Condition your jacket every six to twelve months, or whenever it starts to feel dry. Apply a small amount of leather conditioner with a soft cloth in circular motions, leave it to absorb, then buff off any excess.',
      },
      { type: 'h2', text: 'If it gets wet' },
      {
        type: 'p',
        text: 'Blot — do not rub — with a dry towel, then hang it on a wide hanger to dry slowly at room temperature. Once fully dry, apply a little conditioner to bring back the softness.',
      },
      { type: 'h2', text: 'Storing it properly' },
      {
        type: 'list',
        items: [
          'Hang it on a wide, padded hanger so the shoulders keep their shape.',
          'Use a breathable cotton garment bag — never plastic, which traps moisture.',
          'Give it space in the wardrobe so it is not crushed or creased.',
        ],
      },
      {
        type: 'quote',
        text: 'A little care twice a year is all most jackets need. The rest is simply wearing it.',
      },
    ],
  },
  {
    slug: 'lambskin-vs-goatskin-suede',
    title: 'Lambskin vs goatskin suede: which leather is right for you?',
    excerpt:
      'Both are genuine, both age beautifully — but they feel, wear and drape very differently. Here is how to choose.',
    category: 'Leather Guide',
    tags: ['Men', 'Women'],
    author: 'Aries Team',
    date: '2026-10-04',
    image: etsy('b1c930', '8455379536', 'nxtw'),
    productIds: ['brown-suede-harrington-jacket', 'olive-suede-trucker-jacket', 'quilted-moto-jacket'],
    content: [
      {
        type: 'p',
        text: 'Most of our pieces are made in one of two leathers: smooth lambskin or soft goatskin suede. Neither is "better" — they simply suit different people and different wardrobes.',
      },
      { type: 'h2', text: 'Lambskin' },
      {
        type: 'list',
        items: [
          'Very soft and lightweight, with a smooth, slightly glossy surface.',
          'Drapes close to the body — ideal for slim biker jackets, blazers and trousers.',
          'Develops a gentle patina over time and needs only occasional conditioning.',
        ],
      },
      { type: 'h2', text: 'Goatskin suede' },
      {
        type: 'list',
        items: [
          'A brushed, velvety finish with a relaxed, casual look.',
          'Hard-wearing and comfortable from the first day you wear it.',
          'Best kept dry — brush it regularly with a suede brush and use a suede protector spray.',
        ],
      },
      { type: 'h2', text: 'Which should you choose?' },
      {
        type: 'p',
        text: 'If you want a sharp, dressed-up piece that you can wear in light rain, choose lambskin. If you love a soft, lived-in texture for weekends and dry weather, choose suede. Still unsure? Send us a message and we will help you decide.',
      },
    ],
  },
  {
    slug: 'how-to-measure-for-a-custom-fit',
    title: 'How to measure yourself for a made-to-measure jacket',
    excerpt:
      'Choosing Custom size? These are the measurements we need — and how to take them accurately at home with a soft tape.',
    category: 'Fit & Sizing',
    tags: ['Men', 'Women'],
    author: 'Aries Team',
    date: '2026-09-26',
    image: etsy('4c5648', '8668714611', 'bs79'),
    productIds: ['double-breasted-leather-blazer', 'slim-leather-trousers', 'minimalist-leather-blazer'],
    content: [
      {
        type: 'p',
        text: 'When you choose Custom size, we build your piece to your exact measurements. You will need a soft measuring tape and, ideally, someone to help. Measure over a thin T-shirt, standing relaxed.',
      },
      { type: 'h2', text: 'For jackets and blazers' },
      {
        type: 'list',
        items: [
          'Chest — around the fullest part of your chest, just under the arms.',
          'Shoulders — across your back, from one shoulder seam to the other.',
          'Sleeve — from the shoulder seam down to your wrist bone, arm relaxed.',
          'Length — from the base of the collar at the back to where you want the hem.',
        ],
      },
      { type: 'h2', text: 'For trousers' },
      {
        type: 'list',
        items: [
          'Waist — where you normally wear your trousers.',
          'Hips — around the fullest part.',
          'Thigh — around the top of one thigh.',
          'Rise — from the crotch seam to the top of the waistband.',
          'Inseam — from the crotch down to where you want the hem.',
        ],
      },
      {
        type: 'quote',
        text: 'Keep the tape snug but not tight — you should be able to slide one finger underneath.',
      },
      {
        type: 'p',
        text: 'After you place a Custom order we will contact you to confirm your measurements before we start cutting.',
      },
    ],
  },
  {
    slug: 'styling-the-oversized-leather-bomber',
    title: 'Three ways to style an oversized leather bomber',
    excerpt:
      'The oversized bomber is the easiest leather piece to wear. Here are three outfits — from weekend casual to evening.',
    category: 'Style Guide',
    tags: ['Women'],
    author: 'Aries Team',
    date: '2026-09-18',
    image: etsy('26898f', '8480296432', 'gffh'),
    productIds: ['womens-oversized-bomber-jacket', 'womens-cropped-biker-jacket', 'womens-burgundy-long-blazer'],
    content: [
      {
        type: 'p',
        text: 'A relaxed leather bomber balances almost any outfit. Because the shape is roomy, keep what you wear underneath simple and let the leather do the talking.',
      },
      { type: 'h2', text: '1. Weekend casual' },
      {
        type: 'p',
        text: 'A plain white T-shirt, straight-leg jeans and clean white trainers. Push the sleeves up slightly for an easy, lived-in look.',
      },
      { type: 'h2', text: '2. Smart and relaxed' },
      {
        type: 'p',
        text: 'A fine-knit roll neck, tailored trousers and loafers. Black on black looks sharp; a cream knit under a brown bomber feels warmer.',
      },
      { type: 'h2', text: '3. Evening' },
      {
        type: 'p',
        text: 'Throw it over a slip dress with ankle boots. The contrast between soft fabric and structured leather is what makes the outfit.',
      },
      {
        type: 'quote',
        text: 'Choose your usual size for a relaxed fit, or one size down if you prefer it closer to the body.',
      },
    ],
  },
  {
    slug: 'caring-for-leather-home-pieces',
    title: 'Caring for leather seat pads and cushions at home',
    excerpt:
      'Leather at home sees daily use. A few simple habits keep your chair pads and cushions looking new for longer.',
    category: 'Leather Care',
    tags: ['Home'],
    author: 'Aries Team',
    date: '2026-09-08',
    image: etsy('59e304', '8690421963', 'tm61'),
    productIds: ['eames-chair-leather-cushion', 'round-leather-chair-pad'],
    content: [
      {
        type: 'p',
        text: 'Leather seat pads and cushions are used every day, so they need slightly different care from a jacket that hangs in the wardrobe.',
      },
      { type: 'h2', text: 'Weekly' },
      {
        type: 'list',
        items: [
          'Dust with a dry microfibre cloth.',
          'Wipe up spills immediately with a damp cloth — do not let liquids soak in.',
        ],
      },
      { type: 'h2', text: 'Every few months' },
      {
        type: 'list',
        items: [
          'Condition the surface lightly to keep it supple and stop it cracking.',
          'Rotate or flip cushions so they wear evenly.',
        ],
      },
      { type: 'h2', text: 'Placement' },
      {
        type: 'p',
        text: 'Keep leather out of strong, direct sunlight and away from radiators. Heat and sun dry leather out and fade the colour over time.',
      },
    ],
  },
]

/* ===== Helpers ===== */

/** Naye article pehle */
export const SORTED_POSTS = [...BLOG_POSTS].sort((a, b) => new Date(b.date) - new Date(a.date))

export const getPost = (slug) => BLOG_POSTS.find((p) => p.slug === slug) ?? null

/** Sidebar ke liye: { name, count } */
function countBy(getValues) {
  const map = new Map()
  BLOG_POSTS.forEach((p) => getValues(p).forEach((v) => map.set(v, (map.get(v) ?? 0) + 1)))
  return [...map.entries()].map(([name, count]) => ({ name, count }))
}
export const BLOG_TOPICS = countBy((p) => [p.category])
export const BLOG_AUDIENCES = countBy((p) => p.tags ?? [])

/** Article kis filter se match karta hai */
export const postMatchesFilter = (post, filter) =>
  !filter || post.category === filter || (post.tags ?? []).includes(filter)

/** Article kis search se match karta hai */
export function postMatchesQuery(post, query) {
  if (!query) return true
  const hay = [post.title, post.excerpt, post.category, ...(post.tags ?? []), ...post.content.map((b) => b.text ?? (b.items ?? []).join(' '))]
    .join(' ')
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word))
}

/** Padhne ka time (minute) — ~200 words per minute */
export function readTime(post) {
  const words = post.content
    .map((b) => b.text ?? (b.items ?? []).join(' '))
    .join(' ')
    .split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

export const formatPostDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })