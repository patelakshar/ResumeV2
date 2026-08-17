import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import MotionLinkButton from '../components/MotionLinkButton'

// Public landing page. Introduces the product and links visitors to
// register or log in.
function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 flex flex-col">
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl font-semibold text-gradient-to-r from-teal-700 to-purple-700 bg-clip-text text-transparent"
        >
          Resume Analyser by Shivangi Parmar
        </motion.span>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-3"
        >
          <Link
            to="/login"
            className="text-slate-600 hover:text-gradient-to-r from-teal-600 to-purple-600 transition-colors self-center"
          >
            Log in
          </Link>
          <MotionLinkButton
            to="/register"
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
          >
            Get started
          </MotionLinkButton>
        </motion.div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 px-4 sm:px-6 lg:px-8 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-teal-700"
            >
              AI Resume Studio V2
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-4xl sm:text-6xl font-bold text-slate-900 mb-5 leading-tight"
            >
              Turn every job post into a sharper application plan.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="text-slate-600 text-lg mb-8 max-w-2xl"
            >
              Analyze your resume, match it to roles, generate the documents, and track each
              application without losing the thread.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
              className="flex flex-wrap gap-3"
            >
              <MotionLinkButton
                to="/register"
                className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg text-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
              >
                Build my plan
              </MotionLinkButton>
              <MotionLinkButton
                to="/login"
                className="inline-block border border-slate-300 bg-white/80 text-slate-800 px-6 py-3 rounded-lg text-lg hover:border-teal-500"
              >
                I have an account
              </MotionLinkButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: 0.15 }}
            className="rounded-xl border border-slate-200 bg-white/85 p-5 shadow-[0_24px_60px_-42px_rgba(28,25,23,0.7)]"
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <p className="text-sm text-slate-500">Today's application board</p>
                <p className="text-xl font-semibold text-slate-900">Frontend Engineer</p>
              </div>
              <span className="rounded-full bg-gradient-to-r from-teal-100 to-teal-200 px-3 py-1 text-sm font-semibold text-teal-800">
                8/10 match
              </span>
            </div>
            <div className="grid gap-3">
              {[
                ['Resume rewrite', 'Ready to tailor'],
                ['Cover letter', 'Draft generated'],
                ['Outreach email', 'Short and human'],
                ['Tracker status', 'Interviewing'],
              ].map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-slate-900">{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="text-center text-slate-500 text-sm py-6">
        Resume Analyser by Shivangi Parmar
      </footer>
    </div>
  )
}

export default Home
