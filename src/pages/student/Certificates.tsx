import { useEffect, useState } from 'react'
import { Award, Download, GraduationCap, Sparkles, RefreshCw, AlertCircle } from 'lucide-react'

function WaxSeal({ size = 80 }: { size?: number }) {
  const n = 36, cx = 50, cy = 50, outerR = 47, innerR = 40
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const oa = ((i * 360 / n) - 90) * Math.PI / 180
    const ia = (((i + 0.5) * 360 / n) - 90) * Math.PI / 180
    pts.push(`${(cx + outerR * Math.cos(oa)).toFixed(2)},${(cy + outerR * Math.sin(oa)).toFixed(2)}`)
    pts.push(`${(cx + innerR * Math.cos(ia)).toFixed(2)},${(cy + innerR * Math.sin(ia)).toFixed(2)}`)
  }
  const points = pts.join(' ')
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sealGrad" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <polygon points={points} fill="#92400e" transform="translate(1.5,2)" opacity="0.25" />
      <polygon points={points} fill="url(#sealGrad)" />
      <circle cx={cx} cy={cy} r={31} fill="#d97706" />
      <circle cx={cx} cy={cy} r={28} fill="#b45309" />
      <circle cx={cx} cy={cy} r={25} fill="none" stroke="#fcd34d" strokeWidth="0.7" strokeDasharray="2.2,1.4" />
      <text x={cx} y={43} textAnchor="middle" fill="#fef3c7" fontSize="7" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1">LEARNIFY</text>
      <text x={cx} y={55} textAnchor="middle" fill="#fef3c7" fontSize="13">★</text>
      <text x={cx} y={65} textAnchor="middle" fill="#fef3c7" fontSize="5.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1.5">CERTIFIED</text>
    </svg>
  )
}
import { useAuth } from '../../contexts/AuthContext'
import { getUserCertificates, issueCertificate } from '../../lib/certificates'
import { getAllProgress } from '../../lib/progress'
import { getCourses } from '../../lib/courses'
import { Button } from '../../components/ui/Button'
import type { Certificate, Course } from '../../types'

