const jwt = require('jsonwebtoken')

// This function runs before any "protected" route.
// It checks that the request has a valid JWT in the Authorization header.
// If the token is valid, it saves the user's id on req.userId so the
// route handler knows who is making the request.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = requireAuth
