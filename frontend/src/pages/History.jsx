import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'
import Skeleton from '../components/Skeleton'

// Animation variants for the History page
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
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

const sectionHeaderVariants = {
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

// Enhanced History page with better structure and animations
function History() {
  const [analyses, setAnalyses] = useState([])
  const [jobMatches, setJobMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('analyses')
  const navigate = useNavigate()

  // Fetch history data
  useEffect(() => {
    api
      .get('/history')
      .then((res) => {
        setAnalyses(res.data.analyses)
        setJobMatches(res.data.jobMatches)
      })
      .finally(() => setLoading(false))
  }, [])

  // Navigation handlers
  function viewAnalysis(analysis) {
    navigate('/analysis', { state: { analysis } })
  }

  async function downloadPdf(analysisId) {
    const res = await api.get(`/history/${analysisId}/pdf`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `resume-analysis-${analysisId}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  // Format date with better readability
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get ATS score color based on value
  const getATSScoreColor = (score) => {
    if (score >= 80) return 'bg-gradient-to-r from-teal-500 to-emerald-500'
    if (score >= 60) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (score >= 40) return 'bg-gradient-to-r from-amber-500 to-orange-500'
    return 'bg-gradient-to-r from-rose-500 to-red-500'
  }

  // Get match score color
  const getMatchScoreColor = (score) => {
    if (score >= 8) return 'bg-gradient-to-r from-purple-500 to-violet-500'
    if (score >= 6) return 'bg-gradient-to-r from-blue-500 to-indigo-500'
    if (score >= 4) return 'bg-gradient-to-r from-amber-500 to-yellow-500'
    return 'bg-gradient-to-r from-rose-500 to-pink-500'
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          <AnimatedCard delay={0} className="p-4 text-center">
            <p className="text-2xl font-bold text-teal-700">{analyses.length}</p>
            <p className="text-sm text-slate-600 mt-1">Resume Analyses</p>
          </AnimatedCard>
          <AnimatedCard delay={0.1} className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{jobMatches.length}</p>
            <p className="text-sm text-slate-600 mt-1">Job Matches</p>
          </AnimatedCard>
          <AnimatedCard delay={0.2} className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">
              {Math.round(analyses.reduce((sum, a) => sum + (a.atsScore || 0), 0) / Math.max(analyses.length, 1) || 0)}
            </p>
            <p className="text-sm text-slate-600 mt-1">Avg ATS Score</p>
          </AnimatedCard>
          <AnimatedCard delay={0.3} className="p-4 text-center">
            <p className="text-2xl font-bold text-rose-700">
              {Math.round(jobMatches.reduce((sum, j) => sum + (j.matchScore || 0), 0) / Math.max(jobMatches.length, 1) || 0)}
            </p>
            <p className="text-sm text-slate-600 mt-1">Avg Match Score</p>
          </AnimatedCard>
        </motion.div>

        {/* Section Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-2 mb-6">
            <MotionButton
              onClick={() => setActiveSection('analyses')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === 'analyses'
                  ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Resume Analyses
            </MotionButton>
            <MotionButton
              onClick={() => setActiveSection('matches')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeSection === 'matches'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Job Matches
            </MotionButton>
          </div>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Resume Analyses Section */}
          {activeSection === 'analyses' && (
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                variants={sectionHeaderVariants}
                className="flex items-center gap-3 mb-6"
              >
                <div className={`w-3 h-3 rounded-full ${getATSScoreColor(85)}`} />
                <h2 className="text-xl font-semibold text-slate-800">Resume Analyses</h2>
                <span className="text-sm text-slate-500">{analyses.length} total</span>
              </motion.div>

              {analyses.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/90 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center"
                >
                  <motion.div
                    className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </motion.div>
                  <p className="text-slate-500 mb-4">No resume analyses yet.</p>
                  <MotionButton
                    onClick={() => navigate('/upload')}
                    className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg"
                  >
                    Start New Analysis
                  </MotionButton>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {analyses.map((analysis, index) => (
                    <motion.div variants={itemVariants} key={analysis._id}>
                      <AnimatedCard
                        delay={index * 0.05}
                        className="p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="text-slate-800 font-semibold text-lg"
                          >
                            {analysis.resumeId?.fileName || 'Resume Analysis'}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                            className="text-slate-500 text-sm mt-1"
                          >
                            {formatDate(analysis.createdAt)}
                          </motion.p>
                        </div>

                        <div className="flex items-center gap-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.05 + 0.4, type: 'spring', stiffness: 300, damping: 20 }}
                            className="flex-1"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">ATS Score:</span>
                              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getATSScoreColor(analysis.atsScore)}`}>
                                {analysis.atsScore || 0}/100
                              </span>
                            </div>
                            {analysis.keywordsMatched && (
                              <p className="text-xs text-slate-500 mt-2">
                                Keywords matched: {analysis.keywordsMatched}
                              </p>
                            )}
                          </motion.div>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.5 }}
                          className="flex gap-3 pt-2"
                        >
                          <MotionButton
                            onClick={() => viewAnalysis(analysis)}
                            className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white text-sm py-2 rounded-lg shadow-md shadow-teal-500/30"
                          >
                            View Details
                          </MotionButton>
                          <MotionButton
                            onClick={() => downloadPdf(analysis._id)}
                            className="flex-1 bg-gradient-to-r from-slate-700 to-slate-800 text-white text-sm py-2 rounded-lg shadow-md shadow-slate-500/30"
                          >
                            PDF Report
                          </MotionButton>
                        </motion.div>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Job Matches Section */}
          {activeSection === 'matches' && (
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                variants={sectionHeaderVariants}
                className="flex items-center gap-3 mb-6"
              >
                <div className={`w-3 h-3 rounded-full ${getMatchScoreColor(8)}`} />
                <h2 className="text-xl font-semibold text-slate-800">Job Matches</h2>
                <span className="text-sm text-slate-500">{jobMatches.length} total</span>
              </motion.div>

              {jobMatches.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="bg-white/90 rounded-xl border-2 border-dashed border-slate-200 p-12 text-center"
                >
                  <motion.div
                    className="mx-auto w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <p className="text-slate-500 mb-4">No job matches yet.</p>
                  <MotionButton
                    onClick={() => navigate('/jobmatch')}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Find Job Matches
                  </MotionButton>
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {jobMatches.map((jobMatch, index) => (
                    <motion.div variants={itemVariants} key={jobMatch._id}>
                      <AnimatedCard
                        delay={index * 0.05}
                        className="p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300"
                      >
                        <div>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="text-slate-800 font-semibold text-lg"
                          >
                            {jobMatch.resumeId?.fileName || 'Job Match'}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.3 }}
                            className="text-slate-500 text-sm mt-1"
                          >
                            {formatDate(jobMatch.createdAt)}
                          </motion.p>
                        </div>

                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.4, type: 'spring', stiffness: 300, damping: 20 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-sm text-slate-600">Match Score:</span>
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchScoreColor(jobMatch.matchScore)}`}>
                            {jobMatch.matchScore || 0}/10
                          </span>
                        </motion.div>

                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.5 }}
                          className="text-sm text-slate-600"
                        >
                          <span className="font-medium">Recommendation:</span> {jobMatch.recommendation}
                        </motion.p>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.6 }}
                          className="flex flex-wrap gap-2 pt-2"
                        >
                          {jobMatch.rewrittenResume && (
                            <span className="rounded-full bg-gradient-to-r from-teal-100 to-teal-200 px-3 py-1 text-xs text-teal-700 font-medium">
                              Resume Rewrite
                            </span>
                          )}
                          {jobMatch.coverLetter && (
                            <span className="rounded-full bg-gradient-to-r from-purple-100 to-purple-200 px-3 py-1 text-xs text-purple-700 font-medium">
                              Cover Letter
                            </span>
                          )}
                          {jobMatch.outreachEmail && (
                            <span className="rounded-full bg-gradient-to-r from-amber-100 to-amber-200 px-3 py-1 text-xs text-amber-700 font-medium">
                              Outreach Email
                            </span>
                          )}
                          {jobMatch.interviewPrep && (
                            <span className="rounded-full bg-gradient-to-r from-rose-100 to-rose-200 px-3 py-1 text-xs text-rose-700 font-medium">
                              Interview Prep
                            </span>
                          )}
                          {jobMatch.improvedBullets && jobMatch.improvedBullets.length > 0 && (
                            <span className="rounded-full bg-gradient-to-r from-blue-100 to-blue-200 px-3 py-1 text-xs text-blue-700 font-medium">
                              Bullet Points
                            </span>
                          )}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 + 0.7 }}
                        >
                          {jobMatch.jobDescription && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                              Job: {jobMatch.jobDescription.slice(0, 100)}...
                            </p>
                          )}
                        </motion.div>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default History
