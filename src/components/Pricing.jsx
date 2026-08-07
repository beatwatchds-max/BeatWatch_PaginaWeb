import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

export default function Pricing() {
  const features = [
    'Monitoreo 24/7 en tiempo real',
    'Detección de arritmias con IA',
    'Alertas automáticas por SMS',
    'Dashboard de salud personal',
    'Historial de 30 días',
    '1 dispositivo conectado',
    'Soporte por chat',
    'Actualizaciones gratuitas',
  ]

  return (
    <section id="planes" className="py-16 px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900">
            Plan <span className="text-blue-600">DEMO</span>
          </h2>
          <p className="text-slate-500 mt-4">
            Comienza a monitorear tu salud cardíaca sin costo.
          </p>
        </div>

        <div className="relative border-2 border-blue-500 rounded-3xl shadow-2xl shadow-blue-500/20 bg-white p-8 pt-12 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-1">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500 text-white rounded-t-xl rounded-b-none py-1 px-4 text-xs font-bold">
            Plan Recomendado
          </div>

          <div className="text-center mb-8">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              GRATIS
            </div>
            <div className="text-slate-400 text-sm mt-2">Para siempre</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-2 group cursor-pointer">
                <div className="bg-blue-500 text-white rounded-full p-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-125">
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-slate-600 text-sm transition-colors duration-300 group-hover:text-blue-600">{feature}</span>
              </div>
            ))}
          </div>

          <Link
            to="/registro/cuenta"
            className="block w-full bg-blue-500 text-white rounded-xl py-3 font-bold mt-6 shadow-lg shadow-blue-500/30 cursor-pointer transition-all duration-300 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50 text-center"
          >
            Comenzar gratis
          </Link>
        </div>

        <div className="flex justify-center mt-8">
          <div className="bg-emerald-50 rounded-full px-6 py-3 flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer">
            <div className="bg-emerald-500 rounded-full p-1 transition-transform duration-300 hover:scale-110">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">Garantía de 30 días</div>
              <div className="text-slate-500 text-xs">Satisfacción garantizada</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
