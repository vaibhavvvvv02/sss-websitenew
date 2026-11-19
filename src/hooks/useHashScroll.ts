import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to hash element after navigation (e.g. /products#motor)
export function useHashScroll() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    // Small delay to let the page render first
    const timer = setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [hash, pathname])
}
