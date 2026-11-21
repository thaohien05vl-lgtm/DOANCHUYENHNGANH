/// <reference types="node" />
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import test from 'node:test'
// @ts-ignore
import assert from 'node:assert/strict'
import {
  formatTien,
  phanGiaiThongBao,
  dinhDangThoiGianGon,
  nhomThongBaoTheoNgay,
} from './src/components/thong-bao/thongBaoUtils'
import type { ThongBao } from './src/types'

test('1. Định dạng số tiền kiểu Việt Nam', () => {
  assert.equal(formatTien(103000), '103.000đ')
  assert.equal(formatTien(5000000), '5.000.000đ')
  assert.equal(formatTien(0), '0đ')
  assert.equal(formatTien(null), '')
})

test('2. Phân giải thông báo thu nhập mới với trường cấu trúc', () => {
  const tb: ThongBao = {
    id: 'tb-1',
    transactionId: 'tx-1',
    type: 'giao_dich_thu',
    title: 'Giao dịch thu nhập thành công',
    content: 'Bạn vừa ghi nhận khoản thu 5.000.000đ từ Lương vào ví Tiền mặt.',
    read: false,
    createdAt: new Date().toISOString(),
    amount: 5000000,
    categoryName: 'Lương',
    walletName: 'Tiền mặt',
  }

  const res = phanGiaiThongBao(tb)
  assert.equal(res.glyphType, 'INCOME')
  assert.equal(res.loaiSoTien, 'thu')
  assert.equal(res.soTienHienThi, '+5.000.000đ')
  assert.equal(res.tenDanhMucHienThi, 'Lương')
  assert.equal(res.tenViHienThi, 'Tiền mặt')
})

test('3. Phân giải thông báo chi tiêu cũ (fallback từ regex content)', () => {
  const tb: ThongBao = {
    id: 'tb-2',
    transactionId: 'tx-2',
    type: 'giao_dich_chi',
    title: 'Giao dịch chi tiêu thành công',
    content: 'Bạn vừa ghi nhận khoản chi 103.000đ cho Ăn uống từ ví Tiền mặt.',
    read: true,
    createdAt: new Date().toISOString(),
  }

  const res = phanGiaiThongBao(tb)
  assert.equal(res.glyphType, 'EXPENSE')
  assert.equal(res.loaiSoTien, 'chi')
  assert.equal(res.soTienHienThi, '-103.000đ')
  assert.equal(res.tenDanhMucHienThi, 'Ăn uống')
  assert.equal(res.tenViHienThi, 'Tiền mặt')
})

test('4. Phân giải thông báo cảnh báo ngân sách và vượt mức', () => {
  const tb: ThongBao = {
    id: 'tb-3',
    transactionId: null,
    type: 'ngan_sach_canh_bao',
    title: 'Cảnh báo ngân sách 80%: Ăn uống (2026-11)',
    content: 'Bạn đã sử dụng 80% ngân sách cho danh mục Ăn uống trong tháng này (4.000.000đ / 5.000.000đ).',
    read: false,
    createdAt: new Date().toISOString(),
  }

  const res = phanGiaiThongBao(tb)
  assert.equal(res.glyphType, 'BUDGET')
  assert.equal(res.loaiSoTien, 'ngan-sach')
  assert.equal(res.soTienHienThi, '4.000.000đ / 5.000.000đ')

  const tbVuot: ThongBao = {
    id: 'tb-vuot',
    type: 'ngan_sach_canh_bao',
    title: 'Cảnh báo vượt ngân sách: Mua sắm (2026-11)',
    content: 'Chi tiêu đạt 6.000.000đ, vượt ngân sách 5.000.000đ.',
    read: false,
    createdAt: new Date().toISOString(),
    amount: 6000000,
    metadata: '5000000',
  }
  const resVuot = phanGiaiThongBao(tbVuot)
  assert.equal(resVuot.glyphType, 'ALERT')
  assert.equal(resVuot.loaiSoTien, 'ngan-sach')
  assert.equal(resVuot.soTienHienThi, '6.000.000đ / 5.000.000đ')
  assert.equal(resVuot.tienTrinhNganSach?.phanTram, 100)
})

