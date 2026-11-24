import { useCallback, useEffect, useState } from 'react'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeftRight,
  Bell,
  Bot,
  CalendarDays,
  ChartNoAxesCombined,
  LayoutDashboard,
  Moon,
  Palette,
  PiggyBank,
  Plus,
  ScanLine,
  Sun,
  Tags,
  Target,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { useXacThuc } from '../../hooks/useXacThuc'
import { laySoLuongChuaDoc } from '../../services/thongBaoService'
import { FormGiaoDich } from '../chung/FormGiaoDich'
import { HoaTietChuDe } from '../chung/HoaTietChuDe'
import { BieuTrungLogo } from '../chung/Logo'
import { TrungTamThongBao } from '../chung/TrungTamThongBao'
import { ThongBaoDetailModal } from '../thong-bao/ThongBaoDetailModal'
import type { ThongBaoNangCao } from '../thong-bao/thongBaoUtils'
import { t } from '../../utils/ngonNgu'

interface MucMenu {
  den: string
  nhan: string
  icon: LucideIcon
  ai?: boolean
}

const NHOM: { khoa: string; ten: string; muc: MucMenu[] }[] = [
  {
    khoa: 'manage', ten: t('Quản lý'),
    muc: [
      { den: '/', nhan: t('Tổng quan'), icon: LayoutDashboard },
      { den: '/giao-dich', nhan: t('Giao dịch'), icon: ArrowLeftRight },
      { den: '/vi-tien', nhan: t('Ví tiền'), icon: Wallet },
      { den: '/danh-muc', nhan: t('Danh mục'), icon: Tags },
    ],
  },
  {
    khoa: 'planning', ten: t('Kế hoạch'),
    muc: [
      { den: '/ngan-sach', nhan: t('Ngân sách'), icon: PiggyBank },
      { den: '/muc-tieu', nhan: t('Mục tiêu tiết kiệm'), icon: Target },
      { den: '/bao-cao', nhan: t('Báo cáo'), icon: ChartNoAxesCombined },
    ],
  },
  {
    khoa: 'smartAssistant', ten: t('Trợ lý thông minh'),
    muc: [
      { den: '/hoa-don', nhan: t('Quét hoá đơn'), icon: ScanLine, ai: true },
      { den: '/tro-ly', nhan: t('Trợ lý tài chính'), icon: Bot, ai: true },
    ],
  },
]

