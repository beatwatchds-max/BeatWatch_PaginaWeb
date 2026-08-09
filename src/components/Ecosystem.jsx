import { Cloud, Brain, Wifi, Shield, Activity, Smartphone, Database, Lock } from 'lucide-react'

export default function Ecosystem() {
  const features = [
    {
      icon: Activity,
      title: 'Monitoreo 24/7',
      description: 'Vigilancia continua sin interrupciones.',
    },
    {
      icon: Brain,
      title: 'IA Avanzada',
      description: 'Algoritmos de última generación.',
    },
    {
      icon: Smartphone,
      title: 'Multi-dispositivo',
      description: 'Compatible con todos tus dispositivos.',
    },
    {
      icon: Database,
      title: 'Almacenamiento seguro',
      description: 'Tus datos siempre protegidos.',
    },
    {
      icon: Lock,
      title: 'Privacidad total',
      description: 'Cumplimiento HIPAA y GDPR.',
    },
    {
      icon: Cloud,
      title: 'Infraestructura cloud',
      description: 'Escalabilidad y disponibilidad.',
    },
  ]

  return (
    <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-950 py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">
            Un servicio <span className="text-blue-300">integral</span>, siempre activo
          </h2>
          <p className="text-blue-100/60 mt-4 max-w-2xl mx-auto">
            Nuestra infraestructura garantiza disponibilidad y seguridad en todo momento.
          </p>
        </div>

        <div className="relative mt-16 flex justify-center items-center h-64 mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative z-10 ring-2 ring-rose-500/50 rounded-3xl bg-slate-900/80 backdrop-blur-sm p-8 w-80 animate-pulse-glow transition-all duration-300 hover:ring-rose-500/80">
            <div className="text-center">
              <div className="text-white font-bold text-lg">BitWatch Core</div>
              <div className="text-blue-300/60 text-sm mt-1">Plataforma de Monitoreo</div>
            </div>
          </div>

          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 rounded-2xl p-3 shadow-lg shadow-blue-500/30 animate-float cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-blue-500/50">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-rose-500 rounded-2xl p-3 shadow-lg shadow-rose-500/30 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-rose-500/50" style={{ animationDelay: '0.5s' }}>
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-1/2 -right-8 -translate-y-1/2 bg-emerald-500 rounded-2xl p-3 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-emerald-500/50" style={{ animationDelay: '1s' }}>
            <Wifi className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 border-2 border-white/30 rounded-2xl p-3 bg-transparent cursor-pointer transition-all duration-300 hover:scale-110 hover:border-white/60 hover:bg-white/5" style={{ animationDelay: '1.5s' }}>
            <Shield className="w-6 h-6 text-white/70" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:-translate-y-1"
              >
                <Icon className="w-8 h-8 text-white mb-3 transition-transform duration-300 hover:scale-110" />
                <h3 className="text-white text-lg font-semibold">{feature.title}</h3>
                <p className="text-blue-100/70 text-sm mt-1">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
