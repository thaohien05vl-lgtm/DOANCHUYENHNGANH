import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Tiết kiệm (SAVINGS) - Finora Finance Glyph System
 * Hũ tích lũy vàng chứa đồng xu đang đầy dần và mầm cây tài chính sinh sôi.
 */
export function TietKiem({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--savings ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-sav-pot" x1="10" y1="14" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #06b6d4)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #0891b2)" />
        </linearGradient>

        <linearGradient id="glyph-sav-coin" x1="20" y1="5" x2="28" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
      </defs>

      <path
        d="M14 18H34C37 18 39 21 38 24L36 36C35.5 39 33 41 30 41H18C15 41 12.5 39 12 36L10 24C9 21 11 18 14 18Z"
        fill="url(#glyph-sav-pot)"
      />

      <rect x="15" y="14" width="18" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.45" />
      <ellipse cx="24" cy="23.5" rx="4" ry="1.4" fill="#000000" fillOpacity="0.25" />

      <circle cx="24" cy="10" r="5.5" fill="url(#glyph-sav-coin)" />
      <path d="M24 7L24.8 8.8L26.8 9.2L25.3 10.5L25.8 12.5L24 11.4L22.2 12.5L22.7 10.5L21.2 9.2L23.2 8.8L24 7Z" fill="#854d0e" />

      <path
        d="M24 28C24 33.5 19 34.5 18 35.5C18 32 20.5 29 24 28Z"
        fill="#a7f3d0"
      />
      <path
        d="M24 28C24 33.5 29 34.5 30 35.5C30 32 27.5 29 24 28Z"
        fill="#6ee7b7"
      />
    </svg>
  )
}

export { TietKiem as SavingsGlyph }
