import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

// This component wraps the whole app and keeps track of who is logged
// in, so any page can ask "is someone logged in right now?".
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Runs once when the app first loads. If we have a saved token, ask
  // the backend who it belongs to, so a page refresh doesn't log the
  // user out.
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user)
      })
      .catch(() => {
        localStorage.removeItem('token')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Sends the register form data to the backend, then saves the token
  // and user we get back so the person is logged in right away.
  async function register(name, email, password) {
    const res = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  // Sends the login form data to the backend, then saves the token and
  // user we get back.
  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  // Removes the saved token and clears the user, which logs the person
  // out of the app.
  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Shortcut so pages/components can get { user, login, ... } without
// importing useContext and AuthContext every time.
export function useAuth() {
  return useContext(AuthContext)
}
