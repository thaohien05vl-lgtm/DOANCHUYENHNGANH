import axios from 'axios'
import { Capacitor } from '@capacitor/core'
import { t } from '../utils/ngonNgu'

const KHOA_MAY_CHU = 'finora-server-url'

/** Địa chỉ máy chủ do người dùng đặt trong app (ghi đè cấu hình lúc build). */
export function docDiaChiMayChuTuyChinh(): string {
  try {
    return localStorage.getItem(KHOA_MAY_CHU) ?? ''
  } catch {
    return ''
  }
}

export function datDiaChiMayChu(url: string): void {
  const sach = url.trim().replace(/\/+$/, '')
  try {
    if (sach) localStorage.setItem(KHOA_MAY_CHU, sach)
    else localStorage.removeItem(KHOA_MAY_CHU)
  } catch {
    /* bỏ qua */
  }
  api.defaults.baseURL = resolveBaseUrl()
}

export function diaChiMayChuHienTai(): string {
  return resolveBaseUrl()
}

function resolveBaseUrl(): string {
  const tuyChinh = docDiaChiMayChuTuyChinh()
  if (/^https?:\/\//i.test(tuyChinh)) return tuyChinh
  const configured = import.meta.env.VITE_API_URL
  const lanIp = import.meta.env.VITE_LAN_IP // IP LAN máy tính, dùng khi test điện thoại thật

  if (Capacitor.isNativePlatform()) {
    // Nếu có IP LAN riêng cho điện thoại thật → ưu tiên dùng
    if (lanIp && !lanIp.startsWith('YOUR_')) {
      return `http://${lanIp}:8080`
    }
    // Máy ảo Android Studio: 10.0.2.2 trỏ về máy tính host
    if (!configured || configured.includes('localhost') || configured.includes('127.0.0.1')) {
      return configured ? configured.replace(/localhost|127\.0\.0\.1/, '10.0.2.2') : 'http://10.0.2.2:8080'
    }
  }
  return configured ?? 'http://localhost:8080'
}

/** Axios dùng chung. API root là backend Spring Boot, JWT được gắn tự động. */
export const api = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qlct-token')
  // Cho phép một số tác vụ trong hàng đợi giữ token của đúng phiên đã tạo request.
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Dịch thông điệp lỗi (tiếng Việt từ backend / lỗi mạng) sang ngôn ngữ đang dùng.
    const data = error.response?.data
    if (data && typeof data.message === 'string') data.message = t(data.message)
    else if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) error.message = t('Network Error')
    if (error.response?.status === 401) {
      localStorage.removeItem('qlct-token')
      localStorage.removeItem('qlct-nguoi-dung')
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('finora:unauthorized'))
    }
    return Promise.reject(error)
  },
)
