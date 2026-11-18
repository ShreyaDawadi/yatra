import apiClient from './apiClient'

export const bookingService = {
  create: (data) => apiClient.post('/api/bookings', data).then((res) => res.data.booking),
  mine: () => apiClient.get('/api/bookings/me').then((res) => res.data),
  cancel: (id) => apiClient.patch(`/api/bookings/${id}/cancel`).then((res) => res.data.booking),
}
