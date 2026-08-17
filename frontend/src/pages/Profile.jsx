import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/axios'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'

// Page showing the logged-in user's info and a form to change their password.
function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Sends the current + new password to the backend so it can update it.
  async function handleChangePassword(e) {
    e.preventDefault()
    setMessage('')
    setError('')
    setSaving(true)

    try {
      await api.put('/auth/change-password', { currentPassword, newPassword })
      setMessage('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnimatedCard className="p-6 mb-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <p className="text-slate-500 text-sm">Name</p>
                  <p className="text-slate-800 font-medium text-lg">{user?.name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Email</p>
                  <p className="text-slate-800 font-medium text-lg">{user?.email}</p>
                </div>
              </motion.div>
            </AnimatedCard>
          </motion.div>

          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatedCard className="p-6">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold text-slate-800 mb-4"
              >
                Change Password
              </motion.h2>

              <form onSubmit={handleChangePassword}>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm p-3 rounded-lg mb-4"
                  >
                    {message}
                  </motion.div>
                )}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <div>
                    <motion.label
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="block text-sm text-slate-600 mb-1"
                    >
                      Current Password
                    </motion.label>
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.65 }}
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <motion.label
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="block text-sm text-slate-600 mb-1"
                    >
                      New Password
                    </motion.label>
                    <motion.input
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.75 }}
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white"
                      required
                    />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <MotionButton
                      type="submit"
                      disabled={saving}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg py-3 hover:shadow-lg shadow-purple-500/30 disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Update Password'}
                    </MotionButton>
                  </motion.div>
                </motion.div>
              </form>
            </AnimatedCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
