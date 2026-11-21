import type { DanhMuc, GiaoDich, Vi } from '../types'
import { dinhDangNgay } from './dinhDang'
import { t } from './ngonNgu'

export interface ThongTinXuatCsv {
  danhSachGiaoDich: GiaoDich[]
  danhMuc: DanhMuc[]
  vi: Vi[]
  tuNgay?: string
  denNgay?: string
}

/**
 * Xuất danh sách giao dịch dạng CSV chuẩn UTF-8 có BOM
 * Đảm bảo hiển thị tiếng Việt có dấu 100% chuẩn xác khi mở trực tiếp trong Excel.
 */
export function xuatCsvDanhSachGiaoDich(info: ThongTinXuatCsv) {
  const { danhSachGiaoDich, danhMuc, vi, tuNgay, denNgay } = info

  const dsSapXep = [...danhSachGiaoDich].sort((a, b) =>
    a.ngay !== b.ngay ? b.ngay.localeCompare(a.ngay) : b.id.localeCompare(a.id),
  )

  const tieuDeCot = [
    'STT',
    t('Ngày giao dịch'),
    t('Phân loại'),
    t('Danh mục'),
    t('Ví / Nguồn tiền'),
    t('Số tiền (VND)'),
    t('Ghi chú / Cửa hàng'),
    t('Chu kỳ lặp'),
    t('Mã giao dịch (ID)'),
  ]

  const cacHang: string[] = []
  cacHang.push(tieuDeCot.map(wrapCsvCell).join(','))

  dsSapXep.forEach((g, idx) => {
    const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
    const viGd = vi.find((v) => v.id === g.maVi)
    const loaiStr = g.loai === 'thu' ? t('Thu nhập') : t('Chi tiêu')
    const dinhKyStr =
      g.dinhKy === 'ngay'
        ? t('Hằng ngày')
        : g.dinhKy === 'tuan'
          ? t('Hằng tuần')
          : g.dinhKy === 'thang'
            ? t('Hằng tháng')
            : t('Không lặp')

    const hang = [
      String(idx + 1),
      g.ngay ? dinhDangNgay(g.ngay) : '',
      loaiStr,
      dm?.ten ?? t('Không phân loại'),
      viGd?.ten ?? t('Ví'),
      String(g.soTien),
      g.ghiChu ?? '',
      dinhKyStr,
      g.id,
    ]
    cacHang.push(hang.map(wrapCsvCell).join(','))
  })

  // Thêm ký tự BOM (\uFEFF) ở đầu để Excel nhận diện chuẩn UTF-8 tiếng Việt
  const noiDungCsv = '\uFEFF' + cacHang.join('\r\n')
  const blob = new Blob([noiDungCsv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.setAttribute('href', url)
  const safeTu = tuNgay ? tuNgay.replace(/-/g, '') : 'all'
  const safeDen = denNgay ? denNgay.replace(/-/g, '') : 'today'
  link.setAttribute('download', `Finora_GiaoDich_${safeTu}_den_${safeDen}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function wrapCsvCell(cell: string): string {
  if (cell.includes(',') || cell.includes('"') || cell.includes('\n') || cell.includes('\r')) {
    return `"${cell.replace(/"/g, '""')}"`
  }
  return `"${cell}"`
}

