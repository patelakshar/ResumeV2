const express = require('express')
const Resume = require('../models/Resume')
const JobMatch = require('../models/JobMatch')
const requireAuth = require('../middleware/authMiddleware')
const {
  matchResumeToJob,
  rewriteResumeForJob,
  generateCoverLetter,
  generateOutreachEmail,
  generateInterviewPrep,
  improveResumeBullet,
} = require('../services/geminiService')

const router = express.Router()

// POST /api/jobmatch/:resumeId
// Protected route: takes a pasted job description, sends it along with
// the chosen resume's extracted text to Gemini, and saves the match result.
router.post('/:resumeId', requireAuth, async (req, res) => {
  try {
    const { jobDescription } = req.body

    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description is required' })
    }

    const resume = await Resume.findOne({ _id: req.params.resumeId, userId: req.userId })

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    const aiResult = await matchResumeToJob(resume.extractedText, jobDescription)

    const jobMatch = await JobMatch.create({
      userId: req.userId,
      resumeId: resume._id,
      jobDescription,
      matchScore: aiResult.matchScore,
      missingSkillsForJob: aiResult.missingSkillsForJob,
      expectedSalaryRange: aiResult.expectedSalaryRange,
      recommendation: aiResult.recommendation,
      verdict: aiResult.verdict,
      verdictReasons: aiResult.verdictReasons,
    })

    res.status(201).json({ jobMatch })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong during job matching' })
  }
})

// Small helper used by the three routes below: finds a job match by id
// (only if it belongs to the logged-in user) along with the resume it
// was matched against, since Gemini needs both texts again.
async function findJobMatchWithResume(jobMatchId, userId) {
  const jobMatch = await JobMatch.findOne({ _id: jobMatchId, userId })
  if (!jobMatch) {
    return { jobMatch: null, resume: null }
  }

  const resume = await Resume.findOne({ _id: jobMatch.resumeId, userId })
  return { jobMatch, resume }
}

// POST /api/jobmatch/:id/rewrite
// Protected route: rewrites the matched resume to better fit the job,
// optionally weaving in extra skills the user tells us about. Saves
// the rewrite on the JobMatch itself (the original Resume is untouched).
router.post('/:id/rewrite', requireAuth, async (req, res) => {
  try {
    const { additionalSkills } = req.body

    const { jobMatch, resume } = await findJobMatchWithResume(req.params.id, req.userId)
    if (!jobMatch || !resume) {
      return res.status(404).json({ message: 'Job match not found' })
    }

    const rewrittenResume = await rewriteResumeForJob(
      resume.extractedText,
      jobMatch.jobDescription,
      additionalSkills || []
    )

    jobMatch.rewrittenResume = rewrittenResume
    await jobMatch.save()

    res.json({ rewrittenResume })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong during the rewrite' })
  }
})

// POST /api/jobmatch/:id/cover-letter
// Protected route: generates a tailored cover letter for the matched
// resume + job description, and saves it on the JobMatch.
router.post('/:id/cover-letter', requireAuth, async (req, res) => {
  try {
    const { jobMatch, resume } = await findJobMatchWithResume(req.params.id, req.userId)
    if (!jobMatch || !resume) {
      return res.status(404).json({ message: 'Job match not found' })
    }

    const coverLetter = await generateCoverLetter(resume.extractedText, jobMatch.jobDescription)

    jobMatch.coverLetter = coverLetter
    await jobMatch.save()

    res.json({ coverLetter })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong generating the cover letter' })
  }
})

// POST /api/jobmatch/:id/outreach-email
// Protected route: generates a short cold outreach email for the
// matched resume + job description, and saves it on the JobMatch.
router.post('/:id/outreach-email', requireAuth, async (req, res) => {
  try {
    const { jobMatch, resume } = await findJobMatchWithResume(req.params.id, req.userId)
    if (!jobMatch || !resume) {
      return res.status(404).json({ message: 'Job match not found' })
    }

    const outreachEmail = await generateOutreachEmail(resume.extractedText, jobMatch.jobDescription)

    jobMatch.outreachEmail = outreachEmail
    await jobMatch.save()

    res.json({ outreachEmail })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong generating the outreach email' })
  }
})

// POST /api/jobmatch/:id/interview-prep
// Protected route: generates practical interview prep for this matched job.
router.post('/:id/interview-prep', requireAuth, async (req, res) => {
  try {
    const { jobMatch, resume } = await findJobMatchWithResume(req.params.id, req.userId)
    if (!jobMatch || !resume) {
      return res.status(404).json({ message: 'Job match not found' })
    }

    const interviewPrep = await generateInterviewPrep(resume.extractedText, jobMatch.jobDescription)

    jobMatch.interviewPrep = interviewPrep
    await jobMatch.save()

    res.json({ interviewPrep })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong generating interview prep' })
  }
})

// POST /api/jobmatch/:id/improve-bullet
// Protected route: improves one resume bullet for this job description.
router.post('/:id/improve-bullet', requireAuth, async (req, res) => {
  try {
    const { bulletText } = req.body

    if (!bulletText || !bulletText.trim()) {
      return res.status(400).json({ message: 'Resume bullet is required' })
    }

    const { jobMatch } = await findJobMatchWithResume(req.params.id, req.userId)
    if (!jobMatch) {
      return res.status(404).json({ message: 'Job match not found' })
    }

    const improvedBullet = await improveResumeBullet(bulletText, jobMatch.jobDescription)

    jobMatch.improvedBullets.push(improvedBullet)
    await jobMatch.save()

    res.json({ improvedBullet })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong improving the bullet' })
  }
})

module.exports = router
