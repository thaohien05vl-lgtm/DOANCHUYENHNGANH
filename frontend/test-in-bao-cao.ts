/// <reference types="node" />
import test from 'node:test'
import assert from 'node:assert/strict'
import { tinhTongHopBaoCao } from './src/utils/baoCaoService.ts'
import type { DanhMuc, GiaoDich, NganSach, Vi } from './src/types/index.ts'
import { dinhDangTien, dinhDangNgay } from './src/utils/dinhDang.ts'

const danhMucMau: DanhMuc[] = [
  { id: 'dm-an-uong', ten: 'Ăn uống', loai: 'chi', bieuTuong: 'Utensils', mau: '#ef4444' },
  { id: 'dm-mua-sam', ten: 'Mua sắm', loai: 'chi', bieuTuong: 'ShoppingBag', mau: '#f59e0b' },
  { id: 'dm-di-lai', ten: 'Di chuyển', loai: 'chi', bieuTuong: 'Car', mau: '#3b82f6' },
  { id: 'dm-luong', ten: 'Tiền lương', loai: 'thu', bieuTuong: 'Wallet', mau: '#10b981' },
  { id: 'dm-thuong', ten: 'Tiền thưởng', loai: 'thu', bieuTuong: 'Gift', mau: '#8b5cf6' },
]

const viMau: Vi[] = [
  { id: 'vi-tien-mat', ten: 'Tiền mặt', loai: 'tien-mat', soDuBanDau: 5000000, mau: '#10b981' },
  { id: 'vi-ngan-hang', ten: 'Tài khoản MB', loai: 'ngan-hang', soDuBanDau: 20000000, mau: '#2563eb' },
]

const giaoDichMau: GiaoDich[] = [
  { id: 'gd-1', loai: 'thu', soTien: 25000000, maDanhMuc: 'dm-luong', maVi: 'vi-ngan-hang', ngay: '2026-11-05', ghiChu: 'Nhận lương tháng 11' },
  { id: 'gd-2', loai: 'thu', soTien: 5000000, maDanhMuc: 'dm-thuong', maVi: 'vi-ngan-hang', ngay: '2026-11-10', ghiChu: 'Thưởng KPI xuất sắc' },
  { id: 'gd-3', loai: 'chi', soTien: 3500000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: '2026-11-06', ghiChu: 'Siêu thị WinMart tuần 1' },
  { id: 'gd-4', loai: 'chi', soTien: 4200000, maDanhMuc: 'dm-an-uong', maVi: 'vi-ngan-hang', ngay: '2026-11-12', ghiChu: 'Ăn tối liên hoan gia đình' },
  { id: 'gd-5', loai: 'chi', soTien: 2800000, maDanhMuc: 'dm-mua-sam', maVi: 'vi-ngan-hang', ngay: '2026-11-08', ghiChu: 'Mua sắm đồ gia dụng Shopee' },
  { id: 'gd-6', loai: 'chi', soTien: 1200000, maDanhMuc: 'dm-di-lai', maVi: 'vi-tien-mat', ngay: '2026-11-09', ghiChu: 'Xăng xe & phí cầu đường' },
]

test('1. Kiểm tra tính toàn vẹn 5 KPIs báo cáo tổng hợp', () => {
  const kq = tinhTongHopBaoCao(giaoDichMau, danhMucMau, viMau, [], {
    ky: 'thang-nay',
    loaiGiaoDich: 'tat-ca',
  })

  // Tổng thu = 25M + 5M = 30M
  assert.equal(kq.tongThu, 30000000)
  // Tổng chi = 3.5M + 4.2M + 2.8M + 1.2M = 11.7M
  assert.equal(kq.tongChi, 11700000)
  // Chênh lệch = 30M - 11.7M = 18.3M
  assert.equal(kq.chenhLech, 18300000)
  assert.equal(kq.tienGiuLai, 18300000)
  // Tỷ lệ tiết kiệm = 18.3 / 30 = 61%
  assert.equal(kq.tiLeTietKiem, 61)
  assert.equal(kq.tiLeTietKiemHienThi, '+61%')
})

