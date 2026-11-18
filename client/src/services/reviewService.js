import apiClient from './apiClient'

export const reviewService = {
  recent: () => apiClient.get('/api/reviews/recent').then((res) => res.data),
  mine: () => apiClient.get('/api/reviews/me').then((res) => res.data),
  eligibility: (listingId) => apiClient.get(`/api/reviews/eligibility/${listingId}`).then((res) => res.data),
  update: (id, data) => apiClient.patch(`/api/reviews/${id}`, data).then((res) => res.data.review),
  remove: (id) => apiClient.delete(`/api/reviews/${id}`),
}
