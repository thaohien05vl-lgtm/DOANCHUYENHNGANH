import { useState } from 'react'
import { Server } from 'lucide-react'
import axios from 'axios'
import { Modal } from './Modal'
import { datDiaChiMayChu, diaChiMayChuHienTai } from '../../services/api'
import { t } from '../../utils/ngonNgu'

/**
 * Cho phép đổi địa chỉ backend ngay trong app (vd. IP máy tính trong mạng Wi-Fi thay đổi)
 * mà không phải build lại APK.
 */
export function CaiDatMayChu() {
  const [mo, setMo] = useState(false)
  const [url, setUrl] = useState('')
  const [ketQua, setKetQua] = useState<{ ok: boolean; noiDung: string } | null>(null)
  const [dangKiemTra, setDangKiemTra] = useState(false)

  const moHop = () => {
    setUrl(diaChiMayChuHienTai())
    setKetQua(null)
    setMo(true)
  }

  const kiemTra = async () => {
    setDangKiemTra(true)
    setKetQua(null)
    try {
      await axios.get(url.trim().replace(/\/+$/, '') + '/', { timeout: 6000, validateStatus: () => true })
      setKetQua({ ok: true, noiDung: t('Kết nối được tới máy chủ.') })
    } catch {
      setKetQua({ ok: false, noiDung: t('Không kết nối được. Kiểm tra địa chỉ, Wi-Fi và backend đang chạy.') })
    } finally {
      setDangKiemTra(false)
    }
  }

  const luu = () => {
    datDiaChiMayChu(url)
    setMo(false)
  }

  return (
    <>
      <button type="button" className="nut-may-chu" onClick={moHop} title={t('Thay đổi địa chỉ kết nối máy chủ backend')}>
        <Server size={14} />
        <span>{t('Máy chủ: {0}', [diaChiMayChuHienTai().replace(/^https?:\/\//, '')])}</span>
      </button>
      <Modal mo={mo} dong={() => setMo(false)} tieuDe={t('Máy chủ kết nối')}>
        <div className="truong">
          <label htmlFor="may-chu-url">{t('Địa chỉ máy chủ (ví dụ: http://192.168.1.10:8080)')}</label>
          <input
            id="may-chu-url"
            className="o-nhap"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://192.168.1.10:8080"
          />
        </div>
        {ketQua && (
          <div className={ketQua.ok ? 'canh-bao vang' : 'canh-bao'} role="status" style={{ marginTop: 10 }}>
            {ketQua.noiDung}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-vien" onClick={kiemTra} disabled={dangKiemTra || !url.trim()}>
            {dangKiemTra ? t('Đang kiểm tra…') : t('Kiểm tra kết nối')}
          </button>
          <button type="button" className="btn btn-vien" onClick={() => { datDiaChiMayChu(''); setUrl(diaChiMayChuHienTai()) }}>
            {t('Về mặc định')}
          </button>
          <button type="button" className="btn" onClick={luu}>{t('Lưu')}</button>
        </div>
      </Modal>
    </>
  )
}
