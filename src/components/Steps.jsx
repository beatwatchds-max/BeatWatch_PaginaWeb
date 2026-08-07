import { Activity, Brain, Wifi, Shield } from 'lucide-react'

export default function Steps() {
  const steps = [
    {
      number: 1,
      title: 'Conexión del dispositivo',
      description: 'Vincula tu monitor cardíaco con la plataforma de forma sencilla y segura.',
      icon: Activity,
      iconBg: 'bg-purple-100 text-purple-600',
      circleBg: 'bg-gradient-to-r from-purple-500 to-rose-400',
      borderColor: 'border-orange-400',
    },
    {
      number: 2,
      title: 'Análisis con IA',
      description: 'Nuestro algoritmo de inteligencia artificial analiza tus signos vitales en tiempo real.',
      icon: Brain,
      iconBg: 'bg-blue-100 text-blue-600',
      circleBg: 'bg-gradient-to-r from-blue-500 to-purple-500',
      borderColor: 'border-sky-400',
    },
    {
      number: 3,
      title: 'Detección de anomalías',
      description: 'Identificación automática de arritmias y patrones cardíacos anormales.',
      icon: Wifi,
      iconBg: 'bg-rose-100 text-rose-600',
      circleBg: 'bg-gradient-to-r from-violet-500 to-purple-500',
      borderColor: 'border-rose-400',
    },
    {
      number: 4,
      title: 'Alerta y prevención',
      description: 'Notificación inmediata a profesionales de la salud para intervención oportuna.',
      icon: Shield,
      iconBg: 'bg-emerald-100 text-emerald-600',
      circleBg: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
      borderColor: 'border-emerald-400',
    },
  ]

  const metrics = [
    { value: '99.7%', label: 'Precisión en detección' },
    { value: '<30s', label: 'Tiempo de alerta' },
    { value: '50K+', label: 'Monitoreos activos' },
    { value: '24/7', label: 'Cobertura continua' },
  ]

  return (
    <section id="funciones" className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold">
            Del <span className="text-blue-600">riesgo</span> a la{' '}
            <span className="text-rose-500">seguridad</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Nuestro proceso de monitoreo cardíaco transforma datos crudos en información
            vital que puede salvar vidas.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-12">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`bg-white rounded-2xl shadow-lg border border-slate-100 pt-10 pb-6 px-6 relative border-b-4 ${step.borderColor} group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-200`}
              >
                <div
                  className={`absolute top-0 left-6 -translate-y-1/2 w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-sm ${step.circleBg} transition-transform duration-300 group-hover:scale-110`}
                >
                  {step.number}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.description}</p>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-slate-50 to-rose-50 py-8 px-12 rounded-3xl mx-8 mt-12 flex justify-between items-center transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center transition-all duration-300 hover:-translate-y-1">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                {metric.value}
              </div>
              <div className="text-sm text-slate-500 mt-1">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
