import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'

// Page where a logged-in user can upload their resume (PDF or DOCX).
// Supports both dragging a file onto the page and picking one manually.
function ResumeUpload() {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedResume, setUploadedResume] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeError, setAnalyzeError] = useState('')
  const navigate = useNavigate()

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave() {
    setIsDragging(false)
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  async function handleUpload() {
    if (!file) {
      setError('Please choose a file first')
      return
    }

    setUploading(true)
    setError('')
    setUploadedResume(null)

    const formData = new FormData()
    formData.append('resume', file)

    try {
      const res = await api.post('/resume/upload', formData)
      setUploadedResume(res.data.resume)
      setFile(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleAnalyze() {
    if (!uploadedResume) return
    setAnalyzing(true)
    setAnalyzeError('')
    try {
      const res = await api.post(`/resume/analyze/${uploadedResume._id}`)
      navigate('/analysis', { state: { analysis: res.data.analysis } })
    } catch (err) {
      setAnalyzeError(err.response?.data?.message || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <AnimatedCard className="p-8">
            <motion.div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              animate={{ scale: isDragging ? 1.02 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
                isDragging ? 'border-teal-500 bg-teal-50' : 'border-slate-300'
              }`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-slate-600 mb-2 text-lg">Drag and drop your PDF or DOCX here</p>
                <p className="text-slate-400 text-sm mb-4">or</p>
                <label className="inline-block bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:shadow-lg shadow-teal-500/30 transition-shadow">
                  Choose file
                  <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
                </label>
              </motion.div>
              {file && <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-slate-700 text-sm mt-4 font-medium">Selected: {file.name}</motion.p>}
            </motion.div>
            {error && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mt-4">{error}</motion.div>}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <MotionButton onClick={handleUpload} disabled={uploading || !file} className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg py-3 mt-4 hover:shadow-lg shadow-teal-500/30 disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload Resume'}</MotionButton>
            </motion.div>
            {uploadedResume && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm p-4 rounded-lg mt-4"><p className="font-medium mb-2">Uploaded: {uploadedResume.fileName}</p><p className="text-slate-600 text-xs">{uploadedResume.extractedText.slice(0, 200)}...</p></motion.div>}
            {analyzeError && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mt-4">{analyzeError}</motion.div>}
            {uploadedResume && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <MotionButton onClick={handleAnalyze} disabled={analyzing} className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg py-3 mt-4 hover:shadow-lg shadow-purple-500/30 disabled:opacity-50">{analyzing ? 'Analyzing... (this can take a few seconds)' : 'Analyze Resume'}</MotionButton>
              </motion.div>
            )}
          </AnimatedCard>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-6 text-center">
            <MotionButton onClick={() => navigate('/history')} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50">View Upload History</MotionButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResumeUpload
