import { Users, Building2, Stethoscope, Heart } from 'lucide-react'

export default function Audience() {
  const audiences = [
    {
      icon: Users,
      title: 'Pacientes',
      description: 'Personas con condiciones cardíacas que necesitan monitoreo continuo y alertas tempranas.',
      iconBg: 'bg-gradient-to-r from-rose-500 to-rose-600',
      cardBg: 'bg-rose-50',
      hoverShadow: 'hover:shadow-rose-500/20',
    },
    {
      icon: Stethoscope,
      title: 'Médicos',
      description: 'Profesionales de la salud que requieren datos en tiempo real de sus pacientes.',
      iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
      cardBg: 'bg-blue-50',
      hoverShadow: 'hover:shadow-blue-500/20',
    },
    {
      icon: Building2,
      title: 'Hospitales',
      description: 'Instituciones médicas que buscan optimizar el monitoreo de sus pacientes internados.',
      iconBg: 'bg-gradient-to-r from-purple-500 to-purple-600',
      cardBg: 'bg-indigo-50',
      hoverShadow: 'hover:shadow-purple-500/20',
    },
    {
      icon: Heart,
      title: 'Familiares',
      description: 'Familias que quieren estar tranquilas sabiendo que sus seres queridos están monitoreados.',
      iconBg: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      cardBg: 'bg-emerald-50',
      hoverShadow: 'hover:shadow-emerald-500/20',
    },
  ]

  const trustItems = [
    { value: '10,000+', label: 'Usuarios', dotColor: 'bg-emerald-400' },
    { value: '500+', label: 'Instituciones', dotColor: 'bg-blue-400' },
    { value: '24/7', label: 'Soporte', dotColor: 'bg-rose-400' },
  ]

  return (
    <section id="nosotros" className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-slate-900">
            Clientes <span className="text-blue-600">Principales</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Diseñado para todos los actores del ecosistema de salud cardíaca.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6 mt-16">
          {audiences.map((audience) => {
            const Icon = audience.icon
            return (
              <div
                key={audience.title}
                className={`${audience.cardBg} rounded-2xl p-6 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl ${audience.hoverShadow}`}
              >
                <div className={`w-14 h-14 rounded-xl ${audience.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{audience.title}</h3>
                <p className="text-slate-500 text-sm">{audience.description}</p>
              </div>
            )
          })}
        </div>

        <div className="flex justify-center gap-6 mt-16">
          {trustItems.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-full px-6 py-2 shadow-sm flex items-center gap-2 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${item.dotColor}`} />
              <span className="font-bold text-slate-800">{item.value}</span>
              <span className="text-slate-500 text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
