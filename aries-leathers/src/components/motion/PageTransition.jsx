import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import IntroLoader from '../layout/IntroLoader'
import { getPageThemeStyle } from '../../config/pageThemes'

const INTRO_KEY = 'aries_intro_seen'

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

/** Is tab mein intro pehle dikh chuka hai? */
function introAlreadySeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1'
  } catch {
    return false
  }
}

export default function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()
  const [intro, setIntro] = useState(() => !introAlreadySeen())

  // Browser ko purani scroll position yaad rakhne se roko
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  // Naya page screen par aane se PEHLE upar — footer kabhi nahi dikhta
  useLayoutEffect(() => {
    scrollToTop()
  }, [location.pathname])

  // Intro khatam → yaad rakho, taaki is tab mein dobara na aaye
  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* ignore */
    }
    scrollToTop()
    setIntro(false)
  }, [])

  return (
    <>
      {/* Page seedha, bina kisi animation ke */}
      <div key={location.pathname} style={getPageThemeStyle(location.pathname)} className="bg-bone">
        {outlet}
      </div>

      {/* Sirf pehli baar */}
      <AnimatePresence>{intro && <IntroLoader key="intro" onDone={finishIntro} />}</AnimatePresence>
    </>
  )
}