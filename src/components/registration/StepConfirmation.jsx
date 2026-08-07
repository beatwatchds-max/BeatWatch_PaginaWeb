import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Download, Calendar, Mail, FileText, Check, ShieldCheck } from 'lucide-react'
import useRegistrationStore from '../../store/registrationStore'
import reportsService from '../../services/reportsService'

export default function StepConfirmation() {
  const navigate = useNavigate()
  const { usuarioId, correo, tipoLicencia, licenciaId, clearRegistration } = useRegistrationStore()
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  const handleDownloadReceipt = async () => {
    const id = licenciaId || usuarioId
    if (!id) {
      setDownloadError('No se encontró un identificador para generar el recibo.')
      return
    }

    setDownloadError('')
    setDownloading(true)

    try {
      const blob = await reportsService.downloadReceipt(id)
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `recibo-${id}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setDownloadError(err.message || 'No se pudo descargar el recibo')
    } finally {
      setDownloading(false)
    }
  }

  const handleGoLogin = () => {
    clearRegistration()
    navigate('/login')
  }

  const now = new Date()
  const fechaStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-emerald-600">¡Licencia activada!</h1>
        <p className="text-slate-500 mt-2">Tu registro ha sido completado exitosamente.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-left mb-8">
        <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-400" />
          Detalles de la activación
        </h2>

        <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Plan</p>
            <p className="text-sm font-semibold text-slate-800 mt-1">Plan {tipoLicencia} - Gratis</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Modalidad</p>
            <div className="flex items-center gap-2 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-800">Sin datos bancarios</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Fecha</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-800">{fechaStr}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Correo de confirmación</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-800 break-all">{correo || 'No disponible'}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-6 pt-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Tu plan incluye</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              'Monitoreo 24/7 en tiempo real',
              'Detección de arritmias con IA',
              'Alertas automáticas por SMS',
              'Dashboard de salud personal',
              'Historial de 30 días',
              'Soporte por chat',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {downloadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
          {downloadError}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={handleGoLogin}
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700"
        >
          Ir al Login
        </button>
        <button
          onClick={handleDownloadReceipt}
          disabled={downloading}
          className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors mt-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Descargando...' : 'Descargar Recibo'}
        </button>
      </div>
    </div>
  )
}
