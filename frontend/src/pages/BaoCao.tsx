import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  FilterX,
  Lightbulb,
  PieChart,
  Printer,
  Receipt,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { BieuDoDanhMuc } from '../components/bieu-do/BieuDoDanhMuc'
import { BieuDoThuChi } from '../components/bieu-do/BieuDoThuChi'
import { ChartErrorBoundary } from '../components/chung/ChartErrorBoundary'
import { Modal } from '../components/chung/Modal'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { useXacThuc } from '../hooks/useXacThuc'
import { hoiTroLy } from '../services/troLyService'
import {
  tinhTongHopBaoCao,
  type KyBaoCao,
} from '../utils/baoCaoService'
import { dinhDangNgay, dinhDangTien, homNayISO } from '../utils/dinhDang'
import { xuatCsvDanhSachGiaoDich } from '../utils/xuatBaoCaoCsv'
import { xuatExcelBaoCao, xuatExcelDanhSachGiaoDich } from '../utils/xuatBaoCaoExcel'
import { maLocaleHienTai, t, dichTen } from '../utils/ngonNgu'

export function BaoCao() {
  const { giaoDich, danhMuc, vi, nganSach } = useDuLieu()
  const { nguoiDung } = useXacThuc()
  const { thongBao, anSoDu } = useGiaoDien()

  // Bộ lọc
  const [ky, setKy] = useState<KyBaoCao>('6-thang')
  const [tuNgay, setTuNgay] = useState('')
  const [denNgay, setDenNgay] = useState(homNayISO())
  const [loaiGiaoDich, setLoaiGiaoDich] = useState<'tat-ca' | 'chi' | 'thu'>('tat-ca')
  const [locDanhMuc, setLocDanhMuc] = useState('')
  const [locVi, setLocVi] = useState('')

  // Modal in ấn / PDF Preview
  const [moXemPdf, setMoXemPdf] = useState(false)

  // Phân tích Finora AI
  const [dangPhanTichAI, setDangPhanTichAI] = useState(false)
  const [ketQuaAI, setKetQuaAI] = useState<string | null>(null)

  // Khoảng ngày tùy chọn cho khu vực Xuất báo cáo (theo Hình 2)
  const [tuNgayXuat, setTuNgayXuat] = useState('')
  const [denNgayXuat, setDenNgayXuat] = useState(homNayISO())
  const [dangXuat, setDangXuat] = useState(false)

  // 1. Tính toán chuẩn hóa toàn bộ dữ liệu báo cáo qua Service trung tâm
  const baoCao = useMemo(() => {
    return tinhTongHopBaoCao(giaoDich, danhMuc, vi, nganSach, {
      ky,
      tuNgay,
      denNgay,
      loaiGiaoDich,
      locDanhMuc,
      locVi,
    })
  }, [giaoDich, danhMuc, vi, nganSach, ky, tuNgay, denNgay, loaiGiaoDich, locDanhMuc, locVi])

  // Danh sách giao dịch nằm trong khoảng ngày chọn xuất
  const giaoDichTrongKyXuat = useMemo(() => {
    return giaoDich.filter((g) => {
      if (!g.ngay) return false
      if (tuNgayXuat && g.ngay < tuNgayXuat) return false
      if (denNgayXuat && g.ngay > denNgayXuat) return false
      if (locDanhMuc && g.maDanhMuc !== locDanhMuc) return false
      if (locVi && g.maVi !== locVi) return false
      return true
    })
  }, [giaoDich, tuNgayXuat, denNgayXuat, locDanhMuc, locVi])

  function kiemTraNgayXuat(): boolean {
    if (tuNgayXuat && denNgayXuat && tuNgayXuat > denNgayXuat) {
      thongBao(t('Ngày bắt đầu không được lớn hơn ngày kết thúc.'), 'loi')
      return false
    }
    if (giaoDichTrongKyXuat.length === 0) {
      thongBao(t('Không có dữ liệu giao dịch trong khoảng thời gian này để xuất.'), 'loi')
      return false
    }
    return true
  }

  // 1. Xuất báo cáo tài chính tổng hợp (Excel 4 sheets)
  function xuLyXuatBaoCaoExcel() {
    if (!kiemTraNgayXuat() || dangXuat) return
    setDangXuat(true)
    try {
      const baoCaoXuat = tinhTongHopBaoCao(giaoDich, danhMuc, vi, nganSach, {
        ky: 'tuy-chinh',
        tuNgay: tuNgayXuat,
        denNgay: denNgayXuat,
        loaiGiaoDich,
        locDanhMuc,
        locVi,
      })
      xuatExcelBaoCao({
        baoCao: baoCaoXuat,
        tenNguoiDung: nguoiDung?.ten ?? t('Chủ tài khoản Finora'),
        emailNguoiDung: nguoiDung?.email ?? '',
        danhMuc,
        vi,
      })
      thongBao(t('Đã xuất báo cáo tài chính Excel thành công (.xlsx)!'), 'ok')
    } catch {
      thongBao(t('Không thể tạo file báo cáo Excel.'), 'loi')
    } finally {
      setDangXuat(false)
    }
  }

  // 2. Mở bản in / PDF báo cáo tài chính
  function xuLyMoPdfXuat() {
    if (!kiemTraNgayXuat()) return
    setMoXemPdf(true)
  }

  // 3. Xuất dữ liệu bảng kê chi tiết dạng CSV (Chuẩn UTF-8 with BOM)
  function xuLyXuatGiaoDichCsv() {
    if (!kiemTraNgayXuat() || dangXuat) return
    setDangXuat(true)
    try {
      xuatCsvDanhSachGiaoDich({
        danhSachGiaoDich: giaoDichTrongKyXuat,
        danhMuc,
        vi,
        tuNgay: tuNgayXuat,
        denNgay: denNgayXuat,
      })
      thongBao(t('Đã xuất file CSV giao dịch thành công (.csv)!'), 'ok')
    } catch {
      thongBao(t('Không thể tạo file CSV.'), 'loi')
    } finally {
      setDangXuat(false)
    }
  }

  // 4. Xuất dữ liệu bảng kê chi tiết dạng Excel
  function xuLyXuatGiaoDichExcel() {
    if (!kiemTraNgayXuat() || dangXuat) return
    setDangXuat(true)
    try {
      xuatExcelDanhSachGiaoDich({
        danhSachGiaoDich: giaoDichTrongKyXuat,
        danhMuc,
        vi,
        tuNgay: tuNgayXuat,
        denNgay: denNgayXuat,
      })
      thongBao(t('Đã xuất bảng tính Excel giao dịch thành công (.xlsx)!'), 'ok')
    } catch {
      thongBao(t('Không thể tạo file Excel giao dịch.'), 'loi')
    } finally {
      setDangXuat(false)
    }
  }

  // Xuất file Excel chuẩn hóa 4 sheets
  function xuLyXuatExcel() {
    try {
      xuatExcelBaoCao({
        baoCao,
        tenNguoiDung: nguoiDung?.ten ?? t('Chủ tài khoản Finora'),
        emailNguoiDung: nguoiDung?.email ?? '',
        danhMuc,
        vi,
      })
      thongBao(t('Đã xuất báo cáo Excel thành công (.xlsx)!'), 'ok')
    } catch {
      thongBao(t('Không thể tạo file Excel. Hãy thử lại.'), 'loi')
    }
  }

  // Yêu cầu Finora AI phân tích
  async function xuLyPhanTichAI() {
    if (dangPhanTichAI) return
    setDangPhanTichAI(true)
    try {
      const topChiStr = baoCao.coCauChi
        .slice(0, 3)
        .map((d) => `${dichTen(d.danhMuc.ten)} (${dinhDangTien(d.soTien)}, ${d.tyTrong}%)`)
        .join(', ')

      const cauHoi = t('Bạn là chuyên gia tư vấn quản lý tài chính cá nhân cao cấp. Hãy phân tích chuyên sâu bức tranh tài chính của tôi trong kỳ: "{0}".\nSố liệu thực tế:\n- Tổng thu nhập: {1}\n- Tổng chi tiêu: {2}\n- Dòng tiền giữ lại (chênh lệch): {3}{4} ({5})\n- Tỷ lệ tiết kiệm: {6}\n- Số lượng giao dịch: {7}\n- Các danh mục chi nhiều nhất: {8}\n{9}\n\nYêu cầu định dạng phản hồi:\n1. [Đánh giá sức khỏe tài chính] (1 đoạn ngắn gọn, trung thực, chỉ rõ ưu điểm và rủi ro)\n2. [Điểm cần lưu ý về chi tiêu] (Nhận xét cơ cấu chi và danh mục chiếm tỷ trọng lớn)\n3. [3 Hành động cụ thể cần làm ngay] (Lời khuyên thực tế để tối ưu dòng tiền và tăng tích lũy)', [baoCao.tieuDeKy, dinhDangTien(baoCao.tongThu), dinhDangTien(baoCao.tongChi), baoCao.chenhLech >= 0 ? '+' : '', dinhDangTien(baoCao.chenhLech), baoCao.chenhLech >= 0 ? 'Thặng dư' : 'Thâm hụt', baoCao.tiLeTietKiemHienThi, baoCao.soLuongGiaoDich, topChiStr || 'Chưa ghi nhận chi tiêu', baoCao.canhBaoNganSach.length > 0 ? `- Cảnh báo ngân sách thực tế: ${baoCao.canhBaoNganSach.map((c) => c.noiDung).join('; ')}` : '- Không có ngân sách nào bị vượt.'])

      const traLoi = await hoiTroLy(cauHoi)
      setKetQuaAI(traLoi)
      thongBao(t('Đã nhận phân tích tài chính từ AI!'), 'ok')
    } catch {
      thongBao(t('Không thể kết nối đến Trợ lý AI. Vui lòng thử lại sau.'), 'loi')
    } finally {
      setDangPhanTichAI(false)
    }
  }

  // Đặt lại bộ lọc
  function datLaiBoLoc() {
    setKy('6-thang')
    setLoaiGiaoDich('tat-ca')
    setLocDanhMuc('')
    setLocVi('')
    setTuNgay('')
    setDenNgay(homNayISO())
  }

  const coBoLoc = ky !== '6-thang' || loaiGiaoDich !== 'tat-ca' || locDanhMuc !== '' || locVi !== ''

  return (
    <div className="trang" style={{ gap: 20, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* ============================================================
          KHU VỰC A: HEADER
          ============================================================ */}
      <TieuDeTrang
        tieuDe={t('Báo cáo tài chính')}
        moTa={t('Tổng hợp doanh thu, chi tiêu, dòng tiền thặng dư và cơ cấu ngân sách.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      />

      {/* ============================================================
          KHU VỰC B: BỘ LỌC BÁO CÁO (RESPONSIVE KHÔNG TRÀN MÀN HÌNH)
          ============================================================ */}
      <div
        className="the khong-in"
        style={{
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {/* Dải 1: Chọn kỳ thời gian (cuộn ngang mượt mà trên mobile) */}
        <div className="dai-bo-loc-cuon" role="group" aria-label={t('Khoảng thời gian báo cáo')}>
          {(
            [
              ['hom-nay', t('Hôm nay')],
              ['7-ngay', t('7 ngày')],
              ['thang-nay', t('Tháng này')],
              ['3-thang', t('3 tháng')],
              ['6-thang', t('6 tháng')],
              ['12-thang', t('12 tháng')],
              ['nam-nay', t('Năm nay')],
              ['tat-ca', t('Tất cả')],
              ['tuy-chinh', t('Tùy chọn')],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={ky === k}
              className={`btn btn-sm ${ky === k ? 'btn-chinh' : 'btn-nhe'}`}
              style={{ whiteSpace: 'nowrap', flexShrink: 0, padding: '6px 12px', fontSize: '0.84rem' }}
              onClick={() => setKy(k)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Lựa chọn ngày khi chọn tùy chỉnh */}
        {ky === 'tuy-chinh' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '6px 0' }}>
            <span className="nho mo" style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
              <Calendar size={14} /> {t('Từ ngày:')}
            </span>
            <input
              type="date"
              className="o-nhap"
              style={{ width: 'auto', minHeight: 34, fontSize: '0.85rem' }}
              value={tuNgay}
              onChange={(e) => setTuNgay(e.target.value)}
            />
            <span className="nho mo">{t('đến:')}</span>
            <input
              type="date"
              className="o-nhap"
              style={{ width: 'auto', minHeight: 34, fontSize: '0.85rem' }}
              value={denNgay}
              onChange={(e) => setDenNgay(e.target.value)}
            />
          </div>
        )}

        {/* Dải 2: Lọc Loại, Danh mục, Ví */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 4, borderTop: '1px solid var(--vien)' }}>
          {/* Lọc loại giao dịch */}
          <div className="doan" role="group" aria-label={t('Loại giao dịch')} style={{ margin: 0 }}>
            {(
              [
                ['tat-ca', t('Tất cả')],
                ['chi', t('Chi')],
                ['thu', t('Thu')],
              ] as const
            ).map(([k, n]) => (
              <button
                type="button"
                key={k}
                aria-pressed={loaiGiaoDich === k}
                className={k === 'chi' ? 'chi-on' : k === 'thu' ? 'thu-on' : ''}
                style={{ fontSize: '0.82rem', padding: '4px 10px' }}
                onClick={() => setLoaiGiaoDich(k)}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Lọc danh mục */}
          <select
            className="o-chon"
            style={{ width: 'auto', minWidth: 140, minHeight: 34, fontSize: '0.84rem' }}
            value={locDanhMuc}
            onChange={(e) => setLocDanhMuc(e.target.value)}
          >
            <option value="">{t('Tất cả danh mục')}</option>
            {danhMuc.map((d) => (
              <option key={d.id} value={d.id}>
                {dichTen(d.ten)} ({d.loai === 'chi' ? t('Chi') : t('Thu')})
              </option>
            ))}
          </select>

          {/* Lọc ví */}
          <select
            className="o-chon"
            style={{ width: 'auto', minWidth: 130, minHeight: 34, fontSize: '0.84rem' }}
            value={locVi}
            onChange={(e) => setLocVi(e.target.value)}
          >
            <option value="">{t('Tất cả các ví')}</option>
            {vi.map((v) => (
              <option key={v.id} value={v.id}>
                {dichTen(v.ten)}
              </option>
            ))}
          </select>

          {coBoLoc && (
            <button
              type="button"
              className="btn btn-nhe btn-sm"
              onClick={datLaiBoLoc}
              style={{ color: 'var(--san-ho, #e5593f)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}
            >
              <FilterX size={14} /> {t('Đặt lại')}
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--chu-mo)' }}>
            {t('Đang hiển thị:')} <strong>{baoCao.soLuongGiaoDich}</strong> {t('giao dịch ({0})', [baoCao.tieuDeKy])}
          </div>
        </div>
      </div>

      {/* ============================================================
          KHU VỰC C: TỔNG QUAN TÀI CHÍNH (5 KPIS CỐT LÕI)
          ============================================================ */}
      <div className="bao-cao-kpi-luoi">
        {/* KPI 1: Tổng thu nhập */}
        <div className="the-kpi-bao-cao">
          <div className="kpi-nhan">
            <ArrowUpRight size={15} style={{ color: 'var(--ngoc, #14946f)' }} />
            <span>{t('Tổng thu nhập')}</span>
          </div>
          <div className="kpi-gia-tri so" style={{ color: 'var(--ngoc, #14946f)' }}>
            {anSoDu ? '••••••' : dinhDangTien(baoCao.tongThu)}
          </div>
          <div className="kpi-phu">{t('Các khoản thu trong kỳ')}</div>
        </div>

        {/* KPI 2: Tổng chi tiêu */}
        <div className="the-kpi-bao-cao">
          <div className="kpi-nhan">
            <ArrowDownRight size={15} style={{ color: 'var(--san-ho, #e5593f)' }} />
            <span>{t('Tổng chi tiêu')}</span>
          </div>
          <div className="kpi-gia-tri so" style={{ color: 'var(--san-ho, #e5593f)' }}>
            {anSoDu ? '••••••' : dinhDangTien(baoCao.tongChi)}
          </div>
          <div className="kpi-phu">{t('Các khoản chi đã xuất')}</div>
        </div>

        {/* KPI 3: Chênh lệch thu chi */}
        <div className="the-kpi-bao-cao">
          <div className="kpi-nhan">
            <TrendingUp size={15} style={{ color: baoCao.chenhLech >= 0 ? 'var(--ngoc, #14946f)' : 'var(--san-ho, #e5593f)' }} />
            <span>{t('Chênh lệch thu chi')}</span>
          </div>
          <div
            className="kpi-gia-tri so"
            style={{ color: baoCao.chenhLech >= 0 ? 'var(--ngoc, #14946f)' : 'var(--san-ho, #e5593f)' }}
          >
            {anSoDu ? '••••••' : `${baoCao.chenhLech > 0 ? '+' : ''}${dinhDangTien(baoCao.chenhLech)}`}
          </div>
          <div className="kpi-phu">
            {baoCao.chenhLech > 0 ? t('Thặng dư tài chính') : baoCao.chenhLech < 0 ? t('Thâm hụt tài chính') : t('Hòa vốn')}
          </div>
        </div>

        {/* KPI 4: Tiền giữ lại trong kỳ */}
        <div className="the-kpi-bao-cao">
          <div className="kpi-nhan">
            <Wallet size={15} />
            <span>{t('Tiền giữ lại trong kỳ')}</span>
          </div>
          <div
            className="kpi-gia-tri so"
            style={{ color: baoCao.tienGiuLai >= 0 ? 'var(--chu-chinh)' : 'var(--san-ho, #e5593f)' }}
          >
            {anSoDu ? '••••••' : `${baoCao.tienGiuLai > 0 ? '+' : ''}${dinhDangTien(baoCao.tienGiuLai)}`}
          </div>
          <div className="kpi-phu" title={t('Khác với tổng số dư ví hiện tại')}>
            {t('Dòng tiền ròng (Thu − Chi)')}
          </div>
        </div>

        {/* KPI 5: Tỷ lệ tiết kiệm */}
        <div className="the-kpi-bao-cao">
          <div className="kpi-nhan">
            <PieChart size={15} />
            <span>{t('Tỷ lệ tiết kiệm')}</span>
          </div>
          <div
            className="kpi-gia-tri so"
            style={{
              color:
                baoCao.tiLeTietKiem >= 20
                  ? 'var(--ngoc, #14946f)'
                  : baoCao.tiLeTietKiem < 0
                    ? 'var(--san-ho, #e5593f)'
                    : 'var(--chu-chinh)',
            }}
          >
            {baoCao.tiLeTietKiemHienThi}
          </div>
          <div className="kpi-phu">
            {baoCao.tiLeTietKiem >= 20 ? t('Tích lũy tốt (≥20%)') : baoCao.tiLeTietKiem < 0 ? t('Chi vượt thu') : t('Cần tối ưu')}
          </div>
        </div>
      </div>

      {/* ============================================================
          KHU VỰC D: NHẬN XÉT TỔNG QUAN (EXECUTIVE SUMMARY DỰA TRÊN DỮ LIỆU THẬT)
          ============================================================ */}
      <div className="nhan-xet-tong-quan-card">
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(37, 99, 235, 0.12)',
            color: '#2563eb',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Lightbulb size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: 4, color: 'var(--chu-chinh)' }}>
            {t('Nhận định tổng quan kỳ báo cáo')}
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--chu-phu)' }}>
            {baoCao.nhanXetTongQuan}
          </p>
        </div>
      </div>

      {/* ============================================================
          KHU VỰC F: CẢNH BÁO THỰC TẾ & FINORA AI ADVISOR
          ============================================================ */}
      {/* 1. Cảnh báo vượt ngân sách thực tế */}
      {baoCao.canhBaoNganSach.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {baoCao.canhBaoNganSach.map((c, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                background: c.loai === 'canh-bao' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                border: `1px solid ${c.loai === 'canh-bao' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                color: c.loai === 'canh-bao' ? 'var(--san-ho, #e5593f)' : '#d97706',
              }}
            >
              <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                <strong>{c.loai === 'canh-bao' ? t('Cảnh báo vượt ngân sách:') : t('Nhắc nhở ngân sách:')}</strong> {c.noiDung}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Thẻ Finora AI Financial Advisor */}
      <section
        className="the the-phang khong-in"
        style={{
          padding: '18px 20px',
          background: 'linear-gradient(135deg, var(--be-mat) 0%, rgba(37, 99, 235, 0.04) 100%)',
          border: '1px solid var(--vien)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.02rem', margin: 0, fontWeight: 700 }}>
                {t('Phân tích tài chính thông minh (Finora AI)')}
              </h2>
              <p className="nho mo" style={{ margin: 0 }}>
                {t('Nhận định sức khỏe dòng tiền và lời khuyên tiết kiệm tự động từ AI')}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-chinh btn-sm"
            onClick={xuLyPhanTichAI}
            disabled={dangPhanTichAI}
            style={{
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              border: 'none',
              boxShadow: '0 2px 10px rgba(37, 99, 235, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {dangPhanTichAI ? (
              <>
                <span className="xoay" style={{ display: 'inline-block' }}>⚡</span>
                {t('Đang phân tích...')}
              </>
            ) : (
              <>
                <Bot size={16} />
                {ketQuaAI ? t('Phân tích lại') : t('Nhận phân tích AI')}
              </>
            )}
          </button>
        </div>

        {ketQuaAI && (
          <div
            style={{
              marginTop: 14,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'var(--be-mat-phu, rgba(148, 163, 184, 0.08))',
              border: '1px solid var(--vien)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              color: 'var(--chu-chinh)',
            }}
          >
            {ketQuaAI}
          </div>
        )}
      </section>

      {/* ============================================================
          KHU VỰC E: CÁC BIỂU ĐỒ CHI TIẾT (ĐẦY ĐỦ MÔ TẢ & DIỄN GIẢI THỰC TẾ)
          ============================================================ */}
      {/* BIỂU ĐỒ 1: THU VÀ CHI THEO THÁNG */}
      <section className="the-bieu-do-bao-cao">
        <div className="khung-dau">
          <div>
            <h3>{t('Thu và chi theo tháng')}</h3>
            <p>{t('Tổng thu nhập và tổng chi tiêu thực tế từng tháng')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--chu-mo)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <i style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--ngoc, #14946f)' }} /> {t('Thu')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <i style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--san-ho, #e5593f)' }} /> {t('Chi')}
            </span>
          </div>
        </div>

        <ChartErrorBoundary tieuDeBieuDo={t('Thu và Chi theo tháng')}>
          <BieuDoThuChi du={baoCao.chuoiThang} />
        </ChartErrorBoundary>

        <div className="dien-giai-duoi">
          <strong>{t('Diễn giải:')}</strong> {baoCao.dienGiaiThuChi}
        </div>
      </section>

      {/* BIỂU ĐỒ 2: CƠ CẤU CHI TIÊU THEO DANH MỤC */}
      <section className="the-bieu-do-bao-cao">
        <div className="khung-dau">
          <div>
            <h3>{t('Tỷ trọng chi tiêu theo danh mục')}</h3>
            <p>{t('Cơ cấu các khoản tiền chi trong kỳ. Bấm vào danh mục để lọc giao dịch chi tiết phía dưới')}</p>
          </div>
          {locDanhMuc && (
            <button
              type="button"
              className="btn btn-nhe btn-sm"
              onClick={() => setLocDanhMuc('')}
              style={{ fontSize: '0.8rem', color: 'var(--san-ho, #e5593f)' }}
            >
              {t('Bỏ chọn danh mục')}
            </button>
          )}
        </div>

        {baoCao.coCauChi.length > 0 ? (
          <ChartErrorBoundary tieuDeBieuDo={t('Cơ cấu chi tiêu theo danh mục')}>
            <BieuDoDanhMuc
              du={baoCao.coCauChi}
              toiDa={7}
              danhMucDangChon={locDanhMuc}
              onChonDanhMuc={(id) => setLocDanhMuc(id)}
            />
          </ChartErrorBoundary>
        ) : (
          <TrangThaiTrong
            icon={PieChart}
            tieuDe={t('Chưa có dữ liệu chi')}
            moTa={t('Không có giao dịch chi nào tương ứng với điều kiện lọc.')}
          />
        )}

        <div className="dien-giai-duoi">
          <strong>{t('Diễn giải:')}</strong> {baoCao.dienGiaiCoCauChi}
        </div>
      </section>

      {/* ============================================================
          PHẦN 2: KHU VỰC XUẤT BÁO CÁO & DỮ LIỆU CHUYÊN NGHIỆP (THEO HÌNH 2)
          ============================================================ */}
      <section
        className="the khong-in"
        style={{
          padding: '22px 24px',
          background: 'var(--be-mat)',
          border: '1px solid var(--vien)',
          borderRadius: 'var(--r-vua, 16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Download size={20} style={{ color: 'var(--ngoc, #14946f)' }} />
              <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 700, color: 'var(--chu-chinh)' }}>
                {t('Xuất báo cáo & Dữ liệu')}
              </h3>
            </div>
            <p className="nho mo" style={{ margin: '4px 0 0' }}>
              {t('Chọn khoảng thời gian và định dạng dữ liệu muốn xuất phục vụ in ấn hoặc kế toán đối soát.')}
            </p>
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 20,
              background: 'var(--be-mat-phu, rgba(148, 163, 184, 0.1))',
              fontSize: '0.82rem',
              color: 'var(--chu-chinh)',
              fontWeight: 600,
            }}
          >
            {t('Đang có')} <strong>{giaoDichTrongKyXuat.length}</strong> {t('giao dịch trong khoảng đã chọn')}
          </div>
        </div>

        {/* Thanh chọn ngày xuất báo cáo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexWrap: 'wrap',
            padding: '12px 14px',
            background: 'var(--be-mat-phu, rgba(148, 163, 184, 0.06))',
            borderRadius: 12,
            border: '1px solid var(--vien)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={15} style={{ color: 'var(--chu-mo)' }} />
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{t('Từ ngày:')}</span>
            <input
              type="date"
              className="o-nhap"
              style={{ width: 'auto', minHeight: 34, fontSize: '0.84rem' }}
              value={tuNgayXuat}
              onChange={(e) => setTuNgayXuat(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{t('Đến ngày:')}</span>
            <input
              type="date"
              className="o-nhap"
              style={{ width: 'auto', minHeight: 34, fontSize: '0.84rem' }}
              value={denNgayXuat}
              onChange={(e) => setDenNgayXuat(e.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn-nhe btn-sm"
            onClick={() => {
              setTuNgayXuat(baoCao.tuNgay || '')
              setDenNgayXuat(baoCao.denNgay || homNayISO())
            }}
            style={{ fontSize: '0.8rem', marginLeft: 'auto' }}
          >
            {t('Đồng bộ theo kỳ trên')}
          </button>
        </div>

        {/* 2 Khối chức năng xuất phân biệt rõ ràng (Phần 2.2) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {/* KHỐI 1: XUẤT BÁO CÁO TÀI CHÍNH */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              border: '1px solid var(--vien)',
              background: 'linear-gradient(135deg, var(--be-mat) 0%, rgba(20, 148, 111, 0.03) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <FileText size={17} style={{ color: 'var(--ngoc, #14946f)' }} />
                <strong style={{ fontSize: '0.95rem' }}>{t('1. Báo cáo tài chính tổng hợp')}</strong>
              </div>
              <p className="nho mo" style={{ margin: 0, lineHeight: 1.45 }}>
                {t('Bao gồm tổng quan thu chi, tiền giữ lại, tỷ lệ tiết kiệm, biểu đồ trực quan, cơ cấu chi tiêu và nhận xét tài chính.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-chinh btn-sm"
                onClick={xuLyMoPdfXuat}
                disabled={dangXuat}
                style={{ flex: 1, minWidth: 120, justifyContent: 'center' }}
              >
                <Printer size={15} /> {t('Xem & In PDF')}
              </button>
              <button
                type="button"
                className="btn btn-vien btn-sm"
                onClick={xuLyXuatBaoCaoExcel}
                disabled={dangXuat}
                style={{ flex: 1, minWidth: 130, justifyContent: 'center' }}
              >
                <FileSpreadsheet size={15} style={{ color: '#10b981' }} /> {t('Báo cáo Excel')}
              </button>
            </div>
          </div>

          {/* KHỐI 2: XUẤT DANH SÁCH GIAO DỊCH (DATA EXPORT) */}
          <div
            style={{
              padding: 16,
              borderRadius: 14,
              border: '1px solid var(--vien)',
              background: 'linear-gradient(135deg, var(--be-mat) 0%, rgba(37, 99, 235, 0.03) 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Receipt size={17} style={{ color: '#2563eb' }} />
                <strong style={{ fontSize: '0.95rem' }}>{t('2. Dữ liệu bảng kê giao dịch')}</strong>
              </div>
              <p className="nho mo" style={{ margin: 0, lineHeight: 1.45 }}>
                {t('Bảng kê chi tiết từng giao dịch (ngày, nội dung, danh mục, ví, số tiền) phục vụ kế toán, đối soát và lưu trữ.')}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-vien btn-sm"
                onClick={xuLyXuatGiaoDichCsv}
                disabled={dangXuat}
                style={{ flex: 1, minWidth: 120, justifyContent: 'center' }}
                title={t('File CSV chuẩn UTF-8 có BOM mở trong Excel không lỗi font tiếng Việt')}
              >
                <Download size={15} /> {t('Tải CSV (.csv)')}
              </button>
              <button
                type="button"
                className="btn btn-vien btn-sm"
                onClick={xuLyXuatGiaoDichExcel}
                disabled={dangXuat}
                style={{ flex: 1, minWidth: 130, justifyContent: 'center' }}
                title={t('Bảng tính Excel (.xlsx) giao dịch chi tiết')}
              >
                <FileSpreadsheet size={15} style={{ color: '#2563eb' }} /> {t('Bảng Excel')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          KHU VỰC G: BẢNG KÊ GIAO DỊCH TRONG KỲ (RESPONSIVE DESKTOP & MOBILE)
          ============================================================ */}
      <section className="the the-phang" style={{ marginTop: 4 }}>
        <div
          className="the-dau"
          style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{t('Danh sách giao dịch trong kỳ')}</h3>
            <p className="nho mo" style={{ margin: '2px 0 0' }}>
              {t('Hiển thị {0} bản ghi theo tiêu chí lọc hiện tại.', [baoCao.soLuongGiaoDich])}
            </p>
          </div>
          <button type="button" className="btn btn-vien btn-sm khong-in" onClick={xuLyXuatExcel}>
            <Download size={14} /> {t('Tải Excel')}
          </button>
        </div>

        {baoCao.soLuongGiaoDich === 0 ? (
          <TrangThaiTrong
            icon={Receipt}
            tieuDe={t('Không có giao dịch trong kỳ')}
            moTa={t('Thử mở rộng khoảng thời gian hoặc đặt lại bộ lọc để xem dữ liệu.')}
          />
        ) : (
          <div style={{ padding: '0 16px 16px' }}>
            {/* 1. Desktop Table */}
            <div className="bang-giao-dich-desktop" style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--vien)', textAlign: 'left', color: 'var(--chu-mo)' }}>
                    <th style={{ padding: '10px 8px', width: 45 }}>{t('STT')}</th>
                    <th style={{ padding: '10px 8px' }}>{t('Ngày')}</th>
                    <th style={{ padding: '10px 8px' }}>{t('Danh mục')}</th>
                    <th style={{ padding: '10px 8px' }}>{t('Nội dung / Ghi chú')}</th>
                    <th style={{ padding: '10px 8px' }}>{t('Ví')}</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>{t('Số tiền')}</th>
                  </tr>
                </thead>
                <tbody>
                  {baoCao.giaoDichTrongKy.slice(0, 50).map((g, idx) => {
                    const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
                    const viGd = vi.find((v) => v.id === g.maVi)
                    const laChi = g.loai === 'chi'
                    return (
                      <tr
                        key={g.id}
                        style={{
                          borderBottom: '1px solid var(--vien)',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <td style={{ padding: '10px 8px', color: 'var(--chu-mo)' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }} className="so">
                          {g.ngay ? dinhDangNgay(g.ngay) : '—'}
                        </td>
                        <td style={{ padding: '10px 8px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <i style={{ width: 8, height: 8, borderRadius: '50%', background: dm?.mau || '#94a3b8' }} />
                            {dm?.ten || t('Không phân loại')}
                          </span>
                        </td>
                        <td style={{ padding: '10px 8px', maxWidth: 280, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          <strong>{g.ghiChu || '—'}</strong>
                        </td>
                        <td style={{ padding: '10px 8px' }}>{viGd?.ten || t('Ví')}</td>
                        <td
                          style={{
                            padding: '10px 8px',
                            textAlign: 'right',
                            fontWeight: 700,
                            color: laChi ? 'var(--san-ho, #e5593f)' : 'var(--ngoc, #14946f)',
                          }}
                          className="so"
                        >
                          {anSoDu ? '••••••' : `${laChi ? '−' : '+'}${dinhDangTien(g.soTien)}`}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* 2. Mobile Card List (Tránh vỡ bảng trên điện thoại) */}
            <div className="danh-sach-giao-dich-mobile">
              {baoCao.giaoDichTrongKy.slice(0, 50).map((g) => {
                const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
                const viGd = vi.find((v) => v.id === g.maVi)
                const laChi = g.loai === 'chi'
                return (
                  <div key={g.id} className="dong-gd-mobile">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                      <i style={{ width: 10, height: 10, borderRadius: '50%', background: dm?.mau || '#94a3b8', flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {g.ghiChu || dm?.ten || t('Giao dịch')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--chu-mo)' }}>
                          {g.ngay ? dinhDangNgay(g.ngay) : ''} • {viGd?.ten || t('Ví')}
                        </div>
                      </div>
                    </div>
                    <div
                      className="so"
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: laChi ? 'var(--san-ho, #e5593f)' : 'var(--ngoc, #14946f)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {anSoDu ? '••••••' : `${laChi ? '−' : '+'}${dinhDangTien(g.soTien)}`}
                    </div>
                  </div>
                )
              })}
            </div>

            {baoCao.soLuongGiaoDich > 50 && (
              <p className="nho mo" style={{ textAlign: 'center', marginTop: 12 }}>
                {t('Đang hiển thị 50 / {0} giao dịch. Tải file Excel để xem toàn bộ danh sách.', [baoCao.soLuongGiaoDich])}
              </p>
            )}
          </div>
        )}
      </section>

      {/* ============================================================
          MODAL XEM TRƯỚC VÀ IN BÁO CÁO PDF (BẢN IN CHUẨN A4)
          ============================================================ */}
      <Modal mo={moXemPdf} dong={() => setMoXemPdf(false)} tieuDe={t('Xem trước & In báo cáo PDF')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <strong style={{ fontSize: '1.02rem', display: 'block' }}>{t('Bản in chuẩn khổ A4 - Finora')}</strong>
              <small className="mo">{t('Trình duyệt sẽ mở hộp thoại in / Lưu dưới dạng PDF (Save as PDF).')}</small>
            </div>
            <button
              type="button"
              className="btn btn-chinh"
              onClick={() => {
                window.print()
              }}
            >
              <Printer size={16} /> {t('Bắt đầu in / Lưu PDF')}
            </button>
          </div>

          {/* VÙNG TÀI LIỆU IN ẤN */}
          <div
            id="vung-in-bao-cao"
            style={{
              padding: 24,
              background: 'var(--be-mat, #fff)',
              border: '1px solid var(--vien, #cbd5e1)',
              borderRadius: 12,
              maxHeight: '65vh',
              overflowY: 'auto',
              fontFamily: 'inherit',
            }}
          >
            {/* Header bản in */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2563eb', paddingBottom: 12 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.35rem', color: '#2563eb' }}>{t('FINORA FINANCIAL REPORT')}</h1>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{t('Báo cáo phân tích tài chính cá nhân')}</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.82rem', color: '#334155' }}>
                <div><strong>{t('Kỳ báo cáo:')}</strong> {baoCao.tieuDeKy}</div>
                <div><strong>{t('Người xuất:')}</strong> {nguoiDung?.ten || t('Chủ tài khoản')} ({nguoiDung?.email || '—'})</div>
                <div><strong>{t('Thời gian xuất:')}</strong> {new Date().toLocaleString(maLocaleHienTai)}</div>
              </div>
            </div>

            {/* Bảng 5 KPIs tổng quan bản in */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, margin: '16px 0' }}>
              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('Tổng thu')}</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10b981', marginTop: 4 }}>
                  {dinhDangTien(baoCao.tongThu)}
                </div>
              </div>
              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('Tổng chi')}</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ef4444', marginTop: 4 }}>
                  {dinhDangTien(baoCao.tongChi)}
                </div>
              </div>
              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('Chênh lệch')}</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: baoCao.chenhLech >= 0 ? '#10b981' : '#ef4444', marginTop: 4 }}>
                  {baoCao.chenhLech >= 0 ? '+' : ''}{dinhDangTien(baoCao.chenhLech)}
                </div>
              </div>
              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('Tiền giữ lại')}</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: 4 }}>
                  {baoCao.tienGiuLai >= 0 ? '+' : ''}{dinhDangTien(baoCao.tienGiuLai)}
                </div>
              </div>
              <div style={{ padding: 10, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{t('Tỷ lệ tiết kiệm')}</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: baoCao.tiLeTietKiem >= 20 ? '#10b981' : '#d97706', marginTop: 4 }}>
                  {baoCao.tiLeTietKiemHienThi}
                </div>
              </div>
            </div>

            {/* Nhận xét in ấn */}
            <div style={{ padding: '10px 14px', background: '#f1f5f9', borderRadius: 8, marginBottom: 16, fontSize: '0.84rem' }}>
              <strong>{t('Đánh giá tài chính:')}</strong> {baoCao.nhanXetTongQuan}
            </div>

            {/* Bảng cơ cấu chi tiêu */}
            <h3 style={{ fontSize: '0.96rem', margin: '14px 0 6px', color: '#1e293b' }}>{t('1. Cơ cấu chi tiêu theo danh mục')}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('Danh mục')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>{t('Số lượt')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('Số tiền (VND)')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('Tỷ trọng %')}</th>
                </tr>
              </thead>
              <tbody>
                {baoCao.coCauChi.map((d) => (
                  <tr key={d.danhMuc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px' }}>{dichTen(d.danhMuc.ten)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>{d.soLuong}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600 }}>{dinhDangTien(d.soTien)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right' }}>{d.tyTrong}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bảng thu chi theo tháng */}
            <h3 style={{ fontSize: '0.96rem', margin: '14px 0 6px', color: '#1e293b' }}>{t('2. Biến động thu chi và tiền giữ lại qua các tháng')}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('Tháng')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('Thu nhập')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('Chi tiêu')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('Tiền giữ lại')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center' }}>{t('Trạng thái')}</th>
                </tr>
              </thead>
              <tbody>
                {baoCao.chuoiThang.map((m) => (
                  <tr key={m.thang} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '6px 8px' }}>{m.nhan}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#10b981' }}>{dinhDangTien(m.thu)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', color: '#ef4444' }}>{dinhDangTien(m.chi)}</td>
                    <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>
                      {m.tienGiuLai > 0 ? '+' : ''}{dinhDangTien(m.tienGiuLai)}
                    </td>
                    <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                      {m.tienGiuLai > 0 ? t('Thặng dư') : m.tienGiuLai < 0 ? t('Thâm hụt') : t('Hòa vốn')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bảng kê chi tiết giao dịch */}
            <h3 style={{ fontSize: '0.96rem', margin: '14px 0 6px', color: '#1e293b' }}>
              {t('3. Bảng kê giao dịch ({0} bản ghi)', [baoCao.soLuongGiaoDich])}
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '6px 8px', width: 35, textAlign: 'left' }}>{t('STT')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('Ngày')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('Loại')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('Danh mục')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'left' }}>{t('Ghi chú')}</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right' }}>{t('Số tiền (VND)')}</th>
                </tr>
              </thead>
              <tbody>
                {baoCao.giaoDichTrongKy.slice(0, 100).map((g, i) => {
                  const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
                  const laChi = g.loai === 'chi'
                  return (
                    <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '6px 8px' }}>{i + 1}</td>
                      <td style={{ padding: '6px 8px', whiteSpace: 'nowrap' }}>{g.ngay ? dinhDangNgay(g.ngay) : '—'}</td>
                      <td style={{ padding: '6px 8px' }}>{laChi ? t('Chi') : t('Thu')}</td>
                      <td style={{ padding: '6px 8px' }}>{dm?.ten || '—'}</td>
                      <td style={{ padding: '6px 8px' }}>{g.ghiChu || '—'}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right', fontWeight: 600, color: laChi ? '#ef4444' : '#10b981' }}>
                        {laChi ? '-' : '+'}{dinhDangTien(g.soTien)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 12, borderTop: '1px solid #e2e8f0', fontSize: '0.78rem', color: '#94a3b8' }}>
              <span>{t('Trích xuất từ Finora Personal Finance')}</span>
              <span>{t('Bản quyền © Finora')}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
