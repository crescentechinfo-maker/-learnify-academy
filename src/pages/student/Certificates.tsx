import { useEffect, useRef, useState } from 'react'
import { Award, Download, Sparkles, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getUserCertificates, issueCertificate } from '../../lib/certificates'
import { getAllProgress } from '../../lib/progress'
import { getCourses } from '../../lib/courses'
import { Button } from '../../components/ui/Button'
import { LearnifyLogoSVG, learnifyLogoHTMLString } from '../../components/LearnifyLogo'
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

function SealWithRibbon({ size = 140 }: { size?: number }) {
  const mainPts = starburstPoints(60, 60, 50, 42, 24)
  const outerPts = starburstPoints(60, 60, 56, 53, 40)
  return (
    <svg width={size} height={size * 1.35} viewBox="0 0 120 178" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sealBody" cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="25%" stopColor="#dc2626" />
          <stop offset="60%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#6b0f0f" />
        </radialGradient>
        <radialGradient id="innerDisc" cx="40%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#e53535" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
        <linearGradient id="ribL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b1c1c" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="ribR" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9b1c1c" />
          <stop offset="45%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="ribLShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id="sealShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* Ribbons */}
      <polygon points="27,106 53,106 45,172 25,168 36,152 19,166" fill="url(#ribL)" />
      <polygon points="27,106 53,106 45,172 25,168 36,152 19,166" fill="url(#ribLShine)" />
      <line x1="37" y1="106" x2="35" y2="165" stroke="#7f1d1d" strokeWidth="1.2" opacity="0.35" />
      <polygon points="93,106 67,106 75,172 95,168 84,152 101,166" fill="url(#ribR)" />
      <polygon points="93,106 67,106 75,172 95,168 84,152 101,166" fill="url(#ribLShine)" />
      <line x1="83" y1="106" x2="85" y2="165" stroke="#7f1d1d" strokeWidth="1.2" opacity="0.35" />

      {/* Drop shadow of main starburst */}
      <polygon points={mainPts} fill="#3d0000" transform="translate(2,4)" opacity="0.2" />

      {/* Outer gold sunburst ring */}
      <polygon points={outerPts} fill="#c9a84c" opacity="0.9" />

      {/* Main starburst body */}
      <polygon points={mainPts} fill="url(#sealBody)" filter="url(#sealShadow)" />

      {/* Gold border circle */}
      <circle cx="60" cy="60" r="36" fill="none" stroke="#c9a84c" strokeWidth="2" />
      <circle cx="60" cy="60" r="33.5" fill="none" stroke="#c9a84c" strokeWidth="0.5" opacity="0.5" />

      {/* Inner disc */}
      <circle cx="60" cy="60" r="32" fill="url(#innerDisc)" />

      {/* Gold dashed ring */}
      <circle cx="60" cy="60" r="29" fill="none" stroke="#fbbf24" strokeWidth="0.9" strokeDasharray="2.2,1.6" />
      <circle cx="60" cy="60" r="26" fill="none" stroke="#fca5a5" strokeWidth="0.4" opacity="0.5" />

      {/* CERTIFIED top */}
      <text x="60" y="44" textAnchor="middle" fill="#fde68a" fontSize="5.5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="2.8">CERTIFIED</text>

      {/* LEARNIFY center */}
      <text x="60" y="58" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="bold" fontFamily="Arial Black,Arial,sans-serif" letterSpacing="0.5">LEARNIFY</text>

      {/* Gold star row */}
      <text x="60" y="67.5" textAnchor="middle" fill="#fbbf24" fontSize="6" fontFamily="Arial,sans-serif">★  ★  ★</text>

      {/* ACADEMY bottom */}
      <text x="60" y="77" textAnchor="middle" fill="#fde68a" fontSize="5" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="2.5">ACADEMY</text>
    </svg>
  )
}

