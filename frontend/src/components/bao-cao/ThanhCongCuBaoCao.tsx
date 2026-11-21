import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  Printer,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { t } from '../../utils/ngonNgu'

interface ThanhCongCuBaoCaoProps {
  tieuDe: string
  moTa: string
  mucZoom: number
  cheDoZoom: 'vua-chieu-rong' | 'vua-toan-trang' | 'tuy-chinh'
  onThuNho: () => void
  onPhongTo: () => void
  onVuaChieuRong: () => void
  onVuaToanTrang: () => void
  onDatMucZoom: (zoom: number) => void
  trangHienTai: number
  tongSoTrang: number
  onChuyenTrang: (trang: number) => void
  onInBaoCao: () => void
  onLuuPdf: () => void
  onDong: () => void
}

export function ThanhCongCuBaoCao({
  tieuDe,
  moTa,
  mucZoom,
  cheDoZoom,
  onThuNho,
  onPhongTo,
  onVuaChieuRong,
  onVuaToanTrang,
  onDatMucZoom,
  trangHienTai,
  tongSoTrang,
  onChuyenTrang,
  onInBaoCao,
  onLuuPdf,
  onDong,
}: ThanhCongCuBaoCaoProps) {
  const phanTramZoom = Math.round(mucZoom * 100)

  return (
    <div className="thanh-cong-cu-bao-cao">
      {/* Cụm trái: Tiêu đề & kỳ báo cáo */}
      <div className="thanh-cong-cu-trai">
        <div className="thanh-cong-cu-tieu-de">
          <h2>{tieuDe}</h2>
          <span>{moTa}</span>
        </div>
      </div>

      {/* Cụm giữa: Điều khiển Phóng to / Thu nhỏ & Fit chế độ */}
      <div className="thanh-cong-cu-giua">
        {/* Thu nhỏ */}
        <button
          type="button"
          className="nut-cong-cu nut-cong-cu-icon"
          onClick={onThuNho}
          title={t('Thu nhỏ (Zoom out)')}
          aria-label={t('Thu nhỏ')}
        >
          <ZoomOut size={16} />
        </button>

        {/* Mức % zoom hiện tại */}
        <button
          type="button"
          className="nut-cong-cu nhan-zoom"
          onClick={() => {
            // Nhấn vào % để lặp qua các mốc: 100% -> 125% -> 75% -> 100%
            if (phanTramZoom === 100) onDatMucZoom(1.25)
            else if (phanTramZoom === 125) onDatMucZoom(0.75)
            else onDatMucZoom(1)
          }}
          title={t('Nhấp để đổi mốc phóng to')}
        >
          {phanTramZoom}%
        </button>

        {/* Phóng to */}
        <button
          type="button"
          className="nut-cong-cu nut-cong-cu-icon"
          onClick={onPhongTo}
          title={t('Phóng to (Zoom in)')}
          aria-label={t('Phóng to')}
        >
          <ZoomIn size={16} />
        </button>

        {/* Nút Vừa chiều rộng */}
        <button
          type="button"
          className={`nut-cong-cu ${cheDoZoom === 'vua-chieu-rong' ? 'kich-hoat' : ''}`}
          onClick={onVuaChieuRong}
          title={t('Tự động vừa chiều rộng màn hình')}
        >
          <Maximize2 size={14} />
          <span style={{ display: 'none', minWidth: 0 }} className="nhan-nut-desktop">
            {t('Vừa rộng')}
          </span>
        </button>

        {/* Nút Vừa toàn trang */}
        <button
          type="button"
          className={`nut-cong-cu ${cheDoZoom === 'vua-toan-trang' ? 'kich-hoat' : ''}`}
          onClick={onVuaToanTrang}
          title={t('Vừa toàn trang')}
        >
          <Minimize2 size={14} />
          <span style={{ display: 'none', minWidth: 0 }} className="nhan-nut-desktop">
            {t('Toàn trang')}
          </span>
        </button>

        {/* Điều hướng trang */}
        {tongSoTrang > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 4, paddingLeft: 6, borderLeft: '1px solid var(--vien, #cbd5e1)' }}>
            <button
              type="button"
              className="nut-cong-cu nut-cong-cu-icon"
              disabled={trangHienTai <= 1}
              onClick={() => onChuyenTrang(trangHienTai - 1)}
              title={t('Trang trước')}
              aria-label={t('Trang trước')}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0 4px', color: 'var(--chu, #0f172a)' }}>
              {trangHienTai}/{tongSoTrang}
            </span>
            <button
              type="button"
              className="nut-cong-cu nut-cong-cu-icon"
              disabled={trangHienTai >= tongSoTrang}
              onClick={() => onChuyenTrang(trangHienTai + 1)}
              title={t('Trang sau')}
              aria-label={t('Trang sau')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Cụm phải: In, Lưu PDF, Đóng */}
      <div className="thanh-cong-cu-phai">
        {/* Nút In báo cáo */}
        <button
          type="button"
          className="nut-cong-cu nut-in-chinh"
          onClick={onInBaoCao}
          title={t('Mở hộp thoại in tài liệu chuẩn A4')}
        >
          <Printer size={15} />
          <span>{t('In')}</span>
        </button>

        {/* Nút Lưu PDF */}
        <button
          type="button"
          className="nut-cong-cu nut-luu-pdf"
          onClick={onLuuPdf}
          title={t('Lưu báo cáo dưới dạng file PDF')}
        >
          <Download size={15} />
          <span>{t('Lưu PDF')}</span>
        </button>

        {/* Nút Đóng */}
        <button
          type="button"
          className="nut-cong-cu nut-dong-preview"
          onClick={onDong}
          title={t('Đóng xem trước')}
          aria-label={t('Đóng')}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
