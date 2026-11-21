import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Thông báo chung (GENERAL NOTIFICATION) - Finora Finance Glyph System
 * - Minh họa: Chuông thông báo tài chính ngân vang cùng ánh hào quang lấp lánh.
 * - Dùng làm fallback mặc định an toàn cho mọi thông báo không thuộc nhóm cụ thể.
 * - Tuyệt đối không dùng lại hình ví hay icon đơn điệu.
 */
export function ThongBaoChung({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--general ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-gen-bell" x1="16" y1="10" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #8064b2)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #5b3d91)" />
        </linearGradient>

        <linearGradient id="glyph-gen-clapper" x1="22" y1="36" x2="26" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>

        <filter id="glyph-gen-glow" x="8" y="6" width="32" height="36" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#8064b2" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter="url(#glyph-gen-glow)">
        <path
          d="M24 8C22.8954 8 22 8.89543 22 10C17.5817 11.5 15 15.5 15 21V29L12 33V35H36V33L33 29V21C33 15.5 30.4183 11.5 26 10C26 8.89543 25.1046 8 24 8Z"
          fill="url(#glyph-gen-bell)"
        />
      </g>

      {/* Ánh sáng phản chiếu thân chuông */}
      <path
        d="M19 16C18 19 18 25 19 28"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeOpacity="0.4"
      />

      {/* Quả lắc chuông vàng */}
      <circle cx="24" cy="38" r="3.5" fill="url(#glyph-gen-clapper)" />

      {/* Ngôi sao lấp lánh */}
      <path
        d="M36 10L37 12L39 13L37 14L36 16L35 14L33 13L35 12L36 10Z"
        fill="#fbbf24"
      />
      <circle cx="11" cy="14" r="1.5" fill="#a78bfa" />
    </svg>
  )
}

export { ThongBaoChung as GeneralGlyph }
