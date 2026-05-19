import { Link } from 'react-router-dom'
import { GraduationCap, Globe, BookMarked, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="font-bold text-lg gradient-text">Learnify AI Academy</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Empowering learners worldwide with AI-powered education. Access world-class courses anytime, anywhere.
            </p>
            <div className="flex gap-4 mt-6">
              {[Globe, BookMarked, Mail].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: '/courses', label: 'Browse Courses' },
                { to: '/register', label: 'Get Started' },
                { to: '/login', label: 'Sign In' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} Learnify AI Academy. All rights reserved.</p>
          <p className="text-xs text-gray-400 dark:text-gray-600">Built with ❤️ for learners everywhere</p>
        </div>
      </div>
    </footer>
  )
}
