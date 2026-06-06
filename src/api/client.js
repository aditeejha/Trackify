import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const shipmentAPI = {
  getShipments: (params) => apiClient.get('/shipments', { params }),
  getShipmentById: (id) => apiClient.get(`/shipments/${id}`),
  createShipment: (data) => apiClient.post('/shipments', data),
  updateShipment: (id, data) => apiClient.put(`/shipments/${id}`, data),
  deleteShipment: (id) => apiClient.delete(`/shipments/${id}`),
}

export const trackingAPI = {
  getLocationHistory: (shipmentId) => apiClient.get(`/shipments/${shipmentId}/locations`),
  updateLocation: (shipmentId, data) => apiClient.post(`/shipments/${shipmentId}/location`, data),
}

export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (data) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

export default apiClient
