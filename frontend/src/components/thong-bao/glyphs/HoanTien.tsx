import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Hoàn tiền (REFUND) - Finora Finance Glyph System
 * Đồng xu vàng kết hợp quỹ đạo mũi tên hoàn trả tuần hoàn.
 */
export function HoanTien({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--refund ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-ref-coin" x1="10" y1="18" x2="26" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>

        <linearGradient id="glyph-ref-arrow" x1="12" y1="10" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #10b981)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #059669)" />
        </linearGradient>
      </defs>

      <path
        d="M38 28C38 18 31 12 22 12C16 12 11 16 11 22M11 22L7 18M11 22L15 18"
        stroke="url(#glyph-ref-arrow)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="28" cy="30" r="8" fill="url(#glyph-ref-coin)" />
      <circle cx="28" cy="30" r="6" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1" />
      <path d="M28 26V34M24 30H32" stroke="#713f12" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export { HoanTien as RefundGlyph }
