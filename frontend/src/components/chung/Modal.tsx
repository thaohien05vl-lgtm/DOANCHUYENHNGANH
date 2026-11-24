import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { dangKyNutQuayLai } from '../../utils/nutQuayLai'
import { X } from 'lucide-react'
import { t } from '../../utils/ngonNgu'

interface Props {
  mo: boolean
  dong: () => void
  tieuDe: string
  rong?: boolean
  className?: string
  children: ReactNode
}

export function Modal({ mo, dong, tieuDe, rong, className = '', children }: Props) {
  useEffect(() => {
    if (!mo) return
    const nhanPhim = (e: KeyboardEvent) => e.key === 'Escape' && dong()
    document.addEventListener('keydown', nhanPhim)
    const huyDangKy = dangKyNutQuayLai(dong)
    const cu = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      huyDangKy()
      document.removeEventListener('keydown', nhanPhim)
      document.body.style.overflow = cu
    }
  }, [mo, dong])

  if (!mo || typeof document === 'undefined') return null

  return createPortal(
    <div
      className="modal-nen"
      role="presentation"
      onMouseDown={(e) => {
        // Chỉ đóng khi người dùng nhấn trực tiếp vào lớp nền ngoài, không bấm nhầm vào modal
        if (e.target === e.currentTarget) {
          dong()
        }
      }}
    >
      <div
        className={`modal${rong ? ' rong' : ''} ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-label={tieuDe}
      >
        <div className="modal-dau">
          <h2>{tieuDe}</h2>
          <button
            type="button"
            className="btn btn-nhe btn-icon btn-sm"
            onClick={dong}
            aria-label={t('Đóng')}
            style={{ minWidth: 44, minHeight: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} />
          </button>
        </div>
        <div className="modal-than">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
