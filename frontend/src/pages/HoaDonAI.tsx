import { useEffect, useRef, useState, type DragEvent } from 'react'
import {
  Camera,
  CheckCircle2,
  Info,
  LoaderCircle,
  RotateCcw,
  SwitchCamera,
  Upload,
  X,
} from 'lucide-react'
import { OTien } from '../components/chung/OTien'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { useDuLieu } from '../hooks/useDuLieu'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { nenAnhHoaDon, phanTichHoaDon, type KetQuaHoaDon } from '../services/hoaDonService'
import { dinhDangTien } from '../utils/dinhDang'
import { t, dichTen } from '../utils/ngonNgu'

const BUOC = [t('Tải ảnh hoặc chụp hoá đơn'), t('AI tự động nhận diện nội dung'), t('Kiểm tra và lưu giao dịch')]

export function HoaDonAI() {
  const { danhMuc, vi, luu } = useDuLieu()
  const { thongBao } = useGiaoDien()
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [file, setFile] = useState<File | null>(null)
  const [anh, setAnh] = useState('')
  const [keo, setKeo] = useState(false)
  const [dangDoc, setDangDoc] = useState(false)
  const [dangLuu, setDangLuu] = useState(false)
  const [kq, setKq] = useState<KetQuaHoaDon | null>(null)
  const [soTien, setSoTien] = useState(0)
  const [ghiChu, setGhiChu] = useState('')
  const [maDm, setMaDm] = useState('')
  const [maVi, setMaVi] = useState(vi[0]?.id ?? '')
  const [ngay, setNgay] = useState('')
  const [gio, setGio] = useState('')

  // Trạng thái camera trực tiếp
  const [moCamera, setMoCamera] = useState(false)
  const [dangBatCamera, setDangBatCamera] = useState(false)
  const [dungCamSau, setDungCamSau] = useState(true)

  useEffect(() => () => { if (anh) URL.revokeObjectURL(anh) }, [anh])

  useEffect(() => {
    return () => {
      dungCamera()
    }
  }, [])

  function dungCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  async function khoiDongCamera(camSau = dungCamSau) {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      thongBao(t('Trình duyệt không hỗ trợ mở camera trực tiếp. Vui lòng chọn tải ảnh từ máy.'), 'thongtin')
      inputRef.current?.click()
      return
    }

    dungCamera()
    setDangBatCamera(true)
    setMoCamera(true)

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: camSau ? { ideal: 'environment' } : 'user',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string }
      dungCamera()
      setMoCamera(false)
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        thongBao(t('Quyền truy cập camera bị từ chối. Vui lòng cho phép camera hoặc tải ảnh từ thiết bị.'), 'loi')
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        thongBao(t('Không tìm thấy thiết bị camera trên máy này. Hãy tải ảnh từ máy tính.'), 'thongtin')
      } else {
        thongBao(t('Không thể khởi động camera. Hãy thử lại hoặc tải ảnh từ thiết bị.'), 'loi')
      }
      inputRef.current?.click()
    } finally {
      setDangBatCamera(false)
    }
  }

  function doiCamera() {
    const moi = !dungCamSau
    setDungCamSau(moi)
    khoiDongCamera(moi)
  }

  function chupAnhTuCamera() {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(
      async (blob) => {
        dungCamera()
        setMoCamera(false)
        if (!blob) {
          thongBao(t('Không thể ghi lại hình ảnh từ camera. Vui lòng thử lại.'), 'loi')
          return
        }
        const capturedFile = new File([blob], `hoadon_${Date.now()}.jpg`, { type: 'image/jpeg' })
        await tiepNhanVaQuetHoaDon(capturedFile)
      },
      'image/jpeg',
      0.9,
    )
  }

  async function tiepNhanVaQuetHoaDon(f?: File) {
    if (!f) return
    const laAnh = f.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|heic|heif|avif)$/i.test(f.name)
    if (!laAnh) return thongBao(t('Hãy chọn file ảnh JPG, PNG, WebP, GIF, HEIC, HEIF hoặc AVIF.'), 'loi')
    if (f.size > 15 * 1024 * 1024) return thongBao(t('Ảnh quá lớn, tối đa 15 MB.'), 'loi')

    setDangDoc(true)
    setKq(null)

    try {
      // 1. Tự động nén ảnh trên canvas để gửi nhanh hơn mà vẫn giữ chữ rõ nét
      const fileDaNen = await nenAnhHoaDon(f)
      setFile(fileDaNen)
      setAnh(URL.createObjectURL(fileDaNen))

      // 2. Tự động gửi tới backend để AI phân tích ngay lập tức, không bắt bấm thêm nút
      const r = await phanTichHoaDon(fileDaNen)
      setKq(r)
      setSoTien(r.soTien)
      setGhiChu(r.ghiChuGiaoDich || r.tenCuaHang)
      setMaDm(r.maDanhMuc || danhMuc.find((d) => d.loai === 'chi')?.id || '')
      setNgay(r.ngay)
      setGio(r.gio || '')
      thongBao(t('Đã nhận diện hoá đơn thành công! Vui lòng kiểm tra và xác nhận.'), 'ok')
    } catch (error) {
      const message = error instanceof Error ? error.message : t('Không thể phân tích hoá đơn.')
      thongBao(message, 'loi')
    } finally {
      setDangDoc(false)
    }
  }

  const tha = (e: DragEvent) => {
    e.preventDefault()
    setKeo(false)
    tiepNhanVaQuetHoaDon(e.dataTransfer.files[0])
  }

  function xacNhan() {
    if (soTien <= 0) {
      thongBao(t('Số tiền thanh toán phải lớn hơn 0.'), 'thongtin')
      return
    }
    setDangLuu(true)
    try {
      const chuThichDayDu = gio ? `${ghiChu} (${gio})` : ghiChu
      luu('giaoDich', {
        loai: 'chi',
        soTien,
        maDanhMuc: maDm || danhMuc.find((d) => d.loai === 'chi')?.id || '',
        maVi: maVi || vi[0]?.id || '',
        ngay,
        ghiChu: chuThichDayDu,
        dinhKy: null,
      })
      thongBao(t('Đã lưu giao dịch chi tiêu từ hoá đơn vào hệ thống!'))
      setFile(null)
      setAnh('')
      setKq(null)
    } finally {
      setDangLuu(false)
    }
  }

  function lamLai() {
    dungCamera()
    setMoCamera(false)
    setFile(null)
    setAnh('')
    setKq(null)
  }

  const buocHienTai = kq ? 2 : dangDoc ? 1 : file ? 1 : 0

  return (
    <div className="trang hd-trang">
      <TieuDeTrang
        tieuDe={t('Quét hoá đơn bằng AI')}
        moTa={t('Chụp hoặc tải ảnh hoá đơn, hệ thống tự động nhận diện và đề xuất giao dịch để bạn xác nhận.')}
      />

      <div className="canh-bao vang">
        <Info size={20} />
        <span>
          {t('Ảnh được nén và gửi lên AI để tự động trích xuất cửa hàng, số tiền, ngày và danh mục. Bạn luôn có quyền chỉnh sửa trước khi lưu.')}
        </span>
      </div>

      <div className="hd-luoi">
        {/* KHU VỰC 1: TẢI HOẶC CHỤP ẢNH */}
        <section className="the hd-the">
          <div className="the-dau">
            <h2>{t('Hình ảnh hoá đơn')}</h2>
            {file && (
              <button className="btn btn-vien btn-sm" onClick={lamLai} disabled={dangDoc || dangLuu}>
                <RotateCcw size={14} /> {t('Chọn ảnh khác')}
              </button>
            )}
          </div>

          {moCamera ? (
            <div className="form" style={{ gap: 12 }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4 / 3',
                  background: '#0a1012',
                  borderRadius: 12,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <video
                  ref={videoRef}
                  playsInline
                  autoPlay
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '10%',
                    border: '2px dashed rgba(255,255,255,0.7)',
                    borderRadius: 8,
                    pointerEvents: 'none',
                  }}
                />
                {dangBatCamera && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      color: '#fff',
                    }}
                  >
                    <LoaderCircle size={28} className="xoay" />
                    <span>{t('Đang bật camera…')}</span>
                  </div>
                )}
              </div>

              <div className="hanh-dong-form" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-vien"
                  onClick={() => {
                    dungCamera()
                    setMoCamera(false)
                  }}
                >
                  <X size={16} /> {t('Đóng camera')}
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-vien" onClick={doiCamera} title={t('Đổi camera trước/sau')}>
                    <SwitchCamera size={16} /> {t('Đổi camera')}
                  </button>
                  <button type="button" className="btn" onClick={chupAnhTuCamera} disabled={dangBatCamera}>
                    <Camera size={18} /> {t('Chụp & Quét ngay')}
                  </button>
                </div>
              </div>
            </div>
          ) : !file ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                className={`vung-tha${keo ? ' keo' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault()
                  setKeo(true)
                }}
                onDragLeave={() => setKeo(false)}
                onDrop={tha}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              >
                <span className="icon-tron">
                  <Upload size={28} />
                </span>
                <h3>{t('Chọn hoặc kéo thả ảnh hoá đơn')}</h3>
                <p className="mo nho">{t('Tự động nén và nhận diện ngay khi chọn ảnh (JPG, PNG, WebP…)')}</p>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-vien"
                  onClick={() => inputRef.current?.click()}
                  style={{ flex: '1 1 140px', minWidth: 0, padding: '10px 12px', fontSize: '0.86rem' }}
                >
                  <Upload size={17} style={{ flexShrink: 0 }} /> {t('Tải ảnh từ thiết bị')}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => khoiDongCamera(true)}
                  style={{ flex: '1 1 140px', minWidth: 0, padding: '10px 12px', fontSize: '0.86rem' }}
                >
                  <Camera size={17} style={{ flexShrink: 0 }} /> {t('Chụp ảnh hoá đơn')}
                </button>
              </div>
            </div>
          ) : (
            <div className="form">
              <div className="xem-truoc">
                <img src={anh} alt={t('Hoá đơn đã chọn')} />
                {dangDoc && <div className="quet" />}
              </div>
              {dangDoc && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--mau-chinh)' }}>
                  <LoaderCircle size={20} className="xoay" />
                  <span>{t('AI đang phân tích cửa hàng, mặt hàng và tổng tiền hoá đơn…')}</span>
                </div>
              )}
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/gif,image/avif"
            className="an-thi-giac"
            onChange={(e) => tiepNhanVaQuetHoaDon(e.target.files?.[0])}
            tabIndex={-1}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            {BUOC.map((b, i) => (
              <div key={b} className={`buoc ${i < buocHienTai ? 'xong' : i === buocHienTai ? 'dang' : ''}`}>
                {i < buocHienTai ? (
                  <CheckCircle2 size={18} />
                ) : i === buocHienTai && dangDoc ? (
                  <LoaderCircle size={18} className="xoay" />
                ) : (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      border: '2px solid currentColor',
                      opacity: 0.5,
                    }}
                  />
                )}
                {b}
              </div>
            ))}
          </div>
        </section>

        {/* KHU VỰC 2: KẾT QUẢ VÀ XÁC NHẬN */}
        <section className="the hd-the">
          <div className="the-dau hd-the-dau">
            <h2>{t('Kết quả bóc tách & Xác nhận')}</h2>
            {kq && (
              <span className="nhan nhan-ngoc" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                {t('Độ tin cậy {0}%', [Math.round((kq.doTinCay || 0.8) * 100)])}
              </span>
            )}
          </div>

          {dangDoc ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <LoaderCircle size={36} className="xoay" style={{ color: 'var(--mau-chinh)' }} />
              <h3>{t('Đang đọc dữ liệu hoá đơn…')}</h3>
              <p className="mo nho">{t('Hệ thống đang chuẩn hoá tên cửa hàng, tính tổng tiền và đối chiếu danh mục.')}</p>
            </div>
          ) : kq ? (
            <form
              className="form hd-form"
              onSubmit={(e) => {
                e.preventDefault()
                xacNhan()
              }}
            >
              <div className="truong">
                <label htmlFor="hd-tien">{t('Tổng thanh toán (VNĐ)')}</label>
                <OTien id="hd-tien" gia={soTien} doi={setSoTien} lon />
              </div>

              <div className="truong">
                <label htmlFor="hd-ten">{t('Cửa hàng / Nội dung giao dịch')}</label>
                <input
                  id="hd-ten"
                  className="o-nhap"
                  value={ghiChu}
                  onChange={(e) => setGhiChu(e.target.value)}
                  placeholder={t('Ví dụ: Siêu thị WinMart, Cơm tấm Cali...')}
                  required
                />
              </div>

              <div className="hd-hang-truong">
                <div className="truong">
                  <label htmlFor="hd-dm">{t('Danh mục chi tiêu')}</label>
                  <select
                    id="hd-dm"
                    className="o-chon"
                    value={maDm}
                    onChange={(e) => setMaDm(e.target.value)}
                  >
                    {danhMuc
                      .filter((d) => d.loai === 'chi')
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {dichTen(d.ten)}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="truong">
                  <label htmlFor="hd-vi">{t('Ví trừ tiền')}</label>
                  <select
                    id="hd-vi"
                    className="o-chon"
                    value={maVi}
                    onChange={(e) => setMaVi(e.target.value)}
                  >
                    {vi.map((v) => (
                      <option key={v.id} value={v.id}>
                        {dichTen(v.ten)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="hd-hang-truong">
                <div className="truong">
                  <label htmlFor="hd-ngay">{t('Ngày giao dịch')}</label>
                  <input
                    id="hd-ngay"
                    type="date"
                    className="o-nhap"
                    value={ngay}
                    onChange={(e) => setNgay(e.target.value)}
                    required
                  />
                </div>
                <div className="truong">
                  <label htmlFor="hd-gio">{t('Giờ giao dịch (nếu có)')}</label>
                  <input
                    id="hd-gio"
                    type="text"
                    className="o-nhap"
                    placeholder={t('Ví dụ: 12:30')}
                    value={gio}
                    onChange={(e) => setGio(e.target.value)}
                  />
                </div>
              </div>

              {/* Chi tiết từng mặt hàng đọc được */}
              {kq.matHang && kq.matHang.length > 0 && (
                <div className="hd-mat-hang-khung">
                  <div className="hd-mat-hang-dau">
                    <b style={{ fontSize: '0.9rem' }}>{t('Chi tiết các mặt hàng ({0})', [kq.matHang.length])}</b>
                    {kq.tongTienHang && kq.tongTienHang > 0 && (
                      <span className="nho mo">{t('Tổng hàng: {0}', [dinhDangTien(kq.tongTienHang)])}</span>
                    )}
                  </div>
                  <div className="hd-mat-hang-danh-sach">
                    {kq.matHang.map((m, idx) => (
                      <div key={idx} className="hd-mat-hang-item">
                        <div className="hd-mat-hang-ten">
                          {m.ten}
                        </div>
                        <div className="hd-mat-hang-chi-tiet">
                          <span>
                            {t('Số lượng:')} <b>{m.soLuong || 1}</b>
                          </span>
                          {m.donGia > 0 && (
                            <span>
                              {t('Đơn giá: {0}', [dinhDangTien(m.donGia)])}
                            </span>
                          )}
                          <span className="hd-mat-hang-thanh-tien">
                            {t('Thành tiền:')} <b>{dinhDangTien(m.thanhTien || (m.donGia * (m.soLuong || 1)))}</b>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tóm tắt chiết khấu / thuế */}
              {((kq.giamGia && kq.giamGia > 0) || (kq.thuePhi && kq.thuePhi > 0) || kq.phuongThucThanhToan) && (
                <div className="chuoi-nhan" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                  {kq.phuongThucThanhToan && (
                    <span className="nhan">{t('PTTT: {0}', [kq.phuongThucThanhToan])}</span>
                  )}
                  {kq.giamGia && kq.giamGia > 0 ? (
                    <span className="nhan nhan-ngoc">{t('Giảm giá: -{0}', [dinhDangTien(kq.giamGia)])}</span>
                  ) : null}
                  {kq.thuePhi && kq.thuePhi > 0 ? (
                    <span className="nhan">{t('Thuế/Phí: +{0}', [dinhDangTien(kq.thuePhi)])}</span>
                  ) : null}
                </div>
              )}

              <div className="hd-hanh-dong">
                <button
                  type="button"
                  className="btn btn-vien"
                  onClick={lamLai}
                  disabled={dangLuu}
                  style={{ minWidth: 70 }}
                >
                  {t('Huỷ')}
                </button>
                <button
                  className="btn"
                  disabled={soTien <= 0 || dangLuu}
                  style={{ flex: 1, minWidth: 0, padding: '10px 14px' }}
                >
                  {dangLuu ? (
                    <>
                      <LoaderCircle size={18} className="xoay" /> {t('Đang lưu…')}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} style={{ flexShrink: 0 }} /> {t('Xác nhận & lưu chi tiêu')}
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ padding: '30px 16px', textAlign: 'center' }}>
              <p className="mo">
                {t('Chọn hoặc chụp ảnh hoá đơn bên trái, AI sẽ tự động phân tích và điền sẵn số tiền, cửa hàng và danh mục vào đây để bạn duyệt trước khi lưu.')}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
