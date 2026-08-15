import { useState, useEffect } from 'react'
import api from '../api/axios'
import ProgressBar from '../components/ProgressBar'
import Skeleton from '../components/Skeleton'
import GeneratedTextBlock from '../components/GeneratedTextBlock'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'

// Page where a logged-in user pastes a job description and picks one
// of their uploaded resumes to compare it against. After matching,
// they can also generate a tailored resume rewrite, a cover letter,
// and a cold outreach email for that same job.
function JobMatching() {
  const [resumes, setResumes] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const [showRewriteForm, setShowRewriteForm] = useState(false)
  const [skillChecks, setSkillChecks] = useState({})
  const [extraSkills, setExtraSkills] = useState('')
  const [rewriting, setRewriting] = useState(false)
  const [rewriteError, setRewriteError] = useState('')
  const [rewrittenResume, setRewrittenResume] = useState('')

  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false)
  const [coverLetterError, setCoverLetterError] = useState('')
  const [coverLetter, setCoverLetter] = useState('')

  const [generatingOutreach, setGeneratingOutreach] = useState(false)
  const [outreachError, setOutreachError] = useState('')
  const [outreachEmail, setOutreachEmail] = useState('')

  // Runs once when the page loads, to fetch the list of resumes the
  // user can choose from.
  useEffect(() => {
    api
      .get('/resume')
      .then((res) => {
        setResumes(res.data.resumes)
        if (res.data.resumes.length > 0) {
          setSelectedResumeId(res.data.resumes[0]._id)
        }
      })
      .finally(() => setLoadingResumes(false))
  }, [])

  // Clears out anything generated for a previous match result, so old
  // rewrites/cover letters don't linger after running a new match.
  function resetGeneratedContent() {
    setShowRewriteForm(false)
    setSkillChecks({})
    setExtraSkills('')
    setRewrittenResume('')
    setRewriteError('')
    setCoverLetter('')
    setCoverLetterError('')
    setOutreachEmail('')
    setOutreachError('')
  }

  // Sends the selected resume + pasted job description to the backend
  // and shows the match result Gemini sends back.
  async function handleMatch(e) {
    e.preventDefault()
    setError('')
    setResult(null)
    resetGeneratedContent()

    if (!selectedResumeId) {
      setError('Please upload a resume first')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please paste a job description')
      return
    }

    setMatching(true)

    try {
      const res = await api.post(`/jobmatch/${selectedResumeId}`, { jobDescription })
      setResult(res.data.jobMatch)

      // Pre-check every missing skill so the rewrite form starts with
      // all of them selected; the user can uncheck ones that don't apply.
      const initialChecks = {}
      res.data.jobMatch.missingSkillsForJob.forEach((skill) => {
        initialChecks[skill] = true
      })
      setSkillChecks(initialChecks)
    } catch (err) {
      setError(err.response?.data?.message || 'Job matching failed')
    } finally {
      setMatching(false)
    }
  }

  // Flips one skill checkbox on or off in the rewrite form.
  function toggleSkillCheck(skill) {
    setSkillChecks((prev) => ({ ...prev, [skill]: !prev[skill] }))
  }

  // Sends the checked skills (plus any extra skills typed in) to the
  // backend so Gemini can rewrite the resume for this job.
  async function handleRewriteSubmit(e) {
    e.preventDefault()
    setRewriteError('')
    setRewrittenResume('')
    setRewriting(true)

    const checkedSkills = Object.keys(skillChecks).filter((skill) => skillChecks[skill])
    const typedSkills = extraSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0)
    const additionalSkills = [...checkedSkills, ...typedSkills]

    try {
      const res = await api.post(`/jobmatch/${result._id}/rewrite`, { additionalSkills })
      setRewrittenResume(res.data.rewrittenResume)
    } catch (err) {
      setRewriteError(err.response?.data?.message || 'Could not rewrite the resume')
    } finally {
      setRewriting(false)
    }
  }

  // Asks the backend to generate a tailored cover letter for this
  // resume + job description.
  async function handleGenerateCoverLetter() {
    setCoverLetterError('')
    setGeneratingCoverLetter(true)

    try {
      const res = await api.post(`/jobmatch/${result._id}/cover-letter`)
      setCoverLetter(res.data.coverLetter)
    } catch (err) {
      setCoverLetterError(err.response?.data?.message || 'Could not generate the cover letter')
    } finally {
      setGeneratingCoverLetter(false)
    }
  }

  // Asks the backend to generate a short cold outreach email for this
  // resume + job description.
  async function handleGenerateOutreach() {
    setOutreachError('')
    setGeneratingOutreach(true)

    try {
      const res = await api.post(`/jobmatch/${result._id}/outreach-email`)
      setOutreachEmail(res.data.outreachEmail)
    } catch (err) {
      setOutreachError(err.response?.data?.message || 'Could not generate the outreach email')
    } finally {
      setGeneratingOutreach(false)
    }
  }

  // Picks a color for the recommendation badge so "Apply" looks
  // positive and "Not a fit" looks negative at a glance.
  function recommendationColor(recommendation) {
    if (recommendation === 'Apply') return 'bg-green-100 text-green-800'
    if (recommendation === 'Improve first') return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-6">Job Matching</h1>

        {/* Two columns on large screens: the match form stays on the
            left, and every result/rewrite/generated block that follows
            lives on the right, so the page fills wide viewports instead
            of stacking everything in one narrow column. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <AnimatedCard className="p-6">
            <form onSubmit={handleMatch}>
              <label className="block text-sm text-slate-600 mb-1">Resume</label>
              {loadingResumes ? (
                <Skeleton className="h-10 w-full mb-4" />
              ) : resumes.length === 0 ? (
                <p className="text-slate-500 text-sm mb-4">
                  You haven't uploaded a resume yet. Upload one first.
                </p>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-2 mb-4"
                >
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.fileName}
                    </option>
                  ))}
                </select>
              )}

              <label className="block text-sm text-slate-600 mb-1">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full border border-slate-300 rounded px-3 py-2 mb-4"
                placeholder="Paste the job description here..."
              />

              {error && (
                <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</div>
              )}

              <MotionButton
                type="submit"
                disabled={matching}
                className="w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {matching ? 'Matching... (this can take a few seconds)' : 'Match Resume to Job'}
              </MotionButton>
            </form>
          </AnimatedCard>

          <div className="space-y-6">
            {result && (
              <AnimatedCard className="p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Match Result</h2>

                <p className="text-slate-600 mb-1">Match Score: {result.matchScore} / 10</p>
                <ProgressBar percent={result.matchScore * 10} />

                <span
                  className={`inline-block mt-4 mb-4 px-3 py-1 rounded-full text-sm font-medium ${recommendationColor(
                    result.recommendation
                  )}`}
                >
                  {result.recommendation}
                </span>

                {result.verdict && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                    <p className="text-lg font-semibold text-indigo-800">{result.verdict}</p>
                    {result.verdictReasons && result.verdictReasons.length > 0 && (
                      <ul className="list-disc list-inside text-indigo-700 text-sm mt-2 space-y-1">
                        {result.verdictReasons.map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <p className="text-slate-700 font-medium mb-1">Expected Salary Range</p>
                <p className="text-slate-600 mb-4">{result.expectedSalaryRange}</p>

                <p className="text-slate-700 font-medium mb-1">Missing Skills For This Job</p>
                {result.missingSkillsForJob && result.missingSkillsForJob.length > 0 ? (
                  <ul className="list-disc list-inside text-slate-600 text-sm space-y-1 mb-4">
                    {result.missingSkillsForJob.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-sm mb-4">None</p>
                )}

                <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100">
                  <MotionButton
                    onClick={() => setShowRewriteForm((prev) => !prev)}
                    className="bg-indigo-600 text-white text-sm rounded px-3 py-2 hover:bg-indigo-700 mt-4"
                  >
                    Rewrite for this job
                  </MotionButton>
                  <MotionButton
                    onClick={handleGenerateCoverLetter}
                    disabled={generatingCoverLetter}
                    className="bg-slate-800 text-white text-sm rounded px-3 py-2 hover:bg-slate-900 mt-4 disabled:opacity-50"
                  >
                    {generatingCoverLetter ? 'Generating...' : 'Generate Cover Letter'}
                  </MotionButton>
                  <MotionButton
                    onClick={handleGenerateOutreach}
                    disabled={generatingOutreach}
                    className="bg-slate-800 text-white text-sm rounded px-3 py-2 hover:bg-slate-900 mt-4 disabled:opacity-50"
                  >
                    {generatingOutreach ? 'Generating...' : 'Generate Outreach Email'}
                  </MotionButton>
                </div>
              </AnimatedCard>
            )}

            {showRewriteForm && result && (
              <AnimatedCard className="p-6">
                <form onSubmit={handleRewriteSubmit}>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">
                    Rewrite for this job
                  </h2>
                  <p className="text-slate-500 text-sm mb-4">
                    Pick which of the missing skills you actually have, so Gemini can weave
                    them in.
                  </p>

                  {result.missingSkillsForJob && result.missingSkillsForJob.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {result.missingSkillsForJob.map((skill) => (
                        <label
                          key={skill}
                          className="flex items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={!!skillChecks[skill]}
                            onChange={() => toggleSkillCheck(skill)}
                          />
                          {skill}
                        </label>
                      ))}
                    </div>
                  )}

                  <label className="block text-sm text-slate-600 mb-1">
                    Other skills to include (comma separated)
                  </label>
                  <input
                    type="text"
                    value={extraSkills}
                    onChange={(e) => setExtraSkills(e.target.value)}
                    placeholder="e.g. Docker, GraphQL"
                    className="w-full border border-slate-300 rounded px-3 py-2 mb-4"
                  />

                  {rewriteError && (
                    <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
                      {rewriteError}
                    </div>
                  )}

                  <MotionButton
                    type="submit"
                    disabled={rewriting}
                    className="w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {rewriting
                      ? 'Rewriting... (this can take a few seconds)'
                      : 'Generate Rewrite'}
                  </MotionButton>
                </form>
              </AnimatedCard>
            )}

            {rewrittenResume && (
              <GeneratedTextBlock
                title="Rewritten Resume"
                text={rewrittenResume}
                fileName="rewritten-resume.txt"
                showDownload
              />
            )}

            {coverLetterError && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded">
                {coverLetterError}
              </div>
            )}

            {coverLetter && (
              <GeneratedTextBlock
                title="Cover Letter"
                text={coverLetter}
                fileName="cover-letter.txt"
                showDownload
              />
            )}

            {outreachError && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded">{outreachError}</div>
            )}

            {outreachEmail && (
              <GeneratedTextBlock title="Outreach Email" text={outreachEmail} showDownload={false} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobMatching
