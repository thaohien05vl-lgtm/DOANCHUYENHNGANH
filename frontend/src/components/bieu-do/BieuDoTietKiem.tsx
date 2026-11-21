/**
 * BieuDoTietKiem.tsx — Biểu đồ Tiền giữ lại mỗi tháng (Diverging Bar Chart)
 *
 * Quản lý vòng đời chuẩn mực:
 * - Sử dụng ChartCanvas với useRef (canvasRef & chartRef)
 * - Tự động giải phóng Chart.getChart(canvas) trước khi mount
 * - Cập nhật dữ liệu qua chart.update(), không hủy tạo lại instance
 * - Được bọc trong ChartErrorBoundary chuyên biệt
 *
 * Logic biểu đồ:
 * - Mốc 0 phân định rõ ràng: Thặng dư (+) vươn lên trên, Thâm hụt (-) rủ xuống dưới
 * - Đường mốc 0 luôn rõ nét, tự động căn khoảng đệm trục Y thoáng đãng
 */
import { useMemo } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import '../../utils/chartSetup'
import { ChartCanvas } from './ChartCanvas'
import { ChartErrorBoundary } from '../chung/ChartErrorBoundary'
import { dinhDangGon, dinhDangTien, nhanThang, nhanThangNgan } from '../../utils/dinhDang'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { t } from '../../utils/ngonNgu'

export interface DuLieuTienGiuLaiThang {
  thang?: string
  key?: string
  nhan?: string
  thu?: number
  chi?: number
  tienGiuLai?: number
  tietKiem?: number
}

interface Props {
  du: DuLieuTienGiuLaiThang[]
}

