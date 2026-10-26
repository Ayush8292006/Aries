import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react'
import Container from '../components/ui/Container'
import Reveal from '../components/motion/Reveal'
import SmartImage from '../components/ui/SmartImage'
import { CATEGORIES as PRODUCT_CATEGORIES } from '../config/site'

const EASE = [0.22, 1, 0.36, 1]

// Client ki demand ke hisaab se data
const SIDEBAR_CATEGORIES = [
  { name: 'Men', count: 12 },
  { name: 'Women', count: 8 },
  { name: 'Accessories', count: 5 },
]

const RECENT_POSTS = [
  'GET ADDITIONAL 10% OFF ON YOUR FIRST PURCHASE WITH KOZA LEATHERS.',
  'The Difference Between Lambskin and Goatskin',
  'Styling the Oversized Leather Bomber',
]

const BLOG_POSTS = [
  {
    id: 1,
    title: 'GET ADDITIONAL 10% OFF ON YOUR FIRST PURCHASE WITH KOZA LEATHERS.',
    excerpt: 'We welcome to our store where you can find your favorite Leather Apparel such as Leather Biker / Motorcycle Jacket, Bomber Jacket, Leather Blazer and many more. Your first purchase is so special for us.',
    discount: 'USE CODE: "KOZA10"',
    author: 'JAWAID ALAM ANSARI',
    date: 'September 07, 2016',
    category: 'Offers and Discounts',
    comments: 0,
    image: 'https://i.etsystatic.com/46094302/r/il/267345/8611484318/il_794xN.8611484318_dzte.jpg',
  },
  {
    id: 2,
    title: 'How to Care for Your Leather Jacket: A Master Tailor’s Guide',
    excerpt: 'A well-cared-for leather jacket gets better with age. Here is our step-by-step guide to cleaning, conditioning, and storing your lambskin piece.',
    author: 'ARIES TEAM',
    date: 'October 15, 2026',
    category: 'Leather Care',
    comments: 2,
    image: 'https://i.etsystatic.com/46094302/r/il/5fadc9/8412332382/il_794xN.8412332382_faii.jpg',
  },
]

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All')

  return (
    <div className="bg-bone min-h-screen pb-24 text-ink">
      
      {/* Page Header */}
      <section className="border-b border-line bg-ivory py-16 md:py-24">
        <Container>
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-oxblood">Journal</p>
          </Reveal>
          <h1 className="mt-4 font-display text-5xl tracking-tight text-ink md:text-7xl">
            Offers & Stories
          </h1>
        </Container>
      </section>

      <Container className="mt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* ================= LEFT SIDEBAR ================= */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-28 space-y-10">
              
              {/* Search */}
              <div>
                <form className="relative border-b border-ink/30 pb-2 transition-colors focus-within:border-ink">
                  <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
                  />
                  <button type="submit" className="absolute right-0 top-0 text-ink hover:text-oxblood">
                    <Search size={16} />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <h3 className="border-b border-line pb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">Categories</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <button 
                      onClick={() => setActiveCategory('All')}
                      className={`text-sm transition-colors hover:text-oxblood ${activeCategory === 'All' ? 'font-medium text-oxblood' : 'text-charcoal'}`}
                    >
                      All
                    </button>
                  </li>
                  {SIDEBAR_CATEGORIES.map((cat) => (
                    <li key={cat.name}>
                      <button 
                        onClick={() => setActiveCategory(cat.name)}
                        className={`text-sm transition-colors hover:text-oxblood ${activeCategory === cat.name ? 'font-medium text-oxblood' : 'text-charcoal'}`}
                      >
                        {cat.name} <span className="text-muted">({cat.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Articles */}
              <div>
                <h3 className="border-b border-line pb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">Recent Articles</h3>
                <ul className="mt-4 space-y-4">
                  {RECENT_POSTS.map((post, i) => (
                    <li key={i} className="group cursor-pointer">
                      <p className="text-sm leading-snug text-charcoal transition-colors group-hover:text-oxblood">
                        {post}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Featured Products */}
              <div>
                <h3 className="border-b border-line pb-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink">Featured Products</h3>
                <div className="mt-4 flex flex-col gap-4">
                   <Link to="/products" className="group relative aspect-[4/3] w-full overflow-hidden bg-stone">
                      <SmartImage 
                        src="https://i.etsystatic.com/46094302/r/il/267345/8611484318/il_794xN.8611484318_dzte.jpg" 
                        alt="Featured" 
                        className="h-full w-full"
                        imgClassName="transition-transform duration-700 group-hover:scale-105"
                      />
                   </Link>
                   <p className="text-xs text-muted">The Aries Standard Collection</p>
                </div>
              </div>

            </div>
          </aside>

          {/* ================= MAIN CONTENT ================= */}
          <main className="lg:col-span-8 xl:col-span-9">
            <div className="space-y-16">
              {BLOG_POSTS.map((post, index) => (
                <Reveal key={post.id} delay={index * 0.1}>
                  <article className="group">
                    {/* Post Image */}
                    <Link to={`/blog/${post.id}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-stone">
                      <SmartImage
                        src={post.image}
                        alt={post.title}
                        label={post.title}
                        className="h-full w-full"
                        imgClassName="transition-transform duration-[1200ms] ease-luxe group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
                    </Link>

                    {/* Post Content */}
                    <div className="mt-6">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-oxblood">
                        {post.category}
                      </p>
                      <h2 className="mt-3 font-display text-3xl leading-tight text-ink transition-colors group-hover:text-oxblood md:text-4xl">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h2>
                      
                      {/* Meta Info */}
                      <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                        by <span className="font-medium text-ink uppercase">{post.author}</span> 
                        on {post.date} 
                        <span className="mx-1">•</span> 
                        {post.comments} comments
                      </p>

                      {/* Excerpt */}
                      <div className="mt-5 text-sm leading-relaxed text-charcoal/80">
                        <p>{post.excerpt}</p>
                      </div>

                      {/* Discount Code Highlight (Agar hai) */}
                      {post.discount && (
                        <div className="mt-6 inline-block border border-oxblood bg-oxblood/5 px-4 py-2 text-sm font-medium text-oxblood">
                          {post.discount}
                        </div>
                      )}

                      {/* Read More */}
                      <div className="mt-8">
                        <Link 
                          to={`/blog/${post.id}`} 
                          className="group/btn inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-oxblood"
                        >
                          Read Article
                          <span className="h-px w-6 bg-ink transition-all duration-500 group-hover/btn:w-10 group-hover/btn:bg-oxblood" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            
            {/* Pagination (Optional) */}
            <div className="mt-16 flex items-center justify-center border-t border-line pt-10">
              <span className="text-sm text-muted">Showing 2 of 6 articles</span>
            </div>
          </main>

        </div>
      </Container>
    </div>
  )
}