import { createContext } from 'react'
import type { DuLieu } from '../types'

export type KhoaDuLieu = keyof DuLieu
export type PhanTu<K extends KhoaDuLieu> = DuLieu[K][number]
export type BanGhiMoi<K extends KhoaDuLieu> = Omit<PhanTu<K>, 'id'> & { id?: string }

export interface DuLieuNguCanh extends DuLieu {
  luu: <K extends KhoaDuLieu>(khoa: K, muc: BanGhiMoi<K>) => void
  /** Trả về thông báo lỗi nếu không xoá được (ví dụ danh mục đang có giao dịch) */
  xoa: (khoa: KhoaDuLieu, id: string) => string | null
  datLaiMau: () => void
}

export const DuLieuContext = createContext<DuLieuNguCanh | null>(null)
