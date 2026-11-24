import type { NguoiDung } from '../types'
import { api, diaChiMayChuHienTai } from './api'
import { t } from '../utils/ngonNgu'

interface AuthResponse {
  token: string
  nguoiDung: NguoiDung
}

export interface GuiOtpResponse {
  thanhCong: boolean
  thongDiep: string
  thoiGianChoGiay: number
}

export interface GuiOtpDangNhapResponse {
  yeuCauOtp: boolean
  email: string
  token?: string | null
  nguoiDung?: NguoiDung | null
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

export async function dangKyApi(ten: string, email: string, matKhau: string): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/api/xac-thuc/dang-ky', { ten, email, matKhau })
    // Không tự động lưu token vào localStorage để người dùng quay về đăng nhập
    return response.data
  } catch (error) {
    throw thongBaoLoi(error, t('Không thể tạo tài khoản. Vui lòng thử lại.'))
  }
}

export async function guiOtpDangKyApi(ten: string, email: string): Promise<GuiOtpResponse> {
  try {
    const response = await api.post<GuiOtpResponse>('/api/xac-thuc/gui-otp-dang-ky', { ten, email })
    return response.data
  } catch (error) {
    throw thongBaoLoi(error, t('Không thể gửi mã xác thực đăng ký. Vui lòng thử lại.'))
  }
}

export async function xacNhanDangKyApi(
  ten: string,
  email: string,
  matKhau: string,
  otp: string,
): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/api/xac-thuc/xac-nhan-dang-ky', {
      ten,
      email,
      matKhau,
      otp,
    })
    return response.data
  } catch (error) {
    throw thongBaoLoi(error, t('Mã xác thực không chính xác hoặc đã hết hạn.'))
  }
}

export async function guiOtpDangNhapApi(email: string, matKhau: string): Promise<GuiOtpDangNhapResponse> {
  try {
    const response = await api.post<GuiOtpDangNhapResponse>('/api/xac-thuc/gui-otp-dang-nhap', { email, matKhau })
    return response.data
  } catch (error) {
    throw thongBaoLoi(error, t('Email hoặc mật khẩu không chính xác.'))
  }
}

export async function xacNhanDangNhapApi(email: string, otp: string): Promise<NguoiDung> {
  try {
    const response = await api.post<AuthResponse>('/api/xac-thuc/xac-nhan-dang-nhap', { email, otp })
    localStorage.setItem('qlct-token', response.data.token)
    return response.data.nguoiDung
  } catch (error) {
    throw thongBaoLoi(error, t('Mã xác thực không chính xác hoặc đã hết hạn.'))
  }
}

export async function guiLaiOtpApi(email: string, loai: 'dang_ky' | 'dang_nhap'): Promise<GuiOtpResponse> {
  try {
    const response = await api.post<GuiOtpResponse>('/api/xac-thuc/gui-lai-otp', { email, loai })
    return response.data
  } catch (error) {
    throw thongBaoLoi(error, t('Không thể gửi lại mã xác thực. Vui lòng thử lại.'))
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
