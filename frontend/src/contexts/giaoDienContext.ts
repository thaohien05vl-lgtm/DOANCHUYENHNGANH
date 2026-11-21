import { createContext } from 'react'
import type { ThemeId } from '../data/chuDe'
import type { NgonNgu } from '../utils/ngonNgu'

export type KieuThongBao = 'ok' | 'loi' | 'thongtin'
export type CheDoHeThong = 'sang' | 'toi' | 'he-thong'

export interface GiaoDienNguCanh {
  theme: ThemeId
  doiChuDe: (id: ThemeId) => void
  toi: boolean
  doiGiaoDien: () => void
  cheDoHeThong: CheDoHeThong
  doiCheDoHeThong: (cheDo: CheDoHeThong) => void
  giamChuyenDong: boolean
  doiGiamChuyenDong: () => void
  chuyenDongHoaTiet: boolean
  doiChuyenDongHoaTiet: () => void
  danhSachYeuThich: ThemeId[]
  toggleYeuThich: (id: ThemeId) => void
  themeXemThu: ThemeId | null
  xemThuTheme: (id: ThemeId) => void
  apDungThemeXemThu: () => void
  huyThemeXemThu: () => void
  anSoDu: boolean
  doiAnSoDu: () => void
  /** Ngôn ngữ người dùng đã chọn (có thể đang chờ khởi động lại để áp dụng). */
  ngonNgu: NgonNgu
  /** Ngôn ngữ đang hiển thị trong phiên chạy hiện tại. */
  ngonNguDangDung: NgonNgu
  doiNgonNgu: (value: NgonNgu) => void
  khoiDongLaiUngDung: () => void
  thongBao: (noiDung: string, kieu?: KieuThongBao) => void
}

export const GiaoDienContext = createContext<GiaoDienNguCanh | null>(null)
