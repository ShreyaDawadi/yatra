import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authService } from '../services/authService'
import { getToken, setToken } from '../services/apiClient'

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) {
      return
    }

    let cancelled = false
    authService
      .me()
      .then((me) => {
        if (!cancelled) setUser(me)
      })
      .catch(() => {
        if (!cancelled) {
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function handleUnauthorized() {
      setToken(null)
      setUser(null)
    }
    window.addEventListener('yatra:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('yatra:unauthorized', handleUnauthorized)
  }, [])

  const login = useCallback(async (credentials) => {
    const { user: loggedIn, token } = await authService.login(credentials)
    setToken(token)
    setUser(loggedIn)
    return loggedIn
  }, [])

  const signup = useCallback(async (details) => {
    const { user: created, token } = await authService.signup(details)
    setToken(token)
    setUser(created)
    return created
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, setUser }),
    [user, loading, login, signup, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
