import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AnimatedCounter from '../components/AnimatedCounter'
import AnimatedCard from '../components/AnimatedCard'
import MotionLinkButton from '../components/MotionLinkButton'
import Skeleton from '../components/Skeleton'

// Main page a user sees after logging in: quick stats about their
// activity, plus a list of their most recent analyses and job matches.
function Dashboard() {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState([])
  const [jobMatches, setJobMatches] = useState([])
  const [resumeCount, setResumeCount] = useState(0)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1">Welcome, {user?.name}</h1>
        <p className="text-slate-500 mb-6">Here's an overview of your resume activity.</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <AnimatedCard className="p-5 text-center" delay={0}>
              <p className="text-3xl font-bold text-indigo-600">
                <AnimatedCounter value={resumeCount} />
              </p>
              <p className="text-slate-500 text-sm mt-1">Resumes Uploaded</p>
            </AnimatedCard>
            <AnimatedCard className="p-5 text-center" delay={0.1}>
              <p className="text-3xl font-bold text-indigo-600">
                <AnimatedCounter value={getAverageAtsScore()} />
              </p>
              <p className="text-slate-500 text-sm mt-1">Average ATS Score</p>
            </AnimatedCard>
            <AnimatedCard className="p-5 text-center" delay={0.2}>
              <p className="text-3xl font-bold text-indigo-600">
                <AnimatedCounter value={jobMatches.length} />
              </p>
              <p className="text-slate-500 text-sm mt-1">Job Matches Run</p>
            </AnimatedCard>
          </div>
        )}

        <div className="flex gap-3 mb-8 flex-wrap">
          <MotionLinkButton
            to="/upload"
            className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
          >
            Upload a resume
          </MotionLinkButton>
          <MotionLinkButton
            to="/jobmatch"
            className="bg-slate-800 text-white rounded px-4 py-2 hover:bg-slate-900"
          >
            Match against a job
          </MotionLinkButton>
        </div>

        <AnimatedCard className="p-6" delay={0.3}>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity</h2>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-slate-400 text-sm">
              No activity yet. Upload a resume to get started.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentActivity.map((item, index) => (
                <li key={index} className="py-2 flex items-center justify-between gap-3">
                  <span className="text-slate-700 text-sm">{item.label}</span>
                  <span className="text-slate-400 text-xs whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AnimatedCard>
      </div>
    </div>
  )
}

export default Dashboard
