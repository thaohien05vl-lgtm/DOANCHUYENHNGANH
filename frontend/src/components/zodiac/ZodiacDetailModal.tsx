import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { dangKyNutQuayLai } from '../../utils/nutQuayLai'
import { t } from '../../utils/ngonNgu'
import type { ZodiacInfo } from './zodiacData'
import { ZodiacIllustration } from './ZodiacIllustration'
import { ZodiacTabs, type ZodiacTabId } from './ZodiacTabs'
import { ZodiacPersonality } from './ZodiacPersonality'

interface ZodiacDetailModalProps {
  mo: boolean
  dong: () => void
  cung: ZodiacInfo
}

export function ZodiacDetailModal({ mo, dong, cung }: ZodiacDetailModalProps) {
  const [tabHienTai, setTabHienTai] = useState<ZodiacTabId>('tinh-cach')

  // Đăng ký nút Back phần cứng Android, phím ESC và khóa cuộn trang nền triệt để
  useEffect(() => {
    if (!mo) return

    const nhanPhim = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        dong()
      }
    }
    document.addEventListener('keydown', nhanPhim)
    const huyDangKy = dangKyNutQuayLai(dong)

    // Khóa cuộn trang cha
    const overflowCu = document.body.style.overflow
    const touchActionCu = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      huyDangKy()
      document.removeEventListener('keydown', nhanPhim)
      document.body.style.overflow = overflowCu
      document.body.style.touchAction = touchActionCu
    }
  }, [mo, dong])

  if (!mo || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="zodiac-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        // Chỉ đóng khi nhấn vào lớp phủ mờ bên ngoài
        if (e.target === e.currentTarget) {
          dong()
        }
      }}
    >
      <div
        className="zodiac-modal-container"
        role="dialog"
        aria-modal="true"
        aria-label={t('Chi tiết cung hoàng đạo {0}', [cung.ten])}
      >
        {/* NÚT ĐÓNG GÓC PHẢI TRÊN TIỆN DỤNG */}
        <button
          type="button"
          className="zodiac-nut-dong-tron"
          onClick={dong}
          aria-label={t('Đóng')}
          title={t('Đóng')}
        >
          <X size={20} />
        </button>

        {/* ========================================================
            1. PHẦN HERO THIÊN THỂ (BỐ CỤC 2 CỘT RỘNG RÃI BÁM SÁT HÌNH MẪU)
            ======================================================== */}
        <div className="zodiac-hero-khung">
          {/* Nền sao trời & bụi sáng thiên hà */}
          <div className="zodiac-hero-stardust" aria-hidden="true">
            <span className="zodiac-star-sparkle s-1">✦</span>
            <span className="zodiac-star-sparkle s-2">✦</span>
            <span className="zodiac-star-sparkle s-3">★</span>
            <span className="zodiac-star-sparkle s-4">✦</span>
            <span className="zodiac-star-sparkle s-5">★</span>
          </div>

          <div className="zodiac-hero-hang">
            {/* CỘT TRÁI: HÌNH MINH HỌA SVG LỚN CHI TIẾT */}
            <div className="zodiac-hero-hinh-hop">
              <ZodiacIllustration signId={cung.id} className="zodiac-hero-svg-lon" />
            </div>

            {/* CỘT PHẢI: NHÃN, TÊN CUNG, KHOẢNG NGÀY & MÔ TẢ ĐẶC TRƯNG */}
            <div className="zodiac-hero-thong-tin">
              <div className="zodiac-hero-nhan-pill">
                <span className="zodiac-hero-nhan-sao">★</span>
                <span>{t('Cung Hoàng Đạo')}</span>
              </div>

              <h2 className="zodiac-hero-ten-cung">{cung.ten}</h2>
              <p className="zodiac-hero-khoang-ngay">({cung.khoangNgay})</p>
              <p className="zodiac-hero-mo-ta">{cung.moTaNgan}</p>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. THANH TAB CHUYỂN NỘI DUNG (4 TAB ĐỒNG ĐỀU, THOÁNG ĐÃNG)
            ======================================================== */}
        <div className="zodiac-tabs-khung-chua">
          <ZodiacTabs tabHienTai={tabHienTai} onChonTab={setTabHienTai} />
        </div>

        {/* ========================================================
            3. VÙNG NỘI DUNG CUỘN ĐỘC LẬP
            ======================================================== */}
        <div className="zodiac-content-cuon">
          <ZodiacPersonality cung={cung} tab={tabHienTai} />
        </div>

        {/* ========================================================
            4. CHÂN MODAL: NÚT ĐÓNG CHÍNH DỄ THAO TÁC TRÊN MOBILE & DESKTOP
            ======================================================== */}
        <div className="zodiac-footer-chua">
          <button type="button" className="zodiac-nut-dong-pill" onClick={dong}>
            <X size={16} />
            <span>{t('Đóng')}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
