import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Chuyển tiền (TRANSFER) - Finora Finance Glyph System
 * Hai mũi tên chuyển động ngược chiều luân chuyển quỹ tài chính kết hợp đồng xu vàng ở trung tâm.
 */
export function ChuyenTien({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--transfer ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-trf-arr-right" x1="10" y1="12" x2="38" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #06b6d4)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #0891b2)" />
        </linearGradient>

        <linearGradient id="glyph-trf-arr-left" x1="38" y1="36" x2="10" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>

        <linearGradient id="glyph-trf-coin" x1="18" y1="18" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="1" stopColor="#eab308" />
        </linearGradient>
      </defs>

      <path
        d="M10 16H34M34 16L27 10M34 16L27 22"
        stroke="url(#glyph-trf-arr-right)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M38 32H14M14 32L21 26M14 32L21 38"
        stroke="url(#glyph-trf-arr-left)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="24" cy="24" r="7.5" fill="url(#glyph-trf-coin)" />
      <circle cx="24" cy="24" r="5.6" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1" />
      <circle cx="24" cy="24" r="2.2" fill="#854d0e" />
    </svg>
  )
}

export { ChuyenTien as TransferGlyph }
