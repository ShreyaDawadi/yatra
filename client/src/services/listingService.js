import apiClient, { cleanParams } from './apiClient'

export const listingService = {
  list: (params) => apiClient.get('/api/listings', { params: cleanParams(params) }).then((res) => res.data),
  get: (id) => apiClient.get(`/api/listings/${id}`).then((res) => res.data),
  rooms: (id, params) =>
    apiClient.get(`/api/listings/${id}/rooms`, { params: cleanParams(params) }).then((res) => res.data),
  reviews: (id) => apiClient.get(`/api/listings/${id}/reviews`).then((res) => res.data),
  addReview: (id, data) => apiClient.post(`/api/listings/${id}/reviews`, data).then((res) => res.data.review),
}
