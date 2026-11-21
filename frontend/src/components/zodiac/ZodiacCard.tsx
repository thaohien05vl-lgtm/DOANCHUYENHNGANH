import { useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { t } from '../../utils/ngonNgu'
import { xacDinhCung } from './zodiacUtils'
import { ZodiacIllustration } from './ZodiacIllustration'
import { ZodiacDetailModal } from './ZodiacDetailModal'
import './zodiac.css'

interface ZodiacCardProps {
  ngaySinh?: string | null
  className?: string
}

export function ZodiacCard({ ngaySinh, className = '' }: ZodiacCardProps) {
  const [moChiTiet, setMoChiTiet] = useState(false)
  const cung = useMemo(() => xacDinhCung(ngaySinh), [ngaySinh])

  if (!cung) {
    // Trường hợp chưa chọn ngày sinh: Thẻ gợi ý thiên thể
    return (
      <div className={`zodiac-card zodiac-card--empty ${className}`.trim()}>
        <div className="zodiac-card__artwork zodiac-card__artwork--empty">
          <Sparkles size={22} className="zodiac-card__sparkle-spin" />
        </div>
        <div className="zodiac-card__info">
          <div className="zodiac-card__badge-row">
            <span className="zodiac-card__badge">{t('CUNG HOÀNG ĐẠO')}</span>
          </div>
          <b className="zodiac-card__name">{t('Khám phá lá số thiên thể')}</b>
          <p className="zodiac-card__description">
            {t('Chọn ngày sinh bên trên để Finora vẽ lá số thiên thể & tính cách của bạn.')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`zodiac-card ${className}`.trim()}>
        {/* Nền sao trời li ti */}
        <div className="zodiac-card__stars-bg" aria-hidden="true">
          <span className="zodiac-star-dot dot-1" />
          <span className="zodiac-star-dot dot-2" />
          <span className="zodiac-star-dot dot-3" />
        </div>

        {/* ========================================================
            KHU VỰC 1: HÌNH MINH HỌA SVG BÊN TRÁI (KHÔNG DÙNG UNICODE)
            ======================================================== */}
        <div className="zodiac-card__artwork" title={`${cung.ten} (${cung.khoangNgay})`}>
          <div className="zodiac-card__orbit" />
          <div className="zodiac-card__orbit-outer" />
          <ZodiacIllustration signId={cung.id} className="zodiac-card__svg" />
        </div>

        {/* ========================================================
            KHU VỰC 2: THÔNG TIN CUNG HOÀNG ĐẠO Ở GIỮA
            (TÊN CUNG TUYỆT ĐỐI NẰM TRÊN MỘT DÒNG DUY NHẤT)
            ======================================================== */}
        <div className="zodiac-card__info">
          <div className="zodiac-card__badge-row">
            <span className="zodiac-card__badge">{t('CUNG HOÀNG ĐẠO')}</span>
            <span className="zodiac-card__date">{cung.khoangNgay}</span>
          </div>
          <h3 className="zodiac-card__name">{t('Cung {0}', [cung.ten])}</h3>
          <p className="zodiac-card__description">{cung.moTaNgan}</p>
        </div>

        {/* ========================================================
            KHU VỰC 3: NÚT KHÁM PHÁ BÊN PHẢI (MŨI TÊN SVG TỰ VẼ)
            ======================================================== */}
        <div className="zodiac-card__action">
          <button
            type="button"
            className="zodiac-card__button"
            onClick={() => setMoChiTiet(true)}
            aria-label={t('Khám phá tính cách cung {0}', [cung.ten])}
          >
            <span className="zodiac-card__button-text-full">{t('Khám phá tính cách')}</span>
            <span className="zodiac-card__button-text-short">{t('Khám phá')}</span>
            {/* Mũi tên SVG tự vẽ, KHÔNG dùng icon thư viện */}
            <svg
              className="zodiac-card__arrow"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal chi tiết thiên thể độc lập */}
      <ZodiacDetailModal mo={moChiTiet} dong={() => setMoChiTiet(false)} cung={cung} />
    </>
  )
}
