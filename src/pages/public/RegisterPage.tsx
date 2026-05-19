import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, GraduationCap, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (email.toLowerCase() === 'admin81@gmail.com') { setError('This email is not available for registration.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(email, password, name)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-10 text-center max-w-md border border-emerald-200 dark:border-emerald-500/20 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Created!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Check your email to verify your account, then sign in to start learning.
          </p>
          <Link to="/login" className="block mt-6">
            <Button className="w-full">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 mb-4 shadow-lg shadow-indigo-500/30">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join 10,000+ learners on Learnify AI</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input label="Full Name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={16} />} required />
            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail size={16} />} required autoComplete="email" />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 pl-10 pr-10 py-2.5 text-sm"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}
            <Button type="submit" loading={loading} variant="gold" className="w-full" size="lg">Create Free Account</Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
