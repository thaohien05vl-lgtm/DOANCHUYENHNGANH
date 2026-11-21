import { Calendar, CreditCard, FileText, Pencil, Repeat, Tag, Trash2 } from 'lucide-react'
import type { DanhMuc, GiaoDich, Vi } from '../../types'
import { dinhDangNgay, dinhDangTien } from '../../utils/dinhDang'
import { ONhanDienDanhMuc } from './BieuTuong'
import { Modal } from './Modal'
import { t } from '../../utils/ngonNgu'

interface Props {
  gd: GiaoDich | null
  danhMuc?: DanhMuc
  vi?: Vi
  dong: () => void
  onSua?: (gd: GiaoDich) => void
  onXoa?: (gd: GiaoDich) => void
}

const NHAN_DK: Record<string, string> = {
  ngay: t('Hằng ngày'),
  tuan: t('Hằng tuần'),
  thang: t('Hằng tháng'),
}

export function ChiTietGiaoDichModal({ gd, danhMuc, vi, dong, onSua, onXoa }: Props) {
  if (!gd) return null

  const laChi = gd.loai === 'chi'

  return (
    <Modal mo={!!gd} dong={dong} tieuDe={t('Chi tiết giao dịch')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* HEADER: BIỂU TƯỢNG VÀ SỐ TIỀN */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px 16px',
            background: 'var(--be-mat-phu, rgba(148, 163, 184, 0.06))',
            borderRadius: 14,
            textAlign: 'center',
            gap: 10,
          }}
        >
          <ONhanDienDanhMuc bieuTuong={danhMuc?.bieuTuong ?? 'wallet'} mau={danhMuc?.mau ?? '#64748B'} />
          <div>
            <span className="nho mo" style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>
              {laChi ? t('Khoản chi tiêu') : t('Khoản thu nhập')}
            </span>
            <div
              className="so"
              style={{
                fontSize: '1.9rem',
                fontWeight: 800,
                marginTop: 2,
                color: laChi ? 'var(--san-ho, #e5593f)' : 'var(--ngoc, #14946f)',
              }}
            >
              {laChi ? '−' : '+'}{dinhDangTien(gd.soTien)}
            </div>
          </div>
          <strong style={{ fontSize: '1.05rem' }}>{gd.ghiChu || danhMuc?.ten || t('Giao dịch')}</strong>
        </div>

        {/* THÔNG TIN CHI TIẾT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--mau-vien, rgba(148,163,184,0.15))' }}>
            <span className="mo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag size={16} /> {t('Danh mục')}
            </span>
            <strong>{danhMuc?.ten || t('Không có danh mục')}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--mau-vien, rgba(148,163,184,0.15))' }}>
            <span className="mo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={16} /> {t('Ví / Phương thức')}
            </span>
            <strong>{vi?.ten || t('Ví mặc định')}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--mau-vien, rgba(148,163,184,0.15))' }}>
            <span className="mo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={16} /> {t('Ngày giao dịch')}
            </span>
            <strong className="so">{gd.ngay ? dinhDangNgay(gd.ngay) : t('Chưa ghi nhận')}</strong>
          </div>

          {gd.dinhKy && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--mau-vien, rgba(148,163,184,0.15))' }}>
              <span className="mo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Repeat size={16} /> {t('Chu kỳ lặp lại')}
              </span>
              <span className="nhan nhan-vang" style={{ padding: '2px 10px' }}>
                {NHAN_DK[gd.dinhKy] || gd.dinhKy}
              </span>
            </div>
          )}

          {gd.ghiChu && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 0' }}>
              <span className="mo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={16} /> {t('Ghi chú')}
              </span>
              <p style={{ margin: 0, padding: '8px 12px', background: 'var(--be-mat-phu, rgba(148,163,184,0.06))', borderRadius: 8, fontSize: '0.92rem' }}>
                {gd.ghiChu}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.78rem', color: 'var(--chu-mo)' }}>
            <span>{t('Mã định danh giao dịch (ID)')}</span>
            <code style={{ fontSize: '0.76rem', background: 'var(--be-mat-phu, rgba(148,163,184,0.1))', padding: '2px 6px', borderRadius: 4 }}>
              {gd.id}
            </code>
          </div>
        </div>

        {/* CÁC NÚT THAO TÁC */}
        <div className="hanh-dong-form" style={{ marginTop: 8, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {onXoa && (
            <button
              type="button"
              className="btn btn-nhe"
              onClick={() => {
                dong()
                onXoa(gd)
              }}
              style={{ color: 'var(--san-ho, #e5593f)' }}
            >
              <Trash2 size={16} /> {t('Xóa giao dịch')}
            </button>
          )}

          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button type="button" className="btn btn-vien" onClick={dong}>
              {t('Đóng')}
            </button>
            {onSua && (
              <button
                type="button"
                className="btn btn-chinh"
                onClick={() => {
                  dong()
                  onSua(gd)
                }}
              >
                <Pencil size={16} /> {t('Sửa giao dịch')}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

