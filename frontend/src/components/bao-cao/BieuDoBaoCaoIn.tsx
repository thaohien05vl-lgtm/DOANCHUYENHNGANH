import type { ChiTietCoCauDanhMuc, ThongKeThangChiTiet } from '../../utils/baoCaoService'
import { dichTen, t } from '../../utils/ngonNgu'

interface BieuDoBaoCaoInProps {
  chuoiThang: ThongKeThangChiTiet[]
  coCauChi: ChiTietCoCauDanhMuc[]
}

export function BieuDoBaoCaoIn({ chuoiThang, coCauChi }: BieuDoBaoCaoInProps) {
  // Tính giá trị cực đại để scale biểu đồ cột thu - chi
  const maxVal = Math.max(
    ...chuoiThang.map((m) => Math.max(m.thu, m.chi)),
    1000000,
  )

  // Giới hạn 6 tháng gần nhất để vừa vặn chiều ngang A4
  const thangHienThi = chuoiThang.slice(-6)

  // Danh mục chi tiêu: Top 5 danh mục nhiều nhất + danh mục Khác
  const topDanhMuc = coCauChi.slice(0, 5)
  const tongChiTop = topDanhMuc.reduce((sum, d) => sum + d.soTien, 0)
  const tongChiAll = coCauChi.reduce((sum, d) => sum + d.soTien, 0)
  const chiKhac = Math.max(0, tongChiAll - tongChiTop)

  // Màu sắc chuẩn mực nhận diện Finora cho Donut
  const bangMau = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#94a3b8']

  // Tính các cung tròn (Donut slices) bằng SVG path
  let gocTichLuy = 0
  const danhSachPhan = [
    ...topDanhMuc.map((d, i) => ({
      ten: dichTen(d.danhMuc.ten),
      soTien: d.soTien,
      tyTrong: d.tyTrong,
      mau: d.danhMuc.mau || bangMau[i % bangMau.length],
    })),
    ...(chiKhac > 0
      ? [
          {
            ten: t('Khác'),
            soTien: chiKhac,
            tyTrong: Number(((chiKhac / tongChiAll) * 100).toFixed(1)),
            mau: bangMau[5],
          },
        ]
      : []),
  ]

  const duLieuDonut = danhSachPhan.map((item) => {
    const tiLe = tongChiAll > 0 ? item.soTien / tongChiAll : 0
    const gocQuay = tiLe * 360
    const startAngle = gocTichLuy
    const endAngle = gocTichLuy + gocQuay
    gocTichLuy += gocQuay

    // Tạo SVG Arc path (R_ngoai = 60, R_trong = 36)
    const cx = 80
    const cy = 80
    const rOut = 60
    const rIn = 36

    const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180
    const x1Out = cx + rOut * Math.cos(toRad(startAngle))
    const y1Out = cy + rOut * Math.sin(toRad(startAngle))
    const x2Out = cx + rOut * Math.cos(toRad(endAngle))
    const y2Out = cy + rOut * Math.sin(toRad(endAngle))

    const x1In = cx + rIn * Math.cos(toRad(endAngle))
    const y1In = cy + rIn * Math.sin(toRad(endAngle))
    const x2In = cx + rIn * Math.cos(toRad(startAngle))
    const y2In = cy + rIn * Math.sin(toRad(startAngle))

    const largeArc = gocQuay > 180 ? 1 : 0

    const pathData =
      tiLe >= 0.999
        ? `M ${cx} ${cy - rOut} A ${rOut} ${rOut} 0 1 0 ${cx} ${cy + rOut} A ${rOut} ${rOut} 0 1 0 ${cx} ${cy - rOut} M ${cx} ${cy - rIn} A ${rIn} ${rIn} 0 1 1 ${cx} ${cy + rIn} A ${rIn} ${rIn} 0 1 1 ${cx} ${cy - rIn} Z`
        : `M ${x1Out} ${y1Out} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2Out} ${y2Out} L ${x1In} ${y1In} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x2In} ${y2In} Z`

    return {
      ...item,
      pathData,
    }
  })

  return (
    <div className="khu-vuc-bieu-do-in">
      {/* 1. Biểu đồ cột Thu & Chi các tháng */}
      <div className="hop-bieu-do-in">
        <h4>
          <span>{t('Thu nhập & Chi tiêu qua các tháng')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.72rem', fontWeight: 600 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <i style={{ width: 8, height: 8, borderRadius: 2, background: '#10b981', display: 'inline-block' }} />
              {t('Thu')}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <i style={{ width: 8, height: 8, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} />
              {t('Chi')}
            </span>
          </div>
        </h4>

        <div style={{ height: 160, width: '100%' }}>
          <svg viewBox="0 0 420 150" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            <defs>
              <pattern id="hatch-chi" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
              </pattern>
            </defs>

            {/* Trục hoành và đường lưới ngang */}
            <line x1="30" y1="120" x2="410" y2="120" stroke="#cbd5e1" strokeWidth="1" />
            <line x1="30" y1="70" x2="410" y2="70" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="30" y1="20" x2="410" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

            {/* Các cặp cột Thu & Chi từng tháng */}
            {thangHienThi.map((thang, idx) => {
              const buoc = 360 / Math.max(1, thangHienThi.length)
              const xBase = 45 + idx * buoc
              const chieuCaoThu = Math.max(2, (thang.thu / maxVal) * 95)
              const chieuCaoChi = Math.max(2, (thang.chi / maxVal) * 95)
              const yThu = 120 - chieuCaoThu
              const yChi = 120 - chieuCaoChi

              return (
                <g key={thang.thang}>
                  {/* Cột Thu */}
                  <rect
                    x={xBase}
                    y={yThu}
                    width="14"
                    height={chieuCaoThu}
                    rx="2"
                    fill="#10b981"
                  />
                  {/* Cột Chi */}
                  <rect
                    x={xBase + 16}
                    y={yChi}
                    width="14"
                    height={chieuCaoChi}
                    rx="2"
                    fill="#ef4444"
                  />
                  <rect
                    x={xBase + 16}
                    y={yChi}
                    width="14"
                    height={chieuCaoChi}
                    rx="2"
                    fill="url(#hatch-chi)"
                  />
                  {/* Nhãn tháng */}
                  <text
                    x={xBase + 15}
                    y="136"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {thang.nhanNgan}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* 2. Biểu đồ Donut cơ cấu chi tiêu theo danh mục */}
      <div className="hop-bieu-do-in">
        <h4>
          <span>{t('Tỷ trọng chi tiêu theo danh mục')}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            {danhSachPhan.length} {t('danh mục')}
          </span>
        </h4>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 160 }}>
          {/* Donut SVG */}
          <div style={{ width: 110, height: 110, flexShrink: 0 }}>
            {tongChiAll > 0 ? (
              <svg viewBox="0 0 160 160" style={{ width: '100%', height: '100%' }}>
                {duLieuDonut.map((slice, i) => (
                  <path key={i} d={slice.pathData} fill={slice.mau} stroke="#ffffff" strokeWidth="1.5" />
                ))}
                <circle cx="80" cy="80" r="34" fill="#ffffff" />
                <text x="80" y="78" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="800">
                  {coCauChi.length}
                </text>
                <text x="80" y="90" textAnchor="middle" fill="#64748b" fontSize="7.5" fontWeight="600">
                  {t('DANH MỤC')}
                </text>
              </svg>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '4px dashed #e2e8f0',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '0.7rem',
                  color: '#94a3b8',
                }}
              >
                0đ
              </div>
            )}
          </div>

          {/* Chú giải Donut */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            {danhSachPhan.slice(0, 4).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 4,
                  fontSize: '0.72rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, overflow: 'hidden' }}>
                  <i
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: item.mau,
                      flexShrink: 0,
                      display: 'inline-block',
                    }}
                  />
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#334155',
                      fontWeight: 600,
                    }}
                  >
                    {item.ten}
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                  {item.tyTrong}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
