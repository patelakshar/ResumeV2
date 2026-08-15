const mongoose = require('mongoose')

// This schema describes what a User document looks like in MongoDB.
// We store passwordHash instead of the raw password so we never save
// a readable password anywhere.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('User', userSchema)
