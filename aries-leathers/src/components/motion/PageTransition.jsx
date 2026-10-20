import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { getPageThemeStyle } from '../../config/pageThemes'

function scrollToTop() {
  if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export default function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={scrollToTop}>
      <motion.div
        key={location.pathname}
        style={getPageThemeStyle(location.pathname)}
        className="bg-bone"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeOut' } }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}