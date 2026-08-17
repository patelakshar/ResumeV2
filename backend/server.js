require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const resumeRoutes = require('./routes/resumeRoutes')
const jobMatchRoutes = require('./routes/jobMatchRoutes')
const historyRoutes = require('./routes/historyRoutes')
const jobRoutes = require('./routes/jobRoutes')

const app = express()

// Allow the frontend to make requests to this API. In production we
// lock this down to the deployed frontend URL (set FRONTEND_URL in
// the backend's environment variables). Locally, with no FRONTEND_URL
// set, we allow any origin so `npm run dev` just works.
app.use(cors({ origin: process.env.FRONTEND_URL || true }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/jobmatch', jobMatchRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/jobs', jobRoutes)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  })
