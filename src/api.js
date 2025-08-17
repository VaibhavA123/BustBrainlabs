import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE || 'http://localhost:5000/api',
  withCredentials: true
})

// attach token from localStorage
api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem('token')
  if (t) cfg.headers = { ...cfg.headers, Authorization: `Bearer ${t}` }
  return cfg
})