import type { ThongBao } from '../../types'
import { t } from '../../utils/ngonNgu'
import type { FinanceGlyphType } from './glyphs/types'

export interface ThongBaoNangCao extends ThongBao {
  soTienHienThi?: string
  loaiSoTien?: 'thu' | 'chi' | 'chuyen-tien' | 'ngan-sach' | 'tiet-kiem' | 'hoan-tien' | 'trung-tinh'
  tenDanhMucHienThi?: string
  tenViHienThi?: string
  glyphType: FinanceGlyphType
  tienTrinhNganSach?: {
    daChi: number
    hanMuc: number
    phanTram: number
  }
}

/** Định dạng số tiền chuẩn Việt Nam: 103000 -> 103.000đ */
export function formatTien(amount?: number | null): string {
  if (amount === undefined || amount === null) return ''
  return amount.toLocaleString('vi-VN') + 'đ'
}

/**
 * Phân giải toàn diện dữ liệu thông báo:
 * Nhận biết đúng 10 nhóm nghiệp vụ tài chính, trích xuất số tiền, tỷ lệ ngân sách,
 * danh mục và ví nguồn/đích mà không làm rớt chữ.
 */
export function phanGiaiThongBao(tb: ThongBao): ThongBaoNangCao {
  const result: ThongBaoNangCao = {
    ...tb,
    glyphType: 'REMINDER',
    loaiSoTien: 'trung-tinh',
  }

  const loai = (tb.type || '').toLowerCase()
  const noiDung = tb.content || ''
  const tieuDe = tb.title || ''

  // 1. Phân loại theo loại sự kiện tài chính độc quyền
  if (
    loai.includes('hoan_tien') ||
    tieuDe.toLowerCase().includes('hoàn tiền') ||
    noiDung.toLowerCase().includes('hoàn tiền')
  ) {
    result.glyphType = 'REFUND'
    result.loaiSoTien = 'hoan-tien'
    if (tb.amount != null) {
      result.soTienHienThi = `+${formatTien(tb.amount)}`
    }
  } else if (
    loai.includes('dinh_ky') ||
    tieuDe.toLowerCase().includes('định kỳ') ||
    noiDung.toLowerCase().includes('định kỳ')
  ) {
    result.glyphType = 'RECURRING'
    const isThu = loai.includes('thu') || tieuDe.toLowerCase().includes('thu')
    result.loaiSoTien = isThu ? 'thu' : 'chi'
    if (tb.amount != null) {
      result.soTienHienThi = `${isThu ? '+' : '-'}${formatTien(tb.amount)}`
    }
  } else if (
    loai.includes('chuyen_tien') ||
    loai.includes('chuyen') ||
    tieuDe.toLowerCase().includes('chuyển tiền') ||
    noiDung.toLowerCase().includes('chuyển tiền')
  ) {
    result.glyphType = 'TRANSFER'
    result.loaiSoTien = 'chuyen-tien'
    if (tb.amount != null) {
      result.soTienHienThi = formatTien(tb.amount)
    }
  } else if (
    loai.includes('thu') ||
    tieuDe.toLowerCase().includes('thu nhập') ||
    noiDung.toLowerCase().includes('khoản thu')
  ) {
    result.glyphType = 'INCOME'
    result.loaiSoTien = 'thu'
    if (tb.amount != null) {
      result.soTienHienThi = `+${formatTien(tb.amount)}`
    } else {
      const match = noiDung.match(/khoản thu\s+([\d.,]+[đ₫]?)/i)
      if (match) result.soTienHienThi = `+${match[1].endsWith('đ') ? match[1] : match[1] + 'đ'}`
    }
  } else if (
    loai.includes('chi') ||
    tieuDe.toLowerCase().includes('chi tiêu') ||
    noiDung.toLowerCase().includes('khoản chi')
  ) {
    result.glyphType = 'EXPENSE'
    result.loaiSoTien = 'chi'
    if (tb.amount != null) {
      result.soTienHienThi = `-${formatTien(tb.amount)}`
    } else {
      const match = noiDung.match(/khoản chi\s+([\d.,]+[đ₫]?)/i)
      if (match) result.soTienHienThi = `-${match[1].endsWith('đ') ? match[1] : match[1] + 'đ'}`
    }
  } else if (
    loai.includes('ngan_sach') ||
    tieuDe.toLowerCase().includes('ngân sách') ||
    noiDung.toLowerCase().includes('ngân sách')
  ) {
    const isVuot = tieuDe.toLowerCase().includes('vượt') || noiDung.toLowerCase().includes('vượt')
    result.glyphType = isVuot ? 'ALERT' : 'BUDGET'
    result.loaiSoTien = 'ngan-sach'

    // Trích xuất số tiền và hạn mức: "(100.000đ / 500.000đ)" hoặc từ metadata
    const match = noiDung.match(/\(([\d.,]+[đ₫]?)\s*\/\s*([\d.,]+[đ₫]?)\)/i)
    if (match) {
      result.soTienHienThi = `${match[1]} / ${match[2]}`
    } else if (tb.amount != null && tb.metadata) {
      const hanMuc = parseFloat(tb.metadata)
      if (!isNaN(hanMuc)) {
        result.soTienHienThi = `${formatTien(tb.amount)} / ${formatTien(hanMuc)}`
        const phanTram = Math.min(100, Math.round((tb.amount / hanMuc) * 100))
        result.tienTrinhNganSach = {
          daChi: tb.amount,
          hanMuc,
          phanTram,
        }
      } else {
        result.soTienHienThi = formatTien(tb.amount)
      }
    } else if (tb.amount != null) {
      result.soTienHienThi = formatTien(tb.amount)
    }
  } else if (
    loai.includes('tiet_kiem') ||
    loai.includes('muc_tieu') ||
    tieuDe.toLowerCase().includes('mục tiêu') ||
    tieuDe.toLowerCase().includes('tích luỹ')
  ) {
    result.glyphType = 'SAVINGS'
    result.loaiSoTien = 'tiet-kiem'
    const match = noiDung.match(/\(([\d.,]+[đ₫]?)\s*\/\s*([\d.,]+[đ₫]?)\)/i)
    if (match) {
      result.soTienHienThi = `${match[1]} / ${match[2]}`
    } else if (tb.amount != null && tb.metadata) {
      const target = parseFloat(tb.metadata)
      if (!isNaN(target)) {
        result.soTienHienThi = `${formatTien(tb.amount)} / ${formatTien(target)}`
      } else {
        result.soTienHienThi = formatTien(tb.amount)
      }
    } else if (tb.amount != null) {
      result.soTienHienThi = formatTien(tb.amount)
    }
  } else if (
    loai.includes('sao_ke') ||
    loai.includes('dong_bo') ||
    tieuDe.toLowerCase().includes('sao kê') ||
    tieuDe.toLowerCase().includes('đồng bộ')
  ) {
    result.glyphType = 'STATEMENT'
    result.loaiSoTien = 'trung-tinh'
    if (tb.amount != null) result.soTienHienThi = formatTien(tb.amount)
  } else if (
    loai.includes('canh_bao') ||
    tieuDe.toLowerCase().includes('cảnh báo') ||
    noiDung.toLowerCase().includes('cảnh báo')
  ) {
    result.glyphType = 'ALERT'
    result.loaiSoTien = 'ngan-sach'
    if (tb.amount != null) result.soTienHienThi = formatTien(tb.amount)
  } else {
    // Hóa đơn hoặc nhắc nhở
    result.glyphType = 'REMINDER'
    result.loaiSoTien = 'trung-tinh'
    if (tb.amount != null) result.soTienHienThi = formatTien(tb.amount)
  }

  // 2. Trích xuất danh mục và ví tiền
  if (tb.categoryName) {
    result.tenDanhMucHienThi = tb.categoryName
  } else {
    const matchTu = noiDung.match(/từ\s+([^()]+?)(?:\s+\([^)]+\))?\s+vào ví\s+([^.]+)/i)
    const matchCho = noiDung.match(/cho\s+([^()]+?)(?:\s+\([^)]+\))?\s+từ ví\s+([^.]+)/i)
    if (matchTu) {
      result.tenDanhMucHienThi = matchTu[1].trim()
      result.tenViHienThi = matchTu[2].trim()
    } else if (matchCho) {
      result.tenDanhMucHienThi = matchCho[1].trim()
      result.tenViHienThi = matchCho[2].trim()
    }
  }

  if (tb.walletName) {
    result.tenViHienThi = tb.walletName
  }

  return result
}

