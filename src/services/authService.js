import apiClient from '../api/client'

const ENDPOINTS = Object.freeze({
  login: '/api/autenticacion/login',
  recoverPassword: '/api/autenticacion/recuperar-contrasena',
  resetPassword: '/api/autenticacion/restablecer-contrasena',
})

const authService = {
  login(correo, contrasena) {
    return apiClient.post(ENDPOINTS.login, { correo, contrasena }, { auth: false })
  },

  recoverPassword(correo) {
    return apiClient.post(ENDPOINTS.recoverPassword, { correo }, { auth: false })
  },

  resetPassword(token, contrasena) {
    return apiClient.post(ENDPOINTS.resetPassword, { token, contrasena }, { auth: false })
  },
}

export default authService
