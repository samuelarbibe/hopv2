import { useEffect, useState, useMemo } from 'react'

export default function useOnScreen(ref, options = {}) {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting),
    options
  ), [options])

  useEffect(() => {
    observer.observe(ref.current)
    return () => { observer.disconnect() }
  }, [observer, ref])

  return isIntersecting
}