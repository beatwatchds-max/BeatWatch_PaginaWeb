import apiClient from '../api/client'

const ENDPOINTS = Object.freeze({
  list: '/api/Dispositivos',
  pair: '/api/Dispositivos/emparejar',
})

const devicesService = {
  list() {
    return apiClient.get(ENDPOINTS.list)
  },

  pair(payload) {
    return apiClient.post(ENDPOINTS.pair, payload)
  },

  remove(id) {
    return apiClient.delete(`/api/Dispositivos/${encodeURIComponent(id)}`)
  },
}

export default devicesService
