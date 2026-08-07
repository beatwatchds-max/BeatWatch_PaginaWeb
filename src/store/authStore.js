import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const AUTH_STORAGE_KEY = 'beatwatch-auth'

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null

  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function isExpired(token) {
  const payload = decodeJwtPayload(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 <= Date.now()
}

const emptySession = {
  user: null,
  token: null,
  usuarioId: null,
  isAuthenticated: false,
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...emptySession,
      isLoading: false,
      error: null,

      setSession: ({ user, token, usuarioId = null }) => {
        if (!token) throw new Error('No se puede crear una sesiÃ³n sin token')

        set({
          user: user || null,
          token,
          usuarioId,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      },

      logout: () => {
        set({ ...emptySession, isLoading: false, error: null })
      },

      checkAuth: () => {
        const token = get().token

        if (!token || isExpired(token)) {
          set({ ...emptySession, isLoading: false, error: null })
          return false
        }

        set({ isAuthenticated: true, isLoading: false, error: null })
        return true
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        usuarioId: state.usuarioId,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export default useAuthStore
