import { useState, useEffect } from 'react'
import { RefreshCw, Plus, Watch, Smartphone, Monitor, Battery, Clock, Cpu, Trash2, X, Bluetooth, AlertCircle } from 'lucide-react'
import devicesService from '../../services/devicesService'

function getDeviceIcon(device) {
  const name = (device.nombre || device.name || '').toLowerCase()
  if (name.includes('watch')) return Watch
  if (name.includes('phone') || name.includes('iphone') || name.includes('galaxy s')) return Smartphone
  if (name.includes('pad') || name.includes('tab') || name.includes('ipad')) return Monitor
  return Watch
}

function getDeviceStatus(device) {
  const status = device.estado || device.status || device.estatus
  if (typeof status === 'string') {
    const s = status.toLowerCase()
    if (s.includes('online') || s.includes('activo') || s.includes('conectado')) return 'Online'
    if (s.includes('standby') || s.includes('inactivo') || s.includes('pausa')) return 'Standby'
    if (s.includes('offline') || s.includes('desconectado')) return 'Offline'
  }
  if (device.online === true) return 'Online'
  if (device.online === false) return 'Offline'
  return 'Online'
}

const getStatusBadge = (status) => {
  const styles = {
    Online: 'bg-emerald-100 text-emerald-700',
    Standby: 'bg-amber-100 text-amber-700',
    Offline: 'bg-red-100 text-red-700',
  }
  return styles[status] || styles.Offline
}

