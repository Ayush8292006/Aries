import { MotionConfig } from 'motion/react'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import SmoothScroll from './SmoothScroll'
import CartDrawer from '../cart/CartDrawer'
import PageTransition from '../motion/PageTransition'
import ScrollProgress from '../motion/ScrollProgress'

export default function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <ScrollProgress />
      <div className="flex min-h-screen flex-col">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <PageTransition />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </MotionConfig>
  )
}