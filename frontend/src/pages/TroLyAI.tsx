import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Bot,
  Camera,
  ImagePlus,
  Mic,
  MicOff,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import { CameraModal } from '../components/chung/CameraModal'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { hoiTroLy, type TinNhanLichSu } from '../services/troLyService'
import { nenAnh } from '../utils/anh'
import { maLocaleHienTai, t } from '../utils/ngonNgu'

interface TinNhan {
  vai: 'nguoi' | 'may'
  noiDung: string
  anhBase64?: string
  thoiGian?: string
}

const GOI_Y_DA_DANG = [
  t('Tháng này mình đã tiêu bao nhiêu tiền?'),
  t('Ngân sách nào sắp vượt?'),
  t('Gợi ý cách tiết kiệm từ số liệu chi tiêu'),
  t('Tiến độ các mục tiêu của mình thế nào?'),
  t('Lập kế hoạch học tiếng Anh hiệu quả trong 3 tháng'),
  t('Giải thích điện toán đám mây cho người mới'),
  t('Gợi ý thực đơn ăn trưa lành mạnh, tiết kiệm'),
]

export function TroLyAI() {
  const { thongBao } = useGiaoDien()
  const [tin, setTin] = useState<TinNhan[]>([
    {
      vai: 'may',
      noiDung:
        t('Chào bạn! Mình là Trợ lý AI Finora. Mình có thể phân tích số liệu tài chính thực tế của bạn (thu chi, ngân sách, mục tiêu), đọc hình ảnh hóa đơn/tài liệu, và giải đáp MỌI câu hỏi trong cuộc sống, học tập, công nghệ. Bạn muốn trao đổi điều gì hôm nay?'),
      thoiGian: new Date().toLocaleTimeString(maLocaleHienTai, { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [nhap, setNhap] = useState('')
  const [dangTraLoi, setDangTraLoi] = useState(false)
  const [anhDinhKem, setAnhDinhKem] = useState<string | null>(null)
  const [moCamera, setMoCamera] = useState(false)
  const [dangThuAm, setDangThuAm] = useState(false)

  const cuoi = useRef<HTMLDivElement>(null)
  const inputAnhRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<unknown>(null)

  useEffect(() => {
    cuoi.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [tin, dangTraLoi])

  useEffect(() => {
    return () => {
      dungThuAm()
    }
  }, [])

  function batDauThuAm() {
    if (dangThuAm) {
      dungThuAm()
      return
    }

    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechClass) {
      thongBao(t('Trình duyệt chưa hỗ trợ Web Speech API. Vui lòng nhập câu hỏi bằng bàn phím.'), 'thongtin')
      return
    }

    try {
      const recognition = new SpeechClass()
      recognition.lang = 'vi-VN'
      recognition.continuous = false
      recognition.interimResults = true

      recognition.onstart = () => {
        setDangThuAm(true)
        thongBao(t('Đang lắng nghe... hãy nói câu hỏi của bạn'), 'thongtin')
      }

      recognition.onresult = (event: unknown) => {
        const ev = event as { results: { [key: number]: { [key: number]: { transcript: string } } } }
        const transcript = ev.results[0]?.[0]?.transcript || ''
        if (transcript) {
          setNhap((prev) => (prev ? `${prev} ${transcript}` : transcript))
        }
      }

      recognition.onerror = () => {
        setDangThuAm(false)
      }

      recognition.onend = () => {
        setDangThuAm(false)
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch {
      setDangThuAm(false)
      thongBao(t('Không thể mở microphone.'), 'loi')
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

  async function chonTepAnh(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const base64 = await nenAnh(file, 1024, 0.8)
      setAnhDinhKem(base64)
      thongBao(t('Đã đính kèm ảnh'))
    } catch {
      thongBao(t('Không thể đọc file ảnh.'), 'loi')
    } finally {
      e.target.value = ''
    }
  }

  async function gui(cauHoi: string) {
    dungThuAm()
    const q = cauHoi.trim()
    const img = anhDinhKem
    if ((!q && !img) || dangTraLoi) return

    setNhap('')
    setAnhDinhKem(null)

    const now = new Date().toLocaleTimeString(maLocaleHienTai, { hour: '2-digit', minute: '2-digit' })
    const tinMoi: TinNhan = {
      vai: 'nguoi',
      noiDung: q || (img ? t('Hãy giải thích và phân tích bức ảnh này giúp tôi.') : ''),
      anhBase64: img || undefined,
      thoiGian: now,
    }

    const lichSuGui: TinNhanLichSu[] = tin.map((tn) => ({
      vai: tn.vai,
      noiDung: tn.noiDung,
      anhBase64: tn.anhBase64,
    }))

    setTin((tc) => [...tc, tinMoi])
    setDangTraLoi(true)

    try {
      const tl = await hoiTroLy(tinMoi.noiDung, lichSuGui, img || undefined)
      setTin((tc) => [
        ...tc,
        {
          vai: 'may',
          noiDung: tl,
          thoiGian: new Date().toLocaleTimeString(maLocaleHienTai, { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (error) {
      const loi = error as { response?: { data?: { message?: string } }; message?: string }
      setTin((tc) => [
        ...tc,
        {
          vai: 'may',
          noiDung:
            loi.response?.data?.message ||
            t('Không thể kết nối trợ lý AI. Vui lòng kiểm tra API Key trong backend/.env và thử lại.'),
          thoiGian: new Date().toLocaleTimeString(maLocaleHienTai, { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setDangTraLoi(false)
    }
  }

  function batDauHoiThoaiMoi() {
    dungThuAm()
    setAnhDinhKem(null)
    setNhap('')
    setTin([
      {
        vai: 'may',
        noiDung: t('Đã làm mới cuộc trò chuyện! Bạn muốn mình hỗ trợ về chủ đề tài chính hay bất kỳ câu hỏi nào khác?'),
        thoiGian: new Date().toLocaleTimeString(maLocaleHienTai, { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    thongBao(t('Đã bắt đầu cuộc trò chuyện mới'))
  }

  return (
    <div className="trang">
      <TieuDeTrang
        tieuDe={t('Trợ lý AI Finora')}
        moTa={t('Trò chuyện thông minh, phân tích tài chính cá nhân thực tế và hỗ trợ đa phương thức bằng giọng nói và hình ảnh.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      >
        <button
          type="button"
          className="btn btn-vien btn-sm"
          onClick={batDauHoiThoaiMoi}
          title={t('Bắt đầu phiên hội thoại mới')}
        >
          <RotateCcw size={15} /> {t('Hội thoại mới')}
        </button>
      </TieuDeTrang>

      <section className="the the-phang tro-ly">
        {/* Vùng tin nhắn */}
        <div className="tro-ly-tin">
          {tin.map((tn, i) => (
            <div key={i} className={`bong-chat ${tn.vai}`}>
              {tn.anhBase64 && (
                <div style={{ marginBottom: 8, borderRadius: 8, overflow: 'hidden', maxHeight: 220 }}>
                  <img
                    src={tn.anhBase64}
                    alt={t('Ảnh đính kèm')}
                    style={{ maxWidth: '100%', maxHeight: 220, objectFit: 'contain', display: 'block' }}
                  />
                </div>
              )}
              <div style={{ wordBreak: 'break-word', lineHeight: 1.55 }}>{tn.noiDung}</div>
              {tn.thoiGian && (
                <div
                  style={{
                    fontSize: '0.72rem',
                    opacity: 0.65,
                    marginTop: 4,
                    textAlign: tn.vai === 'nguoi' ? 'right' : 'left',
                  }}
                >
                  {tn.thoiGian}
                </div>
              )}
            </div>
          ))}

          {dangTraLoi && (
            <div className="bong-chat may dang-go" aria-label={t('Trợ lý đang trả lời')}>
              <i />
              <i />
              <i />
            </div>
          )}
          <div ref={cuoi} />
        </div>

        {/* Khung xem trước ảnh đính kèm trước khi gửi */}
        {anhDinhKem && (
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--vien)',
              background: 'var(--be-mat-2, rgba(0,0,0,0.05))',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--vien)' }}>
              <img src={anhDinhKem} alt={t('Xem trước')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b style={{ fontSize: '0.85rem' }}>{t('Đã đính kèm hình ảnh')}</b>
              <p className="nho mo" style={{ margin: 0 }}>
                {t('AI sẽ quan sát bức ảnh này cùng câu hỏi của bạn.')}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-nhe btn-sm btn-icon"
              onClick={() => setAnhDinhKem(null)}
              title={t('Gỡ ảnh')}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Gợi ý câu hỏi khi đoạn chat còn ngắn */}
        {tin.length < 4 && (
          <div className="goi-y">
            {GOI_Y_DA_DANG.slice(0, 4).map((g) => (
              <button key={g} onClick={() => gui(g)}>
                {g}
              </button>
            ))}
          </div>
        )}

        {/* Thanh công cụ nhập liệu */}
        <form
          className="tro-ly-nhap"
          onSubmit={(e: FormEvent) => {
            e.preventDefault()
            gui(nhap)
          }}
          style={{ alignItems: 'center' }}
        >
          {/* Nút đính kèm ảnh */}
          <button
            type="button"
            className="btn btn-vien btn-icon btn-sm"
            style={{ minWidth: 40, height: 40, borderRadius: 10 }}
            onClick={() => inputAnhRef.current?.click()}
            title={t('Tải ảnh từ máy')}
          >
            <ImagePlus size={18} />
          </button>
          <input
            ref={inputAnhRef}
            type="file"
            accept="image/*"
            onChange={chonTepAnh}
            style={{ display: 'none' }}
          />

          {/* Nút chụp camera trực tiếp */}
          <button
            type="button"
            className="btn btn-vien btn-icon btn-sm"
            style={{ minWidth: 40, height: 40, borderRadius: 10 }}
            onClick={() => setMoCamera(true)}
            title={t('Chụp ảnh từ camera')}
          >
            <Camera size={18} />
          </button>

          {/* Nút ghi âm giọng nói */}
          <button
            type="button"
            className={`btn btn-icon btn-sm ${dangThuAm ? 'btn-san-ho' : 'btn-vien'}`}
            style={{
              minWidth: 40,
              height: 40,
              borderRadius: 10,
              color: dangThuAm ? '#EF4444' : undefined,
            }}
            onClick={batDauThuAm}
            title={dangThuAm ? t('Dừng ghi âm') : t('Nói câu hỏi (Microphone)')}
          >
            {dangThuAm ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Ô nhập văn bản */}
          <input
            className="o-nhap"
            value={nhap}
            onChange={(e) => setNhap(e.target.value)}
            placeholder={
              dangThuAm
                ? t('Đang lắng nghe giọng nói của bạn…')
                : anhDinhKem
                  ? t('Nhập câu hỏi về bức ảnh này…')
                  : t('Hỏi bất kỳ điều gì (tài chính, học tập, cuộc sống)…')
            }
            aria-label={t('Câu hỏi')}
            style={{ flex: 1 }}
          />

          {/* Nút gửi */}
          <button
            className="btn btn-icon"
            style={{ width: 44, height: 40, borderRadius: 10 }}
            disabled={(!nhap.trim() && !anhDinhKem) || dangTraLoi}
            aria-label={t('Gửi')}
          >
            <SendHorizontal size={19} />
          </button>
        </form>
      </section>

      <p className="nho mo" style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
        <Bot size={15} />
        <span>
          {t('Trợ lý AI sử dụng mô hình Gemini thế hệ mới, kết hợp số liệu tài chính thực tế và kiến thức cuộc sống đa năng.')}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Sparkles size={13} color="var(--ngoc)" /> {t('Multimodal & Voice Enabled')}
        </span>
      </p>

      {/* Modal Camera chụp ảnh gửi cho AI */}
      <CameraModal
        mo={moCamera}
        dong={() => setMoCamera(false)}
        onChupAnh={async (file) => {
          try {
            const base64 = await nenAnh(file, 1024, 0.8)
            setAnhDinhKem(base64)
            thongBao(t('Đã chụp ảnh xong! Hãy nhập câu hỏi về bức ảnh này.'))
          } catch {
            thongBao(t('Không thể xử lý ảnh camera.'), 'loi')
          }
        }}
        tieuDe={t('Chụp ảnh gửi cho Trợ lý AI')}
      />
    </div>
  )
}
