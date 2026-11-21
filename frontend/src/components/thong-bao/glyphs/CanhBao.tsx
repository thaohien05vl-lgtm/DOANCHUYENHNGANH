import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Cảnh báo tài chính (ALERT) - Finora Finance Glyph System
 * Khiên tam giác phát quang hổ phách cảnh báo rủi ro tài chính.
 */
export function CanhBao({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--alert ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-alt-shield" x1="12" y1="8" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ho-phach, #f59e0b)" />
          <stop offset="0.6" stopColor="#ea580c" />
          <stop offset="1" stopColor="#c2410c" />
        </linearGradient>

        <linearGradient id="glyph-alt-glass" x1="24" y1="9" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.06" />
        </linearGradient>

        <filter id="glyph-alt-glow" x="6" y="4" width="36" height="38" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#ea580c" floodOpacity="0.45" />
        </filter>
      </defs>

      <g filter="url(#glyph-alt-glow)">
        <path
          d="M21.5 8.2C22.6 6.3 25.4 6.3 26.5 8.2L40.2 32.8C41.3 34.8 39.9 37.5 37.6 37.5H10.4C8.1 37.5 6.7 34.8 7.8 32.8L21.5 8.2Z"
          fill="url(#glyph-alt-shield)"
        />
      </g>

      <path
        d="M22.8 11C23.3 10 24.7 10 25.2 11L37.2 33C37.7 34 37 35 35.8 35H12.2C11 35 10.3 34 10.8 33L22.8 11Z"
        fill="url(#glyph-alt-glass)"
      />

      <rect x="22.25" y="16.5" width="3.5" height="10" rx="1.75" fill="#ffffff" />
      <circle cx="24" cy="30.5" r="1.8" fill="#ffffff" />
      <circle cx="24" cy="8.5" r="1.2" fill="#fef08a" />
    </svg>
  )
}

export { CanhBao as AlertGlyph }
