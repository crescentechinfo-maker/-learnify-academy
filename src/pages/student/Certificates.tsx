import { useEffect, useRef, useState } from 'react'
import { Award, Download, Sparkles, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserCertificates, issueCertificate } from '../../lib/certificates'
import { getAllProgress } from '../../lib/progress'
import { getCourses } from '../../lib/courses'
import { Button } from '../../components/ui/Button'
import { LearnifyLogoSVG, learnifyLogoSVGString } from '../../components/LearnifyLogo'
import type { Certificate, Course } from '../../types'

function starburstPoints(cx: number, cy: number, outerR: number, innerR: number, n = 22): string {
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
  const pts = starburstPoints(60, 60, 48, 41, 22)
  return (
    <svg width={size} height={size * 1.38} viewBox="0 0 120 178" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sg2" cx="36%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="35%" stopColor="#dc2626" />
          <stop offset="75%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </radialGradient>
        <linearGradient id="ribL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b91c1c" /><stop offset="50%" stopColor="#ef4444" /><stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="ribR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b91c1c" /><stop offset="50%" stopColor="#ef4444" /><stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
      </defs>
      <polygon points="26,102 54,102 46,170 26,166 37,150 20,164" fill="url(#ribL)" />
      <rect x="36" y="102" width="2" height="58" fill="#7f1d1d" opacity="0.3" />
      <polygon points="94,102 66,102 74,170 94,166 83,150 100,164" fill="url(#ribR)" />
      <rect x="82" y="102" width="2" height="58" fill="#7f1d1d" opacity="0.3" />
      <polygon points={pts} fill="#5a0f0f" transform="translate(2,3)" opacity="0.18" />
      <polygon points={pts} fill="url(#sg2)" />
      <circle cx="60" cy="60" r="32" fill="#c91a1a" />
      <circle cx="60" cy="60" r="29" fill="#b91c1c" />
      <circle cx="60" cy="60" r="26" fill="none" stroke="#fca5a5" strokeWidth="0.9" strokeDasharray="2.5,1.8" />
      <circle cx="60" cy="60" r="23" fill="none" stroke="#f87171" strokeWidth="0.4" opacity="0.5" />
      <text x="60" y="49" textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="2">CERTIFIED</text>
      <text x="60" y="62" textAnchor="middle" fill="#fff" fontSize="10.5" fontWeight="bold" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="0.8">LEARNIFY</text>
      <text x="60" y="72" textAnchor="middle" fill="#fca5a5" fontSize="6" fontFamily="Arial,sans-serif">✦ ✦ ✦</text>
      <text x="60" y="82" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1.5">CERTIFIED</text>
    </svg>
  )
}

/* Decorative corner ornament (compass-rose style) */
function CornerOrnament({ flip }: { flip?: boolean }) {
  const s = flip ? 'scale(-1,1)' : undefined
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <g opacity="0.35" transform={s}>
        <circle cx="18" cy="72" r="34" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="18" cy="72" r="26" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="18" cy="72" r="18" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="18" cy="72" r="10" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <line x1="18" y1="38" x2="18" y2="90" stroke="#c9a84c" strokeWidth="0.6" />
        <line x1="-16" y1="72" x2="52" y2="72" stroke="#c9a84c" strokeWidth="0.6" />
        <line x1="-6" y1="48" x2="42" y2="90" stroke="#c9a84c" strokeWidth="0.5" />
        <line x1="42" y1="48" x2="-6" y2="90" stroke="#c9a84c" strokeWidth="0.5" />
        <polygon points="18,60 22,72 18,84 14,72" fill="#c9a84c" opacity="0.6" />
        <polygon points="6,72 18,68 30,72 18,76" fill="#c9a84c" opacity="0.6" />
      </g>
    </svg>
  )
}

const GOLD = '#c9a84c'
const CERT_BG = 'linear-gradient(160deg,#faf8f0 0%,#f5f0e8 40%,#faf7f0 70%,#f2eee4 100%)'

