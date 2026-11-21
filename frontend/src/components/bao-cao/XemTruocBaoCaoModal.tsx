import { useEffect, useMemo, useRef, useState } from 'react'
import type { KetQuaBaoCaoChuanHoa } from '../../utils/baoCaoService'
import type { DanhMuc, Vi } from '../../types'
import { t } from '../../utils/ngonNgu'
import './bao-cao.css'
import { TaiLieuBaoCaoA4 } from './TaiLieuBaoCaoA4'
import { ThanhCongCuBaoCao } from './ThanhCongCuBaoCao'

interface XemTruocBaoCaoModalProps {
  mo: boolean
  dong: () => void
  baoCao: KetQuaBaoCaoChuanHoa
  danhMuc: DanhMuc[]
  vi: Vi[]
  tenNguoiDung?: string
  emailNguoiDung?: string
  tieuDeBaoCao?: string
}

export function XemTruocBaoCaoModal({
  mo,
  dong,
  baoCao,
  danhMuc,
  vi,
  tenNguoiDung,
  emailNguoiDung,
  tieuDeBaoCao,
}: XemTruocBaoCaoModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [kichThuocContainer, setKichThuocContainer] = useState({ rong: 800, cao: 600 })
  const [cheDoZoom, setCheDoZoom] = useState<'vua-chieu-rong' | 'vua-toan-trang' | 'tuy-chinh'>('vua-chieu-rong')
  const [mucZoomTuyChinh, setMucZoomTuyChinh] = useState<number>(1)
  const [trangHienTai, setTrangHienTai] = useState(1)

  // Chiều rộng chuẩn của 1 trang A4 tính theo px (210mm @ 96DPI = ~794px)
  const CHIEU_RONG_A4 = 794
  const CHIEU_CAO_A4 = 1123
  const KHOANG_CACH_TRANG = 28

  // Theo dõi resize của viewport / container để tự động scale Fit Width
  useEffect(() => {
    if (!mo) return

    function capNhatKichThuoc() {
      if (containerRef.current) {
        setKichThuocContainer({
          rong: containerRef.current.clientWidth,
          cao: containerRef.current.clientHeight,
        })
      }
    }

    capNhatKichThuoc()
    window.addEventListener('resize', capNhatKichThuoc)

    // Khóa cuộn trang nền khi mở modal xem trước
    const overflowCu = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Lắng nghe phím tắt (Escape đóng modal, +/- zoom)
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        dong()
      } else if (e.key === '+' || (e.ctrlKey && e.key === '=')) {
        e.preventDefault()
        setCheDoZoom('tuy-chinh')
        setMucZoomTuyChinh((prev) => Math.min(2.0, Number((prev + 0.1).toFixed(2))))
      } else if (e.key === '-' || (e.ctrlKey && e.key === '-')) {
        e.preventDefault()
        setCheDoZoom('tuy-chinh')
        setMucZoomTuyChinh((prev) => Math.max(0.3, Number((prev - 0.1).toFixed(2))))
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('resize', capNhatKichThuoc)
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowCu
    }
  }, [mo, dong])

  // Tính toán scale factor theo chế độ
  const scale = useMemo(() => {
    const demNgang = kichThuocContainer.rong < 640 ? 16 : 40
    const demDoc = kichThuocContainer.rong < 640 ? 16 : 40
    const chieuRongKhaDung = Math.max(260, kichThuocContainer.rong - demNgang)
    const chieuCaoKhaDung = Math.max(300, kichThuocContainer.cao - demDoc)

    if (cheDoZoom === 'vua-chieu-rong') {
      const tyLeRong = chieuRongKhaDung / CHIEU_RONG_A4
      // Trên desktop không phóng quá 1.1x để tránh vỡ nét chữ
      return kichThuocContainer.rong > 900 ? Math.min(1.0, tyLeRong) : Math.min(1.0, tyLeRong)
    }

    if (cheDoZoom === 'vua-toan-trang') {
      const tyLeRong = chieuRongKhaDung / CHIEU_RONG_A4
      const tyLeCao = chieuCaoKhaDung / CHIEU_CAO_A4
      return Math.min(tyLeRong, tyLeCao, 1.0)
    }

    return mucZoomTuyChinh
  }, [cheDoZoom, mucZoomTuyChinh, kichThuocContainer])

  // Tính số lượng trang thực tế
  const soLuongGiaoDich = baoCao.giaoDichTrongKy.length
  const soTrangGiaoDich = soLuongGiaoDich > 0 ? Math.ceil(Math.min(soLuongGiaoDich, 66) / 22) : 0
  const tongSoTrang = 2 + soTrangGiaoDich
  const tongChieuCaoA4 = tongSoTrang * CHIEU_CAO_A4 + (tongSoTrang - 1) * KHOANG_CACH_TRANG

  // Cuộn đến trang được chọn
  function xuLyChuyenTrang(trangMoi: number) {
    if (trangMoi < 1 || trangMoi > tongSoTrang) return
    setTrangHienTai(trangMoi)
    if (containerRef.current) {
      const viTriTrangY = (trangMoi - 1) * (CHIEU_CAO_A4 + KHOANG_CACH_TRANG) * scale
      containerRef.current.scrollTo({ top: viTriTrangY, behavior: 'smooth' })
    }
  }

  // Phóng to / Thu nhỏ theo nấc
  function xuLyThuNho() {
    setCheDoZoom('tuy-chinh')
    setMucZoomTuyChinh((prev) => Math.max(0.3, Number((prev - 0.1).toFixed(2))))
  }

  function xuLyPhongTo() {
    setCheDoZoom('tuy-chinh')
    setMucZoomTuyChinh((prev) => Math.min(2.0, Number((prev + 0.1).toFixed(2))))
  }

  function xuLyInBaoCao() {
    window.print()
  }

  function xuLyLuuPdf() {
    // Trên Chromium / Safari / Android WebView, window.print() tích hợp sẵn tùy chọn "Lưu dưới dạng PDF"
    window.print()
  }

  if (!mo) return null

  return (
    <div
      className="modal-xem-truoc-bao-cao"
      role="dialog"
      aria-modal="true"
      aria-label={t('Xem trước & Xuất báo cáo PDF')}
    >
      {/* 1. Thanh công cụ điều khiển tương tác */}
      <ThanhCongCuBaoCao
        tieuDe={tieuDeBaoCao || t('Báo cáo tài chính')}
        moTa={baoCao.tieuDeKy}
        mucZoom={scale}
        cheDoZoom={cheDoZoom}
        onThuNho={xuLyThuNho}
        onPhongTo={xuLyPhongTo}
        onVuaChieuRong={() => setCheDoZoom('vua-chieu-rong')}
        onVuaToanTrang={() => setCheDoZoom('vua-toan-trang')}
        onDatMucZoom={(zoom) => {
          setCheDoZoom('tuy-chinh')
          setMucZoomTuyChinh(zoom)
        }}
        trangHienTai={trangHienTai}
        tongSoTrang={tongSoTrang}
        onChuyenTrang={xuLyChuyenTrang}
        onInBaoCao={xuLyInBaoCao}
        onLuuPdf={xuLyLuuPdf}
        onDong={dong}
      />

      {/* 2. Vùng xem trước thích ứng (Viewport Container) */}
      <div ref={containerRef} className="vung-xem-truoc-tai-lieu">
        {/*
          Khung chứa kích thước thật sau khi scale:
          Chiều rộng = 794 * scale px
          Chiều cao = tongChieuCaoA4 * scale px
          -> Đảm bảo trên điện thoại 320px - 430px KHÔNG BAO GIỜ bị tràn ngang!
        */}
        <div
          style={{
            width: `${Math.round(CHIEU_RONG_A4 * scale)}px`,
            minHeight: `${Math.round(tongChieuCaoA4 * scale)}px`,
            position: 'relative',
            margin: '0 auto',
          }}
        >
          <div
            className="khung-chua-trang-a4"
            style={{
              width: `${CHIEU_RONG_A4}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <TaiLieuBaoCaoA4
              baoCao={baoCao}
              danhMuc={danhMuc}
              vi={vi}
              tenNguoiDung={tenNguoiDung}
              emailNguoiDung={emailNguoiDung}
              tieuDeBaoCaoTuyChon={tieuDeBaoCao}
              baoGomBangKeGiaoDich={soTrangGiaoDich > 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
