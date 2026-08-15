const mongoose = require('mongoose')

// This schema stores an uploaded resume: who it belongs to, the
// original file name, and the plain text we pulled out of the PDF or
// DOCX file (this text is what we'll send to the AI later to analyze).
const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Resume', resumeSchema)