test('2. Định dạng tiền tệ VND chuẩn không lỗi font và đúng dấu', () => {
  assert.equal(dinhDangTien(18300000), '18.300.000 ₫')
  assert.equal(dinhDangTien(0), '0 ₫')
  assert.equal(dinhDangTien(405000), '405.000 ₫')
  assert.equal(dinhDangNgay('2026-11-21'), '21/11/2026')
})

test('3. Báo cáo Chi tiêu (Lọc chỉ các khoản chi)', () => {
  const kqChi = tinhTongHopBaoCao(giaoDichMau, danhMucMau, viMau, [], {
    ky: 'thang-nay',
    loaiGiaoDich: 'chi',
  })

  assert.equal(kqChi.tongThu, 0)
  assert.equal(kqChi.tongChi, 11700000)
  assert.equal(kqChi.chenhLech, -11700000)
  assert.equal(kqChi.giaoDichTrongKy.length, 4)
  assert.ok(kqChi.coCauChi.length > 0)
  assert.equal(kqChi.coCauChi[0].danhMuc.id, 'dm-an-uong')
})

test('4. Báo cáo Thu nhập (Lọc chỉ các khoản thu)', () => {
  const kqThu = tinhTongHopBaoCao(giaoDichMau, danhMucMau, viMau, [], {
    ky: 'thang-nay',
    loaiGiaoDich: 'thu',
  })

  assert.equal(kqThu.tongThu, 30000000)
  assert.equal(kqThu.tongChi, 0)
  assert.equal(kqThu.chenhLech, 30000000)
  assert.equal(kqThu.giaoDichTrongKy.length, 2)
  assert.equal(kqThu.coCauChi.length, 0)
})

test('5. Báo cáo theo danh mục cụ thể (Chi tiêu Ăn uống)', () => {
  const kqAnUong = tinhTongHopBaoCao(giaoDichMau, danhMucMau, viMau, [], {
    ky: 'tat-ca',
    loaiGiaoDich: 'tat-ca',
    locDanhMuc: 'dm-an-uong',
  })

  assert.equal(kqAnUong.tongChi, 7700000)
  assert.equal(kqAnUong.giaoDichTrongKy.length, 2)
})

test('6. Báo cáo kỳ rỗng (Không có dữ liệu)', () => {
  const kqRong = tinhTongHopBaoCao([], danhMucMau, viMau, [], {
    ky: 'tat-ca',
    loaiGiaoDich: 'tat-ca',
  })

  assert.equal(kqRong.soLuongGiaoDich, 0)
  assert.equal(kqRong.tongThu, 0)
  assert.equal(kqRong.tongChi, 0)
  assert.equal(kqRong.chenhLech, 0)
  assert.equal(kqRong.tiLeTietKiem, 0)
})

test('7. Tính toán phân trang chuẩn A4 (22 dòng / trang)', () => {
  const taoNhieuGD = (n: number): GiaoDich[] => {
    return Array.from({ length: n }, (_, i) => ({
      id: `gd-${i}`,
      loai: 'chi',
      soTien: 100000,
      maDanhMuc: 'dm-an-uong',
      maVi: 'vi-tien-mat',
      ngay: '2026-11-20',
      ghiChu: `Giao dịch số ${i + 1}`,
    }))
  }

  const ds10 = taoNhieuGD(10)
  const soTrang10 = 2 + Math.ceil(ds10.length / 22)
  assert.equal(soTrang10, 3, '10 giao dịch -> 3 trang A4 (Trang 1 tổng quan, Trang 2 biểu đồ/cơ cấu, Trang 3 bảng kê)')

  const ds45 = taoNhieuGD(45)
  const soTrang45 = 2 + Math.ceil(Math.min(ds45.length, 66) / 22)
  assert.equal(soTrang45, 5, '45 giao dịch -> 5 trang A4')
})
