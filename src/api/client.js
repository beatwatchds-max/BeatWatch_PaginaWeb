import { getApiBaseUrl } from '../config/env'
import useAuthStore from '../store/authStore'

const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH'])

function normalizeEndpoint(endpoint) {
  if (!endpoint) throw new Error('El endpoint es obligatorio')
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
}

function buildHeaders(method, body, customHeaders = {}, auth = true) {
  const headers = {
    Accept: 'application/json',
    ...customHeaders,
  }

  if (BODY_METHODS.has(method) && body != null && !(body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  if (auth) {
    const token = useAuthStore.getState().token
    if (token) headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function parseResponse(response, responseType) {
  if (response.status === 204) return null
  if (responseType === 'blob') return response.blob()
  if (responseType === 'text') return response.text()

  const text = await response.text()
  if (!text) return null

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(text)
    } catch {
      throw new Error('El servidor devolviÃ³ JSON invÃ¡lido')
    }
  }

  return text
}

function getErrorMessage(payload, response) {
  if (payload && typeof payload === 'object') {
    return payload.message || payload.mensaje || payload.error || `Error ${response.status}`
  }

  return payload || response.statusText || `Error ${response.status}`
}

async function request(
  method,
  endpoint,
  {
    body,
    headers: customHeaders,
    auth = true,
    responseType = 'json',
    signal,
  } = {},
) {
  const url = `${getApiBaseUrl()}${normalizeEndpoint(endpoint)}`
  const config = {
    method,
    headers: buildHeaders(method, body, customHeaders, auth),
    signal,
  }

  if (body != null && BODY_METHODS.has(method)) {
    config.body = body instanceof FormData ? body : JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, config)
  } catch (cause) {
    if (cause?.name === 'AbortError') throw cause

    const error = new Error('No fue posible conectarse con el servidor. Verifica tu conexiÃ³n.')
    error.status = 0
    error.cause = cause
    throw error
  }

  let payload
  try {
    payload = await parseResponse(response, responseType)
  } catch (parseError) {
    if (response.ok) throw parseError
    payload = null
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') window.location.assign('/login')
    }

    const error = new Error(getErrorMessage(payload, response))
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

const apiClient = {
  get: (endpoint, options) => request('GET', endpoint, options),
  post: (endpoint, body, options) => request('POST', endpoint, { ...options, body }),
  put: (endpoint, body, options) => request('PUT', endpoint, { ...options, body }),
  patch: (endpoint, body, options) => request('PATCH', endpoint, { ...options, body }),
  delete: (endpoint, options) => request('DELETE', endpoint, options),
}

export default apiClient
