import { useEffect, useState } from 'react'
import { Clock, Plus, LoaderCircle, Wallet, ArrowDownRight } from 'lucide-react'
import { Modal } from '../chung/Modal'
import { TrangThaiTrong } from '../chung/TrangThaiTrong'
import type { LichSuNapMucTieu, MucTieu } from '../../types'
import { layLichSuNapMucTieuApi } from '../../services/mucTieuService'
import { dinhDangNgayGio, dinhDangTien } from '../../utils/dinhDang'
import { t } from '../../utils/ngonNgu'

interface Props {
  mucTieu: MucTieu | null
  dong: () => void
  onMoNapTien: () => void
}

export function ModalLichSuMucTieu({ mucTieu, dong, onMoNapTien }: Props) {
  const [danhSach, setDanhSach] = useState<LichSuNapMucTieu[]>([])
  const [dangTai, setDangTai] = useState(false)
  const [loi, setLoi] = useState('')

  useEffect(() => {
    if (!mucTieu) {
      setDanhSach([])
      return
    }
    let conHieuLuc = true
    setDangTai(true)
    setLoi('')

    layLichSuNapMucTieuApi(mucTieu.id)
      .then((data) => {
        if (!conHieuLuc) return
        setDanhSach(data)
      })
      .catch((err) => {
        if (!conHieuLuc) return
        setLoi(err instanceof Error ? err.message : t('Không thể tải lịch sử đóng góp.'))
      })
      .finally(() => {
        if (conHieuLuc) setDangTai(false)
      })

    return () => {
      conHieuLuc = false
    }
  }, [mucTieu])

  if (!mucTieu) return null

  return (
    <Modal mo={!!mucTieu} dong={dong} tieuDe={t('Lịch sử nạp tiền: {0}', [mucTieu.ten])}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Tóm tắt nhanh số tiền đã tích lũy */}
        <div className="lich-su-mt-header-box">
          <div className="lich-su-mt-header-info">
            <span className="lich-su-mt-header-label">{t('Tổng đã tích lũy')}</span>
            <span className="lich-su-mt-header-amount">{dinhDangTien(mucTieu.daTietKiem)}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-xac-thuc-chinh lich-su-mt-header-btn"
            onClick={() => {
              dong()
              onMoNapTien()
            }}
          >
            <Plus size={15} />
            <span>{t('Nạp thêm')}</span>
          </button>
        </div>

        {/* Nội dung danh sách */}
        {dangTai ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: 'var(--chu-phu)' }}>
            <LoaderCircle size={28} className="xoay" style={{ margin: '0 auto 10px', display: 'block' }} />
            <span>{t('Đang tải dữ liệu từ máy chủ…')}</span>
          </div>
        ) : loi ? (
          <div className="canh-bao" role="alert">
            {loi}
          </div>
        ) : danhSach.length === 0 ? (
          <TrangThaiTrong
            icon={Clock}
            tieuDe={t('Chưa có lịch sử nạp tiền')}
            moTa={t('Mục tiêu này chưa ghi nhận đợt nạp tiền nào từ ví khả dụng của bạn.')}
          >
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                dong()
                onMoNapTien()
              }}
            >
              <Plus size={16} /> {t('Nạp tiền ngay')}
            </button>
          </TrangThaiTrong>
        ) : (
          <div className="lich-su-mt-danh-sach">
            {danhSach.map((item) => (
              <div key={item.id} className="lich-su-mt-item">
                <div className="lich-su-mt-icon">
                  <ArrowDownRight size={18} />
                </div>
                <div className="lich-su-mt-content">
                  {/* Hàng 1: Tiêu đề giao dịch & Số tiền nạp */}
                  <div className="lich-su-mt-row">
                    <span className="lich-su-mt-title">
                      {item.note || t('Nạp tiền vào mục tiêu')}
                    </span>
                    <span className="lich-su-mt-amount">
                      +{dinhDangTien(item.amount)}
                    </span>
                  </div>

                  {/* Hàng 2: Ví trích tiền, thời gian & số dư sau nạp */}
                  <div className="lich-su-mt-row">
                    <div className="lich-su-mt-meta">
                      <span className="lich-su-mt-wallet">
                        <Wallet size={12} />
                        {item.walletName}
                      </span>
                      <span className="lich-su-mt-dot">•</span>
                      <span className="lich-su-mt-time">
                        {item.createdAt ? dinhDangNgayGio(item.createdAt) : ''}
                      </span>
                    </div>
                    <span className="lich-su-mt-after">
                      {t('Sau nạp:')} {dinhDangTien(item.savedAmountAfter)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
