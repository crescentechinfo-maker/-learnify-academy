import { useEffect, useRef, useState } from 'react'
import { Award, Download, Sparkles, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserCertificates, issueCertificate } from '../../lib/certificates'
import { getAllProgress } from '../../lib/progress'
import { getCourses } from '../../lib/courses'
import { Button } from '../../components/ui/Button'
import { LearnifyLogoSVG, learnifyLogoSVGString } from '../../components/LearnifyLogo'
import type { Certificate, Course } from '../../types'

function starburstPoints(cx: number, cy: number, outerR: number, innerR: number, n = 36): string {
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const oa = ((i * 360 / n) - 90) * Math.PI / 180
    const ia = (((i + 0.5) * 360 / n) - 90) * Math.PI / 180
    pts.push(`${(cx + outerR * Math.cos(oa)).toFixed(2)},${(cy + outerR * Math.sin(oa)).toFixed(2)}`)
    pts.push(`${(cx + innerR * Math.cos(ia)).toFixed(2)},${(cy + innerR * Math.sin(ia)).toFixed(2)}`)
  }
  return pts.join(' ')
}

function SealWithRibbon({ size = 130 }: { size?: number }) {
  const pts = starburstPoints(60, 62, 46, 39)
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 120 175" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sg2" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <linearGradient id="rl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#991b1b" /><stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        <linearGradient id="rr" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#991b1b" /><stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <polygon points="28,100 58,100 48,168 28,164 38,148 22,160" fill="url(#rl)" />
      <polygon points="28,100 35,100 28,130 22,130" fill="#7f1d1d" opacity="0.35" />
      <polygon points="92,100 62,100 72,168 92,164 82,148 98,160" fill="url(#rr)" />
      <polygon points="92,100 85,100 92,130 98,130" fill="#7f1d1d" opacity="0.35" />
      <polygon points={pts} fill="#7f1d1d" transform="translate(1.5,2)" opacity="0.2" />
      <polygon points={pts} fill="url(#sg2)" />
      <circle cx="60" cy="62" r="31" fill="#dc2626" />
      <circle cx="60" cy="62" r="28" fill="#b91c1c" />
      <circle cx="60" cy="62" r="25" fill="none" stroke="#fca5a5" strokeWidth="0.7" strokeDasharray="2,1.5" />
      <text x="60" y="52" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1.5">CERTIFIED</text>
      <text x="60" y="63" textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="0.5">LEARNIFY</text>
      <text x="60" y="73" textAnchor="middle" fill="#fca5a5" fontSize="6" fontFamily="Arial,sans-serif">✦ ✦ ✦</text>
      <text x="60" y="83" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1">CERTIFIED</text>
    </svg>
  )
}

