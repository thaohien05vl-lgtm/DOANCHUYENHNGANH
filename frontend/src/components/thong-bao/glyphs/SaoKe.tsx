import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Sao kê & Đồng bộ (STATEMENT / SYNC) - Finora Finance Glyph System
 * Tài liệu sao kê ngân hàng và biểu tượng đồng bộ dữ liệu.
 */
export function SaoKe({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--statement ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-stm-doc" x1="8" y1="6" x2="32" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>

        <linearGradient id="glyph-stm-sync" x1="20" y1="20" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #10b981)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #059669)" />
        </linearGradient>
      </defs>

      <path
        d="M10 8C10 6.89543 10.8954 6 12 6H26L34 14V38C34 39.1046 33.1046 40 32 40H12C10.8954 40 10 39.1046 10 38V8Z"
        fill="url(#glyph-stm-doc)"
      />
      <path d="M26 6V14H34" fill="#ffffff" fillOpacity="0.35" />

      <rect x="14" y="18" width="10" height="2" rx="1" fill="#ffffff" fillOpacity="0.8" />
      <rect x="14" y="23" width="14" height="2" rx="1" fill="#ffffff" fillOpacity="0.6" />
      <rect x="14" y="28" width="8" height="2" rx="1" fill="#ffffff" fillOpacity="0.6" />

      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
        <circle cx="32" cy="30" r="9" fill="url(#glyph-stm-sync)" />
        <path
          d="M32 24C34.5 24 36.5 25.5 37 27.5M37 27.5V25M37 27.5H34.5"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 36C29.5 36 27.5 34.5 27 32.5M27 32.5V35M27 32.5H29.5"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export { SaoKe as StatementGlyph }
