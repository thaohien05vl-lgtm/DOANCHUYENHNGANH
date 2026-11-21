import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.finora.app',
  appName: 'Finora',
  webDir: 'dist',
  backgroundColor: '#f1f6f3',
  server: {
    // Dùng http://localhost để gọi được backend http trong mạng LAN khi dev (không bị chặn mixed-content).
    androidScheme: 'http',
    hostname: 'localhost',
  },
  android: {
    // Cho phép http tới backend LAN khi dev. Khi phát hành thật: dùng https và đặt false.
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      // Màn hình khởi động động nằm trong web (index.html); app tự ẩn splash gốc khi đã sẵn sàng.
      launchAutoHide: false,
      launchShowDuration: 0,
      backgroundColor: '#f1f6f3',
      showSpinner: false,
      androidScaleType: 'CENTER',
    },
    // Đăng nhập Google/Facebook bằng SDK gốc (Credential Manager + Facebook SDK) thay cho popup web.
    SocialLogin: {
      providers: {
        google: true,
        facebook: true,
        apple: false,
        twitter: false,
      },
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
  },
}

export default config
