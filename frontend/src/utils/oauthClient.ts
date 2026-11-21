/**
 * Đăng nhập Google / Facebook cho Finora.
 *
 * VÌ SAO TRƯỚC ĐÂY LỖI TRÊN ĐIỆN THOẠI NHƯNG CHẠY TỐT TRÊN localhost?
 *  - Trên máy tính, SDK web (popup) chạy trong trình duyệt thật tại http://localhost → Google/Facebook chấp nhận.
 *  - Trong app Android (Capacitor WebView) Google chặn OAuth trong WebView nhúng (disallowed_useragent) và
 *    popup/postMessage của SDK web không hoạt động. Mở bằng Chrome trên điện thoại qua http://192.168.x.x
 *    cũng bị từ chối vì Google/Facebook chỉ cho phép HTTPS hoặc localhost.
 *
 * CÁCH SỬA: trên app (native) dùng SDK gốc của Android qua plugin @capgo/capacitor-social-login
 *  - Google: Credential Manager → trả về ID token (JWT), backend xác minh.
 *  - Facebook: Facebook SDK Android → trả về access token, backend xác minh.
 * Trên web vẫn dùng popup như cũ, nhưng báo lỗi rõ ràng nếu trang không an toàn (http + IP).
 */
import { Capacitor } from '@capacitor/core'
import { t } from './ngonNgu'

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: { access_token?: string; error?: string }) => void
            error_callback?: (err: { type?: string }) => void
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void
          }
        }
      }
    }
    FB?: {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void
      login: (
        callback: (response: { authResponse?: { accessToken: string } | null; status: string }) => void,
        options?: { scope: string },
      ) => void
    }
    fbAsyncInit?: () => void
  }
}

export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
export const FACEBOOK_APP_ID = (import.meta.env.VITE_FACEBOOK_APP_ID || '').trim()
const FACEBOOK_CLIENT_TOKEN = (import.meta.env.VITE_FACEBOOK_CLIENT_TOKEN || '').trim()

export const laApp = (): boolean => Capacitor.isNativePlatform()

export function coGoogleClientId(): boolean {
  return Boolean(GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.startsWith('YOUR_'))
}

export function coFacebookAppId(): boolean {
  return Boolean(FACEBOOK_APP_ID && !FACEBOOK_APP_ID.startsWith('YOUR_'))
}

export interface KetQuaOAuth {
  thanhCong: boolean
  /** ID token (Google native) hoặc access token */
  token?: string
  loi?: string
  chuaCauHinh?: boolean
  daHuy?: boolean
}

/* ---------------------------------------------------------------------------
 * Trang web chạy trên địa chỉ không an toàn (http + IP LAN)?
 * ------------------------------------------------------------------------- */
function trangKhongAnToan(): boolean {
  if (laApp()) return false
  const { protocol, hostname } = window.location
  if (protocol === 'https:') return false
  return !(hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]')
}

const THONG_BAO_KHONG_AN_TOAN = () =>
  t('Google/Facebook chỉ cho phép đăng nhập trên HTTPS hoặc localhost. Hãy cài ứng dụng Finora (APK) hoặc mở trang bằng địa chỉ https.')

/* ---------------------------------------------------------------------------
 * NATIVE (Android) — Capacitor Social Login
 * ------------------------------------------------------------------------- */
let khoiTaoNative: Promise<void> | null = null

async function laySocialLogin() {
  const mod = await import('@capgo/capacitor-social-login')
  return mod.SocialLogin
}

function khoiTaoSocialLogin(): Promise<void> {
  if (!khoiTaoNative) {
    khoiTaoNative = (async () => {
      const SocialLogin = await laySocialLogin()
      const cauHinh: Parameters<typeof SocialLogin.initialize>[0] = {}
      if (coGoogleClientId()) cauHinh.google = { webClientId: GOOGLE_CLIENT_ID, mode: 'online' }
      if (coFacebookAppId() && FACEBOOK_CLIENT_TOKEN) {
        cauHinh.facebook = { appId: FACEBOOK_APP_ID, clientToken: FACEBOOK_CLIENT_TOKEN }
      }
      await SocialLogin.initialize(cauHinh)
    })().catch((err) => {
      khoiTaoNative = null // cho phép thử lại lần sau
      throw err
    })
  }
  return khoiTaoNative
}

