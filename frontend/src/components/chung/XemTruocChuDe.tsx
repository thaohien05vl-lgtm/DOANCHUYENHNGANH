import { Plus, Minus, Palette, Sparkles, CheckCircle2 } from 'lucide-react'
import { HoaTietChuDe } from './HoaTietChuDe'
import { SoChay } from './SoChay'
import { DANH_SACH_CHU_DE } from '../../data/chuDe'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { dinhDangTien } from '../../utils/dinhDang'
import { t } from '../../utils/ngonNgu'

/**
 * Thẻ "Chủ đề hiện tại": minh hoạ trực quan bảng màu đang chọn / đang xem thử
 * (số dư, ô nhập liệu, nút chính, nhãn Thu/Chi) với họa tiết và chuyển động chuẩn mực.
 */
export function XemTruocChuDe() {
  const { theme, themeXemThu } = useGiaoDien()
  const id = themeXemThu ?? theme
  const chuDe = DANH_SACH_CHU_DE.find((c) => c.id === id) ?? DANH_SACH_CHU_DE[0]
  const dangXemThu = !!themeXemThu && themeXemThu !== theme

  return (
    <section className="xt-the" aria-label={t('Chủ đề hiện tại')} key={chuDe.id}>
      {/* Nền hoa văn theo chủ đề */}
      <HoaTietChuDe themeId={chuDe.id} height="100%" />
      <div className="xt-veil" aria-hidden="true" />

      {/* Nội dung minh hoạ trực tiếp */}
      <div className="xt-noidung">
        {/* Hàng đầu: Nhãn chủ đề & Huy hiệu trạng thái */}
        <div className="xt-dau">
          <div className="xt-huy-hieu">
            <span className="xt-cham-mau" style={{ backgroundColor: chuDe.mauChinh }} />
            <Palette size={15} style={{ color: 'var(--ngoc)' }} />
            <div className="xt-ten-nhom">
              <span className="xt-phu-de">{t('Chủ đề hiện tại')}</span>
              <strong className="xt-ten-chu-de">{chuDe.ten}</strong>
            </div>
          </div>
          <div className={`xt-trang-thai ${dangXemThu ? 'xem-thu' : 'dang-dung'}`}>
            {dangXemThu ? (
              <>
                <Sparkles size={13} /> {t('Bản xem thử')}
              </>
            ) : (
              <>
                <CheckCircle2 size={13} /> {t('Đang sử dụng')}
              </>
            )}
          </div>
        </div>

        {/* Khối chính: Minh họa số dư và thanh tiến độ */}
        <div className="xt-than-hop">
          <div className="xt-so-du">
            <span className="xt-nhan-so-du">{t('Tổng số dư tài chính ước tính')}</span>
            <div className="xt-gia-tri-hang">
              <strong className="xt-so-tien">
                <SoChay gia={24380000} dinhDang={(n) => dinhDangTien(Math.round(n))} />
              </strong>
              <span className="xt-xu-huong-pill">
                +12.4% {t('tháng này')}
              </span>
            </div>
            <div className="xt-thanh" aria-hidden="true">
              <div className="xt-thanh-chay" style={{ width: '68%' }} />
            </div>
          </div>

          {/* Minh họa các thành phần tương tác của chủ đề */}
          <div className="xt-phan-tu-hop">
            {/* Ô nhập liệu mẫu */}
            <div className="xt-o-nhap">
              <span className="xt-o-nhap-placeholder">{t('Tìm kiếm hoặc nhập ghi chú giao dịch…')}</span>
              <span className="xt-o-nhap-icon">↵</span>
            </div>

            {/* Các nút bấm hành động mẫu */}
            <div className="xt-hang">
              <button type="button" className="xt-nut" tabIndex={-1} aria-hidden="true">
                <Sparkles size={14} />
                <span>{t('Nút chính')}</span>
              </button>
              <div className="xt-chip thu" aria-hidden="true">
                <Plus size={13} />
                <span>{t('Thu nhập')}</span>
              </div>
              <div className="xt-chip chi" aria-hidden="true">
                <Minus size={13} />
                <span>{t('Chi tiêu')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
