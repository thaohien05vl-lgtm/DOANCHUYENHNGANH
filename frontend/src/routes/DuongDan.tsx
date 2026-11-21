import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { BoCuc } from '../components/bo-cuc/BoCuc'
import { ErrorBoundary } from '../components/chung/ErrorBoundary'

const BaoCao = lazy(() => import('../pages/BaoCao').then((m) => ({ default: m.BaoCao })))
const CaNhan = lazy(() => import('../pages/CaNhan').then((m) => ({ default: m.CaNhan })))
const ChuDeTrang = lazy(() => import('../pages/ChuDeTrang').then((m) => ({ default: m.ChuDeTrang })))
const DangKy = lazy(() => import('../pages/XacThuc').then((m) => ({ default: m.DangKy })))
const DangNhap = lazy(() => import('../pages/XacThuc').then((m) => ({ default: m.DangNhap })))
const QuenMatKhau = lazy(() => import('../pages/XacThuc').then((m) => ({ default: m.QuenMatKhau })))
const DanhMucTrang = lazy(() => import('../pages/DanhMuc').then((m) => ({ default: m.DanhMucTrang })))
const GiaoDichTrang = lazy(() => import('../pages/GiaoDich').then((m) => ({ default: m.GiaoDichTrang })))
const HoaDonAI = lazy(() => import('../pages/HoaDonAI').then((m) => ({ default: m.HoaDonAI })))
const MucTieuTrang = lazy(() => import('../pages/MucTieu').then((m) => ({ default: m.MucTieuTrang })))
const HoSo = lazy(() => import('../pages/HoSo').then((m) => ({ default: m.HoSo })))
const KhoanhKhac = lazy(() => import('../pages/KhoanhKhac').then((m) => ({ default: m.KhoanhKhac })))
const NganSachTrang = lazy(() => import('../pages/NganSach').then((m) => ({ default: m.NganSachTrang })))
const TongQuan = lazy(() => import('../pages/TongQuan').then((m) => ({ default: m.TongQuan })))
const TroLyAI = lazy(() => import('../pages/TroLyAI').then((m) => ({ default: m.TroLyAI })))
const ViTien = lazy(() => import('../pages/ViTien').then((m) => ({ default: m.ViTien })))

export function DuongDan() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div style={{ minHeight: '100dvh' }} />}>
        <Routes>
          <Route path="/dang-nhap" element={<DangNhap />} />
          <Route path="/dang-ky" element={<DangKy />} />
          <Route path="/quen-mat-khau" element={<QuenMatKhau />} />
          <Route element={<BoCuc />}>
            <Route index element={<TongQuan />} />
            <Route path="giao-dich" element={<GiaoDichTrang />} />
            <Route path="vi-tien" element={<ViTien />} />
            <Route path="danh-muc" element={<DanhMucTrang />} />
            <Route path="ngan-sach" element={<NganSachTrang />} />
            <Route path="muc-tieu" element={<MucTieuTrang />} />
            <Route path="bao-cao" element={<BaoCao />} />
            <Route path="hoa-don" element={<HoaDonAI />} />
            <Route path="tro-ly" element={<TroLyAI />} />
            <Route path="ca-nhan" element={<CaNhan />} />
            <Route path="cai-dat" element={<CaNhan />} />
            <Route path="chu-de" element={<ChuDeTrang />} />
            <Route path="ho-so" element={<HoSo />} />
            <Route path="khoanh-khac" element={<KhoanhKhac />} />
            <Route path="*" element={<TongQuan />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
