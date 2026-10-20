import { Gem, RotateCcw, Scissors, Truck } from 'lucide-react'

const ETSY = 'https://i.etsystatic.com/46094302/r/il'
const etsy = (hash, id, key) => `${ETSY}/${hash}/${id}/il_794xN.${id}_${key}.jpg`

// Home page ki photos (aapki Etsy shop se)
export const HOME_IMAGES = {
  intro: etsy('b1c930', '8455379536', 'nxtw'),        // suede Harrington
  introDetail: etsy('4f9ddf', '8611484232', 'd9lg'),  // gold ram label
  craft: etsy('afdfb5', '8448009354', 'm0vi'),        // tailoring tools
  auth: etsy('3f10c8', '8455909316', '5n3n'),         // leather blazer
}

export const CATEGORY_IMAGES = {
  jackets: etsy('267345', '8611484318', 'dzte'),
  'blazers-coats': etsy('3f10c8', '8455909316', '5n3n'),
  trousers: etsy('7ffd0a', '8491002445', 'nmo2'),
  vests: etsy('e29410', '8649632413', 'kgww'),
  home: etsy('fa036b', '8515187119', '645s'),
}

export const FEATURED = { name: 'Quilted Moto Jacket', price: 157.5 }

export const SPOTLIGHT = {
  name: 'Aries Standard',
  price: 142.5,
  mrp: 190,
  features: [
    { title: 'Genuine leather', text: 'Lambskin, goatskin suede and full hides — never bonded or faux.', pos: 'left-[5%] top-[30%]', side: 'left' },
    { title: 'Hand-cut panels', text: 'Every pattern sketched and every panel cut by hand in our workshop.', pos: 'right-[5%] top-[26%]', side: 'right' },
    { title: 'Master stitching', text: 'Tailors with over 30 years at the bench line and finish every seam.', pos: 'left-[7%] bottom-[24%]', side: 'left' },
    { title: 'Made to measure', text: 'Send your measurements and colour — we build it to your exact spec.', pos: 'right-[7%] bottom-[22%]', side: 'right' },
  ],
}

export const CRAFT_STEPS = [
  { title: 'Pattern making', text: 'Every pattern is sketched by hand, to the design and your exact measurements.' },
  { title: 'Hand cutting', text: 'Solid hides are selected and each panel is cut individually to match the pattern.' },
  { title: 'Master stitching', text: 'Tailors with three decades at the bench stitch, line and finish every seam.' },
  { title: 'Final inspection', text: 'Each piece is personally checked before it leaves our Mumbai workshop.' },
]

export const STATS = [
  { to: 30, suffix: '+', label: 'Years of craft' },
  { to: 177, suffix: '', label: 'Handmade designs' },
  { to: 100, suffix: '%', label: 'Genuine leather' },
]

export const PROMISES = [
  { icon: Gem, title: 'Genuine Leather', text: '100% real lambskin, goatskin and full hides.' },
  { icon: Scissors, title: 'Made to Measure', text: 'Custom sizes and colours on request.' },
  { icon: Truck, title: 'Free Shipping', text: 'Shipped worldwide from India.' },
  { icon: RotateCcw, title: 'Easy Returns', text: 'Accepted within 14 days.' },
]