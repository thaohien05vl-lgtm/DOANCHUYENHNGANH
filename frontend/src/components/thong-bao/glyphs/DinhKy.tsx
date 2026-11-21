import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Giao dịch định kỳ (RECURRING) - Finora Finance Glyph System
 * Lịch tài chính và biểu tượng vòng lặp tuần hoàn vô tận.
 */
export function DinhKy({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--recurring ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-rec-cal" x1="8" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>

        <linearGradient id="glyph-rec-loop" x1="16" y1="20" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <rect x="9" y="11" width="30" height="26" rx="6" fill="url(#glyph-rec-cal)" />
      <rect x="15" y="7" width="3" height="6" rx="1.5" fill="#ffffff" />
      <rect x="30" y="7" width="3" height="6" rx="1.5" fill="#ffffff" />
      <rect x="9" y="17" width="30" height="3" fill="#ffffff" fillOpacity="0.25" />

      <g filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))">
        <circle cx="31" cy="29" r="8" fill="url(#glyph-rec-loop)" />
        <path
          d="M28 29C28 27.5 29 26.5 30.5 26.5C32.5 26.5 34 29 34 29C34 29 32.5 31.5 30.5 31.5C29 31.5 28 30.5 28 29Z"
          stroke="#ffffff"
          strokeWidth="1.4"
        />
        <path
          d="M34 29C34 27.5 33 26.5 31.5 26.5C29.5 26.5 28 29 28 29C28 29 29.5 31.5 31.5 31.5C33 31.5 34 30.5 34 29Z"
          stroke="#ffffff"
          strokeWidth="1.4"
        />
      </g>
    </svg>
  )
}

export { DinhKy as RecurringGlyph }
