import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, CalendarHeart, Eye, EyeOff, Receipt, Sparkles } from 'lucide-react'
import { BieuDoDanhMuc } from '../components/bieu-do/BieuDoDanhMuc'
import { BieuDoThuChi } from '../components/bieu-do/BieuDoThuChi'
import { ChiTietGiaoDichModal } from '../components/chung/ChiTietGiaoDichModal'
import { ChartErrorBoundary } from '../components/chung/ChartErrorBoundary'
import { DongGiaoDich } from '../components/chung/DongGiaoDich'
import { FormGiaoDich } from '../components/chung/FormGiaoDich'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { VongTienDo } from '../components/chung/VongTienDo'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { GiaoDich } from '../types'
import { dinhDangGon, dinhDangTien, homNayISO, nhanThang, soNgayTrongThang, thangHienTai } from '../utils/dinhDang'
import { chiTheoDanhMuc, chiTheoNgay, chuoiThang, soDuVi, theoThang, tongThuChi } from '../utils/thongKe'
import { SoChay } from '../components/chung/SoChay'
import { t, dichTen } from '../utils/ngonNgu'

export function TongQuan() {
  const { vi, danhMuc, giaoDich, nganSach, mucTieu, xoa } = useDuLieu()
  const { anSoDu, doiAnSoDu, thongBao } = useGiaoDien()
  const [dangSua, setDangSua] = useState<GiaoDich | null>(null)
  const [dangXemChiTiet, setDangXemChiTiet] = useState<GiaoDich | null>(null)
  const thang = thangHienTai()

  const kq = useMemo(() => {
    const gdThang = theoThang(giaoDich, thang)
    const { thu, chi } = tongThuChi(gdThang)
    const nhip = chiTheoNgay(giaoDich, thang)
    const homNay = Number(homNayISO().slice(8, 10))
    const trungBinh = homNay ? chi / homNay : 0
    return {
      thu, chi, nhip, homNay, trungBinh,
      tongSoDu: vi.reduce((s, v) => s + soDuVi(v, giaoDich), 0),
      theoDm: chiTheoDanhMuc(gdThang, danhMuc),
      sauThang: chuoiThang(giaoDich, thang, 6),
      ganDay: [...giaoDich]
        .sort((a, b) => {
          if (a.ngay !== b.ngay) return b.ngay.localeCompare(a.ngay)
          return b.id.localeCompare(a.id)
        })
        .slice(0, 6),
      gdThang,
    }
  }, [giaoDich, danhMuc, vi, thang])

  const tiLe = kq.thu > 0 ? Math.round(((kq.thu - kq.chi) / kq.thu) * 100) : 0
  const maxNhip = Math.max(...kq.nhip, 1)
  const nganSachCanChu = nganSach
    .map((n) => ({ n, dm: danhMuc.find((d) => d.id === n.maDanhMuc), da: kq.theoDm.find((x) => x.danhMuc.id === n.maDanhMuc)?.soTien ?? 0 }))
    .filter((x) => x.dm)
    .sort((a, b) => (b.n.hanMuc > 0 ? b.da / b.n.hanMuc : 0) - (a.n.hanMuc > 0 ? a.da / a.n.hanMuc : 0))
    .slice(0, 4)

  return (
    <div className="trang">
      <Link to="/khoanh-khac" className="khoanh-khac-banner"><span className="icon-tron"><CalendarHeart size={19} /></span><span><b>{t('{0} & lịch tháng', [t('Khoảnh khắc')])}</b><small>{t('Lưu ảnh và đánh dấu những ngày đáng nhớ')}</small></span><span className="muiten">{t('Mở lịch →')}</span></Link>
      <section className="hero" aria-label={t('Tổng quan tháng này')}>
        <div className="hero-hang">
          <div>
            <div className="hero-so-du-label"><div className="nhan-hero">{t('Tổng số dư các ví')}</div><button type="button" className="an-hien-so" onClick={doiAnSoDu} aria-label={anSoDu ? t('Hiện số dư') : t('Ẩn số dư')} title={anSoDu ? t('Hiện số dư') : t('Ẩn số dư')}>{anSoDu ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            <div className="so-lon so"><SoChay gia={kq.tongSoDu} dinhDang={(n) => dinhDangTien(n).replace(' ₫', '')} /><small>₫</small></div>
          </div>
          <div className="vi-chip-hang">
            {vi.map((v) => (
              <span className="vi-chip" key={v.id}><i style={{ background: v.mau }} />{dichTen(v.ten)}<b className="so">{dinhDangGon(soDuVi(v, giaoDich))}</b></span>
            ))}
          </div>
        </div>

        <div className="nhip">
          <div className="nhip-tieu-de">
            <span>{t('Nhịp chi tiêu {0}', [nhanThang(thang).toLowerCase()])}</span>
            <span>{t('Trung bình')} <b className="so">{dinhDangGon(kq.trungBinh)}</b>{t('/ngày')}</span>
          </div>
          <div className="nhip-dai" role="img" aria-label={t('Chi tiêu từng ngày trong tháng')}>
            {kq.nhip.map((v, i) => {
              const chuaToi = i + 1 > kq.homNay
              const cao = v > kq.trungBinh * 1.8 && v > 0
              return (
                <i key={i} title={anSoDu ? t('Ngày {0}: đã ẩn số tiền', [i + 1]) : t('Ngày {0}: {1}', [i + 1, dinhDangTien(v)])} className={`${chuaToi ? 'chua-toi' : cao ? 'cao' : ''}${i + 1 === kq.homNay ? ' hom-nay' : ''}`}
                  style={{ height: `${chuaToi ? 5 : Math.max((v / maxNhip) * 100, 4)}%`, animationDelay: `${i * 14}ms` }} />
              )
            })}
          </div>
          <div className="nhip-moc"><span>1</span><span>{Math.round(soNgayTrongThang(thang) / 2)}</span><span>{soNgayTrongThang(thang)}</span></div>
        </div>

        <div className="hero-so-lieu">
          <div><span><ArrowDownLeft size={14} className="thu" />{t('Thu')}</span><b className="so">{dinhDangGon(kq.thu)}</b></div>
          <div><span><ArrowUpRight size={14} className="chi" />{t('Chi')}</span><b className="so">{dinhDangGon(kq.chi)}</b></div>
          <div><span><Sparkles size={14} style={{ color: 'var(--vang)' }} />{t('Giữ lại')}</span><b className="so">{tiLe}%</b></div>
        </div>
      </section>

      <div className="luoi luoi-7-5">
        <section className="the">
          <div className="the-dau"><h2>{t('Thu chi 6 tháng gần đây')}</h2></div>
          <ChartErrorBoundary tieuDeBieuDo={t('Thu chi 6 tháng')}>
            <BieuDoThuChi du={kq.sauThang} />
          </ChartErrorBoundary>
        </section>
        <section className="the">
          <div className="the-dau"><h2>{t('Chi theo danh mục')}</h2><span className="nho">{nhanThang(thang)}</span></div>
          {kq.theoDm.length ? (
            <ChartErrorBoundary tieuDeBieuDo={t('Chi theo danh mục')}>
              <BieuDoDanhMuc du={kq.theoDm} toiDa={5} />
            </ChartErrorBoundary>
          ) : (
            <TrangThaiTrong icon={Receipt} tieuDe={t('Chưa có khoản chi')} moTa={t('Thêm khoản chi đầu tiên của tháng để xem phân bổ theo danh mục.')} />
          )}
        </section>
      </div>

      <div className="luoi luoi-5-7" style={{ alignItems: 'start' }}>
        <div className="luoi">
          <section className="the">
            <div className="the-dau"><h2>{t('Ngân sách cần chú ý')}</h2><Link to="/ngan-sach" className="nho dam">{t('Xem tất cả')}</Link></div>
            {nganSachCanChu.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {nganSachCanChu.map(({ n, dm, da }) => {
                  const pt = (da / n.hanMuc) * 100
                  return (
                    <div key={n.id} className="ns-dong">
                      <div className="ns-so"><b style={{ color: 'var(--chu)' }}>{dichTen(dm!.ten)}</b><span className="so">{dinhDangGon(da)} / {dinhDangGon(n.hanMuc)}</span></div>
                      <div className={`thanh ${pt >= 100 ? 'do' : pt >= 80 ? 'vang' : ''}`}><i style={{ width: `${Math.min(pt, 100)}%` }} /></div>
                    </div>
                  )
                })}
              </div>
            ) : <p className="mo nho">{t('Bạn chưa đặt ngân sách nào.')}</p>}
          </section>
          <section className="the">
            <div className="the-dau"><h2>{t('Mục tiêu tiết kiệm')}</h2><Link to="/muc-tieu" className="nho dam">{t('Xem tất cả')}</Link></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {mucTieu.slice(0, 3).map((m) => (
                <div key={m.id} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <VongTienDo phanTram={(m.daTietKiem / m.soTienMucTieu) * 100} mau={m.mau} kichThuoc={56} doDay={7} />
                  <div style={{ minWidth: 0 }}>
                    <b style={{ display: 'block' }}>{m.ten}</b>
                    <span className="nho mo so">{dinhDangGon(m.daTietKiem)} / {dinhDangGon(m.soTienMucTieu)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="the the-phang">
          <div className="the-dau" style={{ padding: '20px 20px 0' }}>
            <h2>{t('Giao dịch gần đây')}</h2>
            <Link to="/giao-dich" className="nho dam">{t('Xem tất cả')}</Link>
          </div>
          {kq.ganDay.length ? kq.ganDay.map((g) => (
            <DongGiaoDich
              key={g.id}
              gd={g}
              danhMuc={danhMuc.find((d) => d.id === g.maDanhMuc)}
              vi={vi.find((v) => v.id === g.maVi)}
              sua={setDangSua}
              xemChiTiet={setDangXemChiTiet}
            />
          )) : <TrangThaiTrong icon={Receipt} tieuDe={t('Chưa có giao dịch')} moTa={t('Nhấn nút + để ghi lại khoản thu chi đầu tiên.')} />}
        </section>
      </div>

      <FormGiaoDich key={dangSua?.id ?? 'dong'} mo={!!dangSua} dong={() => setDangSua(null)} giaoDich={dangSua} />
      <ChiTietGiaoDichModal
        gd={dangXemChiTiet}
        danhMuc={danhMuc.find((d) => d.id === dangXemChiTiet?.maDanhMuc)}
        vi={vi.find((v) => v.id === dangXemChiTiet?.maVi)}
        dong={() => setDangXemChiTiet(null)}
        onSua={(g) => { setDangXemChiTiet(null); setDangSua(g) }}
        onXoa={(g) => {
          xoa('giaoDich', g.id)
          thongBao(t('Đã xóa giao dịch!'))
          setDangXemChiTiet(null)
        }}
      />
    </div>
  )
}
