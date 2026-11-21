import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Hóa đơn & Nhắc nhở (REMINDER) - Finora Finance Glyph System
 * Lịch hẹn kết hợp đồng hồ và hóa đơn tài chính biểu trưng thời hạn thanh toán.
 */
export function NhacNho({ size = 'md', className = '', style, animated = true }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--reminder ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="glyph-rem-bill" x1="10" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>

        <linearGradient id="glyph-rem-clock" x1="26" y1="24" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <path
        d="M11 9C11 7.89543 11.8954 7 13 7H31C32.1046 7 33 7.89543 33 9V37L29 35L25 37L21 35L17 37L13 35L11 37V9Z"
        fill="url(#glyph-rem-bill)"
      />

      <rect x="15" y="13" width="14" height="2.5" rx="1.25" fill="#ffffff" fillOpacity="0.85" />
      <rect x="15" y="19" width="10" height="2" rx="1" fill="#ffffff" fillOpacity="0.6" />
      <rect x="15" y="24" width="7" height="2" rx="1" fill="#ffffff" fillOpacity="0.6" />

      <circle cx="33" cy="31" r="9" fill="url(#glyph-rem-clock)" />
      <circle cx="33" cy="31" r="7.2" stroke="#78350f" strokeOpacity="0.25" strokeWidth="1" />
      <path d="M33 26.5V31.5L36.5 33.5" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export { NhacNho as ReminderGlyph }
