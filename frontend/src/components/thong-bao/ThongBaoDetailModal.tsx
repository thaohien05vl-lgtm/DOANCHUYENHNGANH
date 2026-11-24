import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ThongBaoNangCao } from './thongBaoUtils'
import { BieuTuongTaiChinh } from './glyphs/BieuTuongTaiChinh'
import { BieuTuongDong, BieuTuongMuiTen } from './glyphs/BieuTuongUI'
import { dangKyNutQuayLai } from '../../utils/nutQuayLai'
import { t } from '../../utils/ngonNgu'

interface DetailProps {
  item: ThongBaoNangCao | null
  dong: () => void
  onXemGiaoDich: (transactionId: string) => void
  onDieuHuong?: (duongDan: string) => void
}

/**
 * Modal xem toàn văn chi tiết thông báo tài chính
 */
export function ThongBaoDetailModal({ item, dong, onXemGiaoDich, onDieuHuong }: DetailProps) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dong()
    document.addEventListener('keydown', onKey)
    const huyBack = dangKyNutQuayLai(dong)
    return () => {
      huyBack()
      document.removeEventListener('keydown', onKey)
    }
  }, [item, dong])

  if (!item || typeof document === 'undefined') return null

  const glyphType = item.glyphType || 'REMINDER'
  const glyphClass = glyphType.toLowerCase()

  const thoiGianChiTiet = (() => {
    if (!item.createdAt) return ''
    try {
      const d = new Date(item.createdAt)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      const hours = String(d.getHours()).padStart(2, '0')
      const mins = String(d.getMinutes()).padStart(2, '0')
      return `${hours}:${mins} - ${day}/${month}/${year}`
    } catch {
      return item.createdAt
    }
  })()

  const tenLoaiThongBao = (() => {
    switch (glyphType) {
      case 'INCOME':
        return t('Giao dịch thu nhập')
      case 'EXPENSE':
        return t('Giao dịch chi tiêu')
      case 'TRANSFER':
        return t('Luân chuyển quỹ tiền')
      case 'BUDGET':
        return t('Cảnh báo ngân sách')
      case 'SAVINGS':
        return t('Mục tiêu tích luỹ')
      case 'RECURRING':
        return t('Giao dịch định kỳ')
      case 'REFUND':
        return t('Khoản hoàn tiền')
      case 'STATEMENT':
        return t('Sao kê & Đồng bộ')
      case 'ALERT':
        return t('Cảnh báo tài chính')
      default:
        return t('Nhắc nhở & Hóa đơn')
    }
  })()

  return createPortal(
    <div
      className="finora-notif-backdrop"
      style={{ zIndex: 2250 }}
      role="presentation"
      onMouseDown={(e) => {
        // Ngăn event bubble lên backdrop của TrungTamThongBao bên dưới
        e.stopPropagation()
        if (e.target === e.currentTarget) dong()
      }}
    >
      <div
        className="finora-notif-detail-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
      >
        {/* Header chi tiết */}
        <div className="finora-notif-detail-header">
          <div className="finora-notif-detail-header__left">
            <span className="finora-notif-detail-header__tag">
              {tenLoaiThongBao}
            </span>
          </div>
          {/* Nút X đóng – vùng bấm tối thiểu 44×44px theo WCAG */}
          <button
            type="button"
            className="finora-notif-btn-close"
            onClick={(e) => { e.stopPropagation(); dong() }}
            aria-label={t('Đóng')}
            style={{ minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <BieuTuongDong size={18} />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="finora-notif-detail-content">
          <div className="finora-notif-detail-card">
            <div
              className={`finora-notif-card__medallion finora-notif-card__medallion--${glyphClass} finora-notif-detail-card__medallion`}
              aria-hidden="true"
            >
              <BieuTuongTaiChinh
                type={glyphType}
                size={36}
                category={item.categoryName || item.tenDanhMucHienThi}
              />
            </div>
            <div className="finora-notif-detail-card__text">
              <h3 className="finora-notif-detail-card__title">
                {item.title}
              </h3>
              {item.soTienHienThi && (
                <div
                  className={`finora-notif-card__amount finora-notif-card__amount--${item.loaiSoTien || 'trung-tinh'} finora-notif-detail-card__amount`}
                >
                  {item.soTienHienThi}
                </div>
              )}
            </div>
          </div>

          {/* Bảng thuộc tính chi tiết */}
          <div className="finora-notif-detail-rows">
            <div className="finora-notif-detail-row">
              <span>{t('Thời gian ghi nhận')}</span>
              <span>{thoiGianChiTiet}</span>
            </div>
            {item.tenDanhMucHienThi && (
              <div className="finora-notif-detail-row">
                <span>{t('Danh mục liên quan')}</span>
                <span className="finora-notif-detail-row__highlight">{item.tenDanhMucHienThi}</span>
              </div>
            )}
            {item.tenViHienThi && (
              <div className="finora-notif-detail-row">
                <span>{t('Ví tiền / Nguồn tiền')}</span>
                <span>{item.tenViHienThi}</span>
              </div>
            )}
            <div className="finora-notif-detail-row">
              <span>{t('Trạng thái')}</span>
              <span>{item.read ? t('Đã đọc') : t('Chưa đọc')}</span>
            </div>
          </div>

          {/* Diễn giải chi tiết */}
          <div className="finora-notif-detail-body">
            <span className="finora-notif-detail-body__label">
              {t('NỘI DUNG THÔNG BÁO')}
            </span>
            <p className="finora-notif-detail-body__text">
              {item.content}
            </p>
          </div>

          {/* Nút hành động xem giao dịch hoặc điều hướng nghiệp vụ */}
          {item.transactionId ? (
            <button
              type="button"
              className="finora-notif-detail-btn-go"
              onClick={() => onXemGiaoDich(item.transactionId!)}
            >
              <span>{t('Xem chi tiết giao dịch')}</span>
              <BieuTuongMuiTen size={16} />
            </button>
          ) : (item.type?.includes('muc_tieu') || item.type?.includes('tiet_kiem') || item.glyphType === 'SAVINGS') && onDieuHuong ? (
            <button
              type="button"
              className="finora-notif-detail-btn-go"
              onClick={() => onDieuHuong('/muc-tieu')}
            >
              <span>{t('Xem mục tiêu tiết kiệm')}</span>
              <BieuTuongMuiTen size={16} />
            </button>
          ) : (item.type?.includes('ngan_sach') || item.glyphType === 'BUDGET') && onDieuHuong ? (
            <button
              type="button"
              className="finora-notif-detail-btn-go"
              onClick={() => onDieuHuong('/ngan-sach')}
            >
              <span>{t('Xem quản lý ngân sách')}</span>
              <BieuTuongMuiTen size={16} />
            </button>
          ) : null}

          {/* Nút đóng phụ tiện dụng dưới chân modal */}
          <button
            type="button"
            className="btn btn-vien"
            style={{ width: '100%', marginTop: 8, minHeight: 44, borderRadius: 12 }}
            onClick={(e) => {
              e.stopPropagation()
              dong()
            }}
          >
            {t('Đóng')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
