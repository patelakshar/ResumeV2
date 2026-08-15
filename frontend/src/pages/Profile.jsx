import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import AnimatedCard from '../components/AnimatedCard'
import MotionButton from '../components/MotionButton'

// Page showing the logged-in user's info and a form to change their password.
function Profile() {
  const { user } = useAuth()
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
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold text-slate-800 mb-6">Profile</h1>

          <AnimatedCard className="p-6 mb-6">
            <p className="text-slate-500 text-sm">Name</p>
            <p className="text-slate-800 font-medium mb-3">{user?.name}</p>
            <p className="text-slate-500 text-sm">Email</p>
            <p className="text-slate-800 font-medium">{user?.email}</p>
          </AnimatedCard>

          <AnimatedCard className="p-6" delay={0.1}>
            <form onSubmit={handleChangePassword}>
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Change Password</h2>

              {message && (
                <div className="bg-green-100 text-green-800 text-sm p-2 rounded mb-4">
                  {message}
                </div>
              )}
              {error && (
                <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</div>
              )}

              <label className="block text-sm text-slate-600 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 mb-4"
                required
              />

              <label className="block text-sm text-slate-600 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 mb-6"
                required
              />

              <MotionButton
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 text-white rounded py-2 hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Update Password'}
              </MotionButton>
            </form>
          </AnimatedCard>
        </div>
      </div>
    </div>
  )
}

export default Profile
