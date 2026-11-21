import { useState, type FormEvent } from 'react'
import { CalendarClock, CheckCircle, Pencil, Plus, Target, Trash2 } from 'lucide-react'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { OTien } from '../components/chung/OTien'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { VongTienDo } from '../components/chung/VongTienDo'
import { BANG_MAU } from '../data/duLieuMau'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { MucTieu } from '../types'
import { congThang, dinhDangNgay, dinhDangTien, soThangConLai, thangHienTai } from '../utils/dinhDang'
import { t } from '../utils/ngonNgu'

export function MucTieuTrang() {
  const { mucTieu, luu, xoa } = useDuLieu()
  const { thongBao } = useGiaoDien()
  const [dangSua, setDangSua] = useState<MucTieu | 'moi' | null>(null)
  const [canXoa, setCanXoa] = useState<MucTieu | null>(null)

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Mục tiêu tiết kiệm')}
        moTa={t('Lập kế hoạch và theo dõi tiến độ tích lũy cho các dự định tài chính.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      >
        <button className="btn" onClick={() => setDangSua('moi')}><Plus size={18} />{t('Tạo mục tiêu')}</button>
      </TieuDeTrang>
      {mucTieu.length ? (
        <div className="luoi luoi-2">
          {mucTieu.map((m) => {
            const pt = m.soTienMucTieu > 0 ? (m.daTietKiem / m.soTienMucTieu) * 100 : 0
            const con = Math.max(m.soTienMucTieu - m.daTietKiem, 0)
            const soThang = soThangConLai(m.han)
            const moiThang = soThang > 0 ? con / soThang : con
            const xong = pt >= 100
            return (
              <article className="the the-mt" key={m.id}>
                <div className="the-mt-dau">
                  <VongTienDo phanTram={pt} mau={xong ? '#14946f' : m.mau} kichThuoc={92} doDay={10} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3>{m.ten}</h3>
                    <div className="so" style={{ fontWeight: 700, fontSize: '1.15rem', marginTop: 2 }}>{dinhDangTien(m.daTietKiem)}</div>
                    <div className="nho mo so">{t('trên {0}', [dinhDangTien(m.soTienMucTieu)])}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setDangSua(m)} aria-label={t('Sửa')}><Pencil size={16} /></button>
                    <button className="btn btn-nhe btn-icon btn-sm" onClick={() => setCanXoa(m)} aria-label={t('Xoá')}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="chuoi-nhan">
                  <span className="nhan"><CalendarClock size={13} />{t('Hạn {0}', [dinhDangNgay(m.han)])}</span>
                  {xong ? (
                    <span className="nhan nhan-ngoc"><CheckCircle size={13} />{t('Đã hoàn thành')}</span>
                  ) : (
                    <span className="nhan nhan-vang so">{t('Cần ~{0}/tháng ({1})', [dinhDangTien(moiThang), soThang > 0 ? `${soThang} tháng` : 'đến hạn'])}</span>
                  )}
                </div>
                <div className="the-mt-chan">
                  <span className="nho mo so">{xong ? t('Bạn đã đạt mục tiêu!') : t('Còn thiếu {0}', [dinhDangTien(con)])}</span>
                  <button className="btn btn-vien btn-sm" onClick={() => setDangSua(m)}><Pencil size={14} />{t('Cập nhật tiến độ')}</button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="the">
          <TrangThaiTrong icon={Target} tieuDe={t('Chưa có mục tiêu')} moTa={t('Đặt mục tiêu như mua laptop, dự phòng khẩn cấp hay du lịch để biết mỗi tháng cần tích lũy bao nhiêu.')}>
            <button className="btn btn-sm" onClick={() => setDangSua('moi')}><Plus size={16} />{t('Tạo mục tiêu đầu tiên')}</button>
          </TrangThaiTrong>
        </div>
      )}

      <FormMucTieu
        key={dangSua === 'moi' ? 'moi' : (dangSua?.id ?? 'dong')}
        du={dangSua}
        dong={() => setDangSua(null)}
        luu={(m) => {
          luu('mucTieu', m)
          thongBao(t('Đã lưu thông tin mục tiêu'))
          setDangSua(null)
        }}
      />
      <HopXacNhan
        mo={!!canXoa}
        tieuDe={t('Xoá mục tiêu “{0}”?', [canXoa?.ten ?? ''])}
        noiDung={t('Mục tiêu này và tiến độ tích lũy đã ghi nhận sẽ bị xoá khỏi danh sách theo dõi.')}
        dong={() => setCanXoa(null)}
        dongY={() => {
          if (canXoa) {
            xoa('mucTieu', canXoa.id)
            thongBao(t('Đã xoá mục tiêu'))
          }
          setCanXoa(null)
        }}
      />
    </div>
  )
}

function FormMucTieu({
  du,
  dong,
  luu,
}: {
  du: MucTieu | 'moi' | null
  dong: () => void
  luu: (m: Omit<MucTieu, 'id'> & { id?: string }) => void
}) {
  const goc = du && du !== 'moi' ? du : null
  const [ten, setTen] = useState(goc?.ten ?? '')
  const [muc, setMuc] = useState(goc?.soTienMucTieu ?? 0)
  const [da, setDa] = useState(goc?.daTietKiem ?? 0)
  const [han, setHan] = useState(goc?.han ?? `${congThang(thangHienTai(), 6)}-28`)
  const [mau, setMau] = useState(goc?.mau ?? BANG_MAU[3])

  const gui = (e: FormEvent) => {
    e.preventDefault()
    if (ten.trim() && muc > 0) {
      luu({ id: goc?.id, ten: ten.trim(), soTienMucTieu: muc, daTietKiem: Math.max(0, da), han, mau })
    }
  }

  return (
    <Modal mo={!!du} dong={dong} tieuDe={goc ? t('Cập nhật mục tiêu') : t('Tạo mục tiêu mới')}>
      <form className="form" onSubmit={gui}>
        <div className="truong">
          <label htmlFor="mt-ten">{t('Tên mục tiêu')}</label>
          <input
            id="mt-ten"
            className="o-nhap"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            placeholder={t('Ví dụ: Mua máy tính làm việc')}
            required
            maxLength={60}
          />
        </div>
        <div className="hang-truong">
          <div className="truong">
            <label htmlFor="mt-muc">{t('Số tiền mục tiêu cần đạt')}</label>
            <OTien id="mt-muc" gia={muc} doi={setMuc} />
          </div>
          <div className="truong">
            <label htmlFor="mt-da">{t('Số tiền hiện đã tích lũy')}</label>
            <OTien id="mt-da" gia={da} doi={setDa} />
          </div>
        </div>
        <div className="truong">
          <label htmlFor="mt-han">{t('Hạn hoàn thành')}</label>
          <input id="mt-han" type="date" className="o-nhap" value={han} onChange={(e) => setHan(e.target.value)} required />
        </div>
        <div className="truong">
          <span className="nhan-truong">{t('Màu đại diện')}</span>
          <div className="chon-luoi">
            {BANG_MAU.map((m) => (
              <button
                type="button"
                key={m}
                className="chon-mau"
                style={{ background: m }}
                aria-pressed={mau === m}
                aria-label={t('Màu {0}', [m])}
                onClick={() => setMau(m)}
              />
            ))}
          </div>
        </div>
        <div className="hanh-dong-form">
          <button type="button" className="btn btn-vien" onClick={dong}>{t('Huỷ')}</button>
          <button className="btn" disabled={!ten.trim() || muc <= 0}>{t('Lưu mục tiêu')}</button>
        </div>
      </form>
    </Modal>
  )
}
