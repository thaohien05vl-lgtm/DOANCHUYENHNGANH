import { useEffect, useRef, useState } from 'react'
import { Camera, RotateCcw, SwitchCamera, X } from 'lucide-react'
import { Modal } from './Modal'
import { t } from '../../utils/ngonNgu'

interface CameraModalProps {
  mo: boolean
  dong: () => void
  onChupAnh: (file: File) => void
  tieuDe?: string
}

export function CameraModal({ mo, dong, onChupAnh, tieuDe = t('Chụp ảnh trực tiếp') }: CameraModalProps) {
  return (
    <Modal mo={mo} dong={dong} tieuDe={tieuDe}>
      {mo && <CameraView dong={dong} onChupAnh={onChupAnh} />}
    </Modal>
  )
}

function CameraView({ dong, onChupAnh }: { dong: () => void; onChupAnh: (file: File) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [dangBatCamera, setDangBatCamera] = useState(true)
  const [loiCamera, setLoiCamera] = useState<string | null>(null)
  const [dungCamSau, setDungCamSau] = useState(true)
  const [anhTam, setAnhTam] = useState<string | null>(null)
  const [blobTam, setBlobTam] = useState<Blob | null>(null)

  useEffect(() => {
    let conHieuLuc = true

    async function moStream() {
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (conHieuLuc) {
          setLoiCamera(t('Trình duyệt hoặc thiết bị này không hỗ trợ truy cập camera.'))
          setDangBatCamera(false)
        }
        return
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: dungCamSau ? { ideal: 'environment' } : 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (!conHieuLuc) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        setDangBatCamera(false)
      } catch (err: unknown) {
        if (!conHieuLuc) return
        const error = err as { name?: string }
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          setLoiCamera(t('Quyền sử dụng camera bị từ chối. Vui lòng cho phép quyền trên trình duyệt.'))
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          setLoiCamera(t('Không tìm thấy camera trên thiết bị này.'))
        } else {
          setLoiCamera(t('Không thể mở camera. Hãy thử kiểm tra thiết bị hoặc tải ảnh từ máy tính.'))
        }
        setDangBatCamera(false)
      }
    }

    moStream()

    return () => {
      conHieuLuc = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [dungCamSau])

  function chupAnh() {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        setBlobTam(blob)
        setAnhTam(URL.createObjectURL(blob))
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
          streamRef.current = null
        }
      },
      'image/jpeg',
      0.9,
    )
  }

  function chupLai() {
    if (anhTam) URL.revokeObjectURL(anhTam)
    setAnhTam(null)
    setBlobTam(null)
    setDangBatCamera(true)
    setDungCamSau((prev) => prev) // trigger re-open
  }

  function xacNhanSuDung() {
    if (!blobTam) return
    const file = new File([blobTam], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' })
    onChupAnh(file)
    dong()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {loiCamera ? (
        <div className="canh-bao" role="alert" style={{ margin: 0 }}>
          <p>{loiCamera}</p>
          <button type="button" className="btn btn-sm btn-vien" onClick={() => setDangBatCamera(true)} style={{ marginTop: 8 }}>
            <RotateCcw size={15} /> {t('Thử lại')}
          </button>
        </div>
      ) : anhTam ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000', maxHeight: '55vh', display: 'flex', justifyContent: 'center' }}>
            <img src={anhTam} alt={t('Ảnh đã chụp')} style={{ maxWidth: '100%', maxHeight: '55vh', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-vien" onClick={chupLai}>
              <RotateCcw size={16} /> {t('Chụp lại')}
            </button>
            <button type="button" className="btn" onClick={xacNhanSuDung}>
              {t('Dùng ảnh này')}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#090D14',
              minHeight: 280,
              maxHeight: '55vh',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', maxHeight: '55vh', objectFit: 'cover', display: dangBatCamera ? 'none' : 'block' }}
            />
            {dangBatCamera && <p className="nho mo" style={{ color: '#fff' }}>{t('Đang kết nối camera…')}</p>}

            {!dangBatCamera && (
              <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className="btn btn-sm btn-vien"
                  onClick={() => setDungCamSau((prev) => !prev)}
                  style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none' }}
                  title={t('Chuyển camera')}
                >
                  <SwitchCamera size={16} />
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="btn btn-vien btn-sm" onClick={dong}>
              <X size={16} /> {t('Đóng')}
            </button>
            <button
              type="button"
              className="btn btn-khoi"
              onClick={chupAnh}
              disabled={dangBatCamera || !!loiCamera}
              style={{ flex: 1, maxWidth: 200, justifyContent: 'center' }}
            >
              <Camera size={18} /> {t('Chụp ảnh')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
