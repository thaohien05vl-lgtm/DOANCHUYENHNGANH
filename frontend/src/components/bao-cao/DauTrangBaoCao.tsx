import { t } from '../../utils/ngonNgu'

interface DauTrangBaoCaoProps {
  tieuDeBaoCao: string
  tieuDeKy: string
  tenNguoiDung?: string
  emailNguoiDung?: string
  thoiGianXuat?: string
  maBaoCao?: string
}

export function DauTrangBaoCao({
  tieuDeBaoCao,
  tieuDeKy,
  tenNguoiDung,
  emailNguoiDung,
  thoiGianXuat,
  maBaoCao,
}: DauTrangBaoCaoProps) {
  const nguoiLap = tenNguoiDung || t('Chủ tài khoản Finora')
  const email = emailNguoiDung ? `(${emailNguoiDung})` : ''
  const maTaiLieu = maBaoCao || `FIN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-RPT`
  const thoiGian = thoiGianXuat || new Date().toLocaleString('vi-VN')

  return (
    <header className="dau-trang-bao-cao">
      {/* Khối nhận diện thương hiệu Finora */}
      <div className="dau-trang-thuong-hieu">
        <div className="logo-finora-in" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="16" fill="url(#finora-grad-print)" />
            <rect x="18" y="15" width="8" height="34" rx="3" fill="#ffffff" />
            <rect x="18" y="15" width="28" height="8" rx="3" fill="#ffffff" />
            <rect x="18" y="29" width="19" height="7.5" rx="3" fill="#ffffff" />
            <circle cx="44" cy="43" r="9" fill="#10b981" stroke="#0e2a2d" strokeWidth="2.5" />
            <path
              d="M40 47L47 40M41 40h6v6"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="finora-grad-print" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0e2a2d" />
                <stop offset="1" stopColor="#1e3a3f" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <h1 className="ten-thuong-hieu-finora">FINORA</h1>
          <p className="slogan-finora-in">{t('Hệ thống Quản lý Tài chính Cá nhân')}</p>
        </div>
      </div>

      {/* Khối tiêu đề và siêu dữ liệu báo cáo */}
      <div className="dau-trang-phai">
        <h2 className="tieu-de-bao-cao-in">{tieuDeBaoCao}</h2>
        <div className="thong-tin-ky-in">
          <span>{tieuDeKy}</span>
        </div>
        <div className="thong-tin-nguoi-xuat-in">
          <span>
            {t('Người lập:')} <strong>{nguoiLap}</strong> {email}
          </span>
        </div>
        <div className="thong-tin-nguoi-xuat-in" style={{ fontSize: '0.7rem' }}>
          <span>
            {t('Xuất lúc:')} {thoiGian} • {t('Mã:')} {maTaiLieu}
          </span>
        </div>
      </div>
    </header>
  )
}
