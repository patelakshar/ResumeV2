import { motion } from 'framer-motion'

// Reusable animation variants for consistent page transitions and element animations
// Usage: import { containerVariants, itemVariants, AnimatedPageHeader, etc. } from './components/PageAnimations'

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const sectionHeaderVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

export const springScale = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
}

// Score based color utilities
export const getScoreColorClass = (score, type = 'ats') => {
  if (type === 'ats') {
    if (score >= 80) return 'bg-gradient-to-r from-teal-500 to-emerald-500'
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (score >= 40) return 'bg-gradient-to-r from-amber-500 to-orange-500'
    return 'bg-gradient-to-r from-rose-500 to-red-500'
  }
  // For match scores (out of 10)
  if (score >= 8) return 'bg-gradient-to-r from-purple-500 to-violet-500'
  if (score >= 6) return 'bg-gradient-to-r from-blue-500 to-indigo-500'
  if (score >= 4) return 'bg-gradient-to-r from-amber-500 to-yellow-500'
  return 'bg-gradient-to-r from-rose-500 to-pink-500'
}

// Format date consistently
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date with time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Motion components with consistent styling
export const AnimatedPageHeader = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

export const AnimatedSection = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
)

export const AnimatedText = ({ children, delay = 0, className = '' }) => (
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.p>
)

export const AnimatedScoreBadge = ({ score, type = 'ats', className = '' }) => {
  const colorClass = getScoreColorClass(score, type)
  const displayScore = type === 'ats' ? `${score || 0}/100` : `${score || 0}/10`
  
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`px-3 py-1 rounded-full text-white text-sm font-medium ${colorClass} ${className}`}
    >
      {displayScore}
    </motion.span>
  )
}

export const ScoreIndicator = ({ score, type = 'ats', label = '', className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
    className={`flex items-center gap-2 ${className}`}
  >
    {label && <span className="text-sm text-slate-600">{label}</span>}
    <AnimatedScoreBadge score={score} type={type} />
  </motion.div>
)
