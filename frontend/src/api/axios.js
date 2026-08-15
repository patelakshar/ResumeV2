import axios from 'axios'

// The backend URL comes from an environment variable so we can point
// at localhost during development and at the deployed backend once
// this is live, without changing any code. VITE_API_URL is set in
// frontend/.env (see frontend/.env.example).
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// One shared axios instance so every part of the app talks to the same
// backend URL instead of repeating it everywhere.
const api = axios.create({
  baseURL,
})

// Before every request, check if we have a saved login token and attach
// it. This is how the backend knows which user is making the request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
