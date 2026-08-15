import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// A react-router Link, upgraded with Framer Motion so it can be used as
// a motion component (motion.create wraps any component, not just
// plain HTML tags like "div" or "button").
const MotionLink = motion.create(Link)

// A router <Link> that is styled and animated like a button: it grows
// slightly and gains a soft shadow on hover, and presses down a little
// on click. Used for call-to-action links (e.g. "Get started") so they
// feel just as alive as real <button> elements.
function MotionLinkButton({ className = '', children, ...props }) {
  return (
    <MotionLink
      whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -8px rgba(30, 41, 59, 0.35)' }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={className}
      {...props}
    >
      {children}
    </MotionLink>
  )
}

export default MotionLinkButton
