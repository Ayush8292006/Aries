import { useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import CountryWelcomeModal from './CountryWelcomeModal'
import SmoothScroll from './SmoothScroll'
import CartDrawer from '../cart/CartDrawer'
import PageTransition from '../motion/PageTransition'
import ScrollProgress from '../motion/ScrollProgress'

const AUTH_ROUTES = ['/login', '/signup']

export default function Layout() {
  const { pathname } = useLocation()

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
        {!AUTH_ROUTES.includes(pathname) && <CountryWelcomeModal />}
      </div>
    </MotionConfig>
  )
}