import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Thu nhập (INCOME) - Finora Finance Glyph System
 * Chiếc ví mở với đồng xu vàng đang đi vào/hướng lên, ánh hào quang tích cực.
 */
export function ThuNhap({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--income ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-inc-wallet" x1="8" y1="14" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #10b981)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #059669)" />
        </linearGradient>

        <linearGradient id="glyph-inc-flap" x1="10" y1="15" x2="38" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.08" />
        </linearGradient>

        <linearGradient id="glyph-inc-coin" x1="17" y1="3" x2="31" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.5" stopColor="#eab308" />
          <stop offset="1" stopColor="#ca8a04" />
        </linearGradient>

        <filter id="glyph-inc-glow" x="14" y="1" width="20" height="20" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#eab308" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x="7" y="17" width="34" height="24" rx="8" fill="url(#glyph-inc-wallet)" />
      <path
        d="M8 24C8 19.5817 11.5817 16 16 16H32C36.4183 16 40 19.5817 40 24V25C40 26.6569 38.6569 28 37 28H11C9.34315 28 8 26.6569 8 25V24Z"
        fill="url(#glyph-inc-flap)"
      />

      <circle cx="34" cy="29" r="3.2" fill="#ffffff" />
      <circle cx="34" cy="29" r="1.4" fill="var(--ngoc-dam, #059669)" />

      <g className="finora-glyph__coin-float" filter="url(#glyph-inc-glow)">
        <circle cx="24" cy="10.5" r="7" fill="url(#glyph-inc-coin)" />
        <circle cx="24" cy="10.5" r="5.2" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="1" />
        <path
          d="M24 7V14M21.5 8.8H25.2C25.8 8.8 26.3 9.2 26.3 9.7C26.3 10.2 25.8 10.6 25.2 10.6H22.8C22.2 10.6 21.7 11 21.7 11.5C21.7 12 22.2 12.4 22.8 12.4H26.5"
          stroke="#713f12"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </g>

      <path
        d="M13 11L16.5 7.5M16.5 7.5H13M16.5 7.5V11"
        stroke="var(--ngoc, #10b981)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { ThuNhap as IncomeGlyph }
