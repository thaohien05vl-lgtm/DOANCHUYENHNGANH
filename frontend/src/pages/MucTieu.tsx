import { useState, type FormEvent } from 'react'
import { CalendarClock, CheckCircle, Clock, Pencil, Plus, Target, Trash2, BellRing, Sparkles } from 'lucide-react'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { Modal } from '../components/chung/Modal'
import { OTien } from '../components/chung/OTien'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { TrangThaiTrong } from '../components/chung/TrangThaiTrong'
import { VongTienDo } from '../components/chung/VongTienDo'
import { IconCanhBaoMucTieu } from '../components/muc-tieu/IconCanhBaoMucTieu'
import { ModalNapTienMucTieu } from '../components/muc-tieu/ModalNapTienMucTieu'
import { ModalLichSuMucTieu } from '../components/muc-tieu/ModalLichSuMucTieu'
import { BANG_MAU } from '../data/duLieuMau'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import type { MucTieu } from '../types'
import { congThang, dinhDangNgay, dinhDangTien, soThangConLai, thangHienTai } from '../utils/dinhDang'
import { t } from '../utils/ngonNgu'

export function MucTieuTrang() {
  const { mucTieu, vi, giaoDich, luu, xoa, capNhatCucBo } = useDuLieu()
  const { thongBao } = useGiaoDien()

  const [dangSua, setDangSua] = useState<MucTieu | 'moi' | null>(null)
  const [canXoa, setCanXoa] = useState<MucTieu | null>(null)
  const [dangNap, setDangNap] = useState<MucTieu | null>(null)
  const [dangXemLichSu, setDangXemLichSu] = useState<MucTieu | null>(null)

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Mục tiêu tiết kiệm')}
        moTa={t('Lập kế hoạch, nạp tiền tích lũy và nhận cảnh báo ngưỡng thông minh qua ứng dụng & Gmail.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      >
        <button className="btn btn-xac-thuc-chinh" onClick={() => setDangSua('moi')}>
          <Plus size={18} />
          {t('Tạo mục tiêu')}
        </button>
      </TieuDeTrang>

      {mucTieu.length ? (
        <div className="luoi luoi-2">
          {mucTieu.map((m) => {
            const pt = m.soTienMucTieu > 0 ? (m.daTietKiem / m.soTienMucTieu) * 100 : 0
            const ptLamTron = Math.round(pt)
            const con = Math.max(m.soTienMucTieu - m.daTietKiem, 0)
            const vuot = Math.max(m.daTietKiem - m.soTienMucTieu, 0)
            const soThang = soThangConLai(m.han)
            const moiThang = soThang > 0 ? con / soThang : con
            const xong = pt >= 100
            const nguong = m.nguongCanhBao || 80

            let mauTienDo = m.mau
            if (pt > 100) mauTienDo = '#10b981'
            else if (xong) mauTienDo = '#14946f'
            else if (pt >= nguong) mauTienDo = '#f59e0b'

            return (
              <article className="the the-mt" key={m.id} style={{ position: 'relative', overflow: 'visible' }}>
                <div className="the-mt-dau">
                  <VongTienDo phanTram={Math.min(pt, 100)} mau={mauTienDo} kichThuoc={92} doDay={10} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0 }}>{m.ten}</h3>
                      <IconCanhBaoMucTieu mucTieu={m} onNapTien={() => setDangNap(m)} />
                    </div>
                    <div className="so" style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: 4, color: mauTienDo }}>
                      {dinhDangTien(m.daTietKiem)}
                    </div>
                    <div className="nho mo so">{t('trên {0}', [dinhDangTien(m.soTienMucTieu)])}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      className="btn btn-nhe btn-icon btn-sm"
                      onClick={() => setDangSua(m)}
                      aria-label={t('Sửa')}
                      title={t('Chỉnh sửa & Cài đặt')}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-nhe btn-icon btn-sm"
                      onClick={() => setCanXoa(m)}
                      aria-label={t('Xoá')}
                      title={t('Xóa mục tiêu')}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="chuoi-nhan" style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span className="nhan" style={{ whiteSpace: 'nowrap' }}>
                    <CalendarClock size={13} />
                    {t('Hạn {0}', [dinhDangNgay(m.han)])}
                  </span>
                  <span className="nhan nhan-phu" style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    <BellRing size={12} />
                    {t('Ngưỡng: {0}%', [nguong])}
                  </span>
                  {pt > 100 ? (
                    <span className="nhan nhan-ngoc" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669', whiteSpace: 'nowrap' }}>
                      <Sparkles size={13} />
                      {t('Vượt {0}', [dinhDangTien(vuot)])}
                    </span>
                  ) : xong ? (
                    <span className="nhan nhan-ngoc" style={{ whiteSpace: 'nowrap' }}>
                      <CheckCircle size={13} />
                      {t('Đã hoàn thành 100%')}
                    </span>
                  ) : (
                    <span className="nhan nhan-vang so" style={{ whiteSpace: 'nowrap' }}>
                      {t('Cần ~{0}/tháng ({1})', [dinhDangTien(moiThang), soThang > 0 ? `${soThang} tháng` : 'đến hạn'])}
                    </span>
                  )}
                </div>

                <div className="the-mt-chan" style={{ marginTop: 12, borderTop: '1px solid var(--vien)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <span className="nho mo so" style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
                    {pt > 100
                      ? t('Đã vượt mục tiêu ({0}%)', [ptLamTron])
                      : xong
                        ? t('Bạn đã đạt mục tiêu!')
                        : t('Còn thiếu {0}', [dinhDangTien(con)])}
                  </span>

                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn btn-vien btn-sm"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => setDangXemLichSu(m)}
                      title={t('Xem lịch sử nạp tiền')}
                    >
                      <Clock size={14} />
                      {t('Lịch sử')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-xac-thuc-chinh"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => setDangNap(m)}
                      title={t('Nạp tiền vào mục tiêu')}
                    >
                      <Plus size={14} />
                      {t('Nạp tiền')}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="the">
          <TrangThaiTrong
            icon={Target}
            tieuDe={t('Chưa có mục tiêu')}
            moTa={t('Đặt mục tiêu như mua laptop, quỹ khẩn cấp hay du lịch để Finora tự động theo dõi và cảnh báo tiến độ.')}
          >
            <button className="btn btn-sm btn-xac-thuc-chinh" onClick={() => setDangSua('moi')}>
              <Plus size={16} />
              {t('Tạo mục tiêu đầu tiên')}
            </button>
          </TrangThaiTrong>
        </div>
      )}

      {/* Modal Nạp tiền vào mục tiêu */}
      <ModalNapTienMucTieu
        mucTieu={dangNap}
        danhSachVi={vi}
        danhSachGiaoDich={giaoDich}
        dong={() => setDangNap(null)}
        onThanhCong={(res) => {
          // Cập nhật trạng thái cục bộ tức thì mà không cần reload trang
          capNhatCucBo((cu) => ({
            ...cu,
            mucTieu: cu.mucTieu.map((x) => (x.id === res.mucTieu.id ? res.mucTieu : x)),
            giaoDich: [res.giaoDich, ...cu.giaoDich],
          }))
        }}
      />

      {/* Modal Lịch sử nạp tiền */}
      <ModalLichSuMucTieu
        mucTieu={dangXemLichSu}
        dong={() => setDangXemLichSu(null)}
        onMoNapTien={() => {
          if (dangXemLichSu) setDangNap(dangXemLichSu)
        }}
      />

      {/* Form Tạo / Sửa mục tiêu */}
      <FormMucTieu
        key={dangSua === 'moi' ? 'moi' : (dangSua?.id ?? 'dong')}
        du={dangSua}
        dong={() => setDangSua(null)}
        luu={(m) => {
          luu('mucTieu', m)
          thongBao(t('Đã lưu thông tin mục tiêu'), 'ok')
          setDangSua(null)
        }}
      />

      {/* Hộp xác nhận xóa */}
      <HopXacNhan
        mo={!!canXoa}
        tieuDe={t('Xoá mục tiêu “{0}”?', [canXoa?.ten ?? ''])}
        noiDung={t('Mục tiêu này và tiến độ tích lũy đã ghi nhận sẽ bị xoá khỏi danh sách theo dõi. Lịch sử giao dịch tài chính vẫn được bảo toàn.')}
        dong={() => setCanXoa(null)}
        dongY={() => {
          if (canXoa) {
            xoa('mucTieu', canXoa.id)
            thongBao(t('Đã xoá mục tiêu'), 'thongtin')
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
  const [nguongCanhBao, setNguongCanhBao] = useState<number>(goc?.nguongCanhBao ?? 80)

  const gui = (e: FormEvent) => {
    e.preventDefault()
    if (ten.trim() && muc > 0) {
      luu({
        id: goc?.id,
        ten: ten.trim(),
        soTienMucTieu: muc,
        daTietKiem: Math.max(0, da),
        han,
        mau,
        nguongCanhBao: Math.min(Math.max(1, nguongCanhBao), 200),
      })
    }
  }

  const nguongGoiY = [50, 70, 80, 90]

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
            placeholder={t('Ví dụ: Mua laptop, Quỹ dự phòng…')}
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

        {/* Thiết lập ngưỡng cảnh báo */}
        <div className="truong">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="mt-nguong">{t('Ngưỡng cảnh báo tiến độ (%)')}</label>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ngoc)' }}>
              {nguongCanhBao}%
            </span>
          </div>
          <small className="mo" style={{ fontSize: '0.78rem', marginBottom: 6, display: 'block' }}>
            {t('Finora sẽ gửi thông báo trong ứng dụng & Gmail khi bạn đạt đến ngưỡng phần trăm này.')}
          </small>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {nguongGoiY.map((pct) => (
              <button
                type="button"
                key={pct}
                className={`btn btn-sm ${nguongCanhBao === pct ? 'btn-xac-thuc-chinh' : 'btn-vien'}`}
                style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                onClick={() => setNguongCanhBao(pct)}
              >
                {pct}%
              </button>
            ))}
          </div>

          <input
            id="mt-nguong"
            type="number"
            min={1}
            max={200}
            className="o-nhap"
            value={nguongCanhBao}
            onChange={(e) => setNguongCanhBao(Number(e.target.value))}
            placeholder="80"
            required
          />
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
          <button type="button" className="btn btn-vien" onClick={dong}>
            {t('Huỷ')}
          </button>
          <button className="btn btn-xac-thuc-chinh" disabled={!ten.trim() || muc <= 0}>
            {t('Lưu mục tiêu')}
          </button>
        </div>
      </form>
    </Modal>
  )
}
