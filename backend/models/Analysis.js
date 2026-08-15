const mongoose = require('mongoose')

// This schema stores the result of running a resume through Gemini:
// the ATS score, plus every list of skills/keywords/suggestions the AI
// gave us. We save this so the Resume Analysis page can show it again
// later without having to call Gemini a second time.
const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  atsScore: {
    type: Number,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  missingSkills: {
    type: [String],
    default: [],
  },
  keywords: {
    type: [String],
    default: [],
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  strengths: {
    type: [String],
    default: [],
  },
  weaknesses: {
    type: [String],
    default: [],
  },
  grammarSuggestions: {
    type: [String],
    default: [],
  },
  improvementSuggestions: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Analysis', analysisSchema)
