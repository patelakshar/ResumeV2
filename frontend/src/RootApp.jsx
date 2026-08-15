import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import SplashScreen from './components/SplashScreen'
import App from './App'

// Shows the splash screen for a short moment when the app first
// loads, then swaps over to the real app so repeat visitors aren't
// stuck waiting on it every time.
function RootApp() {
  const [showSplash, setShowSplash] = useState(true)

  // Runs once when the app mounts and hides the splash screen after a
  // short delay.
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <BrowserRouter key="app">
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      )}
    </AnimatePresence>
  )
}

export default RootApp
