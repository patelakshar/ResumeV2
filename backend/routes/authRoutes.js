const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const requireAuth = require('../middleware/authMiddleware')

const router = express.Router()

// Small helper that builds a JWT for a given user id.
// We use this in both register and login so the token is made the same way.
function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// POST /api/auth/register
// Creates a new user: checks the email isn't already used, hashes the
// password with bcrypt, saves the user, and returns a JWT so the user
// is logged in right after registering.
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      passwordHash,
    })

    const token = createToken(newUser._id)

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong during registration' })
  }
})

// POST /api/auth/login
// Checks the email exists and the password matches the stored hash.
// If everything is correct, returns a JWT the frontend can use for
// future requests.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const token = createToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong during login' })
  }
})

// GET /api/auth/me
// Protected route used by the frontend to check who is currently logged
// in (for example, when the page refreshes and we still have a token
// saved in localStorage).
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// PUT /api/auth/change-password
// Protected route: checks the user's current password is correct, then
// hashes and saves the new one. Used by the Profile page.
router.put('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Something went wrong updating the password' })
  }
})

module.exports = router
