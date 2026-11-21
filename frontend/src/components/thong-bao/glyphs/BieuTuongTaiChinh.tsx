import { memo, type ReactNode } from 'react'
import type { FinanceGlyphType, GlyphProps, GlyphSize } from './types'
import { ThuNhap } from './ThuNhap'
import { ChiTieu } from './ChiTieu'
import { ChuyenTien } from './ChuyenTien'
import { NganSach } from './NganSach'
import { TietKiem } from './TietKiem'
import { NhacNho } from './NhacNho'
import { DinhKy } from './DinhKy'
import { HoanTien } from './HoanTien'
import { SaoKe } from './SaoKe'
import { CanhBao } from './CanhBao'
import { ThongBaoChung } from './ThongBaoChung'

export interface BieuTuongTaiChinhProps extends Omit<GlyphProps, 'size'> {
  type: FinanceGlyphType | string
  size?: GlyphSize
  category?: string
  fallback?: ReactNode
}

/**
 * Component trung tâm: Finora Finance Glyph System
 * - Lựa chọn minh họa SVG độc quyền chính xác theo loại nghiệp vụ tài chính.
 * - Chuẩn hóa tỷ lệ, chiều sâu vector 3D, độ bóng và phản quang.
 * - Hỗ trợ nhận diện dấu ấn danh mục phụ cho Chi tiêu.
 * - Fallback chuẩn hoá về Thông Báo Chung (chuông ngân vang vàng/tím), tuyệt đối không dùng ví cũ.
 * - Tương thích hoàn hảo 15 Theme và Light/Dark mode qua CSS variables.
 * - Tránh re-render không cần thiết thông qua React.memo.
 */
export const BieuTuongTaiChinh = memo(function BieuTuongTaiChinh({
  type,
  size = 'md',
  className = '',
  style,
  animated = true,
  category,
  fallback,
}: BieuTuongTaiChinhProps) {
  const normalized = (type || '').toLowerCase().trim()

  // 1. Thu nhập (Ví nhận tiền + đồng xu vàng bay vào)
  if (
    normalized === 'income' ||
    normalized === 'thu' ||
    normalized === 'giao_dich_thu' ||
    normalized.includes('thu_nhap') ||
    normalized.includes('giao_dich_thu')
  ) {
    return <ThuNhap size={size} className={className} style={style} animated={animated} category={category} />
  }

  // 2. Chi tiêu (HÓA ĐƠN THANH TOÁN RĂNG CƯA + ĐỒNG XU CHI TIÊU + MŨI TÊN XUẤT QUỸ)
  if (
    normalized === 'expense' ||
    normalized === 'chi' ||
    normalized === 'giao_dich_chi' ||
    normalized.includes('chi_tieu') ||
    normalized.includes('giao_dich_chi')
  ) {
    return <ChiTieu size={size} className={className} style={style} animated={animated} category={category} />
  }

  // 3. Chuyển tiền (2 mũi tên chuyển khoản đối xứng + đồng xu)
  if (
    normalized === 'transfer' ||
    normalized === 'chuyen' ||
    normalized === 'chuyen_tien' ||
    normalized === 'giao_dich_chuyen_tien' ||
    normalized.includes('chuyen_tien') ||
    normalized.includes('chuyen_khoan')
  ) {
    return <ChuyenTien size={size} className={className} style={style} animated={animated} />
  }

  // 4. Ngân sách (Khiên bảo vệ + vành đo tiến độ)
  if (
    normalized === 'budget' ||
    normalized === 'budget_warning' ||
    normalized === 'ngan_sach' ||
    normalized === 'ngan_sach_canh_bao' ||
    normalized.includes('ngan_sach')
  ) {
    return <NganSach size={size} className={className} style={style} animated={animated} />
  }

  // 5. Tiết kiệm & Mục tiêu (Hũ tích luỹ vàng + mầm cây tài chính)
  if (
    normalized === 'savings' ||
    normalized === 'saving' ||
    normalized === 'tiet_kiem' ||
    normalized === 'muc_tieu' ||
    normalized === 'tiet_kiem_muc_tieu' ||
    normalized.includes('tiet_kiem') ||
    normalized.includes('muc_tieu')
  ) {
    return <TietKiem size={size} className={className} style={style} animated={animated} />
  }

  // 6. Giao dịch định kỳ (Lịch tài chính + vòng lặp vô tận)
  if (
    normalized === 'recurring' ||
    normalized === 'dinh_ky' ||
    normalized === 'giao_dich_dinh_ky' ||
    normalized.includes('dinh_ky')
  ) {
    return <DinhKy size={size} className={className} style={style} animated={animated} />
  }

  // 7. Hoàn tiền (Đồng xu hoàn tiền + mũi tên hồi chuyển)
  if (
    normalized === 'refund' ||
    normalized === 'hoan_tien' ||
    normalized === 'giao_dich_hoan_tien' ||
    normalized.includes('hoan_tien')
  ) {
    return <HoanTien size={size} className={className} style={style} animated={animated} />
  }

  // 8. Sao kê & Đồng bộ (Văn bản tài chính + 2 mũi tên đồng bộ)
  if (
    normalized === 'statement' ||
    normalized === 'sync' ||
    normalized === 'sao_ke' ||
    normalized === 'dong_bo' ||
    normalized === 'dong_bo_sao_ke' ||
    normalized.includes('sao_ke') ||
    normalized.includes('dong_bo')
  ) {
    return <SaoKe size={size} className={className} style={style} animated={animated} />
  }

  // 9. Cảnh báo tài chính (Tam giác hổ phách phát quang)
  if (
    normalized === 'alert' ||
    normalized === 'warning' ||
    normalized === 'canh_bao' ||
    normalized === 'canh_bao_tai_chinh' ||
    normalized.includes('canh_bao')
  ) {
    return <CanhBao size={size} className={className} style={style} animated={animated} />
  }

  // 10. Hóa đơn & Nhắc nhở (Hóa đơn hạn định + đồng hồ báo giờ)
  if (
    normalized === 'reminder' ||
    normalized === 'payment_reminder' ||
    normalized === 'bill' ||
    normalized === 'hoa_don' ||
    normalized === 'nhac_nho' ||
    normalized === 'nhac_nho_thanh_toan' ||
    normalized.includes('hoa_don') ||
    normalized.includes('nhac_nho')
  ) {
    return <NhacNho size={size} className={className} style={style} animated={animated} />
  }

  // Fallback an toàn: Chuông thông báo chung cao cấp, không dùng ví cũ
  if (fallback) return <>{fallback}</>
  return <ThongBaoChung size={size} className={className} style={style} animated={animated} />
})

export type { BieuTuongTaiChinhProps as FinanceGlyphDispatcherProps }
export { BieuTuongTaiChinh as FinanceGlyph }
