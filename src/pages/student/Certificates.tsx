import { useEffect, useRef, useState } from 'react'
import { Award, Printer } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserCertificates } from '../../lib/certificates'
import { Button } from '../../components/ui/Button'
import type { Certificate } from '../../types'

function CertificateView({ cert, profile }: { cert: Certificate; profile: { name: string } }) {
  const printRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const win = window.open('', '', 'width=900,height=650')
    if (!win) return
    win.document.write(`
      <html><head><title>Certificate - ${cert.certificate_code}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Georgia', serif; background: white; }
        .cert { width: 900px; min-height: 600px; padding: 60px; border: 20px solid #4f46e5; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; color: #4f46e5; margin-bottom: 30px; }
        .title { font-size: 48px; color: #1a1a2e; margin-bottom: 16px; }
        .sub { font-size: 18px; color: #666; margin-bottom: 40px; }
        .name { font-size: 36px; font-weight: bold; color: #4f46e5; margin-bottom: 16px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; display: inline-block; }
        .course { font-size: 24px; color: #1a1a2e; margin-bottom: 40px; }
        .meta { font-size: 14px; color: #999; }
      </style></head><body>
      <div class="cert">
        <div class="logo">🎓 Learnify AI Academy</div>
        <div class="title">Certificate of Completion</div>
        <div class="sub">This is to certify that</div>
        <div class="name">${profile.name}</div>
        <div style="font-size:16px;color:#666;margin-bottom:12px">has successfully completed</div>
        <div class="course">${cert.course?.title ?? 'Course'}</div>
        <div class="meta">
          Issued: ${new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
          Certificate ID: ${cert.certificate_code}
        </div>
      </div></body></html>`)
    win.document.close()
    win.print()
  }

  return (
    <div className="glass rounded-2xl border border-amber-200 dark:border-amber-500/20 overflow-hidden">
      <div ref={printRef} className="p-8 bg-gradient-to-br from-amber-50 dark:from-gray-900 to-indigo-50 dark:to-indigo-950 border-b border-gray-200 dark:border-white/10">
        <div className="max-w-2xl mx-auto text-center border-2 border-amber-300 dark:border-amber-500/30 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center mx-auto mb-4">
            <Award size={28} className="text-gray-900" />
          </div>
          <p className="text-amber-600 dark:text-amber-400 text-sm font-medium uppercase tracking-widest mb-2">Learnify AI Academy</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Certificate of Completion</h2>
          <p className="text-gray-500 text-sm mb-6">This is to certify that</p>
          <p className="text-3xl font-bold gradient-text mb-2">{profile.name}</p>
          <p className="text-gray-500 text-sm mb-4">has successfully completed</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{cert.course?.title ?? 'Course'}</p>
          <div className="flex items-center justify-center gap-8 text-xs text-gray-500">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Date Issued</p>
              <p>{new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-white/20" />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">Certificate ID</p>
              <p className="font-mono text-amber-600 dark:text-amber-400">{cert.certificate_code}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.course?.title}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{cert.certificate_code}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Printer size={14} />}>Print PDF</Button>
      </div>
    </div>
  )
}

export function StudentCertificates() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) return
    getUserCertificates(profile.id).then((data) => { setCerts(data); setLoading(false) })
  }, [profile])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your achievements and completed courses</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(2)].map((_, i) => <div key={i} className="h-64 glass rounded-2xl animate-pulse" />)}</div>
      ) : certs.length > 0 ? (
        <div className="space-y-6">
          {certs.map((cert) => <CertificateView key={cert.id} cert={cert} profile={{ name: profile?.name ?? 'Student' }} />)}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-2xl border border-gray-200 dark:border-white/8">
          <Award size={56} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No certificates yet</h3>
          <p className="text-gray-400 text-sm">Complete a course to earn your first certificate</p>
        </div>
      )}
    </div>
  )
}
