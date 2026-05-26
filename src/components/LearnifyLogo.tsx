export function LearnifyLogoSVG({ width = 200, height = 130 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 135" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pgL" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="pgR" x1="80%" y1="0%" x2="20%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="sw3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="60%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>

      {/* Left book wing */}
      <path d="M110,80 C102,65 82,50 64,30 C55,18 61,8 75,12 C89,16 104,47 110,80Z" fill="url(#pgL)" />
      <path d="M110,80 C96,64 78,48 64,30" fill="none" stroke="#bfdbfe" strokeWidth="1.2" opacity="0.7" />
      <path d="M110,80 C100,67 85,53 76,38" fill="none" stroke="#e0f2fe" strokeWidth="0.9" opacity="0.5" />
      <path d="M110,80 C104,71 94,61 88,49" fill="none" stroke="#f0f9ff" strokeWidth="0.7" opacity="0.4" />

      {/* Right book wing */}
      <path d="M110,80 C118,65 138,50 156,30 C165,18 159,8 145,12 C131,16 116,47 110,80Z" fill="url(#pgR)" />
      <path d="M110,80 C124,64 142,48 156,30" fill="none" stroke="#1d4ed8" strokeWidth="1" opacity="0.45" />
      <path d="M110,80 C120,67 135,53 144,38" fill="none" stroke="#1e40af" strokeWidth="0.8" opacity="0.35" />

      {/* Book spine */}
      <line x1="110" y1="12" x2="110" y2="80" stroke="#0c2a6e" strokeWidth="1.8" />
      <path d="M105,78 Q110,84 115,78" fill="#0c2a6e" />

      {/* Swoosh orbit */}
      <path d="M 60,93 Q 55,62 88,42 Q 122,22 158,34 Q 178,42 178,58"
        fill="none" stroke="url(#sw3)" strokeWidth="5.5" strokeLinecap="round" />
      {/* Arrow head */}
      <polygon points="178,58 165,44 182,45" fill="#0891b2" />
      <polygon points="178,58 165,44 170,50" fill="#075985" />

      {/* "Learnify" text */}
      <text textAnchor="middle" x="110" y="108" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900">
        <tspan fill="#1e3a8a">Learn</tspan><tspan fill="#0ea5e9">ify</tspan>
      </text>
      {/* Tagline */}
      <text x="110" y="122" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#64748b" letterSpacing="0.3">
        Igniting Minds, Empowering Futures
      </text>
    </svg>
  )
}

export function learnifyLogoSVGString(width = 200, height = 130): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 220 135" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pgL" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="pgR" x1="80%" y1="0%" x2="20%" y2="100%">
      <stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="sw3" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a"/><stop offset="60%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
  </defs>
  <path d="M110,80 C102,65 82,50 64,30 C55,18 61,8 75,12 C89,16 104,47 110,80Z" fill="url(#pgL)"/>
  <path d="M110,80 C96,64 78,48 64,30" fill="none" stroke="#bfdbfe" stroke-width="1.2" opacity="0.7"/>
  <path d="M110,80 C100,67 85,53 76,38" fill="none" stroke="#e0f2fe" stroke-width="0.9" opacity="0.5"/>
  <path d="M110,80 C104,71 94,61 88,49" fill="none" stroke="#f0f9ff" stroke-width="0.7" opacity="0.4"/>
  <path d="M110,80 C118,65 138,50 156,30 C165,18 159,8 145,12 C131,16 116,47 110,80Z" fill="url(#pgR)"/>
  <path d="M110,80 C124,64 142,48 156,30" fill="none" stroke="#1d4ed8" stroke-width="1" opacity="0.45"/>
  <path d="M110,80 C120,67 135,53 144,38" fill="none" stroke="#1e40af" stroke-width="0.8" opacity="0.35"/>
  <line x1="110" y1="12" x2="110" y2="80" stroke="#0c2a6e" stroke-width="1.8"/>
  <path d="M105,78 Q110,84 115,78" fill="#0c2a6e"/>
  <path d="M 60,93 Q 55,62 88,42 Q 122,22 158,34 Q 178,42 178,58" fill="none" stroke="url(#sw3)" stroke-width="5.5" stroke-linecap="round"/>
  <polygon points="178,58 165,44 182,45" fill="#0891b2"/>
  <polygon points="178,58 165,44 170,50" fill="#075985"/>
  <text text-anchor="middle" x="110" y="108" font-family="Arial Black,Arial,sans-serif" font-size="30" font-weight="900">
    <tspan fill="#1e3a8a">Learn</tspan><tspan fill="#0ea5e9">ify</tspan>
  </text>
  <text x="110" y="122" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#64748b" letter-spacing="0.3">Igniting Minds, Empowering Futures</text>
</svg>`
}
