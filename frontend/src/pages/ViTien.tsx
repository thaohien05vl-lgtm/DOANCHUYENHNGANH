import { useState, type FormEvent } from 'react'
import { Banknote, Landmark, Pencil, Plus, Smartphone, Trash2 } from 'lucide-react'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { OTien } from '../components/chung/OTien'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { BANG_MAU } from '../data/duLieuMau'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { LoaiVi, Vi } from '../types'
import { dinhDangTien } from '../utils/dinhDang'
import { soDuVi } from '../utils/thongKe'
import { t, dichTen } from '../utils/ngonNgu'

const LOAI: Record<LoaiVi, { ten: string; icon: typeof Banknote }> = {
  'tien-mat': { ten: t('Tiền mặt'), icon: Banknote },
  'ngan-hang': { ten: t('Tài khoản ngân hàng'), icon: Landmark },
  'vi-dien-tu': { ten: t('Ví điện tử'), icon: Smartphone },
}

export function ViTien() {
  const { vi, giaoDich, luu, xoa } = useDuLieu()
  const { thongBao } = useGiaoDien()
  const [dangSua, setDangSua] = useState<Vi | 'moi' | null>(null)
  const [canXoa, setCanXoa] = useState<Vi | null>(null)
  const tong = vi.reduce((s, v) => s + soDuVi(v, giaoDich), 0)

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Ví tiền')}
        moTa={t('Quản lý {0} ví tiền mặt, ngân hàng và ví điện tử. Tổng số dư hiện có: {1}.', [vi.length, dinhDangTien(tong)])}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      >
        <button className="btn" onClick={() => setDangSua('moi')}><Plus size={18} />{t('Thêm ví')}</button>
      </TieuDeTrang>
      <div className="luoi luoi-tu-dong">
        {vi.map((v) => {
          const I = LOAI[v.loai].icon
          return (
            <article key={v.id} className="the-vi" style={{ background: `linear-gradient(140deg, ${v.mau}, color-mix(in srgb, ${v.mau} 55%, #0e2a2d))` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><I size={20} /><b>{dichTen(v.ten)}</b></div>
              <div><small>{LOAI[v.loai].ten}</small><div className="so-du so">{dinhDangTien(soDuVi(v, giaoDich))}</div></div>
              <div className="thao-tac">
                <button className="btn btn-icon btn-sm" onClick={() => setDangSua(v)} aria-label={t('Sửa {0}', [v.ten])}><Pencil size={15} /></button>
                <button className="btn btn-icon btn-sm" onClick={() => setCanXoa(v)} aria-label={t('Xoá {0}', [v.ten])}><Trash2 size={15} /></button>
              </div>
            </article>
          )
        })}
        <button className="the-vi the-vi-moi" onClick={() => setDangSua('moi')}><Plus size={20} />{t('Thêm ví mới')}</button>
      </div>

      <FormVi key={dangSua === 'moi' ? 'moi' : (dangSua?.id ?? 'dong')} vi={dangSua} dong={() => setDangSua(null)} luu={(v) => { luu('vi', v); thongBao(t('Đã lưu ví')); setDangSua(null) }} />
      <HopXacNhan mo={!!canXoa} tieuDe={t('Xoá ví {0}?', [canXoa?.ten ?? ''])} noiDung={t('Chỉ xoá được ví chưa có giao dịch nào.')} dong={() => setCanXoa(null)}
        dongY={() => { if (canXoa) { const loi = xoa('vi', canXoa.id); thongBao(loi ?? t('Đã xoá ví'), loi ? 'loi' : 'ok') } setCanXoa(null) }} />
    </div>
  )
}

function FormVi({ vi, dong, luu }: { vi: Vi | 'moi' | null; dong: () => void; luu: (v: Omit<Vi, 'id'> & { id?: string }) => void }) {
  const goc = vi && vi !== 'moi' ? vi : null
  const [ten, setTen] = useState(goc?.ten ?? '')
  const [loai, setLoai] = useState<LoaiVi>(goc?.loai ?? 'ngan-hang')
  const [soDu, setSoDu] = useState(goc?.soDuBanDau ?? 0)
  const [mau, setMau] = useState(goc?.mau ?? BANG_MAU[0])
  const gui = (e: FormEvent) => { e.preventDefault(); if (ten.trim()) luu({ id: goc?.id, ten: ten.trim(), loai, soDuBanDau: soDu, mau }) }
  return (
    <Modal mo={!!vi} dong={dong} tieuDe={goc ? t('Sửa ví') : t('Thêm ví')}>
      <form className="form" onSubmit={gui}>
        <div className="truong"><label htmlFor="vi-ten">{t('Tên ví')}</label><input id="vi-ten" className="o-nhap" value={ten} onChange={(e) => setTen(e.target.value)} placeholder={t('Ví dụ: Techcombank')} required maxLength={40} /></div>
        <div className="hang-truong">
          <div className="truong"><label htmlFor="vi-loai">{t('Loại ví')}</label>
            <select id="vi-loai" className="o-chon" value={loai} onChange={(e) => setLoai(e.target.value as LoaiVi)}>{Object.entries(LOAI).map(([k, v]) => <option key={k} value={k}>{dichTen(v.ten)}</option>)}</select></div>
          <div className="truong"><label htmlFor="vi-sodu">{t('Số dư ban đầu')}</label><OTien id="vi-sodu" gia={soDu} doi={setSoDu} /></div>
        </div>
        <div className="truong"><span className="nhan-truong">{t('Màu thẻ')}</span>
          <div className="chon-luoi">{BANG_MAU.map((m) => <button type="button" key={m} className="chon-mau" style={{ background: m }} aria-pressed={mau === m} aria-label={t('Màu {0}', [m])} onClick={() => setMau(m)} />)}</div></div>
        <div className="hanh-dong-form"><button type="button" className="btn btn-vien" onClick={dong}>{t('Huỷ')}</button><button className="btn">{t('Lưu ví')}</button></div>
      </form>
    </Modal>
  )
}
