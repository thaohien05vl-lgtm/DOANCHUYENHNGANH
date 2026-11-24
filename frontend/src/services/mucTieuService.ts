import { api } from './api'
import type { GiaoDich, LichSuNapMucTieu, MucTieu } from '../types'
import { t } from '../utils/ngonNgu'

export interface NapTienResponse {
  mucTieu: MucTieu
  giaoDich: GiaoDich
  dongGop: LichSuNapMucTieu
  thongDiep: string
  datNguong: boolean
}

function xuLyLoi(error: unknown, macDinh: string): Error {
  const loi = error as { response?: { data?: { message?: string } }; message?: string }
  return new Error(loi.response?.data?.message || loi.message || macDinh)
}

/**
 * Nạp tiền từ ví vào mục tiêu tiết kiệm (Ghi nhận giao dịch + Cập nhật số dư + Kiểm tra ngưỡng).
 */
export async function napTienMucTieuApi(
  goalId: string,
  soTien: number,
  maVi: string,
  ghiChu?: string,
): Promise<NapTienResponse> {
  try {
    const res = await api.post<NapTienResponse>(`/api/muc-tieu/${goalId}/nap-tien`, {
      soTien,
      maVi,
      ghiChu: ghiChu?.trim() || '',
    })
    return res.data
  } catch (err) {
    throw xuLyLoi(err, t('Không thể nạp tiền vào mục tiêu. Vui lòng thử lại.'))
  }
}

/**
 * Lấy danh sách lịch sử đóng góp nạp tiền của một mục tiêu cụ thể.
 */
export async function layLichSuNapMucTieuApi(goalId: string): Promise<LichSuNapMucTieu[]> {
  try {
    const res = await api.get<LichSuNapMucTieu[]>(`/api/muc-tieu/${goalId}/lich-su`)
    return res.data
  } catch (err) {
    throw xuLyLoi(err, t('Không thể tải lịch sử nạp tiền mục tiêu.'))
  }
}

/**
 * Cập nhật ngưỡng cảnh báo phần trăm cho mục tiêu.
 */
export async function capNhatNguongMucTieuApi(goalId: string, nguong: number): Promise<MucTieu> {
  try {
    const res = await api.put<MucTieu>(`/api/muc-tieu/${goalId}/nguong`, { nguong })
    return res.data
  } catch (err) {
    throw xuLyLoi(err, t('Không thể cập nhật ngưỡng cảnh báo.'))
  }
}
