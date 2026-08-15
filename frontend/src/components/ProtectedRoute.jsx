import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'
import Skeleton from './Skeleton'

// Wraps a page that should only be visible to logged-in users, and
// adds the shared navigation bar above it. While we're still checking
// for a saved login, show a loading skeleton instead of the page.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-8">
        <Skeleton className="h-10 w-40 mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default ProtectedRoute
