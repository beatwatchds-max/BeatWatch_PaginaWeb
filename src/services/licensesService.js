import apiClient from '../api/client'
import { env } from '../config/env'

const ENDPOINTS = Object.freeze({
  process: '/api/Licencias/procesar-pago',
})

const licensesService = {
  activateFreeLicense({ usuarioId, tipoLicencia, correo }) {
    return apiClient.post(
      ENDPOINTS.process,
      {
        UsuarioId: usuarioId,
        TipoLicencia: tipoLicencia,
        MetodoPago: env.freeLicenseMethod,
        CorreoElectronico: correo,
      },
      { auth: false },
    )
  },
}

export default licensesService