function CertificateView({ cert, studentName }: { cert: Certificate; studentName: string }) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const issued = new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  async function handleDownload() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fffef5',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width / 2, canvas.height / 2] })
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save(`Learnify-Certificate-${cert.certificate_code}.pdf`)
    } catch (e) {
      console.error('Download error:', e)
    } finally {
      setDownloading(false)
    }
  }

  // Print fallback
  function handlePrint() {
    const n = 36, cx = 60, cy = 62, outerR = 46, innerR = 39
    const pts: string[] = []
    for (let i = 0; i < n; i++) {
      const oa = ((i * 360 / n) - 90) * Math.PI / 180
      const ia = (((i + 0.5) * 360 / n) - 90) * Math.PI / 180
      pts.push(`${(cx + outerR * Math.cos(oa)).toFixed(2)},${(cy + outerR * Math.sin(oa)).toFixed(2)}`)
      pts.push(`${(cx + innerR * Math.cos(ia)).toFixed(2)},${(cy + innerR * Math.sin(ia)).toFixed(2)}`)
    }
    const p = pts.join(' ')
    const sealSvg = `<svg width="130" height="175" viewBox="0 0 120 175" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg2" cx="38%" cy="32%" r="70%"><stop offset="0%" stop-color="#f87171"/><stop offset="50%" stop-color="#dc2626"/><stop offset="100%" stop-color="#7f1d1d"/></radialGradient><linearGradient id="rl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#991b1b"/><stop offset="100%" stop-color="#dc2626"/></linearGradient><linearGradient id="rr" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#991b1b"/><stop offset="100%" stop-color="#dc2626"/></linearGradient></defs><polygon points="28,100 58,100 48,168 28,164 38,148 22,160" fill="url(#rl)"/><polygon points="28,100 35,100 28,130 22,130" fill="#7f1d1d" opacity="0.35"/><polygon points="92,100 62,100 72,168 92,164 82,148 98,160" fill="url(#rr)"/><polygon points="92,100 85,100 92,130 98,130" fill="#7f1d1d" opacity="0.35"/><polygon points="${p}" fill="#7f1d1d" transform="translate(1.5,2)" opacity="0.2"/><polygon points="${p}" fill="url(#sg2)"/><circle cx="60" cy="62" r="31" fill="#dc2626"/><circle cx="60" cy="62" r="28" fill="#b91c1c"/><circle cx="60" cy="62" r="25" fill="none" stroke="#fca5a5" stroke-width="0.7" stroke-dasharray="2,1.5"/><text x="60" y="52" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="1.5">CERTIFIED</text><text x="60" y="63" text-anchor="middle" fill="#fff" font-size="9.5" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="0.5">LEARNIFY</text><text x="60" y="73" text-anchor="middle" fill="#fca5a5" font-size="6" font-family="Arial,sans-serif">&#10022; &#10022; &#10022;</text><text x="60" y="83" text-anchor="middle" fill="#fff" font-size="5.5" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="1">CERTIFIED</text></svg>`

    const win = window.open('', '', 'width=1050,height=760')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${studentName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#f5f5f5;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;}
      .cert{width:980px;min-height:700px;padding:52px 72px 40px;background:linear-gradient(145deg,#fffef5 0%,#fdfdf0 50%,#fffef8 100%);border:2px solid #c9a84c;box-shadow:inset 0 0 0 6px #fffef5,inset 0 0 0 8px #e8d48933;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;}
      .cert::before{content:'';position:absolute;inset:12px;border:1px solid #e8d48966;}
      .corner{position:absolute;width:70px;height:70px;}
      .corner-tl{top:18px;left:18px;border-top:2px solid #c9a84c;border-left:2px solid #c9a84c;}
      .corner-tr{top:18px;right:18px;border-top:2px solid #c9a84c;border-right:2px solid #c9a84c;}
      .corner-bl{bottom:18px;left:18px;border-bottom:2px solid #c9a84c;border-left:2px solid #c9a84c;}
      .corner-br{bottom:18px;right:18px;border-bottom:2px solid #c9a84c;border-right:2px solid #c9a84c;}
      .divider{width:120px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:14px auto;}
      .title{font-family:'Playfair Display',serif;font-size:44px;color:#1a1a3e;font-weight:700;margin-bottom:10px;}
      .subtitle{font-size:14px;color:#6b7280;margin-bottom:18px;}
      .name{font-family:'Dancing Script',cursive;font-size:56px;font-weight:700;color:#1a1a3e;}
      .name-line{width:100%;height:2px;background:linear-gradient(90deg,transparent,#c9a84c 20%,#c9a84c 80%,transparent);margin-top:4px;}
      .completed{font-size:13px;color:#6b7280;margin:18px 0 6px;}
      .course{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#1a1a3e;margin-bottom:18px;}
      .ai-msg{font-size:12px;color:#4b5563;font-style:italic;max-width:600px;margin:0 auto 20px;line-height:1.8;padding:12px 20px;background:rgba(201,168,76,0.08);border-left:3px solid #c9a84c;border-radius:0 6px 6px 0;text-align:left;}
      .footer{display:flex;align-items:flex-end;justify-content:center;gap:60px;margin-top:auto;padding-top:10px;width:100%;}
      .footer-item{text-align:center;min-width:140px;}
      .footer-label{font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#c9a84c;font-weight:600;margin-bottom:5px;}
      .footer-value{font-size:13px;color:#374151;font-weight:500;}
      .footer-code{font-family:monospace;font-size:12px;color:#374151;font-weight:600;}
      @media print{body{background:white;}}
    </style></head><body>
    <div class="cert">
      <div class="corner corner-tl"></div><div class="corner corner-tr"></div>
      <div class="corner corner-bl"></div><div class="corner corner-br"></div>
      ${learnifyLogoSVGString(200, 115)}
      <div class="divider"></div>
      <div class="title">Certificate of Completion</div>
      <div class="subtitle">This is to proudly certify that</div>
      <div><div class="name">${studentName}</div><div class="name-line"></div></div>
      <div class="completed">has successfully completed the course</div>
      <div class="course">${cert.course?.title ?? 'Course'}</div>
      ${cert.ai_message ? `<div class="ai-msg">"${cert.ai_message}"</div>` : ''}
      <div class="footer">
        <div class="footer-item"><div class="footer-label">Date Issued</div><div class="footer-value">${issued}</div></div>
        ${sealSvg}
        <div class="footer-item"><div class="footer-label">Certificate ID</div><div class="footer-code">${cert.certificate_code}</div></div>
      </div>
    </div>
    <script>window.onload=()=>{window.print();}</script>
    </body></html>`)
    win.document.close()
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-amber-200/60">
      {/* Certificate — captured by html2canvas */}
      <div
        ref={certRef}
        className="relative p-10 sm:p-14 flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(145deg, #fffef5 0%, #fdfdf0 50%, #fffef8 100%)', border: '2px solid #c9a84c' }}
      >
        {/* Inner border */}
        <div className="absolute inset-3 border border-amber-300/30 pointer-events-none" />
        {/* Corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-amber-400/70" />
        <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-amber-400/70" />
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-amber-400/70" />
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-amber-400/70" />

        {/* Learnify Logo */}
        <div className="mb-1">
          <LearnifyLogoSVG width={200} height={115} />
        </div>

        {/* Gold divider */}
        <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4" />

        {/* Title */}
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Certificate of Completion
        </h2>
        <p className="text-gray-500 text-sm tracking-wide mb-6">This is to proudly certify that</p>

        {/* Student Name */}
        <div className="mb-1 px-6">
          <p className="text-5xl sm:text-6xl font-bold text-slate-900" style={{ fontFamily: "'Dancing Script', cursive" }}>
            {studentName}
          </p>
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mt-2" />
        </div>

        <p className="text-gray-500 text-sm uppercase tracking-widest mt-5 mb-2">has successfully completed the course</p>
        <p className="text-2xl font-bold text-slate-900 mb-5 px-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {cert.course?.title ?? 'Course'}
        </p>

        {/* AI message */}
        {cert.ai_message && (
          <div className="w-full max-w-xl bg-amber-50/80 border-l-4 border-amber-400 rounded-r-xl px-5 py-3 mb-6 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={12} className="text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">AI Achievement Message</span>
            </div>
            <p className="text-sm text-gray-600 italic leading-relaxed">"{cert.ai_message}"</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-end justify-center gap-10 sm:gap-16 mt-4 pt-4 border-t border-amber-200/60 w-full">
          <div className="text-center min-w-[110px]">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Date Issued</p>
            <p className="text-sm font-medium text-gray-700">{issued}</p>
          </div>
          <div className="flex-shrink-0">
            <SealWithRibbon size={120} />
          </div>
          <div className="text-center min-w-[110px]">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">Certificate ID</p>
            <p className="text-xs font-mono font-semibold text-gray-700">{cert.certificate_code}</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">{cert.course?.title}</p>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{cert.certificate_code}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handlePrint} icon={<Download size={14} />}>
            Print
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={handleDownload}
            icon={downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            loading={downloading}
          >
            Download PDF
          </Button>
        </div>
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
    const fetchedCerts = await getUserCertificates(profile.id)
    setCerts(fetchedCerts)

    let allProgress: { course_id: string; percentage: number }[] = []
    let allCourses: Course[] = []
    try { allProgress = await getAllProgress(profile.id) } catch { /* none */ }
    try { allCourses = await getCourses() } catch { /* none */ }

    const certCourseIds = new Set(fetchedCerts.map((c) => c.course_id))
    const completed100 = allProgress.filter((p) => p.percentage === 100).map((p) => p.course_id)
    setCompletedNoCert(allCourses.filter((c) => completed100.includes(c.id) && !certCourseIds.has(c.id)))
    setLoading(false)
  }

  useEffect(() => { if (profile) loadData() }, [profile])

  async function handleClaim(courseId: string, courseTitle: string) {
    if (!profile) return
    setClaimError(null)
    setClaiming(courseId)
    try {
      await issueCertificate(profile.id, courseId)
      await loadData()
    } catch {
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
                    <Button size="sm" variant="gold" loading={claiming === course.id} icon={<RefreshCw size={13} />} onClick={() => handleClaim(course.id, course.title)}>
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
