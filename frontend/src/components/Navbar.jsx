import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import NavbarLink from './NavbarLink'
import MotionButton from './MotionButton'

// The brand link (logo + name) upgraded to a Framer Motion component so
// it can get its own subtle hover animation, same as the nav links.
const MotionLink = motion.create(Link)

// Top navigation bar shown on every page once the user is logged in.
// Lets them jump between the main pages and log out from anywhere.
function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Clears the saved login and sends the user back to the login page.
  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <MotionLink
          to="/dashboard"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2"
        >
          <Logo className="w-8 h-8 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="font-semibold text-lg">Resume Analyzer</span>
            <span className="text-[11px] text-indigo-300 tracking-wide">Shivangi ✕ KPGU</span>
          </span>
        </MotionLink>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <NavbarLink to="/dashboard">Dashboard</NavbarLink>
          <NavbarLink to="/upload">Upload</NavbarLink>
          <NavbarLink to="/jobmatch">Job Matching</NavbarLink>
          <NavbarLink to="/history">History</NavbarLink>
          <NavbarLink to="/profile">Profile</NavbarLink>
          <span className="text-slate-400 hidden sm:inline">{user?.name}</span>
          <MotionButton
            onClick={handleLogout}
            className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded"
          >
            Log out
          </MotionButton>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
