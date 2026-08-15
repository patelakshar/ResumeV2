const mongoose = require('mongoose')

// This schema stores the result of comparing one resume against one
// pasted job description: how well they match, what's missing, and
// what Gemini recommends doing next.
const jobMatchSchema = new mongoose.Schema({
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
  jobDescription: {
    type: String,
    required: true,
  },
  matchScore: {
    type: Number,
    required: true,
  },
  missingSkillsForJob: {
    type: [String],
    default: [],
  },
  expectedSalaryRange: {
    type: String,
    default: '',
  },
  recommendation: {
    type: String,
    default: '',
  },
  // A short, encouraging headline (e.g. "You should apply!") plus a
  // few reasons behind it, shown right under the match result.
  verdict: {
    type: String,
    default: '',
  },
  verdictReasons: {
    type: [String],
    default: [],
  },
  // These three are filled in later, only if the user asks for them
  // from the Job Matching page. They stay empty until then.
  rewrittenResume: {
    type: String,
    default: '',
  },
  coverLetter: {
    type: String,
    default: '',
  },
  outreachEmail: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('JobMatch', jobMatchSchema)
