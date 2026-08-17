import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Same idea as MotionLinkButton: turn react-router's Link into a
// component Framer Motion can animate.
const MotionLink = motion.create(Link)

// Underline goes from invisible (scaleX: 0) to fully visible (scaleX:
// 1). It's defined once here and given to both the link and its
// underline span below, so hovering the link automatically drives the
// underline via Framer Motion's variant propagation (a parent's hover
// state passes down to any child using the same variant names).
const underlineVariants = {
  rest: { scaleX: 0 },
  hover: { scaleX: 1 },
}

// One link in the top navbar. Hovering it fades the text to indigo and
// slides in a thin underline from the left, so the nav feels
// interactive instead of static text.
function NavbarLink({ to, children }) {
  return (
    <MotionLink
      to={to}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative inline-block py-1 text-stone-200 transition-colors hover:text-teal-300"
    >
      {children}
      <motion.span
        variants={underlineVariants}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-teal-300"
      />
    </MotionLink>
  )
}

export default NavbarLink
