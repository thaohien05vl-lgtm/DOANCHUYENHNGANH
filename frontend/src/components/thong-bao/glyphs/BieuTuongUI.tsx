import type { CSSProperties } from 'react'

export interface BieuTuongUIProps {
  size?: number
  className?: string
  style?: CSSProperties
}

/** 1. Nút Đánh dấu tất cả đã đọc (Dấu kiểm kép) */
export function BieuTuongDaDoc({ size = 16, className = '', style }: BieuTuongUIProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M2.5 8.5L5.5 11.5L13.5 3.5M6.5 8.5L9.5 11.5L14.5 6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 2. Nút Đóng (X bo tròn) */
export function BieuTuongDong({ size = 18, className = '', style }: BieuTuongUIProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M4.5 4.5L13.5 13.5M13.5 4.5L4.5 13.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** 3. Nút Xóa thông báo (Thùng rác tối giản) */
export function BieuTuongXoa({ size = 15, className = '', style }: BieuTuongUIProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M2.5 4H13.5M5.5 4V2.5C5.5 2.22386 5.72386 2 6 2H10C10.2761 2 10.5 2.22386 10.5 2.5V4M4 4L4.8 13.2C4.85 13.65 5.25 14 5.7 14H10.3C10.75 14 11.15 13.65 11.2 13.2L12 4M6.5 7V11M9.5 7V11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 4. Mũi tên điều hướng chi tiết */
export function BieuTuongMuiTen({ size = 14, className = '', style }: BieuTuongUIProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** 5. Phễu lọc */
export function BieuTuongLoc({ size = 14, className = '', style }: BieuTuongUIProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path
        d="M2 3H14M4.5 7H11.5M7 11H9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type { BieuTuongUIProps as UIGlyphProps }
export {
  BieuTuongDaDoc as CheckDoubleGlyph,
  BieuTuongDong as CloseGlyph,
  BieuTuongXoa as TrashGlyph,
  BieuTuongMuiTen as ArrowRightGlyph,
  BieuTuongLoc as FilterGlyph,
}
