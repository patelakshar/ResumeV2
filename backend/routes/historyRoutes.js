const express = require('express')
const PDFDocument = require('pdfkit')
const Analysis = require('../models/Analysis')
const JobMatch = require('../models/JobMatch')
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router()

// GET /api/history
// Protected route: returns every past resume analysis and job match
// for the logged-in user, newest first, so the History page can show
// them in one place.
router.get('/', requireAuth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.userId })
      .populate('resumeId', 'fileName')
      .sort({ createdAt: -1 })

    const jobMatches = await JobMatch.find({ userId: req.userId })
      .populate('resumeId', 'fileName')
      .sort({ createdAt: -1 })

    res.json({ analyses, jobMatches })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong loading history' })
  }
})

// Small helper used below to add one titled list section (like
// "Skills" or "Weaknesses") to the PDF document.
function addListSection(doc, title, items) {
  doc.fontSize(13).text(title, { underline: true })
  if (items && items.length > 0) {
    items.forEach((item) => {
      doc.fontSize(11).text(`- ${item}`)
    })
  } else {
    doc.fontSize(11).text('None')
  }
  doc.moveDown()
}

// Builds the actual PDF report for one analysis and streams it
// straight into the response, so the browser can download it.
function writeAnalysisPdf(res, analysis) {
  const doc = new PDFDocument({ margin: 50 })
  doc.pipe(res)

  doc.fontSize(20).text('Resume Analysis Report', { align: 'center' })
  doc.moveDown()

  doc.fontSize(14).text(`ATS Score: ${analysis.atsScore} / 100`)
  doc.moveDown()

  addListSection(doc, 'Skills', analysis.skills)
  addListSection(doc, 'Missing Skills', analysis.missingSkills)
  addListSection(doc, 'Keywords', analysis.keywords)
  addListSection(doc, 'Missing Keywords', analysis.missingKeywords)
  addListSection(doc, 'Strengths', analysis.strengths)
  addListSection(doc, 'Weaknesses', analysis.weaknesses)
  addListSection(doc, 'Grammar Suggestions', analysis.grammarSuggestions)
  addListSection(doc, 'Improvement Suggestions', analysis.improvementSuggestions)

  doc.end()
}

// GET /api/history/:id/pdf
// Protected route: generates a PDF report for one saved analysis
// (only if it belongs to the logged-in user) and streams it back as a
// downloadable file.
router.get('/:id/pdf', requireAuth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.userId })

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="resume-analysis-${analysis._id}.pdf"`
    )

    writeAnalysisPdf(res, analysis)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong generating the PDF' })
  }
})

module.exports = router
