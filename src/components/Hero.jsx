import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Hero() {
  const stats = [
    { value: '24/7', label: 'Monitoreo continuo' },
    { value: 'IA', label: 'Detección inteligente' },
    { value: '<30s', label: 'Tiempo de alerta' },
  ]

  return (
    <section id="inicio" className="pt-32 pb-16 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm transition-all duration-300 hover:bg-blue-100 hover:shadow-md hover:shadow-blue-500/10">
            <Heart className="w-4 h-4 animate-heartbeat" fill="currentColor" />
            Tecnología Médica Avanzada
          </div>

          <h1 className="text-6xl font-extrabold leading-tight tracking-tight mt-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              Monitoreo
            </span>{' '}
            <span className="bg-gradient-to-r from-purple-500 to-rose-500 bg-clip-text text-transparent">
              inteligente
            </span>
            <br />
            <span className="text-slate-900">de arritmias cardíacas en tiempo real</span>
          </h1>

          <p className="text-slate-500 text-lg mt-6 max-w-lg">
            Plataforma de monitoreo cardíaco con inteligencia artificial que detecta
            arritmias en tiempo real y envía alertas automáticas a profesionales de la salud.
          </p>

          <div className="flex gap-4 mt-8">
            <a
              href="#planes"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-rose-500 text-white rounded-md text-base font-semibold shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 inline-block text-center"
            >
              Ver planes
            </a>
            <Link
              to="/registro/cuenta"
              className="px-6 py-3 border border-blue-500 text-blue-600 rounded-md text-base font-semibold hover:bg-blue-50 transition-all duration-300 inline-block text-center"
            >
              Probar demo
            </Link>
          </div>

          <div className="flex gap-8 mt-12 text-slate-800">
            {stats.map((stat) => (
              <div key={stat.label} className="transition-all duration-300 hover:-translate-y-1">
                <div className="text-blue-600 text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)]">
          <div className="rounded-3xl shadow-2xl overflow-hidden relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 transition-all duration-500">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="text-white/60 text-sm">Monitor Cardíaco</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-heartbeat" />
                  <span className="text-emerald-400 text-xs">En vivo</span>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-6 mb-4 transition-all duration-300 hover:bg-slate-800/70">
                <div className="text-white/40 text-sm mb-2">Frecuencia Cardíaca</div>
                <div className="text-4xl font-bold text-rose-400 transition-all duration-300 hover:scale-105">72 <span className="text-lg text-white/40">BPM</span></div>
              </div>
              <div className="bg-slate-800/50 rounded-2xl p-4 h-24 flex items-center transition-all duration-300 hover:bg-slate-800/70">
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  <polyline
                    points="0,30 20,30 30,30 35,10 40,50 45,20 50,40 55,30 70,30 90,30 95,10 100,50 105,20 110,40 115,30 130,30 150,30 155,10 160,50 165,20 170,40 175,30 200,30"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    className="drop-shadow-[0_0_6px_rgba(52,211,153,0.5)] animate-ecg"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
