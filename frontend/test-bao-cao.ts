/// <reference types="node" />
import test from 'node:test'
import assert from 'node:assert/strict'
import { tinhTongHopBaoCao } from './src/utils/baoCaoService.ts'
import type { DanhMuc, GiaoDich, NganSach, Vi } from './src/types/index.ts'

const danhMucMau: DanhMuc[] = [
  { id: 'dm-an-uong', ten: 'Ăn uống', loai: 'chi', bieuTuong: 'Utensils', mau: '#ef4444' },
  { id: 'dm-mua-sam', ten: 'Mua sắm', loai: 'chi', bieuTuong: 'ShoppingBag', mau: '#f59e0b' },
  { id: 'dm-luong', ten: 'Tiền lương', loai: 'thu', bieuTuong: 'Wallet', mau: '#10b981' },
]

const viMau: Vi[] = [
  { id: 'vi-tien-mat', ten: 'Tiền mặt', loai: 'tien-mat', soDuBanDau: 2000000, mau: '#10b981' },
]

test('1. Thu nhập lớn hơn Chi tiêu (Thặng dư tài chính)', () => {
  const gd: GiaoDich[] = [
    { id: '1', loai: 'thu', soTien: 15000000, maDanhMuc: 'dm-luong', maVi: 'vi-tien-mat', ngay: '2026-11-01', ghiChu: 'Lương' },
    { id: '2', loai: 'chi', soTien: 10000000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: '2026-11-05', ghiChu: 'Ăn uống' },
  ]

  const kq = tinhTongHopBaoCao(gd, danhMucMau, viMau, [], { ky: 'tat-ca', loaiGiaoDich: 'tat-ca' })

  assert.equal(kq.tongThu, 15000000)
  assert.equal(kq.tongChi, 10000000)
  assert.equal(kq.chenhLech, 5000000)
  assert.equal(kq.tienGiuLai, 5000000)
  assert.equal(kq.tiLeTietKiem, 33) // (15M - 10M) / 15M = 33.3%
  assert.equal(kq.tiLeTietKiemHienThi, '+33%')
})

test('2. Chi tiêu lớn hơn Thu nhập (Thâm hụt - Tỷ lệ âm không bị ép về 0)', () => {
  const gd: GiaoDich[] = [
    { id: '1', loai: 'thu', soTien: 12000000, maDanhMuc: 'dm-luong', maVi: 'vi-tien-mat', ngay: '2026-11-01', ghiChu: 'Thu' },
    { id: '2', loai: 'chi', soTien: 14000000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: '2026-11-05', ghiChu: 'Chi' },
  ]

  const kq = tinhTongHopBaoCao(gd, danhMucMau, viMau, [], { ky: 'tat-ca', loaiGiaoDich: 'tat-ca' })

  assert.equal(kq.tongThu, 12000000)
  assert.equal(kq.tongChi, 14000000)
  assert.equal(kq.chenhLech, -2000000)
  assert.equal(kq.tienGiuLai, -2000000)
  assert.equal(kq.tiLeTietKiem, -17) // -2M / 12M = -16.67% -> -17%
  assert.ok(kq.tiLeTietKiem < 0, 'Tỷ lệ tiết kiệm phải là số âm khi chi > thu')
})

test('3. Dữ liệu thực tế: Chỉ có Chi tiêu, Thu nhập = 0 (Bội chi toàn phần)', () => {
  const gd: GiaoDich[] = [
    { id: '1', loai: 'chi', soTien: 150000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: '2026-11-08', ghiChu: 'Highland' },
    { id: '2', loai: 'chi', soTien: 103000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: '2026-11-09', ghiChu: 'GS25' },
    { id: '3', loai: 'chi', soTien: 103000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: '2026-11-09', ghiChu: 'GS25' },
  ]

  const kq = tinhTongHopBaoCao(gd, danhMucMau, viMau, [], { ky: 'tat-ca', loaiGiaoDich: 'tat-ca' })

  assert.equal(kq.tongThu, 0)
  assert.equal(kq.tongChi, 356000)
  assert.equal(kq.chenhLech, -356000)
  assert.equal(kq.tienGiuLai, -356000)
  assert.equal(kq.tiLeTietKiem, -100)
  assert.ok(kq.tiLeTietKiemHienThi.includes('-100%'), 'Phải hiển thị rõ -100% khi thu=0 và chi>0')
})

test('4. Trường hợp không có giao dịch (Kỳ rỗng)', () => {
  const kq = tinhTongHopBaoCao([], danhMucMau, viMau, [], { ky: 'tat-ca', loaiGiaoDich: 'tat-ca' })

  assert.equal(kq.soLuongGiaoDich, 0)
  assert.equal(kq.tongThu, 0)
  assert.equal(kq.tongChi, 0)
  assert.equal(kq.chenhLech, 0)
  assert.equal(kq.tienGiuLai, 0)
  assert.equal(kq.tiLeTietKiem, 0)
})

test('5. Cảnh báo vượt ngân sách thực tế', () => {
  const homNay = new Date().toISOString().slice(0, 10)
  const gd: GiaoDich[] = [
    { id: '1', loai: 'chi', soTien: 3500000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: homNay, ghiChu: 'Tiệc' },
  ]
  const ns: NganSach[] = [
    { id: 'ns-1', maDanhMuc: 'dm-an-uong', hanMuc: 3000000 },
  ]

  const kq = tinhTongHopBaoCao(gd, danhMucMau, viMau, ns, { ky: 'thang-nay', loaiGiaoDich: 'tat-ca' })

  assert.equal(kq.canhBaoNganSach.length, 1)
  assert.equal(kq.canhBaoNganSach[0].loai, 'canh-bao')
  assert.equal(kq.canhBaoNganSach[0].chenhLech, 500000)
  assert.ok(kq.canhBaoNganSach[0].noiDung.includes('vượt ngân sách 500.000 ₫'))
})

test('6. Nhắc nhở ngân sách khi chạm ngưỡng 80% (chưa vượt)', () => {
  const homNay = new Date().toISOString().slice(0, 10)
  const gd: GiaoDich[] = [
    { id: '1', loai: 'chi', soTien: 2550000, maDanhMuc: 'dm-an-uong', maVi: 'vi-tien-mat', ngay: homNay, ghiChu: 'Ăn uống' },
  ]
  const ns: NganSach[] = [
    { id: 'ns-1', maDanhMuc: 'dm-an-uong', hanMuc: 3000000 }, // 2.55M / 3M = 85%
  ]

  const kq = tinhTongHopBaoCao(gd, danhMucMau, viMau, ns, { ky: 'thang-nay', loaiGiaoDich: 'tat-ca' })

  assert.equal(kq.canhBaoNganSach.length, 1)
  assert.equal(kq.canhBaoNganSach[0].loai, 'nhac-nho')
  assert.equal(kq.canhBaoNganSach[0].phanTram, 85)
  assert.ok(kq.canhBaoNganSach[0].noiDung.includes('85%'))
})
