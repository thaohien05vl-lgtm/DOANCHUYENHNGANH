/**
 * chartSetup.ts
 *
 * Khởi tạo Chart.js toàn cục MỘT LẦN DUY NHẤT.
 *
 * Vấn đề triệt để cần giải quyết:
 * - Vite HMR reload module này → Chart.defaults được thiết lập lại nhưng các Chart instance
 *   cũ đang gắn trên canvas DOM vẫn tồn tại trong registry của Chart.js.
 * - react-chartjs-2 cố mount chart mới trên canvas đó → "Canvas is already in use".
 *
 * Giải pháp:
 * - Khi module bị reload (HMR), destroy TOÀN BỘ chart instance còn sót lại trước.
 * - Guard tránh import 'chart.js/auto' chạy lại nhiều lần gây đăng ký controller trùng.
 */
import { Chart } from 'chart.js'
import 'chart.js/auto'

// ─── Destroy tất cả Chart instance còn tồn tại (HMR safety) ────────────────
// Chart.instances là object: { [id: string]: Chart }
// Khi HMR reload module này, canvas đang có chart cũ chưa cleanup → phải destroy trước.
function destroyAllChartInstances() {
  try {
    // Chart.js v4: Chart.instances là object (không phải Map)
    const instances = Chart.instances as Record<string, Chart>
    Object.keys(instances).forEach((key) => {
      try {
        instances[key]?.destroy()
      } catch {
        // Bỏ qua lỗi khi destroy từng instance
      }
    })
  } catch {
    // Chart.instances có thể không tồn tại trong một số build
  }
}

// Chạy cleanup ngay khi module được load (kể cả lần đầu và khi HMR reload)
destroyAllChartInstances()

// ─── Thiết lập mặc định toàn cục ────────────────────────────────────────────
Chart.defaults.font.family = "'Be Vietnam Pro', system-ui, sans-serif"
Chart.defaults.font.size = 12
// Không đặt animation.easing tùy chỉnh — để Chart.js dùng default 'easeOutQuart' an toàn
// Không đặt duration ở đây để tránh xung đột với options của từng component
// (mỗi component tự khai báo animation.duration trong options của nó)

// ─── HMR guard cho môi trường phát triển (Vite) ─────────────────────────────
// Khi Vite Hot Module Replacement reload file này, cleanup lại toàn bộ instances
// để tránh "Canvas is already in use" sau mỗi lần save file.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    destroyAllChartInstances()
  })
}