function BieuDoTietKiemNoi({ du }: Props) {
  const { toi } = useGiaoDien()

  // Đọc màu sắc theo theme hiện tại
  const { chu, luoi, mauDuong, mauAm } = useMemo(() => {
    let chu = toi ? '#9db3b5' : '#587073'
    let luoi = toi ? '#1f3740' : '#e8eeec'
    let mauDuong = toi ? '#2fd3a0' : '#14946f'
    let mauAm = toi ? '#ff7a60' : '#e5593f'
    try {
      const styles = getComputedStyle(document.documentElement)
      chu = styles.getPropertyValue('--chu-phu').trim() || chu
      luoi = styles.getPropertyValue('--vien').trim() || luoi
      mauDuong = styles.getPropertyValue('--ngoc').trim() || mauDuong
      mauAm = styles.getPropertyValue('--san-ho').trim() || mauAm
    } catch {
      // fallback an toàn
    }
    return { chu, luoi, mauDuong, mauAm }
  }, [toi])

  const layGiaTri = (d: DuLieuTienGiuLaiThang) =>
    d.tienGiuLai !== undefined ? d.tienGiuLai : (d.tietKiem ?? 0)

  const { giaTriMang, suggestedMax, suggestedMin, mauCacCot, boGocCacCot } = useMemo(() => {
    const giaTriMang = du.map((d) => layGiaTri(d))
    const minVal = Math.min(...giaTriMang, 0)
    const maxVal = Math.max(...giaTriMang, 0)

    // Cân chỉnh tỷ lệ trục Y thông minh:
    // Nếu toàn bộ đều âm, tạo vùng đệm dương ~30% để đường mốc 0 nằm cân đối phía trên
    let suggestedMax = 0
    let suggestedMin = 0

    if (maxVal === 0 && minVal < 0) {
      suggestedMax = Math.abs(minVal) * 0.3
      suggestedMin = minVal * 1.12
    } else if (minVal === 0 && maxVal > 0) {
      suggestedMax = maxVal * 1.12
      suggestedMin = -(maxVal * 0.18)
    } else if (minVal < 0 && maxVal > 0) {
      suggestedMax = maxVal * 1.15
      suggestedMin = minVal * 1.15
    }

    const mauCacCot = giaTriMang.map((v) => (v >= 0 ? mauDuong : mauAm))
    const boGocCacCot = giaTriMang.map((v) =>
      v >= 0
        ? { topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 }
        : { topLeft: 0, topRight: 0, bottomLeft: 6, bottomRight: 6 },
    )

    return { giaTriMang, suggestedMax, suggestedMin, mauCacCot, boGocCacCot }
  }, [du, mauDuong, mauAm])

  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels: du.map((d) => nhanThangNgan(d.thang || d.key || '')),
      datasets: [
        {
          label: t('Tiền giữ lại'),
          data: giaTriMang,
          backgroundColor: mauCacCot,
          borderRadius: boGocCacCot as unknown as number,
          borderSkipped: false,
          maxBarThickness: 28,
        },
      ],
    }),
    [du, giaTriMang, mauCacCot, boGocCacCot],
  )

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 500 },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: 'inherit', weight: 600, size: 13 },
          bodyFont: { family: 'inherit', size: 12 },
          padding: 12,
          cornerRadius: 10,
          callbacks: {
            title: (items) => {
              const idx = items[0]?.dataIndex ?? 0
              const item = du[idx]
              const k = item ? (item.thang || item.key || '') : ''
              return item ? (item.nhan || nhanThang(k)) : ''
            },
            label: (c) => {
              const val = Number(c.parsed.y)
              const prefix = val > 0 ? '+' : ''
              const trangThai = val > 0 ? t('Thặng dư') : val < 0 ? t('Thâm hụt') : t('Hòa vốn')
              return ` ${trangThai}: ${prefix}${dinhDangTien(val)}`
            },
            afterBody: (items) => {
              const idx = items[0]?.dataIndex ?? 0
              const item = du[idx]
              if (!item || item.thu === undefined || item.chi === undefined) return ''
              return t(' Thu nhập: {0}\n Chi tiêu: {1}', [dinhDangTien(item.thu), dinhDangTien(item.chi)])
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: chu, font: { family: 'inherit', size: 11 } },
        },
        y: {
          suggestedMax,
          suggestedMin,
          border: { display: false },
          grid: {
            // Đường mốc 0 đậm và rõ nét (dùng optional chaining ctx.tick?.value tránh lỗi khi scale khởi tạo)
            color: (ctx) => (ctx.tick?.value === 0 ? (toi ? '#64748b' : '#334155') : luoi),
            lineWidth: (ctx) => (ctx.tick?.value === 0 ? 2 : 1),
          },
          ticks: {
            color: (ctx) => (ctx.tick?.value === 0 ? (toi ? '#f8fafc' : '#0f172a') : chu),
            font: (ctx) => ({
              family: 'inherit',
              size: 11,
              weight: (ctx.tick?.value === 0 ? 700 : 500) as 700 | 500,
            }),
            maxTicksLimit: 7,
            callback: (v) => {
              const val = Number(v)
              if (val === 0) return t('0 ₫ (Hòa vốn)')
              return (val > 0 ? '+' : '') + dinhDangGon(val)
            },
          },
        },
      },
    }),
    [chu, luoi, toi, suggestedMax, suggestedMin, du],
  )

  return (
    <div className="khung-bieu-do" style={{ minHeight: 260, height: 270 }}>
      <ChartCanvas type="bar" data={chartData} options={chartOptions} id="chart-tiet-kiem" />
    </div>
  )
}

export function BieuDoTietKiem({ du }: Props) {
  if (!du || du.length === 0) {
    return (
      <div
        className="khung-bieu-do"
        style={{ display: 'grid', placeItems: 'center', color: 'var(--chu-mo)', minHeight: 220 }}
      >
        <p className="nho">{t('Chưa có dữ liệu biến động dòng tiền')}</p>
      </div>
    )
  }

  return (
    <ChartErrorBoundary tieuDeBieuDo={t('Tiền giữ lại mỗi tháng')}>
      <BieuDoTietKiemNoi du={du} />
    </ChartErrorBoundary>
  )
}
