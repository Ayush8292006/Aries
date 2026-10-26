// config/site.js (ya jahan bhi aapki categories hain)

export const PROMO_CODES = {
  ARIES10: { label: '10% off your order', percent: 10 },
  WELCOME5: { label: '5% welcome discount', percent: 5 },
}

export const MAX_QTY = 5

export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard shipping', eta: '6–9 working days', priceBase: 0 },
  { id: 'express', label: 'Express shipping', eta: '3–5 working days', priceBase: 25 },
]

// Client ki image ke exact according categories
export const CATEGORIES = [
  { slug: 'mens-pant', name: "Men's Pant" },
  { slug: 'womens-pant', name: "Women's Pant" },
  { slug: 'mens-jacket', name: "Men's Jacket" },
  { slug: 'womens-jacket', name: "Women's Jacket" },
  { slug: 'mens-vest', name: "Men's Vest" },
  { slug: 'mens-trench-coat', name: "Men's Trench Coat" },
  { slug: 'womens-trench-coat', name: "Women's Trench Coat" },
  { slug: 'leather-shirt', name: "Leather Shirt" },
  { slug: 'jacket-pant-combo', name: "Jacket Pant Combo" },
  { slug: 'mens-shorts', name: "Men's Shorts" },       // Unisex Shorts replaced
  { slug: 'womens-shorts', name: "Women's Shorts" },   // Unisex Shorts replaced
  { slug: 'leather-headrest-cover', name: "Leather Headrest Cover" },
  { slug: 'seat-pad', name: "Seat Pad" },
  { slug: 'apron', name: "Apron" },
  { slug: 'kids-jacket', name: "Kids Jacket" },
]

// Helper to check if a product is on sale dynamically
export const isOnSale = (product) => {
  return product.mrp && product.mrp > product.price
}