/** Gọi sớm khi mở app để lần bấm đầu tiên không bị chậm. Không ném lỗi. */
export function khoiDongOAuthNative(): void {
  if (!laApp()) return
  khoiTaoSocialLogin().catch(() => undefined)
}

function moTaLoiNative(err: unknown, nhaCungCap: 'Google' | 'Facebook'): KetQuaOAuth {
  const e = err as { message?: string; code?: string }
  const msg = `${e?.message ?? ''} ${e?.code ?? ''}`
  const thap = msg.toLowerCase()
  if (thap.includes('cancel') || thap.includes('user_cancelled') || thap.includes('hủy')) {
    return { thanhCong: false, daHuy: true, loi: t('Bạn đã hủy đăng nhập.') }
  }
  if (nhaCungCap === 'Google') {
    if (thap.includes('28444') || thap.includes('developer console') || thap.includes('10:') || thap.includes('12500')) {
      return {
        thanhCong: false,
        loi: t('Google chưa nhận diện ứng dụng này: kiểm tra SHA-1 và package name (com.finora.app) trong Google Cloud Console.'),
      }
    }
    if (thap.includes('nocredential') || thap.includes('no credential') || thap.includes('no google account')) {
      return { thanhCong: false, loi: t('Điện thoại chưa đăng nhập tài khoản Google nào. Hãy thêm tài khoản trong Cài đặt rồi thử lại.') }
    }
  }
  if (thap.includes('network') || thap.includes('timeout') || thap.includes('unable to resolve')) {
    return { thanhCong: false, loi: t('Không có kết nối mạng. Vui lòng kiểm tra Wi-Fi/4G rồi thử lại.') }
  }
  return {
    thanhCong: false,
    loi: t('Đăng nhập {0} thất bại: {1}', [nhaCungCap, (e?.message || '').slice(0, 140) || t('Lỗi không xác định.')]),
  }
}

async function googleNative(): Promise<KetQuaOAuth> {
  try {
    await khoiTaoSocialLogin()
    const SocialLogin = await laySocialLogin()
    const res = await SocialLogin.login({ provider: 'google', options: {} })
    const r = res.result
    if (r.responseType === 'online' && r.idToken) return { thanhCong: true, token: r.idToken }
    return { thanhCong: false, loi: t('Không nhận được token từ Google.') }
  } catch (err) {
    return moTaLoiNative(err, 'Google')
  }
}

async function facebookNative(): Promise<KetQuaOAuth> {
  if (!FACEBOOK_CLIENT_TOKEN) {
    return {
      thanhCong: false,
      chuaCauHinh: true,
      loi: t('Thiếu VITE_FACEBOOK_CLIENT_TOKEN trong frontend/.env (Meta for Developers → App settings → Advanced → Client token).'),
    }
  }
  try {
    await khoiTaoSocialLogin()
    const SocialLogin = await laySocialLogin()
    const res = await SocialLogin.login({ provider: 'facebook', options: { permissions: ['email', 'public_profile'] } })
    const token = res.result.accessToken?.token
    if (token) return { thanhCong: true, token }
    return { thanhCong: false, loi: t('Không nhận được token từ Facebook.') }
  } catch (err) {
    return moTaLoiNative(err, 'Facebook')
  }
}

/* ---------------------------------------------------------------------------
 * WEB — popup SDK (chạy trên localhost hoặc https)
 * ------------------------------------------------------------------------- */
function napScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cu = document.getElementById(id) as HTMLScriptElement | null
    if (cu?.dataset.daNap === '1') return resolve()
    cu?.remove() // lần trước nạp lỗi → nạp lại
    const script = document.createElement('script')
    script.id = id
    script.src = src
    script.async = true
    script.onload = () => {
      script.dataset.daNap = '1'
      resolve()
    }
    script.onerror = () => {
      script.remove()
      reject(new Error(t('Không thể tải dịch vụ đăng nhập. Hãy kiểm tra kết nối mạng.')))
    }
    document.body.appendChild(script)
  })
}

