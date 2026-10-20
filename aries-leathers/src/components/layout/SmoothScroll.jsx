import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      anchors: true,
      // Dropdown lists / popups ke andar normal scroll
      prevent: (node) => !!node.closest?.('[data-lenis-prevent], [role="listbox"], [role="dialog"]'),
    })
    window.__lenis = lenis

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Jab koi modal/drawer body ko lock kare, Lenis bhi ruk jaye
    const syncLock = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start())
    syncLock()
    const observer = new MutationObserver(syncLock)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return null
}