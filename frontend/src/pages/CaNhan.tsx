import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bot,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Languages,
  Lock,
  LogOut,
  Palette,
  PiggyBank,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Tags,
  Target,
  User,
  Wallet,
} from 'lucide-react'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { ZodiacCard } from '../components/zodiac/ZodiacCard'
import { DANH_SACH_CHU_DE } from '../data/chuDe'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { useXacThuc } from '../hooks/useXacThuc'
import { TEN_NGON_NGU, type NgonNgu } from '../utils/ngonNgu'
import { t } from '../utils/ngonNgu'

export function CaNhan() {
  const { nguoiDung, dangXuat } = useXacThuc()
  const { theme, toi, anSoDu, doiAnSoDu, ngonNgu, doiNgonNgu, thongBao } = useGiaoDien()
  const du = useDuLieu()

  const [moNgonNgu, setMoNgonNgu] = useState(false)
  const [moDuLieu, setMoDuLieu] = useState(false)
  const [hoiDangXuat, setHoiDangXuat] = useState(false)
  const [hoiDatLai, setHoiDatLai] = useState(false)

  const chuDeHienTai = DANH_SACH_CHU_DE.find((c) => c.id === theme)
  const chuCai = nguoiDung?.ten.trim().charAt(0).toUpperCase() || 'F'

  function saoLuu() {
    const { vi, danhMuc, giaoDich, nganSach, mucTieu } = du
    const a = document.createElement('a')
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ vi, danhMuc, giaoDich, nganSach, mucTieu }, null, 2)], {
        type: 'application/json',
      }),
    )
    a.href = url
    a.download = `sao-luu-finora-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    thongBao(t('Đã tải xuống tệp sao lưu dữ liệu JSON thành công!'), 'ok')
  }

  return (
    <div className="trang" style={{ maxWidth: 680, margin: '0 auto', gap: 16 }}>
      {/* THẺ HỒ SƠ TỔNG QUAN ĐẦU TRANG */}
      <div
        className="the"
        style={{
          padding: '16px 20px',
          borderRadius: 20,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 16,
          background: 'linear-gradient(135deg, var(--be-mat), var(--be-mat-2))',
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--ngoc), var(--ngoc-dam))',
            color: '#fff',
            flexShrink: 0,
            border: '2.5px solid var(--be-mat)',
            boxShadow: '0 4px 14px -3px rgba(0, 0, 0, 0.25)',
          }}
        >
          {nguoiDung?.anhDaiDien ? (
            <img src={nguoiDung.anhDaiDien} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            chuCai
          )}
        </div>
        <div style={{ flex: '1 1 170px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <b style={{ fontSize: '1.05rem', color: 'var(--chu)', overflowWrap: 'break-word', wordBreak: 'normal' }}>{nguoiDung?.ten || t('Người dùng Finora')}</b>
            <span
              className="nhan nhan-ngoc"
              style={{ fontSize: '0.68rem', padding: '1px 8px', display: 'inline-flex', alignItems: 'center', gap: 3 }}
            >
              <ShieldCheck size={12} /> {t('Đã xác thực')}
            </span>
          </div>
          <small className="mo" style={{ display: 'block', fontSize: '0.8rem', marginTop: 2 }}>
            {nguoiDung?.email}
          </small>
        </div>
        <Link
          to="/ho-so"
          className="btn btn-vien btn-sm"
          style={{ padding: '6px 12px', fontSize: '0.78rem', flexShrink: 0, whiteSpace: 'nowrap' }}
          title={t('Sửa thông tin hồ sơ')}
        >
          {t('Sửa hồ sơ')}
        </Link>
      </div>

      {/* THẺ CUNG HOÀNG ĐẠO THIÊN THỂ (NẾU ĐÃ CÓ NGÀY SINH) */}
      {nguoiDung?.ngaySinh && (
        <ZodiacCard ngaySinh={nguoiDung.ngaySinh} />
      )}

      {/* ============================================================
          NHÓM 1: TÀI KHOẢN & THIẾT LẬP (THEO HÌNH 3)
          ============================================================ */}
      <div className="ca-nhan-nhom">
        <Link to="/ho-so" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#eef2ff', color: '#6366f1' }}>
            <User size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Thông tin cá nhân')}</b>
            <small>{t('Ảnh đại diện, ngày sinh, cung hoàng đạo')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/khoanh-khac" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#fdf2f8', color: '#ec4899' }}>
            <CalendarDays size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Nhật ký chi tiêu')}</b>
            <small>{t('Khoảnh khắc gắn với giao dịch tài chính')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/chu-de" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
            <Palette size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Chủ đề & hiển thị')}</b>
            <small>
              {chuDeHienTai?.ten || 'Emerald Finance'} · {toi ? t('Tối') : t('Sáng')}
            </small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <div className="ca-nhan-dong" onClick={() => setMoNgonNgu(true)}>
          <div className="ca-nhan-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <Languages size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Ngôn ngữ')}</b>
            <small>{TEN_NGON_NGU[ngonNgu] || t('Tiếng Việt')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </div>

        <Link to="/vi-tien" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#f0fdfa', color: '#0d9488' }}>
            <Wallet size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Ví & nguồn tiền')}</b>
            <small>{t('{0} ví thanh toán đang sử dụng', [du.vi.length])}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/ho-so" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Lock size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Tài khoản & bảo mật')}</b>
            <small>{t('Đổi mật khẩu, bảo vệ phiên làm việc')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <div className="ca-nhan-dong" onClick={() => setMoDuLieu(true)}>
          <div className="ca-nhan-icon" style={{ background: '#f1f5f9', color: '#475569' }}>
            <Download size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Quyền riêng tư & dữ liệu')}</b>
            <small>{t('Ẩn số dư trên màn hình, xuất JSON sao lưu, phục hồi mẫu')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </div>
      </div>

      {/* ============================================================
          NHÓM 2: CHỨC NĂNG TÀI CHÍNH MỞ RỘNG (THEO HÌNH 3)
          ============================================================ */}
      <div className="ca-nhan-nhom">
        <Link to="/danh-muc" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <Tags size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Danh mục thu chi')}</b>
            <small>{t('Phân loại chi tiêu & nguồn thu cá nhân')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/ngan-sach" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#fae8ff', color: '#c026d3' }}>
            <PiggyBank size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Ngân sách')}</b>
            <small>{t('Kiểm soát hạn mức và cảnh báo chi tiêu tháng')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/muc-tieu" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#fff1f2', color: '#e11d48' }}>
            <Target size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Mục tiêu tiết kiệm')}</b>
            <small>{t('Theo dõi tiến độ tích lũy cho những dự định lớn')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/tro-ly" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
            <Bot size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Trợ lý tài chính AI')}</b>
            <small>{t('Hỏi đáp chi tiêu, phân tích và đưa lời khuyên thông minh')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>

        <Link to="/bao-cao" className="ca-nhan-dong">
          <div className="ca-nhan-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <ChartNoAxesCombined size={19} />
          </div>
          <div className="ca-nhan-thong-tin">
            <b>{t('Thống kê & báo cáo')}</b>
            <small>{t('Báo cáo thu chi tổng hợp, xuất file Excel và PDF')}</small>
          </div>
          <ChevronRight size={18} className="ca-nhan-muiten" />
        </Link>
      </div>

      {/* ============================================================
          NÚT ĐĂNG XUẤT AN TOÀN
          ============================================================ */}
      <button
        type="button"
        className="btn btn-vien"
        style={{
          width: '100%',
          height: 44,
          borderRadius: 14,
          color: 'var(--san-ho, #e5593f)',
          borderColor: 'var(--san-ho, #e5593f)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontWeight: 650,
          marginBottom: 16,
        }}
        onClick={() => setHoiDangXuat(true)}
      >
        <LogOut size={17} />
        <span>{t('Đăng xuất tài khoản')}</span>
      </button>

      {/* MODAL CHỌN NGÔN NGỮ */}
      <Modal mo={moNgonNgu} dong={() => setMoNgonNgu(false)} tieuDe={t('Chọn ngôn ngữ hiển thị')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(TEN_NGON_NGU).map(([code, name]) => {
            const dangChon = ngonNgu === code
            return (
              <button
                type="button"
                key={code}
                onClick={() => {
                  doiNgonNgu(code as NgonNgu)
                  setMoNgonNgu(false)
                }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: dangChon ? '2px solid var(--ngoc)' : '1px solid var(--vien)',
                  background: dangChon ? 'var(--ngoc-nhat)' : 'var(--be-mat-2)',
                  color: dangChon ? 'var(--ngoc-dam)' : 'var(--chu)',
                  fontWeight: dangChon ? 700 : 500,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{name}</span>
                {dangChon && <Sparkles size={16} />}
              </button>
            )
          })}
        </div>
      </Modal>

      {/* MODAL QUYỀN RIÊNG TƯ & DỮ LIỆU */}
      <Modal mo={moDuLieu} dong={() => setMoDuLieu(false)} tieuDe={t('Quyền riêng tư & Quản lý dữ liệu')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Ẩn số dư */}
          <div
            onClick={doiAnSoDu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
              borderRadius: 12,
              background: 'var(--be-mat-2)',
              border: '1px solid var(--vien)',
              cursor: 'pointer',
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '0.92rem' }}>{t('Chế độ riêng tư số tiền')}</b>
              <small className="mo">{t('Làm mờ toàn bộ số dư và thu chi để bảo vệ quyền riêng tư')}</small>
            </div>
            <span className="btn btn-vien btn-sm" style={{ flexShrink: 0 }}>
              {anSoDu ? <><Eye size={15} /> {t('Đang ẩn')}</> : <><EyeOff size={15} /> {t('Đang hiện')}</>}
            </span>
          </div>

          {/* Xuất dữ liệu sao lưu */}
          <div
            onClick={saoLuu}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
              borderRadius: 12,
              background: 'var(--be-mat-2)',
              border: '1px solid var(--vien)',
              cursor: 'pointer',
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '0.92rem' }}>{t('Tải bản sao lưu (JSON)')}</b>
              <small className="mo">{t('Xuất toàn bộ giao dịch, ví, ngân sách và mục tiêu về máy')}</small>
            </div>
            <Download size={18} style={{ color: 'var(--ngoc)', flexShrink: 0 }} />
          </div>

          {/* Đặt lại dữ liệu mẫu */}
          <div
            onClick={() => setHoiDatLai(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 14,
              borderRadius: 12,
              background: 'var(--be-mat-2)',
              border: '1px solid var(--vien)',
              cursor: 'pointer',
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '0.92rem', color: 'var(--san-ho)' }}>{t('Khôi phục dữ liệu mẫu')}</b>
              <small className="mo">{t('Đặt lại các danh mục, ví và giao dịch mẫu ban đầu')}</small>
            </div>
            <RotateCcw size={18} style={{ color: 'var(--san-ho)', flexShrink: 0 }} />
          </div>
        </div>
      </Modal>

      {/* HỘP XÁC NHẬN ĐĂNG XUẤT */}
      <HopXacNhan
        mo={hoiDangXuat}
        tieuDe={t('Đăng xuất tài khoản?')}
        noiDung={t('Bạn sẽ cần đăng nhập lại bằng email và mật khẩu để tiếp tục quản lý tài chính trên Finora.')}
        nhanHuy={t('Hủy')}
        nhanXacNhan={t('Đăng xuất')}
        kieuXacNhan="chinh"
        dong={() => setHoiDangXuat(false)}
        dongY={() => {
          setHoiDangXuat(false)
          dangXuat()
        }}
      />

      {/* HỘP XÁC NHẬN KHÔI PHỤC DỮ LIỆU */}
      <HopXacNhan
        mo={hoiDatLai}
        tieuDe={t('Khôi phục dữ liệu mẫu?')}
        noiDung={t('Toàn bộ giao dịch, ví, ngân sách và mục tiêu hiện tại sẽ được thay bằng dữ liệu mẫu ban đầu.')}
        nhanHuy={t('Hủy')}
        nhanXacNhan={t('Khôi phục')}
        kieuXacNhan="nguy"
        dong={() => setHoiDatLai(false)}
        dongY={() => {
          du.datLaiMau()
          setHoiDatLai(false)
          setMoDuLieu(false)
          thongBao(t('Đã khôi phục dữ liệu mẫu thành công!'), 'ok')
        }}
      />
    </div>
  )
}

