/**
 * BieuDoDanhMuc.tsx — Biểu đồ Cơ cấu chi tiêu (Doughnut Chart)
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
import { useGiaoDien } from '../../hooks/useGiaoDien'
import type { DanhMuc } from '../../types'
import { dinhDangGon, dinhDangTien } from '../../utils/dinhDang'
import { t, dichTen } from '../../utils/ngonNgu'

export interface DuLieuDanhMucItem {
  danhMuc: DanhMuc
  soTien: number
  soLuong?: number
  tyTrong?: number
}

interface Props {
  du: DuLieuDanhMucItem[]
  toiDa?: number
  danhMucDangChon?: string
  onChonDanhMuc?: (maDanhMuc: string) => void
}

function BieuDoDanhMucNoi({ du, toiDa = 7, danhMucDangChon, onChonDanhMuc }: Props) {
  const { toi } = useGiaoDien()

  const beMat = useMemo(() => {
    let beMat = toi ? '#11222a' : '#fff'
    try {
      beMat =
        getComputedStyle(document.documentElement).getPropertyValue('--be-mat').trim() || beMat
    } catch {
      // fallback an toàn
    }
    return beMat
  }, [toi])

  const tong = du.reduce((s, d) => s + d.soTien, 0)
  const hienThi = du.slice(0, toiDa)

  const chartData: ChartData<'doughnut'> = useMemo(
    () => ({
      labels: hienThi.map((d) => dichTen(d.danhMuc.ten)),
      datasets: [
        {
          data: hienThi.map((d) => d.soTien),
          backgroundColor: hienThi.map((d) => d.danhMuc.mau),
          borderColor: beMat,
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [hienThi, beMat],
  )

  const chartOptions: ChartOptions<'doughnut'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      animation: { duration: 500 },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family: 'inherit', weight: 600 },
          bodyFont: { family: 'inherit', size: 12 },
          callbacks: {
            label: (c) => {
              const item = hienThi[c.dataIndex]
              const countStr = item?.soLuong ? t(' • {0} lượt', [item.soLuong]) : ''
              const pt = tong > 0 ? Math.round((item.soTien / tong) * 100) : 0
              return ` ${dinhDangTien(Number(c.parsed))} (${pt}%)${countStr}`
            },
          },
          padding: 12,
          cornerRadius: 10,
        },
      },
    }),
    [hienThi, tong],
  )

  return (
    <div className="donut-bo-cuc">
      <div className="khung-bieu-do" style={{ position: 'relative', minHeight: 220 }}>
        <ChartCanvas type="doughnut" data={chartData} options={chartOptions} id="chart-danh-muc" />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
            textAlign: 'center',
          }}
        >
          <div>
            <div className="nho mo" style={{ fontSize: '0.8rem' }}>
              {t('Tổng chi tiêu')}
            </div>
            <div className="so" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
              {dinhDangGon(tong)}
            </div>
          </div>
        </div>
      </div>

      <div className="chu-giai">
        {hienThi.map((d) => {
          const laChon = danhMucDangChon === d.danhMuc.id
          const pt = tong > 0 ? ((d.soTien / tong) * 100).toFixed(1) : '0'
          return (
            <button
              type="button"
              key={d.danhMuc.id}
              onClick={() => onChonDanhMuc?.(laChon ? '' : d.danhMuc.id)}
              className={`muc-chu-giai-dm${laChon ? ' dang-chon' : ''}`}
              style={{
                background: laChon ? 'var(--be-mat-phu, rgba(148,163,184,0.15))' : 'transparent',
                border: laChon ? '1px solid var(--ngoc, #14946f)' : '1px solid transparent',
                borderRadius: 8,
                padding: '6px 8px',
                textAlign: 'left',
                width: '100%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
              title={t('{0}: {1} (Bấm để lọc theo danh mục này)', [dichTen(d.danhMuc.ten), dinhDangTien(d.soTien)])}
            >
              <i
                style={{
                  background: d.danhMuc.mau,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontWeight: laChon ? 700 : 500,
                }}
              >
                {dichTen(d.danhMuc.ten)}
                {d.soLuong ? (
                  <small className="mo" style={{ marginLeft: 4, fontWeight: 400 }}>
                    ({d.soLuong})
                  </small>
                ) : null}
              </span>
              <span className="pt so" style={{ color: 'var(--chu-mo)', fontSize: '0.82rem' }}>
                {pt}%
              </span>
              <b className="so" style={{ fontSize: '0.88rem' }}>
                {dinhDangGon(d.soTien)}
              </b>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function BieuDoDanhMuc({ du, toiDa = 7, danhMucDangChon, onChonDanhMuc }: Props) {
  const tong = du.reduce((s, d) => s + d.soTien, 0)

  if (!du || du.length === 0 || tong === 0) {
    return (
      <div
        className="khung-bieu-do"
        style={{ display: 'grid', placeItems: 'center', color: 'var(--chu-mo)', minHeight: 220 }}
      >
        <p className="nho">{t('Chưa có giao dịch chi tiêu trong kỳ')}</p>
      </div>
    )
  }

  return (
    <ChartErrorBoundary tieuDeBieuDo={t('Cơ cấu chi tiêu theo danh mục')}>
      <BieuDoDanhMucNoi
        du={du}
        toiDa={toiDa}
        danhMucDangChon={danhMucDangChon}
        onChonDanhMuc={onChonDanhMuc}
      />
    </ChartErrorBoundary>
  )
}
