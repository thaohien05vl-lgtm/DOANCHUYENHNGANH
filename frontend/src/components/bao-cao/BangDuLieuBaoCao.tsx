import type { ChiTietCoCauDanhMuc, ThongKeThangChiTiet } from '../../utils/baoCaoService'
import type { DanhMuc, GiaoDich, Vi } from '../../types'
import { dinhDangNgay, dinhDangTien } from '../../utils/dinhDang'
import { dichTen, t } from '../../utils/ngonNgu'

/* ------------------------------------------------------------
   BẢNG 1: CƠ CẤU CHI TIÊU THEO DANH MỤC
   ------------------------------------------------------------ */
interface BangCoCauChiProps {
  coCauChi: ChiTietCoCauDanhMuc[]
  tongChi: number
}

export function BangCoCauChi({ coCauChi, tongChi }: BangCoCauChiProps) {
  return (
    <div className="khu-vuc-bang-in">
      <h3 className="tieu-de-phan-in">
        <span>{t('1. Cơ cấu chi tiêu theo danh mục')}</span>
      </h3>
      <table className="bang-tai-lieu-in">
        <thead>
          <tr>
            <th style={{ width: 40 }} className="can-giua">{t('STT')}</th>
            <th>{t('Danh mục')}</th>
            <th className="can-giua" style={{ width: 75 }}>{t('Số lượt')}</th>
            <th className="can-phai" style={{ width: 140 }}>{t('Số tiền (VND)')}</th>
            <th className="can-phai" style={{ width: 90 }}>{t('Tỷ trọng')}</th>
            <th style={{ width: 120 }}>{t('Biểu đồ tỷ lệ')}</th>
          </tr>
        </thead>
        <tbody>
          {coCauChi.length === 0 ? (
            <tr>
              <td colSpan={6} className="can-giua" style={{ color: '#94a3b8', padding: 12 }}>
                {t('Không có dữ liệu chi tiêu trong kỳ này.')}
              </td>
            </tr>
          ) : (
            coCauChi.map((d, index) => (
              <tr key={d.danhMuc.id}>
                <td className="can-giua so" style={{ color: '#64748b' }}>{index + 1}</td>
                <td style={{ fontWeight: 600, color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <i
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: d.danhMuc.mau || '#2563eb',
                        display: 'inline-block',
                      }}
                    />
                    <span>{dichTen(d.danhMuc.ten)}</span>
                  </div>
                </td>
                <td className="can-giua so">{d.soLuong}</td>
                <td className="can-phai so" style={{ fontWeight: 700, color: '#dc2626' }}>
                  {dinhDangTien(d.soTien)}
                </td>
                <td className="can-phai so" style={{ fontWeight: 600 }}>{d.tyTrong}%</td>
                <td>
                  <div style={{ width: '100%', height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(2, d.tyTrong))}%`,
                        height: '100%',
                        background: d.danhMuc.mau || '#2563eb',
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
        {coCauChi.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan={2} style={{ padding: '8px 10px' }}>{t('Tổng cộng')}</td>
              <td className="can-giua so">
                {coCauChi.reduce((sum, d) => sum + d.soLuong, 0)}
              </td>
              <td className="can-phai so" style={{ color: '#dc2626' }}>
                {dinhDangTien(tongChi)}
              </td>
              <td className="can-phai so">100%</td>
              <td />
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  )
}

/* ------------------------------------------------------------
   BẢNG 2: BIẾN ĐỘNG THU CHI & TIỀN GIỮ LẠI QUA CÁC THÁNG
   ------------------------------------------------------------ */
interface BangBienDongThangProps {
  chuoiThang: ThongKeThangChiTiet[]
}

export function BangBienDongThang({ chuoiThang }: BangBienDongThangProps) {
  const tongThu = chuoiThang.reduce((s, m) => s + m.thu, 0)
  const tongChi = chuoiThang.reduce((s, m) => s + m.chi, 0)
  const tongGiuLai = tongThu - tongChi

  return (
    <div className="khu-vuc-bang-in">
      <h3 className="tieu-de-phan-in">
        <span>{t('2. Biến động thu chi và tiền giữ lại qua các tháng')}</span>
      </h3>
      <table className="bang-tai-lieu-in">
        <thead>
          <tr>
            <th>{t('Tháng')}</th>
            <th className="can-phai" style={{ width: 140 }}>{t('Thu nhập')}</th>
            <th className="can-phai" style={{ width: 140 }}>{t('Chi tiêu')}</th>
            <th className="can-phai" style={{ width: 140 }}>{t('Tiền giữ lại')}</th>
            <th className="can-giua" style={{ width: 100 }}>{t('Tỷ lệ tiết kiệm')}</th>
            <th className="can-giua" style={{ width: 110 }}>{t('Trạng thái')}</th>
          </tr>
        </thead>
        <tbody>
          {chuoiThang.map((m) => {
            const laThangDu = m.tienGiuLai >= 0
            return (
              <tr key={m.thang}>
                <td style={{ fontWeight: 600, color: '#1e293b' }}>{m.nhan}</td>
                <td className="can-phai so" style={{ color: '#059669', fontWeight: 600 }}>
                  {dinhDangTien(m.thu)}
                </td>
                <td className="can-phai so" style={{ color: '#dc2626', fontWeight: 600 }}>
                  {dinhDangTien(m.chi)}
                </td>
                <td
                  className="can-phai so"
                  style={{
                    fontWeight: 700,
                    color: laThangDu ? '#059669' : '#dc2626',
                  }}
                >
                  {laThangDu && m.tienGiuLai > 0 ? '+' : ''}
                  {dinhDangTien(m.tienGiuLai)}
                </td>
                <td className="can-giua so" style={{ fontWeight: 600 }}>
                  {m.tiLeTietKiem}%
                </td>
                <td className="can-giua">
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 12,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: laThangDu ? '#ecfdf5' : '#fef2f2',
                      color: laThangDu ? '#059669' : '#dc2626',
                      border: `1px solid ${laThangDu ? '#a7f3d0' : '#fecaca'}`,
                    }}
                  >
                    {laThangDu ? (m.tienGiuLai > 0 ? t('Thặng dư') : t('Hòa vốn')) : t('Thâm hụt')}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ padding: '8px 10px' }}>{t('Tổng cộng')}</td>
            <td className="can-phai so" style={{ color: '#059669' }}>
              {dinhDangTien(tongThu)}
            </td>
            <td className="can-phai so" style={{ color: '#dc2626' }}>
              {dinhDangTien(tongChi)}
            </td>
            <td className="can-phai so" style={{ color: tongGiuLai >= 0 ? '#059669' : '#dc2626' }}>
              {tongGiuLai > 0 ? '+' : ''}{dinhDangTien(tongGiuLai)}
            </td>
            <td className="can-giua so">
              {tongThu > 0 ? `${Math.round((tongGiuLai / tongThu) * 100)}%` : '0%'}
            </td>
            <td className="can-giua">
              <strong style={{ color: tongGiuLai >= 0 ? '#059669' : '#dc2626', fontSize: '0.74rem' }}>
                {tongGiuLai > 0 ? t('Thặng dư kỳ') : tongGiuLai < 0 ? t('Thâm hụt kỳ') : t('Cân bằng')}
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------
   BẢNG 3: BẢNG KÊ GIAO DỊCH CHI TIẾT
   ------------------------------------------------------------ */
interface BangKeGiaoDichProps {
  danhSachGiaoDich: GiaoDich[]
  danhMuc: DanhMuc[]
  vi: Vi[]
  batDauSTT?: number
}

export function BangKeGiaoDich({
  danhSachGiaoDich,
  danhMuc,
  vi,
  batDauSTT = 1,
}: BangKeGiaoDichProps) {
  return (
    <div className="khu-vuc-bang-in">
      <table className="bang-tai-lieu-in">
        <thead>
          <tr>
            <th style={{ width: 40 }} className="can-giua">{t('STT')}</th>
            <th style={{ width: 85 }} className="can-giua">{t('Ngày')}</th>
            <th style={{ width: 55 }} className="can-giua">{t('Loại')}</th>
            <th style={{ width: 130 }}>{t('Danh mục')}</th>
            <th style={{ width: 110 }}>{t('Ví / Tài khoản')}</th>
            <th>{t('Ghi chú giao dịch')}</th>
            <th className="can-phai" style={{ width: 130 }}>{t('Số tiền (VND)')}</th>
          </tr>
        </thead>
        <tbody>
          {danhSachGiaoDich.length === 0 ? (
            <tr>
              <td colSpan={7} className="can-giua" style={{ color: '#94a3b8', padding: 14 }}>
                {t('Không có giao dịch nào trong danh sách.')}
              </td>
            </tr>
          ) : (
            danhSachGiaoDich.map((g, idx) => {
              const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
              const v = vi.find((item) => item.id === g.maVi)
              const laChi = g.loai === 'chi'

              return (
                <tr key={g.id}>
                  <td className="can-giua so" style={{ color: '#64748b' }}>
                    {batDauSTT + idx}
                  </td>
                  <td className="can-giua so" style={{ whiteSpace: 'nowrap' }}>
                    {g.ngay ? dinhDangNgay(g.ngay) : '—'}
                  </td>
                  <td className="can-giua">
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        background: laChi ? '#fef2f2' : '#ecfdf5',
                        color: laChi ? '#dc2626' : '#059669',
                      }}
                    >
                      {laChi ? t('Chi') : t('Thu')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{dm?.ten ? dichTen(dm.ten) : '—'}</td>
                  <td style={{ color: '#64748b' }}>{v?.ten ? dichTen(v.ten) : '—'}</td>
                  <td style={{ color: '#334155' }}>{g.ghiChu || '—'}</td>
                  <td
                    className="can-phai so"
                    style={{
                      fontWeight: 700,
                      color: laChi ? '#dc2626' : '#059669',
                    }}
                  >
                    {laChi ? '-' : '+'}{dinhDangTien(g.soTien)}
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
