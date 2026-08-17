const mongoose = require('mongoose')

// Schema for storing job search history
const JobSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  filters: {
    jobTitle: { type: String, default: '' },
    location: { type: String, default: '' },
    remote: { type: Boolean, default: null },
    experienceLevel: { 
      type: String, 
      enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Executive', ''], 
      default: '' 
    },
    jobType: { 
      type: String, 
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', ''], 
      default: '' 
    },
    salaryMin: { type: Number, default: null },
    company: { type: String, default: '' }
  },
  results: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Text index for searching
JobSearchSchema.index({
  'filters.jobTitle': 'text',
  'filters.location': 'text',
  'filters.company': 'text'
})

// Index for user-based queries
JobSearchSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model('JobSearch', JobSearchSchema)