async function googleWeb(): Promise<KetQuaOAuth> {
  try {
    await napScript('https://accounts.google.com/gsi/client', 'google-gsi-client')
    if (!window.google?.accounts?.oauth2) return { thanhCong: false, loi: t('Google Identity Services không sẵn sàng.') }
    return await new Promise<KetQuaOAuth>((resolve) => {
      try {
        const client = window.google!.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'email profile openid',
          callback: (res) => {
            if (res.error) resolve({ thanhCong: false, loi: t('Google: {0}', [res.error]) })
            else if (res.access_token) resolve({ thanhCong: true, token: res.access_token })
            else resolve({ thanhCong: false, loi: t('Không nhận được token từ Google.') })
          },
          error_callback: (err) => {
            if (err?.type === 'popup_failed_to_open') {
              resolve({ thanhCong: false, loi: t('Trình duyệt đã chặn cửa sổ đăng nhập. Hãy cho phép popup rồi thử lại.') })
            } else {
              resolve({ thanhCong: false, daHuy: true, loi: t('Bạn đã đóng cửa sổ đăng nhập Google.') })
            }
          },
        })
        client.requestAccessToken({ prompt: 'select_account' })
      } catch (err) {
        resolve({ thanhCong: false, loi: err instanceof Error ? err.message : t('Lỗi khi khởi tạo đăng nhập Google.') })
      }
    })
  } catch (err) {
    return { thanhCong: false, loi: err instanceof Error ? err.message : t('Không thể kết nối dịch vụ Google.') }
  }
}

async function facebookWeb(): Promise<KetQuaOAuth> {
  try {
    await napScript('https://connect.facebook.net/vi_VN/sdk.js', 'facebook-jssdk')
    if (!window.FB) return { thanhCong: false, loi: t('Facebook SDK không sẵn sàng.') }
    window.FB.init({ appId: FACEBOOK_APP_ID, cookie: true, xfbml: false, version: 'v21.0' })
    return await new Promise<KetQuaOAuth>((resolve) => {
      try {
        window.FB!.login(
          (response) => {
            if (response.authResponse?.accessToken) resolve({ thanhCong: true, token: response.authResponse.accessToken })
            else resolve({ thanhCong: false, daHuy: true, loi: t('Bạn đã hủy đăng nhập Facebook.') })
          },
          { scope: 'public_profile,email' },
        )
      } catch (err) {
        resolve({ thanhCong: false, loi: err instanceof Error ? err.message : t('Lỗi khi mở cửa sổ đăng nhập Facebook.') })
      }
    })
  } catch (err) {
    return { thanhCong: false, loi: err instanceof Error ? err.message : t('Không thể kết nối dịch vụ Facebook.') }
  }
}

/* ---------------------------------------------------------------------------
 * API dùng chung cho giao diện
 * ------------------------------------------------------------------------- */
export async function dangNhapGoogle(): Promise<KetQuaOAuth> {
  if (!coGoogleClientId()) {
    return { thanhCong: false, chuaCauHinh: true, loi: t('Chưa cấu hình Google Client ID trong frontend/.env (VITE_GOOGLE_CLIENT_ID).') }
  }
  if (trangKhongAnToan()) return { thanhCong: false, loi: THONG_BAO_KHONG_AN_TOAN() }
  return laApp() ? googleNative() : googleWeb()
}

export async function dangNhapFacebook(): Promise<KetQuaOAuth> {
  if (!coFacebookAppId()) {
    return { thanhCong: false, chuaCauHinh: true, loi: t('Chưa cấu hình Facebook App ID trong frontend/.env (VITE_FACEBOOK_APP_ID).') }
  }
  if (trangKhongAnToan()) return { thanhCong: false, loi: THONG_BAO_KHONG_AN_TOAN() }
  return laApp() ? facebookNative() : facebookWeb()
}
