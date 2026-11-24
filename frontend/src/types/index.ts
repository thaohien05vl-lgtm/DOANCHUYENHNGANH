export type LoaiGiaoDich = 'thu' | 'chi'
export type LoaiVi = 'tien-mat' | 'ngan-hang' | 'vi-dien-tu'
export type DinhKy = 'ngay' | 'tuan' | 'thang'

export interface Vi {
  id: string
  ten: string
  loai: LoaiVi
  soDuBanDau: number
  mau: string
}

export interface DanhMuc {
  id: string
  ten: string
  loai: LoaiGiaoDich
  bieuTuong: string
  mau: string
}

export interface GiaoDich {
  id: string
  loai: LoaiGiaoDich
  soTien: number
  maDanhMuc: string
  maVi: string
  ngay: string // YYYY-MM-DD
  ghiChu: string
  dinhKy?: DinhKy | null
}

export interface NganSach {
  id: string
  maDanhMuc: string
  hanMuc: number // hạn mức theo tháng
  kyNganSach?: string // YYYY-MM
  thang?: number // 1 - 12
  nam?: number // YYYY
}

export interface MucTieu {
  id: string
  ten: string
  soTienMucTieu: number
  daTietKiem: number
  han: string // YYYY-MM-DD
  mau: string
  nguongCanhBao?: number // Ngưỡng cảnh báo %, mặc định 80%
}

export interface LichSuNapMucTieu {
  id: string
  goalId: string
  walletId: string
  walletName: string
  amount: number
  savedAmountAfter: number
  note?: string
  createdAt: string
}

export interface DuLieu {
  vi: Vi[]
  danhMuc: DanhMuc[]
  giaoDich: GiaoDich[]
  nganSach: NganSach[]
  mucTieu: MucTieu[]
}

export interface NguoiDung {
  ten: string
  email: string
  anhDaiDien?: string | null
  ngaySinh?: string | null
}

export interface ThongBao {
  id: string
  transactionId?: string | null
  type: string
  title: string
  content: string
  read: boolean
  createdAt: string
  amount?: number | null
  categoryName?: string | null
  walletName?: string | null
  metadata?: string | null
}
