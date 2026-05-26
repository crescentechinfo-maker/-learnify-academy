export function LearnifyLogoSVG({ width = 180, height = 100 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 115" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pageL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="pageR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="swoosh" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
      </defs>

      {/* Book left pages (fan out left) */}
      <path d="M97,54 Q78,46 72,28 Q82,20 92,26 Q97,38 97,54Z" fill="url(#pageL)" />
      <path d="M97,54 Q82,44 80,28 Q86,22 92,26 Q97,38 97,54Z" fill="#0ea5e9" opacity="0.7" />
      <path d="M97,54 Q85,47 84,33 Q88,27 92,30 Q97,40 97,54Z" fill="#7dd3fc" opacity="0.4" />

      {/* Book right pages (fan out right) */}
      <path d="M97,54 Q116,46 122,28 Q112,20 102,26 Q97,38 97,54Z" fill="url(#pageR)" />
      <path d="M97,54 Q112,44 114,28 Q108,22 102,26 Q97,38 97,54Z" fill="#0369a1" opacity="0.7" />

      {/* Book spine */}
      <line x1="97" y1="26" x2="97" y2="54" stroke="#1e3a8a" strokeWidth="1.5" />

      {/* Swoosh orbit */}
      <path d="M62,58 Q58,30 97,18 Q136,6 148,38 Q153,55 140,64"
        fill="none" stroke="url(#swoosh)" strokeWidth="5" strokeLinecap="round" />

      {/* Arrow at end of swoosh */}
      <polygon points="140,64 152,52 148,68" fill="#0891b2" />
      <polygon points="140,64 152,52 146,56" fill="#075985" />

      {/* "Learnify" text */}
      <text textAnchor="middle" x="97" y="86" fontFamily="Arial Black, Arial, sans-serif" fontSize="26" fontWeight="900">
        <tspan fill="#1e3a8a">Learn</tspan><tspan fill="#0891b2">ify</tspan>
      </text>

      {/* Tagline */}
      <text x="97" y="102" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fill="#64748b" letterSpacing="0.3">
        Igniting Minds, Empowering Futures
      </text>
    </svg>
  )
}

// String version for use inside print HTML
export function learnifyLogoSVGString(width = 180, height = 100): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 200 115" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pL" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="pR" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="sw" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
  </defs>
  <path d="M97,54 Q78,46 72,28 Q82,20 92,26 Q97,38 97,54Z" fill="url(#pL)"/>
  <path d="M97,54 Q82,44 80,28 Q86,22 92,26 Q97,38 97,54Z" fill="#0ea5e9" opacity="0.7"/>
  <path d="M97,54 Q85,47 84,33 Q88,27 92,30 Q97,40 97,54Z" fill="#7dd3fc" opacity="0.4"/>
  <path d="M97,54 Q116,46 122,28 Q112,20 102,26 Q97,38 97,54Z" fill="url(#pR)"/>
  <path d="M97,54 Q112,44 114,28 Q108,22 102,26 Q97,38 97,54Z" fill="#0369a1" opacity="0.7"/>
  <line x1="97" y1="26" x2="97" y2="54" stroke="#1e3a8a" stroke-width="1.5"/>
  <path d="M62,58 Q58,30 97,18 Q136,6 148,38 Q153,55 140,64" fill="none" stroke="url(#sw)" stroke-width="5" stroke-linecap="round"/>
  <polygon points="140,64 152,52 148,68" fill="#0891b2"/>
  <polygon points="140,64 152,52 146,56" fill="#075985"/>
  <text text-anchor="middle" x="97" y="86" font-family="Arial Black,Arial,sans-serif" font-size="26" font-weight="900">
    <tspan fill="#1e3a8a">Learn</tspan><tspan fill="#0891b2">ify</tspan>
  </text>
  <text x="97" y="102" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#64748b" letter-spacing="0.3">Igniting Minds, Empowering Futures</text>
</svg>`
}
