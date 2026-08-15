import { motion } from 'framer-motion'

// A drop-in replacement for a plain <button> that adds small, tasteful
// motion: it grows slightly and gains a soft shadow on hover, and
// presses down a little on click. Disabled buttons skip the animation
// entirely so they don't look interactive when they can't be clicked.
// Every prop (onClick, type, disabled, className, etc.) passes straight
// through to the underlying button, so it's used exactly like <button>.
function MotionButton({ className = '', disabled = false, children, ...props }) {
  return (
    <motion.button
      whileHover={
        disabled
          ? undefined
          : { scale: 1.03, boxShadow: '0 10px 25px -8px rgba(30, 41, 59, 0.35)' }
      }
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default MotionButton
