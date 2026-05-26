export function LearnifyLogoSVG({ width = 200, height = 130 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 220 185" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lbL1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" /><stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="lbL2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="lbR1" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" /><stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="lbR2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0369a1" /><stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="lSwG" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" /><stop offset="60%" stopColor="#1d4ed8" /><stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="lArr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" /><stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {/* ── Left book pages (4 layers, lightest in front) ── */}
      <path d="M108,77 C96,63 70,46 52,24 C43,12 51,2 66,6 C81,10 98,46 108,77Z" fill="#1260a8" />
      <path d="M108,77 C97,63 74,47 58,27 C50,15 57,6 71,10 C85,14 101,47 108,77Z" fill="#1a78c2" />
      <path d="M108,77 C100,66 80,52 67,33 C59,22 65,12 77,16 C89,20 104,51 108,77Z" fill="url(#lbL2)" />
      <path d="M108,77 C104,69 90,59 82,44 C77,34 82,26 92,30 C102,34 107,56 108,77Z" fill="url(#lbL1)" />

      {/* ── Right book pages (4 layers, darkest in front) ── */}
      <path d="M108,77 C120,63 146,46 164,24 C173,12 165,2 150,6 C135,10 118,46 108,77Z" fill="#0c2a6e" />
      <path d="M108,77 C119,63 142,47 158,27 C166,15 159,6 145,10 C131,14 115,47 108,77Z" fill="#154080" />
      <path d="M108,77 C116,66 136,52 149,33 C157,22 151,12 139,16 C127,20 112,51 108,77Z" fill="url(#lbR1)" />
      <path d="M108,77 C112,69 126,59 134,44 C139,34 134,26 124,30 C114,34 109,56 108,77Z" fill="url(#lbR2)" />

      {/* Center spine */}
      <line x1="108" y1="6" x2="108" y2="77" stroke="#0a1f5c" strokeWidth="2" />

      {/* ── Swoosh arc — goes under the book ── */}
      <path d="M 48,86 Q 42,112 86,120 Q 128,126 164,112 Q 184,103 192,86"
        fill="none" stroke="url(#lSwG)" strokeWidth="12" strokeLinecap="round" />
      {/* Highlight on swoosh */}
      <path d="M 48,86 Q 42,112 86,120 Q 128,126 164,112 Q 184,103 192,86"
        fill="none" stroke="#3b6fd4" strokeWidth="4" strokeLinecap="round" opacity="0.35" />

      {/* ── 3-D paper plane arrow ── */}
      {/* Upper-left face (light blue, most visible) */}
      <polygon points="204,52 162,76 178,66" fill="url(#lArr)" />
      {/* Lower belly face (darker) */}
      <polygon points="204,52 178,66 194,78" fill="#0369a1" />
      {/* Rear bottom face */}
      <polygon points="194,78 178,66 162,76 168,86" fill="#075985" />
      {/* Top spine crease highlight */}
      <polygon points="204,52 168,64 162,76" fill="#bae6fd" opacity="0.6" />

      {/* ── Text ── */}
      <text textAnchor="middle" x="108" y="154"
        fontFamily="Arial Black, Arial, sans-serif" fontSize="36" fontWeight="900">
        <tspan fill="#1e3a8a">Learn</tspan><tspan fill="#0284c7">ify</tspan>
      </text>
      <text x="108" y="170" textAnchor="middle"
        fontFamily="Arial, sans-serif" fontSize="10.5" fill="#64748b" letterSpacing="0.4">
        Igniting Minds, Empowering Futures
      </text>
    </svg>
  )
}

export function learnifyLogoSVGString(width = 200, height = 130): string {
  return `<svg width="${width}" height="${height}" viewBox="0 0 220 185" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lbL1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="lbL2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="lbR1" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="lbR2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#075985"/>
    </linearGradient>
    <linearGradient id="lSwG" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1e3a8a"/><stop offset="60%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="lArr" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc"/><stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <path d="M108,77 C96,63 70,46 52,24 C43,12 51,2 66,6 C81,10 98,46 108,77Z" fill="#1260a8"/>
  <path d="M108,77 C97,63 74,47 58,27 C50,15 57,6 71,10 C85,14 101,47 108,77Z" fill="#1a78c2"/>
  <path d="M108,77 C100,66 80,52 67,33 C59,22 65,12 77,16 C89,20 104,51 108,77Z" fill="url(#lbL2)"/>
  <path d="M108,77 C104,69 90,59 82,44 C77,34 82,26 92,30 C102,34 107,56 108,77Z" fill="url(#lbL1)"/>
  <path d="M108,77 C120,63 146,46 164,24 C173,12 165,2 150,6 C135,10 118,46 108,77Z" fill="#0c2a6e"/>
  <path d="M108,77 C119,63 142,47 158,27 C166,15 159,6 145,10 C131,14 115,47 108,77Z" fill="#154080"/>
  <path d="M108,77 C116,66 136,52 149,33 C157,22 151,12 139,16 C127,20 112,51 108,77Z" fill="url(#lbR1)"/>
  <path d="M108,77 C112,69 126,59 134,44 C139,34 134,26 124,30 C114,34 109,56 108,77Z" fill="url(#lbR2)"/>
  <line x1="108" y1="6" x2="108" y2="77" stroke="#0a1f5c" stroke-width="2"/>
  <path d="M 48,86 Q 42,112 86,120 Q 128,126 164,112 Q 184,103 192,86" fill="none" stroke="url(#lSwG)" stroke-width="12" stroke-linecap="round"/>
  <path d="M 48,86 Q 42,112 86,120 Q 128,126 164,112 Q 184,103 192,86" fill="none" stroke="#3b6fd4" stroke-width="4" stroke-linecap="round" opacity="0.35"/>
  <polygon points="204,52 162,76 178,66" fill="url(#lArr)"/>
  <polygon points="204,52 178,66 194,78" fill="#0369a1"/>
  <polygon points="194,78 178,66 162,76 168,86" fill="#075985"/>
  <polygon points="204,52 168,64 162,76" fill="#bae6fd" opacity="0.6"/>
  <text text-anchor="middle" x="108" y="154" font-family="Arial Black,Arial,sans-serif" font-size="36" font-weight="900">
    <tspan fill="#1e3a8a">Learn</tspan><tspan fill="#0284c7">ify</tspan>
  </text>
  <text x="108" y="170" text-anchor="middle" font-family="Arial,sans-serif" font-size="10.5" fill="#64748b" letter-spacing="0.4">Igniting Minds, Empowering Futures</text>
</svg>`
}
