import { Capacitor } from '@capacitor/core'

/** Đồng bộ thanh trạng thái hệ thống với chủ đề đang chọn (chỉ chạy trên app Android). */
export function dongBoGiaoDienNative(mauNen: string, toi: boolean): void {
  if (!Capacitor.isNativePlatform()) return
  void import('@capacitor/status-bar')
    .then(({ StatusBar, Style }) => {
      // Style.Dark = chữ sáng (dùng cho nền tối)
      void StatusBar.setStyle({ style: toi ? Style.Dark : Style.Light })
      void StatusBar.setBackgroundColor({ color: mauNen })
    })
    .catch(() => undefined)
}

/** Ẩn splash gốc của Android: màn hình khởi động động (HTML) đã sẵn sàng phía sau với cùng màu nền. */
export function anSplashNative(): void {
  if (!Capacitor.isNativePlatform()) return
  void import('@capacitor/splash-screen')
    .then(({ SplashScreen }) => SplashScreen.hide({ fadeOutDuration: 150 }))
    .catch(() => undefined)
}
