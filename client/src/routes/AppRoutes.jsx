import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import DiscoveryPage from '../pages/DiscoveryPage'
import PlaceholderPage from '../pages/PlaceholderPage'
import NotFoundPage from '../pages/NotFoundPage'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="explore" element={<DiscoveryPage key="all" type="" />} />
        <Route path="treks" element={<DiscoveryPage key="trek" type="trek" />} />
        <Route path="hotels" element={<DiscoveryPage key="hotel" type="hotel" />} />
        <Route path="tours" element={<DiscoveryPage key="sightseeing" type="sightseeing" />} />

        <Route path="listings/:id" element={<PlaceholderPage name="detail" />} />
        <Route
          path="book/:id"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="booking" />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<PlaceholderPage name="login" />} />
        <Route path="signup" element={<PlaceholderPage name="signup" />} />
        <Route path="forgot-password" element={<PlaceholderPage name="forgotPassword" />} />
        <Route path="reset-password" element={<PlaceholderPage name="resetPassword" />} />

        <Route
          path="dashboard/*"
          element={
            <ProtectedRoute>
              <PlaceholderPage name="dashboard" />
            </ProtectedRoute>
          }
        />

        <Route path="about" element={<PlaceholderPage name="about" />} />
        <Route path="contact" element={<PlaceholderPage name="contact" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
