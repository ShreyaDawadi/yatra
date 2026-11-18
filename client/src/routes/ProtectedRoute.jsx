import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Spinner from '../components/common/Spinner'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Spinner fullPage />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  return children
}

export default ProtectedRoute
