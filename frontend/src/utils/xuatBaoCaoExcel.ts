import * as XLSX from 'xlsx'
import type { KetQuaBaoCaoChuanHoa } from './baoCaoService'
import type { DanhMuc, Vi, GiaoDich } from '../types'
import { dinhDangNgay } from './dinhDang'
import { maLocaleHienTai, t } from './ngonNgu'

export interface ThongTinXuatExcel {
  baoCao: KetQuaBaoCaoChuanHoa
  tenNguoiDung: string
  emailNguoiDung: string
  danhMuc: DanhMuc[]
  vi: Vi[]
}

/**
 * Xuất file Excel Báo cáo tài chính đa sheet chuyên nghiệp
 * Sử dụng 100% dữ liệu đã được chuẩn hóa đồng bộ với giao diện web.
 */
export function xuatExcelBaoCao(info: ThongTinXuatExcel) {
  const { baoCao, tenNguoiDung, emailNguoiDung, danhMuc, vi } = info
  const wb = XLSX.utils.book_new()

  const now = new Date()
  const ngayXuat = t('{0}:{1} ngày {2}/{3}/{4}', [now.getHours(), String(now.getMinutes()).padStart(2, '0'), now.getDate(), now.getMonth() + 1, now.getFullYear()])

  // ==========================================
  // SHEET 1: TỔNG QUAN TÀI CHÍNH
  // ==========================================
  const ws1Data: (string | number)[][] = [
    [t('BÁO CÁO TÀI CHÍNH CÁ NHÂN - FINORA')],
    [t('Ứng dụng Quản lý tài chính cá nhân thông minh')],
    [''],
    [t('THÔNG TIN BÁO CÁO'), ''],
    [t('Chủ tài khoản:'), tenNguoiDung || t('Chủ tài khoản')],
    [t('Email tài khoản:'), emailNguoiDung || '—'],
    [t('Kỳ báo cáo:'), baoCao.tieuDeKy],
    [t('Ngày xuất báo cáo:'), ngayXuat],
    [t('Đơn vị tiền tệ:'), t('VND (Việt Nam Đồng)')],
    [''],
    [t('CHỈ SỐ TÀI CHÍNH CỐT LÕI TRONG KỲ'), t('GIÁ TRỊ (VND)'), t('ĐÁNH GIÁ / GHI CHÚ')],
    [t('Tổng thu nhập trong kỳ'), baoCao.tongThu, t('Tổng các khoản thu đã ghi nhận')],
    [t('Tổng chi tiêu trong kỳ'), baoCao.tongChi, t('Tổng các khoản chi đã ghi nhận')],
    [
      t('Chênh lệch thu chi (Tiền giữ lại)'),
      baoCao.chenhLech,
      baoCao.chenhLech >= 0 ? t('Thặng dư tài chính (+)') : t('Thâm hụt tài chính (-)'),
    ],
    [t('Tỷ lệ tiết kiệm / tích lũy'), baoCao.tiLeTietKiemHienThi, t('Tỷ lệ tiền giữ lại trên tổng thu')],
    [t('Tổng số lượng giao dịch'), baoCao.soLuongGiaoDich, t('Số bản ghi giao dịch trong kỳ')],
    [''],
    [t('NHẬN XÉT TÀI CHÍNH TỔNG QUAN')],
    [baoCao.nhanXetTongQuan],
    [''],
    [t('SỐ DƯ THEO DÕI CÁC VÍ HIỆN TẠI'), t('LOẠI VÍ'), t('SỐ DƯ (VND)')],
  ]

  for (const v of vi) {
    const loaiViStr = v.loai === 'tien-mat' ? t('Tiền mặt') : v.loai === 'ngan-hang' ? t('Ngân hàng') : t('Ví điện tử')
    ws1Data.push([v.ten, loaiViStr, v.soDuBanDau])
  }
  ws1Data.push([t('Tổng số dư thực tế tất cả ví'), '', baoCao.tongSoDuVi])

  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data)
  ws1['!cols'] = [{ wch: 34 }, { wch: 28 }, { wch: 38 }]
  XLSX.utils.book_append_sheet(wb, ws1, t('1. Tổng quan tài chính'))

  // ==========================================
  // SHEET 2: THU CHI THEO THỜI GIAN (CÁC THÁNG)
  // ==========================================
  const ws2Data: (string | number)[][] = [
    [t('Tháng (Kỳ)'), t('Tổng thu (VND)'), t('Tổng chi (VND)'), t('Tiền giữ lại (VND)'), t('Tỷ lệ tiết kiệm (%)'), t('Đánh giá')],
  ]

  for (const m of baoCao.chuoiThang) {
    const trangThai = m.tienGiuLai > 0 ? t('Thặng dư (+)') : m.tienGiuLai < 0 ? t('Thâm hụt (-)') : t('Hòa vốn')
    ws2Data.push([
      m.nhan,
      m.thu,
      m.chi,
      m.tienGiuLai,
      m.thu > 0 ? `${m.tiLeTietKiem}%` : m.chi > 0 ? '-100%' : '0%',
      trangThai,
    ])
  }

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data)
  ws2['!cols'] = [{ wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, ws2, t('2. Thu chi theo tháng'))

  // ==========================================
  // SHEET 3: CƠ CẤU CHI TIÊU THEO DANH MỤC
  // ==========================================
  const ws3Data: (string | number)[][] = [
    ['STT', t('Tên danh mục'), t('Số tiền chi (VND)'), t('Tỷ trọng (%)'), t('Số lượt giao dịch')],
  ]

  baoCao.coCauChi.forEach((item, idx) => {
    ws3Data.push([
      idx + 1,
      item.danhMuc.ten,
      item.soTien,
      `${item.tyTrong}%`,
      item.soLuong,
    ])
  })

  ws3Data.push(['', t('TỔNG CỘNG'), baoCao.tongChi, '100%', baoCao.coCauChi.reduce((s, c) => s + c.soLuong, 0)])

  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data)
  ws3['!cols'] = [{ wch: 6 }, { wch: 26 }, { wch: 22 }, { wch: 16 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, ws3, t('3. Cơ cấu chi tiêu'))

  // ==========================================
  // SHEET 4: CHI TIẾT GIAO DỊCH TRONG KỲ
  // ==========================================
  const ws4Data: (string | number)[][] = [
    ['STT', t('Ngày giao dịch'), t('Phân loại'), t('Danh mục'), t('Ví / Nguồn tiền'), t('Số tiền (VND)'), t('Ghi chú / Cửa hàng'), t('Chu kỳ'), t('Mã GD')],
  ]

  const dsSapXep = [...baoCao.giaoDichTrongKy].sort((a, b) =>
    a.ngay !== b.ngay ? b.ngay.localeCompare(a.ngay) : b.id.localeCompare(a.id),
  )

  dsSapXep.forEach((g, index) => {
    const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
    const viGd = vi.find((v) => v.id === g.maVi)
    const loaiStr = g.loai === 'thu' ? t('Thu nhập') : t('Chi tiêu')
    const dinhKyStr = g.dinhKy === 'ngay' ? t('Hằng ngày') : g.dinhKy === 'tuan' ? t('Hằng tuần') : g.dinhKy === 'thang' ? t('Hằng tháng') : t('Không lặp')

    ws4Data.push([
      index + 1,
      g.ngay ? dinhDangNgay(g.ngay) : '',
      loaiStr,
      dm?.ten ?? t('Không phân loại'),
      viGd?.ten ?? t('Ví'),
      g.soTien,
      g.ghiChu ?? '',
      dinhKyStr,
      g.id,
    ])
  })

  const ws4 = XLSX.utils.aoa_to_sheet(ws4Data)
  ws4['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 12 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
    { wch: 32 },
    { wch: 14 },
    { wch: 16 },
  ]
  XLSX.utils.book_append_sheet(wb, ws4, t('4. Chi tiết giao dịch'))

  // Xuất file
  const safeKy = baoCao.ky
  const tenFile = `Finora_BaoCao_${safeKy}_${now.toISOString().slice(0, 10)}.xlsx`
  XLSX.writeFile(wb, tenFile)
}