export function BoCuc() {
  const { nguoiDung } = useXacThuc()
  const { toi, doiGiaoDien } = useGiaoDien()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [moThem, setMoThem] = useState(false)
  const [moThongBao, setMoThongBao] = useState(false)
  const [chuaDocDem, setChuaDocDem] = useState(0)
  // State modal chi tiết thông báo nâng lên BoCuc để tránh bị unmount khi panel đóng
  const [chiTietThongBao, setChiTietThongBao] = useState<ThongBaoNangCao | null>(null)

  const capNhatSoLuong = useCallback(() => {
    laySoLuongChuaDoc().then(setChuaDocDem).catch(() => undefined)
  }, [])

  useEffect(() => {
    if (!nguoiDung) return
    capNhatSoLuong()
    const timer = setInterval(capNhatSoLuong, 20000)
    return () => clearInterval(timer)
  }, [nguoiDung, capNhatSoLuong])

  if (!nguoiDung) return <Navigate to="/dang-nhap" replace />
  const chuCai = nguoiDung.ten.trim().charAt(0).toUpperCase() || 'K'

  const menuKhac: MucMenu[] = [
    { den: '/khoanh-khac', nhan: t('Khoảnh khắc'), icon: CalendarDays },
    { den: '/chu-de', nhan: t('Chủ đề & hiển thị'), icon: Palette },
    { den: '/ho-so', nhan: t('Hồ sơ cá nhân'), icon: UserRound },
  ]

  return (
    <div className="ung-dung">
      {/* THANH BÊN (DESKTOP SIDEBAR) */}
      <aside className="thanh-ben">
        <div className="logo">
          <BieuTrungLogo size={40} />
          <div>
            Finora<small>{t('Quản lý tài chính cá nhân')}</small>
          </div>
        </div>

        <nav aria-label={t('Menu chính')}>
          {NHOM.map((n) => (
            <div className="nhom-menu" key={n.khoa}>
              <span>{n.ten}</span>
              {n.muc.map((m) => (
                <NavLink
                  key={m.den}
                  to={m.den}
                  end={m.den === '/'}
                  onClick={() => {
                    if (pathname === m.den && m.den === '/giao-dich') {
                      window.dispatchEvent(new CustomEvent('finora:reset-giao-dich'))
                    }
                  }}
                  className={({ isActive }) => `muc-menu${isActive ? ' active' : ''}`}
                >
                  <m.icon size={19} />
                  {m.nhan}
                  {m.ai && <span className="nhan">AI</span>}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="nhom-menu">
            <span>{t('Hồ sơ cá nhân')}</span>
            {menuKhac.map((m) => (
              <NavLink
                key={m.den}
                to={m.den}
                className={({ isActive }) => `muc-menu${isActive ? ' active' : ''}`}
              >
                <m.icon size={19} />
                {m.nhan}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="cuoi-menu">
          <NavLink
            to="/ca-nhan"
            className={({ isActive }) => `muc-menu${isActive ? ' active' : ''}`}
          >
            <UserRound size={19} />
            {t('Cá nhân')}
          </NavLink>

          <NavLink to="/ho-so" className="the-nguoi-dung" aria-label={t('Mở hồ sơ cá nhân')}>
            <span className="anh-dai-dien">
              {nguoiDung.anhDaiDien ? <img src={nguoiDung.anhDaiDien} alt="" /> : chuCai}
            </span>
            <div>
              <b>{nguoiDung.ten}</b>
              <span>{nguoiDung.email}</span>
            </div>
            <UserRound size={17} />
          </NavLink>
        </div>
      </aside>

      {/* KHUNG NỘI DUNG CHÍNH */}
      <div className="khung-chinh" style={{ position: 'relative' }}>
        <HoaTietChuDe />
        <div className="thanh-tren">
          <div className="logo-nho">
            <BieuTrungLogo size={32} />
            Finora
          </div>
          <div className="khoang" />
          <button
            type="button"
            className="btn btn-vien btn-icon"
            style={{ position: 'relative' }}
            onClick={() => setMoThongBao(true)}
            aria-label={t('Thông báo')}
            title={t('Thông báo{0}', [chuaDocDem > 0 ? ` (${chuaDocDem} chưa đọc)` : ''])}
          >
            <Bell size={18} />
            {chuaDocDem > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 18,
                  height: 18,
                  padding: '0 4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  borderRadius: 9,
                  background: 'var(--san-ho, #e5593f)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  lineHeight: 1,
                }}
              >
                {chuaDocDem > 99 ? '99+' : chuaDocDem}
              </span>
            )}
          </button>
          <button
            className="btn btn-vien btn-icon"
            onClick={doiGiaoDien}
            aria-label={toi ? t('Chuyển sang giao diện sáng') : t('Chuyển sang giao diện tối')}
            title={t('Đổi sáng/tối')}
          >
            {toi ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="btn khong-in nut-them-may-tinh"
            onClick={() => setMoThem(true)}
          >
            <Plus size={18} />
            {t('Thêm giao dịch')}
          </button>
        </div>

        <main className="noi-dung" key={pathname}>
          <Outlet />
        </main>
      </div>

      {/* ============================================================
          THANH ĐIỀU HƯỚNG DƯỚI CÙNG CAO CẤP (MOBILE 5 TABS - HÌNH 3)
          ============================================================ */}
      <nav className="thanh-duoi" aria-label={t('Điều hướng chính')}>
        {/* Tab 1: Trang chủ */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `muc-duoi${isActive ? ' dang-chon' : ''}`}
        >
          <LayoutDashboard size={20} />
          <span>{t('Tổng quan')}</span>
        </NavLink>

        {/* Tab 2: Giao dịch */}
        <NavLink
          to="/giao-dich"
          onClick={() => {
            if (pathname === '/giao-dich') {
              window.dispatchEvent(new CustomEvent('finora:reset-giao-dich'))
            }
          }}
          className={({ isActive }) => `muc-duoi${isActive ? ' dang-chon' : ''}`}
        >
          <ArrowLeftRight size={20} />
          <span>{t('Giao dịch')}</span>
        </NavLink>

        {/* Tab 3: Quét hóa đơn AI (Nút nổi bật ở giữa - Hình 3) */}
        <NavLink
          to="/hoa-don"
          className={({ isActive }) => `nut-quet-trung-tam${isActive ? ' dang-chon' : ''}`}
          aria-label={t('Quét hoá đơn AI')}
        >
          <span className="nut-quet-vong">
            <ScanLine size={24} />
          </span>
          <span className="nut-quet-chu">{t('Quét')}</span>
        </NavLink>

        {/* Tab 4: Thống kê & Báo cáo */}
        <NavLink
          to="/bao-cao"
          className={({ isActive }) => `muc-duoi${isActive ? ' dang-chon' : ''}`}
        >
          <ChartNoAxesCombined size={20} />
          <span>{t('Thống kê')}</span>
        </NavLink>

        {/* Tab 5: Cá nhân */}
        <NavLink
          to="/ca-nhan"
          className={({ isActive }) => `muc-duoi${isActive ? ' dang-chon' : ''}`}
        >
          <UserRound size={20} />
          <span>{t('Cá nhân')}</span>
        </NavLink>
      </nav>

      <FormGiaoDich key={String(moThem)} mo={moThem} dong={() => setMoThem(false)} />
      <TrungTamThongBao
        mo={moThongBao}
        dong={() => setMoThongBao(false)}
        onCapNhatSoLuong={capNhatSoLuong}
        onMoChiTiet={(item) => setChiTietThongBao(item)}
      />
      {/* Modal chi tiết thông báo render độc lập tại BoCuc – tránh bị unmount khi panel đóng */}
      <ThongBaoDetailModal
        item={chiTietThongBao}
        dong={() => setChiTietThongBao(null)}
        onXemGiaoDich={(id) => {
          setChiTietThongBao(null)
          setMoThongBao(false)
          navigate(`/giao-dich?id=${id}`)
        }}
        onDieuHuong={(duongDan) => {
          setChiTietThongBao(null)
          setMoThongBao(false)
          navigate(duongDan)
        }}
      />
    </div>
  )
}
