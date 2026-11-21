import { useMemo } from 'react'
import type { KetQuaBaoCaoChuanHoa } from '../../utils/baoCaoService'
import type { DanhMuc, Vi } from '../../types'
import { dinhDangTien } from '../../utils/dinhDang'
import { t } from '../../utils/ngonNgu'
import { BangBienDongThang, BangCoCauChi, BangKeGiaoDich } from './BangDuLieuBaoCao'
import { BieuDoBaoCaoIn } from './BieuDoBaoCaoIn'
import { ChanTrangBaoCao } from './ChanTrangBaoCao'
import { DauTrangBaoCao } from './DauTrangBaoCao'
import { TongQuanSoLieuBaoCao } from './TongQuanSoLieuBaoCao'

interface TaiLieuBaoCaoA4Props {
  baoCao: KetQuaBaoCaoChuanHoa
  danhMuc: DanhMuc[]
  vi: Vi[]
  tenNguoiDung?: string
  emailNguoiDung?: string
  tieuDeBaoCaoTuyChon?: string
  baoGomBangKeGiaoDich?: boolean
}

export function TaiLieuBaoCaoA4({
  baoCao,
  danhMuc,
  vi,
  tenNguoiDung,
  emailNguoiDung,
  tieuDeBaoCaoTuyChon,
  baoGomBangKeGiaoDich = true,
}: TaiLieuBaoCaoA4Props) {
  // Xác định tiêu đề báo cáo chuẩn
  const tieuDeBaoCao = useMemo(() => {
    if (tieuDeBaoCaoTuyChon) return tieuDeBaoCaoTuyChon
    if (baoCao.ky === 'nam-nay') return t('BÁO CÁO TÀI CHÍNH THEO NĂM')
    if (baoCao.ky === 'thang-nay') return t('BÁO CÁO TÀI CHÍNH THEO THÁNG')
    return t('BÁO CÁO PHÂN TÍCH TÀI CHÍNH CÁ NHÂN')
  }, [tieuDeBaoCaoTuyChon, baoCao.ky])

  // Phân trang bảng kê chi tiết giao dịch (22 dòng mỗi trang để chuẩn khổ A4)
  const SO_DONG_MOI_TRANG = 22
  const cacKhoiGiaoDich = useMemo(() => {
    if (!baoGomBangKeGiaoDich || baoCao.giaoDichTrongKy.length === 0) return []
    // Giới hạn tối đa 66 giao dịch (tối đa 3 trang chi tiết) để tài liệu gọn gàng
    const danhSach = baoCao.giaoDichTrongKy.slice(0, 66)
    const chunks = []
    for (let i = 0; i < danhSach.length; i += SO_DONG_MOI_TRANG) {
      chunks.push(danhSach.slice(i, i + SO_DONG_MOI_TRANG))
    }
    return chunks
  }, [baoGomBangKeGiaoDich, baoCao.giaoDichTrongKy])

  // Tổng số trang = 1 (Tổng quan & Biểu đồ) + 1 (Bảng cơ cấu & biến động) + số trang giao dịch
  const tongSoTrang = 2 + cacKhoiGiaoDich.length

  return (
    <div id="tai-lieu-bao-cao-a4" className="tai-lieu-bao-cao-a4">
      {/* ============================================================
          TRANG 1: TỔNG QUAN TÀI CHÍNH, ĐÁNH GIÁ VÀ BIỂU ĐỒ CHẤT LƯỢNG CAO
          ============================================================ */}
      <div className="trang-giay-a4" data-page="1">
        <div className="than-trang-a4">
          {/* Header tài liệu */}
          <DauTrangBaoCao
            tieuDeBaoCao={tieuDeBaoCao}
            tieuDeKy={baoCao.tieuDeKy}
            tenNguoiDung={tenNguoiDung}
            emailNguoiDung={emailNguoiDung}
          />

          {/* 5 Thẻ KPIs tài chính cốt lõi */}
          <TongQuanSoLieuBaoCao
            tongThu={baoCao.tongThu}
            tongChi={baoCao.tongChi}
            chenhLech={baoCao.chenhLech}
            tienGiuLai={baoCao.tienGiuLai}
            tiLeTietKiemHienThi={baoCao.tiLeTietKiemHienThi}
            tiLeTietKiem={baoCao.tiLeTietKiem}
          />

          {/* Khối Nhận định & Phân tích chuyên sâu */}
          <div className="khoi-nhan-dinh-in">
            <div>
              <strong>{t('Nhận định tổng quan:')}</strong> {baoCao.nhanXetTongQuan}
            </div>
            <div>
              <strong>{t('Dòng tiền & Thặng dư:')}</strong> {baoCao.dienGiaiTienGiuLai}
            </div>
            {baoCao.dienGiaiCoCauChi && (
              <div>
                <strong>{t('Cơ cấu chi tiêu:')}</strong> {baoCao.dienGiaiCoCauChi}
              </div>
            )}
          </div>

          {/* Cảnh báo / Nhắc nhở ngân sách thực tế (nếu có) */}
          {baoCao.canhBaoNganSach.length > 0 && (
            <div className="khoi-canh-bao-in">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <strong>{t('Lưu ý ngân sách:')}</strong>{' '}
                {baoCao.canhBaoNganSach.map((c) => c.noiDung).join('; ')}
              </div>
            </div>
          )}

          {/* Biểu đồ trực quan: Cột Thu Chi + Donut Cơ cấu danh mục */}
          <BieuDoBaoCaoIn
            chuoiThang={baoCao.chuoiThang}
            coCauChi={baoCao.coCauChi}
          />
        </div>

        {/* Footer trang 1 */}
        <ChanTrangBaoCao
          trangHienTai={1}
          tongSoTrang={tongSoTrang}
          tieuDeKy={baoCao.tieuDeKy}
        />
      </div>

      {/* ============================================================
          TRANG 2: BẢNG CƠ CẤU CHI TIÊU VÀ BIẾN ĐỘNG QUA CÁC THÁNG
          ============================================================ */}
      <div className="trang-giay-a4" data-page="2">
        <div className="than-trang-a4">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #e2e8f0', paddingBottom: 8 }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
              {t('Phân tích chi tiết danh mục & biến động chuỗi thời gian')}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{baoCao.tieuDeKy}</span>
          </div>

          {/* Bảng 1: Cơ cấu chi tiêu theo danh mục */}
          <BangCoCauChi coCauChi={baoCao.coCauChi} tongChi={baoCao.tongChi} />

          {/* Bảng 2: Biến động qua các tháng */}
          <BangBienDongThang chuoiThang={baoCao.chuoiThang} />

          {/* Lời khuyên tối ưu dòng tiền & tích lũy từ Finora */}
          {baoCao.goiYTietKiem.length > 0 && (
            <div
              style={{
                marginTop: 6,
                padding: '10px 14px',
                background: '#f8fafc',
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: '0.78rem',
                lineHeight: 1.5,
              }}
            >
              <strong style={{ color: '#10b981', display: 'block', marginBottom: 4 }}>
                {t('Khuyến nghị tối ưu tài chính cá nhân:')}
              </strong>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#334155' }}>
                {baoCao.goiYTietKiem.map((goiY, i) => (
                  <li key={i}>{goiY}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer trang 2 */}
        <ChanTrangBaoCao
          trangHienTai={2}
          tongSoTrang={tongSoTrang}
          tieuDeKy={baoCao.tieuDeKy}
        />
      </div>

      {/* ============================================================
          TRANG 3+: BẢNG KÊ GIAO DỊCH CHI TIẾT (NẾU CÓ DỮ LIỆU)
          ============================================================ */}
      {cacKhoiGiaoDich.map((khoi, index) => {
        const soTrang = 3 + index
        const batDauSTT = index * SO_DONG_MOI_TRANG + 1
        const laTrangCuoi = index === cacKhoiGiaoDich.length - 1

        return (
          <div key={index} className="trang-giay-a4" data-page={soTrang}>
            <div className="than-trang-a4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #e2e8f0', paddingBottom: 8 }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>
                  {t('3. Bảng kê giao dịch chi tiết ({0} bản ghi)', [baoCao.giaoDichTrongKy.length])}
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  {t('Phần {0} (Bản ghi {1} - {2})', [index + 1, batDauSTT, batDauSTT + khoi.length - 1])}
                </span>
              </div>

              <BangKeGiaoDich
                danhSachGiaoDich={khoi}
                danhMuc={danhMuc}
                vi={vi}
                batDauSTT={batDauSTT}
              />

              {/* Khối tổng kết cuối bảng kê ở trang cuối cùng */}
              {laTrangCuoi && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#f1f5f9',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginTop: 8,
                  }}
                >
                  <span>{t('Tổng số giao dịch đã trích xuất: {0} giao dịch', [baoCao.giaoDichTrongKy.length])}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: '#059669' }}>
                      {t('Tổng thu:')} +{dinhDangTien(baoCao.tongThu)}
                    </span>
                    <span style={{ color: '#dc2626' }}>
                      {t('Tổng chi:')} -{dinhDangTien(baoCao.tongChi)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer từng trang giao dịch */}
            <ChanTrangBaoCao
              trangHienTai={soTrang}
              tongSoTrang={tongSoTrang}
              tieuDeKy={baoCao.tieuDeKy}
            />
          </div>
        )
      })}
    </div>
  )
}
