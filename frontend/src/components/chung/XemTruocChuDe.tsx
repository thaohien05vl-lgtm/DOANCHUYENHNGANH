import { Plus, Minus } from 'lucide-react'
import { HoaTietChuDe } from './HoaTietChuDe'
import { SoChay } from './SoChay'
import { DANH_SACH_CHU_DE } from '../../data/chuDe'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { dinhDangTien } from '../../utils/dinhDang'
import { t } from '../../utils/ngonNgu'

/**
 * Thẻ "Chủ đề hiện tại": minh hoạ trực tiếp bảng màu đang chọn / đang xem thử
 * (số dư, ô nhập liệu, nút chính, nhãn Thu/Chi) với họa tiết và chuyển động của chủ đề.
 */
export function XemTruocChuDe() {
  const { theme, themeXemThu } = useGiaoDien()
  const id = themeXemThu ?? theme
  const chuDe = DANH_SACH_CHU_DE.find((c) => c.id === id) ?? DANH_SACH_CHU_DE[0]

  return (
    <section className="xt-the" aria-label={t('Chủ đề hiện tại')} key={chuDe.id}>
      <HoaTietChuDe height="100%" />
      <div className="xt-veil" aria-hidden="true" />
      <div className="xt-noidung">
        <div className="xt-ten">
          <small>{t('Chủ đề hiện tại')}</small>
          <b>{chuDe.ten}</b>
        </div>

        <div className="xt-so-du">
          <span>{t('Số dư')}</span>
          <strong>
            <SoChay gia={24380000} dinhDang={(n) => dinhDangTien(Math.round(n))} />
          </strong>
          <div className="xt-thanh" aria-hidden="true">
            <i />
          </div>
        </div>

        <div className="xt-o-nhap">{t('Ô nhập liệu')}</div>

        <div className="xt-hang">
          <span className="xt-nut">{t('Nút chính')}</span>
          <span className="xt-chip thu">
            <Plus size={12} /> {t('Thu')}
          </span>
          <span className="xt-chip chi">
            <Minus size={12} /> {t('Chi')}
          </span>
        </div>
      </div>
    </section>
  )
}
