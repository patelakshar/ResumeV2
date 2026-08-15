import { motion } from 'framer-motion'

// A horizontal bar that smoothly animates its width to match a
// percentage value. Used to show scores like the ATS score or match score.
function ProgressBar({ percent, color = 'bg-indigo-600' }) {
  return (
    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-3 rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  )
}

export default ProgressBar
