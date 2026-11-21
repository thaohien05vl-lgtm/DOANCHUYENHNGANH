import { useState, type FormEvent } from 'react'
import { useDuLieu } from '../../hooks/useDuLieu'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import type { DinhKy, GiaoDich, LoaiGiaoDich } from '../../types'
import { homNayISO } from '../../utils/dinhDang'
import { Modal } from './Modal'
import { OTien } from './OTien'
import { t, dichTen } from '../../utils/ngonNgu'

interface Props {
  mo: boolean
  dong: () => void
  giaoDich?: GiaoDich | null
  macDinh?: Partial<GiaoDich>
}

export function FormGiaoDich(props: Props) {
  // key làm form được khởi tạo lại mỗi lần mở → không cần đồng bộ state bằng effect
  return <Modal mo={props.mo} dong={props.dong} tieuDe={props.giaoDich ? t('Sửa giao dịch') : t('Thêm giao dịch')}><Noi {...props} /></Modal>
}

function Noi({ dong, giaoDich, macDinh }: Props) {
  const { vi, danhMuc, luu } = useDuLieu()
  const { thongBao } = useGiaoDien()
  const goc = giaoDich ?? macDinh
  const [loai, setLoai] = useState<LoaiGiaoDich>(goc?.loai ?? 'chi')
  const [soTien, setSoTien] = useState(goc?.soTien ?? 0)
  const [maDanhMuc, setMaDanhMuc] = useState(goc?.maDanhMuc ?? '')
  const [maVi, setMaVi] = useState(goc?.maVi ?? vi[0]?.id ?? '')
  const [ngay, setNgay] = useState(goc?.ngay ?? homNayISO())
  const [ghiChu, setGhiChu] = useState(goc?.ghiChu ?? '')
  const [dinhKy, setDinhKy] = useState<DinhKy | ''>(goc?.dinhKy ?? '')
  const [loi, setLoi] = useState('')

  const dsDanhMuc = danhMuc.filter((d) => d.loai === loai)
  const danhMucHopLe = dsDanhMuc.some((d) => d.id === maDanhMuc) ? maDanhMuc : (dsDanhMuc[0]?.id ?? '')

  function gui(e: FormEvent) {
    e.preventDefault()
    if (soTien <= 0) return setLoi(t('Nhập số tiền lớn hơn 0.'))
    if (!danhMucHopLe) return setLoi(t('Chưa có danh mục nào cho loại này. Hãy tạo danh mục trước.'))
    if (!maVi) return setLoi(t('Chọn ví để ghi giao dịch.'))
    luu('giaoDich', { id: giaoDich?.id, loai, soTien, maDanhMuc: danhMucHopLe, maVi, ngay, ghiChu: ghiChu.trim(), dinhKy: dinhKy || null })
    thongBao(giaoDich ? t('Đã cập nhật giao dịch') : loai === 'chi' ? t('Đã thêm khoản chi') : t('Đã thêm khoản thu'))
    dong()
  }

  return (
    <form className="form" onSubmit={gui}>
      <div className="doan doan-khoi" role="group" aria-label={t('Loại giao dịch')}>
        <button type="button" className="chi-on" aria-pressed={loai === 'chi'} onClick={() => setLoai('chi')}>{t('Khoản chi')}</button>
        <button type="button" className="thu-on" aria-pressed={loai === 'thu'} onClick={() => setLoai('thu')}>{t('Khoản thu')}</button>
      </div>
      <div className="truong">
        <label htmlFor="gd-tien">{t('Số tiền')}</label>
        <OTien id="gd-tien" gia={soTien} doi={(n) => { setSoTien(n); setLoi('') }} lon />
        {loi && <span className="loi-truong" role="alert">{loi}</span>}
      </div>
      <div className="hang-truong">
        <div className="truong">
          <label htmlFor="gd-dm">{t('Danh mục')}</label>
          <select id="gd-dm" className="o-chon" value={danhMucHopLe} onChange={(e) => setMaDanhMuc(e.target.value)}>
            {dsDanhMuc.map((d) => <option key={d.id} value={d.id}>{dichTen(d.ten)}</option>)}
          </select>
        </div>
        <div className="truong">
          <label htmlFor="gd-vi">{t('Ví')}</label>
          <select id="gd-vi" className="o-chon" value={maVi} onChange={(e) => setMaVi(e.target.value)}>
            {vi.map((v) => <option key={v.id} value={v.id}>{dichTen(v.ten)}</option>)}
          </select>
        </div>
        <div className="truong">
          <label htmlFor="gd-ngay">{t('Ngày')}</label>
          <input id="gd-ngay" type="date" className="o-nhap" value={ngay} max="2100-12-31" onChange={(e) => setNgay(e.target.value)} required />
        </div>
        <div className="truong">
          <label htmlFor="gd-dk">{t('Lặp lại')}</label>
          <select id="gd-dk" className="o-chon" value={dinhKy} onChange={(e) => setDinhKy(e.target.value as DinhKy | '')}>
            <option value="">{t('Không lặp')}</option>
            <option value="ngay">{t('Hằng ngày')}</option>
            <option value="tuan">{t('Hằng tuần')}</option>
            <option value="thang">{t('Hằng tháng')}</option>
          </select>
        </div>
      </div>
      <div className="truong">
        <label htmlFor="gd-ghichu">{t('Ghi chú')}</label>
        <input id="gd-ghichu" className="o-nhap" value={ghiChu} placeholder={t('Ví dụ: Cơm trưa với team')} maxLength={120} onChange={(e) => setGhiChu(e.target.value)} />
      </div>
      <div className="hanh-dong-form">
        <button type="button" className="btn btn-vien" onClick={dong}>{t('Huỷ')}</button>
        <button type="submit" className="btn">{giaoDich ? t('Lưu thay đổi') : t('Thêm giao dịch')}</button>
      </div>
    </form>
  )
}
