// Author: Oskari Niskanen
import { useEffect, useState } from 'react'
// Hook to trigger changes based on screen size. Used to hide pagination elements on smaller screens.
export const useMediaQuery = (mediaQuery) => {
  const [match, setMatch] = useState(Boolean(window.matchMedia(mediaQuery).matches))

  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    const handler = () => setMatch(Boolean(mediaQueryList.matches))
    mediaQueryList.addEventListener('change', handler)
    handler()
    return () => mediaQueryList.removeEventListener('change', handler)
  }, [mediaQuery])

  return match
}
