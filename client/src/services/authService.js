import apiClient from './apiClient'

export const authService = {
  signup: (data) => apiClient.post('/api/auth/signup', data).then((res) => res.data),
  login: (data) => apiClient.post('/api/auth/login', data).then((res) => res.data),
  me: () => apiClient.get('/api/auth/me').then((res) => res.data.user),
  updateProfile: (data) => apiClient.patch('/api/auth/me', data).then((res) => res.data.user),
  changePassword: (data) => apiClient.patch('/api/auth/me/password', data).then((res) => res.data),
  forgotPassword: (email) => apiClient.post('/api/auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (data) => apiClient.post('/api/auth/reset-password', data).then((res) => res.data),
}
