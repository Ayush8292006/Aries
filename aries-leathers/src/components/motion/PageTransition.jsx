import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getPageThemeStyle } from '../../config/pageThemes'

const EASE = [0.22, 1, 0.36, 1]

/** Page ko poori tarah upar le jaao — Lenis + browser dono */
function scrollToTop() {
  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true })
    lenis.resize?.()
  }
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

/** Naya page aane ke baad ek baar aur pakka karo */
function scrollToTopAfterPaint() {
  scrollToTop()
  requestAnimationFrame(() => {
    scrollToTop()
    requestAnimationFrame(scrollToTop)
  })
}

/** Har page change par upar daudti oxblood line */
function RouteProgress({ routeKey }) {
  return (
    <motion.div
      key={routeKey}
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] origin-left bg-linear-to-r from-oxblood via-oxblood-light to-gold"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{
        scaleX: [0, 0.7, 1],
        opacity: [1, 1, 0],
        transition: { duration: 1.1, times: [0, 0.55, 1], ease: EASE },
      }}
    />
  )
}

const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.985, filter: 'blur(10px)' },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE },
    // Animation ke baad filter hata do, warna fixed drawers/modals kharab hote hain
    transitionEnd: { filter: 'none' },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    filter: 'blur(6px)',
    transition: { duration: 0.32, ease: [0.4, 0, 1, 1] },
  },
}

export default function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()

  // Browser ko purani scroll position yaad rakhne se roko
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  // Pehli baar site khulne / refresh par bhi upar se
  useLayoutEffect(() => {
    scrollToTopAfterPaint()
  }, [])

  return (
    <>
      <RouteProgress routeKey={location.pathname} />

      <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTopAfterPaint}>
        <motion.div
          key={location.pathname}
          style={{ ...getPageThemeStyle(location.pathname), transformOrigin: '50% 0%' }}
          className="bg-bone"
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </>
  )
}