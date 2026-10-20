// Demo promo codes — frontend only, koi asli discount system nahi
export const PROMO_CODES = {
  ARIES10: { label: '10% off your order', percent: 10 },
  WELCOME5: { label: '5% welcome discount', percent: 5 },
}

export const MAX_QTY = 5

// Shipping prices BASE CURRENCY (USD) mein — display ke time convert hote hain
export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard shipping', eta: '6–9 working days', priceBase: 0 },
  { id: 'express', label: 'Express shipping', eta: '3–5 working days', priceBase: 25 },
]