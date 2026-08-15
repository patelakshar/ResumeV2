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

  // Runs when the user drops a file onto the drop zone. Grabs the
  // first dropped file and saves it so it can be uploaded.
  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  // Runs while a file is being dragged over the drop zone. We must
  // call preventDefault here or the browser won't allow a drop at all.
  function handleDragOver(e) {
    e.preventDefault()
    setIsDragging(true)
  }

  // Runs when the dragged file leaves the drop zone, so we can turn
  // off the highlighted drop zone styling.
  function handleDragLeave() {
    setIsDragging(false)
  }

  // Runs when the user picks a file with the normal file input instead
  // of dragging one.
  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  // Sends the selected file to the backend as multipart form data, and
  // shows either the extracted text preview or an error message.
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

  // Sends the uploaded resume's id to the backend so Gemini can
  // analyze it, then takes the user to the Resume Analysis page to
  // see the result. This can take a few seconds since it waits on Gemini.
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
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <AnimatedCard className="w-full max-w-xl p-6">
          <h1 className="text-2xl font-semibold text-slate-800 mb-6">Upload your resume</h1>

          <motion.div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            animate={{ scale: isDragging ? 1.02 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'
            }`}
          >
            <p className="text-slate-600 mb-2">Drag and drop your PDF or DOCX here</p>
            <p className="text-slate-400 text-sm mb-4">or</p>
            <label className="inline-block bg-slate-200 text-slate-700 px-4 py-2 rounded cursor-pointer hover:bg-slate-300">
              Choose file
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && <p className="text-slate-700 text-sm mt-4">Selected: {file.name}</p>}
          </motion.div>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded mt-4">{error}</div>
          )}

          <MotionButton
            onClick={handleUpload}
            disabled={uploading || !file}
            className="w-full bg-indigo-600 text-white rounded py-2 mt-4 hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </MotionButton>

          {uploadedResume && (
            <div className="bg-green-100 text-green-800 text-sm p-3 rounded mt-4">
              <p className="font-medium">Uploaded: {uploadedResume.fileName}</p>
              <p className="mt-2 text-slate-600">
                {uploadedResume.extractedText.slice(0, 200)}...
              </p>
            </div>
          )}

          {analyzeError && (
            <div className="bg-red-100 text-red-700 text-sm p-2 rounded mt-4">
              {analyzeError}
            </div>
          )}

          {uploadedResume && (
            <MotionButton
              onClick={handleAnalyze}
              disabled={analyzing}
              className="w-full bg-slate-800 text-white rounded py-2 mt-4 hover:bg-slate-900 disabled:opacity-50"
            >
              {analyzing ? 'Analyzing... (this can take a few seconds)' : 'Analyze Resume'}
            </MotionButton>
          )}
        </AnimatedCard>
      </div>
    </div>
  )
}

export default ResumeUpload
