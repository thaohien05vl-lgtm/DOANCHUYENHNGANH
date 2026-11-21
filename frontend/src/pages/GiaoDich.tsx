import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Mic,
  Plus,
  Receipt,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import { BoLocGiaoDichModal, type CheDoThoiGian } from '../components/chung/BoLocGiaoDichModal'
import { ChiTietGiaoDichModal } from '../components/chung/ChiTietGiaoDichModal'
import { DongGiaoDich } from '../components/chung/DongGiaoDich'
import { FormGiaoDich } from '../components/chung/FormGiaoDich'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { NhapGiongNoiModal } from '../components/chung/NhapGiongNoiModal'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { GiaoDich } from '../types'
import { congThang, dinhDangTien, homNayISO, nhanNgay, nhanThang, thangHienTai } from '../utils/dinhDang'
import { tongThuChi } from '../utils/thongKe'
import { t } from '../utils/ngonNgu'

export function GiaoDichTrang() {
  const { giaoDich, danhMuc, vi, xoa } = useDuLieu()
  const { thongBao, anSoDu } = useGiaoDien()
  const [searchParams] = useSearchParams()
  const kyParam = searchParams.get('ky')
  const idParam = searchParams.get('id')

  // Bộ lọc
  const [cheDoTg, setCheDoTg] = useState<CheDoThoiGian>(() => (kyParam === 'tat-ca' || idParam ? 'tat-ca' : 'thang'))
  const [thang, setThang] = useState(thangHienTai())
  const [tuNgay, setTuNgay] = useState('')
  const [denNgay, setDenNgay] = useState(homNayISO())

  const [loai, setLoai] = useState<'tat-ca' | 'thu' | 'chi'>('tat-ca')
  const [tim, setTim] = useState('')
  const [maVi, setMaVi] = useState('')
  const [maDm, setMaDm] = useState('')
  const [chiDinhKy, setChiDinhKy] = useState(false)

  // Điều khiển các Modal
  const [moForm, setMoForm] = useState(false)
  const [moGiongNoi, setMoGiongNoi] = useState(false)
  const [moBoLoc, setMoBoLoc] = useState(false)
  const [dangSua, setDangSua] = useState<GiaoDich | null>(null)
  const [giaoDichThuCong, setGiaoDichThuCong] = useState<GiaoDich | null>(null)
  const [canXoa, setCanXoa] = useState<GiaoDich | null>(null)

  // Giao dịch đang xem chi tiết (chọn thủ công hoặc từ URL)
  const dangXemChiTiet = useMemo(() => {
    if (giaoDichThuCong) return giaoDichThuCong
    if (idParam) return giaoDich.find((g) => g.id === idParam) ?? null
    return null
  }, [giaoDichThuCong, idParam, giaoDich])

  // Lọc dữ liệu giao dịch
  const loc = useMemo(() => {
    const t = tim.trim().toLowerCase()
    const homNay = homNayISO()

    return giaoDich
      .filter((g) => {
        if (!g.ngay) return false

        // 1. Thời gian
        if (cheDoTg === 'thang') {
          if (!g.ngay.startsWith(thang)) return false
        } else if (cheDoTg === 'hom-nay') {
          if (g.ngay !== homNay) return false
        } else if (cheDoTg === '7-ngay') {
          const moc = new Date()
          moc.setDate(moc.getDate() - 7)
          const mocStr = moc.toISOString().slice(0, 10)
          if (g.ngay < mocStr || g.ngay > homNay) return false
        } else if (cheDoTg === '30-ngay') {
          const moc = new Date()
          moc.setDate(moc.getDate() - 30)
          const mocStr = moc.toISOString().slice(0, 10)
          if (g.ngay < mocStr || g.ngay > homNay) return false
        } else if (cheDoTg === 'tuy-chinh') {
          if (tuNgay && g.ngay < tuNgay) return false
          if (denNgay && g.ngay > denNgay) return false
        }

        // 2. Loại thu / chi
        if (loai !== 'tat-ca' && g.loai !== loai) return false

        // 3. Ví
        if (maVi && g.maVi !== maVi) return false

        // 4. Danh mục
        if (maDm && g.maDanhMuc !== maDm) return false

        // 5. Định kỳ
        if (chiDinhKy && !g.dinhKy) return false

        // 6. Tìm kiếm
        if (t) {
          const dm = danhMuc.find((d) => d.id === g.maDanhMuc)
          const viGd = vi.find((v) => v.id === g.maVi)
          const khopGhiChu = g.ghiChu.toLowerCase().includes(t)
          const khopDanhMuc = dm?.ten.toLowerCase().includes(t) ?? false
          const khopVi = viGd?.ten.toLowerCase().includes(t) ?? false
          const khopTien = String(g.soTien).includes(t)
          if (!khopGhiChu && !khopDanhMuc && !khopVi && !khopTien) return false
        }

        return true
      })
      .sort((a, b) => {
        if (a.ngay !== b.ngay) return b.ngay.localeCompare(a.ngay)
        return b.id.localeCompare(a.id)
      })
  }, [giaoDich, cheDoTg, thang, tuNgay, denNgay, loai, maVi, maDm, chiDinhKy, tim, danhMuc, vi])

  // Gom theo từng ngày
  const nhom = useMemo(() => {
    const m = new Map<string, GiaoDich[]>()
    for (const g of loc) {
      m.set(g.ngay, [...(m.get(g.ngay) ?? []), g])
    }
    return [...m.entries()]
  }, [loc])

  // Thống kê thu / chi
  const { thu, chi, chenhLech } = tongThuChi(loc)

  // Đếm số lượng bộ lọc nâng cao đang kích hoạt
  const soLuongLocNangCao = useMemo(() => {
    let count = 0
    if (maVi) count++
    if (maDm) count++
    if (chiDinhKy) count++
    if (cheDoTg === '7-ngay' || cheDoTg === '30-ngay' || cheDoTg === 'tuy-chinh') count++
    if (loai !== 'tat-ca') count++
    return count
  }, [maVi, maDm, chiDinhKy, cheDoTg, loai])

  const coBoLocDangBat =
    cheDoTg !== 'tat-ca' ||
    loai !== 'tat-ca' ||
    tim !== '' ||
    maVi !== '' ||
    maDm !== '' ||
    chiDinhKy

  function datLaiBoLoc() {
    setCheDoTg('tat-ca')
    setThang(thangHienTai())
    setTuNgay('')
    setDenNgay(homNayISO())
    setLoai('tat-ca')
    setTim('')
    setMaVi('')
    setMaDm('')
    setChiDinhKy(false)
  }

  function moThem() {
    setDangSua(null)
    setMoForm(true)
  }

  function moSua(g: GiaoDich) {
    setGiaoDichThuCong(null)
    setDangSua(g)
    setMoForm(true)
  }

  // Tên ví và danh mục đang được lọc (cho hiển thị chip)
  const tenViLoc = useMemo(() => vi.find((v) => v.id === maVi)?.ten, [vi, maVi])
  const tenDmLoc = useMemo(() => danhMuc.find((d) => d.id === maDm)?.ten, [danhMuc, maDm])

  return (
    <div className="trang gd-khung">
      {/* 1. KHU VỰC THAO TÁC CHÍNH ĐẦU TRANG */}
      <div className="gd-dau-trang">
        <div className="gd-tieu-de-khu">
          <h1>{t('Giao dịch')}</h1>
          <span className="nhan nhan-ngoc">{loc.length}</span>
        </div>
        <div className="gd-nut-nhom">
          <button
            type="button"
            className="gd-btn-phu"
            onClick={() => setMoGiongNoi(true)}
            title={t('Nhập giao dịch bằng giọng nói')}
          >
            <Mic size={16} />
            <span>{t('Giọng nói')}</span>
          </button>
          <button
            type="button"
            className="gd-btn-chinh"
            onClick={moThem}
            title={t('Thêm giao dịch mới')}
          >
            <Plus size={16} />
            <span>{t('Thêm giao dịch')}</span>
          </button>
        </div>
      </div>

      {/* 2. BỘ LỌC KỲ THỜI GIAN GỌN GÀNG (PILLS) */}
      <div className="gd-thoi-gian-hop">
        <div className="gd-pills" role="tablist" aria-label={t('Chọn kỳ xem giao dịch')}>
          <button
            type="button"
            className="gd-pill"
            aria-pressed={cheDoTg === 'tat-ca'}
            onClick={() => setCheDoTg('tat-ca')}
          >
            {t('Tất cả ({0})', [giaoDich.length])}
          </button>
          <button
            type="button"
            className="gd-pill"
            aria-pressed={cheDoTg === 'thang'}
            onClick={() => setCheDoTg('thang')}
          >
            {t('Tháng này')}
          </button>
          <button
            type="button"
            className="gd-pill"
            aria-pressed={cheDoTg === 'hom-nay'}
            onClick={() => setCheDoTg('hom-nay')}
          >
            {t('Hôm nay')}
          </button>
          <button
            type="button"
            className="gd-pill"
            aria-pressed={cheDoTg === '7-ngay' || cheDoTg === '30-ngay' || cheDoTg === 'tuy-chinh'}
            onClick={() => setMoBoLoc(true)}
            title={t('Tùy chọn khoảng thời gian khác')}
          >
            <Calendar size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: '-1px' }} />
            {cheDoTg === '7-ngay'
              ? t('7 ngày')
              : cheDoTg === '30-ngay'
              ? t('30 ngày')
              : cheDoTg === 'tuy-chinh'
              ? t('Tùy chọn')
              : t('Khác...')}
          </button>
        </div>

        {/* Nếu đang lọc theo tháng: hiển thị nút chuyển tháng gọn nhẹ */}
        {cheDoTg === 'thang' && (
          <div className="gd-chuyen-thang">
            <button
              type="button"
              onClick={() => setThang(congThang(thang, -1))}
              aria-label={t('Tháng trước')}
              title={t('Tháng trước')}
            >
              <ChevronLeft size={16} />
            </button>
            <span>{nhanThang(thang)}</span>
            <button
              type="button"
              onClick={() => setThang(congThang(thang, 1))}
              aria-label={t('Tháng sau')}
              title={t('Tháng sau')}
            >
              <ChevronRight size={16} />
            </button>
            {thang !== thangHienTai() && (
              <button
                type="button"
                onClick={() => setThang(thangHienTai())}
                style={{ fontSize: '0.72rem', color: 'var(--ngoc)', marginLeft: 2 }}
                title={t('Về tháng hiện tại')}
              >
                {t('Hiện tại')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. THANH TÌM KIẾM, PHÂN LOẠI & NÚT BỘ LỌC NÂNG CAO */}
      <div className="gd-thanh-tim-kiem">
        <div className="gd-o-tim">
          <Search size={16} className="icon-kinh-lup" />
          <input
            type="text"
            placeholder={t('Tìm giao dịch...')}
            value={tim}
            onChange={(e) => setTim(e.target.value)}
            aria-label={t('Tìm giao dịch')}
          />
          {tim && (
            <button
              type="button"
              className="nut-xoa-tim"
              onClick={() => setTim('')}
              aria-label={t('Xóa từ khóa tìm kiếm')}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Segmented lọc loại thu/chi gọn */}
        <div className="doan" style={{ flex: 'none' }} role="group" aria-label={t('Loại thu chi')}>
          <button
            type="button"
            aria-pressed={loai === 'tat-ca'}
            onClick={() => setLoai('tat-ca')}
            title={t('Tất cả thu chi')}
          >
            {t('Tất cả')}
          </button>
          <button
            type="button"
            aria-pressed={loai === 'chi'}
            className="chi-on"
            onClick={() => setLoai('chi')}
            title={t('Chỉ khoản chi')}
          >
            {t('Chi')}
          </button>
          <button
            type="button"
            aria-pressed={loai === 'thu'}
            className="thu-on"
            onClick={() => setLoai('thu')}
            title={t('Chỉ khoản thu')}
          >
            {t('Thu')}
          </button>
        </div>

        {/* Nút mở Modal bộ lọc nâng cao */}
        <button
          type="button"
          className={`gd-btn-loc ${soLuongLocNangCao > 0 ? 'co-loc' : ''}`}
          onClick={() => setMoBoLoc(true)}
          title={t('Mở bộ lọc nâng cao')}
        >
          <SlidersHorizontal size={15} />
          {soLuongLocNangCao > 0 && <span className="gd-badge-loc">{soLuongLocNangCao}</span>}
        </button>
      </div>

      {/* 4. CHIPS BỘ LỌC ĐANG HOẠT ĐỘNG (NẾU CÓ) */}
      {(maVi || maDm || chiDinhKy || cheDoTg === 'tuy-chinh') && (
        <div className="gd-chips-active">
          {tenViLoc && (
            <span className="gd-chip-tag">
              {t('Ví:')} <b>{tenViLoc}</b>
              <button type="button" onClick={() => setMaVi('')} aria-label={t('Xóa lọc ví')}>
                <X size={13} />
              </button>
            </span>
          )}
          {tenDmLoc && (
            <span className="gd-chip-tag">
              {t('Danh mục:')} <b>{tenDmLoc}</b>
              <button type="button" onClick={() => setMaDm('')} aria-label={t('Xóa lọc danh mục')}>
                <X size={13} />
              </button>
            </span>
          )}
          {chiDinhKy && (
            <span className="gd-chip-tag">
              <b>{t('Chỉ định kỳ')}</b>
              <button type="button" onClick={() => setChiDinhKy(false)} aria-label={t('Xóa lọc định kỳ')}>
                <X size={13} />
              </button>
            </span>
          )}
          {cheDoTg === 'tuy-chinh' && (
            <span className="gd-chip-tag">
              {t('Từ: {0} đến {1}', [tuNgay || '...', denNgay || '...'])}
              <button type="button" onClick={() => setCheDoTg('tat-ca')} aria-label={t('Xóa lọc ngày tùy chọn')}>
                <X size={13} />
              </button>
            </span>
          )}
          <button type="button" className="gd-chip-xoa-tat-ca" onClick={datLaiBoLoc}>
            {t('Đặt lại')}
          </button>
        </div>
      )}

      {/* 5. THẺ TỔNG QUAN TÀI CHÍNH TỐI GIẢN (COMPACT SUMMARY CARD) */}
      <div className="gd-tong-quan">
        <div className="gd-tq-muc">
          <span>{t('Thu vào')}</span>
          <b className="so thu" style={{ color: 'var(--ngoc, #14946f)' }}>
            {anSoDu ? '••••••' : `+${dinhDangTien(thu)}`}
          </b>
        </div>
        <div className="gd-tq-muc gd-tq-cot-giua">
          <span>{t('Chi tiêu')}</span>
          <b className="so chi" style={{ color: 'var(--san-ho, #e5593f)' }}>
            {anSoDu ? '••••••' : `−${dinhDangTien(chi)}`}
          </b>
        </div>
        <div className="gd-tq-muc">
          <span>{t('Chênh lệch')}</span>
          <b
            className="so"
            style={{
              color: chenhLech < 0 ? 'var(--san-ho, #e5593f)' : 'var(--ngoc, #14946f)',
            }}
          >
            {anSoDu ? '••••••' : `${chenhLech > 0 ? '+' : ''}${dinhDangTien(chenhLech)}`}
          </b>
        </div>
      </div>

      {/* 6. DANH SÁCH GIAO DỊCH (XUẤT HIỆN NGAY TRONG TẦM NHÌN) */}
      <div className="the the-phang" style={{ borderRadius: 16, overflow: 'hidden' }}>
        {nhom.length ? (
          nhom.map(([ngay, ds]) => {
            const chenhLechNgay = tongThuChi(ds).chenhLech
            return (
              <div key={ngay}>
                <div className="nhom-ngay-tieu-de">
                  <span>{nhanNgay(ngay)}</span>
                  <span className="so" style={{ fontWeight: 600 }}>
                    {anSoDu ? '' : dinhDangTien(chenhLechNgay)}
                  </span>
                </div>
                {ds.map((g) => (
                  <DongGiaoDich
                    key={g.id}
                    gd={g}
                    danhMuc={danhMuc.find((d) => d.id === g.maDanhMuc)}
                    vi={vi.find((v) => v.id === g.maVi)}
                    sua={moSua}
                    xoa={setCanXoa}
                    xemChiTiet={setGiaoDichThuCong}
                  />
                ))}
              </div>
            )
          })
        ) : (
          <TrangThaiTrong
            icon={Receipt}
            tieuDe={t('Không tìm thấy giao dịch nào')}
            moTa={
              coBoLocDangBat
                ? t('Không có giao dịch nào khớp với bộ lọc hiện tại. Hãy nhấn "Đặt lại bộ lọc" để xem toàn bộ.')
                : t('Bạn chưa ghi nhận khoản thu chi nào. Hãy nhấn Thêm giao dịch hoặc nhập bằng Giọng nói.')
            }
          >
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {coBoLocDangBat && (
                <button type="button" className="btn btn-vien btn-sm" onClick={datLaiBoLoc}>
                  <FilterX size={15} /> {t('Đặt lại bộ lọc')}
                </button>
              )}
              <button type="button" className="btn btn-chinh btn-sm" onClick={moThem}>
                <Plus size={16} /> {t('Thêm giao dịch mới')}
              </button>
            </div>
          </TrangThaiTrong>
        )}
      </div>

      {/* 7. MODAL BỘ LỌC NÂNG CAO (BOTTOM SHEET TRÊN MOBILE) */}
      <BoLocGiaoDichModal
        mo={moBoLoc}
        dong={() => setMoBoLoc(false)}
        cheDoTg={cheDoTg}
        setCheDoTg={setCheDoTg}
        tuNgay={tuNgay}
        setTuNgay={setTuNgay}
        denNgay={denNgay}
        setDenNgay={setDenNgay}
        loai={loai}
        setLoai={setLoai}
        maVi={maVi}
        setMaVi={setMaVi}
        maDm={maDm}
        setMaDm={setMaDm}
        chiDinhKy={chiDinhKy}
        setChiDinhKy={setChiDinhKy}
        vi={vi}
        danhMuc={danhMuc}
        onDatLai={datLaiBoLoc}
      />

      {/* MODAL THÊM / SỬA GIAO DỊCH */}
      <FormGiaoDich
        key={`${moForm}-${dangSua?.id ?? 'moi'}`}
        mo={moForm}
        dong={() => setMoForm(false)}
        giaoDich={dangSua}
      />

      {/* MODAL NHẬP GIỌNG NÓI */}
      <NhapGiongNoiModal mo={moGiongNoi} dong={() => setMoGiongNoi(false)} />

      {/* MODAL XEM CHI TIẾT GIAO DỊCH */}
      <ChiTietGiaoDichModal
        gd={dangXemChiTiet}
        danhMuc={danhMuc.find((d) => d.id === dangXemChiTiet?.maDanhMuc)}
        vi={vi.find((v) => v.id === dangXemChiTiet?.maVi)}
        dong={() => setGiaoDichThuCong(null)}
        onSua={moSua}
        onXoa={setCanXoa}
      />

      {/* HỘP XÁC NHẬN XÓA GIAO DỊCH */}
      <HopXacNhan
        mo={!!canXoa}
        tieuDe={t('Xoá giao dịch này?')}
        noiDung={
          canXoa
            ? t('Khoản "{0}" với số tiền {1} sẽ bị xoá vĩnh viễn và số dư các ví liên quan sẽ được tự động tính toán lại.', [canXoa.ghiChu || 'Giao dịch', anSoDu ? 'đã ẩn' : dinhDangTien(canXoa.soTien)])
            : ''
        }
        dong={() => setCanXoa(null)}
        dongY={() => {
          if (canXoa) {
            xoa('giaoDich', canXoa.id)
            thongBao(t('Đã xoá giao dịch khỏi hệ thống'))
          }
          setCanXoa(null)
        }}
      />
    </div>
  )
}
