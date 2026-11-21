import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react'
import { DANH_SACH_CHU_DE, type ThemeId } from '../data/chuDe'
import { docNgonNguDaChon, luuNgonNgu, ngonNguHienTai, type NgonNgu } from '../utils/ngonNgu'
import { HopKhoiDongLai } from '../components/chung/HopKhoiDongLai'
import { dongBoGiaoDienNative } from '../utils/nativeApp'
import { GiaoDienContext, type CheDoHeThong, type GiaoDienNguCanh, type KieuThongBao } from './giaoDienContext'
import { t } from '../utils/ngonNgu'

const KHOA_THEME = 'qlct-theme'
const KHOA_CHE_DO = 'qlct-che-do-he-thong'
const KHOA_AN_SO = 'qlct-an-so-du'
const KHOA_GIAM_CHUYEN_DONG = 'qlct-giam-chuyen-dong'
const KHOA_CHUYEN_DONG_HOA_TIET = 'qlct-chuyen-dong-hoa-tiet'
const KHOA_YEU_THICH = 'qlct-chu-de-yeu-thich'

let demToast = 0

interface ToastItem {
  id: number
  noiDung: string
  kieu: KieuThongBao
}

function docTheme(): ThemeId {
  const luu = localStorage.getItem(KHOA_THEME)
  if (luu && DANH_SACH_CHU_DE.some((c) => c.id === luu)) return luu as ThemeId
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dem'
  return 'ngoc'
}

function docYeuThich(): ThemeId[] {
  try {
    const raw = localStorage.getItem(KHOA_YEU_THICH)
    if (!raw) return ['ngoc', 'hoa-tim', 'dem', 'bien']
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ThemeId[]
  } catch {
    // fallback
  }
  return ['ngoc', 'hoa-tim', 'dem', 'bien']
}

