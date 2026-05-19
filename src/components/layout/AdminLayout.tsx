import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Users, Award, Video, LogOut, Menu, Shield, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

const navItems = [
  { to: '/secure-admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/secure-admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/secure-admin/lessons', label: 'Lessons', icon: Video },
  { to: '/secure-admin/students', label: 'Students', icon: Users },
  { to: '/secure-admin/certificates', label: 'Certificates', icon: Award },
]

export function AdminLayout() {
  const { profile, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isDark = theme === 'dark'

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-200 dark:border-white/10">
        <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400">
          <Shield size={18} className="text-gray-900" />
        </div>
        <div>
          <span className="font-bold text-gray-900 dark:text-white text-sm">Admin Portal</span>
          <p className="text-xs text-gray-500">Learnify AI</p>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-gray-900 font-semibold text-sm flex-shrink-0">
            {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{profile?.name}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 truncate">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8'
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 dark:border-white/10 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition-all duration-200"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-950">
      <aside className="hidden lg:flex lg:flex-col w-64 glass-dark border-r border-gray-200 dark:border-white/10 fixed h-full z-30">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 glass-dark border-r border-gray-200 dark:border-white/10 flex flex-col">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center justify-between px-4 h-14 glass-dark border-b border-gray-200 dark:border-white/10 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400">
            <Menu size={20} />
          </button>
          <span className="font-bold text-sm text-amber-600 dark:text-amber-400">Admin Portal</span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-gray-900 text-sm font-semibold">
            {profile?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
