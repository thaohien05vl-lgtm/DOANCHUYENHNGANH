import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ChartNoAxesCombined,
  CheckCircle2,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Mail,
  ScanLine,
  ShieldCheck,
  User,
} from 'lucide-react'
import { BieuTrungLogo } from '../components/chung/Logo'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { useXacThuc } from '../hooks/useXacThuc'
import { quenMatKhauApi } from '../services/xacThucService'
import { dangNhapGoogle, dangNhapFacebook } from '../utils/oauthClient'
import { CaiDatMayChu } from '../components/chung/CaiDatMayChu'
import { t } from '../utils/ngonNgu'

function KhungXacThuc({ tieuDe, moTa, children }: { tieuDe: string; moTa: string; children: React.ReactNode }) {
  return (
    <div className="xac-thuc">
      {/* Vùng ánh sáng nền mờ đa tầng thích ứng theo Theme */}
      <div className="xac-thuc-aura-1" aria-hidden="true" />
      <div className="xac-thuc-aura-2" aria-hidden="true" />

      {/* Cột nhận diện thương hiệu trên màn hình lớn */}
      <aside className="xac-thuc-thuong-hieu">
        <div className="logo" style={{ padding: 0 }}>
          <BieuTrungLogo size={44} />
          <span>Finora</span>
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2>{t('Quản lý tài chính cá nhân thông minh & tối giản.')}</h2>
          <p>
            {t('Theo dõi dòng tiền, quét hoá đơn tự động bằng AI, đặt ngân sách và hiện thực hoá các mục tiêu tích luỹ tài chính của riêng bạn.')}
          </p>
          <div className="diem-noi-bat">
            <div>
              <span className="icon-tron">
                <ScanLine size={18} />
              </span>
              {t('Quét & bóc tách hoá đơn bằng AI tức thì')}
            </div>
            <div>
              <span className="icon-tron">
                <ChartNoAxesCombined size={18} />
              </span>
              {t('Báo cáo trực quan & phân tích dòng tiền chuyên sâu')}
            </div>
            <div>
              <span className="icon-tron">
                <ShieldCheck size={18} />
              </span>
              {t('Dữ liệu an toàn, riêng tư và tách biệt hoàn toàn')}
            </div>
          </div>
        </div>
        <svg className="vong-trang-tri" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="20" opacity="0.12" />
          <path
            d="M100 22a78 78 0 1 1-67.5 117"
            fill="none"
            stroke="var(--ngoc)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="46" fill="none" stroke="currentColor" strokeWidth="12" opacity="0.08" />
        </svg>
      </aside>

      {/* Khu vực form đăng nhập / đăng ký chính */}
      <main className="xac-thuc-form">
        <div className="xac-thuc-hop">
          <div className="xac-thuc-dau-form">
            <div className="xac-thuc-logo-hang">
              <BieuTrungLogo size={36} />
              <span>Finora</span>
            </div>
            <div>
              <h1>{tieuDe}</h1>
              <p>{moTa}</p>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}

function NutMangXaHoi() {
  const { thongBao } = useGiaoDien()
  const { dangNhapOAuth } = useXacThuc()
  const nav = useNavigate()
  const [dangXuLy, setDangXuLy] = useState<'google' | 'facebook' | null>(null)
  const [loiMxh, setLoiMxh] = useState('')

  const xuLy = async (nhaCungCap: 'google' | 'facebook') => {
    if (dangXuLy) return
    setLoiMxh('')
    setDangXuLy(nhaCungCap)
    try {
      const res = await (nhaCungCap === 'google' ? dangNhapGoogle() : dangNhapFacebook())
      if (res.thanhCong && res.token) {
        await dangNhapOAuth(nhaCungCap, res.token)
        thongBao(nhaCungCap === 'google' ? t('Đăng nhập Google thành công!') : t('Đăng nhập Facebook thành công!'), 'ok')
        nav('/', { replace: true })
      } else if (res.daHuy) {
        thongBao(res.loi ?? t('Bạn đã hủy đăng nhập.'), 'thongtin')
      } else if (res.loi) {
        setLoiMxh(res.loi)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : nhaCungCap === 'google' ? t('Đăng nhập Google thất bại.') : t('Đăng nhập Facebook thất bại.')
      setLoiMxh(msg)
    } finally {
      setDangXuLy(null)
    }
  }

  return (
    <>
      <div className="phan-cach">{t('hoặc tiếp tục với')}</div>
      <div className="hang-mxh">
        <button type="button" className="btn btn-vien nut-mxh" onClick={() => xuLy('google')} disabled={dangXuLy !== null}>
          {dangXuLy === 'google' ? (
            <LoaderCircle size={18} className="xoay" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
              <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
          )}
          Google
        </button>
        <button type="button" className="btn btn-vien nut-mxh" onClick={() => xuLy('facebook')} disabled={dangXuLy !== null}>
          {dangXuLy === 'facebook' ? (
            <LoaderCircle size={18} className="xoay" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
            </svg>
          )}
          Facebook
        </button>
      </div>
      {loiMxh && (
        <div className="canh-bao" role="alert" style={{ marginTop: 4, fontSize: '0.85rem' }}>
          {loiMxh}
        </div>
      )}
    </>
  )
}

function useGuiForm(thucHien: () => Promise<void>) {
  const nav = useNavigate()
  const [loi, setLoi] = useState('')
  const [dang, setDang] = useState(false)
  async function gui(e: FormEvent) {
    e.preventDefault()
    setLoi(''); setDang(true)
    try { await thucHien(); nav('/', { replace: true }) } catch (x) { setLoi(x instanceof Error ? x.message : t('Có lỗi xảy ra, thử lại nhé.')) } finally { setDang(false) }
  }
  return { loi, dang, gui }
}

function OMatKhau({
  gia,
  doi,
  id,
  placeholder = t('Ít nhất 6 ký tự'),
}: {
  gia: string
  doi: (v: string) => void
  id: string
  placeholder?: string
}) {
  const [hien, setHien] = useState(false)
  return (
    <div className="o-co-icon" style={{ position: 'relative' }}>
      <Lock size={18} />
      <input
        id={id}
        className="o-nhap"
        type={hien ? 'text' : 'password'}
        value={gia}
        onChange={(e) => doi(e.target.value)}
        placeholder={placeholder}
        autoComplete={id === 'dn-mk' ? 'current-password' : 'new-password'}
        required
      />
      <button
        type="button"
        className="btn btn-nhe btn-icon btn-sm mat-khau-hien"
        onClick={() => setHien(!hien)}
        aria-label={hien ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
      >
        {hien ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  )
}

export function DangNhap() {
  const { nguoiDung, dangNhap } = useXacThuc()
  const [email, setEmail] = useState('')
  const [mk, setMk] = useState('')
  const { loi, dang, gui } = useGuiForm(() => dangNhap(email, mk))
  if (nguoiDung) return <Navigate to="/" replace />
  return (
    <KhungXacThuc
      tieuDe={t('Chào mừng trở lại')}
      moTa={t('Đăng nhập để xem và quản lý tài chính của bạn.')}
    >
      <form className="form" onSubmit={gui}>
        <div className="truong">
          <label htmlFor="dn-email">Email</label>
          <div className="o-co-icon">
            <Mail size={18} />
            <input
              id="dn-email"
              type="email"
              className="o-nhap"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div className="truong">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="dn-mk">{t('Mật khẩu')}</label>
            <Link
              to="/quen-mat-khau"
              style={{
                fontSize: '0.82rem',
                color: 'var(--ngoc)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {t('Quên mật khẩu?')}
            </Link>
          </div>
          <OMatKhau id="dn-mk" gia={mk} doi={setMk} />
        </div>
        {loi && <div className="canh-bao" role="alert">{loi}</div>}
        <button type="submit" className="btn-xac-thuc-chinh" disabled={dang}>
          {dang ? (
            <>
              <LoaderCircle size={18} className="xoay" />
              {t('Đang đăng nhập…')}
            </>
          ) : (
            t('Đăng nhập')
          )}
        </button>
      </form>
      <NutMangXaHoi />
      <p className="mo nho" style={{ textAlign: 'center' }}>
        {t('Chưa có tài khoản?{0}', [' '])}
        <Link to="/dang-ky" className="dam" style={{ color: 'var(--ngoc)' }}>
          {t('Đăng ký ngay')}
        </Link>
      </p>
      <div style={{ textAlign: 'center', marginTop: 4 }}>
        <CaiDatMayChu />
      </div>
    </KhungXacThuc>
  )
}

export function DangKy() {
  const { nguoiDung, dangKy } = useXacThuc()
  const nav = useNavigate()
  const [ten, setTen] = useState('')
  const [email, setEmail] = useState('')
  const [mk, setMk] = useState('')
  const [xacNhanMk, setXacNhanMk] = useState('')
  const [loi, setLoi] = useState('')
  const [dang, setDang] = useState(false)

  if (nguoiDung) return <Navigate to="/" replace />

  async function xuLyDangKy(e: FormEvent) {
    e.preventDefault()
    setLoi('')
    if (mk.length < 6) {
      setLoi(t('Mật khẩu phải có ít nhất 6 ký tự.'))
      return
    }
    if (mk !== xacNhanMk) {
      setLoi(t('Mật khẩu xác nhận không khớp.'))
      return
    }
    setDang(true)
    try {
      await dangKy(ten.trim(), email, mk)
      nav('/', { replace: true })
    } catch (x) {
      setLoi(x instanceof Error ? x.message : t('Không thể tạo tài khoản, vui lòng thử lại.'))
    } finally {
      setDang(false)
    }
  }

  return (
    <KhungXacThuc
      tieuDe={t('Tạo tài khoản Finora')}
      moTa={t('Bắt đầu quản lý tài chính cá nhân của bạn.')}
    >
      <form className="form" onSubmit={xuLyDangKy}>
        <div className="truong">
          <label htmlFor="dk-ten">{t('Họ và tên')}</label>
          <div className="o-co-icon">
            <User size={18} />
            <input
              id="dk-ten"
              className="o-nhap"
              value={ten}
              onChange={(e) => setTen(e.target.value)}
              placeholder={t('Nguyễn Văn A')}
              autoComplete="name"
              required
            />
          </div>
        </div>
        <div className="truong">
          <label htmlFor="dk-email">Email</label>
          <div className="o-co-icon">
            <Mail size={18} />
            <input
              id="dk-email"
              type="email"
              className="o-nhap"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>
        <div className="truong">
          <label htmlFor="dk-mk">{t('Mật khẩu')}</label>
          <OMatKhau id="dk-mk" gia={mk} doi={setMk} placeholder={t('Tối thiểu 6 ký tự')} />
        </div>
        <div className="truong">
          <label htmlFor="dk-xac-nhan-mk">{t('Nhập lại mật khẩu')}</label>
          <OMatKhau id="dk-xac-nhan-mk" gia={xacNhanMk} doi={setXacNhanMk} placeholder={t('Nhập lại mật khẩu trên')} />
        </div>
        {loi && <div className="canh-bao" role="alert">{loi}</div>}
        <button type="submit" className="btn-xac-thuc-chinh" disabled={dang}>
          {dang ? (
            <>
              <LoaderCircle size={18} className="xoay" />
              {t('Đang tạo tài khoản…')}
            </>
          ) : (
            t('Tạo tài khoản')
          )}
        </button>
      </form>
      <NutMangXaHoi />
      <p className="mo nho" style={{ textAlign: 'center' }}>
        {t('Đã có tài khoản?{0}', [' '])}
        <Link to="/dang-nhap" className="dam" style={{ color: 'var(--ngoc)' }}>
          {t('Đăng nhập')}
        </Link>
      </p>
    </KhungXacThuc>
  )
}

export function QuenMatKhau() {
  const { nguoiDung } = useXacThuc()
  const { thongBao } = useGiaoDien()
  const [email, setEmail] = useState('')
  const [mkMoi, setMkMoi] = useState('')
  const [xacNhanMk, setXacNhanMk] = useState('')
  const [loi, setLoi] = useState('')
  const [dang, setDang] = useState(false)
  const [thanhCong, setThanhCong] = useState(false)

  if (nguoiDung) return <Navigate to="/" replace />

  async function xuLyDatLai(e: FormEvent) {
    e.preventDefault()
    setLoi('')
    if (mkMoi.length < 6) {
      setLoi(t('Mật khẩu mới phải có ít nhất 6 ký tự.'))
      return
    }
    if (mkMoi !== xacNhanMk) {
      setLoi(t('Mật khẩu xác nhận không khớp.'))
      return
    }

    setDang(true)
    try {
      await quenMatKhauApi(email.trim(), mkMoi)
      setThanhCong(true)
      thongBao(t('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.'), 'ok')
    } catch (x) {
      setLoi(x instanceof Error ? x.message : t('Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại email.'))
    } finally {
      setDang(false)
    }
  }

  return (
    <KhungXacThuc
      tieuDe={t('Đặt lại mật khẩu')}
      moTa={t('Nhập email để thiết lập mật khẩu mới cho tài khoản của bạn.')}
    >
      {thanhCong ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'center', padding: '16px 0' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--ngoc-nhat, rgba(20, 148, 111, 0.15))',
              color: 'var(--ngoc, #14946f)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto',
            }}
          >
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{t('Mật khẩu đã được cập nhật!')}</h3>
            <p className="mo nho" style={{ marginTop: 6, lineHeight: 1.5 }}>
              {t('Tài khoản của bạn đã được thiết lập mật khẩu mới thành công. Hãy đăng nhập để tiếp tục.')}
            </p>
          </div>
          <Link
            to="/dang-nhap"
            className="btn-xac-thuc-chinh"
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            {t('Đăng nhập ngay')}
          </Link>
        </div>
      ) : (
        <form className="form" onSubmit={xuLyDatLai}>
          <div className="truong">
            <label htmlFor="qmk-email">{t('Email tài khoản')}</label>
            <div className="o-co-icon">
              <Mail size={18} />
              <input
                id="qmk-email"
                type="email"
                className="o-nhap"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="truong">
            <label htmlFor="qmk-mk-moi">{t('Mật khẩu mới')}</label>
            <OMatKhau id="qmk-mk-moi" gia={mkMoi} doi={setMkMoi} placeholder={t('Tối thiểu 6 ký tự')} />
          </div>
          <div className="truong">
            <label htmlFor="qmk-xac-nhan">{t('Xác nhận mật khẩu mới')}</label>
            <OMatKhau id="qmk-xac-nhan" gia={xacNhanMk} doi={setXacNhanMk} placeholder={t('Nhập lại mật khẩu mới')} />
          </div>
          {loi && <div className="canh-bao" role="alert">{loi}</div>}
          <button type="submit" className="btn-xac-thuc-chinh" disabled={dang}>
            {dang ? (
              <>
                <LoaderCircle size={18} className="xoay" />
                {t('Đang cập nhật mật khẩu…')}
              </>
            ) : (
              t('Cập nhật mật khẩu')
            )}
          </button>
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <Link
              to="/dang-nhap"
              className="mo nho"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={14} /> {t('Quay lại trang Đăng nhập')}
            </Link>
          </div>
        </form>
      )}
    </KhungXacThuc>
  )
}
