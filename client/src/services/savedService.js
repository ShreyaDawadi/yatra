import apiClient from './apiClient'

export const savedService = {
  list: () => apiClient.get('/api/saved').then((res) => res.data),
  save: (listingId) => apiClient.post(`/api/saved/${listingId}`).then((res) => res.data),
  unsave: (listingId) => apiClient.delete(`/api/saved/${listingId}`),
}
