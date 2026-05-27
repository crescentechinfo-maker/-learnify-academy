import { useEffect, useState } from 'react'
import { Award, Search, ChevronDown, ChevronUp, Trash2, Eye, X, AlertTriangle, Loader2 } from 'lucide-react'
import { getAllCertificates, deleteCertificate } from '../../lib/certificates'
import { CertificateView } from '../student/Certificates'
import type { Certificate } from '../../types'

interface StudentGroup {
  userId: string
  name: string
  email: string
  avatar: string | null
  certs: Certificate[]
}

interface DeleteTarget {
  certId: string
  courseTitle: string
  studentName: string
  certCode: string
}

export function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
  const [viewCert, setViewCert] = useState<{ cert: Certificate; studentName: string } | null>(null)

  useEffect(() => {
    getAllCertificates().then((data) => { setCerts(data); setLoading(false) })
  }, [])

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCertificate(deleteTarget.certId)
      setCerts((prev) => prev.filter((c) => c.id !== deleteTarget.certId))
      setDeleteTarget(null)
    } catch {
      setDeleteTarget(null)
      alert('Failed to delete certificate. Please try again.')
    } finally {
      setDeleting(false)
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
                          onClick={(e) => { e.stopPropagation(); setViewCert({ cert, studentName: group.name }) }}
                          className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex-shrink-0"
                          title="View certificate"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteTarget({
                              certId: cert.id,
                              courseTitle: cert.course?.title ?? 'Unknown Course',
                              studentName: group.name,
                              certCode: cert.certificate_code,
                            })
                          }}
                          className="ml-1 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0"
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

      {/* ── Delete confirmation modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
            {/* Red header bar */}
            <div className="bg-red-500/10 border-b border-red-200 dark:border-red-500/20 px-6 py-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Delete Certificate</h3>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-0.5">This action cannot be undone</p>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You are about to permanently delete the following certificate:
              </p>
              <div className="rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0">Student</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{deleteTarget.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0">Course</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{deleteTarget.courseTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-20 flex-shrink-0">Cert ID</span>
                  <span className="text-xs font-mono text-amber-600 dark:text-amber-400">{deleteTarget.certCode}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Once deleted, the student will lose access to this certificate and it cannot be recovered.
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 pb-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? 'Deleting…' : 'Delete Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Certificate preview modal ── */}
      {viewCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewCert(null)}
        >
          <div className="relative max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setViewCert(null)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-gray-900 border border-white/20 flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
            >
              <X size={14} />
            </button>
            <CertificateView cert={viewCert.cert} studentName={viewCert.studentName} />
          </div>
        </div>
      )}
    </div>
  )
}
