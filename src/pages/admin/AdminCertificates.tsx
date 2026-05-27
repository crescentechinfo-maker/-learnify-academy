import { useEffect, useState } from 'react'
import { Award, Search, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { getAllCertificates, deleteCertificate } from '../../lib/certificates'
import type { Certificate } from '../../types'

interface StudentGroup {
  userId: string
  name: string
  email: string
  avatar: string | null
  certs: Certificate[]
}

export function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    getAllCertificates().then((data) => { setCerts(data); setLoading(false) })
  }, [])

  async function handleDelete(certId: string, courseTitle: string) {
    if (!window.confirm(`Delete certificate for "${courseTitle}"? This cannot be undone.`)) return
    setDeleting(certId)
    try {
      await deleteCertificate(certId)
      setCerts((prev) => prev.filter((c) => c.id !== certId))
    } catch {
      alert('Failed to delete certificate. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  // Group certificates by student
  const groupMap = new Map<string, StudentGroup>()
  for (const cert of certs) {
    const uid = cert.user_id
    if (!groupMap.has(uid)) {
      groupMap.set(uid, {
        userId: uid,
        name: cert.profile?.name ?? 'Unknown',
        email: cert.profile?.email ?? '',
        avatar: cert.profile?.avatar ?? null,
        certs: [],
      })
    }
    groupMap.get(uid)!.certs.push(cert)
  }
  const groups = Array.from(groupMap.values())

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.certs.some(
      (c) =>
        c.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.certificate_code.toLowerCase().includes(search.toLowerCase())
    )
  )

  function toggleExpand(userId: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {certs.length} certificate{certs.length !== 1 ? 's' : ''} issued to {groups.length} student{groups.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student name, course, or certificate ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 glass rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-2xl border border-gray-200 dark:border-white/10 py-16 text-center">
          <Award size={32} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No certificates found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => {
            const isOpen = expanded.has(group.userId)
            const initials = group.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
            return (
              <div key={group.userId} className="glass rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                {/* Student row */}
                <button
                  onClick={() => toggleExpand(group.userId)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-gray-900 text-sm font-bold flex-shrink-0">
                    {initials || 'S'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{group.name}</p>
                    <p className="text-xs text-gray-500 truncate">{group.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                      {group.certs.length} cert{group.certs.length !== 1 ? 's' : ''}
                    </span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {/* Expanded certificates */}
                {isOpen && (
                  <div className="border-t border-gray-100 dark:border-white/5">
                    {group.certs.map((cert, idx) => (
                      <div
                        key={cert.id}
                        className={`flex items-center gap-4 px-6 py-3 ${idx !== group.certs.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''} bg-gray-50/50 dark:bg-white/2`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                          <Award size={15} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {cert.course?.title ?? 'Unknown Course'}
                          </p>
                          <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                            {cert.certificate_code}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">
                          {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(cert.id, cert.course?.title ?? 'this course') }}
                          disabled={deleting === cert.id}
                          className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0 disabled:opacity-40"
                          title="Delete certificate"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
