import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Moon,
  Palette,
  Save,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
  User,
} from 'lucide-react'
import { CameraModal } from '../components/chung/CameraModal'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { ZodiacCard } from '../components/zodiac/ZodiacCard'
import { DANH_SACH_CHU_DE, type ThemeId } from '../data/chuDe'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { useXacThuc } from '../hooks/useXacThuc'
import { api } from '../services/api'
import { nenAnh } from '../utils/anh'
import { t } from '../utils/ngonNgu'

export function HoSo() {
  const { nguoiDung, capNhatHoSo, dangXuat } = useXacThuc()
  const { thongBao, theme, doiChuDe, toi, doiGiaoDien } = useGiaoDien()

  // Form Thông tin cá nhân
  const [ten, setTen] = useState(nguoiDung?.ten ?? '')
  const [email, setEmail] = useState(nguoiDung?.email ?? '')
  const [ngaySinh, setNgaySinh] = useState(nguoiDung?.ngaySinh ?? '')
  const [anhDaiDien, setAnhDaiDien] = useState(nguoiDung?.anhDaiDien ?? '')
  const [dangTaiAnh, setDangTaiAnh] = useState(false)
  const [dangLuuHoSo, setDangLuuHoSo] = useState(false)
  const [moCamera, setMoCamera] = useState(false)

  // Form Đổi mật khẩu
  const [matKhauCu, setMatKhauCu] = useState('')
  const [matKhauMoi, setMatKhauMoi] = useState('')
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('')
  const [hienCu, setHienCu] = useState(false)
  const [hienMoi, setHienMoi] = useState(false)
  const [hienXn, setHienXn] = useState(false)
  const [dangDoiMatKhau, setDangDoiMatKhau] = useState(false)

  // Hộp xác nhận đăng xuất
  const [hoiDangXuat, setHoiDangXuat] = useState(false)

  const chuCai = (ten.trim().charAt(0) || nguoiDung?.ten.charAt(0) || 'F').toUpperCase()

  async function chonAnhTuTep(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setDangTaiAnh(true)
    try {
      const base64 = await nenAnh(file, 640, 0.85)
      setAnhDaiDien(base64)
      thongBao(t('Đã tải ảnh xem trước! Nhấn "Lưu thay đổi" để cập nhật.'), 'ok')
    } catch (loi) {
      thongBao(loi instanceof Error ? loi.message : t('Không thể xử lý ảnh.'), 'loi')
    } finally {
      setDangTaiAnh(false)
      e.target.value = ''
    }
  }

  async function nhanAnhTuCamera(file: File) {
    try {
      const base64 = await nenAnh(file, 640, 0.85)
      setAnhDaiDien(base64)
      thongBao(t('Đã chụp ảnh đại diện! Nhấn "Lưu thay đổi" để cập nhật.'), 'ok')
    } catch {
      thongBao(t('Không thể xử lý ảnh từ camera.'), 'loi')
    }
  }

  async function luuHoSo(e: FormEvent) {
    e.preventDefault()
    if (!ten.trim()) {
      thongBao(t('Vui lòng nhập họ và tên của bạn.'), 'loi')
      return
    }
    setDangLuuHoSo(true)
    try {
      await capNhatHoSo({
        ten: ten.trim(),
        email: email.trim(),
        ngaySinh,
        anhDaiDien,
      })
      thongBao(t('Đã lưu thông tin hồ sơ thành công!'), 'ok')
    } catch (error) {
      const loi = error as { response?: { data?: { message?: string } }; message?: string }
      thongBao(loi.response?.data?.message || loi.message || t('Không thể lưu hồ sơ.'), 'loi')
    } finally {
      setDangLuuHoSo(false)
    }
  }

  async function doiMatKhauSubmit(e: FormEvent) {
    e.preventDefault()
    if (!matKhauCu.trim()) {
      thongBao(t('Vui lòng nhập mật khẩu hiện tại.'), 'loi')
      return
    }
    if (!matKhauMoi) {
      thongBao(t('Vui lòng nhập mật khẩu mới.'), 'loi')
      return
    }
    if (matKhauMoi.length < 6) {
      thongBao(t('Mật khẩu mới phải có ít nhất 6 ký tự.'), 'loi')
      return
    }
    if (matKhauMoi !== xacNhanMatKhau) {
      thongBao(t('Xác nhận mật khẩu mới không khớp.'), 'loi')
      return
    }
    if (matKhauCu === matKhauMoi) {
      thongBao(t('Mật khẩu mới không được trùng với mật khẩu cũ.'), 'loi')
      return
    }

    setDangDoiMatKhau(true)
    try {
      const { data } = await api.put<{ message: string }>('/api/nguoi-dung/doi-mat-khau', {
        matKhauCu,
        matKhauMoi,
        xacNhanMatKhau,
      })
      thongBao(data.message || t('Đổi mật khẩu thành công!'), 'ok')
      setMatKhauCu('')
      setMatKhauMoi('')
      setXacNhanMatKhau('')
    } catch (error) {
      const loi = error as { response?: { data?: { message?: string } }; message?: string }
      thongBao(loi.response?.data?.message || loi.message || t('Không thể đổi mật khẩu.'), 'loi')
    } finally {
      setDangDoiMatKhau(false)
    }
  }

  function chonChuDeMoi(id: ThemeId, tenCd: string) {
    doiChuDe(id)
    thongBao(t('Đã áp dụng chủ đề {0}', [tenCd]), 'ok')
  }

  return (
    <div className="trang hs-khung">
      <TieuDeTrang
        tieuDe={t('Hồ sơ cá nhân')}
        moTa={t('Quản lý thông tin tài khoản, ảnh đại diện, bảo mật và cá nhân hóa giao diện.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      />

      {/* ============================================================
          I. KHU VỰC THÔNG TIN CÁ NHÂN & ẢNH ĐẠI DIỆN (HỢP NHẤT)
          ============================================================ */}
      <section className="the" style={{ borderRadius: 18, overflow: 'hidden' }}>
        <div className="hs-the-dau">
          <h2>
            <User size={19} style={{ color: 'var(--ngoc)' }} />
            {t('Thông tin cá nhân')}
          </h2>
          <p>{t('Cập nhật họ tên, hình đại diện và ngày sinh của bạn')}</p>
        </div>

        <form className="hs-form-body" onSubmit={luuHoSo} noValidate>
          {/* Box chọn/chụp ảnh đại diện tối ưu mobile */}
          <div className="hs-avatar-hop">
            <div className="hs-avatar-hinh">
              {anhDaiDien ? (
                <img src={anhDaiDien} alt={t('Ảnh đại diện')} />
              ) : (
                <span>{chuCai}</span>
              )}
            </div>

            <div className="hs-avatar-chu">
              <b>{t('Ảnh đại diện tài khoản')}</b>
              <small>{t('Hỗ trợ định dạng JPG, PNG hoặc chụp trực tiếp từ máy ảnh')}</small>
            </div>

            <div className="hs-avatar-nut-hang">
              <label htmlFor="hs-tep-anh" className="btn btn-vien btn-sm" style={{ cursor: 'pointer' }}>
                <Upload size={14} />
                <span>{dangTaiAnh ? t('Đang đọc…') : t('Tải file')}</span>
              </label>
              <input
                id="hs-tep-anh"
                type="file"
                accept="image/*"
                onChange={chonAnhTuTep}
                style={{ display: 'none' }}
              />

              <button
                type="button"
                className="btn btn-vien btn-sm"
                onClick={() => setMoCamera(true)}
              >
                <Camera size={14} />
                <span>{t('Chụp ảnh')}</span>
              </button>

              {anhDaiDien && (
                <button
                  type="button"
                  className="btn btn-nhe btn-sm"
                  onClick={() => setAnhDaiDien('')}
                  style={{ color: 'var(--san-ho)' }}
                  title={t('Gỡ ảnh hiện tại')}
                >
                  <Trash2 size={14} />
                  <span>{t('Gỡ ảnh')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Các trường nhập liệu */}
          <div className="hs-luoi-2">
            <div className="truong">
              <label htmlFor="hs-ten">{t('Họ và tên')}</label>
              <input
                id="hs-ten"
                className="o-nhap"
                value={ten}
                onChange={(e) => setTen(e.target.value)}
                placeholder={t('Nhập họ và tên hiển thị')}
                maxLength={80}
              />
            </div>

            <div className="truong">
              <label htmlFor="hs-email">{t('Email tài khoản')}</label>
              <input
                id="hs-email"
                className="o-nhap"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="diachi@email.com"
              />
            </div>
          </div>

          <div className="truong">
            <label htmlFor="hs-ngay-sinh">{t('Ngày sinh')}</label>
            <input
              id="hs-ngay-sinh"
              className="o-nhap"
              type="date"
              value={ngaySinh}
              onChange={(e) => setNgaySinh(e.target.value)}
            />
          </div>

          {/* Thẻ Cung hoàng đạo Celestial */}
          <ZodiacCard ngaySinh={ngaySinh} />

          <div className="hs-chan-hang">
            <span className="nho mo" style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={14} style={{ color: 'var(--ngoc)' }} />
              {t('Dữ liệu được lưu trữ an toàn trên hệ thống')}
            </span>
            <button type="submit" className="btn btn-chinh" disabled={dangLuuHoSo}>
              <Save size={16} />
              <span>{dangLuuHoSo ? t('Đang lưu…') : t('Lưu hồ sơ')}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ============================================================
          II. KHU VỰC BẢO MẬT TÀI KHOẢN (ĐỔI MẬT KHẨU)
          ============================================================ */}
      <section className="the" style={{ borderRadius: 18, overflow: 'hidden' }}>
        <div className="hs-the-dau">
          <h2>
            <Lock size={19} style={{ color: 'var(--mau-chinh, #2563eb)' }} />
            {t('Bảo mật tài khoản')}
          </h2>
          <p>{t('Đổi mật khẩu định kỳ để bảo vệ an toàn cho tài khoản của bạn')}</p>
        </div>

        <form className="hs-form-body" onSubmit={doiMatKhauSubmit} noValidate>
          <div className="truong">
            <label htmlFor="bm-mk-cu">{t('Mật khẩu hiện tại')}</label>
            <div className="o-co-nut-hau-to">
              <input
                id="bm-mk-cu"
                className="o-nhap"
                type={hienCu ? 'text' : 'password'}
                value={matKhauCu}
                onChange={(e) => setMatKhauCu(e.target.value)}
                placeholder={t('Nhập mật khẩu đang dùng')}
              />
              <button
                type="button"
                className="nut-hau-to"
                onClick={() => setHienCu(!hienCu)}
                aria-label={hienCu ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
                title={hienCu ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
              >
                {hienCu ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="hs-luoi-2">
            <div className="truong">
              <label htmlFor="bm-mk-moi">{t('Mật khẩu mới (tối thiểu 6 ký tự)')}</label>
              <div className="o-co-nut-hau-to">
                <input
                  id="bm-mk-moi"
                  className="o-nhap"
                  type={hienMoi ? 'text' : 'password'}
                  value={matKhauMoi}
                  onChange={(e) => setMatKhauMoi(e.target.value)}
                  placeholder={t('Nhập mật khẩu mới')}
                />
                <button
                  type="button"
                  className="nut-hau-to"
                  onClick={() => setHienMoi(!hienMoi)}
                  aria-label={hienMoi ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
                  title={hienMoi ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
                >
                  {hienMoi ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="truong">
              <label htmlFor="bm-mk-xn">{t('Xác nhận mật khẩu mới')}</label>
              <div className="o-co-nut-hau-to">
                <input
                  id="bm-mk-xn"
                  className="o-nhap"
                  type={hienXn ? 'text' : 'password'}
                  value={xacNhanMatKhau}
                  onChange={(e) => setXacNhanMatKhau(e.target.value)}
                  placeholder={t('Nhập lại mật khẩu mới')}
                />
                <button
                  type="button"
                  className="nut-hau-to"
                  onClick={() => setHienXn(!hienXn)}
                  aria-label={hienXn ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
                  title={hienXn ? t('Ẩn mật khẩu') : t('Hiện mật khẩu')}
                >
                  {hienXn ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="hs-chan-hang">
            <span className="nho mo">{t('Mật khẩu phải từ 6 đến 64 ký tự và khác mật khẩu cũ')}</span>
            <button type="submit" className="btn btn-chinh" disabled={dangDoiMatKhau}>
              <Check size={16} />
              <span>{dangDoiMatKhau ? t('Đang cập nhật…') : t('Cập nhật mật khẩu')}</span>
            </button>
          </div>
        </form>
      </section>

      {/* ============================================================
          III. KHU VỰC GIAO DIỆN & 15 CHỦ ĐỀ MÀU SẮC
          ============================================================ */}
      <section className="the" style={{ borderRadius: 18, overflow: 'hidden' }}>
        <div className="hs-the-dau hs-the-dau-ngang">
          <div>
            <h2>
              <Palette size={19} style={{ color: 'var(--vang)' }} />
              {t('Giao diện & Chủ đề màu sắc')}
            </h2>
            <p>{t('15 bảng màu được thiết kế dịu mắt, đồng bộ trên toàn ứng dụng')}</p>
          </div>

          {/* Nút chuyển nhanh chế độ Sáng / Tối */}
          <button
            type="button"
            className="btn btn-vien btn-sm"
            onClick={doiGiaoDien}
            title={t('Đổi chế độ sáng / tối')}
          >
            {toi ? <Sun size={15} /> : <Moon size={15} />}
            <span>{toi ? t('Chế độ tối') : t('Chế độ sáng')}</span>
          </button>
        </div>

        <div style={{ padding: '16px 20px 20px' }}>
          <div className="hs-chu-de-luoi">
            {DANH_SACH_CHU_DE.map((item) => {
              const dangChon = theme === item.id
              return (
                <button
                  type="button"
                  key={item.id}
                  className="hs-the-chu-de"
                  aria-pressed={dangChon}
                  onClick={() => chonChuDeMoi(item.id, item.ten)}
                  title={`${item.ten} - ${item.moTa}`}
                >
                  <span className="dai-mau" aria-hidden="true">
                    {item.mau.map((m) => (
                      <i key={m} style={{ background: m }} />
                    ))}
                  </span>
                  <b>{item.ten}</b>
                  <small>
                    {item.cheDo === 'toi' ? t('Tối') : t('Sáng')}
                    {dangChon && t(' · Đang dùng')}
                  </small>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          IV. PHIÊN ĐĂNG NHẬP VÀ ĐĂNG XUẤT (TÁCH RIÊNG AN TOÀN)
          ============================================================ */}
      <section className="the" style={{ borderRadius: 18, padding: '18px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--chu)' }}>
              {t('Phiên đăng nhập hiện tại')}
            </h3>
            <p className="nho mo" style={{ margin: '3px 0 0' }}>
              {t('Đang đăng nhập với email:')} <b>{nguoiDung?.email || email}</b>
            </p>
          </div>

          <button
            type="button"
            className="btn btn-vien btn-sm"
            onClick={() => setHoiDangXuat(true)}
            style={{ color: 'var(--san-ho, #e5593f)', borderColor: 'var(--san-ho, #e5593f)' }}
          >
            <LogOut size={15} />
            <span>{t('Đăng xuất tài khoản')}</span>
          </button>
        </div>
      </section>

      {/* MODAL CAMERA CHỤP TRỰC TIẾP */}
      <CameraModal
        mo={moCamera}
        dong={() => setMoCamera(false)}
        onChupAnh={nhanAnhTuCamera}
        tieuDe={t('Chụp ảnh đại diện')}
      />

      {/* HỘP THOẠI XÁC NHẬN ĐĂNG XUẤT */}
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
    </div>
  )
}
