import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  Pencil,
  PiggyBank,
  Plus,
  RotateCcw,
  Trash2,
  TriangleAlert,
  ArrowLeft,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ONhanDienDanhMuc } from '../components/chung/BieuTuong'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { OTien } from '../components/chung/OTien'
import { VongTienDo } from '../components/chung/VongTienDo'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { NganSach } from '../types'
import { congThang, dinhDangTien, nhanThang, thangHienTai } from '../utils/dinhDang'
import { theoThang } from '../utils/thongKe'
import { t, dichTen } from '../utils/ngonNgu'
import './NganSach.css'

export function NganSachTrang() {
  const { nganSach, danhMuc, giaoDich, luu, xoa } = useDuLieu()
  const { thongBao, anSoDu } = useGiaoDien()
  const navigate = useNavigate()

  // Kỳ tháng đang xem: mặc định là tháng hiện tại của hệ thống (YYYY-MM)
  const thangHeThong = useMemo(() => thangHienTai(), [])
  const [thang, setThang] = useState(thangHeThong)

  const [dangSua, setDangSua] = useState<NganSach | 'moi' | null>(null)
  const [canXoa, setCanXoa] = useState<NganSach | null>(null)
  const [menuMoId, setMenuMoId] = useState<string | null>(null)

  // Đóng popover menu khi bấm ra ngoài
  const menuRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuMoId(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Ngân sách của tháng đang xem:
  // Nếu ngân sách có trường kyNganSach, chỉ lấy bản ghi thuộc tháng đó.
  // Nếu dữ liệu cũ chưa có kyNganSach, chỉ hiển thị ở tháng hiện tại.
  const nganSachThang = useMemo(() => {
    return nganSach.filter((n) => {
      if (n.kyNganSach) return n.kyNganSach === thang
      return thang === thangHeThong
    })
  }, [nganSach, thang, thangHeThong])

  // Lấy chi tiêu của đúng tháng và đúng danh mục
  const dong = useMemo(() => {
    const gdThang = theoThang(giaoDich, thang).filter((g) => g.loai === 'chi')
    return nganSachThang
      .map((n) => {
        const dm = danhMuc.find((d) => d.id === n.maDanhMuc)
        const da = gdThang
          .filter((g) => g.maDanhMuc === n.maDanhMuc)
          .reduce((s, g) => s + g.soTien, 0)
        const pt = n.hanMuc > 0 ? (da / n.hanMuc) * 100 : 0
        return { n, dm, da, pt }
      })
      .filter((x) => x.dm)
      .sort((a, b) => b.pt - a.pt)
  }, [nganSachThang, danhMuc, giaoDich, thang])

  const tongHan = useMemo(() => dong.reduce((s, x) => s + x.n.hanMuc, 0), [dong])
  const tongDa = useMemo(() => dong.reduce((s, x) => s + x.da, 0), [dong])
  const tongConLai = tongHan - tongDa
  const phanTramTong = tongHan > 0 ? (tongDa / tongHan) * 100 : 0

  // Màu sắc & trạng thái tổng quan: <70% xanh, 70-99% vàng, >=100% đỏ
  const mauTongQuan = useMemo(() => {
    if (phanTramTong >= 100) return 'var(--san-ho, #ef4444)'
    if (phanTramTong >= 70) return 'var(--vang, #d97706)'
    return 'var(--ngoc, #14946f)'
  }, [phanTramTong])

  const vuot = useMemo(() => dong.filter((x) => x.pt >= 100), [dong])
  const sapVuot = useMemo(() => dong.filter((x) => x.pt >= 70 && x.pt < 100), [dong])

  // Ngân sách tháng trước để hỗ trợ tính năng "Sao chép từ tháng trước"
  const thangTruoc = useMemo(() => congThang(thang, -1), [thang])
  const nganSachThangTruoc = useMemo(() => {
    return nganSach.filter((n) => {
      if (n.kyNganSach) return n.kyNganSach === thangTruoc
      return thangTruoc === thangHeThong
    })
  }, [nganSach, thangTruoc, thangHeThong])

  // Xử lý sao chép ngân sách từ tháng trước
  const xuLySaoChepThangTruoc = () => {
    if (nganSachThangTruoc.length === 0) {
      thongBao(t('Tháng trước không có ngân sách nào để sao chép.'), 'loi')
      return
    }

    // Chỉ sao chép những danh mục chưa có trong tháng hiện tại
    const danhMucHienCo = new Set(nganSachThang.map((n) => n.maDanhMuc))
    const danhSachSaoChep = nganSachThangTruoc.filter((n) => !danhMucHienCo.has(n.maDanhMuc))

    if (danhSachSaoChep.length === 0) {
      thongBao(t('Tất cả ngân sách của tháng trước đã tồn tại ở tháng này.'))
      return
    }

    const [y, m] = thang.split('-').map(Number)
    for (const ns of danhSachSaoChep) {
      luu('nganSach', {
        id: `ns-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        maDanhMuc: ns.maDanhMuc,
        hanMuc: ns.hanMuc,
        kyNganSach: thang,
        thang: m,
        nam: y,
      })
    }

    thongBao(t('Đã sao chép {0} ngân sách từ {1} sang {2}', [danhSachSaoChep.length, nhanThang(thangTruoc), nhanThang(thang)]))
  }

  return (
    <div className="trang ns-page">
      {/* 1. HEADER GỌN */}
      <header className="ns-header-top">
        <div className="ns-header-left">
          <button
            type="button"
            className="btn btn-nhe btn-icon btn-sm"
            onClick={() => navigate('/ca-nhan')}
            aria-label={t('Quay lại')}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ minWidth: 0 }}>
            <h1 className="ns-header-title">{t('Ngân sách')}</h1>
            <p className="ns-header-desc">
              {t('Kiểm soát chi tiêu và hạn mức theo từng tháng.')}
            </p>
          </div>
        </div>

        {/* Nút hành động nhanh cho desktop / tablet */}
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setDangSua('moi')}
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          <Plus size={16} />
          <span className="an-mobile">{t('Đặt ngân sách')}</span>
        </button>
      </header>

      {/* 2. BỘ LỌC THÁNG */}
      <div className="ns-month-bar">
        <div className="ns-month-selector">
          <button
            type="button"
            className="btn btn-nhe btn-icon btn-sm"
            onClick={() => {
              setMenuMoId(null)
              setThang((cu) => congThang(cu, -1))
            }}
            aria-label={t('Tháng trước')}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="ns-month-label">{nhanThang(thang)}</span>
          <button
            type="button"
            className="btn btn-nhe btn-icon btn-sm"
            onClick={() => {
              setMenuMoId(null)
              setThang((cu) => congThang(cu, 1))
            }}
            aria-label={t('Tháng sau')}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="ns-month-actions">
          {thang !== thangHeThong && (
            <button
              type="button"
              className="ns-btn-today"
              onClick={() => {
                setMenuMoId(null)
                setThang(thangHeThong)
              }}
            >
              <RotateCcw size={14} />
              <span>{t('Tháng này')}</span>
            </button>
          )}

          {nganSachThangTruoc.length > 0 && dong.length === 0 && (
            <button
              type="button"
              className="ns-btn-copy"
              onClick={xuLySaoChepThangTruoc}
            >
              <Copy size={14} />
              <span>{t('Sao chép từ tháng trước')}</span>
            </button>
          )}
        </div>
      </div>

      {/* CẢNH BÁO VƯỢT VÀ SẮP VƯỢT HẠN MỨC */}
      {vuot.length > 0 && (
        <div className="canh-bao" role="alert" style={{ borderRadius: 16 }}>
          <TriangleAlert size={18} style={{ flexShrink: 0 }} />
          <span style={{ minWidth: 0, wordBreak: 'break-word' }}>
            <b>{t('Đã vượt hạn mức:')}</b>{' '}
            {anSoDu
              ? t('Chi tiết số tiền đã được ẩn.')
              : vuot.map((x) => `${dichTen(x.dm!.ten)} (+${dinhDangTien(x.da - x.n.hanMuc)})`).join(', ')}
          </span>
        </div>
      )}
      {sapVuot.length > 0 && (
        <div className="canh-bao vang" role="alert" style={{ borderRadius: 16 }}>
          <TriangleAlert size={18} style={{ flexShrink: 0 }} />
          <span style={{ minWidth: 0, wordBreak: 'break-word' }}>
            <b>{t('Sắp hết ngân sách:')}</b>{' '}
            {sapVuot.map((x) => `${dichTen(x.dm!.ten)} (${Math.round(x.pt)}%)`).join(', ')}
          </span>
        </div>
      )}

      {/* 3. THẺ TỔNG QUAN NGÂN SÁCH */}
      {dong.length > 0 && (
        <section className="ns-overview-card">
          <div className="ns-overview-circle">
            <VongTienDo
              phanTram={phanTramTong}
              mau={mauTongQuan}
              kichThuoc={92}
              doDay={10}
            />
          </div>

          <div className="ns-overview-metrics">
            <div className="ns-metric-row">
              <span className="ns-metric-label">{t('Đã chi')}</span>
              <span className={`ns-metric-value ${phanTramTong >= 100 ? 'do' : phanTramTong >= 70 ? 'vang' : 'xanh'}`}>
                {anSoDu ? '••••••' : dinhDangTien(tongDa)}
              </span>
            </div>

            <div className="ns-metric-row">
              <span className="ns-metric-label">{t('Hạn mức')}</span>
              <span className="ns-metric-value" style={{ color: 'var(--chu)' }}>
                {anSoDu ? '••••••' : dinhDangTien(tongHan)}
              </span>
            </div>

            <div className="ns-metric-row">
              <span className="ns-metric-label">{tongConLai >= 0 ? t('Còn lại') : t('Vượt hạn mức')}</span>
              <span className={`ns-metric-value ${tongConLai >= 0 ? 'xanh' : 'do'}`}>
                {anSoDu ? '••••••' : (tongConLai >= 0 ? dinhDangTien(tongConLai) : `−${dinhDangTien(Math.abs(tongConLai))}`)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 4. DANH SÁCH THẺ NGÂN SÁCH */}
      {dong.length > 0 ? (
        <div className="ns-list-container" key={thang}>
          {dong.map(({ n, dm, da, pt }) => {
            const daVuot = pt >= 100
            const sapHet = pt >= 70 && pt < 100
            const classTienDo = daVuot ? 'vuot' : sapHet ? 'sap-het' : 'on'
            const conLai = n.hanMuc - da

            return (
              <article className="ns-card" key={n.id}>
                {/* Hàng 1: Icon danh mục + Tên + Badge trạng thái + Menu */}
                <div className="ns-card-row1">
                  <ONhanDienDanhMuc bieuTuong={dm!.bieuTuong} mau={dm!.mau} />

                  <div className="ns-card-category">
                    <span className="ns-card-cat-name" title={dichTen(dm!.ten)}>
                      {dichTen(dm!.ten)}
                    </span>
                    <span className="ns-card-cat-limit">
                      {t('Hạn mức:')} {anSoDu ? '••••••' : dinhDangTien(n.hanMuc)}
                    </span>
                  </div>

                  <span className={`ns-card-badge ${classTienDo}`}>
                    {daVuot ? t('Đã vượt') : sapHet ? t('Sắp hết') : t('Ổn')}
                  </span>

                  {/* Menu ba chấm gom sửa/xóa gọn gàng */}
                  <div className="ns-menu-wrap" ref={menuMoId === n.id ? menuRef : undefined}>
                    <button
                      type="button"
                      className="ns-btn-menu"
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuMoId((cu) => (cu === n.id ? null : n.id))
                      }}
                      aria-label={t('Thao tác ngân sách')}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {menuMoId === n.id && (
                      <div className="ns-menu-popover">
                        <button
                          type="button"
                          className="ns-menu-item"
                          onClick={() => {
                            setMenuMoId(null)
                            setDangSua(n)
                          }}
                        >
                          <Pencil size={15} />
                          <span>{t('Chỉnh sửa')}</span>
                        </button>
                        <button
                          type="button"
                          className="ns-menu-item xoa"
                          onClick={() => {
                            setMenuMoId(null)
                            setCanXoa(n)
                          }}
                        >
                          <Trash2 size={15} />
                          <span>{t('Xóa')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hàng 2: Thanh tiến độ bo tròn */}
                <div className="ns-progress-track">
                  <div
                    className={`ns-progress-bar ${classTienDo}`}
                    style={{ width: `${Math.min(Math.max(pt, 0), 100)}%` }}
                  />
                </div>

                {/* Hàng 3: Đã chi bên trái, Còn lại bên phải */}
                <div className="ns-card-row3">
                  <span className="ns-card-row3-left">
                    {t('Đã chi:')} <b>{anSoDu ? '••••••' : dinhDangTien(da)}</b> ({Math.round(pt)}%)
                  </span>
                  <span className="ns-card-row3-right" style={{ color: conLai >= 0 ? 'var(--ngoc)' : 'var(--san-ho)' }}>
                    {conLai >= 0
                      ? t('Còn: {0}', [anSoDu ? '••••••' : dinhDangTien(conLai)])
                      : t('Vượt: {0}', [anSoDu ? '••••••' : dinhDangTien(Math.abs(conLai))])}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        /* 5. EMPTY STATE */
        <div className="ns-empty-card" key={thang}>
          <div className="ns-empty-icon">
            <PiggyBank size={32} />
          </div>
          <h3 className="ns-empty-title">
            {t('Chưa có ngân sách cho {0}', [nhanThang(thang)])}
          </h3>
          <p className="ns-empty-desc">
            {t('Đặt hạn mức cho các danh mục Ăn uống, Mua sắm… để kiểm soát chi tiêu tốt hơn.')}
          </p>
          <div className="ns-empty-actions">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => setDangSua('moi')}
            >
              <Plus size={16} />
              <span>{t('Tạo ngân sách')}</span>
            </button>

            {nganSachThangTruoc.length > 0 && (
              <button
                type="button"
                className="btn btn-vien btn-sm"
                onClick={xuLySaoChepThangTruoc}
              >
                <Copy size={16} />
                <span>{t('Sao chép từ tháng trước')}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 6. NÚT NỔI (FAB) ĐẶT NGÂN SÁCH TRÊN MOBILE */}
      <button
        type="button"
        className="ns-fab"
        onClick={() => setDangSua('moi')}
        aria-label={t('Đặt ngân sách mới')}
      >
        <Plus size={24} />
      </button>

      {/* 7. MODAL TẠO / SỬA NGÂN SÁCH */}
      <FormNganSach
        key={dangSua === 'moi' ? `moi-${thang}` : (dangSua?.id ?? 'dong')}
        du={dangSua}
        thangMacDinh={thang}
        dong={() => setDangSua(null)}
        luu={(x) => {
          luu('nganSach', x)
          thongBao(t('Đã lưu ngân sách thành công.'))
          setDangSua(null)
        }}
      />

      {/* 8. HỘP THOẠI XÁC NHẬN XÓA NGÂN SÁCH */}
      <HopXacNhan
        mo={!!canXoa}
        tieuDe={t('Xoá ngân sách này?')}
        noiDung={t('Hạn mức ngân sách sẽ bị xoá khỏi kỳ này. Lịch sử giao dịch vẫn được giữ nguyên.')}
        dong={() => setCanXoa(null)}
        dongY={() => {
          if (canXoa) {
            xoa('nganSach', canXoa.id)
            thongBao(t('Đã xoá ngân sách khỏi hệ thống'))
          }
          setCanXoa(null)
        }}
      />
    </div>
  )
}

/**
 * FORM TẠO / SỬA NGÂN SÁCH THEO THÁNG CỤ THỂ
 */
function FormNganSach({
  du,
  thangMacDinh,
  dong,
  luu,
}: {
  du: NganSach | 'moi' | null
  thangMacDinh: string
  dong: () => void
  luu: (n: Omit<NganSach, 'id'> & { id?: string }) => void
}) {
  const { danhMuc, nganSach } = useDuLieu()
  const goc = du && du !== 'moi' ? du : null

  // Chọn tháng áp dụng: mặc định là tháng đang xem, hoặc tháng của ngân sách đang sửa
  const [kyChon, setKyChon] = useState(goc?.kyNganSach || thangMacDinh)

  // Danh mục chi chưa có ngân sách trong kỳ tháng được chọn
  const conTrong = useMemo(() => {
    return danhMuc.filter(
      (d) =>
        d.loai === 'chi' &&
        (d.id === goc?.maDanhMuc ||
          !nganSach.some((n) => n.maDanhMuc === d.id && (n.kyNganSach === kyChon || (!n.kyNganSach && kyChon === thangHienTai())))),
    )
  }, [danhMuc, nganSach, goc, kyChon])

  const [ma, setMa] = useState(goc?.maDanhMuc ?? conTrong[0]?.id ?? '')
  const [han, setHan] = useState(goc?.hanMuc ?? 0)

  // Cập nhật lại danh mục mặc định khi thay đổi kỳ tháng nếu mã hiện tại không còn khả dụng
  useEffect(() => {
    if (!goc && conTrong.length > 0 && !conTrong.some((c) => c.id === ma)) {
      setMa(conTrong[0].id)
    }
  }, [conTrong, ma, goc])

  // Danh sách các tháng cho phép chọn: từ 3 tháng trước đến 12 tháng tới
  const tuyChonThang = useMemo(() => {
    const list: string[] = []
    const hienTai = thangHienTai()
    for (let i = -2; i <= 12; i++) {
      list.push(congThang(hienTai, i))
    }
    return list
  }, [])

  const gui = (e: FormEvent) => {
    e.preventDefault()
    if (ma && han > 0) {
      const [y, m] = kyChon.split('-').map(Number)
      luu({
        id: goc?.id,
        maDanhMuc: ma,
        hanMuc: han,
        kyNganSach: kyChon,
        thang: m,
        nam: y,
      })
    }
  }

  return (
    <Modal mo={!!du} dong={dong} tieuDe={goc ? t('Sửa ngân sách') : t('Đặt ngân sách')}>
      <form className="form" onSubmit={gui}>
        {/* Chọn tháng áp dụng */}
        <div className="truong">
          <label htmlFor="ns-form-thang">{t('Tháng áp dụng')}</label>
          <select
            id="ns-form-thang"
            className="o-chon"
            value={kyChon}
            onChange={(e) => setKyChon(e.target.value)}
            disabled={!!goc}
          >
            {tuyChonThang.map((km) => (
              <option key={km} value={km}>
                {nhanThang(km)} {km === thangHienTai() ? `(${t('Hiện tại')})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn danh mục */}
        <div className="truong">
          <label htmlFor="ns-dm">{t('Danh mục chi tiêu')}</label>
          {conTrong.length === 0 ? (
            <p className="mo" style={{ fontSize: '0.9rem', padding: '6px 0' }}>
              {t('Tất cả danh mục chi tiêu đều đã được thiết lập ngân sách trong tháng này.')}
            </p>
          ) : (
            <select
              id="ns-dm"
              className="o-chon"
              value={ma}
              onChange={(e) => setMa(e.target.value)}
              disabled={!!goc}
            >
              {conTrong.map((d) => (
                <option key={d.id} value={d.id}>
                  {dichTen(d.ten)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Nhập hạn mức */}
        <div className="truong">
          <label htmlFor="ns-han">{t('Hạn mức ngân sách')}</label>
          <OTien id="ns-han" gia={han} doi={setHan} lon />
        </div>

        {/* Nút hành động */}
        <div className="hanh-dong-form" style={{ marginTop: 12 }}>
          <button type="button" className="btn btn-vien" onClick={dong}>
            {t('Huỷ')}
          </button>
          <button className="btn" disabled={han <= 0 || !ma}>
            {t('Lưu ngân sách')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
