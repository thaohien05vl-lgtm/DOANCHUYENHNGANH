import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Font đóng gói sẵn trong app (không phụ thuộc mạng, tải nhanh hơn trên điện thoại)
import '@fontsource/be-vietnam-pro/latin-400.css'
import '@fontsource/be-vietnam-pro/latin-500.css'
import '@fontsource/be-vietnam-pro/latin-600.css'
import '@fontsource/be-vietnam-pro/latin-700.css'
import '@fontsource/be-vietnam-pro/latin-800.css'
import '@fontsource/be-vietnam-pro/latin-ext-400.css'
import '@fontsource/be-vietnam-pro/latin-ext-600.css'
import '@fontsource/be-vietnam-pro/latin-ext-700.css'
import '@fontsource/be-vietnam-pro/vietnamese-400.css'
import '@fontsource/be-vietnam-pro/vietnamese-500.css'
import '@fontsource/be-vietnam-pro/vietnamese-600.css'
import '@fontsource/be-vietnam-pro/vietnamese-700.css'
import '@fontsource/be-vietnam-pro/vietnamese-800.css'
import './index.css'
import App from './App.tsx'
import { anSplashNative } from './utils/nativeApp'
import { khoiDongOAuthNative } from './utils/oauthClient'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/** Giữ màn hình khởi động đủ lâu để hoạt ảnh chạy trọn (tối thiểu ~1,5 s kể từ lúc mở app), rồi mờ dần. */
function ketThucManHinhKhoiDong() {
  const boot = document.getElementById('boot')
  anSplashNative()
  khoiDongOAuthNative()
  if (!boot) return
  const giamChuyenDong = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const toiThieu = giamChuyenDong ? 150 : 1500
  const doi = Math.max(0, toiThieu - performance.now())
  window.setTimeout(() => {
    boot.classList.add('boot-out')
    window.setTimeout(() => boot.remove(), 420)
  }, doi)
}

requestAnimationFrame(() => requestAnimationFrame(ketThucManHinhKhoiDong))
