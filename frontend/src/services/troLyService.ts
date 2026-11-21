import { api } from './api'

export interface TinNhanLichSu {
  vai: 'nguoi' | 'may'
  noiDung: string
  anhBase64?: string
}

export interface BocTachGiaoDichData {
  laGiaoDich: boolean
  loai?: 'chi' | 'thu' | null
  soTien?: number | null
  soTienUocLuong?: boolean
  maDanhMuc?: string | null
  tenDanhMuc?: string | null
  ngay?: string | null
  ghiChu?: string | null
  phuongThucThanhToan?: string | null
  doTinCay: number
  phanHoi: string
}

export async function hoiTroLy(
  cauHoi: string,
  lichSu: TinNhanLichSu[] = [],
  anhBase64?: string,
): Promise<string> {
  const { data } = await api.post<{ traLoi: string }>('/api/tro-ly/hoi', {
    cauHoi,
    lichSu,
    anhBase64,
  })
  return data.traLoi
}

export async function bocTachGiaoDichTuGiongNoi(noiDung: string): Promise<BocTachGiaoDichData> {
  const { data } = await api.post<BocTachGiaoDichData>('/api/tro-ly/boc-tach-giao-dich', {
    noiDung,
  })
  return data
}
