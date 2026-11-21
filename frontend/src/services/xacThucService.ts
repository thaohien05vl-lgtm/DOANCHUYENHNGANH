import type { NguoiDung } from '../types'
import { api, diaChiMayChuHienTai } from './api'
import { t } from '../utils/ngonNgu'

interface AuthResponse {
  token: string
  nguoiDung: NguoiDung
}

function thongBaoLoi(error: unknown, macDinh: string): Error {
  const loi = error as { response?: { data?: { message?: string } }; message?: string; code?: string }
  const msg = loi.message || ''
  if (loi.code === 'ECONNABORTED' || msg.toLowerCase().includes('timeout')) {
    return new Error(
      t('Hết thời gian chờ kết nối máy chủ ({0}). Hãy đảm bảo điện thoại và máy tính đang cùng kết nối Wi-Fi (tắt 4G), hoặc nhấn "Máy chủ kết nối" bên dưới.', [diaChiMayChuHienTai()])
    )
  }
  if (loi.code === 'ERR_NETWORK' || msg.toLowerCase().includes('network error')) {
    return new Error(
      t('Không thể kết nối đến máy chủ {0}. Hãy kiểm tra Wi-Fi và đảm bảo backend đang chạy.', [diaChiMayChuHienTai()])
    )
  }
  return new Error(loi.response?.data?.message || loi.message || macDinh)
}

export async function dangNhapApi(email: string, matKhau: string): Promise<NguoiDung> {
  try {
    const response = await api.post<AuthResponse>('/api/xac-thuc/dang-nhap', { email, matKhau })
    localStorage.setItem('qlct-token', response.data.token)
    return response.data.nguoiDung
  } catch (error) {
    throw thongBaoLoi(error, t('Không thể đăng nhập. Vui lòng thử lại.'))
  }
}

export async function dangKyApi(ten: string, email: string, matKhau: string): Promise<NguoiDung> {
  try {
    const response = await api.post<AuthResponse>('/api/xac-thuc/dang-ky', { ten, email, matKhau })
    localStorage.setItem('qlct-token', response.data.token)
    return response.data.nguoiDung
  } catch (error) {
    throw thongBaoLoi(error, t('Không thể tạo tài khoản. Vui lòng thử lại.'))
  }
}

export async function dangNhapOAuthApi(provider: 'google' | 'facebook', token: string): Promise<NguoiDung> {
  try {
    const response = await api.post<AuthResponse>('/api/xac-thuc/oauth', { provider, token })
    localStorage.setItem('qlct-token', response.data.token)
    return response.data.nguoiDung
  } catch (error) {
    throw thongBaoLoi(
      error,
      t('Đăng nhập {0} thất bại. Vui lòng thử lại.', [provider === 'google' ? 'Google' : 'Facebook']),
    )
  }
}

export async function quenMatKhauApi(email: string, matKhauMoi: string): Promise<void> {
  try {
    await api.post('/api/xac-thuc/quen-mat-khau', { email, matKhauMoi })
  } catch (error) {
    throw thongBaoLoi(error, t('Không thể đặt lại mật khẩu. Vui lòng kiểm tra lại email.'))
  }
}
