import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { t } from '../../utils/ngonNgu'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 32,
            margin: '24px auto',
            maxWidth: 520,
            textAlign: 'center',
            background: 'var(--be-mat, #fff)',
            borderRadius: 16,
            border: '1px solid var(--mau-vien, rgba(148,163,184,0.25))',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(239,68,68,0.12)',
              color: 'var(--san-ho, #e5593f)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <AlertTriangle size={28} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--chu-chinh)' }}>
            {this.props.fallbackTitle || t('Đã xảy ra lỗi khi hiển thị dữ liệu')}
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--chu-mo)', lineHeight: 1.5 }}>
            {this.state.error?.message || t('Vui lòng làm mới trang hoặc thử lại sau.')}
          </p>
          <button
            type="button"
            className="btn btn-chinh"
            onClick={() => {
              this.resetError()
              window.location.reload()
            }}
            style={{ marginTop: 8 }}
          >
            <RefreshCw size={16} /> {t('Tải lại trang')}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