test('5. Phân giải thông báo chuyển tiền, hoàn tiền, định kỳ, tiết kiệm', () => {
  // Chuyển tiền
  const tbChuyen = phanGiaiThongBao({
    id: 'c1',
    type: 'giao_dich_chuyen_tien',
    title: 'Chuyển tiền thành công',
    content: 'Chuyển 500.000đ từ Ví A sang Ví B',
    read: false,
    createdAt: new Date().toISOString(),
    amount: 500000,
  })
  assert.equal(tbChuyen.glyphType, 'TRANSFER')
  assert.equal(tbChuyen.loaiSoTien, 'chuyen-tien')
  assert.equal(tbChuyen.soTienHienThi, '500.000đ')

  // Hoàn tiền
  const tbHoan = phanGiaiThongBao({
    id: 'h1',
    type: 'giao_dich_hoan_tien',
    title: 'Hoàn tiền thành công',
    content: 'Hoàn lại 50.000đ',
    read: false,
    createdAt: new Date().toISOString(),
    amount: 50000,
  })
  assert.equal(tbHoan.glyphType, 'REFUND')
  assert.equal(tbHoan.loaiSoTien, 'hoan-tien')
  assert.equal(tbHoan.soTienHienThi, '+50.000đ')

  // Giao dịch định kỳ
  const tbDinhKy = phanGiaiThongBao({
    id: 'd1',
    type: 'giao_dich_dinh_ky',
    title: 'Giao dịch định kỳ: Chi tiêu',
    content: 'Thanh toán tiền điện',
    read: false,
    createdAt: new Date().toISOString(),
    amount: 250000,
  })
  assert.equal(tbDinhKy.glyphType, 'RECURRING')
  assert.equal(tbDinhKy.loaiSoTien, 'chi')
  assert.equal(tbDinhKy.soTienHienThi, '-250.000đ')

  // Mục tiêu tiết kiệm
  const tbTietKiem = phanGiaiThongBao({
    id: 's1',
    type: 'tiet_kiem_muc_tieu',
    title: 'Đạt mục tiêu tích luỹ: Mua laptop',
    content: 'Đạt 100% mục tiêu',
    read: false,
    createdAt: new Date().toISOString(),
    amount: 20000000,
    metadata: '20000000',
  })
  assert.equal(tbTietKiem.glyphType, 'SAVINGS')
  assert.equal(tbTietKiem.loaiSoTien, 'tiet-kiem')
})

test('6. Định dạng thời gian gọn gàng không ngắt dòng', () => {
  const bayGio = new Date().toISOString()
  assert.equal(dinhDangThoiGianGon(bayGio), 'Vừa xong')

  const muoiPhutTruoc = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  assert.match(dinhDangThoiGianGon(muoiPhutTruoc), /10 phút trước/)
})

test('7. Nhóm thông báo theo ngày: Hôm nay, Hôm qua, Trước đó', () => {
  const bayGio = new Date().toISOString()
  const homQua = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const baNgayTruoc = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()

  const ds = [
    phanGiaiThongBao({ id: '1', type: 'thu', title: 'Thu', content: 'c1', read: false, createdAt: bayGio }),
    phanGiaiThongBao({ id: '2', type: 'chi', title: 'Chi', content: 'c2', read: true, createdAt: homQua }),
    phanGiaiThongBao({ id: '3', type: 'chi', title: 'Chi 3', content: 'c3', read: true, createdAt: baNgayTruoc }),
  ]

  const nhom = nhomThongBaoTheoNgay(ds)
  assert.equal(nhom.length, 3)
  assert.equal(nhom[0].nhan, 'Hôm nay')
  assert.equal(nhom[1].nhan, 'Hôm qua')
  assert.equal(nhom[2].nhan, 'Trước đó')
})
