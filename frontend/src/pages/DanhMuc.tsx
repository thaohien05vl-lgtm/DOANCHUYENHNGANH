import { useState, type FormEvent } from 'react'
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react'
import { BIEU_TUONG, BieuTuong, ONhanDienDanhMuc } from '../components/chung/BieuTuong'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { BANG_MAU } from '../data/duLieuMau'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { DanhMuc, LoaiGiaoDich } from '../types'
import { t, dichTen } from '../utils/ngonNgu'

export function DanhMucTrang() {
  const { danhMuc, giaoDich, luu, xoa } = useDuLieu()
  const { thongBao } = useGiaoDien()
  const [dangSua, setDangSua] = useState<(Partial<DanhMuc> & { loai: LoaiGiaoDich }) | null>(null)
  const [canXoa, setCanXoa] = useState<DanhMuc | null>(null)
  const dem = (id: string) => giaoDich.filter((g) => g.maDanhMuc === id).length

  const cot = (loai: LoaiGiaoDich, tieuDe: string) => {
    const ds = danhMuc.filter((d) => d.loai === loai)
    return (
      <section className="the the-phang">
        <div className="the-dau" style={{ padding: '18px 20px 6px' }}>
          <h2>{tieuDe} <span className="nhan" style={{ marginLeft: 6 }}>{ds.length}</span></h2>
          <button className="btn btn-vien btn-sm" onClick={() => setDangSua({ loai })}><Plus size={15} />{t('Thêm')}</button>
        </div>
        {ds.length ? (
          <div className="danh-sach-dm">
            {ds.map((d) => (
              <div className="dong-dm" key={d.id}>
                <ONhanDienDanhMuc bieuTuong={d.bieuTuong} mau={d.mau} />
                <b>{dichTen(d.ten)}</b>
                <span className="nho mo">{t('{0} giao dịch', [dem(d.id)])}</span>
                <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setDangSua(d)} aria-label={t('Sửa {0}', [d.ten])}><Pencil size={16} /></button>
                <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setCanXoa(d)} aria-label={t('Xoá {0}', [d.ten])}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        ) : <TrangThaiTrong icon={Tags} tieuDe={t('Chưa có danh mục')} moTa={t('Tạo danh mục để phân loại giao dịch.')} />}
      </section>
    )
  }

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Danh mục')}
        moTa={t('Phân loại khoản thu chi theo cách của bạn.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      />
      <div className="luoi luoi-2" style={{ alignItems: 'start' }}>{cot('chi', t('Danh mục chi'))}{cot('thu', t('Danh mục thu'))}</div>
      <FormDanhMuc key={dangSua?.id ?? dangSua?.loai ?? 'dong'} du={dangSua} dong={() => setDangSua(null)} luu={(d) => { luu('danhMuc', d); thongBao(t('Đã lưu danh mục')); setDangSua(null) }} />
      <HopXacNhan mo={!!canXoa} tieuDe={t('Xoá danh mục {0}?', [canXoa?.ten ?? ''])} noiDung={t('Ngân sách gắn với danh mục này cũng sẽ bị xoá. Danh mục đang có giao dịch thì không xoá được.')} dong={() => setCanXoa(null)}
        dongY={() => { if (canXoa) { const loi = xoa('danhMuc', canXoa.id); thongBao(loi ?? t('Đã xoá danh mục'), loi ? 'loi' : 'ok') } setCanXoa(null) }} />
    </div>
  )
}

function FormDanhMuc({ du, dong, luu }: { du: (Partial<DanhMuc> & { loai: LoaiGiaoDich }) | null; dong: () => void; luu: (d: Omit<DanhMuc, 'id'> & { id?: string }) => void }) {
  const [ten, setTen] = useState(du?.ten ?? '')
  const [bt, setBt] = useState(du?.bieuTuong ?? 'wallet')
  const [mau, setMau] = useState(du?.mau ?? BANG_MAU[0])
  const gui = (e: FormEvent) => { e.preventDefault(); if (du && ten.trim()) luu({ id: du.id, ten: ten.trim(), loai: du.loai, bieuTuong: bt, mau }) }
  return (
    <Modal mo={!!du} dong={dong} tieuDe={du?.id ? t('Sửa danh mục') : t('Thêm danh mục {0}', [du?.loai === 'thu' ? 'thu' : 'chi'])}>
      <form className="form" onSubmit={gui}>
        <div className="truong"><label htmlFor="dm-ten">{t('Tên danh mục')}</label><input id="dm-ten" className="o-nhap" value={ten} onChange={(e) => setTen(e.target.value)} placeholder={t('Ví dụ: Cà phê')} required maxLength={30} /></div>
        <div className="truong"><span className="nhan-truong">{t('Biểu tượng')}</span>
          <div className="chon-luoi">{Object.keys(BIEU_TUONG).map((k) => <button type="button" key={k} className="chon-o" aria-pressed={bt === k} aria-label={k} onClick={() => setBt(k)}><BieuTuong ten={k} size={19} /></button>)}</div></div>
        <div className="truong"><span className="nhan-truong">{t('Màu sắc')}</span>
          <div className="chon-luoi">{BANG_MAU.map((m) => <button type="button" key={m} className="chon-mau" style={{ background: m }} aria-pressed={mau === m} aria-label={t('Màu {0}', [m])} onClick={() => setMau(m)} />)}</div></div>
        <div className="hanh-dong-form"><button type="button" className="btn btn-vien" onClick={dong}>{t('Huỷ')}</button><button className="btn">{t('Lưu danh mục')}</button></div>
      </form>
    </Modal>
  )
}
