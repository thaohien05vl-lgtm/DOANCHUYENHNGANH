import { createContext } from 'react'
import type { NguoiDung } from '../types'

export interface XacThucNguCanh {
  nguoiDung: NguoiDung | null
  dangNhap: (email: string, matKhau: string) => Promise<void>
  dangNhapOAuth: (provider: 'google' | 'facebook', token: string) => Promise<void>
  dangKy: (ten: string, email: string, matKhau: string) => Promise<void>
  capNhatHoSo: (nd: NguoiDung) => Promise<void>
  dangXuat: () => void
}
export const XacThucContext = createContext<XacThucNguCanh | null>(null)
