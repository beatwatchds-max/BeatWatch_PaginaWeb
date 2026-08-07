import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Mail, ShieldCheck, AlertCircle, KeyRound } from 'lucide-react'
import useRegistrationStore from '../../store/registrationStore'
import licensesService from '../../services/licensesService'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StepPayment() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [emailError, setEmailError] = useState('')

  const {
    usuarioId,
    correo,
    tipoLicencia,
    setLicenciaId,
    setStep2Completed,
  } = useRegistrationStore()

  const [email, setEmail] = useState(correo || '')

  const features = [
    'Monitoreo 24/7 en tiempo real',
    'Detección de arritmias con IA',
    'Alertas automáticas por SMS',
    'Dashboard de salud personal',
    'Historial de 30 días',
    'Soporte por chat',
  ]

  const validateEmail = () => {
    if (!email.trim()) return 'El correo es obligatorio'
    if (!emailRegex.test(email)) return 'Formato de correo inválido'
    return ''
  }

  const handleActivate = async () => {
    setApiError('')
    const validationError = validateEmail()
    setEmailError(validationError)
    if (validationError) return

    if (!usuarioId) {
      setApiError('No se encontró el registro del usuario. Vuelve al paso anterior.')
      return
    }

    setLoading(true)

    try {
      const data = await licensesService.activateFreeLicense({
        usuarioId,
        tipoLicencia,
        correo: email,
      })

      const id =
        data?.licencia?.id ||
        data?.licenciaId ||
        data?.id ||
        data?.data?.licencia?.id ||
        data?.data?.licenciaId ||
        data?.data?.id

      if (id) setLicenciaId(id)
      setStep2Completed()
      navigate('/registro/confirmacion')
    } catch (err) {
      setApiError(err.message || 'No se pudo activar la licencia. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Activar licencia</h2>
              <p className="text-sm text-slate-500 mt-1">
                El plan actual es gratuito. No solicitamos ni almacenamos datos de tarjeta.
              </p>
            </div>
          </div>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
              {apiError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="license-email" className="block text-sm font-medium text-slate-700 mb-1">
                Correo para confirmación
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="license-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (emailError) setEmailError('')
                  }}
                  onBlur={() => setEmailError(validateEmail())}
                  autoComplete="email"
                  className={`border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none w-full ${
                    emailError
                      ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                      : 'border-slate-300 focus:ring-2 focus:ring-blue-500'
                  }`}
                  placeholder="correo@ejemplo.com"
                />
              </div>
              {emailError && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </p>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Flujo de pago endurecido</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Este formulario no captura PAN, fecha de expiración ni CVV. Los futuros pagos de importe mayor a cero deben usar tokenización del proveedor de pagos.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleActivate}
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? 'Activando...' : 'Activar plan gratuito'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-fit">
          <h3 className="font-bold text-slate-800 mb-4">Resumen</h3>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-sm text-slate-600">Plan {tipoLicencia}</span>
            <span className="text-sm font-semibold text-slate-800">Gratis</span>
          </div>
          <div className="flex justify-between items-center py-3 font-bold">
            <span className="text-slate-800">Total</span>
            <span className="text-slate-800">$0.00</span>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-2">
            <p className="text-xs text-slate-400 font-medium mb-3">Incluye:</p>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
