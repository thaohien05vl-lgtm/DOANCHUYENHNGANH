import React, { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  danhDauDaDoc,
  danhDauTatCaDaDoc,
  layDanhSachThongBao,
  xoaThongBao,
} from '../../services/thongBaoService'
import {
  type ThongBaoNangCao,
  phanGiaiThongBao,
  nhomThongBaoTheoNgay,
} from './thongBaoUtils'
import { ThongBaoCard } from './ThongBaoCard'
import { ThongBaoDetailModal } from './ThongBaoDetailModal'
import { TrangThaiTrong } from './glyphs/TrangThaiTrong'
import { BieuTuongDaDoc, BieuTuongDong } from './glyphs/BieuTuongUI'
import { dangKyNutQuayLai } from '../../utils/nutQuayLai'
import { t } from '../../utils/ngonNgu'
import './notification.css'

export type TabLocThongBao =
  | 'tat-ca'
  | 'chua-doc'
  | 'thu-nhap'
  | 'chi-tieu'
  | 'ngan-sach'
  | 'tiet-kiem'
  | 'khac'

interface Props {
  mo: boolean
  dong: () => void
  onCapNhatSoLuong?: () => void
  onChonGiaoDich?: (transactionId: string) => void
}

/**
 * TRUNG TÂM THÔNG BÁO FINORA (PREMIUM NOTIFICATION CENTER)
 * - Tích hợp hệ thống Finora Finance Glyph độc quyền.
 * - Header cao cấp với số lượng chưa đọc và phụ đề trạng thái.
 * - Bộ lọc tab cuộn ngang linh hoạt.
 * - Phân nhóm thời gian: Hôm nay, Hôm qua, Trước đó.
 * - Thẻ thông báo 3 hàng + CTA ngăn nắp, chống rớt dòng tuyệt đối.
 * - Tương thích hoàn chỉnh 15 Theme, Light Mode và Dark Mode.
 */
