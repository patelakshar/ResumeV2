import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MotionLinkButton from '../components/MotionLinkButton'

// Public landing page. Introduces the product and links visitors to
// register or log in.
function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <span className="text-xl font-semibold text-slate-800">Resume Analyzer</span>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="text-slate-700 hover:text-indigo-600 transition-colors self-center"
          >
            Log in
          </Link>
          <MotionLinkButton
            to="/register"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Get started
          </MotionLinkButton>
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
          >
            Land more interviews with an AI-powered resume review
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            className="text-slate-600 text-lg mb-8"
          >
            Upload your resume, get an instant ATS score, match it against any job
            description, and see exactly what to improve.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            <MotionLinkButton
              to="/register"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-indigo-700"
            >
              Analyze my resume
            </MotionLinkButton>
          </motion.div>
        </div>
      </main>

      <footer className="text-center text-slate-400 text-sm py-6">Shivangi ✕ KPGU</footer>
    </div>
  )
}

export default Home
