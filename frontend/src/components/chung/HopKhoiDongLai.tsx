import { Languages } from 'lucide-react'
import { t, TEN_NGON_NGU, type NgonNgu } from '../../utils/ngonNgu'
import { HopChuDe } from './HopChuDe'

interface Props {
  mo: boolean
  ngonNguMoi: NgonNgu
  deSau: () => void
  khoiDongLai: () => void
}

/** Nhắc người dùng khởi động lại để áp dụng ngôn ngữ mới. */
export function HopKhoiDongLai({ mo, ngonNguMoi, deSau, khoiDongLai }: Props) {
  return (
    <HopChuDe
      mo={mo}
      bieuTuong={<Languages size={28} />}
      tieuDe={t('Khởi động lại để đổi ngôn ngữ')}
      noiDung={t('Ứng dụng sẽ chuyển sang {0} sau khi khởi động lại. Bạn muốn khởi động lại ngay bây giờ không?', [TEN_NGON_NGU[ngonNguMoi]])}
      ghiChu={t('Nếu chọn "Để sau", ngôn ngữ mới sẽ được áp dụng ở lần mở ứng dụng tiếp theo.')}
      nutChinh={{ nhan: t('Khởi động lại ngay'), onClick: khoiDongLai }}
      nutPhu={{ nhan: t('Để sau'), onClick: deSau }}
    />
  )
}
