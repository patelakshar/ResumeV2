const express = require('express')
const router = express.Router()
const { generateJSON, cleanJsonText } = require('../services/aiClient')
const requireAuth = require('../middleware/authMiddleware')
const Resume = require('../models/Resume')
const JobSearch = require('../models/JobSearch')

// POST /api/jobs/find - Find jobs matching user's resume with filters
router.post('/find', requireAuth, async (req, res) => {
  try {
    const { resumeId, jobTitle, location, remote, experienceLevel, jobType, salaryMin, company } = req.body

    // Validate required fields
    if (!resumeId) {
      return res.status(400).json({ error: 'Resume ID is required' })
    }

    // Get the resume
    const resume = await Resume.findOne({ _id: resumeId, userId: req.userId })
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    // Build the AI prompt for job finding
    const prompt = buildJobFindingPrompt(resume.extractedText || resume.text, {
      jobTitle,
      location,
      remote,
      experienceLevel,
      jobType,
      salaryMin,
      company
    })

    const rawText = await generateJSON(prompt)
    const cleanedText = cleanJsonText(rawText)
    
    // Parse the JSON response
    let jobResults
    try {
      jobResults = JSON.parse(cleanedText)
    } catch (parseError) {
      // Try to extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jobResults = JSON.parse(jsonMatch[0])
      } else {
        return res.status(500).json({
          error: 'AI returned invalid format',
          rawResponse: cleanedText
        })
      }
    }

    // Save the search to history
    const searchRecord = new JobSearch({
      userId: req.userId,
      resumeId,
      filters: {
        jobTitle,
        location,
        remote,
        experienceLevel,
        jobType,
        salaryMin,
        company
      },
      results: jobResults
    })

    await searchRecord.save()

    res.json({
      message: 'Jobs found successfully',
      jobs: jobResults.jobs || jobResults,
      searchId: searchRecord._id
    })
  } catch (error) {
    console.error('Error finding jobs:', error)
    res.status(500).json({
      error: 'Failed to find jobs',
      details: error.message
    })
  }
})

// GET /api/jobs/history - Get user's job search history
router.get('/history', requireAuth, async (req, res) => {
  try {
    const searches = await JobSearch.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)

    res.json({ searches })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job search history' })
  }
})

// GET /api/jobs/:id - Get specific job search results
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const search = await JobSearch.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!search) {
      return res.status(404).json({ error: 'Job search not found' })
    }

    res.json({ search })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job search' })
  }
})

// Helper function to build the job finding prompt
function buildJobFindingPrompt(resumeText, filters) {
  const { jobTitle, location, remote, experienceLevel, jobType, salaryMin, company } = filters

  let filterDetails = []
  if (jobTitle) filterDetails.push(`Job Title: ${jobTitle}`)
  if (location) filterDetails.push(`Location: ${location}`)
  if (remote) filterDetails.push(`Work Type: ${remote === 'true' ? 'Remote' : 'On-site'}`)
  if (experienceLevel) filterDetails.push(`Experience Level: ${experienceLevel}`)
  if (jobType) filterDetails.push(`Job Type: ${jobType}`)
  if (salaryMin) filterDetails.push(`Minimum Salary: $${salaryMin}`)
  if (company) filterDetails.push(`Company: ${company}`)

  const filterText = filterDetails.length > 0 
    ? `\n\nUser Preferences:\n${filterDetails.join('\n')}`
    : ''

  return `You are a job search assistant. Based on the following resume and user preferences, find 10-15 relevant job openings that the user can apply to directly.

Return ONLY a JSON object with this exact structure:
{
  "summary": "Brief summary of the search results",
  "jobs": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "Job location",
      "remote": true/false,
      "type": "Full-time/Part-time/Contract/Internship",
      "experienceLevel": "Entry/Junior/Mid/Senior/Executive",
      "salary": "Salary range or 'Not disclosed'",
      "description": "Brief job description",
      "requirements": ["Requirement 1", "Requirement 2"],
      "applyUrl": "Direct application URL",
      "postedDate": "When it was posted",
      "source": "Where the job was found (LinkedIn, Indeed, Company website, etc.)",
      "matchScore": 0-100
    }
  ]
}

Resume text:
"""
${resumeText}
"""${filterText}

Find real, currently open positions. Include direct apply links. If you cannot find real job listings, generate realistic job opportunities based on the resume and filters, but clearly mark them as "Generated Suggestions" in the source field. Always include valid-looking URLs.`
}

module.exports = router
