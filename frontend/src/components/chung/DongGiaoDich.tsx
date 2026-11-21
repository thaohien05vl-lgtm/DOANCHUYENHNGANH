import { Pencil, Repeat, Trash2 } from 'lucide-react'
import type { DanhMuc, GiaoDich, Vi } from '../../types'
import { dinhDangTien } from '../../utils/dinhDang'
import { ONhanDienDanhMuc } from './BieuTuong'
import { t, dichTen } from '../../utils/ngonNgu'

interface Props {
  gd: GiaoDich
  danhMuc?: DanhMuc
  vi?: Vi
  sua?: (g: GiaoDich) => void
  xoa?: (g: GiaoDich) => void
  xemChiTiet?: (g: GiaoDich) => void
}

const NHAN_DK = { ngay: t('Hằng ngày'), tuan: t('Hằng tuần'), thang: t('Hằng tháng') }

export function DongGiaoDich({ gd, danhMuc, vi, sua, xoa, xemChiTiet }: Props) {
  function handleClick() {
    if (xemChiTiet) {
      xemChiTiet(gd)
    } else if (sua) {
      sua(gd)
    }
  }

  return (
    <div
      className="dong-gd"
      onClick={handleClick}
      style={{ cursor: xemChiTiet || sua ? 'pointer' : 'default' }}
      title={t('Nhấn để xem chi tiết giao dịch')}
    >
      <ONhanDienDanhMuc bieuTuong={danhMuc?.bieuTuong ?? 'wallet'} mau={danhMuc?.mau ?? '#64748B'} />
      <div className="giua">
        <b>{gd.ghiChu || dichTen(danhMuc?.ten) || t('Giao dịch')}</b>
        <span>
          {dichTen(danhMuc?.ten)}
          {vi && <>· {dichTen(vi.ten)}</>}
          {gd.dinhKy && <span className="nhan nhan-vang" style={{ padding: '0 8px' }}><Repeat size={11} />{NHAN_DK[gd.dinhKy]}</span>}
        </span>
      </div>
      <span className={`tien so ${gd.loai === 'chi' ? 'chi' : 'thu'}`}>{gd.loai === 'chi' ? '−' : '+'}{dinhDangTien(gd.soTien)}</span>
      {(sua || xoa) && (
        <div className="thao-tac">
          {sua && (
            <button
              type="button"
              className="btn btn-nhe btn-icon btn-sm"
              onClick={(e) => {
                e.stopPropagation()
                sua(gd)
              }}
              aria-label={t('Sửa')}
              title={t('Sửa giao dịch này')}
            >
              <Pencil size={16} />
            </button>
          )}
          {xoa && (
            <button
              type="button"
              className="btn btn-nhe btn-icon btn-sm"
              onClick={(e) => {
                e.stopPropagation()
                xoa(gd)
              }}
              aria-label={t('Xoá')}
              title={t('Xoá giao dịch này')}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
