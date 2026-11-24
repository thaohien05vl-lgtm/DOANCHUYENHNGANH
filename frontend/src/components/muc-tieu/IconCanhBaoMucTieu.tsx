import { useState } from 'react'
import { Sparkles, Trophy, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react'
import type { MucTieu } from '../../types'
import { dinhDangTien } from '../../utils/dinhDang'
import { t } from '../../utils/ngonNgu'

export type TrangThaiCanhBao = 'binh-thuong' | 'gan-dat' | 'dat-nguong' | 'hoan-thanh' | 'vuot-muc-tieu'

interface Props {
  mucTieu: MucTieu
  onNapTien?: () => void
}

/**
 * Icon SVG cảnh báo ngưỡng tiết kiệm Finora với 5 trạng thái thiết kế tinh tế:
 * 1. Bình thường (<70%): Trung tính, đường nét tối giản
 * 2. Gần đạt (70% - 79%): Màu hổ phách/cam dịu
 * 3. Đạt ngưỡng (>=80% hoặc ngưỡng tùy chỉnh): Nổi bật với huy hiệu cảnh báo
 * 4. Hoàn thành (100%): Màu ngọc lục bảo Finora rực rỡ
 * 5. Vượt mục tiêu (>100%): Vương miện/kim cương thặng dư
 */
export function IconCanhBaoMucTieu({ mucTieu, onNapTien }: Props) {
  const [hienTooltip, setHienTooltip] = useState(false)
  const [moBangChiTiet, setMoBangChiTiet] = useState(false)

  const target = mucTieu.soTienMucTieu > 0 ? mucTieu.soTienMucTieu : 1
  const saved = mucTieu.daTietKiem || 0
  const phanTram = Math.round((saved / target) * 100)
  const nguong = mucTieu.nguongCanhBao || 80

  let trangThai: TrangThaiCanhBao = 'binh-thuong'
  if (phanTram > 100) {
    trangThai = 'vuot-muc-tieu'
  } else if (phanTram === 100) {
    trangThai = 'hoan-thanh'
  } else if (phanTram >= nguong) {
    trangThai = 'dat-nguong'
  } else if (phanTram >= 70) {
    trangThai = 'gan-dat'
  }

  const conThieu = Math.max(0, target - saved)
  const vuot = Math.max(0, saved - target)

  let tieuDe = ''
  let moTa = ''

  switch (trangThai) {
    case 'vuot-muc-tieu':
      tieuDe = t('Vượt mục tiêu {0}%', [phanTram])
      moTa = t('Tuyệt vời! Bạn đã vượt mục tiêu {0}.', [dinhDangTien(vuot)])
      break
    case 'hoan-thanh':
      tieuDe = t('Đã hoàn thành 100%')
      moTa = t('Chúc mừng! Bạn đã đạt trọn vẹn mục tiêu {0}.', [dinhDangTien(target)])
      break
    case 'dat-nguong':
      tieuDe = t('Đạt ngưỡng cảnh báo {0}%', [phanTram])
      moTa = t('Chỉ còn {0} nữa là về đích!', [dinhDangTien(conThieu)])
      break
    case 'gan-dat':
      tieuDe = t('Tiến độ khả quan ({0}%)', [phanTram])
      moTa = t('Còn {0} để chạm mốc {1}%.', [dinhDangTien(conThieu), nguong])
      break
    default:
      tieuDe = t('Tiến độ hiện tại: {0}%', [phanTram])
      moTa = t('Đã tích lũy {0} / {1}.', [dinhDangTien(saved), dinhDangTien(target)])
      break
  }

  return (
    <div className="icon-cb-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className={`icon-cb-btn ${trangThai}`}
        onClick={() => setMoBangChiTiet(!moBangChiTiet)}
        onMouseEnter={() => setHienTooltip(true)}
        onMouseLeave={() => setHienTooltip(false)}
        aria-label={`${tieuDe} - ${moTa}`}
        title={tieuDe}
      >
        <svg
          viewBox="0 0 36 36"
          width="34"
          height="34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="icon-cb-svg"
        >
          {trangThai === 'vuot-muc-tieu' && (
            <>
              <defs>
                <linearGradient id="cb-vuot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="cb-vuot-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="18" cy="18" r="16" fill="url(#cb-vuot-grad)" fillOpacity="0.16" stroke="#10b981" strokeWidth="1.5" />
              {/* Vương miện / Kim cương vượt mục tiêu */}
              <path
                d="M10 23L12 14L18 19L24 14L26 23H10Z"
                fill="url(#cb-vuot-grad)"
                stroke="#059669"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="13" r="1.8" fill="#34d399" />
              <circle cx="12" cy="13" r="1.4" fill="#34d399" />
              <circle cx="24" cy="13" r="1.4" fill="#34d399" />
            </>
          )}

          {trangThai === 'hoan-thanh' && (
            <>
              <defs>
                <linearGradient id="cb-xong-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14946F" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="16" fill="url(#cb-xong-grad)" fillOpacity="0.14" stroke="#14946F" strokeWidth="1.5" />
              {/* Khiên bảo vệ thành công */}
              <path
                d="M18 9L25 12V18C25 22.5 22 25.5 18 27C14 25.5 11 22.5 11 18V12L18 9Z"
                fill="url(#cb-xong-grad)"
                stroke="#14946F"
                strokeWidth="1.2"
              />
              <path d="M15 18L17.5 20.5L21.5 15.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}

          {trangThai === 'dat-nguong' && (
            <>
              <defs>
                <linearGradient id="cb-nguong-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="16" fill="url(#cb-nguong-grad)" fillOpacity="0.15" stroke="#d97706" strokeWidth="1.5" />
              {/* Chuông cảnh báo đạt mốc */}
              <path
                d="M18 10C15.2 10 13 12.2 13 15V19L11 22H25L23 19V15C23 12.2 20.8 10 18 10Z"
                fill="url(#cb-nguong-grad)"
                stroke="#b45309"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M16 23C16 24.1 16.9 25 18 25C19.1 25 20 24.1 20 23" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="24" cy="11" r="3" fill="#ef4444" />
            </>
          )}

          {trangThai === 'gan-dat' && (
            <>
              <circle cx="18" cy="18" r="16" fill="#fef3c7" fillOpacity="0.6" stroke="#f59e0b" strokeWidth="1.3" />
              {/* Biểu tượng tam giác cảnh báo bo tròn mềm mại */}
              <path
                d="M18 11L25 23H11L18 11Z"
                fill="#fde68a"
                stroke="#d97706"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="16.5" r="1.2" fill="#b45309" />
              <line x1="18" y1="19.5" x2="18" y2="20.5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}

          {trangThai === 'binh-thuong' && (
            <>
              <circle cx="18" cy="18" r="16" fill="color-mix(in srgb, var(--be-mat) 90%, transparent)" stroke="var(--vien)" strokeWidth="1.2" />
              {/* Biểu tượng lá chắn tài chính trung tính */}
              <path
                d="M18 11L23 13V18C23 21.5 20.8 23.8 18 25C15.2 23.8 13 21.5 13 18V13L18 11Z"
                fill="color-mix(in srgb, var(--chu) 8%, transparent)"
                stroke="var(--chu-phu)"
                strokeWidth="1.2"
              />
              <circle cx="18" cy="17.5" r="2" fill="var(--chu-phu)" />
            </>
          )}
        </svg>

        {/* Chấm trạng thái nhỏ góc phải */}
        <span className={`icon-cb-dot ${trangThai}`} />
      </button>

      {/* Tooltip khi hover trên Desktop */}
      {hienTooltip && !moBangChiTiet && (
        <div className="icon-cb-tooltip" role="tooltip">
          <strong>{tieuDe}</strong>
          <span>{moTa}</span>
        </div>
      )}

      {/* Bảng chi tiết Popover khi bấm trên Mobile & Desktop */}
      {moBangChiTiet && (
        <>
          <div className="icon-cb-backdrop" onClick={() => setMoBangChiTiet(false)} />
          <div className="icon-cb-popover">
            <div className="icon-cb-popover-header">
              <span className={`icon-cb-pill ${trangThai}`}>
                {trangThai === 'vuot-muc-tieu' && <Trophy size={13} />}
                {trangThai === 'hoan-thanh' && <CheckCircle2 size={13} />}
                {trangThai === 'dat-nguong' && <AlertTriangle size={13} />}
                {trangThai === 'gan-dat' && <Sparkles size={13} />}
                {trangThai === 'binh-thuong' && <ShieldCheck size={13} />}
                {tieuDe}
              </span>
              <button
                type="button"
                className="icon-cb-dong"
                onClick={() => setMoBangChiTiet(false)}
                aria-label={t('Đóng')}
              >
                ✕
              </button>
            </div>

            <div className="icon-cb-popover-body">
              <div className="icon-cb-ten-mt">{mucTieu.ten}</div>
              <div className="icon-cb-thong-so">
                <div>
                  <small>{t('Đã tích lũy')}</small>
                  <b>{dinhDangTien(saved)}</b>
                </div>
                <div>
                  <small>{t('Mục tiêu')}</small>
                  <b>{dinhDangTien(target)}</b>
                </div>
                <div>
                  <small>{t('Ngưỡng cảnh báo')}</small>
                  <b>{nguong}%</b>
                </div>
              </div>

              <div className="icon-cb-thanh-tien-do">
                <div
                  className={`icon-cb-thanh-chay ${trangThai}`}
                  style={{ width: `${Math.min(phanTram, 100)}%` }}
                />
              </div>

              <p className="icon-cb-ghi-chu">{moTa}</p>
            </div>

            {onNapTien && (
              <div className="icon-cb-popover-footer">
                <button
                  type="button"
                  className="btn btn-sm btn-xac-thuc-chinh"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setMoBangChiTiet(false)
                    onNapTien()
                  }}
                >
                  {t('Nạp tiền vào mục tiêu')} <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
