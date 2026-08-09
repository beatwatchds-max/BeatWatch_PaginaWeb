import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import authService from '../../services/authService'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginView() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})
  const navigate = useNavigate()

  const validate = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'El correo es obligatorio'
        if (!emailRegex.test(value)) return 'Formato de correo inválido'
        return ''
      case 'password':
        if (!value) return 'La contraseña es obligatoria'
        if (value.length < 8) return 'Mínimo 8 caracteres'
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
    if (fieldErrors[name] && touched[name]) {
      return `${base} border-red-400 focus:ring-2 focus:ring-red-400`
    }
    return `${base} border-slate-300 focus:ring-2 focus:ring-blue-500`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const requiredFields = ['email', 'password']
    const newErrors = {}
    let hasError = false
    requiredFields.forEach((field) => {
      const err = validate(field, field === 'email' ? email : password)
      newErrors[field] = err
      if (err) hasError = true
    })
    setFieldErrors(newErrors)
    setTouched(requiredFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}))
    if (hasError) return

    setLoading(true)

    try {
      const data = await authService.login(email, password)

      if (data?.ok === false || data?.success === false) {
        throw new Error(data.message || data.mensaje || 'Credenciales incorrectas')
      }

      const token = data?.token || data?.tokenGenerado || data?.data?.token || data?.accessToken || data?.access_token || data?.jwt

      if (!token) {
        throw new Error('Respuesta del servidor sin token')
      }

      useAuthStore.getState().setSession({
        user: data.user || data.data?.user || data.usuario || { correo: email, nombre: data.nombre, rol: data.rol },
        token,
        usuarioId: data.usuarioId || data.data?.usuarioId || null,
      })

      navigate('/dashboard/dispositivos')
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Intenta de nuevo.')
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
            Monitoreo cardíaco inteligente con inteligencia artificial en tiempo real.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-blue-600">BIT</span>
              <span className="text-rose-500">WATCH</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Iniciar Sesión</h2>
          <p className="text-slate-500 mb-8">Ingresa tus credenciales para acceder a tu cuenta.</p>

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
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="correo@ejemplo.com"
                  className={`${getInputClass('email')} pl-10 pr-4`}
                />
              </div>
              {fieldErrors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`${getInputClass('password')} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && touched.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/login/recuperar"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-slate-500">¿No tienes cuenta? </span>
            <Link
              to="/registro/cuenta"
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Crear cuenta
            </Link>
          </div>

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
