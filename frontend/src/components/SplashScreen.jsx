import { motion } from 'framer-motion'

// Shown briefly when the app first loads. Fades and scales the logo
// text in, then fades in a small spinning loader underneath it.
function SplashScreen() {
  return (
    <motion.div
      className="min-h-screen bg-slate-900 flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-3xl sm:text-4xl font-semibold text-white tracking-wide"
      >
        Shivangi ✕ KPGU
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-6 w-8 h-8 border-4 border-slate-600 border-t-indigo-500 rounded-full animate-spin"
      />
    </motion.div>
  )
}

export default SplashScreen