/** Định dạng thời gian chuẩn xác, không bao giờ ngắt dòng */
export function dinhDangThoiGianGon(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)

    if (diffSec < 60) return t('Vừa xong')
    if (diffSec < 3600) return t('{0} phút trước', [Math.max(1, Math.floor(diffSec / 60))])

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')

    if (diffSec < 86400 && d.getDate() === now.getDate()) {
      return `${hours}:${mins}`
    }

    const homQua = new Date(now)
    homQua.setDate(homQua.getDate() - 1)
    if (d.getDate() === homQua.getDate() && d.getMonth() === homQua.getMonth() && d.getFullYear() === homQua.getFullYear()) {
      return `${hours}:${mins} · ${t('Hôm qua')}`
    }

    return `${hours}:${mins} · ${day}/${month}`
  } catch {
    return iso
  }
}

/** Phân nhóm thông báo theo ngày: Hôm nay, Hôm qua, Trước đó */
export interface NhomThongBao {
  nhan: string
  items: ThongBaoNangCao[]
}

export function nhomThongBaoTheoNgay(danhSach: ThongBaoNangCao[]): NhomThongBao[] {
  const homNay = new Date()
  homNay.setHours(0, 0, 0, 0)

  const homQua = new Date(homNay)
  homQua.setDate(homQua.getDate() - 1)

  const nhomHomNay: ThongBaoNangCao[] = []
  const nhomHomQua: ThongBaoNangCao[] = []
  const nhomTruocDo: ThongBaoNangCao[] = []

  for (const item of danhSach) {
    if (!item.createdAt) {
      nhomTruocDo.push(item)
      continue
    }
    const itemDate = new Date(item.createdAt)
    itemDate.setHours(0, 0, 0, 0)

    if (itemDate.getTime() === homNay.getTime()) {
      nhomHomNay.push(item)
    } else if (itemDate.getTime() === homQua.getTime()) {
      nhomHomQua.push(item)
    } else {
      nhomTruocDo.push(item)
    }
  }

  const ketQua: NhomThongBao[] = []
  if (nhomHomNay.length > 0) ketQua.push({ nhan: t('Hôm nay'), items: nhomHomNay })
  if (nhomHomQua.length > 0) ketQua.push({ nhan: t('Hôm qua'), items: nhomHomQua })
  if (nhomTruocDo.length > 0) ketQua.push({ nhan: t('Trước đó'), items: nhomTruocDo })

  return ketQua
}
