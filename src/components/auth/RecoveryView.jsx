import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import authService from '../../services/authService'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RecoveryView() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [touched, setTouched] = useState(false)

  const validate = (value) => {
    if (!value.trim()) return 'El correo es obligatorio'
    if (!emailRegex.test(value)) return 'Formato de correo inválido'
    return ''
  }

  const handleBlur = () => {
    setTouched(true)
    setFieldError(validate(email))
  }

  const getInputClass = () => {
    const base = 'border rounded-lg py-2 text-sm focus:outline-none w-full transition-all duration-300 ease-in-out'
    if (fieldError && touched) return `${base} border-red-400 focus:ring-2 focus:ring-red-400`
    return `${base} border-slate-300 focus:ring-2 focus:ring-blue-500`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setTouched(true)
    const err = validate(email)
    setFieldError(err)
    if (err) return

    setLoading(true)

    try {
      await authService.recoverPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message || 'No se pudo enviar el correo. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-rose-500 items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" fill="white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">BitWatch</h1>
          <p className="text-white/80 text-lg max-w-sm">
            Recupera el acceso a tu plataforma de monitoreo cardíaco.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <Link
            to="/login"
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>

          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Recuperar Contraseña</h2>
              <p className="text-slate-500 mb-8">
                Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6 animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="correo@ejemplo.com"
                      className={`${getInputClass()} pl-10 pr-4`}
                    />
                  </div>
                  {fieldError && touched && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      {fieldError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? 'Enviando...' : 'Enviar instrucciones'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Correo Enviado</h2>
              <p className="text-slate-500 mb-8">
                Hemos enviado las instrucciones de restablecimiento a <strong>{email}</strong>. Revisa tu bandeja de entrada.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
