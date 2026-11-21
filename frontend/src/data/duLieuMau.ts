import type { DuLieu, GiaoDich } from '../types'
import { congThang, taoISO } from '../utils/dinhDang'

export const BANG_MAU = ['#14946F', '#E5593F', '#D79A22', '#2F6FDB', '#8B5CF6', '#DB2777', '#0891B2', '#64748B']

export const DANH_MUC_MAU: DuLieu['danhMuc'] = [
  { id: 'dm-an', ten: 'Ăn uống', loai: 'chi', bieuTuong: 'utensils', mau: '#E5593F' },
  { id: 'dm-dichuyen', ten: 'Đi lại', loai: 'chi', bieuTuong: 'car', mau: '#2F6FDB' },
  { id: 'dm-muasam', ten: 'Mua sắm', loai: 'chi', bieuTuong: 'bag', mau: '#DB2777' },
  { id: 'dm-nhao', ten: 'Nhà ở', loai: 'chi', bieuTuong: 'home', mau: '#D79A22' },
  { id: 'dm-hoc', ten: 'Học tập', loai: 'chi', bieuTuong: 'book', mau: '#8B5CF6' },
  { id: 'dm-suckhoe', ten: 'Sức khỏe', loai: 'chi', bieuTuong: 'heart', mau: '#14946F' },
  { id: 'dm-giaitri', ten: 'Giải trí', loai: 'chi', bieuTuong: 'game', mau: '#0891B2' },
  { id: 'dm-luong', ten: 'Lương', loai: 'thu', bieuTuong: 'banknote', mau: '#14946F' },
  { id: 'dm-thuong', ten: 'Thưởng', loai: 'thu', bieuTuong: 'gift', mau: '#D79A22' },
  { id: 'dm-lamthem', ten: 'Làm thêm', loai: 'thu', bieuTuong: 'briefcase', mau: '#2F6FDB' },
]

/** Sinh số giả ngẫu nhiên có hạt giống để dữ liệu mẫu ổn định giữa các lần tải */
function taoNgauNhien(hat: number) {
  let s = hat
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

export function taoDuLieuMau(): DuLieu {
  const rnd = taoNgauNhien(2026)
  const hom = new Date()
  const thangNay = taoISO(hom).slice(0, 7)
  const gd: GiaoDich[] = []
  let dem = 0
  const them = (loai: 'thu' | 'chi', soTien: number, maDanhMuc: string, maVi: string, ngay: string, ghiChu: string, dinhKy: GiaoDich['dinhKy'] = null) =>
    gd.push({ id: `gd-${++dem}`, loai, soTien: Math.round(soTien / 1000) * 1000, maDanhMuc, maVi, ngay, ghiChu, dinhKy })

  const mauChi: [string, string, number, number, string[]][] = [
    ['dm-an', 'vi-tm', 30000, 120000, ['Cơm trưa', 'Cà phê', 'Bún bò', 'Trà sữa', 'Ăn tối cùng bạn', 'Bánh mì']],
    ['dm-an', 'vi-momo', 40000, 90000, ['Highlands Coffee', 'Phở', 'Cơm tấm']],
    ['dm-dichuyen', 'vi-tm', 20000, 60000, ['Xăng xe', 'Grab', 'Gửi xe', 'Xe buýt']],
    ['dm-muasam', 'vi-nh', 150000, 650000, ['Áo thun', 'Giày', 'Phụ kiện', 'Shopee']],
    ['dm-giaitri', 'vi-momo', 60000, 250000, ['Xem phim', 'Netflix', 'Chơi game']],
    ['dm-hoc', 'vi-nh', 80000, 400000, ['Sách giáo trình', 'Khóa học online', 'In tài liệu']],
    ['dm-suckhoe', 'vi-tm', 50000, 300000, ['Thuốc', 'Khám răng']],
  ]

  for (let k = 5; k >= 0; k--) {
    const thang = congThang(thangNay, -k)
    const [y, m] = thang.split('-').map(Number)
    const ngayToiDa = k === 0 ? hom.getDate() : new Date(y, m, 0).getDate()
    const ngay = (d: number) => `${thang}-${String(Math.min(d, ngayToiDa)).padStart(2, '0')}`
    if (k > 0 || hom.getDate() >= 5) {
      them('thu', 6500000, 'dm-luong', 'vi-nh', ngay(5), 'Lương làm thêm', 'thang')
    }
    if (k > 0 || hom.getDate() >= 12) them('thu', 1500000 + rnd() * 1500000, 'dm-lamthem', 'vi-nh', ngay(12), 'Dạy kèm')
    if (rnd() > 0.6 && (k > 0 || hom.getDate() >= 20)) them('thu', 500000 + rnd() * 700000, 'dm-thuong', 'vi-momo', ngay(20), 'Thưởng dự án')
    if (k > 0 || hom.getDate() >= 1) them('chi', 1800000, 'dm-nhao', 'vi-nh', ngay(1), 'Tiền phòng trọ', 'thang')
    const soGD = k === 0 ? Math.max(hom.getDate(), 4) + 6 : 26
    for (let i = 0; i < soGD; i++) {
      const mau = mauChi[Math.floor(rnd() * mauChi.length)]
      const d = 1 + Math.floor(rnd() * ngayToiDa)
      them('chi', mau[2] + rnd() * (mau[3] - mau[2]), mau[0], mau[1], ngay(d), mau[4][Math.floor(rnd() * mau[4].length)])
    }
  }

  const han = (soThang: number) => `${congThang(thangNay, soThang)}-28`
  return {
    vi: [
      { id: 'vi-tm', ten: 'Tiền mặt', loai: 'tien-mat', soDuBanDau: 800000, mau: '#D79A22' },
      { id: 'vi-nh', ten: 'Vietcombank', loai: 'ngan-hang', soDuBanDau: 4200000, mau: '#14946F' },
      { id: 'vi-momo', ten: 'MoMo', loai: 'vi-dien-tu', soDuBanDau: 650000, mau: '#DB2777' },
    ],
    danhMuc: DANH_MUC_MAU,
    giaoDich: gd,
    nganSach: [
      { id: 'ns-1', maDanhMuc: 'dm-an', hanMuc: 2200000 },
      { id: 'ns-2', maDanhMuc: 'dm-dichuyen', hanMuc: 600000 },
      { id: 'ns-3', maDanhMuc: 'dm-muasam', hanMuc: 1000000 },
      { id: 'ns-4', maDanhMuc: 'dm-giaitri', hanMuc: 500000 },
      { id: 'ns-5', maDanhMuc: 'dm-hoc', hanMuc: 800000 },
    ],
    mucTieu: [
      { id: 'mt-1', ten: 'Mua laptop mới', soTienMucTieu: 18000000, daTietKiem: 7200000, han: han(8), mau: '#2F6FDB' },
      { id: 'mt-2', ten: 'Du lịch Đà Lạt', soTienMucTieu: 5000000, daTietKiem: 3400000, han: han(3), mau: '#14946F' },
      { id: 'mt-3', ten: 'Quỹ khẩn cấp', soTienMucTieu: 10000000, daTietKiem: 2500000, han: han(12), mau: '#D79A22' },
    ],
  }
}
