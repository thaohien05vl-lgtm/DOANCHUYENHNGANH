/**
 * Lõi đa ngôn ngữ của Finora.
 *
 * - Chuỗi gốc là tiếng Việt, được dùng làm khoá: t('Giao dịch').
 * - Ngôn ngữ chỉ được áp dụng khi KHỞI ĐỘNG ỨNG DỤNG: khi người dùng đổi ngôn ngữ,
 *   lựa chọn được lưu lại và app hiện hộp thoại yêu cầu khởi động lại. Nhờ vậy mọi
 *   chuỗi (kể cả hằng số khai báo ở cấp module) luôn thống nhất một ngôn ngữ.
 * - Tham số: t('Đã chọn {0} mục', [n]).
 */
import { BAN_DICH } from '../i18n/ban-dich'

export type NgonNgu = 'vi' | 'en' | 'ko' | 'ja' | 'zh'

export const DANH_SACH_NGON_NGU: NgonNgu[] = ['vi', 'en', 'ja', 'zh', 'ko']

export const TEN_NGON_NGU: Record<NgonNgu, string> = {
  vi: 'Tiếng Việt',
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '简体中文',
}

/** Mã locale cho Intl / toLocaleString. */
export const MA_LOCALE: Record<NgonNgu, string> = {
  vi: 'vi-VN',
  en: 'en-US',
  ko: 'ko-KR',
  ja: 'ja-JP',
  zh: 'zh-CN',
}

const KHOA_NGON_NGU = 'qlct-ngon-ngu'
const CHI_SO: Record<Exclude<NgonNgu, 'vi'>, 0 | 1 | 2 | 3> = { en: 0, ko: 1, ja: 2, zh: 3 }

function hopLe(v: string | null): v is NgonNgu {
  return v === 'vi' || v === 'en' || v === 'ko' || v === 'ja' || v === 'zh'
}

/** Ngôn ngữ người dùng đã chọn (có thể chưa áp dụng nếu chưa khởi động lại). */
export function docNgonNguDaChon(): NgonNgu {
  try {
    const v = localStorage.getItem(KHOA_NGON_NGU)
    if (hopLe(v)) return v
  } catch {
    /* localStorage không khả dụng */
  }
  return 'vi'
}

/** Ngôn ngữ đang áp dụng trong phiên chạy này — cố định cho đến lần khởi động sau. */
export const ngonNguHienTai: NgonNgu = docNgonNguDaChon()

export function luuNgonNgu(ngonNgu: NgonNgu): void {
  try {
    localStorage.setItem(KHOA_NGON_NGU, ngonNgu)
  } catch {
    /* bỏ qua */
  }
}

export const maLocaleHienTai = MA_LOCALE[ngonNguHienTai]

function noiSuy(mau: string, tham?: ReadonlyArray<string | number> | Record<string, string | number>): string {
  if (!tham) return mau
  return mau.replace(/\{(\w+)\}/g, (nguyen, khoa: string) => {
    const v = Array.isArray(tham) ? tham[Number(khoa)] : (tham as Record<string, string | number>)[khoa]
    return v === undefined ? nguyen : String(v)
  })
}

/** Dịch chuỗi tiếng Việt sang ngôn ngữ hiện tại. Chưa có bản dịch → trả về chuỗi gốc. */
export function t(vi: string, tham?: ReadonlyArray<string | number> | Record<string, string | number>): string {
  if (ngonNguHienTai === 'vi') return noiSuy(vi, tham)
  const muc = BAN_DICH[vi]
  return noiSuy(muc ? muc[CHI_SO[ngonNguHienTai]] : vi, tham)
}

/** Dùng cho tên động (danh mục / ví mặc định do backend tạo bằng tiếng Việt). */
export function dichTen(ten: string | undefined | null): string {
  if (!ten) return ''
  return t(ten)
}

/** Báo cáo thiếu bản dịch (chỉ dùng trong test). */
export function kiemTraThieuBanDich(khoa: string): boolean {
  return !BAN_DICH[khoa]
}