export function TrungTamThongBao({ mo, dong, onCapNhatSoLuong, onChonGiaoDich }: Props) {
  const [danhSach, setDanhSach] = useState<ThongBaoNangCao[]>([])
  const [dangTai, setDangTai] = useState(true)
  const [tabHienTai, setTabHienTai] = useState<TabLocThongBao>('tat-ca')
  const [chiTiet, setChiTiet] = useState<ThongBaoNangCao | null>(null)
  const navigate = useNavigate()

  // Khóa cuộn trang khi mở modal & hỗ trợ phím Escape + nút Back Android
  useEffect(() => {
    if (!mo) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (chiTiet) setChiTiet(null)
        else dong()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    const huyBack = dangKyNutQuayLai(() => {
      if (chiTiet) setChiTiet(null)
      else dong()
    })
    const overflowCu = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      huyBack()
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowCu
    }
  }, [mo, dong, chiTiet])

  // Tải danh sách thông báo từ API máy chủ
  useEffect(() => {
    if (!mo) return
    let active = true
    layDanhSachThongBao()
      .then((data) => {
        if (!active) return
        const nangCao = (data || []).map(phanGiaiThongBao)
        setDanhSach(nangCao)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setDangTai(false)
      })
    return () => {
      active = false
    }
  }, [mo])

  // Xử lý khi nhấn vào thông báo: Đánh dấu đã đọc và mở modal chi tiết
  const xuLyNhanThongBao = async (item: ThongBaoNangCao) => {
    if (!item.read) {
      danhDauDaDoc(item.id).catch(() => undefined)
      setDanhSach((cu) =>
        cu.map((tb) => (tb.id === item.id ? { ...tb, read: true } : tb)),
      )
      onCapNhatSoLuong?.()
    }
    setChiTiet(item)
  }

  // Điều hướng tới giao dịch liên quan
  const xuLyXemGiaoDich = (transactionId: string) => {
    setChiTiet(null)
    dong()
    if (onChonGiaoDich) {
      onChonGiaoDich(transactionId)
    } else {
      navigate(`/giao-dich?id=${transactionId}`)
    }
  }

  // Điều hướng chuyên trang từ thông báo (Mục tiêu, Ngân sách...)
  const xuLyDieuHuong = (duongDan: string) => {
    setChiTiet(null)
    dong()
    navigate(duongDan)
  }

  // Xử lý đánh dấu tất cả đã đọc
  const xuLyDocTatCa = async () => {
    await danhDauTatCaDaDoc().catch(() => undefined)
    setDanhSach((cu) => cu.map((tb) => ({ ...tb, read: true })))
    onCapNhatSoLuong?.()
  }

  // Xử lý xóa một thông báo (chỉ xóa bản ghi thông báo, không xóa giao dịch gốc)
  const xuLyXoa = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await xoaThongBao(id).catch(() => undefined)
    setDanhSach((cu) => cu.filter((tb) => tb.id !== id))
    if (chiTiet?.id === id) setChiTiet(null)
    onCapNhatSoLuong?.()
  }

  // Đếm số lượng thông báo theo từng nhóm lọc
  const soLuong = useMemo(() => {
    const dem = {
      tatCa: danhSach.length,
      chuaDoc: 0,
      thuNhap: 0,
      chiTieu: 0,
      nganSach: 0,
      tietKiem: 0,
      khac: 0,
    }
    for (const item of danhSach) {
      if (!item.read) dem.chuaDoc++
      const g = item.glyphType
      if (g === 'INCOME') dem.thuNhap++
      else if (g === 'EXPENSE') dem.chiTieu++
      else if (g === 'BUDGET' || g === 'ALERT') dem.nganSach++
      else if (g === 'SAVINGS') dem.tietKiem++
      else dem.khac++
    }
    return dem
  }, [danhSach])

  // Lọc danh sách theo tab đang chọn
  const danhSachLoc = useMemo(() => {
    return danhSach.filter((item) => {
      const g = item.glyphType
      switch (tabHienTai) {
        case 'chua-doc':
          return !item.read
        case 'thu-nhap':
          return g === 'INCOME'
        case 'chi-tieu':
          return g === 'EXPENSE'
        case 'ngan-sach':
          return g === 'BUDGET' || g === 'ALERT'
        case 'tiet-kiem':
          return g === 'SAVINGS'
        case 'khac':
          return (
            g === 'TRANSFER' ||
            g === 'RECURRING' ||
            g === 'REFUND' ||
            g === 'STATEMENT' ||
            g === 'REMINDER'
          )
        default:
          return true
      }
    })
  }, [danhSach, tabHienTai])

  // Nhóm danh sách theo thời gian
  const danhSachNhom = useMemo(() => nhomThongBaoTheoNgay(danhSachLoc), [danhSachLoc])

  if (!mo || typeof document === 'undefined') return null

  return createPortal(
    <>
      <div
        className="finora-notif-backdrop"
        role="presentation"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) dong()
        }}
      >
        <div
          className="finora-notif-sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t('Trung tâm thông báo tài chính Finora')}
        >
          {/* ========================================================
              1. PHẦN HEADER CAO CẤP
              ======================================================== */}
          <div className="finora-notif-header">
            <div className="finora-notif-header__left">
              <div className="finora-notif-header__title-row">
                <h2 className="finora-notif-header__title">{t('Thông báo')}</h2>
                {soLuong.chuaDoc > 0 && (
                  <span
                    className="finora-notif-header__badge"
                    title={t('{0} thông báo chưa đọc', [soLuong.chuaDoc])}
                  >
                    {soLuong.chuaDoc}
                  </span>
                )}
              </div>
              <p className="finora-notif-header__subtitle">
                {soLuong.chuaDoc > 0
                  ? t('Bạn có {0} thông báo chưa đọc', [soLuong.chuaDoc])
                  : t('Bạn đã cập nhật tất cả thông báo')}
              </p>
            </div>

            <div className="finora-notif-header__right">
              {soLuong.chuaDoc > 0 && (
                <button
                  type="button"
                  className="finora-notif-btn-read-all"
                  onClick={xuLyDocTatCa}
                  aria-label={t('Đánh dấu tất cả đã đọc')}
                >
                  <BieuTuongDaDoc size={14} />
                  <span>{t('Đã đọc tất cả')}</span>
                </button>
              )}
              <button
                type="button"
                className="finora-notif-btn-close"
                onClick={dong}
                aria-label={t('Đóng')}
              >
                <BieuTuongDong size={18} />
              </button>
            </div>
          </div>

          {/* ========================================================
              2. BỘ LỌC THÔNG BÁO (HORIZONTAL SCROLL PILLS)
              ======================================================== */}
          <div className="finora-notif-tabs-wrap">
            <div className="finora-notif-tabs" role="tablist" aria-label={t('Bộ lọc thông báo')}>
              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'tat-ca'}
                className={`finora-notif-tab ${tabHienTai === 'tat-ca' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('tat-ca')}
              >
                <span>{t('Tất cả')}</span>
                <span className="finora-notif-tab__count">{soLuong.tatCa}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'chua-doc'}
                className={`finora-notif-tab ${tabHienTai === 'chua-doc' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('chua-doc')}
              >
                <span>{t('Chưa đọc')}</span>
                {soLuong.chuaDoc > 0 && (
                  <span className="finora-notif-tab__count">{soLuong.chuaDoc}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'thu-nhap'}
                className={`finora-notif-tab ${tabHienTai === 'thu-nhap' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('thu-nhap')}
              >
                <span>{t('Thu nhập')}</span>
                {soLuong.thuNhap > 0 && (
                  <span className="finora-notif-tab__count">{soLuong.thuNhap}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'chi-tieu'}
                className={`finora-notif-tab ${tabHienTai === 'chi-tieu' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('chi-tieu')}
              >
                <span>{t('Chi tiêu')}</span>
                {soLuong.chiTieu > 0 && (
                  <span className="finora-notif-tab__count">{soLuong.chiTieu}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'ngan-sach'}
                className={`finora-notif-tab ${tabHienTai === 'ngan-sach' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('ngan-sach')}
              >
                <span>{t('Ngân sách')}</span>
                {soLuong.nganSach > 0 && (
                  <span className="finora-notif-tab__count">{soLuong.nganSach}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'tiet-kiem'}
                className={`finora-notif-tab ${tabHienTai === 'tiet-kiem' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('tiet-kiem')}
              >
                <span>{t('Tiết kiệm')}</span>
                {soLuong.tietKiem > 0 && (
                  <span className="finora-notif-tab__count">{soLuong.tietKiem}</span>
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={tabHienTai === 'khac'}
                className={`finora-notif-tab ${tabHienTai === 'khac' ? 'finora-notif-tab--active' : ''}`}
                onClick={() => setTabHienTai('khac')}
              >
                <span>{t('Khác')}</span>
                {soLuong.khac > 0 && (
                  <span className="finora-notif-tab__count">{soLuong.khac}</span>
                )}
              </button>
            </div>
          </div>

          {/* ========================================================
              3. DANH SÁCH THÔNG BÁO THEO NHÓM THỜI GIAN
              ======================================================== */}
          <div className="finora-notif-body">
            {dangTai ? (
              <div className="finora-notif-loading">
                <span className="finora-notif-loading__badge">
                  {t('Đang đồng bộ dữ liệu…')}
                </span>
              </div>
            ) : danhSachLoc.length === 0 ? (
              /* Trạng thái rỗng cao cấp với hình minh họa thiên thể tự vẽ */
              <div className="finora-notif-empty">
                <TrangThaiTrong size={145} className="finora-notif-empty__svg" />
                <h3 className="finora-notif-empty__title">
                  {tabHienTai === 'chua-doc'
                    ? t('Bạn đã cập nhật tất cả')
                    : t('Chưa có thông báo nào')}
                </h3>
                <p className="finora-notif-empty__desc">
                  {tabHienTai === 'chua-doc'
                    ? t('Không có thông báo mới cần xử lý. Dòng tiền và tài chính của bạn đang hoàn toàn ổn định.')
                    : t('Mọi giao dịch thu chi, cảnh báo ngân sách và mục tiêu tích luỹ sẽ tự động xuất hiện tại đây.')}
                </p>
              </div>
            ) : (
              danhSachNhom.map((nhom) => (
                <div className="finora-notif-group" key={nhom.nhan}>
                  <div className="finora-notif-group__header">
                    <span className="finora-notif-group__title">{nhom.nhan}</span>
                    <span className="finora-notif-group__line" />
                  </div>
                  {nhom.items.map((item) => (
                    <ThongBaoCard
                      key={item.id}
                      item={item}
                      onNhan={xuLyNhanThongBao}
                      onXoa={xuLyXoa}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal xem toàn văn chi tiết thông báo */}
      <ThongBaoDetailModal
        item={chiTiet}
        dong={() => setChiTiet(null)}
        onXemGiaoDich={xuLyXemGiaoDich}
        onDieuHuong={xuLyDieuHuong}
      />
    </>,
    document.body,
  )
}
