import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

// Shows a number that smoothly counts up from 0 to its target value,
// instead of just appearing on the screen. Used for dashboard stats
// and scores.
function AnimatedCounter({ value, duration = 1 }) {
  const [displayValue, setDisplayValue] = useState(0)

  // Runs whenever the target value changes, and animates displayValue
  // from 0 up to that value over the given duration.
  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [value, duration])

  return <span>{displayValue}</span>
}

export default AnimatedCounter
