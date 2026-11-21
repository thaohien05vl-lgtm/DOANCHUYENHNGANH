import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Capacitor } from '@capacitor/core'
import { LogOut } from 'lucide-react'
import { xuLyQuayLaiTrongGiaoDien } from '../../utils/nutQuayLai'
import { t } from '../../utils/ngonNgu'
import { HopChuDe } from '../chung/HopChuDe'

const TRANG_GOC = new Set(['/', '/dang-nhap'])

/**
 * Xử lý nút Back của Android:
 *  1. Đóng modal/hộp thoại đang mở.
 *  2. Ở trang con → quay lại trang trước.
 *  3. Ở trang gốc → hỏi "Bạn có chắc muốn thoát ứng dụng?" (giao diện theo chủ đề).
 */
export function ThoatUngDung() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const [mo, setMo] = useState(false)
  const duongDan = useRef(pathname)
  const dangMo = useRef(false)
  useEffect(() => {
    duongDan.current = pathname
    dangMo.current = mo
  }, [pathname, mo])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let go: (() => void) | undefined
    let huy = false
    void import('@capacitor/app').then(({ App }) => {
      void App.addListener('backButton', () => {
        if (dangMo.current) return setMo(false)
        if (xuLyQuayLaiTrongGiaoDien()) return
        if (TRANG_GOC.has(duongDan.current)) return setMo(true)
        nav(-1)
      }).then((h) => {
        if (huy) void h.remove()
        else go = () => void h.remove()
      })
    })
    return () => {
      huy = true
      go?.()
    }
  }, [nav])

  const thoat = () => {
    setMo(false)
    void import('@capacitor/app').then(({ App }) => App.exitApp())
  }

  return (
    <HopChuDe
      mo={mo}
      bieuTuong={<LogOut size={28} />}
      tieuDe={t('Thoát ứng dụng?')}
      noiDung={t('Bạn có chắc muốn thoát Finora không?')}
      nutChinh={{ nhan: t('Thoát'), onClick: thoat }}
      nutPhu={{ nhan: t('Ở lại'), onClick: () => setMo(false) }}
      dong={() => setMo(false)}
    />
  )
}