function CertificateView({ cert, studentName }: { cert: Certificate; studentName: string }) {
  function handlePrint() {
    const win = window.open('', '', 'width=1000,height=720')
    if (!win) return
    const issued = new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    win.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${studentName}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
      .page { width: 960px; min-height: 680px; padding: 0; position: relative; font-family: 'Inter', sans-serif; }
      .cert {
        width: 100%; min-height: 680px; padding: 56px 72px;
        background: linear-gradient(135deg, #fefce8 0%, #fff 40%, #eef2ff 100%);
        border: 2px solid #e5c84a;
        box-shadow: inset 0 0 0 8px #fff, inset 0 0 0 10px #f59e0b33;
        display: flex; flex-direction: column; align-items: center; justify-content: space-between;
        text-align: center; position: relative; overflow: hidden;
      }
      .corner { position: absolute; width: 80px; height: 80px; }
      .corner-tl { top: 16px; left: 16px; border-top: 3px solid #f59e0b; border-left: 3px solid #f59e0b; }
      .corner-tr { top: 16px; right: 16px; border-top: 3px solid #f59e0b; border-right: 3px solid #f59e0b; }
      .corner-bl { bottom: 16px; left: 16px; border-bottom: 3px solid #f59e0b; border-left: 3px solid #f59e0b; }
      .corner-br { bottom: 16px; right: 16px; border-bottom: 3px solid #f59e0b; border-right: 3px solid #f59e0b; }
      .logo-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
      .logo-icon { width: 52px; height: 52px; background: linear-gradient(135deg, #4f46e5, #6366f1); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; }
      .logo-text { font-size: 26px; font-weight: 700; color: #4f46e5; letter-spacing: -0.5px; }
      .logo-text span { color: #f59e0b; }
      .academy { font-size: 12px; color: #64748b; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 24px; }
      .divider { width: 80px; height: 2px; background: linear-gradient(90deg, transparent, #f59e0b, transparent); margin: 0 auto 20px; }
      .heading { font-family: 'Playfair Display', serif; font-size: 42px; color: #1e1b4b; font-weight: 700; margin-bottom: 8px; }
      .sub { font-size: 15px; color: #64748b; margin-bottom: 24px; letter-spacing: 0.5px; }
      .name { font-family: 'Playfair Display', serif; font-size: 46px; font-weight: 700; color: #4f46e5; margin-bottom: 6px; padding-bottom: 10px; border-bottom: 2px solid #f59e0b; display: inline-block; }
      .completed { font-size: 14px; color: #64748b; margin: 16px 0 8px; letter-spacing: 0.5px; }
      .course { font-size: 24px; font-weight: 600; color: #1e1b4b; margin-bottom: 20px; }
      .ai-msg { font-size: 13px; color: #475569; font-style: italic; max-width: 580px; margin: 0 auto 24px; line-height: 1.7; padding: 14px 20px; background: #fefce8; border-left: 3px solid #f59e0b; border-radius: 0 8px 8px 0; text-align: left; }
      .footer { display: flex; gap: 60px; align-items: flex-start; }
      .footer-item { text-align: center; }
      .footer-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 4px; }
      .footer-value { font-size: 13px; color: #334155; font-weight: 500; }
      .footer-code { font-family: monospace; font-size: 13px; color: #f59e0b; font-weight: 600; }
      .seal svg { width: 80px; height: 80px; }
    </style></head><body>
    <div class="page"><div class="cert">
      <div class="corner corner-tl"></div><div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div><div class="corner corner-br"></div>
      <div>
        <div class="logo-wrap" style="justify-content:center">
          <div class="logo-icon">🎓</div>
          <div class="logo-text">Learnify <span>AI</span></div>
        </div>
        <div class="academy">Learnify AI Academy</div>
        <div class="divider"></div>
        <div class="heading">Certificate of Completion</div>
        <div class="sub">This is to proudly certify that</div>
        <div class="name">${studentName}</div>
        <div class="completed">has successfully completed the course</div>
        <div class="course">${cert.course?.title ?? 'Course'}</div>
        ${cert.ai_message ? `<div class="ai-msg">"${cert.ai_message}"</div>` : ''}
      </div>
      <div class="footer">
        <div class="footer-item">
          <div class="footer-label">Date Issued</div>
          <div class="footer-value">${issued}</div>
        </div>
        <div class="seal">${(() => {
          const n=36,cx=50,cy=50,outerR=47,innerR=40
          const pts=[]
          for(let i=0;i<n;i++){
            const oa=((i*360/n)-90)*Math.PI/180
            const ia=(((i+0.5)*360/n)-90)*Math.PI/180
            pts.push(`${(cx+outerR*Math.cos(oa)).toFixed(2)},${(cy+outerR*Math.sin(oa)).toFixed(2)}`)
            pts.push(`${(cx+innerR*Math.cos(ia)).toFixed(2)},${(cy+innerR*Math.sin(ia)).toFixed(2)}`)
          }
          const p=pts.join(' ')
          return `<svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg" cx="38%" cy="32%" r="70%"><stop offset="0%" stop-color="#fde68a"/><stop offset="50%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/></radialGradient></defs><polygon points="${p}" fill="#92400e" transform="translate(1.5,2)" opacity="0.25"/><polygon points="${p}" fill="url(#sg)"/><circle cx="50" cy="50" r="31" fill="#d97706"/><circle cx="50" cy="50" r="28" fill="#b45309"/><circle cx="50" cy="50" r="25" fill="none" stroke="#fcd34d" stroke-width="0.7" stroke-dasharray="2.2,1.4"/><text x="50" y="43" text-anchor="middle" fill="#fef3c7" font-size="7" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="1">LEARNIFY</text><text x="50" y="55" text-anchor="middle" fill="#fef3c7" font-size="13">&#9733;</text><text x="50" y="65" text-anchor="middle" fill="#fef3c7" font-size="5.5" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="1.5">CERTIFIED</text></svg>`
        })()}</div>
        <div class="footer-item">
          <div class="footer-label">Certificate ID</div>
          <div class="footer-code">${cert.certificate_code}</div>
        </div>
      </div>
    </div></div>
    <script>window.onload=()=>{window.print();}</script>
    </body></html>`)
    win.document.close()
  }

  const issued = new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="rounded-2xl overflow-hidden shadow-xl border border-amber-200 dark:border-amber-500/20">
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 p-10">
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />

        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                Learnify <span className="text-amber-500">AI</span>
              </div>
              <div className="text-xs text-gray-400 tracking-widest uppercase">Academy</div>
            </div>
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-4" />

          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Award size={26} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Certificate of Completion</h2>
          <p className="text-gray-400 text-sm mb-6 tracking-wider uppercase text-xs">This is to proudly certify that</p>

          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {studentName}
          </p>
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-2 mb-5" />

          <p className="text-gray-500 text-sm mb-2 uppercase tracking-widest text-xs">has successfully completed</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-5 px-4">{cert.course?.title ?? 'Course'}</p>

          {cert.ai_message && (
            <div className="bg-amber-50 dark:bg-amber-500/10 border-l-4 border-amber-400 rounded-r-xl px-5 py-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">AI Achievement Message</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">"{cert.ai_message}"</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-10 pt-4 border-t border-amber-200 dark:border-amber-500/20">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Date Issued</p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{issued}</p>
            </div>
            <div className="flex-shrink-0 drop-shadow-lg">
              <WaxSeal size={72} />
            </div>
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Certificate ID</p>
              <p className="text-sm font-mono font-semibold text-amber-600 dark:text-amber-400">{cert.certificate_code}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{cert.course?.title}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{cert.certificate_code}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Download size={14} />}>
          Download PDF
        </Button>
      </div>
    </div>
  )
}

export function StudentCertificates() {
  const { profile } = useAuth()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [completedNoCert, setCompletedNoCert] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [claimError, setClaimError] = useState<string | null>(null)

  async function loadData() {
    if (!profile) return
    setLoading(true)

    // Fetch each independently so one failure doesn't block others
    const fetchedCerts = await getUserCertificates(profile.id)
    setCerts(fetchedCerts)

    let allProgress: { course_id: string; percentage: number }[] = []
    let allCourses: Course[] = []

    try {
      allProgress = await getAllProgress(profile.id)
    } catch { /* no progress yet */ }

    try {
      allCourses = await getCourses()
    } catch { /* no courses */ }

    const certCourseIds = new Set(fetchedCerts.map((c) => c.course_id))
    const completed100 = allProgress.filter((p) => p.percentage === 100).map((p) => p.course_id)
    const missing = allCourses.filter((c) => completed100.includes(c.id) && !certCourseIds.has(c.id))
    setCompletedNoCert(missing)

    setLoading(false)
  }

  useEffect(() => {
    if (profile) loadData()
  }, [profile])

  async function handleClaim(courseId: string, courseTitle: string) {
    if (!profile) return
    setClaimError(null)
    setClaiming(courseId)
    try {
      await issueCertificate(profile.id, courseId)
      await loadData()
    } catch (e: any) {
      console.error('Claim error:', e)
      setClaimError(`Failed to claim certificate for "${courseTitle}". Please try again.`)
    } finally {
      setClaiming(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your achievements and completed courses</p>
      </div>

      {claimError && (
        <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {claimError}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <div key={i} className="h-80 glass rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Completed courses missing a cert */}
          {completedNoCert.length > 0 && (
            <div className="glass rounded-2xl border border-amber-200 dark:border-amber-500/20 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-amber-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Certificates Ready to Claim</h3>
              </div>
              <div className="space-y-3">
                {completedNoCert.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{course.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Course completed — click to generate your certificate</p>
                    </div>
                    <Button
                      size="sm"
                      variant="gold"
                      loading={claiming === course.id}
                      icon={<RefreshCw size={13} />}
                      onClick={() => handleClaim(course.id, course.title)}
                    >
                      Claim
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certs.length > 0 ? (
            certs.map((cert) => (
              <CertificateView key={cert.id} cert={cert} studentName={profile?.name ?? 'Student'} />
            ))
          ) : completedNoCert.length === 0 ? (
            <div className="text-center py-24 glass rounded-2xl border border-gray-200 dark:border-white/8">
              <Award size={56} className="text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No certificates yet</h3>
              <p className="text-gray-400 text-sm">Complete a course to earn your first certificate</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
