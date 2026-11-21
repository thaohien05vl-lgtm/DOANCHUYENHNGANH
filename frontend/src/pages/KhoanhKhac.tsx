import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { CalendarDays, Camera, ChevronLeft, ChevronRight, ImagePlus, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CameraModal } from '../components/chung/CameraModal'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { useXacThuc } from '../hooks/useXacThuc'
import { nenAnh } from '../utils/anh'
import { layKhoanhKhac, themKhoanhKhac as taoKhoanhKhac, xoaKhoanhKhac as xoaKhoanhKhacApi, type KhoanhKhacData } from '../services/khoanhKhacService'
import { maLocaleHienTai, t } from '../utils/ngonNgu'

// Thứ Hai → Chủ nhật theo ngôn ngữ hiện tại (2024-01-01 là thứ Hai)
const NGAY_TRONG_TUAN = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(maLocaleHienTai, { weekday: 'short' }).format(new Date(2024, 0, 1 + i)),
)
function ngayISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
export function KhoanhKhac() {
  const { nguoiDung } = useXacThuc()
  const { thongBao } = useGiaoDien()
  const [khoanhKhac, setKhoanhKhac] = useState<KhoanhKhacData[]>([])
  const [dangTaiDanhSach, setDangTaiDanhSach] = useState(true)

  useEffect(() => {
    let conHieuLuc = true
    layKhoanhKhac()
      .then((ds) => { if (conHieuLuc) setKhoanhKhac(ds) })
      .catch((error: unknown) => {
        const loi = error as { response?: { data?: { message?: string } }; message?: string }
        if (conHieuLuc) thongBao(loi.response?.data?.message || t('Không thể tải khoảnh khắc từ máy chủ.'), 'loi')
      })
      .finally(() => { if (conHieuLuc) setDangTaiDanhSach(false) })
    return () => { conHieuLuc = false }
  }, [nguoiDung?.email, thongBao])
  const homNay = ngayISO(new Date())
  const [thangDangXem, setThangDangXem] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [ngayChon, setNgayChon] = useState(homNay)
  const [tepAnh, setTepAnh] = useState<File | null>(null)
  const [moCamera, setMoCamera] = useState(false)
  const [chuThich, setChuThich] = useState('')
  const [ngayAnh, setNgayAnh] = useState(homNay)
  const [dangLuu, setDangLuu] = useState(false)

  const anhXemTruoc = useMemo(() => {
    if (!tepAnh) return null
    return URL.createObjectURL(tepAnh)
  }, [tepAnh])

  useEffect(() => {
    return () => {
      if (anhXemTruoc) URL.revokeObjectURL(anhXemTruoc)
    }
  }, [anhXemTruoc])
  const thangLabel = thangDangXem.toLocaleDateString(maLocaleHienTai, { month: 'long', year: 'numeric' })

  const ngayTrongThang = useMemo(() => {
    const dauThang = new Date(thangDangXem.getFullYear(), thangDangXem.getMonth(), 1)
    const offset = (dauThang.getDay() + 6) % 7
    const soNgay = new Date(thangDangXem.getFullYear(), thangDangXem.getMonth() + 1, 0).getDate()
    return [...Array(offset).fill(null), ...Array.from({ length: soNgay }, (_, i) => ngayISO(new Date(thangDangXem.getFullYear(), thangDangXem.getMonth(), i + 1)))] as (string | null)[]
  }, [thangDangXem])

  const cacNgayCoAnh = useMemo(() => new Set(khoanhKhac.map((x) => x.ngay)), [khoanhKhac])
  const danhSachNgayChon = useMemo(() => khoanhKhac.filter((x) => x.ngay === ngayChon).sort((a, b) => b.id.localeCompare(a.id)), [khoanhKhac, ngayChon])

  function chonTep(e: ChangeEvent<HTMLInputElement>) {
    setTepAnh(e.target.files?.[0] ?? null)
    e.target.value = ''
  }

  async function themKhoanhKhac(e: FormEvent) {
    e.preventDefault()
    if (!tepAnh) {
      thongBao(t('Hãy chọn hoặc chụp một bức ảnh.'), 'loi')
      return
    }
    setDangLuu(true)
    try {
      const anh = await nenAnh(tepAnh, 1200, 0.76)
      const moi = await taoKhoanhKhac({ ngay: ngayAnh, chuThich: chuThich.trim(), anh })
      setKhoanhKhac((ds) => [moi, ...ds])
      setTepAnh(null)
      setChuThich('')
      setNgayChon(ngayAnh)
      setThangDangXem(new Date(`${ngayAnh}T12:00:00`))
      thongBao(t('Đã lưu khoảnh khắc lên máy chủ'))
    } catch (loi) {
      thongBao(loi instanceof Error ? loi.message : t('Không thể lưu ảnh.'), 'loi')
    } finally {
      setDangLuu(false)
    }
  }

  async function xoaKhoanhKhac(id: string) {
    try {
      await xoaKhoanhKhacApi(id)
      setKhoanhKhac((ds) => ds.filter((x) => x.id !== id))
      thongBao(t('Đã xoá khoảnh khắc'))
    } catch (error) {
      const loi = error as { response?: { data?: { message?: string } }; message?: string }
      thongBao(loi.response?.data?.message || t('Không thể xoá khoảnh khắc.'), 'loi')
    }
  }

  function doiThang(delta: number) {
    setThangDangXem((x) => new Date(x.getFullYear(), x.getMonth() + delta, 1))
  }

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Khoảnh khắc')}
        moTa={t('Lưu những bức ảnh đáng nhớ vào đúng ngày trên lịch của bạn.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      >
        <Link to="/" className="btn btn-vien btn-sm">{t('Về tổng quan')}</Link>
      </TieuDeTrang>

      <div className="luoi luoi-7-5">
        <section className="the">
          <div className="the-dau"><h2><CalendarDays size={18} style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }} />{t('Lịch tháng')}</h2><span className="nho mo">{dangTaiDanhSach ? t('Đang tải…') : t('{0} khoảnh khắc', [khoanhKhac.length])}</span></div>
          <div className="khoanh-khac-dau" style={{ marginBottom: 14 }}>
            <button className="btn btn-vien btn-icon" onClick={() => doiThang(-1)} aria-label={t('Tháng trước')}><ChevronLeft size={18} /></button>
            <b style={{ textTransform: 'capitalize' }}>{thangLabel}</b>
            <button className="btn btn-vien btn-icon" onClick={() => doiThang(1)} aria-label={t('Tháng sau')}><ChevronRight size={18} /></button>
          </div>
          <div className="lich-thang">
            {NGAY_TRONG_TUAN.map((day) => <span key={day}>{day}</span>)}
            {ngayTrongThang.map((day, i) => day ? (
              <button key={day} className={`lich-ngay${day === homNay ? ' hom-nay' : ''}${cacNgayCoAnh.has(day) ? ' co-anh' : ''}${day === ngayChon ? ' dang-chon' : ''}`} onClick={() => setNgayChon(day)} aria-label={`${day}${cacNgayCoAnh.has(day) ? t(', có khoảnh khắc') : ''}`}>
                {Number(day.slice(-2))}{cacNgayCoAnh.has(day) && <i />}
              </button>
            ) : <span className="lich-ngay trong" key={`empty-${i}`} />)}
          </div>
          <div className="khoanh-khac-ngay" style={{ marginTop: 14 }}>
            <b>{new Date(`${ngayChon}T12:00:00`).toLocaleDateString(maLocaleHienTai, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b>
            <span className="nho mo">{t('{0} ảnh', [danhSachNgayChon.length])}</span>
          </div>
          {danhSachNgayChon.length ? <div className="khoanh-khac-luoi" style={{ marginTop: 14 }}>
            {danhSachNgayChon.map((item) => <article className="khoanh-khac-item" key={item.id}>
              <img src={item.anh} alt={item.chuThich || t('Khoảnh khắc đã lưu')} className="khoanh-khac-anh" />
              {item.chuThich && <p>{item.chuThich}</p>}
              <button className="btn btn-nhe btn-sm" onClick={() => xoaKhoanhKhac(item.id)}><Trash2 size={15} />{t('Xoá')}</button>
            </article>)}
          </div> : <p className="nho mo" style={{ marginTop: 12 }}>{t('Chưa có ảnh nào trong ngày này. Chọn một ảnh ở khung bên cạnh để lưu vào lịch.')}</p>}
        </section>

        <section className="the">
          <div className="the-dau"><h2><ImagePlus size={18} style={{ display: 'inline', verticalAlign: -4, marginRight: 8 }} />{t('Thêm khoảnh khắc')}</h2></div>
          <form className="form" onSubmit={themKhoanhKhac}>
            {anhXemTruoc ? (
              <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--vien)' }}>
                <img src={anhXemTruoc} alt={t('Xem trước')} style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                <button
                  type="button"
                  className="btn btn-sm btn-nhe"
                  onClick={() => setTepAnh(null)}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 8px' }}
                >
                  <X size={15} /> {t('Đổi ảnh')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <label htmlFor="kk-anh" className="btn btn-vien" style={{ cursor: 'pointer', justifyContent: 'center', height: 70, flexDirection: 'column', gap: 4 }}>
                    <ImagePlus size={20} />
                    <span className="nho">{t('Tải từ thiết bị')}</span>
                  </label>
                  <button
                    type="button"
                    className="btn btn-vien"
                    onClick={() => setMoCamera(true)}
                    style={{ justifyContent: 'center', height: 70, flexDirection: 'column', gap: 4 }}
                  >
                    <Camera size={20} />
                    <span className="nho">{t('Chụp camera trực tiếp')}</span>
                  </button>
                </div>
                <input id="kk-anh" type="file" accept="image/*" onChange={chonTep} style={{ display: 'none' }} />
              </div>
            )}

            <div className="truong"><label htmlFor="kk-ngay">{t('Ngày lưu')}</label><input id="kk-ngay" className="o-nhap" type="date" value={ngayAnh} onChange={(e) => setNgayAnh(e.target.value)} required /></div>
            <div className="truong"><label htmlFor="kk-chuthich">{t('Chú thích')}</label><textarea id="kk-chuthich" className="o-van-ban" value={chuThich} onChange={(e) => setChuThich(e.target.value)} placeholder={t('Một ngày thật đáng nhớ…')} maxLength={240} rows={3} /></div>
            <button className="btn btn-khoi" disabled={dangLuu || !tepAnh}>{dangLuu ? t('Đang lưu ảnh…') : t('Lưu vào lịch')}</button>
          </form>
        </section>
      </div>
      <p className="nho mo">{t('Ảnh và chú thích được lưu riêng theo tài khoản trên máy chủ Finora.')}</p>
      <CameraModal
        mo={moCamera}
        dong={() => setMoCamera(false)}
        onChupAnh={(f) => {
          setTepAnh(f)
          thongBao(t('Đã chụp ảnh khoảnh khắc!'))
        }}
        tieuDe={t('Chụp ảnh Khoảnh Khắc')}
      />
    </div>
  )
}
