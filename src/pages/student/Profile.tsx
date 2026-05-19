import { useState, type FormEvent } from 'react'
import { User, Mail, Save, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { updateProfile } from '../../lib/auth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function StudentProfile() {
  const { profile, refreshProfile } = useAuth()
  const [name, setName] = useState(profile?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true); setError('')
    try {
      await updateProfile(profile.id, { name })
      await refreshProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account details</p>
      </div>

      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/30">
            {profile?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{profile?.name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Shield size={13} className="text-indigo-500" />
              <span className="text-xs text-indigo-600 dark:text-indigo-400 capitalize">{profile?.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Edit Profile</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-5">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<User size={16} />} placeholder="Your full name" required />
          <Input label="Email Address" value={profile?.email ?? ''} icon={<Mail size={16} />} disabled className="opacity-60 cursor-not-allowed" />
          {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-600 dark:text-red-400">{error}</div>}
          {success && <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">Profile updated successfully!</div>}
          <Button type="submit" loading={saving} icon={<Save size={16} />}>Save Changes</Button>
        </form>
      </div>

      <div className="glass rounded-2xl p-6 border border-gray-200 dark:border-white/10 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
        <div className="flex flex-col gap-3 text-sm">
          {[
            { label: 'Member since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'N/A' },
            { label: 'Account type', value: profile?.role, accent: true },
            { label: 'Account ID', value: `${profile?.id?.slice(0, 8)}...`, mono: true },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
              <span className="text-gray-500">{row.label}</span>
              <span className={`${row.accent ? 'text-indigo-600 dark:text-indigo-400 capitalize font-medium' : row.mono ? 'text-gray-400 dark:text-gray-500 font-mono text-xs' : 'text-gray-900 dark:text-white'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
