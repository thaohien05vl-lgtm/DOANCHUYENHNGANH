import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { t } from '../../utils/ngonNgu'

interface NutQuayVeProps {
  duongDanMacDinh?: string
  tieuDe?: string
  className?: string
  onQuayVe?: () => void
}

export function NutQuayVe({
  duongDanMacDinh = '/ca-nhan',
  tieuDe = t('Quay về trang trước'),
  className = '',
  onQuayVe,
}: NutQuayVeProps) {
  const navigate = useNavigate()

  function handleQuayVe() {
    if (onQuayVe) {
      onQuayVe()
      return
    }

    // Kiểm tra lịch sử điều hướng an toàn
    const coLichSu = typeof window !== 'undefined' && window.history.length > 1
    if (coLichSu && window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate(duongDanMacDinh)
    }
  }

  return (
    <button
      type="button"
      className={`nut-quay-ve ${className}`}
      onClick={handleQuayVe}
      aria-label={tieuDe}
      title={tieuDe}
    >
      <ChevronLeft size={20} strokeWidth={2.4} />
    </button>
  )
}

