import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import ProgressBar from '../components/ProgressBar'
import Skeleton from '../components/Skeleton'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'

// Job finding page that uses AI to find jobs matching the user's resume
function JobFinder() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedResumeId, setSelectedResumeId] = useState('')
  
  // Form state for job filters
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    remote: null,
    experienceLevel: '',
    jobType: '',
    salaryMin: '',
    company: ''
  })
  
  // Search state
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [jobs, setJobs] = useState([])
  const [searchSummary, setSearchSummary] = useState('')
  const [searchCompleted, setSearchCompleted] = useState(false)
  
  // Tabs
  const [activeTab, setActiveTab] = useState('search')
  
  // Experience level options
  const experienceLevels = [
    { value: '', label: 'Any Experience Level' },
    { value: 'Entry', label: 'Entry Level' },
    { value: 'Junior', label: 'Junior (1-3 years)' },
    { value: 'Mid', label: 'Mid Level (3-5 years)' },
    { value: 'Senior', label: 'Senior (5-10 years)' },
    { value: 'Executive', label: 'Executive (10+ years)' }
  ]
  
  // Job type options
  const jobTypes = [
    { value: '', label: 'Any Job Type' },
    { value: 'Full-time', label: 'Full-time' },
    { value: 'Part-time', label: 'Part-time' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Internship', label: 'Internship' },
    { value: 'Temporary', label: 'Temporary' }
  ]

  // Fetch user's resumes on load
  useEffect(() => {
    api.get('/resume')
      .then((res) => {
        setResumes(res.data.resumes)
        if (res.data.resumes.length > 0) {
          setSelectedResumeId(res.data.resumes[0]._id)
        }
      })
      .catch((err) => {
        console.error('Error fetching resumes:', err)
        setError('Failed to load your resumes. Please upload a resume first.')
      })
      .finally(() => setLoadingResumes(false))
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSearching(true)
    setSearchCompleted(false)
    setJobs([])
    setSearchSummary('')

    if (!selectedResumeId) {
      setError('Please select a resume')
      setSearching(false)
      return
    }

    try {
      // Prepare the request data
      const requestData = {
        resumeId: selectedResumeId,
        jobTitle: formData.jobTitle || undefined,
        location: formData.location || undefined,
        remote: formData.remote,
        experienceLevel: formData.experienceLevel || undefined,
        jobType: formData.jobType || undefined,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : undefined,
        company: formData.company || undefined
      }

      const response = await api.post('/jobs/find', requestData)
      
      if (response.data.jobs) {
        setJobs(response.data.jobs)
        setSearchSummary(response.data.message || `Found ${response.data.jobs.length} job opportunities`)
        setActiveTab('results')
      }
      
      setSearchCompleted(true)
    } catch (err) {
      console.error('Error finding jobs:', err)
      setError(err.response?.data?.error || 'Failed to find jobs. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleReset = () => {
    setFormData({
      jobTitle: '',
      location: '',
      remote: null,
      experienceLevel: '',
      jobType: '',
      salaryMin: '',
      company: ''
    })
    setJobs([])
    setSearchSummary('')
    setError('')
    setSearchCompleted(false)
    setActiveTab('search')
  }

  const handleApplyNow = (url) => {
    // Open the apply URL in a new tab
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Job Finder
          </h1>
          <p className="text-gray-600">
            Find jobs that match your resume. AI will search and provide direct apply links.
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'search'
                  ? 'bg-white shadow-sm text-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Search Jobs
            </button>
            <button
              onClick={() => setActiveTab('results')}
              disabled={jobs.length === 0}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-white shadow-sm text-teal-600'
                  : `text-gray-600 hover:text-gray-900 ${jobs.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`
              }`}
            >
              Results ({jobs.length})
            </button>
          </div>
        </div>

        {/* Search Form */}
        {activeTab === 'search' && (
          <AnimatedCard>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Resume Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Resume
                </label>
                {loadingResumes ? (
                  <Skeleton className="h-10 w-full" />
                ) : resumes.length > 0 ? (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    {resumes.map((resume) => (
                      <option key={resume._id} value={resume._id}>
                        {resume.fileName || resume.filename} (Uploaded: {new Date(resume.uploadedAt || resume.createdAt).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-yellow-600 text-sm">
                    No resumes found. Please upload a resume first.
                  </div>
                )}
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, San Francisco, Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Remote Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="remote"
                      value={true}
                      checked={formData.remote === true}
                      onChange={() => setFormData(prev => ({ ...prev, remote: true }))}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Remote</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="remote"
                      value={false}
                      checked={formData.remote === false}
                      onChange={() => setFormData(prev => ({ ...prev, remote: false }))}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>On-site</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="remote"
                      value={null}
                      checked={formData.remote === null}
                      onChange={() => setFormData(prev => ({ ...prev, remote: null }))}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Both</span>
                  </label>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {experienceLevels.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {jobTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Salary Minimum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary (USD) <span className="text-gray-500">(optional)</span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">$</span>
                  <input
                    type="text"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleNumberChange}
                    placeholder="e.g., 80000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Google, Microsoft"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <MotionButton
                  type="submit"
                  disabled={searching || loadingResumes || resumes.length === 0}
                  isLoading={searching}
                  className="flex-1 lg:flex-none"
                >
                  {searching ? 'Finding Jobs...' : 'Find Jobs'}
                </MotionButton>
                
                <MotionButton
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={searching}
                >
                  Reset
                </MotionButton>
              </div>

              {/* Progress indicator */}
              {searching && (
                <div className="pt-4">
                  <ProgressBar value={null} />
                  <p className="text-sm text-gray-600 mt-2">
                    AI is analyzing your resume and searching for matching jobs...
                  </p>
                </div>
              )}
            </form>
          </AnimatedCard>
        )}

        {/* Results Section */}
        {activeTab === 'results' && searchCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Summary */}
            {searchSummary && (
              <AnimatedCard className="mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-800">{searchSummary}</h3>
                  </div>
                </div>
              </AnimatedCard>
            )}

            {/* Jobs List */}
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <AnimatedCard className="hover:shadow-lg transition-shadow">
                      <div className="flex flex-col lg:flex-row lg:space-x-6">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start space-x-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                              {job.source || 'AI Suggested'}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 font-medium mb-2">{job.company}</p>
                          
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{job.location || 'Remote'}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{job.postedDate || 'Recently'}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <span>{job.type || 'Full-time'}</span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{job.salary || 'Not disclosed'}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>
                          
                          {/* Requirements */}
                          {job.requirements && job.requirements.length > 0 && (
                            <div className="mb-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
                              <div className="flex flex-wrap gap-1">
                                {job.requirements.slice(0, 3).map((req, reqIndex) => (
                                  <span key={reqIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {req}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col items-end justify-between lg:items-start">
                          <div className="flex items-center space-x-2 mb-4 lg:mb-0">
                            <span className="text-sm text-gray-600">Match:</span>
                            <span className={`px-2 py-1 text-white text-sm font-bold rounded ${getMatchScoreColor(job.matchScore || 80)}`}>
                              {job.matchScore || 80}%
                            </span>
                          </div>
                          
                          <MotionButton
                            onClick={() => handleApplyNow(job.applyUrl)}
                            disabled={!job.applyUrl}
                            className="w-full lg:w-auto"
                          >
                            Apply Now
                          </MotionButton>
                        </div>
                      </div>
                    </AnimatedCard>
                  </motion.div>
                ))}
              </div>
            ) : (
              <AnimatedCard>
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500">No jobs found matching your criteria. Try adjusting your filters.</p>
                </div>
              </AnimatedCard>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default JobFinder
