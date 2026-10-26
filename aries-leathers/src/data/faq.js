/**
 * FAQ DATA
 * ------------------------------------------------------------
 * Naya sawaal jodna ho to us topic ke `items` mein { q, a } add karo.
 * Naya topic chahiye to FAQ_TOPICS mein naya object add karo (id unique rakho).
 * `a` (answer) mein naya paragraph chahiye to '\n\n' likho.
 */

export const FAQ_TOPICS = [
  {
    id: 'orders',
    title: 'Orders & Payment',
    items: [
      {
        q: 'How do I place an order?',
        a: 'Choose your piece, select a colour and size (or Custom for a made-to-measure fit), then add it to your cart. Sign in or create an account, enter your delivery address, choose a shipping method and confirm your payment.',
      },
      {
        q: 'Which payment methods do you accept?',
        a: 'At checkout you can choose Cash on Delivery or online payment. The final amount is always shown in your own currency before you confirm.',
      },
      {
        q: 'Which currency will I be charged in?',
        a: 'Prices are shown in the currency of the country selected on your account — for example ₹ for India, $ for the United States or £ for the United Kingdom. You can change your country at any time from the navbar or your profile.\n\nOur product prices are set in US dollars and converted using fixed exchange rates, so the amount may differ slightly from your bank\'s rate.',
      },
      {
        q: 'Can I use a discount code?',
        a: 'Yes. Enter your code in the promo box on the cart page and tap Apply. The discount is shown in your order summary before you pay. Only one code can be used per order.',
      },
      {
        q: 'Can I change or cancel my order?',
        a: 'Because every piece is cut to order, please contact us within 24 hours of ordering if you need to change the size or colour, or cancel. Once cutting has started we may not be able to make changes.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'How long will my order take?',
        a: 'Every piece is made to order in our Mumbai workshop and dispatched within 6–9 working days. Delivery time after dispatch depends on your country and the shipping method you choose.',
      },
      {
        q: 'Do you ship worldwide?',
        a: 'Yes — we ship to customers all over the world from India, with tracking on every order.',
      },
      {
        q: 'How much does shipping cost?',
        a: 'Standard shipping is free. Express shipping is available at checkout for a small extra charge, shown in your currency.',
      },
      {
        q: 'Will I have to pay customs or import duties?',
        a: 'Import duties and taxes, where applicable, are set by your country and are paid by the buyer on delivery. They are not included in our prices.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched we send you the tracking details. You can also see the status of every order in My Orders on your account.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return policy?',
        a: 'Standard-size pieces can be returned within 14 days of delivery if they are unused and in their original condition, with all tags attached.',
      },
      {
        q: 'Can I return a custom-size order?',
        a: 'Custom (made-to-measure) orders are made specially for you and cannot be returned. If there is a problem with the fit, contact us and we will do our best to help.',
      },
      {
        q: 'What if my item arrives damaged or wrong?',
        a: 'Please contact us within 48 hours of delivery with photos of the item and the packaging, and we will arrange a replacement or a solution.',
      },
      {
        q: 'How do I start a return?',
        a: 'Email or WhatsApp us with your order number and the reason for the return. We will reply with the return address and next steps.',
      },
    ],
  },
  {
    id: 'sizing',
    title: 'Sizing & Custom Orders',
    items: [
      {
        q: 'How do I choose my size?',
        a: 'Choose your usual clothing size. Each product page has a Size and fit section, and the price for every size is shown on the size buttons.',
      },
      {
        q: 'What is a Custom size?',
        a: 'Custom means we build the piece to your exact measurements. After you order, we contact you to confirm your measurements before we start cutting.',
      },
      {
        q: 'Which measurements do you need for a custom order?',
        a: 'For jackets and blazers: chest, shoulders, sleeve length and jacket length. For trousers: waist, hips, thigh, rise and inseam. Measure over light clothing with a soft tape.',
      },
      {
        q: 'Why do larger sizes cost more?',
        a: 'Larger sizes and custom pieces use more leather and take longer to cut and stitch, so the price changes slightly with the size you select.',
      },
    ],
  },
  {
    id: 'leather',
    title: 'Leather & Care',
    items: [
      {
        q: 'Is your leather genuine?',
        a: 'Yes. We only use genuine leather — mainly lambskin and goatskin suede. We never use bonded or faux leather.',
      },
      {
        q: 'What is the difference between lambskin and suede?',
        a: 'Lambskin is smooth, soft and lightweight, and drapes close to the body. Goatskin suede has a brushed, velvety finish with a relaxed look, and is best kept dry.',
      },
      {
        q: 'How do I care for my leather jacket?',
        a: 'Wipe it with a soft, slightly damp cloth, condition it every 6–12 months, and keep it away from direct heat and sunlight. Store it on a wide padded hanger in a breathable bag — never plastic.',
      },
      {
        q: 'What should I do if my jacket gets wet?',
        a: 'Blot it gently with a dry towel and let it dry naturally at room temperature on a wide hanger. Once dry, apply a little leather conditioner.',
      },
    ],
  },
]

export const FAQ_COUNT = FAQ_TOPICS.reduce((n, t) => n + t.items.length, 0)