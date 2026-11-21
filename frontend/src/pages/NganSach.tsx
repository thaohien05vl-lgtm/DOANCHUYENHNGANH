import { useMemo, useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, PiggyBank, Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react'
import { ONhanDienDanhMuc } from '../components/chung/BieuTuong'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { OTien } from '../components/chung/OTien'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { VongTienDo } from '../components/chung/VongTienDo'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { NganSach } from '../types'
import { congThang, dinhDangTien, nhanThang, thangHienTai } from '../utils/dinhDang'
import { theoThang } from '../utils/thongKe'
import { t, dichTen } from '../utils/ngonNgu'

export function NganSachTrang() {
  const { nganSach, danhMuc, giaoDich, luu, xoa } = useDuLieu()
  const { thongBao, anSoDu } = useGiaoDien()
  const [thang, setThang] = useState(thangHienTai())
  const [dangSua, setDangSua] = useState<NganSach | 'moi' | null>(null)
  const [canXoa, setCanXoa] = useState<NganSach | null>(null)

  const dong = useMemo(() => {
    const gd = theoThang(giaoDich, thang).filter((g) => g.loai === 'chi')
    return nganSach.map((n) => {
      const dm = danhMuc.find((d) => d.id === n.maDanhMuc)
      const da = gd.filter((g) => g.maDanhMuc === n.maDanhMuc).reduce((s, g) => s + g.soTien, 0)
      return { n, dm, da, pt: n.hanMuc > 0 ? (da / n.hanMuc) * 100 : 0 }
    }).filter((x) => x.dm).sort((a, b) => b.pt - a.pt)
  }, [nganSach, danhMuc, giaoDich, thang])

  const tongHan = dong.reduce((s, x) => s + x.n.hanMuc, 0)
  const tongDa = dong.reduce((s, x) => s + x.da, 0)
  const vuot = dong.filter((x) => x.pt >= 100)
  const sapVuot = dong.filter((x) => x.pt >= 80 && x.pt < 100)

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Ngân sách')}
        moTa={t('Đặt hạn mức cho từng danh mục và theo dõi theo tháng.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      >
        <button className="btn" onClick={() => setDangSua('moi')}><Plus size={18} />{t('Đặt ngân sách')}</button>
      </TieuDeTrang>

      <div className="chon-thang" style={{ alignSelf: 'flex-start' }}>
        <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setThang(congThang(thang, -1))} aria-label={t('Tháng trước')}><ChevronLeft size={18} /></button>
        <b>{nhanThang(thang)}</b>
        <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setThang(congThang(thang, 1))} aria-label={t('Tháng sau')}><ChevronRight size={18} /></button>
      </div>

      {vuot.length > 0 && <div className="canh-bao" role="alert"><TriangleAlert size={20} /><span><b>{t('Đã vượt hạn mức:')}</b> {anSoDu ? t('Chi tiết số tiền đã được ẩn.') : vuot.map((x) => `${dichTen(x.dm!.ten)} (+${dinhDangTien(x.da - x.n.hanMuc)})`).join(', ')}.</span></div>}
      {sapVuot.length > 0 && <div className="canh-bao vang"><TriangleAlert size={20} /><span><b>{t('Sắp chạm hạn mức:')}</b> {sapVuot.map((x) => `${dichTen(x.dm!.ten)} (${Math.round(x.pt)}%)`).join(', ')}.</span></div>}

      {dong.length > 0 && (
        <section className="the" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <VongTienDo phanTram={(tongDa / (tongHan || 1)) * 100} mau={tongDa > tongHan ? 'var(--san-ho)' : 'var(--ngoc)'} kichThuoc={104} doDay={11} />
          <div>
            <div className="mo nho">{t('Đã chi / tổng hạn mức')}</div>
            <div className="so" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{dinhDangTien(tongDa)}</div>
            <div className="mo so">{t('trên {0} · {1}', [dinhDangTien(tongHan), tongHan - tongDa >= 0 ? `còn ${dinhDangTien(tongHan - tongDa)}` : `vượt ${dinhDangTien(tongDa - tongHan)}`])}</div>
          </div>
        </section>
      )}

      {dong.length ? (
        <div className="luoi luoi-2">
          {dong.map(({ n, dm, da, pt }) => (
            <article className="the ns-dong" key={n.id}>
              <div className="ns-dong-dau">
                <ONhanDienDanhMuc bieuTuong={dm!.bieuTuong} mau={dm!.mau} />
                <div className="giua"><b>{dichTen(dm!.ten)}</b><span className="nho mo so">{t('Hạn mức {0}', [dinhDangTien(n.hanMuc)])}</span></div>
                <span className={`nhan ${pt >= 100 ? 'nhan-san-ho' : pt >= 80 ? 'nhan-vang' : 'nhan-ngoc'}`}>{pt >= 100 ? t('Vượt') : pt >= 80 ? t('Sắp vượt') : t('Ổn')}</span>
                <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setDangSua(n)} aria-label={t('Sửa')}><Pencil size={16} /></button>
                <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setCanXoa(n)} aria-label={t('Xoá')}><Trash2 size={16} /></button>
              </div>
              <div className={`thanh ${pt >= 100 ? 'do' : pt >= 80 ? 'vang' : ''}`}><i style={{ width: `${Math.min(pt, 100)}%` }} /></div>
              <div className="ns-so so"><span>{t('Đã chi {0} ({1}%)', [dinhDangTien(da), Math.round(pt)])}</span><span>{n.hanMuc - da >= 0 ? t('Còn {0}', [dinhDangTien(n.hanMuc - da)]) : t('Vượt {0}', [dinhDangTien(da - n.hanMuc)])}</span></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="the"><TrangThaiTrong icon={PiggyBank} tieuDe={t('Chưa đặt ngân sách')} moTa={t('Đặt hạn mức cho Ăn uống, Mua sắm… để được cảnh báo trước khi chi quá tay.')}>
          <button className="btn btn-sm" onClick={() => setDangSua('moi')}><Plus size={16} />{t('Đặt ngân sách đầu tiên')}</button></TrangThaiTrong></div>
      )}

      <FormNganSach key={dangSua === 'moi' ? 'moi' : (dangSua?.id ?? 'dong')} du={dangSua} dong={() => setDangSua(null)} luu={(x) => { luu('nganSach', x); thongBao(t('Đã lưu ngân sách')); setDangSua(null) }} />
      <HopXacNhan mo={!!canXoa} tieuDe={t('Xoá ngân sách này?')} noiDung={t('Các giao dịch của danh mục vẫn được giữ nguyên.')} dong={() => setCanXoa(null)} dongY={() => { if (canXoa) { xoa('nganSach', canXoa.id); thongBao(t('Đã xoá ngân sách')) } setCanXoa(null) }} />
    </div>
  )
}

function FormNganSach({ du, dong, luu }: { du: NganSach | 'moi' | null; dong: () => void; luu: (n: Omit<NganSach, 'id'> & { id?: string }) => void }) {
  const { danhMuc, nganSach } = useDuLieu()
  const goc = du && du !== 'moi' ? du : null
  const conTrong = danhMuc.filter((d) => d.loai === 'chi' && (d.id === goc?.maDanhMuc || !nganSach.some((n) => n.maDanhMuc === d.id)))
  const [ma, setMa] = useState(goc?.maDanhMuc ?? conTrong[0]?.id ?? '')
  const [han, setHan] = useState(goc?.hanMuc ?? 0)
  const gui = (e: FormEvent) => { e.preventDefault(); if (ma && han > 0) luu({ id: goc?.id, maDanhMuc: ma, hanMuc: han }) }
  return (
    <Modal mo={!!du} dong={dong} tieuDe={goc ? t('Sửa ngân sách') : t('Đặt ngân sách')}>
      {conTrong.length === 0 ? <p className="mo">{t('Mọi danh mục chi đều đã có ngân sách.')}</p> : (
        <form className="form" onSubmit={gui}>
          <div className="truong"><label htmlFor="ns-dm">{t('Danh mục')}</label>
            <select id="ns-dm" className="o-chon" value={ma} onChange={(e) => setMa(e.target.value)} disabled={!!goc}>{conTrong.map((d) => <option key={d.id} value={d.id}>{dichTen(d.ten)}</option>)}</select></div>
          <div className="truong"><label htmlFor="ns-han">{t('Hạn mức mỗi tháng')}</label><OTien id="ns-han" gia={han} doi={setHan} lon /></div>
          <div className="hanh-dong-form"><button type="button" className="btn btn-vien" onClick={dong}>{t('Huỷ')}</button><button className="btn" disabled={han <= 0}>{t('Lưu ngân sách')}</button></div>
        </form>
      )}
    </Modal>
  )
}
