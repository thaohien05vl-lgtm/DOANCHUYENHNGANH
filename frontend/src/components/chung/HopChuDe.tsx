import { useEffect, useId, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { dangKyNutQuayLai } from '../../utils/nutQuayLai'
import { HoaTietChuDe } from './HoaTietChuDe'

interface Nut {
  nhan: string
  onClick: () => void
}

interface Props {
  mo: boolean
  bieuTuong: ReactNode
  tieuDe: string
  noiDung: string
  ghiChu?: string
  nutChinh: Nut
  nutPhu: Nut
  /** Đóng khi bấm nền / Esc / nút Back. Mặc định gọi nutPhu. */
  dong?: () => void
}

/**
 * Hộp thoại mang giao diện của chủ đề đang chọn: nền, màu, họa tiết (HoaTietChuDe)
 * và bo góc đồng bộ với toàn app. Dùng cho "Thoát ứng dụng?" và "Khởi động lại".
 */
export function HopChuDe({ mo, bieuTuong, tieuDe, noiDung, ghiChu, nutChinh, nutPhu, dong }: Props) {
  const idTieuDe = useId()
  const dongHop = dong ?? nutPhu.onClick

  useEffect(() => {
    if (!mo) return
    const huyDangKy = dangKyNutQuayLai(dongHop)
    const nhanPhim = (e: KeyboardEvent) => e.key === 'Escape' && dongHop()
    document.addEventListener('keydown', nhanPhim)
    return () => {
      huyDangKy()
      document.removeEventListener('keydown', nhanPhim)
    }
  }, [mo, dongHop])

  if (!mo || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="hop-cd-nen"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dongHop()
      }}
    >
      <div className="hop-cd" role="alertdialog" aria-modal="true" aria-labelledby={idTieuDe}>
        <HoaTietChuDe height="100%" />
        <div className="hop-cd-vien" aria-hidden="true" />
        <div className="hop-cd-noidung">
          <div className="hop-cd-icon">{bieuTuong}</div>
          <h2 id={idTieuDe}>{tieuDe}</h2>
          <p>{noiDung}</p>
          {ghiChu && <small>{ghiChu}</small>}
          <div className="hop-cd-nut">
            <button type="button" className="hop-cd-btn phu" onClick={nutPhu.onClick}>
              {nutPhu.nhan}
            </button>
            <button type="button" className="hop-cd-btn chinh" onClick={nutChinh.onClick} autoFocus>
              {nutChinh.nhan}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
