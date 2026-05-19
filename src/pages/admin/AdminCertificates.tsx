import { useEffect, useState } from 'react'
import { Award, Search } from 'lucide-react'
import { getAllCertificates } from '../../lib/certificates'
import type { Certificate } from '../../types'

export function AdminCertificates() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllCertificates().then((data) => { setCerts(data); setLoading(false) })
  }, [])

  const filtered = certs.filter(
    (c) => c.profile?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.certificate_code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{certs.length} certificates issued</p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by student, course, or code..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 glass rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="glass rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/10">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Course</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Certificate ID</th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-gray-900 text-sm font-semibold flex-shrink-0">
                        {cert.profile?.name?.charAt(0)?.toUpperCase() ?? 'S'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.profile?.name ?? 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{cert.profile?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell max-w-xs">
                    <p className="truncate">{cert.course?.title ?? 'Unknown'}</p>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-xs font-mono text-amber-600 dark:text-amber-400">{cert.certificate_code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-16 text-center">
                  <Award size={32} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No certificates found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
