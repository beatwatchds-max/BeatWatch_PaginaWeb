import { useState, useEffect } from 'react'
import { RefreshCw, Watch, Smartphone, Monitor, Battery, Clock, Cpu, Trash2 } from 'lucide-react'
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
    </div>
  )
}