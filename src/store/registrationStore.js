import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const initialState = {
  usuarioId: null,
  correo: '',
  tipoLicencia: 'Grupal',
  licenciaId: null,
  step1Completed: false,
  step2Completed: false,
}

const useRegistrationStore = create(
  persist(
    (set) => ({
      ...initialState,
      setUsuarioData: (usuarioId, correo) => set({ usuarioId, correo, step1Completed: true }),
      setStep2Completed: () => set({ step2Completed: true }),
      setLicenciaId: (licenciaId) => set({ licenciaId }),
      clearRegistration: () => set(initialState),
    }),
    {
      name: 'beatwatch-registration',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export default useRegistrationStore
