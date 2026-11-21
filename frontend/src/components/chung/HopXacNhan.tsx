import { Modal } from './Modal'
import { t } from '../../utils/ngonNgu'

interface Props {
  mo: boolean
  tieuDe: string
  noiDung: string
  nhanHuy?: string
  nhanXacNhan?: string
  kieuXacNhan?: 'nguy' | 'chinh'
  dong: () => void
  dongY: () => void
}

export function HopXacNhan({
  mo,
  tieuDe,
  noiDung,
  nhanHuy = t('Hủy'),
  nhanXacNhan = t('Xác nhận'),
  kieuXacNhan = 'nguy',
  dong,
  dongY,
}: Props) {
  return (
    <Modal mo={mo} dong={dong} tieuDe={tieuDe}>
      <p
        className="mo"
        style={{
          fontSize: '0.94rem',
          lineHeight: 1.55,
          marginBottom: 24,
          color: 'var(--chu-phu)',
        }}
      >
        {noiDung}
      </p>
      <div
        className="hanh-dong-form"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          paddingTop: 4,
        }}
      >
        <button
          type="button"
          className="btn btn-vien"
          style={{
            height: 44,
            borderRadius: 14,
            fontWeight: 600,
          }}
          onClick={dong}
        >
          {nhanHuy}
        </button>
        <button
          type="button"
          className={`btn ${kieuXacNhan === 'chinh' ? 'btn-chinh' : 'btn-nguy'}`}
          style={{
            height: 44,
            borderRadius: 14,
            fontWeight: 600,
          }}
          onClick={dongY}
        >
          {nhanXacNhan}
        </button>
      </div>
    </Modal>
  )
}
