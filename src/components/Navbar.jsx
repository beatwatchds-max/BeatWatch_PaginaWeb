import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Navbar() {
  const links = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Funciones', href: '#funciones' },
    { label: 'Planes', href: '#planes' },
    { label: 'Nosotros', href: '#nosotros' },
  ]

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-white/90 backdrop-blur-md border-b border-slate-100 fixed top-0 w-full z-50">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-110">
          <Heart className="w-5 h-5 text-white" fill="white" />
        </div>
        <span className="font-bold text-xl">
          <span className="text-blue-600">BIT</span>
          <span className="text-rose-500">WATCH</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-2 border border-blue-500 text-blue-600 rounded-md text-sm font-semibold hover:bg-blue-50 transition-all duration-300"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/registro/cuenta"
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-rose-500 text-white rounded-md text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
        >
          Comenzar ahora
        </Link>
      </div>
    </nav>
  )
}
