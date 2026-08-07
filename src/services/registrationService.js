import apiClient from '../api/client'

const ENDPOINTS = Object.freeze({
  register: '/api/autenticacion/registrar',
})

const registrationService = {
  register(payload) {
    return apiClient.post(ENDPOINTS.register, payload, { auth: false })
  },
}

export default registrationService
