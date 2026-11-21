/**
 * ChartErrorBoundary.tsx
 *
 * Error Boundary chuyên dụng cho các component biểu đồ Chart.js.
 *
 * Mục đích:
 * - Khi một biểu đồ gặp lỗi (kể cả "Canvas already in use"), chỉ khu vực
 *   biểu đồ đó hiển thị thông báo lỗi nhỏ gọn.
 * - Phần còn lại của trang Báo cáo (KPI cards, bảng giao dịch, khu vực xuất...)
 *   KHÔNG bị ảnh hưởng và vẫn hiển thị bình thường.
 * - Người dùng có thể bấm "Thử lại" để remount biểu đồ mà không cần tải lại trang.
 *
 * LƯU Ý: Error Boundary chỉ là lớp bảo vệ giao diện.
 * Nguyên nhân gốc "Canvas already in use" đã được xử lý trong chartSetup.ts.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'
import { t } from '../../utils/ngonNgu'

interface Props {
  children: ReactNode
  tieuDeBieuDo?: string // Tên biểu đồ để hiển thị trong thông báo lỗi
}

interface State {
  hasError: boolean
  errorMessage: string
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      // Chỉ hiển thị thông báo thân thiện, không lộ stack trace kỹ thuật
      errorMessage: error.message || t('Không thể hiển thị biểu đồ'),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log để debug, không hiển thị cho người dùng
    console.warn('[ChartErrorBoundary] Lỗi biểu đồ:', {
      bieuDo: this.props.tieuDeBieuDo ?? t('Không rõ'),
      loiKyThuat: error.message,
      componentStack: errorInfo.componentStack,
    })
  }

  // Reset state để remount biểu đồ từ đầu (sạch hoàn toàn)
  thuLai = () => {
    this.setState({ hasError: false, errorMessage: '' })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            padding: '20px 16px',
            borderRadius: 12,
            background: 'var(--be-mat-2, rgba(148,163,184,0.08))',
            border: '1px dashed var(--vien, rgba(148,163,184,0.3))',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '1.6rem' }}>📊</span>
          <p
            style={{
              margin: 0,
              fontSize: '0.88rem',
              color: 'var(--chu-phu, #64748b)',
              lineHeight: 1.4,
            }}
          >
            {this.props.tieuDeBieuDo
              ? t('Biểu đồ "{0}" tạm thời không thể hiển thị.', [this.props.tieuDeBieuDo])
              : t('Biểu đồ tạm thời không thể hiển thị.')}
          </p>
          <button
            type="button"
            className="btn btn-nhe btn-sm"
            onClick={this.thuLai}
            style={{ fontSize: '0.82rem', gap: 5 }}
          >
            <RefreshCw size={13} />
            {t('Thử lại')}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

