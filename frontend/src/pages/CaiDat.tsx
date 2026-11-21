import { useState } from 'react'
import { Download, Eye, EyeOff, Languages, LogOut, RotateCcw, ShieldCheck, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HopXacNhan } from '../components/chung/HopXacNhan'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { DANH_SACH_CHU_DE } from '../data/chuDe'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { useXacThuc } from '../hooks/useXacThuc'
import { TEN_NGON_NGU, type NgonNgu } from '../utils/ngonNgu'
import { t } from '../utils/ngonNgu'

export function CaiDat() {
  const { nguoiDung, dangXuat } = useXacThuc()
  const { theme, doiChuDe, anSoDu, doiAnSoDu, ngonNgu, ngonNguDangDung, doiNgonNgu, thongBao } = useGiaoDien()
  const du = useDuLieu()
  const [hoiDatLai, setHoiDatLai] = useState(false)

  function saoLuu() {
    const { vi, danhMuc, giaoDich, nganSach, mucTieu } = du
    const a = document.createElement('a')
    const url = URL.createObjectURL(new Blob([JSON.stringify({ vi, danhMuc, giaoDich, nganSach, mucTieu }, null, 2)], { type: 'application/json' }))
    a.href = url
    a.download = 'sao-luu-finora.json'
    a.click()
    URL.revokeObjectURL(url)
    thongBao(t('Đã tải bản sao lưu dữ liệu'))
  }

  return (
    <div className="trang">
      <TieuDeTrang tieuDe={t('Cài đặt')} moTa={t('Tuỳ chỉnh không gian và trải nghiệm sử dụng Finora.')} />

      <section className="the">
        <div className="the-dau"><h2>{t('Giao diện')}</h2><span className="nho mo">{t('15 bảng màu dịu mắt')}</span></div>
        <div className="mau-chu-de-luoi">
          {DANH_SACH_CHU_DE.map((item) => (
            <button type="button" key={item.id} className="mau-chu-de" aria-pressed={theme === item.id} onClick={() => doiChuDe(item.id)}>
              <span className="mau-chu-de-mau" aria-hidden="true">{item.mau.map((mau) => <i key={mau} style={{ background: mau }} />)}</span>
              <b>{item.ten}</b>
              <small>{item.moTa} · {item.cheDo === 'toi' ? t('Tối') : t('Sáng')}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="the">
        <div className="the-dau"><h2><Languages size={18} style={{ display: 'inline', verticalAlign: -4, marginRight: 7 }} />{t('Ngôn ngữ')}</h2></div>
        <div className="truong" style={{ maxWidth: 380 }}>
          <label htmlFor="cd-ngon-ngu">{t('Chọn ngôn ngữ hiển thị')}</label>
          <select id="cd-ngon-ngu" className="o-chon" value={ngonNgu} onChange={(e) => doiNgonNgu(e.target.value as NgonNgu)}>
            {Object.entries(TEN_NGON_NGU).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
          </select>
          {ngonNgu !== ngonNguDangDung && <small className="mo">{t('Ngôn ngữ mới sẽ được áp dụng sau khi khởi động lại ứng dụng.')}</small>}
        </div>
      </section>

      <section className="the">
        <div className="the-dau"><h2><ShieldCheck size={18} style={{ display: 'inline', verticalAlign: -4, marginRight: 7 }} />{t('Quyền riêng tư')}</h2></div>
        <button type="button" className="khoanh-khac-dau" style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', padding: 0 }} onClick={doiAnSoDu} aria-pressed={anSoDu}>
          <span style={{ display: 'flex', gap: 12, alignItems: 'center' }}><span className="icon-tron"><EyeOff size={19} /></span><span><b>{t('Ẩn số tiền trên màn hình')}</b><small className="mo" style={{ display: 'block' }}>{t('Làm mờ số dư, thu chi và các số liệu tài chính có định dạng tiền.')}</small></span></span>
          <span className="btn btn-vien btn-sm">{anSoDu ? <><Eye size={15} />{t('Đang ẩn')}</> : <><EyeOff size={15} />{t('Đang hiện')}</>}</span>
        </button>
      </section>

      <section className="the">
        <div className="the-dau"><h2><UserRound size={18} style={{ display: 'inline', verticalAlign: -4, marginRight: 7 }} />{t('Hồ sơ cá nhân')}</h2></div>
        <div className="khoanh-khac-dau">
          <div><b>{nguoiDung?.ten}</b><p className="nho mo">{nguoiDung?.email}</p></div>
          <Link to="/ho-so" className="btn btn-vien btn-sm">{t('Chỉnh sửa hồ sơ')}</Link>
        </div>
      </section>

      <section className="the">
        <div className="the-dau"><h2>{t('Dữ liệu')}</h2></div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-vien" onClick={saoLuu}><Download size={17} />{t('Sao lưu (JSON)')}</button>
          <button className="btn btn-vien" onClick={() => setHoiDatLai(true)}><RotateCcw size={17} />{t('Khôi phục dữ liệu mẫu')}</button>
        </div>
        <p className="nho mo" style={{ marginTop: 12 }}>{t('Dữ liệu tài chính được đồng bộ lên backend và lưu theo từng tài khoản trong SQL Server. Bạn nên tải bản sao lưu định kỳ.')}</p>
      </section>
      <button className="btn btn-vien" style={{ alignSelf: 'flex-start' }} onClick={dangXuat}><LogOut size={17} />{t('Đăng xuất')}</button>
      <HopXacNhan mo={hoiDatLai} tieuDe={t('Khôi phục dữ liệu mẫu?')} noiDung={t('Toàn bộ giao dịch, ví, ngân sách và mục tiêu hiện tại sẽ được thay bằng dữ liệu mẫu.')} dong={() => setHoiDatLai(false)} dongY={() => { du.datLaiMau(); setHoiDatLai(false); thongBao(t('Đã khôi phục dữ liệu mẫu')) }} />
    </div>
  )
}
