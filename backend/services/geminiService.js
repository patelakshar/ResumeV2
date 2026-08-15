const { GoogleGenAI } = require('@google/genai')

// One shared Gemini client for the whole app, built using the API key
// from our .env file. This key is never sent to the frontend.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Builds the exact prompt we send to Gemini. It includes the resume
// text and lists every JSON field we need back, so the AI's answer
// lines up with our Analysis model.
function buildAnalysisPrompt(resumeText) {
  return `You are an ATS (Applicant Tracking System) resume analyzer.
Read the resume text below and return ONLY a JSON object (no markdown, no extra text) with these exact fields:

- atsScore: number from 0 to 100, how well this resume would score in an ATS system
- skills: array of strings, skills found in the resume
- missingSkills: array of strings, common skills for this type of role that seem to be missing
- keywords: array of strings, important keywords found in the resume
- missingKeywords: array of strings, important keywords that seem to be missing
- strengths: array of strings, strengths of this resume
- weaknesses: array of strings, weaknesses of this resume
- grammarSuggestions: array of strings, grammar or formatting fixes
- improvementSuggestions: array of strings, ways to improve the resume

Resume text:
"""
${resumeText}
"""`
}

// Gemini sometimes wraps its JSON reply in a markdown code fence even
// when we ask it not to. This strips that off before we try to parse
// the text as JSON.
function cleanJsonText(rawText) {
  return rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim()
}

// Sends the resume text to Gemini and turns its reply into a plain
// JavaScript object. We ask Gemini to reply with JSON only, but we
// still strip markdown code fences just in case it adds them anyway.
async function analyzeResumeText(resumeText) {
  const prompt = buildAnalysisPrompt(resumeText)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  })

  return JSON.parse(cleanJsonText(response.text.trim()))
}

// Builds the prompt we send to Gemini for job matching. It includes
// both the resume text and the pasted job description, and lists the
// exact JSON fields we need back so they line up with our JobMatch model.
function buildJobMatchPrompt(resumeText, jobDescription) {
  return `You are a career advisor comparing a resume against a job description.
Read both texts below and return ONLY a JSON object (no markdown, no extra text) with these exact fields:

- matchScore: number from 0 to 10, how well this resume matches the job description ("should I apply" score)
- missingSkillsForJob: array of strings, skills the job asks for that are missing from the resume
- expectedSalaryRange: string, a realistic expected salary range for this role based on the job description
- recommendation: string, must be exactly one of "Apply", "Improve first", or "Not a fit"
- verdict: string, a short, encouraging one-line verdict for the candidate, for example "You should apply!" for a strong match or "Not quite a fit yet" for a weak one. Keep the tone supportive, never harsh, no matter the score.
- verdictReasons: array of 2 to 3 short strings explaining the verdict, based on the match score and missing skills

Resume text:
"""
${resumeText}
"""

Job description:
"""
${jobDescription}
"""`
}

// Sends the resume text and job description to Gemini and turns its
// reply into a plain JavaScript object, the same way analyzeResumeText does.
async function matchResumeToJob(resumeText, jobDescription) {
  const prompt = buildJobMatchPrompt(resumeText, jobDescription)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  })

  return JSON.parse(cleanJsonText(response.text.trim()))
}

// Builds the prompt asking Gemini to rewrite a resume for one specific
// job, weaving in any extra skills the user tells us they have.
function buildRewritePrompt(resumeText, jobDescription, additionalSkills) {
  const skillsList =
    additionalSkills && additionalSkills.length > 0 ? additionalSkills.join(', ') : 'none specified'

  return `You are a professional resume writer.
Rewrite the resume below so it is better tailored to the job description below.
Naturally weave in these additional skills the candidate says they have, but only where they truthfully fit - do not invent job history, companies, or dates that are not in the original resume: ${skillsList}.
Return ONLY a JSON object (no markdown, no extra text) with one field:

- rewrittenResume: string, the full rewritten resume text

Original resume text:
"""
${resumeText}
"""

Job description:
"""
${jobDescription}
"""`
}

// Sends the rewrite prompt to Gemini and returns the rewritten resume
// text as a plain string.
async function rewriteResumeForJob(resumeText, jobDescription, additionalSkills) {
  const prompt = buildRewritePrompt(resumeText, jobDescription, additionalSkills)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  })

  const parsed = JSON.parse(cleanJsonText(response.text.trim()))
  return parsed.rewrittenResume
}

// Builds the prompt asking Gemini to write a tailored cover letter.
function buildCoverLetterPrompt(resumeText, jobDescription) {
  return `You are a professional cover letter writer.
Using the resume and job description below, write a tailored, professional cover letter (3 to 4 short paragraphs).
Return ONLY a JSON object (no markdown, no extra text) with one field:

- coverLetter: string, the full cover letter text

Resume text:
"""
${resumeText}
"""

Job description:
"""
${jobDescription}
"""`
}

// Sends the cover letter prompt to Gemini and returns the cover letter
// text as a plain string.
async function generateCoverLetter(resumeText, jobDescription) {
  const prompt = buildCoverLetterPrompt(resumeText, jobDescription)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  })

  const parsed = JSON.parse(cleanJsonText(response.text.trim()))
  return parsed.coverLetter
}

// Builds the prompt asking Gemini to write a short cold outreach email
// to an HR person or recruiter about a specific job.
function buildOutreachEmailPrompt(resumeText, jobDescription) {
  return `You are a career coach helping a candidate write a cold outreach email to an HR person or recruiter about a specific job.
Using the resume and job description below, write a short, professional, friendly outreach email (under 150 words, including a "Subject:" line at the top).
Return ONLY a JSON object (no markdown, no extra text) with one field:

- outreachEmail: string, the full email text including the subject line

Resume text:
"""
${resumeText}
"""

Job description:
"""
${jobDescription}
"""`
}

// Sends the outreach email prompt to Gemini and returns the email
// text as a plain string.
async function generateOutreachEmail(resumeText, jobDescription) {
  const prompt = buildOutreachEmailPrompt(resumeText, jobDescription)

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
    },
  })

  const parsed = JSON.parse(cleanJsonText(response.text.trim()))
  return parsed.outreachEmail
}

module.exports = {
  analyzeResumeText,
  matchResumeToJob,
  rewriteResumeForJob,
  generateCoverLetter,
  generateOutreachEmail,
}
