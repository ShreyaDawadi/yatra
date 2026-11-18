import axios from 'axios'

const TOKEN_KEY = 'yatra_token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // Storage unavailable: the user stays logged in until the page reloads.
  }
}

export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? null
    const message =
      error.response?.data?.error ||
      (error.response ? 'Something went wrong. Please try again.' : 'Cannot reach the server. Please check your connection.')

    const apiError = new Error(message)
    apiError.status = status

    const sentToken = Boolean(error.config?.headers?.Authorization)
    const isPasswordCheck = error.config?.url?.endsWith('/auth/me/password')
    if (status === 401 && sentToken && !isPasswordCheck) {
      window.dispatchEvent(new Event('yatra:unauthorized'))
    }

    return Promise.reject(apiError)
  },
)

export default apiClient
