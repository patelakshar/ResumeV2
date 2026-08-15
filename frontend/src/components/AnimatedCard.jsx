import { motion } from 'framer-motion'

// A white, rounded, shadowed card that fades in and slides up slightly
// as it mounts, instead of just appearing on the screen instantly.
// Pass a `delay` (in seconds) when rendering several cards in a row so
// they animate in one after another instead of all at once.
function AnimatedCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      className={`bg-white rounded-lg shadow-md ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard
