/**
 * BieuDoThuChi.tsx — Biểu đồ Thu và Chi theo tháng (Grouped Bar Chart)
 *
 * Quản lý vòng đời chuẩn mực:
 * - Sử dụng ChartCanvas với useRef (canvasRef & chartRef)
 * - Tự động giải phóng Chart.getChart(canvas) trước khi mount
 * - Cập nhật dữ liệu qua chart.update(), không hủy tạo lại instance
 * - Được bọc trong ChartErrorBoundary chuyên biệt
 */
import { useMemo } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'
import '../../utils/chartSetup'
import { ChartCanvas } from './ChartCanvas'
import { ChartErrorBoundary } from '../chung/ChartErrorBoundary'
import { dinhDangGon, dinhDangTien, nhanThang, nhanThangNgan } from '../../utils/dinhDang'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { t } from '../../utils/ngonNgu'

export interface DuLieuThuChiThang {
  thang?: string
  key?: string
  nhan?: string
  thu: number
  chi: number
}

interface Props {
  du: DuLieuThuChiThang[]
}

function BieuDoThuChiNoi({ du }: Props) {
  const { toi } = useGiaoDien()

  // Đọc màu sắc theo theme hiện tại
  const { chu, luoi, mauThu, mauChi } = useMemo(() => {
    let chu = toi ? '#9db3b5' : '#587073'
    let luoi = toi ? '#1f3740' : '#e8eeec'
    let mauThu = toi ? '#2fd3a0' : '#14946f'
    let mauChi = toi ? '#ff7a60' : '#e5593f'
    try {
      const styles = getComputedStyle(document.documentElement)
      chu = styles.getPropertyValue('--chu-phu').trim() || chu
      luoi = styles.getPropertyValue('--vien').trim() || luoi
      mauThu = styles.getPropertyValue('--ngoc').trim() || mauThu
      mauChi = styles.getPropertyValue('--san-ho').trim() || mauChi
    } catch {
      // fallback an toàn
    }
    return { chu, luoi, mauThu, mauChi }
  }, [toi])

  const chartData: ChartData<'bar'> = useMemo(
    () => ({
      labels: du.map((d) => nhanThangNgan(d.thang || d.key || '')),
      datasets: [
        {
          label: t('Thu nhập'),
          data: du.map((d) => d.thu),
          backgroundColor: mauThu,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 24,
        },
        {
          label: t('Chi tiêu'),
          data: du.map((d) => d.chi),
          backgroundColor: mauChi,
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 24,
        },
      ],
    }),
    [du, mauThu, mauChi],
  )

  const chartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      animation: { duration: 500 },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 8,
            padding: 14,
            color: chu,
            font: { family: 'inherit', size: 12, weight: 600 },
          },
        },
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
            label: (c) => ` ${c.dataset.label}: ${dinhDangTien(Number(c.parsed.y))}`,
            afterBody: (items) => {
              const idx = items[0]?.dataIndex ?? 0
              const item = du[idx]
              if (!item) return ''
              const diff = item.thu - item.chi
              const prefix = diff > 0 ? '+' : ''
              return t(' Chênh lệch: {0}{1}', [prefix, dinhDangTien(diff)])
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
          beginAtZero: true,
          border: { display: false },
          grid: { color: luoi },
          ticks: {
            color: chu,
            maxTicksLimit: 5,
            font: { family: 'inherit', size: 11 },
            callback: (v) => dinhDangGon(Number(v)),
          },
        },
      },
    }),
    [du, chu, luoi],
  )

  return (
    <div className="khung-bieu-do" style={{ minHeight: 250, height: 260 }}>
      <ChartCanvas type="bar" data={chartData} options={chartOptions} id="chart-thu-chi" />
    </div>
  )
}

export function BieuDoThuChi({ du }: Props) {
  if (!du || du.length === 0) {
    return (
      <div
        className="khung-bieu-do"
        style={{ display: 'grid', placeItems: 'center', color: 'var(--chu-mo)', minHeight: 220 }}
      >
        <p className="nho">{t('Chưa có dữ liệu biến động thu chi')}</p>
      </div>
    )
  }

  return (
    <ChartErrorBoundary tieuDeBieuDo={t('Thu và Chi theo tháng')}>
      <BieuDoThuChiNoi du={du} />
    </ChartErrorBoundary>
  )
}
