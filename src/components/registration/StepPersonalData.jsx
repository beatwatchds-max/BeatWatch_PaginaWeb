import { useState } from 'react'
import { useNavigate } from 'react-router'
import { CreditCard, ArrowRight, AlertCircle } from 'lucide-react'
import useRegistrationStore from '../../store/registrationStore'
import registrationService from '../../services/registrationService'


export default function StepPersonalData() {
  const navigate = useNavigate()
  const setUsuarioData = useRegistrationStore((state) => state.setUsuarioData)

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    password: '',
    empresa: '',
    rfc: '',
    direccion: '',
    ciudad: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio'
        if (value.trim().length < 2) return 'Mínimo 2 caracteres'
        if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/.test(value.trim())) return 'Solo letras y espacios'
        return ''
      case 'email':
        if (!value.trim()) return 'El correo es obligatorio'
        if (!emailRegex.test(value)) return 'Formato de correo inválido'
        return ''
      case 'telefono':
        if (!value.trim()) return 'El teléfono es obligatorio'
        if (!/^\d{10}$/.test(value)) return 'Teléfono inválido (10 dígitos)'
        return ''
      case 'password':
        if (!value) return 'La contraseña es obligatoria'
        if (value.length < 8) return 'Mínimo 8 caracteres'
        return ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')

    const requiredFields = ['nombre', 'email', 'telefono', 'password']
    const newErrors = {}
    let hasError = false

    requiredFields.forEach((field) => {
      const error = validate(field, form[field])
      newErrors[field] = error
      if (error) hasError = true
    })

    setErrors(newErrors)
    setTouched(requiredFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}))

    if (hasError) return

    setLoading(true)

    try {
      const data = await registrationService.register({
        nombre: form.nombre,
        correo: form.email,
        telefono: form.telefono,
        contrasena: form.password,
        empresaOrganizacion: form.empresa || '',
        rfc: form.rfc || '',
        direccion: form.direccion || '',
        ciudadEstado: form.ciudad || '',
      })

      const usuarioId = data?.usuarioId || data?.id || data?.data?.usuarioId || data?.data?.id
      if (!usuarioId) throw new Error('El servidor no devolvió el identificador del usuario')

      setUsuarioData(usuarioId, form.email)
      navigate('/registro/pago')
    } catch (err) {
      setApiError(err.message || 'No se pudo crear la cuenta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const getInputClass = (name) => {
    const base = 'border rounded-lg px-4 py-2 text-sm focus:outline-none w-full transition-all duration-300 ease-in-out'
    if (errors[name] && touched[name]) {
      return `${base} border-red-400 focus:ring-2 focus:ring-red-400`
    }
    return `${base} border-slate-300 focus:ring-2 focus:ring-blue-500`
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Datos del Titular</h2>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fade-in">
              {apiError}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Juan Pérez García"
                required
                maxLength={100}
                onKeyPress={(e) => { if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]/.test(e.key)) e.preventDefault() }}
                className={getInputClass('nombre')}
              />
            {errors.nombre && touched.nombre && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3 h-3" />
                {errors.nombre}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="correo@ejemplo.com"
                required
                onKeyPress={(e) => { if (/[áéíóúñÁÉÍÓÚÑ]/.test(e.key)) e.preventDefault() }}
                className={getInputClass('email')}
              />
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="5512345678"
                required
                maxLength={10}
                onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault() }}
                className={getInputClass('telefono')}
              />
              {errors.telefono && touched.telefono && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {errors.telefono}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              required
              minLength={8}
              className={getInputClass('password')}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-4">
              Datos Fiscales / Empresa (Opcional)
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Empresa u Organización</label>
                  <input
                    type="text"
                    name="empresa"
                    value={form.empresa}
                    onChange={handleChange}
                    placeholder="Nombre de la empresa"
                    maxLength={100}
                    onKeyPress={(e) => { if (/[áéíóúñÁÉÍÓÚÑ]/.test(e.key)) e.preventDefault() }}
                    className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full transition-all duration-300 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">RFC</label>
                  <input
                    type="text"
                    name="rfc"
                    value={form.rfc}
                    onChange={(e) => setForm((prev) => ({ ...prev, rfc: e.target.value.toUpperCase() }))}
                    onBlur={handleBlur}
                    placeholder="XAXX010101000"
                    maxLength={13}
                    onKeyPress={(e) => { if (!/[a-zA-Z0-9]/.test(e.key)) e.preventDefault() }}
                    className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                  <input
                    type="text"
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Calle, número, colonia"
                    maxLength={200}
                    className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full transition-all duration-300 ease-in-out"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ciudad / Estado</label>
                  <input
                    type="text"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={handleChange}
                    placeholder="Ciudad de México, CDMX"
                    maxLength={100}
                    onKeyPress={(e) => { if (/[áéíóúñÁÉÍÓÚÑ]/.test(e.key)) e.preventDefault() }}
                    className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full transition-all duration-300 ease-in-out"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 font-medium transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? 'Creando cuenta...' : 'Continuar'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  )
}
