import { Calendar, Check, FilterX, Layers, Repeat, Tag, Wallet } from 'lucide-react'
import type { DanhMuc, Vi } from '../../types'
import { Modal } from './Modal'
import { t, dichTen } from '../../utils/ngonNgu'

export type CheDoThoiGian = 'tat-ca' | 'thang' | 'hom-nay' | '7-ngay' | '30-ngay' | 'tuy-chinh'

interface Props {
  mo: boolean
  dong: () => void
  cheDoTg: CheDoThoiGian
  setCheDoTg: (v: CheDoThoiGian) => void
  tuNgay: string
  setTuNgay: (v: string) => void
  denNgay: string
  setDenNgay: (v: string) => void
  loai: 'tat-ca' | 'thu' | 'chi'
  setLoai: (v: 'tat-ca' | 'thu' | 'chi') => void
  maVi: string
  setMaVi: (v: string) => void
  maDm: string
  setMaDm: (v: string) => void
  chiDinhKy: boolean
  setChiDinhKy: (v: boolean) => void
  vi: Vi[]
  danhMuc: DanhMuc[]
  onDatLai: () => void
}

export function BoLocGiaoDichModal({
  mo,
  dong,
  cheDoTg,
  setCheDoTg,
  tuNgay,
  setTuNgay,
  denNgay,
  setDenNgay,
  loai,
  setLoai,
  maVi,
  setMaVi,
  maDm,
  setMaDm,
  chiDinhKy,
  setChiDinhKy,
  vi,
  danhMuc,
  onDatLai,
}: Props) {
  const cacKy: { id: CheDoThoiGian; label: string }[] = [
    { id: 'tat-ca', label: t('Tất cả thời gian') },
    { id: 'thang', label: t('Theo tháng này') },
    { id: 'hom-nay', label: t('Hôm nay') },
    { id: '7-ngay', label: t('7 ngày gần nhất') },
    { id: '30-ngay', label: t('30 ngày gần nhất') },
    { id: 'tuy-chinh', label: t('Khoảng ngày tùy chọn') },
  ]

  const cacLoai: { id: 'tat-ca' | 'thu' | 'chi'; label: string }[] = [
    { id: 'tat-ca', label: t('Tất cả khoản') },
    { id: 'chi', label: t('Khoản chi') },
    { id: 'thu', label: t('Khoản thu') },
  ]

  return (
    <Modal mo={mo} dong={dong} tieuDe={t('Bộ lọc giao dịch')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 1. KHOẢNG THỜI GIAN */}
        <div>
          <label className="nho mo" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 8 }}>
            <Calendar size={15} /> {t('Khoảng thời gian')}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 6 }}>
            {cacKy.map((k) => {
              const dangChon = cheDoTg === k.id
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setCheDoTg(k.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 10,
                    fontSize: '0.82rem',
                    fontWeight: dangChon ? 700 : 500,
                    border: dangChon ? '1.5px solid var(--ngoc)' : '1px solid var(--vien)',
                    background: dangChon ? 'var(--ngoc-nhat)' : 'var(--be-mat-2)',
                    color: dangChon ? 'var(--ngoc-dam)' : 'var(--chu)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: '0.15s',
                  }}
                >
                  {k.label}
                </button>
              )
            })}
          </div>

          {/* Nếu chọn tùy chọn ngày */}
          {cheDoTg === 'tuy-chinh' && (
            <div
              style={{
                marginTop: 10,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
                padding: 10,
                borderRadius: 12,
                background: 'var(--be-mat-2)',
                border: '1px solid var(--vien)',
              }}
            >
              <div>
                <label className="nho mo" style={{ display: 'block', marginBottom: 4 }}>
                  {t('Từ ngày:')}
                </label>
                <input
                  type="date"
                  className="o-nhap"
                  style={{ width: '100%', minHeight: 36, padding: '4px 8px' }}
                  value={tuNgay}
                  onChange={(e) => setTuNgay(e.target.value)}
                />
              </div>
              <div>
                <label className="nho mo" style={{ display: 'block', marginBottom: 4 }}>
                  {t('Đến ngày:')}
                </label>
                <input
                  type="date"
                  className="o-nhap"
                  style={{ width: '100%', minHeight: 36, padding: '4px 8px' }}
                  value={denNgay}
                  onChange={(e) => setDenNgay(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* 2. LOẠI THU / CHI */}
        <div>
          <label className="nho mo" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 8 }}>
            <Layers size={15} /> {t('Phân loại giao dịch')}
          </label>
          <div className="doan doan-khoi" role="group">
            {cacLoai.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={loai === item.id}
                className={item.id === 'chi' ? 'chi-on' : item.id === 'thu' ? 'thu-on' : ''}
                onClick={() => setLoai(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. VÍ TÀI KHOẢN */}
        <div>
          <label className="nho mo" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 6 }}>
            <Wallet size={15} /> {t('Ví thanh toán')}
          </label>
          <select
            className="o-chon"
            style={{ width: '100%', minHeight: 40 }}
            value={maVi}
            onChange={(e) => setMaVi(e.target.value)}
          >
            <option value="">{t('Tất cả các ví')}</option>
            {vi.map((v) => (
              <option key={v.id} value={v.id}>
                {dichTen(v.ten)}
              </option>
            ))}
          </select>
        </div>

        {/* 4. DANH MỤC */}
        <div>
          <label className="nho mo" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 6 }}>
            <Tag size={15} /> {t('Danh mục thu / chi')}
          </label>
          <select
            className="o-chon"
            style={{ width: '100%', minHeight: 40 }}
            value={maDm}
            onChange={(e) => setMaDm(e.target.value)}
          >
            <option value="">{t('Tất cả danh mục')}</option>
            {danhMuc.map((d) => (
              <option key={d.id} value={d.id}>
                {dichTen(d.ten)} ({d.loai === 'chi' ? t('Chi') : t('Thu')})
              </option>
            ))}
          </select>
        </div>

        {/* 5. GIAO DỊCH ĐỊNH KỲ */}
        <div
          onClick={() => setChiDinhKy(!chiDinhKy)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 12,
            background: 'var(--be-mat-2)',
            border: '1px solid var(--vien)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Repeat size={18} style={{ color: chiDinhKy ? 'var(--ngoc)' : 'var(--chu-mo)' }} />
            <div>
              <b style={{ fontSize: '0.88rem', display: 'block' }}>{t('Chỉ giao dịch định kỳ')}</b>
              <span className="nho mo">{t('Lọc các khoản chi hoặc thu lặp lại tự động')}</span>
            </div>
          </div>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: chiDinhKy ? '2px solid var(--ngoc)' : '2px solid var(--chu-mo)',
              background: chiDinhKy ? 'var(--ngoc)' : 'transparent',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
            }}
          >
            {chiDinhKy && <Check size={14} strokeWidth={3} />}
          </div>
        </div>

        {/* THAO TÁC Ở CHÂN MODAL */}
        <div style={{ display: 'flex', gap: 10, paddingTop: 6, marginTop: 4 }}>
          <button
            type="button"
            className="btn btn-vien"
            style={{ flex: 1, minHeight: 42 }}
            onClick={() => {
              onDatLai()
              dong()
            }}
          >
            <FilterX size={16} /> {t('Đặt lại bộ lọc')}
          </button>
          <button
            type="button"
            className="btn btn-chinh"
            style={{ flex: 1, minHeight: 42 }}
            onClick={dong}
          >
            <Check size={16} /> {t('Áp dụng')}
          </button>
        </div>
      </div>
    </Modal>
  )
}

