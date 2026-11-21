/**
 * ChartCanvas.tsx
 *
 * Component quản lý Canvas và vòng đời Chart.js chuyên nghiệp, chuẩn mực:
 * 1. Quản lý Canvas bằng canvasRef và Chart instance bằng chartRef (useRef).
 * 2. Mỗi Canvas chỉ thuộc về MỘT Chart instance duy nhất.
 * 3. Tự động kiểm tra và giải phóng Chart.getChart(canvas) trước khi tạo instance mới,
 *    loại bỏ TRIỆT ĐỂ lỗi "Canvas is already in use".
 * 4. Phân biệt rạch ròi Khởi tạo và Cập nhật:
 *    - Khởi tạo: chỉ khi Canvas được mount lần đầu hoặc type đổi.
 *    - Cập nhật: khi data / options đổi -> cập nhật chart.data / chart.options và gọi chart.update().
 *      Tuyệt đối KHÔNG hủy và tạo lại instance.
 * 5. Cleanup bắt buộc khi component unmount: gọi chart.destroy(), giải phóng bộ nhớ.
 * 6. Tương thích hoàn hảo với React 19 StrictMode và Vite Fast Refresh (HMR).
 */
import { useEffect, useRef } from 'react'
import {
  Chart,
  type ChartType,
  type ChartData,
  type ChartOptions,
  type Plugin,
} from 'chart.js'
import '../../utils/chartSetup'

export interface ChartCanvasProps<TType extends ChartType = ChartType> {
  type: TType
  data: ChartData<TType>
  options?: ChartOptions<TType>
  plugins?: Plugin<TType>[]
  className?: string
  style?: React.CSSProperties
  id?: string
}

export function ChartCanvas<TType extends ChartType = ChartType>({
  type,
  data,
  options,
  plugins,
  className,
  style,
  id,
}: ChartCanvasProps<TType>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const chartRef = useRef<Chart<TType> | null>(null)

  // ============================================================
  // 1. KHỞI TẠO VÀ HỦY (VÒNG ĐỜI CHUẨN MỰC)
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Bước 1: Kiểm tra xem Canvas này có đang bị Chart instance nào chiếm dụng không.
    // Nếu có (do StrictMode, HMR hoặc chuyển tab nhanh), lập tức giải phóng trước.
    const existingChart = Chart.getChart(canvas)
    if (existingChart) {
      try {
        existingChart.destroy()
      } catch (err) {
        console.warn('[ChartCanvas] Lỗi khi giải phóng instance cũ:', err)
      }
    }

    // Bước 2: Khởi tạo Chart instance mới duy nhất
    try {
      chartRef.current = new Chart(canvas, {
        type,
        data,
        options,
        plugins,
      })
    } catch (err) {
      console.error('[ChartCanvas] Lỗi khi khởi tạo Chart:', err)
    }

    // Bước 3: Cleanup bắt buộc khi component unmount hoặc type thay đổi
    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy()
        } catch {
          // Bỏ qua lỗi trong quá trình unmount
        }
        chartRef.current = null
      }

      // Kiểm tra lần cuối trên canvas DOM để đảm bảo không sót instance nào
      if (canvas) {
        const remaining = Chart.getChart(canvas)
        if (remaining) {
          try {
            remaining.destroy()
          } catch {
            // an toan
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, plugins])

  // ============================================================
  // 2. CẬP NHẬT BIỂU ĐỒ (KHÔNG TẠO LẠI INSTANCE)
  // ============================================================
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    // Cập nhật dữ liệu
    chart.data = data

    // Cập nhật cấu hình options nếu có (gán trực tiếp, không spread Resolver Proxy)
    if (options) {
      chart.options = options
    }

    // Cập nhật hiển thị mượt mà không nhấp nháy, không tạo mới instance
    chart.update()
  }, [data, options])

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
    />
  )
}
