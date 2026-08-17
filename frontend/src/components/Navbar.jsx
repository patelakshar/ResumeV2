import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Navigation links configuration
const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/upload', label: 'Upload', icon: 'upload' },
  { path: '/jobmatch', label: 'Job Match', icon: 'job' },
  { path: '/history', label: 'History', icon: 'history' },
  { path: '/profile', label: 'Profile', icon: 'profile' },
]

// Icon component for nav links
function NavIcon({ icon }) {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    upload: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    job: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    history: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    profile: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
  }

  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {icons[icon]}
    </svg>
  )
}

// Enhanced Navbar with page index indicators and visible user name
function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Get current page name for highlighting
  const getCurrentPageLabel = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/upload') return 'Upload'
    if (path === '/jobmatch') return 'Job Match'
    if (path === '/history') return 'History'
    if (path === '/profile') return 'Profile'
    return ''
  }

  // Clears the saved login and sends the user back to the login page.
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 bg-gradient-to-br from-teal-600 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-slate-900">Resume Analyser</span>
              <span className="text-xs text-slate-500 tracking-wide">
                by Shivangi Parmar
              </span>
            </div>
          </motion.div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1 bg-white/70">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path
              return (
                <motion.div
                  key={link.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-600 to-purple-600 text-white shadow-md shadow-teal-500/30'
                        : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                    }`}
                  >
                    <NavIcon icon={link.icon} />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Current Page Indicator */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="hidden md:block px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl text-sm font-medium text-slate-800"
            >
              {getCurrentPageLabel() || 'Dashboard'}
            </motion.span>

            {/* User Name & Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-slate-900">{user?.name}</span>
            </motion.div>

            {/* Logout Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg shadow-rose-500/30 transition-shadow"
              >
                Log out
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// Motion-enabled Link component
export const MotionLink = motion.create(Link)

export default Navbar
