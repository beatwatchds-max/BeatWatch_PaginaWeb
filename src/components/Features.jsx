import { HeartPulse, Zap, Bell, ShieldCheck } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: HeartPulse,
      title: 'Monitoreo en tiempo real',
      description: 'Seguimiento continuo de tu frecuencia cardíaca las 24 horas del día.',
      iconBg: 'bg-rose-500',
    },
    {
      icon: Zap,
      title: 'Detección instantánea',
      description: 'IA que identifica arritmias en milisegundos con alta precisión.',
      iconBg: 'bg-amber-500',
    },
    {
      icon: Bell,
      title: 'Alertas automáticas',
      description: 'Notificaciones inmediatas a emergencias y contactos de confianza.',
      iconBg: 'bg-blue-500',
    },
    {
      icon: ShieldCheck,
      title: 'Datos seguros',
      description: 'Encriptación de extremo a extremo para toda tu información médica.',
      iconBg: 'bg-purple-500',
    },
  ]

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold">
            Monitoreo Preventivo en{' '}
            <span className="bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">
              Tiempo Real
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-12 items-center mt-12">
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl border border-slate-100 p-6 group cursor-pointer transition-all duration-300 hover:shadow-md hover:border-slate-200 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>

          <div className="relative">
            <div className="p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-rose-500 rounded-3xl transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <div className="bg-white rounded-[22px] p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-slate-400 text-sm">Estado del paciente</div>
                  <div className="bg-fuchsia-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 animate-float">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-heartbeat" />
                    IA Activa
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-heartbeat" />
                  <span className="text-emerald-400 text-sm">En vivo</span>
                </div>

                <div className="text-center my-8">
                  <div className="text-6xl font-bold text-rose-500 transition-all duration-300 hover:scale-110">72</div>
                  <div className="text-slate-400 text-sm mt-2">Latidos por minuto</div>
                </div>

                <div className="bg-slate-900 rounded-xl h-32 mt-4 flex items-center p-4 overflow-hidden">
                  <svg viewBox="0 0 300 80" className="w-full h-full">
                    <polyline
                      points="0,40 30,40 40,40 45,15 50,65 55,25 60,55 65,40 80,40 110,40 120,40 125,15 130,65 135,25 140,55 145,40 160,40 190,40 200,40 205,15 210,65 215,25 220,55 225,40 240,40 270,40 280,40 285,15 290,65 295,40 300,40"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                      className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-ecg"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
