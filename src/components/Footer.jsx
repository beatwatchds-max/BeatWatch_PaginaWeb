import { Heart } from 'lucide-react'

export default function Footer() {
  const links = [
    { label: 'Privacidad', href: '#' },
    { label: 'Términos', href: '#' },
  ]

  return (
    <footer className="bg-slate-900 text-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl">
              <span className="text-blue-400">BIT</span>
              <span className="text-rose-400">WATCH</span>
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-400 hover:text-white transition-all duration-200 inline-block hover:translate-x-1"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          &copy; 2026 BitWatch. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
