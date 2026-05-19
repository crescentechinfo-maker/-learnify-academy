import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Menu, X, LogOut, User, BookOpen, Award, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/Button'

export function Navbar() {
  const { user, profile, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  const isDark = theme === 'dark'

  return (
    <nav className="sticky top-0 z-40 glass-dark border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-200">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">Learnify AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/courses" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
              Courses
            </Link>
            <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
              Contact
            </Link>
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-200"
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-sm font-semibold">
                    {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{profile.name}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 glass rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <Link
                      to="/student-dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BookOpen size={15} /> Dashboard
                    </Link>
                    <Link
                      to="/student-dashboard/profile"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={15} /> Profile
                    </Link>
                    <Link
                      to="/student-dashboard/certificates"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Award size={15} /> Certificates
                    </Link>
                    <div className="border-t border-gray-200 dark:border-white/10" />
                    <button
                      onClick={() => { setUserMenuOpen(false); handleLogout() }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 transition-all"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-gray-200 dark:border-white/10 px-4 py-4 flex flex-col gap-3">
          <Link to="/courses" className="text-sm text-gray-700 dark:text-gray-300 py-2" onClick={() => setMobileOpen(false)}>Courses</Link>
          <Link to="/about" className="text-sm text-gray-700 dark:text-gray-300 py-2" onClick={() => setMobileOpen(false)}>About</Link>
          <Link to="/contact" className="text-sm text-gray-700 dark:text-gray-300 py-2" onClick={() => setMobileOpen(false)}>Contact</Link>
          {user ? (
            <>
              <Link to="/student-dashboard" className="text-sm text-gray-700 dark:text-gray-300 py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { setMobileOpen(false); handleLogout() }} className="text-sm text-red-500 py-2 text-left">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="secondary" className="w-full">Sign In</Button></Link>
              <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}><Button className="w-full">Register</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
