import apiClient from '../api/client'

const reportsService = {
  downloadReceipt(id) {
    return apiClient.get(`/api/Reportes/descargar/recibo/${encodeURIComponent(id)}`, {
      responseType: 'blob',
      headers: { Accept: 'application/pdf' },
    })
  },
}

export default reportsService
