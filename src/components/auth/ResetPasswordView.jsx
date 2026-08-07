import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Heart, Lock, ArrowLeft, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react'
import authService from '../../services/authService'


function getPasswordStrength(pw) {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { label: 'Débil', color: 'bg-red-500', width: '25%' }
  if (score === 2) return { label: 'Regular', color: 'bg-amber-500', width: '50%' }
  if (score === 3) return { label: 'Buena', color: 'bg-blue-500', width: '75%' }
  return { label: 'Fuerte', color: 'bg-emerald-500', width: '100%' }
}

export default function ResetPasswordView() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!token) {
      setError('Token no proporcionado. Solicita un nuevo enlace de recuperación.')
    }
  }, [token])

  useEffect(() => {
    if (!success) return
    if (countdown <= 0) {
      window.location.href = '/login'
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [success, countdown])

  const validate = (name, value) => {
    switch (name) {
      case 'password':
        if (!value) return 'La contraseña es obligatoria'
        if (value.length < 8) return 'Mínimo 8 caracteres'
        return ''
      case 'confirmPassword':
        if (!value) return 'Confirma tu contraseña'
        if (value !== password) return 'Las contraseñas no coinciden'
        return ''
      default:
        return ''
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setFieldErrors((prev) => ({ ...prev, [name]: validate(name, value) }))
  }

  const getInputClass = (name) => {
    const base = 'border rounded-lg py-2 text-sm focus:outline-none w-full transition-all duration-300 ease-in-out'
    if (fieldErrors[name] && touched[name]) return `${base} border-red-400 focus:ring-2 focus:ring-red-400`
    return `${base} border-slate-300 focus:ring-2 focus:ring-blue-500`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const requiredFields = ['password', 'confirmPassword']
    const newErrors = {}
    let hasError = false
    requiredFields.forEach((field) => {
      const val = field === 'password' ? password : confirmPassword
      const err = validate(field, val)
      newErrors[field] = err
      if (err) hasError = true
    })
    setFieldErrors(newErrors)
    setTouched(requiredFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}))
    if (hasError) return

    setLoading(true)

    try {
      await authService.resetPassword(token, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'No se pudo restablecer la contraseña. Intenta de nuevo.')
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
            Establece una nueva contraseña para tu cuenta de monitoreo cardíaco.
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

          {success ? (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Contraseña Restablecida</h2>
              <p className="text-slate-500 mb-8">
                Tu contraseña ha sido actualizada correctamente. Serás redirigido al login en {countdown} segundos.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-lg px-6 py-2.5 font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Restablecer Contraseña</h2>
              <p className="text-slate-500 mb-8">
                Ingresa tu nueva contraseña para acceder a tu cuenta.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6 animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (touched.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: validate('confirmPassword', confirmPassword) })) }}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`${getInputClass('password')} pl-10 pr-10`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && touched.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.password}
                    </p>
                  )}
                  {password && (
                    <div className="mt-2">
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${getPasswordStrength(password).color}`} style={{ width: getPasswordStrength(password).width }} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Fortaleza: {getPasswordStrength(password).label}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`${getInputClass('confirmPassword')} pl-10 pr-10`}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && touched.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />{fieldErrors.confirmPassword}
                    </p>
                  )}
                  {confirmPassword && !fieldErrors.confirmPassword && touched.confirmPassword && (
                    <p className="text-emerald-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <CheckCircle className="w-3 h-3" />Las contraseñas coinciden
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                </button>
              </form>
            </>
          )}

          <Link
            to="/"
            className="block text-center text-sm text-slate-400 hover:text-slate-600 transition-colors mt-8"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
