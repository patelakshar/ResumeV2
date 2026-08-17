import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedCard from '../components/AnimatedCard'
import MotionLinkButton from '../components/MotionLinkButton'
import Skeleton from '../components/Skeleton'
import { formatDate } from '../components/PageAnimations'

// Main page a user sees after logging in: quick stats about their
// activity, plus a list of their most recent analyses and job matches.
function Dashboard() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [jobMatches, setJobMatches] = useState([])
  const [resumeCount, setResumeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Runs once when the dashboard loads, to fetch the numbers and
  // recent activity we need to show.
  useEffect(() => {
    Promise.all([api.get('/history'), api.get('/resume')])
      .then(([historyRes, resumeRes]) => {
        setAnalyses(historyRes.data.analyses)
        setJobMatches(historyRes.data.jobMatches)
        setResumeCount(resumeRes.data.resumes.length)
      })
      .finally(() => setLoading(false))
  }, [])

  // Works out the average ATS score across every saved analysis, or 0
  // if there aren't any yet.
  function getAverageAtsScore() {
    if (analyses.length === 0) return 0
    const total = analyses.reduce((sum, analysis) => sum + analysis.atsScore, 0)
    return Math.round(total / analyses.length)
  }

  // Get average match score
  function getAverageMatchScore() {
    if (jobMatches.length === 0) return 0
    const total = jobMatches.reduce((sum, match) => sum + match.matchScore, 0)
    return Math.round(total / jobMatches.length)
  }

  // Combines analyses and job matches into one list, sorted by date,
  // so we can show the most recent activity regardless of type.
  function getRecentActivity() {
    const analysisItems = analyses.map((a) => ({
      date: a.createdAt,
      label: `Resume analyzed (ATS score ${a.atsScore})`,
    }))
    const jobMatchItems = jobMatches.map((m) => ({
      date: m.createdAt,
      label: `Job match (${m.matchScore}/10 - ${m.recommendation})`,
    }))

    return [...analysisItems, ...jobMatchItems]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
  }

  const recentActivity = getRecentActivity()

  // Get score color based on value
  const getScoreColor = (score, type = 'ats') => {
    if (type === 'ats') {
      if (score >= 80) return 'bg-gradient-to-r from-teal-500 to-emerald-500'
      if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      if (score >= 40) return 'bg-gradient-to-r from-amber-500 to-orange-500'
      return 'bg-gradient-to-r from-rose-500 to-red-500'
    }
    if (score >= 8) return 'bg-gradient-to-r from-purple-500 to-violet-500'
    if (score >= 6) return 'bg-gradient-to-r from-blue-500 to-indigo-500'
    if (score >= 4) return 'bg-gradient-to-r from-amber-500 to-yellow-500'
    return 'bg-gradient-to-r from-rose-500 to-pink-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <AnimatedCard delay={0} className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-700">
              <AnimatedCounter value={resumeCount} />
            </p>
            <p className="text-sm text-slate-600 mt-1">Resumes Uploaded</p>
          </AnimatedCard>
          <AnimatedCard delay={0.1} className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">
              <AnimatedCounter value={getAverageAtsScore()} />
            </p>
            <p className="text-sm text-slate-600 mt-1">Avg ATS Score</p>
          </AnimatedCard>
          <AnimatedCard delay={0.2} className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">
              <AnimatedCounter value={getAverageMatchScore()} />
            </p>
            <p className="text-sm text-slate-600 mt-1">Avg Match Score</p>
          </AnimatedCard>
          <AnimatedCard delay={0.3} className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-700">
              <AnimatedCounter value={jobMatches.length} />
            </p>
            <p className="text-sm text-slate-600 mt-1">Job Matches Run</p>
          </AnimatedCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-3 mb-10 flex-wrap"
        >
          <MotionLinkButton
            to="/upload"
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
          >
            + Upload Resume
          </MotionLinkButton>
          <MotionLinkButton
            to="/jobmatch"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            Match Against Job
          </MotionLinkButton>
          <MotionLinkButton
            to="/history"
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50"
          >
            View History
          </MotionLinkButton>
          <MotionLinkButton
            to="/profile"
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50"
          >
            My Profile
          </MotionLinkButton>
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-purple-500" />
            <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
            <span className="text-sm text-slate-500">{recentActivity.length} total</span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white/90 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center"
            >
              <motion.div
                className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
              >
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              <p className="text-slate-500 mb-4">No activity yet. Get started by uploading a resume!</p>
              <MotionLinkButton
                to="/upload"
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg"
              >
                Upload Your First Resume
              </MotionLinkButton>
            </motion.div>
          ) : (
            <AnimatedCard className="p-6">
              <ul className="divide-y divide-slate-100">
                {recentActivity.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <span className="text-slate-700 text-sm font-medium">{item.label}</span>
                    <span className="text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(item.date)}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </AnimatedCard>
          )}
        </motion.div>

        {/* Quick Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
          >
            <AnimatedCard delay={0.5} className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Last Resume Analysis
              </h2>
              {analyses.length === 0 ? (
                <p className="text-slate-500 text-sm">No analyses yet.</p>
              ) : (
                <div>
                  <p className="text-slate-600 text-sm mb-2">
                    Last analyzed: {formatDate(analyses[0].createdAt)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">ATS Score:</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getScoreColor(analyses[0].atsScore)}`}>
                      {analyses[0].atsScore || 0}/100
                    </span>
                  </div>
                  {analyses[0].keywordsMatched && (
                    <p className="text-xs text-slate-500 mt-2">
                      Keywords matched: {analyses[0].keywordsMatched}
                    </p>
                  )}
                </div>
              )}
            </AnimatedCard>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <AnimatedCard delay={0.6} className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Last Job Match
              </h2>
              {jobMatches.length === 0 ? (
                <p className="text-slate-500 text-sm">No job matches yet.</p>
              ) : (
                <div>
                  <p className="text-slate-600 text-sm mb-2">
                    Last matched: {formatDate(jobMatches[0].createdAt)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Match Score:</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getScoreColor(jobMatches[0].matchScore, 'match')}`}>
                      {jobMatches[0].matchScore || 0}/10
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">
                    Recommendation: {jobMatches[0].recommendation}
                  </p>
                </div>
              )}
            </AnimatedCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
