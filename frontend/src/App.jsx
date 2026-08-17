import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import ResumeAnalysis from './pages/ResumeAnalysis'
import JobMatching from './pages/JobMatching'
import JobFinder from './pages/JobFinder'
import History from './pages/History'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'

// Defines every page in the app and which URL shows it. Each page is
// wrapped in PageTransition, and AnimatePresence watches the current
// URL so switching routes fades/slides smoothly instead of just
// popping the new page in.
function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <Register />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Dashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ResumeUpload />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ResumeAnalysis />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobmatch"
          element={
            <ProtectedRoute>
              <PageTransition>
                <JobMatching />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/find-jobs"
          element={
            <ProtectedRoute>
              <PageTransition>
                <JobFinder />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <PageTransition>
                <History />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App
