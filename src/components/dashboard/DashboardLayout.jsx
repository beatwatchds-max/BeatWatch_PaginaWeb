import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Heart, LogOut } from 'lucide-react'
import useAuthStore from '../../store/authStore'

export default function DashboardLayout() {
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard/dispositivos', label: 'Dispositivos' },
    { to: '/dashboard/usuarios', label: 'Usuarios' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="w-64 bg-slate-900 min-h-screen flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-white">
              <span className="text-blue-400">BIT</span>
              <span className="text-rose-400">WATCH</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out block ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-300 ease-in-out"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
          <div className="text-xs text-slate-500 mt-3 px-4">BitWatch Dashboard v1.0</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center py-5 px-8 bg-white border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">En línea</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
