import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Ngân sách (BUDGET) - Finora Finance Glyph System
 * Chiếc khiên bảo vệ ngân sách gia đình, vòng đo tiến độ phần trăm và ngôi sao an toàn tài chính.
 */
export function NganSach({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--budget ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-bdg-shield" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ho-phach, #f59e0b)" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>

        <linearGradient id="glyph-bdg-light" x1="14" y1="9" x2="34" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      <path
        d="M24 7L36 12V22C36 30 29.5 37 24 40C18.5 37 12 30 12 22V12L24 7Z"
        fill="url(#glyph-bdg-shield)"
      />
      <path
        d="M24 9.5L33.5 13.5V22C33.5 28.5 28.5 34.5 24 37C19.5 34.5 14.5 28.5 14.5 22V13.5L24 9.5Z"
        fill="url(#glyph-bdg-light)"
      />

      <path
        d="M24 16A8 8 0 1 1 18 29.5"
        stroke="#ffffff"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      <path
        d="M24 20L25 22.5L27.5 23L25.5 24.5L26.2 27L24 25.5L21.8 27L22.5 24.5L20.5 23L23 22.5L24 20Z"
        fill="#ffffff"
      />
    </svg>
  )
}

export { NganSach as BudgetGlyph }
