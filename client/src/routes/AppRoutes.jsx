import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import DiscoveryPage from '../pages/DiscoveryPage'
import ListingDetailPage from '../pages/ListingDetailPage'
import BookingPage from '../pages/BookingPage'
import LoginPage from '../pages/auth/LoginPage'
import SignupPage from '../pages/auth/SignupPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'
import OverviewPage from '../pages/dashboard/OverviewPage'
import BookingsPage from '../pages/dashboard/BookingsPage'
import SavedPage from '../pages/dashboard/SavedPage'
import MyReviewsPage from '../pages/dashboard/MyReviewsPage'
import ProfilePage from '../pages/dashboard/ProfilePage'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import CreditsPage from '../pages/CreditsPage'
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

        <Route path="listings/:id" element={<ListingDetailPage />} />
        <Route
          path="book/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="saved" element={<SavedPage />} />
          <Route path="reviews" element={<MyReviewsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="credits" element={<CreditsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