export default function DevicesView() {
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showPairModal, setShowPairModal] = useState(false)
  const [pairing, setPairing] = useState(false)
  const [pairError, setPairError] = useState('')
  const [pairForm, setPairForm] = useState({
    nombre: '',
    uuid: '',
    tipo: '',
    plataforma: '',
  })
  const [pairFieldErrors, setPairFieldErrors] = useState({})
  const [pairTouched, setPairTouched] = useState({})

  const fetchDevices = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await devicesService.list()
      const list = Array.isArray(data) ? data : data.data || data.dispositivos || []
      setDevices(list)
    } catch (err) {
      console.error('Error al listar dispositivos:', err)
      setError(err.message || 'Error al cargar dispositivos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este dispositivo?')) return
    try {
      await devicesService.remove(id)
      setDevices((prev) => prev.filter((d) => (d.id || d._id || d.dispositivoId) !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
      alert(err.message || 'No se pudo eliminar el dispositivo')
    }
  }

  const validatePair = (name, value) => {
    switch (name) {
      case 'nombre':
        if (!value.trim()) return 'El nombre es obligatorio'
        return ''
      case 'uuid':
        if (!value.trim()) return 'El UUID es obligatorio'
        return ''
      case 'tipo':
        if (!value) return 'Selecciona un tipo'
        return ''
      case 'plataforma':
        if (!value) return 'Selecciona una plataforma'
        return ''
      default:
        return ''
    }
  }

  const handlePairChange = (e) => {
    const { name, value } = e.target
    setPairForm((prev) => ({ ...prev, [name]: value }))
    if (pairTouched[name]) {
      setPairFieldErrors((prev) => ({ ...prev, [name]: validatePair(name, value) }))
    }
  }

  const handlePairBlur = (e) => {
    const { name, value } = e.target
    setPairTouched((prev) => ({ ...prev, [name]: true }))
    setPairFieldErrors((prev) => ({ ...prev, [name]: validatePair(name, value) }))
  }

  const getPairInputClass = (name) => {
    const base = 'border rounded-lg px-4 py-2 text-sm focus:outline-none w-full transition-all duration-300 ease-in-out'
    if (pairFieldErrors[name] && pairTouched[name]) return `${base} border-red-400 focus:ring-2 focus:ring-red-400`
    return `${base} border-slate-300 focus:ring-2 focus:ring-blue-500`
  }

  const handlePair = async (e) => {
    e.preventDefault()
    setPairError('')

    const requiredFields = ['nombre', 'uuid', 'tipo', 'plataforma']
    const newErrors = {}
    let hasError = false
    requiredFields.forEach((field) => {
      const err = validatePair(field, pairForm[field])
      newErrors[field] = err
      if (err) hasError = true
    })
    setPairFieldErrors(newErrors)
    setPairTouched(requiredFields.reduce((acc, f) => ({ ...acc, [f]: true }), {}))
    if (hasError) return

    setPairing(true)

    try {
      const payload = {
        nombre: pairForm.nombre || undefined,
        uuid: pairForm.uuid || undefined,
        tipo: pairForm.tipo || undefined,
        plataforma: pairForm.plataforma || undefined,
      }

      await devicesService.pair(payload)

      setPairForm({ nombre: '', uuid: '', tipo: '', plataforma: '' })
      setShowPairModal(false)
      fetchDevices()
    } catch (err) {
      console.error('Error al emparejar:', err)
      setPairError(err.message || 'No se pudo emparejar el dispositivo')
    } finally {
      setPairing(false)
    }
  }

  const stats = [
    { label: 'Online', value: devices.filter((d) => getDeviceStatus(d) === 'Online').length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Standby', value: devices.filter((d) => getDeviceStatus(d) === 'Standby').length, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { label: 'Offline', value: devices.filter((d) => getDeviceStatus(d) === 'Offline').length, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.bg} ${stat.border} border rounded-xl p-5 flex flex-col transition-all duration-300 ease-in-out hover:shadow-md hover:border-blue-200`}>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-sm text-slate-500 mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={fetchDevices} className="bg-white border border-slate-300 text-slate-700 font-medium rounded-lg px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:bg-slate-50 hover:shadow-md hover:border-blue-200 flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sincronizar todos
        </button>
        <button onClick={() => setShowPairModal(true)} className="bg-blue-600 text-white font-medium rounded-lg px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Vincular nuevo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm animate-fade-in">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100">
        {loading && devices.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-sm">Cargando dispositivos...</div>
        )}
        {!loading && devices.length === 0 && !error && (
          <div className="p-8 text-center text-slate-400 text-sm">No hay dispositivos registrados</div>
        )}
        {devices.map((device) => {
          const Icon = getDeviceIcon(device)
          const id = device.id || device._id || device.dispositivoId
          const name = device.nombre || device.name || 'Sin nombre'
          const uuid = device.uuid || device.numeroSerie || device.serie || ''
          const type = device.tipo || device.type || ''
          const battery = device.bateria ?? device.battery ?? '--'
          const lastSync = device.ultimaSincronizacion || device.lastSync || device.ultimaConexion || '--'
          const os = device.sistemaOperativo || device.os || device.plataforma || ''
          const status = getDeviceStatus(device)

          return (
            <div key={id || uuid} className="flex items-center justify-between p-5 transition-all duration-300 ease-in-out hover:bg-slate-50 hover:shadow-md hover:border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{name}</h3>
                  {uuid && <p className="text-xs text-slate-400 mt-0.5">UUID: {uuid}</p>}
                  {type && <p className="text-xs text-slate-400">Tipo: {type}</p>}
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Battery className="w-4 h-4" />
                  {battery}%
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="w-4 h-4" />
                  {lastSync}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Cpu className="w-4 h-4" />
                  {os}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(status)}`}>
                  {status}
                </span>
                {id && (
                  <button onClick={() => handleDelete(id)} className="text-slate-400 hover:text-red-500 transition-colors" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {showPairModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Bluetooth className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Vincular Dispositivo</h3>
              </div>
              <button onClick={() => setShowPairModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {pairError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4 animate-fade-in">
                {pairError}
              </div>
            )}

            <form onSubmit={handlePair} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del dispositivo</label>
                <input
                  type="text"
                  name="nombre"
                  value={pairForm.nombre}
                  onChange={handlePairChange}
                  onBlur={handlePairBlur}
                  placeholder="Apple Watch Series 9"
                  className={getPairInputClass('nombre')}
                />
                {pairFieldErrors.nombre && pairTouched.nombre && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />{pairFieldErrors.nombre}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">UUID / Número de serie</label>
                <input
                  type="text"
                  name="uuid"
                  value={pairForm.uuid}
                  onChange={handlePairChange}
                  onBlur={handlePairBlur}
                  placeholder="A1B2-C3D4-E5F6-7890"
                  className={getPairInputClass('uuid')}
                />
                {pairFieldErrors.uuid && pairTouched.uuid && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                    <AlertCircle className="w-3 h-3" />{pairFieldErrors.uuid}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                    name="tipo"
                    value={pairForm.tipo}
                    onChange={handlePairChange}
                    onBlur={handlePairBlur}
                    className={getPairInputClass('tipo')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Paciente">Paciente</option>
                    <option value="Cuidador">Cuidador</option>
                  </select>
                  {pairFieldErrors.tipo && pairTouched.tipo && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />{pairFieldErrors.tipo}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Plataforma</label>
                  <select
                    name="plataforma"
                    value={pairForm.plataforma}
                    onChange={handlePairChange}
                    onBlur={handlePairBlur}
                    className={getPairInputClass('plataforma')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="watchOS">watchOS</option>
                    <option value="iOS">iOS</option>
                    <option value="Android">Android</option>
                    <option value="Wear OS">Wear OS</option>
                    <option value="iPadOS">iPadOS</option>
                  </select>
                  {pairFieldErrors.plataforma && pairTouched.plataforma && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-fade-in">
                      <AlertCircle className="w-3 h-3" />{pairFieldErrors.plataforma}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setShowPairModal(false)} className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg px-4 py-2 transition-all duration-300 ease-in-out hover:bg-slate-50 hover:shadow-md">
                  Cancelar
                </button>
                <button type="submit" disabled={pairing} className="flex-1 bg-blue-600 text-white font-medium rounded-lg px-4 py-2 transition-all duration-300 ease-in-out hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  <Bluetooth className="w-4 h-4" />
                  {pairing ? 'Vinculando...' : 'Vincular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
