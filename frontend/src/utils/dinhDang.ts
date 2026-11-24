import { maLocaleHienTai, ngonNguHienTai, t } from './ngonNgu'
const dinhDangSo = new Intl.NumberFormat(maLocaleHienTai)
const pad = (n: number) => String(n).padStart(2, '0')

export const dinhDangTien = (n: number) => `${dinhDangSo.format(Math.round(n))} ₫`
export const dinhDangSoThuong = (n: number) => dinhDangSo.format(Math.round(n))

/** 1.250.000 → "1,25 tr" — dùng cho trục biểu đồ và chỗ hẹp */
export function dinhDangGon(n: number): string {
  const a = Math.abs(n)
  const dau = n < 0 ? '-' : ''
  const thapPhan = ngonNguHienTai === 'vi' ? ',' : '.'
  const rutGon = (v: number) => v.toFixed(1).replace('.', thapPhan).replace(new RegExp(`\\${thapPhan}0$`), '')
  if (a >= 1e9) return t('{0}{1} tỷ', [dau, rutGon(a / 1e9)])
  if (a >= 1e6) return t('{0}{1} tr', [dau, rutGon(a / 1e6)])
  if (a >= 1e3) return `${dau}${Math.round(a / 1e3)}k`
  return `${dau}${a}`
}

export const taoISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const homNayISO = () => taoISO(new Date())
export const thangHienTai = () => homNayISO().slice(0, 7)

export function dinhDangNgay(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (ngonNguHienTai === 'vi') return `${d}/${m}/${y}`
  return new Intl.DateTimeFormat(maLocaleHienTai, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(Number(y), Number(m) - 1, Number(d)))
}

const THU = [t('Chủ nhật'), t('Thứ hai'), t('Thứ ba'), t('Thứ tư'), t('Thứ năm'), t('Thứ sáu'), t('Thứ bảy')]

export function nhanNgay(iso: string): string {
  const hom = new Date()
  const homQua = new Date()
  homQua.setDate(hom.getDate() - 1)
  if (iso === taoISO(hom)) return t('Hôm nay')
  if (iso === taoISO(homQua)) return t('Hôm qua')
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  if (ngonNguHienTai === 'vi') return `${THU[dt.getDay()]}, ${pad(d)}/${pad(m)}`
  return new Intl.DateTimeFormat(maLocaleHienTai, { weekday: 'long', month: 'numeric', day: 'numeric' }).format(dt)
}

export function nhanThang(key: string): string {
  const [y, m] = key.split('-')
  if (ngonNguHienTai === 'vi') return t('Tháng {0}/{1}', [Number(m), y])
  return new Intl.DateTimeFormat(maLocaleHienTai, { year: 'numeric', month: 'long' }).format(new Date(Number(y), Number(m) - 1, 1))
}

export function nhanThangNgan(key: string): string {
  const m = Number(key.split('-')[1])
  if (ngonNguHienTai === 'vi') return `T${m}`
  return new Intl.DateTimeFormat(maLocaleHienTai, { month: 'short' }).format(new Date(2000, m - 1, 1))
}

export function congThang(key: string, delta: number): string {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
}

export function soNgayTrongThang(key: string): number {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

export function soThangConLai(han: string): number {
  const hom = new Date()
  const [y, m, d] = han.split('-').map(Number)
  const thang = (y - hom.getFullYear()) * 12 + (m - 1 - hom.getMonth()) + (d >= hom.getDate() ? 1 : 0)
  return Math.max(thang, 0)
}

export const taoId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

export function dinhDangNgayGio(isoString: string): string {
  try {
    const d = new Date(isoString)
    if (isNaN(d.getTime())) return isoString
    const padNum = (n: number) => String(n).padStart(2, '0')
    const gio = `${padNum(d.getHours())}:${padNum(d.getMinutes())}`
    const ngay = `${padNum(d.getDate())}/${padNum(d.getMonth() + 1)}/${d.getFullYear()}`
    return `${gio}, ${ngay}`
  } catch {
    return isoString
  }
}

