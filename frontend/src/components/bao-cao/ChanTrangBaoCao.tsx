import { t } from '../../utils/ngonNgu'

interface ChanTrangBaoCaoProps {
  trangHienTai: number
  tongSoTrang: number
  tieuDeKy?: string
}

export function ChanTrangBaoCao({
  trangHienTai,
  tongSoTrang,
  tieuDeKy,
}: ChanTrangBaoCaoProps) {
  return (
    <footer className="chan-trang-bao-cao">
      <div className="chan-trang-trai">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        <span>
          <strong>Finora</strong> • {t('Báo cáo phân tích dòng tiền chính thức')}
        </span>
      </div>

      {tieuDeKy && (
        <div style={{ fontStyle: 'italic', color: '#64748b' }}>
          {tieuDeKy}
        </div>
      )}

      <div className="chan-trang-phai">
        <span>{t('Bản quyền © Finora')}</span>
        <span className="so-trang-badge">
          {t('Trang')} {trangHienTai} / {tongSoTrang}
        </span>
      </div>
    </footer>
  )
}
