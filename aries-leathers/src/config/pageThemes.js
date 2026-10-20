/**
 * PAGE THEMES — har page ka apna background.
 * bone  = page background
 * ivory = header / cards
 * cream = input fields
 * line  = borders
 */
const THEMES = {
  rose:   { bone: '#F3E6E1', ivory: '#EAD5CD', cream: '#FAF2EF', line: '#DDC3BA' },
  clay:   { bone: '#F1E4D5', ivory: '#E6CFB8', cream: '#F8EFE6', line: '#D9BFA5' },
  linen:  { bone: '#F2EBDB', ivory: '#E7DCC2', cream: '#F9F5EA', line: '#D8CAA8' },
  mist:   { bone: '#ECEBE7', ivory: '#DFDDD6', cream: '#F6F5F2', line: '#CFCBC2' },
  camel:  { bone: '#EDE0CC', ivory: '#E0CBAE', cream: '#F7EEE1', line: '#CDB28E' },
  almond: { bone: '#F4EDE4', ivory: '#E9DDCD', cream: '#FBF7F2', line: '#DACBB6' },
}

// Route ka shuruaati hissa → theme. Home ('/') default rang mein rehta hai.
const ROUTE_THEMES = [
  ['/products/', 'linen'], // product detail (pehle check hota hai)
  ['/products', 'clay'],
  ['/search', 'clay'],
  ['/about', 'clay'],
  ['/cart', 'almond'],
  ['/wishlist', 'rose'],
  ['/login', 'rose'],
  ['/signup', 'rose'],
  ['/checkout', 'mist'],
  ['/payment', 'mist'],
  ['/admin', 'mist'],
  ['/orders', 'linen'],
  ['/order-success', 'linen'],
  ['/profile', 'camel'],
  ['/contact', 'camel'],
]

/** Page ke liye CSS variables — Tailwind ke bg-bone, bg-ivory waghera inhi se rang lete hain */
export function getPageThemeStyle(pathname) {
  const match = ROUTE_THEMES.find(([prefix]) => pathname.startsWith(prefix))
  if (!match) return undefined
  const t = THEMES[match[1]]
  return {
    '--color-bone': t.bone,
    '--color-ivory': t.ivory,
    '--color-cream': t.cream,
    '--color-line': t.line,
  }
}