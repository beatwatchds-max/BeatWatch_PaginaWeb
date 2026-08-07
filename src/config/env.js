function normalizeBaseUrl(value) {
  return (value || '').trim().replace(/\/+$/, '')
}

export const env = Object.freeze({
  apiBaseUrl: normalizeBaseUrl(import.meta.env.VITE_API_URL),
  freeLicenseMethod: (import.meta.env.VITE_FREE_LICENSE_METHOD || 'Gratuito').trim(),
})

export function getApiBaseUrl() {
  if (!env.apiBaseUrl) {
    throw new Error(
      'VITE_API_URL no está configurada. Define la URL del backend en las variables de entorno.',
    )
  }

  return env.apiBaseUrl
}