export interface ThongTinXuatGiaoDichExcel {
  danhSachGiaoDich: GiaoDich[]
  danhMuc: DanhMuc[]
  vi: Vi[]
  tuNgay?: string
  denNgay?: string
}

/**
 * Xuất riêng danh sách giao dịch chi tiết dạng Excel bảng tính cho kế toán / kiểm toán
 */
export function xuatExcelDanhSachGiaoDich(info: ThongTinXuatGiaoDichExcel) {
  const { danhSachGiaoDich, danhMuc, vi, tuNgay, denNgay } = info
  const wb = XLSX.utils.book_new()
  const now = new Date()

  const wsData: (string | number)[][] = [
    [t('BẢNG KÊ GIAO DỊCH CHI TIẾT - FINORA')],
    [t('Thời gian xuất: {0}', [now.toLocaleString(maLocaleHienTai)])],
    [t('Khoảng ngày: {0} đến {1}', [tuNgay ? dinhDangNgay(tuNgay) : 'Đầu', denNgay ? dinhDangNgay(denNgay) : 'Nay'])],
    [''],
    ['STT', t('Ngày giao dịch'), t('Phân loại'), t('Danh mục'), t('Ví / Nguồn tiền'), t('Số tiền (VND)'), t('Ghi chú / Cửa hàng'), t('Chu kỳ'), t('Mã GD')],
  ]

  const dsSapXep = [...danhSachGiaoDich].sort((a, b) =>
    a.ngay !== b.ngay ? b.ngay.localeCompare(a.ngay) : b.id.localeCompare(a.id),
  )

  dsSapXep.forEach((g, index) => {
    const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
    const viGd = vi.find((v) => v.id === g.maVi)
    const loaiStr = g.loai === 'thu' ? t('Thu nhập') : t('Chi tiêu')
    const dinhKyStr = g.dinhKy === 'ngay' ? t('Hằng ngày') : g.dinhKy === 'tuan' ? t('Hằng tuần') : g.dinhKy === 'thang' ? t('Hằng tháng') : t('Không lặp')

    wsData.push([
      index + 1,
      g.ngay ? dinhDangNgay(g.ngay) : '',
      loaiStr,
      dm?.ten ?? t('Không phân loại'),
      viGd?.ten ?? t('Ví'),
      g.soTien,
      g.ghiChu ?? '',
      dinhKyStr,
      g.id,
    ])
  })

  const ws = XLSX.utils.aoa_to_sheet(wsData)
  ws['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 12 },
    { wch: 22 },
    { wch: 18 },
    { wch: 18 },
    { wch: 32 },
    { wch: 14 },
    { wch: 16 },
  ]
  XLSX.utils.book_append_sheet(wb, ws, t('Bảng kê giao dịch'))

  const safeTu = tuNgay ? tuNgay.replace(/-/g, '') : 'all'
  const safeDen = denNgay ? denNgay.replace(/-/g, '') : 'today'
  const tenFile = `Finora_GiaoDich_${safeTu}_den_${safeDen}.xlsx`
  XLSX.writeFile(wb, tenFile)
}