function CornerOrnament({ flip }: { flip?: boolean }) {
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <g opacity="0.38">
        <circle cx="18" cy="70" r="34" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="18" cy="70" r="26" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="18" cy="70" r="18" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <circle cx="18" cy="70" r="10" fill="none" stroke="#c9a84c" strokeWidth="0.8" />
        <line x1="18" y1="36" x2="18" y2="88" stroke="#c9a84c" strokeWidth="0.6" />
        <line x1="-16" y1="70" x2="52" y2="70" stroke="#c9a84c" strokeWidth="0.6" />
        <line x1="-4" y1="46" x2="40" y2="88" stroke="#c9a84c" strokeWidth="0.5" />
        <line x1="40" y1="46" x2="-4" y2="88" stroke="#c9a84c" strokeWidth="0.5" />
        <polygon points="18,59 22,70 18,81 14,70" fill="#c9a84c" opacity="0.6" />
        <polygon points="6,70 18,66 30,70 18,74" fill="#c9a84c" opacity="0.6" />
      </g>
    </svg>
  )
}

const GOLD = '#c9a84c'
const CERT_W = 900

export function CertificateView({ cert, studentName }: { cert: Certificate; studentName: string }) {
  const certRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const issued = new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  async function handleDownload() {
    if (!certRef.current) return
    setDownloading(true)
    try {
      const { toPng } = await import('html-to-image')
      const { jsPDF } = await import('jspdf')
      const dataUrl = await toPng(certRef.current, { pixelRatio: 2, backgroundColor: '#faf8f0', cacheBust: true })
      const img = new Image()
      img.src = dataUrl
      await new Promise<void>((res) => { img.onload = () => res() })
      const w = img.width / 2
      const h = img.height / 2
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [w, h] })
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
    const buildPts = (cx: number, cy: number, or_: number, ir: number, n: number) => {
      const a: string[] = []
      for (let i = 0; i < n; i++) {
        const oa = ((i * 360 / n) - 90) * Math.PI / 180
        const ia = (((i + 0.5) * 360 / n) - 90) * Math.PI / 180
        a.push(`${(cx + or_ * Math.cos(oa)).toFixed(2)},${(cy + or_ * Math.sin(oa)).toFixed(2)}`)
        a.push(`${(cx + ir * Math.cos(ia)).toFixed(2)},${(cy + ir * Math.sin(ia)).toFixed(2)}`)
      }
      return a.join(' ')
    }
    const mainP = buildPts(60, 60, 50, 42, 24)
    const outerP = buildPts(60, 60, 56, 53, 40)
    const sealSvg = `<svg width="140" height="189" viewBox="0 0 120 178" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sealBody" cx="38%" cy="30%" r="72%"><stop offset="0%" stop-color="#f87171"/><stop offset="25%" stop-color="#dc2626"/><stop offset="60%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#6b0f0f"/></radialGradient><radialGradient id="innerDisc" cx="40%" cy="32%" r="68%"><stop offset="0%" stop-color="#e53535"/><stop offset="100%" stop-color="#991b1b"/></radialGradient><linearGradient id="ribL" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#9b1c1c"/><stop offset="45%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient><linearGradient id="ribR" x1="100%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#9b1c1c"/><stop offset="45%" stop-color="#ef4444"/><stop offset="100%" stop-color="#7f1d1d"/></linearGradient></defs><polygon points="27,106 53,106 45,172 25,168 36,152 19,166" fill="url(#ribL)"/><line x1="37" y1="106" x2="35" y2="165" stroke="#7f1d1d" stroke-width="1.2" opacity="0.35"/><polygon points="93,106 67,106 75,172 95,168 84,152 101,166" fill="url(#ribR)"/><line x1="83" y1="106" x2="85" y2="165" stroke="#7f1d1d" stroke-width="1.2" opacity="0.35"/><polygon points="${outerP}" fill="#c9a84c" opacity="0.9"/><polygon points="${mainP}" fill="#3d0000" transform="translate(2,4)" opacity="0.2"/><polygon points="${mainP}" fill="url(#sealBody)"/><circle cx="60" cy="60" r="36" fill="none" stroke="#c9a84c" stroke-width="2"/><circle cx="60" cy="60" r="33.5" fill="none" stroke="#c9a84c" stroke-width="0.5" opacity="0.5"/><circle cx="60" cy="60" r="32" fill="url(#innerDisc)"/><circle cx="60" cy="60" r="29" fill="none" stroke="#fbbf24" stroke-width="0.9" stroke-dasharray="2.2,1.6"/><circle cx="60" cy="60" r="26" fill="none" stroke="#fca5a5" stroke-width="0.4" opacity="0.5"/><text x="60" y="44" text-anchor="middle" fill="#fde68a" font-size="5.5" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="2.8">CERTIFIED</text><text x="60" y="58" text-anchor="middle" fill="#ffffff" font-size="11.5" font-weight="bold" font-family="Arial Black,Arial,sans-serif" letter-spacing="0.5">LEARNIFY</text><text x="60" y="67.5" text-anchor="middle" fill="#fbbf24" font-size="6" font-family="Arial,sans-serif">&#9733; &#9733; &#9733;</text><text x="60" y="77" text-anchor="middle" fill="#fde68a" font-size="5" font-weight="bold" font-family="Arial,sans-serif" letter-spacing="2.5">ACADEMY</text></svg>`

    const win = window.open('', '', 'width=1050,height=800')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><title>Certificate — ${studentName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet"/>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{background:#ddd;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Arial,sans-serif;padding:20px;}
      .cert{width:900px;min-height:640px;padding:44px 64px 38px;background:linear-gradient(160deg,#faf8f0 0%,#f5f0e8 40%,#faf7f0 70%,#f2eee4 100%);border:2px solid #c9a84c;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;}
      .inner-b{position:absolute;inset:10px;border:1px solid rgba(201,168,76,0.45);}
      .co{position:absolute;width:58px;height:58px;}
      .c-tl{top:20px;left:20px;border-top:2px solid #c9a84c;border-left:2px solid #c9a84c;}
      .c-tr{top:20px;right:20px;border-top:2px solid #c9a84c;border-right:2px solid #c9a84c;}
      .c-bl{bottom:20px;left:20px;border-bottom:2px solid #c9a84c;border-left:2px solid #c9a84c;}
      .c-br{bottom:20px;right:20px;border-bottom:2px solid #c9a84c;border-right:2px solid #c9a84c;}
      .orn{position:absolute;bottom:22px;opacity:0.38;}
      .orn-l{left:22px;} .orn-r{right:22px;transform:scaleX(-1);}
      .star{position:absolute;bottom:30px;right:122px;opacity:0.5;}
      .div{width:100px;height:1.5px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:6px auto 22px;}
      .title{font-family:'Playfair Display',Georgia,serif;font-size:40px;color:#1a1a3e;font-weight:700;margin-bottom:10px;line-height:1.2;}
      .sub{font-size:14px;color:#6b7280;margin-bottom:16px;}
      .nrow{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:4px;}
      .name{font-family:'Dancing Script',cursive;font-size:52px;font-weight:700;color:#1a1a3e;line-height:1.2;}
      .nline{width:78%;height:1.5px;background:linear-gradient(90deg,transparent,#c9a84c 15%,#c9a84c 85%,transparent);margin:4px auto 18px;}
      .comp{font-size:14px;color:#6b7280;margin-bottom:7px;}
      .course{font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:700;color:#1a1a3e;margin-bottom:16px;}
      .ai{font-size:11.5px;color:#4b5563;font-style:italic;max-width:620px;margin:0 auto 16px;line-height:1.8;padding:9px 16px;background:rgba(201,168,76,0.07);border-left:3px solid #c9a84c;border-radius:0 6px 6px 0;text-align:left;}
      .fline{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.55) 80%,transparent);margin-top:auto;margin-bottom:16px;}
      .footer{display:flex;align-items:flex-end;justify-content:space-between;width:100%;padding:0 16px;}
      .fi{text-align:center;min-width:140px;}
      .fl{font-size:9px;text-transform:uppercase;letter-spacing:2.5px;color:#c9a84c;font-weight:700;margin-bottom:5px;}
      .fv{font-size:13px;color:#374151;font-weight:500;}
      .fc{font-family:monospace;font-size:12px;color:#374151;font-weight:600;letter-spacing:1px;}
      @media print{body{background:white;padding:0;}}
    </style></head><body>
    <div class="cert">
      <div class="inner-b"></div>
      <div class="co c-tl"></div><div class="co c-tr"></div>
      <div class="co c-bl"></div><div class="co c-br"></div>
      <div class="orn orn-l"><svg width="80" height="80" viewBox="0 0 88 88"><g opacity="1"><circle cx="18" cy="70" r="34" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="26" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="18" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="10" fill="none" stroke="#c9a84c" stroke-width="0.8"/><line x1="18" y1="36" x2="18" y2="88" stroke="#c9a84c" stroke-width="0.6"/><line x1="-16" y1="70" x2="52" y2="70" stroke="#c9a84c" stroke-width="0.6"/><line x1="-4" y1="46" x2="40" y2="88" stroke="#c9a84c" stroke-width="0.5"/><line x1="40" y1="46" x2="-4" y2="88" stroke="#c9a84c" stroke-width="0.5"/><polygon points="18,59 22,70 18,81 14,70" fill="#c9a84c" opacity="0.6"/><polygon points="6,70 18,66 30,70 18,74" fill="#c9a84c" opacity="0.6"/></g></svg></div>
      <div class="orn orn-r"><svg width="80" height="80" viewBox="0 0 88 88"><g opacity="1"><circle cx="18" cy="70" r="34" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="26" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="18" fill="none" stroke="#c9a84c" stroke-width="0.8"/><circle cx="18" cy="70" r="10" fill="none" stroke="#c9a84c" stroke-width="0.8"/><line x1="18" y1="36" x2="18" y2="88" stroke="#c9a84c" stroke-width="0.6"/><line x1="-16" y1="70" x2="52" y2="70" stroke="#c9a84c" stroke-width="0.6"/><line x1="-4" y1="46" x2="40" y2="88" stroke="#c9a84c" stroke-width="0.5"/><line x1="40" y1="46" x2="-4" y2="88" stroke="#c9a84c" stroke-width="0.5"/><polygon points="18,59 22,70 18,81 14,70" fill="#c9a84c" opacity="0.6"/><polygon points="6,70 18,66 30,70 18,74" fill="#c9a84c" opacity="0.6"/></g></svg></div>
      <div class="star"><svg width="20" height="20" viewBox="0 0 22 22"><polygon points="11,1 12.5,9.5 21,11 12.5,12.5 11,21 9.5,12.5 1,11 9.5,9.5" fill="#c9a84c"/></svg></div>
      ${learnifyLogoHTMLString(200, 80)}
      <div class="div"></div>
      <div class="title">Certificate of Completion</div>
      <div class="sub">This is to proudly certify that</div>
      <div class="nrow">
        <svg width="68" height="24" viewBox="0 0 72 26"><path d="M4,18 Q16,6 30,13 Q44,20 62,9" fill="none" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/></svg>
        <div class="name">${studentName}</div>
        <svg width="68" height="24" viewBox="0 0 72 26"><path d="M10,9 Q28,20 42,13 Q56,6 68,18" fill="none" stroke="#c9a84c" stroke-width="1.8" stroke-linecap="round"/></svg>
      </div>
      <div class="nline"></div>
      <div class="comp">has successfully completed the course</div>
      <div class="course">${cert.course?.title ?? 'Course'}</div>
      ${cert.ai_message ? `<div class="ai">"${cert.ai_message}"</div>` : ''}
      <div class="fline"></div>
      <div class="footer">
        <div class="fi"><div class="fl">Date Issued</div><div class="fv">${issued}</div></div>
        ${sealSvg}
        <div class="fi"><div class="fl">Certificate ID</div><div class="fc">${cert.certificate_code}</div></div>
      </div>
    </div>
    <script>window.onload=()=>{setTimeout(()=>{window.print();},700);}</script>
    </body></html>`)
    win.document.close()
  }

  return (
    /* Scrollable wrapper so certificate never clips on narrow screens */
    <div style={{ overflowX: 'auto', borderRadius: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>

      {/* ── Certificate canvas ── */}
      <div
        ref={certRef}
        style={{
          width: CERT_W,
          minHeight: 640,
          background: 'linear-gradient(160deg,#faf8f0 0%,#f5f0e8 40%,#faf7f0 70%,#f2eee4 100%)',
          border: `2px solid ${GOLD}`,
          position: 'relative',
          padding: '44px 64px 38px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Inner border */}
        <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(201,168,76,0.45)', pointerEvents: 'none' }} />

        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map((c) => (
          <div key={c} style={{
            position: 'absolute', width: 58, height: 58,
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

        {/* Corner ornaments */}
        <div style={{ position: 'absolute', bottom: 22, left: 22 }}><CornerOrnament /></div>
        <div style={{ position: 'absolute', bottom: 22, right: 22 }}><CornerOrnament flip /></div>
        <div style={{ position: 'absolute', bottom: 30, right: 120, opacity: 0.5 }}>
          <svg width="20" height="20" viewBox="0 0 22 22">
            <polygon points="11,1 12.5,9.5 21,11 12.5,12.5 11,21 9.5,12.5 1,11 9.5,9.5" fill={GOLD} />
          </svg>
        </div>

        {/* Logo */}
        <div style={{ marginBottom: 4 }}>
          <LearnifyLogoSVG width={200} height={80} />
        </div>

        {/* Gold divider */}
        <div style={{ width: 100, height: 1.5, background: `linear-gradient(90deg,transparent,${GOLD},transparent)`, margin: '6px auto 22px' }} />

        {/* Title */}
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 40, fontWeight: 700, color: '#1a1a3e', marginBottom: 10, lineHeight: 1.2, width: '100%' }}>
          Certificate of Completion
        </h2>

        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
          This is to proudly certify that
        </p>

        {/* Student name + swashes */}
        <div style={{ width: '100%', maxWidth: 700, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <svg width="68" height="24" viewBox="0 0 72 26">
              <path d="M4,18 Q16,6 30,13 Q44,20 62,9" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: 52, fontWeight: 700, color: '#1a1a3e', lineHeight: 1.2, margin: 0 }}>
              {studentName}
            </p>
            <svg width="68" height="24" viewBox="0 0 72 26">
              <path d="M10,9 Q28,20 42,13 Q56,6 68,18" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ height: 1.5, background: `linear-gradient(90deg,transparent,${GOLD} 15%,${GOLD} 85%,transparent)`, marginTop: 5 }} />
        </div>

        <p style={{ fontSize: 14, color: '#6b7280', marginTop: 18, marginBottom: 7 }}>
          has successfully completed the course
        </p>
        <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 700, color: '#1a1a3e', marginBottom: 18, maxWidth: 620 }}>
          {cert.course?.title ?? 'Course'}
        </p>

        {/* AI message */}
        {cert.ai_message && (
          <div style={{ width: '100%', maxWidth: 640, background: 'rgba(201,168,76,0.07)', borderLeft: `3px solid ${GOLD}`, borderRadius: '0 6px 6px 0', padding: '9px 16px', marginBottom: 16, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <Sparkles size={11} color="#c9a84c" />
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: GOLD }}>AI Achievement Message</span>
            </div>
            <p style={{ fontSize: 12, color: '#4b5563', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>"{cert.ai_message}"</p>
          </div>
        )}

        {/* Footer divider */}
        <div style={{ width: '100%', height: 1, background: `linear-gradient(90deg,transparent,rgba(201,168,76,0.55) 20%,rgba(201,168,76,0.55) 80%,transparent)`, marginTop: 'auto', marginBottom: 16 }} />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', width: '100%', padding: '0 12px' }}>
          <div style={{ textAlign: 'center', minWidth: 140 }}>
            <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: GOLD, marginBottom: 5 }}>Date Issued</p>
            <p style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{issued}</p>
          </div>
          <SealWithRibbon size={120} />
          <div style={{ textAlign: 'center', minWidth: 140 }}>
            <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2.5, color: GOLD, marginBottom: 5 }}>Certificate ID</p>
            <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#374151', fontWeight: 600, letterSpacing: 1 }}>{cert.certificate_code}</p>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      <div style={{ padding: '14px 22px', background: 'white', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: CERT_W }}>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{cert.course?.title}</p>
          <p style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace', marginTop: 2 }}>{cert.certificate_code}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
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
    <div className="max-w-5xl mx-auto">
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
