import { useEffect, useRef, useState } from 'react'

// Small animated counter that parses values like "5,000+", "12k+", "1.2M" and
// animates from 0 to the numeric target, formatting with thousands separators
// and keeping a trailing plus sign if present.
export default function StatCounter({ target, duration = 1400 }) {
  const [display, setDisplay] = useState('0')
  const rafRef = useRef(null)
  const startRef = useRef(null)

  // parse target string/number into numeric value and trailing plus marker
  function parseTarget(t) {
    if (typeof t === 'number') return { value: t, plus: false }
    const s = String(t).trim()
    const plus = s.endsWith('+')
    let core = s.replace(/\+$/, '').replace(/,/g, '').toLowerCase()
    let multiplier = 1
    if (core.endsWith('k')) {
      multiplier = 1000
      core = core.replace(/k$/i, '')
    } else if (core.endsWith('m')) {
      multiplier = 1000000
      core = core.replace(/m$/i, '')
    }
    const n = parseFloat(core)
    const value = Number.isFinite(n) ? Math.round(n * multiplier) : 0
    return { value, plus }
  }

  function formatNumber(n) {
    return n.toLocaleString()
  }

  useEffect(() => {
    const { value, plus } = parseTarget(target)
    const start = 0
    const end = value
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    cancelAnimationFrame(rafRef.current)
    startRef.current = null

    function step(timestamp) {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current
      const progress = Math.min(1, elapsed / duration)
      const eased = easeOut(progress)
      const current = Math.round(start + (end - start) * eased)
      setDisplay(formatNumber(current) + (plus ? '+' : ''))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    // handle zero target immediately (use rAF to avoid sync setState inside effect)
    if (end === 0) {
      rafRef.current = requestAnimationFrame(() => setDisplay('0' + (plus ? '+' : '')))
      return () => cancelAnimationFrame(rafRef.current)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])


  return display
}

