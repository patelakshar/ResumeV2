const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const Resume = require('../models/Resume')
const Analysis = require('../models/Analysis')
const requireAuth = require('../middleware/authMiddleware')
const { analyzeResumeText } = require('../services/geminiService')

const router = express.Router()

// Keep the uploaded file in memory (as a buffer) instead of saving it
// to disk. We only need to read its text once, so there's no reason
// to keep the actual file around afterwards.
const upload = multer({ storage: multer.memoryStorage() })

// The most text we'll store per resume. Real resumes are almost always
// well under this (a couple thousand characters), so this rarely trims
// anything - it just stops one huge or oddly-parsed file from bloating
// the database.
const MAX_EXTRACTED_TEXT_LENGTH = 15000

// Cuts extracted text down to our max length before we save it, if it's
// somehow longer than that.
function truncateExtractedText(text) {
  if (text.length <= MAX_EXTRACTED_TEXT_LENGTH) {
    return text
  }
  return text.slice(0, MAX_EXTRACTED_TEXT_LENGTH)
}

// Looks at the uploaded file's type and pulls the plain text out of
// it, using a different library depending on whether it's a PDF or a
// Word document.
async function extractTextFromFile(file) {
  if (file.mimetype === 'application/pdf') {
    const data = await pdfParse(file.buffer)
    return data.text
  }

  const isDocx =
    file.mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  if (isDocx) {
    const result = await mammoth.extractRawText({ buffer: file.buffer })
    return result.value
  }

  throw new Error('Unsupported file type. Please upload a PDF or DOCX file.')
}

// GET /api/resume
// Protected route: lists every resume the logged-in user has uploaded,
// newest first, so pages like Job Matching can let the user pick one.
router.get('/', requireAuth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ uploadedAt: -1 })
    res.json({ resumes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong loading resumes' })
  }
})

// POST /api/resume/upload
// Protected route: only a logged-in user can upload a resume.
// Reads the uploaded file (field name "resume"), extracts its text,
// and saves a new Resume document linked to that user.
router.post('/upload', requireAuth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded' })
    }

    const extractedText = truncateExtractedText(await extractTextFromFile(req.file))

    const resume = await Resume.create({
      userId: req.userId,
      fileName: req.file.originalname,
      extractedText,
    })

    res.status(201).json({ resume })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message || 'Something went wrong during upload' })
  }
})

// POST /api/resume/analyze/:id
// Protected route: finds the resume (only if it belongs to the logged-in
// user), sends its extracted text to Gemini, and saves the structured
// result as a new Analysis document so the frontend can display it.
router.post('/analyze/:id', requireAuth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId })

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    const aiResult = await analyzeResumeText(resume.extractedText)

    const analysis = await Analysis.create({
      userId: req.userId,
      resumeId: resume._id,
      atsScore: aiResult.atsScore,
      skills: aiResult.skills,
      missingSkills: aiResult.missingSkills,
      keywords: aiResult.keywords,
      missingKeywords: aiResult.missingKeywords,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      grammarSuggestions: aiResult.grammarSuggestions,
      improvementSuggestions: aiResult.improvementSuggestions,
    })

    res.status(201).json({ analysis })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong during analysis' })
  }
})

module.exports = router
