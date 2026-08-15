import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'
import Skeleton from '../components/Skeleton'

// Page that lists every past resume analysis and job match for the
// logged-in user, newest first.
function History() {
  const [analyses, setAnalyses] = useState([])
  const [jobMatches, setJobMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Runs once when the page loads, to fetch the user's saved history.
  useEffect(() => {
    api
      .get('/history')
      .then((res) => {
        setAnalyses(res.data.analyses)
        setJobMatches(res.data.jobMatches)
      })
      .finally(() => setLoading(false))
  }, [])

  // Opens the Resume Analysis page again for one saved analysis,
  // passing its data along so we don't need a second network request.
  function viewAnalysis(analysis) {
    navigate('/analysis', { state: { analysis } })
  }

  // Asks the backend for the PDF report of one saved analysis, then
  // triggers a normal browser download with the file it sends back.
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Analysis History</h1>

        <h2 className="text-lg font-semibold text-slate-700 mb-3">Resume Analyses</h2>
        {analyses.length === 0 ? (
          <p className="text-slate-500 text-sm mb-8">No resume analyses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {analyses.map((analysis, index) => (
              <AnimatedCard
                key={analysis._id}
                delay={index * 0.05}
                className="p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <p className="text-slate-800 font-medium">
                    {analysis.resumeId?.fileName || 'Resume'}
                  </p>
                  <p className="text-slate-500 text-sm">
                    ATS Score: {analysis.atsScore} / 100 &middot;{' '}
                    {new Date(analysis.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <MotionButton
                    onClick={() => viewAnalysis(analysis)}
                    className="bg-indigo-600 text-white text-sm rounded px-3 py-1 hover:bg-indigo-700"
                  >
                    View
                  </MotionButton>
                  <MotionButton
                    onClick={() => downloadPdf(analysis._id)}
                    className="bg-slate-800 text-white text-sm rounded px-3 py-1 hover:bg-slate-900"
                  >
                    Download PDF
                  </MotionButton>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}

        <h2 className="text-lg font-semibold text-slate-700 mb-3">Job Matches</h2>
        {jobMatches.length === 0 ? (
          <p className="text-slate-500 text-sm">No job matches yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobMatches.map((jobMatch, index) => (
              <AnimatedCard key={jobMatch._id} delay={index * 0.05} className="p-4">
                <p className="text-slate-800 font-medium">
                  {jobMatch.resumeId?.fileName || 'Resume'}
                </p>
                <p className="text-slate-500 text-sm">
                  Match Score: {jobMatch.matchScore} / 10 &middot; {jobMatch.recommendation}{' '}
                  &middot; {new Date(jobMatch.createdAt).toLocaleDateString()}
                </p>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default History