function CertificateView({ cert, studentName }: { cert: Certificate; studentName: string }) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const issued = new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  async function handleDownload() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const { jsPDF } = await import('jspdf')

      const dataUrl = await toPng(certRef.current, {
        pixelRatio: 2,
        backgroundColor: '#faf8f0',
        cacheBust: true,
      })

      const img = new Image()
      img.src = dataUrl
      await new Promise<void>((res) => { img.onload = () => res() })

      const w = img.width / 2
      const h = img.height / 2
      const pdf = new jsPDF({ orientation: w > h ? 'landscape' : 'portrait', unit: 'px', format: [w, h] })
      pdf.addImage(dataUrl, 'PNG', 0, 0, w, h)
      pdf.save(`Learnify-Certificate-${cert.certificate_code}.pdf`)
    } catch (e) {
      console.error('Download error:', e)
      alert('Could not generate PDF. Please use the Print button instead.')
    } finally {
      setDownloading(false)
    }
  }

  function handlePrint() {
    const n = 22, cx = 60, cy = 60, outerR = 48, innerR = 41
    const pts: string[] = []
    for (let i = 0; i < n; i++) {
      const oa = ((i * 360 / n) - 90) * Math.PI / 180
      const ia = (((i + 0.5) * 360 / n) - 90) * Math.PI / 180
      pts.push(`${(cx + outerR * Math.cos(oa)).toFixed(2)},${(cy + outerR * Math.sin(oa)).toFixed(2)}`)
      pts.push(`${(cx + innerR * Math.cos(ia)).toFixed(2)},${(cy + innerR * Math.sin(ia)).toFixed(2)}`)
    }
    const p = pts.join(' ')
    const sealSvg = `<svg width="130" height="179" viewBox="0 0 120 178" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sg2" cx="36%" cy="28%" r="72%"><stop offset="0%" stop-color="#f87171"/><stop offset="35%" stop-color="#dc2626"/><stop offset="75%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#7f1d1d"/></radialGradient><linearGradient id="ribL" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#b91c1c"/><stop offset="50%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient><linearGradient id="ribR" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#b91c1c"/><stop offset="50%" stop-color="#ef4444"/><stop offset="100%" stop-color="#991b1b"/></linearGradient></defs><polygon points="26,102 54,102 46,170 26,166 37,150 20,164" fill="url(#ribL)"/><rect x="36" y="102" width="2" height="58" fill="#7f1d1d" opacity="0.3"/><polygon points="94,102 66,102 74,170 94,166 83,150 100,164" fill="url(#ribR)"/><rect x="82" y="102" width="2" height="58" fill="#7f1d1d" opacity="0.3"/><polygon points="${p}" fill="#5a0f0f" transform="translate(2,3)" opacity="0.18"/><polygon points="${p}" fill="url(#sg2)"/><circle cx="60" cy="60" r="32" fill="#c91a1a"/><circle cx="60" cy="60" r="29" fill="#b91c1c"/><circle cx="60" cy="60" r="26" fill="none" stroke="#fca5a5" stroke-width="0.9" stroke-dasharray="2.5,1.8"/><circle cx="60" cy="60" r="23" fill="none" stroke="#f87171" stroke-width="0.4" opacity="0.5"/><text x="60" y="49" text-anchor="middle" fill="#fff" font-size="6.5" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="2">CERTIFIED</text><text x="60" y="62" text-anchor="middle" fill="#fff" font-size="10.5" font-weight="bold" font-family="Arial Black,Arial,sans-serif" letter-spacing="0.8">LEARNIFY</text><text x="60" y="72" text-anchor="middle" fill="#fca5a5" font-size="6" font-family="Arial,sans-serif">&#10022; &#10022; &#10022;</text><text x="60" y="82" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="1.5">CERTIFIED</text></svg>`

    const win = window.open('', '', 'width=1120,height=820')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${studentName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#e8e4dc;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;padding:20px;}
      .cert{width:1020px;min-height:720px;padding:52px 72px 44px;background:linear-gradient(160deg,#faf8f0 0%,#f5f0e8 40%,#faf7f0 70%,#f2eee4 100%);border:2px solid #c9a84c;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;box-shadow:0 8px 40px rgba(0,0,0,0.18);}
      .inner-border{position:absolute;inset:10px;border:1px solid rgba(201,168,76,0.5);pointer-events:none;}
      .corner{position:absolute;width:62px;height:62px;}
      .c-tl{top:20px;left:20px;border-top:2px solid #c9a84c;border-left:2px solid #c9a84c;}
      .c-tr{top:20px;right:20px;border-top:2px solid #c9a84c;border-right:2px solid #c9a84c;}
      .c-bl{bottom:20px;left:20px;border-bottom:2px solid #c9a84c;border-left:2px solid #c9a84c;}
      .c-br{bottom:20px;right:20px;border-bottom:2px solid #c9a84c;border-right:2px solid #c9a84c;}
      .orn-bl{position:absolute;bottom:22px;left:22px;opacity:0.35;}
      .orn-br{position:absolute;bottom:22px;right:22px;opacity:0.35;transform:scaleX(-1);}
      .star{position:absolute;bottom:34px;right:130px;opacity:0.5;}
      .divider{width:110px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:6px auto 26px;}
      .title{font-family:'Playfair Display',Georgia,serif;font-size:46px;color:#1a1a3e;font-weight:700;margin-bottom:12px;line-height:1.2;}
      .subtitle{font-size:15px;color:#6b7280;margin-bottom:20px;}
      .name-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:4px;}
      .name{font-family:'Dancing Script',cursive;font-size:58px;font-weight:700;color:#1a1a3e;line-height:1.2;}
      .name-line{width:80%;height:1.5px;background:linear-gradient(90deg,transparent,#c9a84c 15%,#c9a84c 85%,transparent);margin:4px auto 22px;}
      .completed{font-size:15px;color:#6b7280;margin-bottom:8px;}
      .course{font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:#1a1a3e;margin-bottom:20px;}
      .ai-msg{font-size:12px;color:#4b5563;font-style:italic;max-width:640px;margin:0 auto 18px;line-height:1.8;padding:10px 18px;background:rgba(201,168,76,0.07);border-left:3px solid #c9a84c;border-radius:0 6px 6px 0;text-align:left;}
      .footer-line{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.55) 80%,transparent);margin-top:auto;margin-bottom:18px;}
      .footer{display:flex;align-items:flex-end;justify-content:space-between;width:100%;padding:0 24px;}
      .footer-item{text-align:center;min-width:150px;}
      .footer-label{font-size:9.5px;text-transform:uppercase;letter-spacing:2.5px;color:#c9a84c;font-weight:700;margin-bottom:6px;}
      .footer-value{font-size:14px;color:#374151;font-weight:500;}
      .footer-code{font-family:monospace;font-size:13px;color:#374151;font-weight:600;letter-spacing:1px;}
      @media print{body{background:white;padding:0;}.cert{box-shadow:none;}}
    </style></head><body>
    <div class="cert">
      <div class="inner-border"></div>
      <div class="corner c-tl"></div><div class="corner c-tr"></div>
      <div class="corner c-bl"></div><div class="corner c-br"></div>
      <div class="orn-bl"><svg width="88" height="88" viewBox="0 0 88 88"><g opacity="1"><circle cx="18" cy="70" r="34" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="26" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="18" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="10" fill="none" stroke="#c9a84c" stroke-width="0.8"/><line x1="18" y1="36" x2="18" y2="88" stroke="#c9a84c" stroke-width="0.6"/><line x1="-16" y1="70" x2="52" y2="70" stroke="#c9a84c" stroke-width="0.6"/><line x1="-4" y1="46" x2="40" y2="88" stroke="#c9a84c" stroke-width="0.5"/><line x1="40" y1="46" x2="-4" y2="88" stroke="#c9a84c" stroke-width="0.5"/><polygon points="18,58 22,70 18,82 14,70" fill="#c9a84c" opacity="0.55"/><polygon points="6,70 18,66 30,70 18,74" fill="#c9a84c" opacity="0.55"/></g></svg></div>
      <div class="orn-br"><svg width="88" height="88" viewBox="0 0 88 88"><g opacity="1"><circle cx="18" cy="70" r="34" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="26" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="18" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="10" fill="none" stroke="#c9a84c" stroke-width="0.8"/><line x1="18" y1="36" x2="18" y2="88" stroke="#c9a84c" stroke-width="0.6"/><line x1="-16" y1="70" x2="52" y2="70" stroke="#c9a84c" stroke-width="0.6"/><line x1="-4" y1="46" x2="40" y2="88" stroke="#c9a84c" stroke-width="0.5"/><line x1="40" y1="46" x2="-4" y2="88" stroke="#c9a84c" stroke-width="0.5"/><polygon points="18,58 22,70 18,82 14,70" fill="#c9a84c" opacity="0.55"/><polygon points="6,70 18,66 30,70 18,74" fill="#c9a84c" opacity="0.55"/></g></svg></div>
      <div class="star"><svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,1 12.5,9.5 21,11 12.5,12.5 11,21 9.5,12.5 1,11 9.5,9.5" fill="#c9a84c"/></svg></div>
      ${learnifyLogoSVGString(230, 150)}
      <div class="divider"></div>
      <div class="title">Certificate of Completion</div>
      <div class="subtitle">This is to proudly certify that</div>
      <div class="name-row">
        <svg width="72" height="26" viewBox="0 0 72 26"><path d="M4,18 Q16,6 30,13 Q44,20 62,9" fill="none" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/></svg>
        <div class="name">${studentName}</div>
        <svg width="72" height="26" viewBox="0 0 72 26"><path d="M10,9 Q28,20 42,13 Q56,6 68,18" fill="none" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <div class="name-line"></div>
      <div class="completed">has successfully completed the course</div>
      <div class="course">${cert.course?.title ?? 'Course'}</div>
      ${cert.ai_message ? `<div class="ai-msg">"${cert.ai_message}"</div>` : ''}
      <div class="footer-line"></div>
      <div class="footer">
        <div class="footer-item"><div class="footer-label">Date Issued</div><div class="footer-value">${issued}</div></div>
        ${sealSvg}
        <div class="footer-item"><div class="footer-label">Certificate ID</div><div class="footer-code">${cert.certificate_code}</div></div>
      </div>
    </div>
    <script>window.onload=()=>{setTimeout(()=>{window.print();},600);}</script>
    </body></html>`)
    win.document.close()
  }

  return (
    <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>

      {/* ── Certificate (captured by html-to-image) ── */}
      <div
        ref={certRef}
        style={{
          background: CERT_BG,
          position: 'relative',
          padding: '50px 68px 42px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          minHeight: '700px',
          border: `2px solid ${GOLD}`,
        }}
      >
        {/* Inner border line */}
        <div style={{ position: 'absolute', inset: '10px', border: '1px solid rgba(201,168,76,0.45)', pointerEvents: 'none' }} />

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map((c) => (
          <div key={c} style={{
            position: 'absolute',
            width: 60, height: 60,
            top: c.startsWith('t') ? 20 : undefined,
            bottom: c.startsWith('b') ? 20 : undefined,
            left: c.endsWith('l') ? 20 : undefined,
            right: c.endsWith('r') ? 20 : undefined,
            borderTop: c.startsWith('t') ? `2px solid ${GOLD}` : undefined,
            borderBottom: c.startsWith('b') ? `2px solid ${GOLD}` : undefined,
            borderLeft: c.endsWith('l') ? `2px solid ${GOLD}` : undefined,
            borderRight: c.endsWith('r') ? `2px solid ${GOLD}` : undefined,
          }} />
        ))}

        {/* Bottom-left decorative ornament */}
        <div style={{ position: 'absolute', bottom: 22, left: 22 }}>
          <CornerOrnament />
        </div>
        {/* Bottom-right decorative ornament */}
        <div style={{ position: 'absolute', bottom: 22, right: 22 }}>
          <CornerOrnament flip />
        </div>
        {/* 4-pointed star */}
        <div style={{ position: 'absolute', bottom: 34, right: 128, opacity: 0.5 }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <polygon points="11,1 12.5,9.5 21,11 12.5,12.5 11,21 9.5,12.5 1,11 9.5,9.5" fill={GOLD} />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ marginBottom: '4px' }}>
          <LearnifyLogoSVG width={230} height={150} />
        </div>

        {/* Gold divider */}
        <div style={{ width: 110, height: 1.5, background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, margin: '4px auto 26px' }} />

        {/* Title */}
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 46, fontWeight: 700, color: '#1a1a3e', marginBottom: 12, lineHeight: 1.2 }}>
          Certificate of Completion
        </h2>

        <p style={{ fontSize: 15, color: '#6b7280', marginBottom: 18 }}>
          This is to proudly certify that
        </p>

        {/* Student name + decorative swashes */}
        <div style={{ width: '100%', maxWidth: 680, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <svg width="72" height="26" viewBox="0 0 72 26">
              <path d="M4,18 Q16,6 30,13 Q44,20 62,9" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 58, fontWeight: 700, color: '#1a1a3e', lineHeight: 1.2, margin: 0 }}>
              {studentName}
            </p>
            <svg width="72" height="26" viewBox="0 0 72 26">
              <path d="M10,9 Q28,20 42,13 Q56,6 68,18" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ height: 1.5, background: `linear-gradient(90deg,transparent,${GOLD} 15%,${GOLD} 85%,transparent)`, marginTop: 5 }} />
        </div>

        <p style={{ fontSize: 15, color: '#6b7280', marginTop: 20, marginBottom: 8 }}>
          has successfully completed the course
        </p>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: '#1a1a3e', marginBottom: 22, maxWidth: 600 }}>
          {cert.course?.title ?? 'Course'}
        </p>

        {/* AI message */}
        {cert.ai_message && (
          <div style={{ width: '100%', maxWidth: 640, background: 'rgba(201,168,76,0.07)', borderLeft: `3px solid ${GOLD}`, borderRadius: '0 6px 6px 0', padding: '10px 18px', marginBottom: 20, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Sparkles size={11} color="#c9a84c" />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: GOLD }}>AI Achievement Message</span>
            </div>
            <p style={{ fontSize: 12, color: '#4b5563', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>"{cert.ai_message}"</p>
          </div>
        )}

        {/* Footer divider — pushed to bottom */}
        <div style={{ width: '100%', height: 1, background: `linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.55) 80%,transparent)`, marginTop: 'auto', marginBottom: 18 }} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', minWidth: 140 }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: GOLD, marginBottom: 6 }}>Date Issued</p>
            <p style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{issued}</p>
          </div>
          <SealWithRibbon size={128} />
          <div style={{ textAlign: 'center', minWidth: 140 }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: GOLD, marginBottom: 6 }}>Certificate ID</p>
            <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#374151', fontWeight: 600, letterSpacing: 1 }}>{cert.certificate_code}</p>
          </div>
        </div>
      </div>

      {/* ── Bottom control bar ── */}
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
