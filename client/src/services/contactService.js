import apiClient from './apiClient'

export const contactService = {
  subscribe: (email) => apiClient.post('/api/newsletter', { email }).then((res) => res.data),
  sendMessage: (data) => apiClient.post('/api/contact', data).then((res) => res.data),
}
