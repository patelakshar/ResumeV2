import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [matching, setMatching] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  // Main tab state
  const [activeMainTab, setActiveMainTab] = useState('match')
  // AI sub-tab state
  const [activeAiTab, setActiveAiTab] = useState('')

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

  const [generatingInterviewPrep, setGeneratingInterviewPrep] = useState(false)
  const [interviewPrepError, setInterviewPrepError] = useState('')
  const [interviewPrep, setInterviewPrep] = useState('')

  const [bulletText, setBulletText] = useState('')
  const [improvingBullet, setImprovingBullet] = useState(false)
  const [bulletError, setBulletError] = useState('')
  const [improvedBullet, setImprovedBullet] = useState('')

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
    setActiveAiTab('')
    setActiveMainTab('match')
    setSkillChecks({})
    setExtraSkills('')
    setRewrittenResume('')
    setRewriteError('')
    setCoverLetter('')
    setCoverLetterError('')
    setOutreachEmail('')
    setOutreachError('')
    setInterviewPrep('')
    setInterviewPrepError('')
    setBulletText('')
    setImprovedBullet('')
    setBulletError('')
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

  async function handleGenerateInterviewPrep() {
    setInterviewPrepError('')
    setGeneratingInterviewPrep(true)

    try {
      const res = await api.post(`/jobmatch/${result._id}/interview-prep`)
      setInterviewPrep(res.data.interviewPrep)
    } catch (err) {
      setInterviewPrepError(err.response?.data?.message || 'Could not generate interview prep')
    } finally {
      setGeneratingInterviewPrep(false)
    }
  }

  async function handleImproveBullet(e) {
    e.preventDefault()
    setBulletError('')
    setImprovedBullet('')
    setImprovingBullet(true)

    try {
      const res = await api.post(`/jobmatch/${result._id}/improve-bullet`, { bulletText })
      setImprovedBullet(res.data.improvedBullet)
    } catch (err) {
      setBulletError(err.response?.data?.message || 'Could not improve this bullet')
    } finally {
      setImprovingBullet(false)
    }
  }

  // Picks a color for the recommendation badge so "Apply" looks
  // positive and "Not a fit" looks negative at a glance.
  function recommendationColor(recommendation) {
    if (recommendation === 'Apply') return 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800'
    if (recommendation === 'Improve first') return 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900'
    return 'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-800'
  }

  // Get score color for match score
  const getMatchScoreColor = (score) => {
    if (score >= 8) return 'bg-gradient-to-r from-purple-500 to-violet-500'
    if (score >= 6) return 'bg-gradient-to-r from-blue-500 to-indigo-500'
    if (score >= 4) return 'bg-gradient-to-r from-amber-500 to-yellow-500'
    return 'bg-gradient-to-r from-rose-500 to-pink-500'
  }

  function renderHighlightedJobDescription() {
    const missingSkills = result?.missingSkillsForJob || []

    if (!jobDescription.trim()) {
      return <p className="text-slate-400">Paste a job description to preview keywords.</p>
    }

    if (missingSkills.length === 0) {
      return <p className="text-slate-600">{jobDescription}</p>
    }

    const escapedSkills = missingSkills
      .filter(Boolean)
      .map((skill) => skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    if (escapedSkills.length === 0) {
      return <p className="text-slate-600">{jobDescription}</p>
    }

    const regex = new RegExp(`(${escapedSkills.join('|')})`, 'gi')
    const parts = jobDescription.split(regex)

    return (
      <p className="text-slate-600 whitespace-pre-wrap">
        {parts.map((part, index) =>
          missingSkills.some((skill) => skill.toLowerCase() === part.toLowerCase()) ? (
            <mark key={`${part}-${index}`} className="rounded bg-gradient-to-r from-amber-200 to-orange-200 px-1 text-slate-900">
              {part}
            </mark>
          ) : (
            <span key={`${part}-${index}`}>{part}</span>
          )
        )}
      </p>
    )
  }

  const hasActiveGeneration =
    matching || rewriting || generatingCoverLetter || generatingOutreach || generatingInterviewPrep || improvingBullet

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Match Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatedCard className="border border-slate-200 p-6">
              <form onSubmit={handleMatch} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="block text-sm text-slate-600 mb-1 lg:col-span-2"
                >
                  Resume
                </motion.label>
                {loadingResumes ? (
                  <Skeleton className="h-10 w-full mb-4 lg:col-span-2" />
                ) : resumes.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-500 text-sm mb-4 lg:col-span-2"
                  >
                    You haven't uploaded a resume yet. Upload one first.
                  </motion.p>
                ) : (
                  <motion.select
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 bg-white lg:col-span-2"
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.fileName}
                      </option>
                    ))}
                  </motion.select>
                )}

                <motion.label
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  className="block text-sm text-slate-600 mb-1 lg:col-span-2"
                >
                  Job Description
                </motion.label>
                <motion.textarea
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 bg-white lg:col-span-2"
                  placeholder="Paste the job description here..."
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-4 lg:col-span-2"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="lg:col-span-2"
                >
                  <MotionButton
                    type="submit"
                    disabled={matching}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg py-3 hover:shadow-lg shadow-purple-500/30 disabled:opacity-50"
                  >
                    {matching ? 'Matching... (this can take a few seconds)' : 'Match Resume to Job'}
                  </MotionButton>
                </motion.div>
              </form>
            </AnimatedCard>
          </motion.div>

          {/* Loading Indicator */}
          {hasActiveGeneration && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnimatedCard className="border border-slate-200 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg font-semibold text-slate-800"
                  >
                    AI is working
                  </motion.h2>
                  <span className="rounded-full bg-gradient-to-r from-amber-100 to-amber-200 px-3 py-1 text-xs font-semibold text-amber-900">
                    Usually a few seconds
                  </span>
                </div>
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, staggerChildren: 0.1 }}
                  >
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-9/12" />
                    <Skeleton className="h-4 w-10/12" />
                    <Skeleton className="h-24 w-full" />
                  </motion.div>
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {/* Main Tabs Navigation - Only shown after match result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <AnimatedCard className="border border-slate-200 p-4">
                <div className="flex gap-1 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
                  {[
                    { id: 'match', label: 'Match Result', icon: '📊' },
                    { id: 'keywords', label: 'Keyword Highlighter', icon: '🔍' },
                    { id: 'ai', label: 'AI Assistance', icon: '✨' },
                  ].map((tab) => (
                    <MotionButton
                      key={tab.id}
                      onClick={() => setActiveMainTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all flex items-center gap-1 ${
                        activeMainTab === tab.id
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                      style={{ minWidth: 'fit-content' }}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </MotionButton>
                  ))}
                </div>
              </AnimatedCard>
            </motion.div>
          )}

          {/* Match Result Tab */}
          {result && activeMainTab === 'match' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <AnimatedCard className="border border-slate-200 p-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Match Score:</span>
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getMatchScoreColor(result.matchScore)}`}>
                      {result.matchScore || 0}/10
                    </span>
                  </div>
                  <ProgressBar percent={result.matchScore * 10} />

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${recommendationColor(
                      result.recommendation
                    )}`}
                  >
                    {result.recommendation}
                  </span>

                  {result.verdict && (
                    <div className="bg-gradient-to-r from-teal-50 to-teal-100 border border-teal-200 rounded-lg p-4 mt-4">
                      <p className="text-lg font-semibold text-teal-900">{result.verdict}</p>
                      {result.verdictReasons && result.verdictReasons.length > 0 && (
                        <ul className="list-disc list-inside text-teal-800 text-sm mt-2 space-y-1">
                          {result.verdictReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <div>
                      <p className="text-slate-700 font-medium text-sm mb-1">Expected Salary Range</p>
                      <p className="text-slate-600 text-sm">{result.expectedSalaryRange}</p>
                    </div>

                    <div>
                      <p className="text-slate-700 font-medium text-sm mb-1">Missing Skills For This Job</p>
                      {result.missingSkillsForJob && result.missingSkillsForJob.length > 0 ? (
                        <ul className="list-disc list-inside text-slate-600 text-sm space-y-1">
                          {result.missingSkillsForJob.map((skill, index) => (
                            <li key={index}>{skill}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-400 text-sm">None</p>
                      )}
                    </div>
                  </div>

                  {/* Quick AI Actions in Match Result Tab */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="pt-4 border-t border-slate-100"
                  >
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="text-sm font-semibold text-slate-800 mb-3"
                    >
                      AI Assistance
                    </motion.h3>
                    <div className="flex gap-1 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
                      {[
                        { id: 'rewrite', label: 'Rewrite Resume', disabled: rewriting },
                        { id: 'coverletter', label: 'Cover Letter', disabled: generatingCoverLetter },
                        { id: 'outreach', label: 'Outreach Email', disabled: generatingOutreach },
                        { id: 'interview', label: 'Interview Prep', disabled: generatingInterviewPrep },
                        { id: 'improve', label: 'Improve Bullet', disabled: improvingBullet },
                      ].map((tab) => (
                        <MotionButton
                          key={tab.id}
                          onClick={() => {
                            setActiveMainTab('ai')
                            setActiveAiTab(tab.id)
                          }}
                          disabled={tab.disabled}
                          className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                            activeAiTab === tab.id
                              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          style={{ minWidth: 'fit-content' }}
                        >
                          {tab.label}
                        </MotionButton>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </AnimatedCard>
            </motion.div>
          )}

          {/* Keyword Highlighter Tab */}
          {result && activeMainTab === 'keywords' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <AnimatedCard className="border border-slate-200 p-6">
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                  className="text-lg font-semibold text-slate-800 mb-2"
                >
                  Keyword Highlighter
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="text-sm text-slate-500 mb-4"
                >
                  Missing job skills are highlighted below. These are the skills from the job description that aren't in your resume.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-200 bg-white/75 p-4 text-sm leading-6 text-slate-600"
                >
                  {renderHighlightedJobDescription()}
                </motion.div>
              </AnimatedCard>
            </motion.div>
          )}

          {/* AI Assistance Tab */}
          {result && activeMainTab === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              {/* AI Sub-tabs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mb-4"
              >
                <AnimatedCard className="border border-slate-200 p-4">
                  <div className="flex gap-1 overflow-x-auto pb-1 -mx-2 px-2 scrollbar-hide">
                    {[
                      { id: 'rewrite', label: 'Rewrite Resume', disabled: rewriting },
                      { id: 'coverletter', label: 'Cover Letter', disabled: generatingCoverLetter },
                      { id: 'outreach', label: 'Outreach Email', disabled: generatingOutreach },
                      { id: 'interview', label: 'Interview Prep', disabled: generatingInterviewPrep },
                      { id: 'improve', label: 'Improve Bullet', disabled: improvingBullet },
                    ].map((tab) => (
                      <MotionButton
                        key={tab.id}
                        onClick={() => setActiveAiTab(tab.id)}
                        disabled={tab.disabled}
                        className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                          activeAiTab === tab.id
                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                        style={{ minWidth: 'fit-content' }}
                      >
                        {tab.label}
                      </MotionButton>
                    ))}
                  </div>
                </AnimatedCard>
              </motion.div>

              {/* AI Tab Content */}
              <AnimatedCard className="border border-slate-200 p-6">
                <>
                {/* Rewrite Resume Tab */}
                {activeAiTab === 'rewrite' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <form onSubmit={handleRewriteSubmit}>
                      <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-semibold text-slate-800 mb-2"
                      >
                        Rewrite for this job
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 text-sm mb-4"
                      >
                        Pick which of the missing skills you actually have, so Gemini can weave them in.
                      </motion.p>

                      {result.missingSkillsForJob && result.missingSkillsForJob.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="mb-4 space-y-2"
                        >
                          {result.missingSkillsForJob.map((skill) => (
                            <motion.label
                              key={skill}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center gap-2 text-sm text-slate-700"
                            >
                              <input
                                type="checkbox"
                                checked={!!skillChecks[skill]}
                                onChange={() => toggleSkillCheck(skill)}
                              />
                              {skill}
                            </motion.label>
                          ))}
                        </motion.div>
                      )}

                      <motion.label
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="block text-sm text-slate-600 mb-1"
                      >
                        Other skills to include (comma separated)
                      </motion.label>
                      <motion.input
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        type="text"
                        value={extraSkills}
                        onChange={(e) => setExtraSkills(e.target.value)}
                        placeholder="e.g. Docker, GraphQL"
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 bg-white"
                      />

                      {rewriteError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-4"
                        >
                          {rewriteError}
                        </motion.div>
                      )}

                      {rewrittenResume ? (
                        <GeneratedTextBlock
                          title="Rewritten Resume"
                          text={rewrittenResume}
                          fileName="rewritten-resume.txt"
                          showDownload
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                        >
                          <MotionButton
                            type="submit"
                            disabled={rewriting}
                            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg py-2 hover:shadow-lg shadow-teal-500/30 disabled:opacity-50"
                          >
                            {rewriting ? 'Rewriting...' : 'Generate Rewrite'}
                          </MotionButton>
                        </motion.div>
                      )}
                    </form>
                  </motion.div>
                )}

                {/* Cover Letter Tab */}
                {activeAiTab === 'coverletter' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg font-semibold text-slate-800 mb-4"
                    >
                      Generate Cover Letter
                    </motion.h2>
                    
                    {coverLetterError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-4"
                      >
                        {coverLetterError}
                      </motion.div>
                    )}
                    
                    {coverLetter ? (
                      <GeneratedTextBlock
                        title="Cover Letter"
                        text={coverLetter}
                        fileName="cover-letter.txt"
                        showDownload
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <MotionButton
                          onClick={handleGenerateCoverLetter}
                          disabled={generatingCoverLetter}
                          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg py-2 hover:shadow-lg shadow-purple-500/30 disabled:opacity-50"
                        >
                          {generatingCoverLetter ? 'Generating...' : 'Generate Cover Letter'}
                        </MotionButton>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Outreach Email Tab */}
                {activeAiTab === 'outreach' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg font-semibold text-slate-800 mb-4"
                    >
                      Generate Outreach Email
                    </motion.h2>
                    
                    {outreachError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-4"
                      >
                        {outreachError}
                      </motion.div>
                    )}
                    
                    {outreachEmail ? (
                      <GeneratedTextBlock
                        title="Outreach Email"
                        text={outreachEmail}
                        fileName="outreach-email.txt"
                        showDownload={false}
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <MotionButton
                          onClick={handleGenerateOutreach}
                          disabled={generatingOutreach}
                          className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg py-2 hover:shadow-lg shadow-amber-500/30 disabled:opacity-50"
                        >
                          {generatingOutreach ? 'Generating...' : 'Generate Outreach Email'}
                        </MotionButton>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Interview Prep Tab */}
                {activeAiTab === 'interview' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg font-semibold text-slate-800 mb-4"
                    >
                      Interview Prep
                    </motion.h2>
                    
                    {interviewPrepError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-4"
                      >
                        {interviewPrepError}
                      </motion.div>
                    )}
                    
                    {interviewPrep ? (
                      <GeneratedTextBlock
                        title="Interview Prep"
                        text={interviewPrep}
                        fileName="interview-prep.txt"
                        showDownload
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <MotionButton
                          onClick={handleGenerateInterviewPrep}
                          disabled={generatingInterviewPrep}
                          className="w-full bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-lg py-2 hover:shadow-lg shadow-rose-500/30 disabled:opacity-50"
                        >
                          {generatingInterviewPrep ? 'Generating...' : 'Generate Interview Prep'}
                        </MotionButton>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Improve Bullet Tab */}
                {activeAiTab === 'improve' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <form onSubmit={handleImproveBullet}>
                      <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-semibold text-slate-800 mb-2"
                      >
                        Improve One Resume Bullet
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 text-sm mb-4"
                      >
                        Paste one bullet and Gemini will make it sharper for this job.
                      </motion.p>
                      <motion.textarea
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        value={bulletText}
                        onChange={(e) => setBulletText(e.target.value)}
                        rows={5}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 mb-4 bg-white"
                        placeholder="e.g. Built responsive React components for an internal dashboard"
                      />
                      {bulletError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="bg-red-100 text-red-700 text-sm p-2 rounded-lg mb-4"
                        >
                          {bulletError}
                        </motion.div>
                      )}
                      
                      {improvedBullet ? (
                        <GeneratedTextBlock
                          title="Improved Resume Bullet"
                          text={improvedBullet}
                          fileName="improved-bullet.txt"
                          showDownload
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <MotionButton
                            type="submit"
                            disabled={improvingBullet}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg py-2 hover:shadow-lg shadow-purple-500/30 disabled:opacity-50"
                          >
                            {improvingBullet ? 'Improving...' : 'Improve Bullet'}
                          </MotionButton>
                        </motion.div>
                      )}
                    </form>
                  </motion.div>
                )}
                </>
              </AnimatedCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JobMatching
