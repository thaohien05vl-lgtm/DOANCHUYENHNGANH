import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Mic, MicOff, RotateCcw, Sparkles } from 'lucide-react'
import { Modal } from './Modal'
import { OTien } from './OTien'
import { useDuLieu } from '../../hooks/useDuLieu'
import { useGiaoDien } from '../../hooks/useGiaoDien'
import { bocTachGiaoDichTuGiongNoi, type BocTachGiaoDichData } from '../../services/troLyService'
import type { SpeechRecognitionEventLike } from '../../types/speech'
import { dinhDangTien } from '../../utils/dinhDang'
import { t, dichTen } from '../../utils/ngonNgu'

interface NhapGiongNoiModalProps {
  mo: boolean
  dong: () => void
  onLuuThanhCong?: () => void
}

export function NhapGiongNoiModal({ mo, dong, onLuuThanhCong }: NhapGiongNoiModalProps) {
  return (
    <Modal mo={mo} dong={dong} tieuDe={t('Nhập giao dịch bằng giọng nói')}>
      {mo && <NhapGiongNoiView dong={dong} onLuuThanhCong={onLuuThanhCong} />}
    </Modal>
  )
}

function NhapGiongNoiView({ dong, onLuuThanhCong }: { dong: () => void; onLuuThanhCong?: () => void }) {
  const { danhMuc, vi, luu } = useDuLieu()
  const { thongBao } = useGiaoDien()

  const [hoTroSpeech] = useState(() => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition))
  const [dangThuAm, setDangThuAm] = useState(false)
  const [vanBanTam, setVanBanTam] = useState('')
  const [dangPhanTich, setDangPhanTich] = useState(false)
  const [loiMicro, setLoiMicro] = useState<string | null>(null)

  // Kết quả bóc tách giao dịch
  const [ketQua, setKetQua] = useState<BocTachGiaoDichData | null>(null)

  // Dữ liệu form chỉnh sửa nháp
  const [loai, setLoai] = useState<'chi' | 'thu'>('chi')
  const [soTien, setSoTien] = useState<number>(0)
  const [maDm, setMaDm] = useState<string>('')
  const [maVi, setMaVi] = useState<string>('')
  const [ngay, setNgay] = useState<string>('')
  const [ghiChu, setGhiChu] = useState<string>('')
  const [dangLuu, setDangLuu] = useState(false)

  const recognitionRef = useRef<unknown>(null)

  useEffect(() => {
    function kichHoatThuAm() {
      dungThuAm()
      setLoiMicro(null)
      setVanBanTam('')
      setKetQua(null)

      const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechClass) {
        setLoiMicro(t('Trình duyệt không hỗ trợ Web Speech API. Bạn có thể gõ nội dung bên dưới để AI bóc tách.'))
        return
      }

      try {
        const recognition = new SpeechClass()
        recognition.lang = 'vi-VN'
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onstart = () => {
          setDangThuAm(true)
        }

        recognition.onresult = (event: SpeechRecognitionEventLike) => {
          let transcript = ''
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setVanBanTam(transcript)
        }

        recognition.onerror = (e) => {
          if (e.error === 'not-allowed') {
            setLoiMicro(t('Quyền microphone bị từ chối. Hãy cấp quyền microphone trên trình duyệt hoặc nhập nội dung bằng tay.'))
          } else if (e.error === 'no-speech') {
            // Không nghe thấy
          } else {
            setLoiMicro(t('Lỗi nhận diện âm thanh ({0}). Bạn có thể thử lại hoặc nhập câu nói bằng tay.', [e.error]))
          }
          setDangThuAm(false)
        }

        recognition.onend = () => {
          setDangThuAm(false)
        }

        recognition.start()
        recognitionRef.current = recognition
      } catch {
        setLoiMicro(t('Không thể kích hoạt microphone.'))
        setDangThuAm(false)
      }
    }

    kichHoatThuAm()
    return () => {
      dungThuAm()
    }
  }, [])

  function batDauThuAm() {
    dungThuAm()
    setLoiMicro(null)
    setVanBanTam('')
    setKetQua(null)

    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechClass) {
      setLoiMicro(t('Trình duyệt không hỗ trợ Web Speech API. Bạn có thể gõ nội dung bên dưới để AI bóc tách.'))
      return
    }

    try {
      const recognition = new SpeechClass()
      recognition.lang = 'vi-VN'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setDangThuAm(true)
      }

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        setVanBanTam(transcript)
      }

      recognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          setLoiMicro(t('Quyền microphone bị từ chối. Hãy cấp quyền microphone trên trình duyệt hoặc nhập nội dung bằng tay.'))
        } else if (e.error === 'no-speech') {
          // Không nghe thấy
        } else {
          setLoiMicro(t('Lỗi nhận diện âm thanh ({0}). Bạn có thể thử lại hoặc nhập câu nói bằng tay.', [e.error]))
        }
        setDangThuAm(false)
      }

      recognition.onend = () => {
        setDangThuAm(false)
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch {
      setLoiMicro(t('Không thể kích hoạt microphone.'))
      setDangThuAm(false)
    }
  }

  function dungThuAm() {
    if (recognitionRef.current) {
      try {
        (recognitionRef.current as { stop: () => void }).stop()
      } catch {
        // bỏ qua
      }
      recognitionRef.current = null
    }
    setDangThuAm(false)
  }

  async function hoanTatVaPhanTich(noiDung = vanBanTam) {
    dungThuAm()
    const text = noiDung.trim()
    if (!text) {
      thongBao(t('Chưa có nội dung để phân tích.'), 'thongtin')
      return
    }

    setDangPhanTich(true)
    try {
      const kq = await bocTachGiaoDichTuGiongNoi(text)
      setKetQua(kq)

      if (kq.laGiaoDich) {
        setLoai(kq.loai === 'thu' ? 'thu' : 'chi')
        setSoTien(kq.soTien || 0)

        // Map danh mục
        const danhMucPhuHop = danhMuc.find((d) => d.id === kq.maDanhMuc)
        if (danhMucPhuHop) {
          setMaDm(danhMucPhuHop.id)
        } else {
          const dmMacDinh = danhMuc.find((d) => d.loai === (kq.loai === 'thu' ? 'thu' : 'chi'))
          setMaDm(dmMacDinh?.id || danhMuc[0]?.id || '')
        }

        // Map ví
        setMaVi(vi[0]?.id || '')

        // Map ngày
        setNgay(kq.ngay || new Date().toISOString().slice(0, 10))

        // Ghi chú
        setGhiChu(kq.ghiChu || text)
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      thongBao(error.message || t('Không thể phân tích câu nói.'), 'loi')
    } finally {
      setDangPhanTich(false)
    }
  }

  function xacNhanLuu(e: FormEvent) {
    e.preventDefault()
    if (!maDm) {
      thongBao(t('Vui lòng chọn danh mục.'), 'loi')
      return
    }
    if (!maVi) {
      thongBao(t('Vui lòng chọn ví tiền.'), 'loi')
      return
    }
    if (soTien <= 0) {
      thongBao(t('Vui lòng nhập số tiền lớn hơn 0.'), 'loi')
      return
    }

    setDangLuu(true)
    try {
      luu('giaoDich', {
        loai,
        soTien,
        maDanhMuc: maDm,
        maVi,
        ngay,
        ghiChu: ghiChu.trim() || t('Giao dịch qua giọng nói'),
      })
      thongBao(t('Đã lưu giao dịch {0} thành công!', [dinhDangTien(soTien)]))
      if (onLuuThanhCong) onLuuThanhCong()
      dong()
    } catch {
      thongBao(t('Không thể lưu giao dịch.'), 'loi')
    } finally {
      setDangLuu(false)
    }
  }

  const danhMucTheoLoai = danhMuc.filter((d) => d.loai === loai)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Khu vực Ghi âm / Trạng thái */}
      {!ketQua?.laGiaoDich && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: '24px 16px',
            borderRadius: 12,
            background: 'var(--the-bg-phang, rgba(255,255,255,0.03))',
            border: '1px solid var(--vien)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: dangThuAm ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-dam, rgba(47, 211, 160, 0.1))',
              color: dangThuAm ? '#EF4444' : 'var(--ngoc, #2FD3A0)',
              transition: 'all 0.3s ease',
              boxShadow: dangThuAm ? '0 0 0 10px rgba(239, 68, 68, 0.1)' : 'none',
            }}
          >
            {dangThuAm ? <Mic size={32} /> : <MicOff size={32} />}
          </div>

          <div>
            <b style={{ fontSize: '1.05rem' }}>
              {dangThuAm
                ? t('Đang lắng nghe giọng nói của bạn…')
                : dangPhanTich
                  ? t('AI đang phân tích câu nói…')
                  : t('Bấm micro để bắt đầu nói')}
            </b>
            <p className="nho mo" style={{ marginTop: 4 }}>
              {t('Ví dụ:')} <i>{t('"Hôm nay tôi ăn trưa 45 nghìn"')}</i> {t('hoặc')} <i>{t('"Nhận lương tháng này 15 triệu"')}</i>
            </p>
          </div>

          {/* Văn bản nhận diện được */}
          <div
            style={{
              width: '100%',
              minHeight: 60,
              maxHeight: 120,
              overflowY: 'auto',
              padding: '10px 14px',
              borderRadius: 8,
              background: 'var(--nen)',
              border: '1px dashed var(--vien)',
              textAlign: 'left',
              fontSize: '0.95rem',
            }}
          >
            {vanBanTam ? (
              <span>{vanBanTam}</span>
            ) : (
              <span className="mo">
                {hoTroSpeech ? t('Nội dung bạn nói sẽ hiển thị tại đây…') : t('Nhập câu nói giao dịch bên dưới…')}
              </span>
            )}
          </div>

          {loiMicro && (
            <div className="canh-bao" role="alert" style={{ width: '100%', margin: 0, fontSize: '0.88rem' }}>
              <AlertCircle size={16} />
              <span>{loiMicro}</span>
            </div>
          )}

          {/* Trường hợp kết quả không phải giao dịch */}
          {ketQua && !ketQua.laGiaoDich && (
            <div
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                textAlign: 'left',
                fontSize: '0.9rem',
              }}
            >
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                <Sparkles size={16} color="#3B82F6" />
                <b>{t('Phản hồi từ AI:')}</b>
              </div>
              <p style={{ margin: 0 }}>{ketQua.phanHoi}</p>
            </div>
          )}

          {/* Nút hành động */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            {dangThuAm ? (
              <button
                type="button"
                className="btn btn-san-ho"
                onClick={() => hoanTatVaPhanTich()}
                disabled={!vanBanTam.trim()}
              >
                <CheckCircle2 size={16} /> {t('Xong & Phân tích')}
              </button>
            ) : (
              <>
                <button type="button" className="btn" onClick={batDauThuAm} disabled={dangPhanTich}>
                  <Mic size={16} /> {t('Bấm để nói lại')}
                </button>
                {vanBanTam.trim() && !dangPhanTich && (
                  <button
                    type="button"
                    className="btn btn-vien"
                    onClick={() => hoanTatVaPhanTich()}
                  >
                    <Sparkles size={16} /> {t('Phân tích lại')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Biểu mẫu giao dịch nháp (Draft Form) sau khi AI phân tích thành công */}
      {ketQua?.laGiaoDich && (
        <form className="form" onSubmit={xacNhanLuu}>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(47, 211, 160, 0.1)',
              border: '1px solid rgba(47, 211, 160, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={16} color="var(--ngoc)" />
              <b style={{ color: 'var(--ngoc)', fontSize: '0.9rem' }}>{t('AI đã nhận diện thành công:')}</b>
            </div>
            <p className="nho" style={{ margin: 0, fontStyle: 'italic' }}>
              "{vanBanTam || ghiChu}"
            </p>
            {ketQua.soTienUocLuong && (
              <span className="nho" style={{ color: '#F59E0B' }}>
                {t('⚠️ Số tiền trong câu nói mang tính ước lượng ("khoảng/tầm"). Vui lòng kiểm tra lại.')}
              </span>
            )}
          </div>

          <div className="doan" role="group" aria-label={t('Loại giao dịch')} style={{ width: '100%' }}>
            <button
              type="button"
              className={loai === 'chi' ? 'chi-on' : ''}
              aria-pressed={loai === 'chi'}
              onClick={() => {
                setLoai('chi')
                const firstChi = danhMuc.find((d) => d.loai === 'chi')
                if (firstChi) setMaDm(firstChi.id)
              }}
              style={{ flex: 1 }}
            >
              {t('Chi tiêu')}
            </button>
            <button
              type="button"
              className={loai === 'thu' ? 'thu-on' : ''}
              aria-pressed={loai === 'thu'}
              onClick={() => {
                setLoai('thu')
                const firstThu = danhMuc.find((d) => d.loai === 'thu')
                if (firstThu) setMaDm(firstThu.id)
              }}
              style={{ flex: 1 }}
            >
              {t('Thu nhập')}
            </button>
          </div>

          <div className="truong">
            <label htmlFor="voice-sotien">{t('Số tiền ({0})', [loai === 'chi' ? 'chi' : 'thu'])}</label>
            <OTien id="voice-sotien" gia={soTien} doi={setSoTien} lon />
          </div>

          <div className="hang-truong">
            <div className="truong">
              <label htmlFor="voice-dm">{t('Danh mục')}</label>
              <select
                id="voice-dm"
                className="o-chon"
                value={maDm}
                onChange={(e) => setMaDm(e.target.value)}
                required
              >
                {danhMucTheoLoai.map((d) => (
                  <option key={d.id} value={d.id}>
                    {dichTen(d.ten)}
                  </option>
                ))}
              </select>
            </div>

            <div className="truong">
              <label htmlFor="voice-vi">{t('Ví thanh toán')}</label>
              <select
                id="voice-vi"
                className="o-chon"
                value={maVi}
                onChange={(e) => setMaVi(e.target.value)}
                required
              >
                {vi.map((v) => (
                  <option key={v.id} value={v.id}>
                    {dichTen(v.ten)} ({dinhDangTien(v.soDuBanDau)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="hang-truong">
            <div className="truong">
              <label htmlFor="voice-ngay">{t('Ngày giao dịch')}</label>
              <input
                id="voice-ngay"
                type="date"
                className="o-nhap"
                value={ngay}
                onChange={(e) => setNgay(e.target.value)}
                required
              />
            </div>

            <div className="truong">
              <label htmlFor="voice-ghichu">{t('Ghi chú / Nội dung')}</label>
              <input
                id="voice-ghichu"
                className="o-nhap"
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
                placeholder={t('Ghi chú giao dịch')}
              />
            </div>
          </div>

          <div className="hanh-dong-form" style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-vien"
              onClick={() => {
                setKetQua(null)
                batDauThuAm()
              }}
            >
              <RotateCcw size={16} /> {t('Nói lại')}
            </button>
            <button type="submit" className="btn" disabled={dangLuu || soTien <= 0}>
              {dangLuu ? t('Đang lưu…') : t('Xác nhận lưu giao dịch')}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