export function GiaoDienProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(docTheme)
  const [themeXemThu, setThemeXemThu] = useState<ThemeId | null>(null)
  const [cheDoHeThong, setCheDoHeThong] = useState<CheDoHeThong>(() => {
    const luu = localStorage.getItem(KHOA_CHE_DO)
    return luu === 'sang' || luu === 'toi' || luu === 'he-thong' ? (luu as CheDoHeThong) : 'he-thong'
  })
  const [giamChuyenDong, setGiamChuyenDong] = useState(() => localStorage.getItem(KHOA_GIAM_CHUYEN_DONG) === 'true')
  const [chuyenDongHoaTiet, setChuyenDongHoaTiet] = useState(() => localStorage.getItem(KHOA_CHUYEN_DONG_HOA_TIET) !== 'false')
  const [danhSachYeuThich, setDanhSachYeuThich] = useState<ThemeId[]>(docYeuThich)
  const [anSoDu, setAnSoDu] = useState(() => localStorage.getItem(KHOA_AN_SO) === 'true')
  const [ngonNgu, setNgonNgu] = useState<NgonNgu>(docNgonNguDaChon)
  const [moHopKhoiDong, setMoHopKhoiDong] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Chủ đề thực tế đang áp dụng lên màn hình (ưu tiên xem thử nếu đang có)
  const themeHienTai = themeXemThu ?? theme
  const chuDeHienTai = DANH_SACH_CHU_DE.find((x) => x.id === themeHienTai)
  const toi = chuDeHienTai?.cheDo === 'toi'

  // Gắn theme lên document trong layout effect để tránh mutation trực tiếp
  useLayoutEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = themeHienTai
      document.documentElement.dataset.themeMode = toi ? 'dark' : 'light'
      document.documentElement.dataset.hideMoney = anSoDu ? 'true' : 'false'
      document.documentElement.dataset.reducedMotion = giamChuyenDong ? 'true' : 'false'
      document.documentElement.dataset.themeMotion = chuyenDongHoaTiet && !giamChuyenDong ? 'true' : 'false'
      document.documentElement.lang = ngonNguHienTai
    }
    dongBoGiaoDienNative(chuDeHienTai?.mauNen ?? '#f1f6f3', toi)
  }, [themeHienTai, toi, anSoDu, giamChuyenDong, chuyenDongHoaTiet, chuDeHienTai])

  useEffect(() => {
    localStorage.setItem(KHOA_THEME, theme)
    localStorage.setItem(KHOA_CHE_DO, cheDoHeThong)
    localStorage.setItem(KHOA_AN_SO, String(anSoDu))
    localStorage.setItem(KHOA_GIAM_CHUYEN_DONG, String(giamChuyenDong))
    localStorage.setItem(KHOA_CHUYEN_DONG_HOA_TIET, String(chuyenDongHoaTiet))
    localStorage.setItem(KHOA_YEU_THICH, JSON.stringify(danhSachYeuThich))
  }, [theme, cheDoHeThong, anSoDu, giamChuyenDong, chuyenDongHoaTiet, danhSachYeuThich])

  // Lắng nghe thay đổi theme hệ thống nếu chọn 'he-thong'
  useEffect(() => {
    if (cheDoHeThong !== 'he-thong' || typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dem' : 'ngoc')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [cheDoHeThong])

  const thongBao = useCallback((noiDung: string, kieu: KieuThongBao = 'ok') => {
    const id = ++demToast
    setToasts((t) => [...t.slice(-2), { id, noiDung, kieu }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const doiChuDe = useCallback((id: ThemeId) => {
    setTheme(id)
    setThemeXemThu(null)
  }, [])

  const doiGiaoDien = useCallback(() => {
    const cap: Record<ThemeId, ThemeId> = {
      ngoc: 'dem',
      dem: 'ngoc',
      bien: 'dai-duong',
      'dai-duong': 'bien',
      'hoa-tim': 'thach-anh',
      'thach-anh': 'hoa-tim',
      'phu-dung': 'hoa-hong',
      'hoa-hong': 'phu-dung',
      kem: 'ho-phach',
      'ho-phach': 'kem',
      troi: 'dai-duong',
      la: 'rung-dem',
      'rung-dem': 'la',
      thu: 'ho-phach',
      than: 'bien',
    }
    const target = cap[theme] ?? (toi ? 'ngoc' : 'dem')
    setTheme(target)
    setThemeXemThu(null)
  }, [theme, toi])

  const doiCheDoHeThong = useCallback(
    (cheDo: CheDoHeThong) => {
      setCheDoHeThong(cheDo)
      if (cheDo === 'sang') {
        if (toi) {
          doiGiaoDien()
        }
      } else if (cheDo === 'toi') {
        if (!toi) {
          doiGiaoDien()
        }
      } else if (cheDo === 'he-thong') {
        const isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
        setTheme(isDark ? 'dem' : 'ngoc')
      }
    },
    [toi, doiGiaoDien],
  )

  const doiGiamChuyenDong = useCallback(() => {
    setGiamChuyenDong((v) => !v)
  }, [])

  const doiChuyenDongHoaTiet = useCallback(() => {
    setChuyenDongHoaTiet((v) => !v)
  }, [])

  const toggleYeuThich = useCallback((id: ThemeId) => {
    setDanhSachYeuThich((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const xemThuTheme = useCallback((id: ThemeId) => {
    setThemeXemThu(id)
  }, [])

  const apDungThemeXemThu = useCallback(() => {
    if (themeXemThu) {
      setTheme(themeXemThu)
      setThemeXemThu(null)
      thongBao(t('Đã áp dụng chủ đề mới thành công!'), 'ok')
    }
  }, [themeXemThu, thongBao])

  const huyThemeXemThu = useCallback(() => {
    setThemeXemThu(null)
    thongBao(t('Đã hủy xem thử chủ đề'), 'thongtin')
  }, [thongBao])

  const doiAnSoDu = useCallback(() => setAnSoDu((v) => !v), [])

  /** Lưu ngôn ngữ mới; chỉ áp dụng sau khi khởi động lại nên hiện hộp nhắc. */
  const doiNgonNgu = useCallback((value: NgonNgu) => {
    luuNgonNgu(value)
    setNgonNgu(value)
    setMoHopKhoiDong(value !== ngonNguHienTai)
  }, [])

  const khoiDongLaiUngDung = useCallback(() => {
    window.location.reload()
  }, [])

  const value = useMemo<GiaoDienNguCanh>(
    () => ({
      theme: themeHienTai,
      doiChuDe,
      toi,
      doiGiaoDien,
      cheDoHeThong,
      doiCheDoHeThong,
      giamChuyenDong,
      doiGiamChuyenDong,
      chuyenDongHoaTiet,
      doiChuyenDongHoaTiet,
      danhSachYeuThich,
      toggleYeuThich,
      themeXemThu,
      xemThuTheme,
      apDungThemeXemThu,
      huyThemeXemThu,
      anSoDu,
      doiAnSoDu,
      ngonNgu,
      ngonNguDangDung: ngonNguHienTai,
      doiNgonNgu,
      khoiDongLaiUngDung,
      thongBao,
    }),
    [
      themeHienTai,
      doiChuDe,
      toi,
      doiGiaoDien,
      cheDoHeThong,
      doiCheDoHeThong,
      giamChuyenDong,
      doiGiamChuyenDong,
      chuyenDongHoaTiet,
      doiChuyenDongHoaTiet,
      danhSachYeuThich,
      toggleYeuThich,
      themeXemThu,
      xemThuTheme,
      apDungThemeXemThu,
      huyThemeXemThu,
      anSoDu,
      doiAnSoDu,
      ngonNgu,
      doiNgonNgu,
      khoiDongLaiUngDung,
      thongBao,
    ],
  )

  return (
    <GiaoDienContext.Provider value={value}>
      {children}
      <HopKhoiDongLai
        mo={moHopKhoiDong}
        ngonNguMoi={ngonNgu}
        deSau={() => setMoHopKhoiDong(false)}
        khoiDongLai={khoiDongLaiUngDung}
      />
      <div className="toast-vung" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.kieu}`}>
            {t.noiDung}
          </div>
        ))}
      </div>
    </GiaoDienContext.Provider>
  )
}
