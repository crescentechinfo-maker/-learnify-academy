const LOGO_SVG = `<svg width="200" height="68" viewBox="0 0 200 68" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bkL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="bkR" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>

  <!-- Left book page -->
  <path d="M6,54 L6,27 Q18,22 28,26 L28,57 Q18,53 6,54 Z" fill="url(#bkL)"/>
  <!-- Right book page -->
  <path d="M50,54 L50,27 Q38,22 28,26 L28,57 Q38,53 50,54 Z" fill="url(#bkR)"/>
  <!-- Spine highlight -->
  <rect x="27" y="26" width="2" height="31" rx="1" fill="#bfdbfe" opacity="0.7"/>
  <!-- Text lines on left page -->
  <line x1="10" y1="35" x2="23" y2="33" stroke="white" stroke-width="1.1" opacity="0.45"/>
  <line x1="10" y1="40" x2="23" y2="38" stroke="white" stroke-width="1.1" opacity="0.45"/>
  <line x1="10" y1="45" x2="23" y2="43" stroke="white" stroke-width="0.8" opacity="0.3"/>
  <!-- Text lines on right page -->
  <line x1="46" y1="33" x2="33" y2="35" stroke="white" stroke-width="1.1" opacity="0.45"/>
  <line x1="46" y1="38" x2="33" y2="40" stroke="white" stroke-width="1.1" opacity="0.45"/>
  <line x1="46" y1="43" x2="33" y2="45" stroke="white" stroke-width="0.8" opacity="0.3"/>

  <!-- 4-point sparkle above book -->
  <path d="M28,5 L29.4,13 L28,17 L26.6,13 Z" fill="#f59e0b"/>
  <path d="M20,11 L28,12.4 L36,11 L28,9.6 Z" fill="#f59e0b"/>
  <!-- Small dots around sparkle -->
  <circle cx="19" cy="7" r="1.2" fill="#fbbf24" opacity="0.7"/>
  <circle cx="37" cy="7" r="1.2" fill="#fbbf24" opacity="0.7"/>
  <circle cx="28" cy="22" r="0.9" fill="#fbbf24" opacity="0.5"/>

  <!-- "Learnify" wordmark -->
  <text x="62" y="37" font-family="Arial Black,Arial,Helvetica,sans-serif" font-size="22" font-weight="900" fill="#1e3a8a" letter-spacing="0.5">Learnify</text>
  <!-- Tagline -->
  <text x="63" y="52" font-family="Arial,Helvetica,sans-serif" font-size="7.5" fill="#9ca3af" letter-spacing="0.2">Igniting Minds. Empowering Futures.</text>
</svg>`

const LOGO_DATA_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(LOGO_SVG)}`

export async function getLogoBase64(): Promise<string> {
  return LOGO_DATA_URL
}

export function LearnifyLogoSVG({ width = 200, height = 68 }: { width?: number; height?: number; src?: string }) {
  return (
    <img
      src={LOGO_DATA_URL}
      width={width}
      height={height}
      style={{ objectFit: 'contain', display: 'block' }}
      alt="Learnify Academy"
    />
  )
}

export function learnifyLogoHTMLString(width = 200, height = 68, _src = ''): string {
  return `<img src="${LOGO_DATA_URL}" width="${width}" height="${height}" style="object-fit:contain;display:block" alt="Learnify Academy"/>`
}
