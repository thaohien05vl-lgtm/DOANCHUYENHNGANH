import type { CSSProperties } from 'react'

export interface TrangThaiTrongProps {
  size?: number
  className?: string
  style?: CSSProperties
}

/**
 * Trạng thái rỗng (EMPTY NOTIFICATION) - Finora Finance Glyph System
 * Chuông thông báo ngân vang cùng các ngôi sao tài chính lấp lánh và dấu kiểm hoàn tất.
 */
export function TrangThaiTrong({
  size = 140,
  className = '',
  style,
}: TrangThaiTrongProps) {
  return (
    <svg
      width={size}
      height={size * 0.88}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--empty ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-emp-bell" x1="60" y1="36" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc, #8064b2)" />
          <stop offset="1" stopColor="var(--ngoc-dam, #5b3d91)" />
        </linearGradient>

        <radialGradient id="glyph-emp-glow" cx="80" cy="70" r="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--ngoc-nhat, #ede9fe)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--ngoc-nhat, #ede9fe)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="80" cy="70" r="54" fill="url(#glyph-emp-glow)" />

      <ellipse
        cx="80"
        cy="70"
        rx="66"
        ry="24"
        stroke="var(--ngoc, #8064b2)"
        strokeOpacity="0.22"
        strokeWidth="1.2"
        strokeDasharray="4 3"
        transform="rotate(-12 80 70)"
      />
      <ellipse
        cx="80"
        cy="70"
        rx="58"
        ry="18"
        stroke="var(--san-ho, #f43f5e)"
        strokeOpacity="0.16"
        strokeWidth="1"
        strokeDasharray="3 3"
        transform="rotate(18 80 70)"
      />

      <path d="M42 32L43.5 36.5L48 38L43.5 39.5L42 44L40.5 39.5L36 38L40.5 36.5L42 32Z" fill="#fbbf24" opacity="0.8" />
      <path d="M124 40L125 43L128 44L125 45L124 48L123 45L120 44L123 43L124 40Z" fill="#facc15" opacity="0.7" />
      <path d="M34 94L35 96.5L37.5 97.5L35 98.5L34 101L33 98.5L30.5 97.5L33 96.5L34 94Z" fill="var(--ngoc, #8064b2)" opacity="0.6" />
      <path d="M128 92L129.5 95.5L133 97L129.5 98.5L128 102L126.5 98.5L123 97L126.5 95.5L128 92Z" fill="#fbbf24" opacity="0.75" />

      <path
        d="M80 32C77 32 75 34.5 75 37.5C67 40 62 48 62 58V72L56 79V83H104V79L98 72V58C98 48 93 40 85 37.5C85 34.5 83 32 80 32Z"
        fill="url(#glyph-emp-bell)"
      />

      <path
        d="M72 48C69 54 69 64 71 70"
        stroke="#ffffff"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />

      <rect x="58" y="81" width="44" height="4" rx="2" fill="#ffffff" fillOpacity="0.3" />

      <circle cx="80" cy="89" r="6" fill="#f59e0b" />
      <circle cx="80" cy="89" r="3.5" fill="#fde047" />

      <circle cx="102" cy="42" r="9" fill="#10b981" />
      <path
        d="M98 42L100.8 44.8L106 39.5"
        stroke="#ffffff"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type { TrangThaiTrongProps as EmptyNotificationGlyphProps }
export { TrangThaiTrong as EmptyNotificationGlyph }
