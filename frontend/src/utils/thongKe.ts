import type { DanhMuc, GiaoDich, Vi } from '../types'
import { congThang, soNgayTrongThang } from './dinhDang'

export function tongThuChi(ds: GiaoDich[]) {
  let thu = 0
  let chi = 0
  for (const g of ds) {
    if (g.loai === 'thu') thu += g.soTien
    else chi += g.soTien
  }
  return { thu, chi, chenhLech: thu - chi }
}

export const theoThang = (ds: GiaoDich[], thang: string) => ds.filter((g) => g.ngay && g.ngay.startsWith(thang))

export function soDuVi(vi: Vi, ds: GiaoDich[]): number {
  const { chenhLech } = tongThuChi(ds.filter((g) => g.maVi === vi.id))
  return vi.soDuBanDau + chenhLech
}

export interface ThongKeDanhMuc {
  danhMuc: DanhMuc
  soTien: number
  soLuong: number
}

export function chiTheoDanhMuc(ds: GiaoDich[], danhMuc: DanhMuc[]): ThongKeDanhMuc[] {
  const tongMap = new Map<string, number>()
  const demMap = new Map<string, number>()
  for (const g of ds) {
    if (g.loai === 'chi') {
      tongMap.set(g.maDanhMuc, (tongMap.get(g.maDanhMuc) ?? 0) + g.soTien)
      demMap.set(g.maDanhMuc, (demMap.get(g.maDanhMuc) ?? 0) + 1)
    }
  }
  return [...tongMap.entries()]
    .map(([ma, soTien]) => ({
      danhMuc: danhMuc.find((d) => d.id === ma),
      soTien,
      soLuong: demMap.get(ma) ?? 0,
    }))
    .filter((x): x is ThongKeDanhMuc => !!x.danhMuc)
    .sort((a, b) => b.soTien - a.soTien)
}

export function thuTheoDanhMuc(ds: GiaoDich[], danhMuc: DanhMuc[]): ThongKeDanhMuc[] {
  const tongMap = new Map<string, number>()
  const demMap = new Map<string, number>()
  for (const g of ds) {
    if (g.loai === 'thu') {
      tongMap.set(g.maDanhMuc, (tongMap.get(g.maDanhMuc) ?? 0) + g.soTien)
      demMap.set(g.maDanhMuc, (demMap.get(g.maDanhMuc) ?? 0) + 1)
    }
  }
  return [...tongMap.entries()]
    .map(([ma, soTien]) => ({
      danhMuc: danhMuc.find((d) => d.id === ma),
      soTien,
      soLuong: demMap.get(ma) ?? 0,
    }))
    .filter((x): x is ThongKeDanhMuc => !!x.danhMuc)
    .sort((a, b) => b.soTien - a.soTien)
}

export function chuoiThang(ds: GiaoDich[], thangCuoi: string, soThang: number) {
  return Array.from({ length: soThang }, (_, i) => {
    const key = congThang(thangCuoi, i - (soThang - 1))
    const { thu, chi } = tongThuChi(theoThang(ds, key))
    return { key, thu, chi, tietKiem: thu - chi }
  })
}

/** Chi tiêu từng ngày trong tháng — dùng cho dải "nhịp chi tiêu" */
export function chiTheoNgay(ds: GiaoDich[], thang: string): number[] {
  const mang = Array<number>(soNgayTrongThang(thang)).fill(0)
  for (const g of theoThang(ds, thang)) {
    if (g.loai === 'chi' && g.ngay && g.ngay.length >= 10) {
      const ngayIndex = Number(g.ngay.slice(8, 10)) - 1
      if (ngayIndex >= 0 && ngayIndex < mang.length) {
        mang[ngayIndex] += g.soTien
      }
    }
  }
  return mang
}
