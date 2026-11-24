import { useState, type FormEvent } from 'react'
import { Wallet, ArrowDownCircle, AlertCircle, LoaderCircle } from 'lucide-react'
import { Modal } from '../chung/Modal'
import { OTien } from '../chung/OTien'
import type { MucTieu, Vi, GiaoDich } from '../../types'
import { soDuVi } from '../../utils/thongKe'
import { dinhDangTien } from '../../utils/dinhDang'
import { napTienMucTieuApi, type NapTienResponse } from '../../services/mucTieuService'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { t } from '../../utils/ngonNgu'

interface Props {
  mucTieu: MucTieu | null
  danhSachVi: Vi[]
  danhSachGiaoDich: GiaoDich[]
  dong: () => void
  onThanhCong: (res: NapTienResponse) => void
}

export function ModalNapTienMucTieu({
  mucTieu,
  danhSachVi,
  danhSachGiaoDich,
  dong,
  onThanhCong,
}: Props) {
  const { thongBao } = useGiaoDien()

  // Chọn mặc định ví đầu tiên còn số dư dương, hoặc ví đầu tiên
  const viKhaDung = danhSachVi.find((v) => soDuVi(v, danhSachGiaoDich) > 0) || danhSachVi[0]
  const [maVi, setMaVi] = useState<string>(viKhaDung?.id || '')
  const [soTien, setSoTien] = useState<number>(1000000)
  const [ghiChu, setGhiChu] = useState<string>('')
  const [dangXuLy, setDangXuLy] = useState<boolean>(false)
  const [loi, setLoi] = useState<string>('')

  if (!mucTieu) return null

  const viChon = danhSachVi.find((v) => v.id === maVi)
  const soDuHienTai = viChon ? soDuVi(viChon, danhSachGiaoDich) : 0
  const vuotSoDu = soTien > soDuHienTai

  const mucTieuTarget = mucTieu.soTienMucTieu || 1
  const savedSauNap = (mucTieu.daTietKiem || 0) + (soTien || 0)
  const phanTramSauNap = Math.round((savedSauNap / mucTieuTarget) * 100)
  const nguongCanhBao = mucTieu.nguongCanhBao || 80
  const datNguong = phanTramSauNap >= nguongCanhBao

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoi('')

    if (soTien <= 0) {
      setLoi(t('Số tiền nạp phải lớn hơn 0.'))
      return
    }
    if (!maVi) {
      setLoi(t('Vui lòng chọn ví nguồn để trích tiền.'))
      return
    }
    if (vuotSoDu) {
      setLoi(t('Số dư khả dụng trong ví {0} không đủ ({1}).', [viChon?.ten || '', dinhDangTien(soDuHienTai)]))
      return
    }

    setDangXuLy(true)
    try {
      const res = await napTienMucTieuApi(mucTieu!.id, soTien, maVi, ghiChu)
      thongBao(res.thongDiep, 'ok')
      onThanhCong(res)
      dong()
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('Nạp tiền thất bại, vui lòng thử lại.')
      setLoi(msg)
    } finally {
      setDangXuLy(false)
    }
  }

  const chipsNhanh = [500000, 1000000, 2000000, 5000000]

  return (
    <Modal mo={!!mucTieu} dong={dong} tieuDe={t('Nạp tiền vào mục tiêu tiết kiệm')}>
      <form className="form" onSubmit={handleSubmit}>
        {/* Thẻ tóm tắt mục tiêu */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'color-mix(in srgb, var(--ngoc) 8%, var(--be-mat))',
            border: '1px solid color-mix(in srgb, var(--ngoc) 25%, transparent)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--chu-phu)', whiteSpace: 'nowrap' }}>{t('Mục tiêu tích lũy')}</span>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--ngoc)',
                background: 'color-mix(in srgb, var(--ngoc) 14%, transparent)',
                padding: '2px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              {phanTramSauNap}% {datNguong ? t('(Cán mốc!)') : ''}
            </span>
          </div>
          <b style={{ fontSize: '1.05rem', color: 'var(--chu)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mucTieu.ten}</b>
          <div style={{ fontSize: '0.82rem', color: 'var(--chu-phu)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t('Hiện có:')} <strong style={{ color: 'var(--chu)', whiteSpace: 'nowrap' }}>{dinhDangTien(mucTieu.daTietKiem)}</strong> / <span style={{ whiteSpace: 'nowrap' }}>{dinhDangTien(mucTieu.soTienMucTieu)}</span>
          </div>
        </div>

        {/* Chọn ví nguồn */}
        <div className="truong">
          <label htmlFor="nap-vi" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            <span style={{ whiteSpace: 'nowrap' }}>{t('Trích tiền từ ví')}</span>
            {viChon && (
              <span className={`nho ${soDuHienTai <= 0 ? 'do' : 'mo'}`} style={{ whiteSpace: 'nowrap' }}>
                {t('Khả dụng: {0}', [dinhDangTien(soDuHienTai)])}
              </span>
            )}
          </label>
          <div className="o-co-icon" style={{ position: 'relative' }}>
            <Wallet size={18} />
            <select
              id="nap-vi"
              className="o-nhap"
              value={maVi}
              onChange={(e) => {
                setMaVi(e.target.value)
                setLoi('')
              }}
              required
            >
              {danhSachVi.map((v) => {
                const sd = soDuVi(v, danhSachGiaoDich)
                return (
                  <option key={v.id} value={v.id}>
                    {v.ten} ({dinhDangTien(sd)})
                  </option>
                )
              })}
            </select>
          </div>
        </div>

        {/* Nhập số tiền */}
        <div className="truong">
          <label htmlFor="nap-sotien">{t('Số tiền nạp')}</label>
          <OTien
            id="nap-sotien"
            gia={soTien}
            doi={(n) => {
              setSoTien(n)
              setLoi('')
            }}
          />

          {/* Chips chọn nhanh */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {chipsNhanh.map((m) => (
              <button
                type="button"
                key={m}
                className="btn btn-nhe btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                onClick={() => setSoTien(m)}
              >
                +{dinhDangTien(m)}
              </button>
            ))}
            {soDuHienTai > 0 && (
              <button
                type="button"
                className="btn btn-vien btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 8px', color: 'var(--ngoc)' }}
                onClick={() => setSoTien(soDuHienTai)}
              >
                {t('Tất cả số dư')}
              </button>
            )}
          </div>
        </div>

        {/* Ghi chú */}
        <div className="truong">
          <label htmlFor="nap-ghichu">{t('Ghi chú (Tùy chọn)')}</label>
          <input
            id="nap-ghichu"
            className="o-nhap"
            value={ghiChu}
            onChange={(e) => setGhiChu(e.target.value)}
            placeholder={t('Ví dụ: Trích thưởng dự án, tiết kiệm hàng tuần…')}
            maxLength={120}
          />
        </div>

        {/* Cảnh báo số dư */}
        {vuotSoDu && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>
              {t('Số tiền nạp vượt quá số dư khả dụng của ví ({0}).', [dinhDangTien(soDuHienTai)])}
            </span>
          </div>
        )}

        {loi && (
          <div className="canh-bao" role="alert">
            {loi}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button type="button" className="btn btn-vien" style={{ flex: 1 }} onClick={dong} disabled={dangXuLy}>
            {t('Hủy')}
          </button>
          <button
            type="submit"
            className="btn btn-xac-thuc-chinh"
            style={{ flex: 2, justifyContent: 'center' }}
            disabled={dangXuLy || vuotSoDu || soTien <= 0}
          >
            {dangXuLy ? (
              <>
                <LoaderCircle size={18} className="xoay" />
                {t('Đang xử lý…')}
              </>
            ) : (
              <>
                <ArrowDownCircle size={18} />
                {t('Xác nhận nạp {0}', [dinhDangTien(soTien)])}
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}
