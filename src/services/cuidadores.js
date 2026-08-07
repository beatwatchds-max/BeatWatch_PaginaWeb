import apiClient from '../api/client'

const ENDPOINTS = Object.freeze({
  list: '/api/Usuarios',

  registerCuidador:
    '/api/Usuarios/registrar-cuidador',

  cuidadoresDisponibles:
    '/api/Usuarios/cuidadores-disponibles',

  remove: (id) =>
    `/api/Usuarios/${encodeURIComponent(id)}`,
})

const usersService = {
  list() {
    return apiClient.get(ENDPOINTS.list)
  },

  getCuidadoresDisponibles() {
    return apiClient.get(
      ENDPOINTS.cuidadoresDisponibles
    )
  },

  registerCuidador(payload) {
    if (!payload) {
      throw new Error(
        'Los datos del cuidador son obligatorios'
      )
    }

    return apiClient.post(
      ENDPOINTS.registerCuidador,
      payload
    )
  },

  remove(id) {
    if (!id) {
      throw new Error(
        'El ID del usuario es obligatorio'
      )
    }

    return apiClient.delete(
      ENDPOINTS.remove(id)
    )
  },
}

export default usersService