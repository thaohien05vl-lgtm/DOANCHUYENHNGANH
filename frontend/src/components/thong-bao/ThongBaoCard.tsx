import React from 'react'
import type { ThongBaoNangCao } from './thongBaoUtils'
import { dinhDangThoiGianGon } from './thongBaoUtils'
import { BieuTuongTaiChinh } from './glyphs/BieuTuongTaiChinh'
import { BieuTuongXoa, BieuTuongMuiTen } from './glyphs/BieuTuongUI'
import { t } from '../../utils/ngonNgu'

interface CardProps {
  item: ThongBaoNangCao
  onNhan: (item: ThongBaoNangCao) => void
  onXoa: (e: React.MouseEvent, id: string) => void
}

/**
 * Thẻ thông báo tài chính Finora cao cấp (Premium Financial Notification Card)
 * - Tự động hiển thị hình minh họa Finora Finance Glyph độc quyền theo sự kiện.
 * - Bố cục 3 hàng + CTA tinh gọn, số tiền và thời gian không bao giờ rớt dòng.
 * - Huy hiệu nổi pastel có chiều sâu, hỗ trợ đầy đủ 15 Theme và Dark Mode.
 */
export function ThongBaoCard({ item, onNhan, onXoa }: CardProps) {
  const thoiGian = dinhDangThoiGianGon(item.createdAt)
  const glyphType = item.glyphType || 'REMINDER'
  const glyphClass = glyphType.toLowerCase()

  return (
    <div
      className={`finora-notif-card ${!item.read ? 'finora-notif-card--unread' : ''}`.trim()}
      onClick={() => onNhan(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onNhan(item)
        }
      }}
      aria-label={`${item.title} - ${item.read ? t('Đã đọc') : t('Chưa đọc')}`}
    >
      {/* Zone 1: Huy hiệu SVG độc quyền Finora Finance Glyph */}
      <div
        className={`finora-notif-card__medallion finora-notif-card__medallion--${glyphClass}`}
        aria-hidden="true"
      >
        <BieuTuongTaiChinh
          type={glyphType}
          size={32}
          category={item.categoryName || item.tenDanhMucHienThi}
        />
      </div>

      {/* Zone 2: Khu vực thông tin chi tiết */}
      <div className="finora-notif-card__info">
        {/* Hàng 1: Tiêu đề sự kiện & Thời gian ghi nhận */}
        <div className="finora-notif-card__top">
          <h4 className="finora-notif-card__title" title={item.title}>
            {item.title}
          </h4>
          <span className="finora-notif-card__time">{thoiGian}</span>
        </div>

        {/* Hàng 2: Giá trị tài chính nổi bật & Chip danh mục / Ví */}
        {(item.soTienHienThi || item.tenDanhMucHienThi || item.tenViHienThi) && (
          <div className="finora-notif-card__amount-row">
            {item.soTienHienThi && (
              <span
                className={`finora-notif-card__amount finora-notif-card__amount--${item.loaiSoTien || 'trung-tinh'}`}
              >
                {item.soTienHienThi}
              </span>
            )}
            <div className="finora-notif-card__tags">
              {item.tenDanhMucHienThi && (
                <span className="finora-notif-card__tag finora-notif-card__tag--category">
                  {item.tenDanhMucHienThi}
                </span>
              )}
              {item.tenViHienThi && (
                <span className="finora-notif-card__tag finora-notif-card__tag--wallet">
                  {item.tenViHienThi}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Thanh tiến trình ngân sách nếu có dữ liệu cảnh báo */}
        {item.tienTrinhNganSach && (
          <div className="finora-notif-card__progress-wrap">
            <div
              className={`finora-notif-card__progress-bar ${
                item.tienTrinhNganSach.phanTram >= 100
                  ? 'finora-notif-card__progress-bar--exceeded'
                  : 'finora-notif-card__progress-bar--warning'
              }`}
              style={{ width: `${Math.min(100, item.tienTrinhNganSach.phanTram)}%` }}
            />
          </div>
        )}

        {/* Hàng 3: Diễn giải nội dung (tối đa 2 dòng clamp thoáng mắt) */}
        <p className="finora-notif-card__desc">
          {item.content}
        </p>

        {/* Hàng 4: Gợi ý điều hướng xem giao dịch nếu có liên kết */}
        {item.transactionId && (
          <div className="finora-notif-card__cta">
            <span>{t('Xem giao dịch')}</span>
            <BieuTuongMuiTen size={12} />
          </div>
        )}
      </div>

      {/* Zone 3: Trạng thái chưa đọc & Nút xóa thông báo */}
      <div className="finora-notif-card__actions">
        {!item.read ? (
          <span className="finora-notif-card__dot" title={t('Chưa đọc')} />
        ) : (
          <span className="finora-notif-card__dot-placeholder" />
        )}
        <button
          type="button"
          className="finora-notif-card__btn-delete"
          onClick={(e) => onXoa(e, item.id)}
          aria-label={t('Xoá thông báo')}
          title={t('Xoá thông báo này')}
        >
          <BieuTuongXoa size={14} />
        </button>
      </div>
    </div>
  )
}
