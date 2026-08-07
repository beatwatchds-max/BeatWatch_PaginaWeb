import { useEffect, useState } from 'react'
import {
  AlertCircle,
  Check,
  Copy,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import usersService from '../../services/usersService'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const USER_TYPES = Object.freeze({
  PACIENTE: 'paciente',
  CUIDADOR: 'cuidador',
})

function formatToken(token) {
  if (!token) return ''
  const str = String(token).padStart(9, '0')
  return `${str.slice(0, 3)} ${str.slice(3, 6)} ${str.slice(6, 9)}`
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const colorPalette = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
]

function getColor(index) {
  return colorPalette[index % colorPalette.length]
}

function getRoleClass(role) {
  const normalizedRole = String(role || '').toLowerCase()

  if (normalizedRole.includes('admin')) {
    return 'bg-amber-100 text-amber-700'
  }

  if (normalizedRole.includes('cuidador')) {
    return 'bg-emerald-100 text-emerald-700'
  }

  return 'bg-blue-100 text-blue-700'
}

export default function UsersView() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [tipoRegistro, setTipoRegistro] = useState(USER_TYPES.PACIENTE)

  const [form, setForm] = useState({
  nombreCompleto: '',
  correo: '',
  telefono: '',
  contrasena: '',
  confirmarContrasena: '',
})

  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const resetForm = () => {
    setForm({
      nombreCompleto: '',
      correo: '',
      telefono: '',
      contrasena: '',
      confirmarContrasena: '',
    })
    setFieldErrors({})
    setTouched({})
    setFormError('')
    setTipoRegistro(USER_TYPES.PACIENTE)
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await usersService.list()
      const list = Array.isArray(data)
        ? data
        : data?.datos || data?.data || data?.usuarios || data?.pacientes || []

      setUsers(list)
    } catch (err) {
      setError(err?.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const validate = (name, value) => {
    switch (name) {
      case 'nombreCompleto':
        if (!value.trim()) return 'El nombre es obligatorio'
        if (value.trim().length < 2) return 'MÃ­nimo 2 caracteres'
        if (!/^[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±ÃÃ‰ÃÃ“ÃšÃ‘\s]+$/.test(value.trim())) {
          return 'Solo letras y espacios'
        }
        return ''

      case 'correo':
        if (!value.trim()) return 'El correo es obligatorio'
        if (!emailRegex.test(value.trim())) return 'Formato de correo invÃ¡lido'
        return ''

      case 'telefono':
        if (value && !/^\d{10}$/.test(value)) {
          return 'TelÃ©fono invÃ¡lido (10 dÃ­gitos)'
        }
        return ''

      case 'contrasena':
        if (tipoRegistro !== USER_TYPES.CUIDADOR) return ''
        if (!value) return 'La contraseÃ±a es obligatoria'
        if (value.length < 8) return 'La contraseÃ±a debe tener mÃ­nimo 8 caracteres'
        if (!/[A-Z]/.test(value)) return 'Debe contener al menos una mayÃºscula'
        if (!/[a-z]/.test(value)) return 'Debe contener al menos una minÃºscula'
        if (!/[0-9]/.test(value)) return 'Debe contener al menos un nÃºmero'
        return ''

      case 'confirmarContrasena':
        if (tipoRegistro !== USER_TYPES.CUIDADOR) return ''
        if (!value) return 'Confirma la contraseÃ±a'
        if (value !== form.contrasena) return 'Las contraseÃ±as no coinciden'
        return ''

      default:
        return ''
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    let formatted = value

    if (name === 'nombreCompleto') {
      formatted = value.replace(/[^a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±ÃÃ‰ÃÃ“ÃšÃ‘\s]/g, '')
    } else if (name === 'telefono') {
      formatted = value.replace(/\D/g, '').slice(0, 10)
    }

    setForm((previous) => ({
      ...previous,
      [name]: formatted,
    }))

    if (touched[name]) {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: validate(name, formatted),
      }))
    }

    if (
      name === 'contrasena' &&
      touched.confirmarContrasena &&
      tipoRegistro === USER_TYPES.CUIDADOR
    ) {
      setFieldErrors((previous) => ({
        ...previous,
        confirmarContrasena:
          form.confirmarContrasena === formatted
            ? ''
            : 'Las contraseÃ±as no coinciden',
      }))
    }
  }

  const handleBlur = (event) => {
    const { name, value } = event.target

    setTouched((previous) => ({
      ...previous,
      [name]: true,
    }))

    setFieldErrors((previous) => ({
      ...previous,
      [name]: validate(name, value),
    }))
  }

  const getInputClass = (name) => {
    const base =
      'border rounded-lg px-4 py-2.5 text-sm focus:outline-none w-full transition-all duration-300 ease-in-out'

    if (fieldErrors[name] && touched[name]) {
      return `${base} border-red-400 focus:ring-2 focus:ring-red-400`
    }

    return `${base} border-slate-300 focus:ring-2 focus:ring-blue-500`
  }

  const handleToggleForm = () => {
    if (showForm) {
      resetForm()
    } else {
      setFormError('')
      setFieldErrors({})
      setTouched({})
    }

    setShowForm((previous) => !previous)
  }

  const handleTipoRegistroChange = (event) => {
    const nextType = event.target.value

    setTipoRegistro(nextType)
    setFormError('')

    setForm((previous) => ({
      ...previous,
      contrasena: '',
      confirmarContrasena: '',
    }))

    setFieldErrors((previous) => {
      const nextErrors = { ...previous }
      delete nextErrors.contrasena
      delete nextErrors.confirmarContrasena
      return nextErrors
    })

    setTouched((previous) => {
      const nextTouched = { ...previous }
      delete nextTouched.contrasena
      delete nextTouched.confirmarContrasena
      return nextTouched
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const fieldsToValidate = ['nombreCompleto', 'correo', 'telefono']

    if (tipoRegistro === USER_TYPES.CUIDADOR) {
      fieldsToValidate.push('contrasena', 'confirmarContrasena')
    }

    const newErrors = {}
    let hasError = false

    fieldsToValidate.forEach((field) => {
      const validationError = validate(field, form[field])
      newErrors[field] = validationError

      if (validationError) {
        hasError = true
      }
    })

    setFieldErrors(newErrors)
    setTouched(
      fieldsToValidate.reduce(
        (accumulator, field) => ({
          ...accumulator,
          [field]: true,
        }),
        {},
      ),
    )

    if (hasError) return

    setSubmitting(true)

    try {
      if (tipoRegistro === USER_TYPES.CUIDADOR) {
        const cuidadorPayload = {
          nombre: form.nombreCompleto.trim(),
          correo: form.correo.trim().toLowerCase(),
          telefono: form.telefono.trim(),
          contrasena: form.contrasena,
        }

        await usersService.registerCuidador(cuidadorPayload)
      } else {
        const pacientePayload = {
          nombreCompleto: form.nombreCompleto.trim(),
          correo: form.correo.trim().toLowerCase(),
          telefono: form.telefono.trim(),
        }

        await usersService.registerPatient(pacientePayload)
      }

      resetForm()
      setShowForm(false)
      await fetchUsers()
    } catch (err) {
      const tipoUsuario =
        tipoRegistro === USER_TYPES.CUIDADOR ? 'cuidador' : 'paciente'

      setFormError(
        err?.message || `No se pudo registrar el ${tipoUsuario}`,
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyToken = async (token, userId) => {
    if (!token) return

    try {
      await navigator.clipboard.writeText(formatToken(token).replace(/\s/g, ''))
      setCopiedId(userId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError('No se pudo copiar el token')
    }
  }

  const handleDelete = async (userId) => {
    if (!userId) return
    if (!window.confirm('Â¿Eliminar este usuario?')) return

    try {
      await usersService.remove(userId)
      await fetchUsers()
    } catch (err) {
      setError(err?.message || 'No se pudo eliminar el usuario')
    }
  }

  const selectedUserLabel =
    tipoRegistro === USER_TYPES.CUIDADOR ? 'cuidador' : 'paciente'

  return (
    <div className="p-8 space-y-6">
      <div className="bg-blue-600 text-white rounded-xl p-6 flex items-center justify-between transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Red de Monitoreo</h2>
            <p className="text-blue-100 text-sm">
              {users.length} perfiles de usuario
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleForm}
          className="bg-white text-blue-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
        >
          {showForm ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {showForm ? 'Cerrar' : 'Agregar usuario'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading && users.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-400 text-sm">
            Cargando usuarios...
          </div>
        )}

        {!loading && users.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-400 text-sm">
            No hay usuarios registrados
          </div>
        )}

        {users.map((user, index) => {
          const name =
            user.nombre || user.nombreCompleto || user.name || 'Sin nombre'
          const email = user.correo || user.email || ''
          const phone = user.telefono || ''
          const token = user.tokenMovil
          const role = user.rol || 'Paciente'

          return (
            <div
              key={user.id || index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 transition-all duration-300 ease-in-out hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${getColor(index)} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {getInitials(name)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">{name}</h3>
                    {email && <p className="text-sm text-slate-500">{email}</p>}
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${getRoleClass(role)}`}
                    >
                      {role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(user.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                  aria-label={`Eliminar a ${name}`}
                  title="Eliminar usuario"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">
                    TelÃ©fono
                  </span>
                  <p className="text-slate-700 mt-1">{phone || 'â€”'}</p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider">
                    Correo
                  </span>
                  <p className="text-slate-700 mt-1">{email || 'â€”'}</p>
                </div>
              </div>

              {token && (
                <div className="bg-slate-900 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="text-emerald-400">ðŸ”‘</span> Token de Acceso
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyToken(token, user.id)}
                      className="text-slate-400 hover:text-white transition-colors p-1"
                      title="Copiar token"
                      aria-label={`Copiar token de ${name}`}
                    >
                      {copiedId === user.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {formatToken(token)
                      .split(' ')
                      .map((group, i) => (
                        <span
                          key={i}
                          className="bg-emerald-500/20 text-emerald-400 font-mono font-bold text-lg px-3 py-1 rounded-lg"
                        >
                          {group}
                        </span>
                      ))}
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Utiliza este cÃ³digo para que el usuario pueda acceder al monitoreo.
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-500 p-6 transition-all duration-300 ease-in-out animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">Nuevo Usuario</h3>
              <p className="text-xs text-slate-400">
                Selecciona si deseas registrar un paciente o un cuidador
              </p>
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4 animate-fade-in">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="tipoRegistro"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Tipo de usuario *
              </label>

              <select
                id="tipoRegistro"
                value={tipoRegistro}
                onChange={handleTipoRegistroChange}
                className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all duration-300 ease-in-out bg-white"
              >
                <option value={USER_TYPES.PACIENTE}>Paciente</option>
                <option value={USER_TYPES.CUIDADOR}>Cuidador</option>
              </select>

              <p className="text-xs text-slate-400 mt-1">
                Se registrarÃ¡ como {selectedUserLabel}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombreCompleto"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  <span className="flex items-center gap-1">
                    <span className="text-slate-400">ðŸ‘¤</span> Nombre Completo *
                  </span>
                </label>

                <input
                  id="nombreCompleto"
                  type="text"
                  name="nombreCompleto"
                  value={form.nombreCompleto}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Ej: RamÃ³n HernÃ¡ndez"
                  autoComplete="name"
                  className={getInputClass('nombreCompleto')}
                />

                {fieldErrors.nombreCompleto && touched.nombreCompleto && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.nombreCompleto}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  <span className="flex items-center gap-1">
                    <span className="text-slate-400">ðŸ“±</span> TelÃ©fono
                  </span>
                </label>

                <input
                  id="telefono"
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="5512345678"
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  className={getInputClass('telefono')}
                />

                {fieldErrors.telefono && touched.telefono && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />
                    {fieldErrors.telefono}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                <span className="flex items-center gap-1">
                  <span className="text-slate-400">âœ‰ï¸</span> Correo *
                </span>
              </label>

              <input
                id="correo"
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="usuario@email.com"
                autoComplete="email"
                className={getInputClass('correo')}
              />

              {fieldErrors.correo && touched.correo && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                  <AlertCircle className="w-3 h-3" />
                  {fieldErrors.correo}
                </p>
              )}
            </div>

            {tipoRegistro === USER_TYPES.CUIDADOR && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contrasena"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    ContraseÃ±a *
                  </label>

                  <input
                    id="contrasena"
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="MÃ­nimo 8 caracteres"
                    autoComplete="new-password"
                    maxLength={128}
                    className={getInputClass('contrasena')}
                  />

                  {fieldErrors.contrasena && touched.contrasena && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />
                      {fieldErrors.contrasena}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 mt-1">
                    MÃ­nimo 8 caracteres, una mayÃºscula, una minÃºscula y un nÃºmero.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmarContrasena"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    Confirmar contraseÃ±a *
                  </label>

                  <input
                    id="confirmarContrasena"
                    type="password"
                    name="confirmarContrasena"
                    value={form.confirmarContrasena}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Repite la contraseÃ±a"
                    autoComplete="new-password"
                    maxLength={128}
                    className={getInputClass('confirmarContrasena')}
                  />

                  {fieldErrors.confirmarContrasena &&
                    touched.confirmarContrasena && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                        <AlertCircle className="w-3 h-3" />
                        {fieldErrors.confirmarContrasena}
                      </p>
                    )}
                </div>
              </div>
            )}

            {tipoRegistro === USER_TYPES.PACIENTE && (
              <div className="bg-slate-900 rounded-xl p-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <span className="text-emerald-400">ðŸ”‘</span> Token que se generarÃ¡
                </span>

                <div className="flex gap-2">
                  {['XXX', 'XXX', 'XXX'].map((group, i) => (
                    <span
                      key={i}
                      className="bg-emerald-500/20 text-emerald-400 font-mono font-bold text-lg px-3 py-1 rounded-lg"
                    >
                      {group}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-500 mt-2">
                  El token se generarÃ¡ automÃ¡ticamente al registrar al paciente.
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(false)
                }}
                className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg px-4 py-2.5 transition-all duration-300 ease-in-out hover:bg-slate-50 hover:shadow-md"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium rounded-lg px-4 py-2.5 transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting
                  ? 'Registrando...'
                  : `Registrar ${selectedUserLabel}`}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}