import { api } from './api'
import { t } from '../utils/ngonNgu'

export interface MatHangHoaDon {
  ten: string
  soLuong: number
  donGia: number
  thanhTien: number
}

export interface KetQuaHoaDon {
  tenCuaHang: string
  soTien: number
  ngay: string
  gio?: string | null
  maDanhMuc: string
  doTinCay: number
  tongTienHang?: number
  giamGia?: number
  thuePhi?: number
  phuongThucThanhToan?: string | null
  ghiChuGiaoDich?: string
  matHang?: MatHangHoaDon[]
}

/**
 * Nén và chuẩn hoá ảnh hoá đơn trên canvas trình duyệt trước khi gửi lên server.
 * Giữ nguyên độ sắc nét của chữ tiếng Việt và số tiền nhưng giảm dung lượng từ 5-10MB xuống ~300KB,
 * giúp quá trình tải ảnh và nhận diện AI diễn ra nhanh gấp nhiều lần.
 */
export async function nenAnhHoaDon(file: File, maxChieu = 1600, chatLuong = 0.85): Promise<File> {
  // Nếu là file không phải ảnh raster thông thường hoặc dung lượng đã nhỏ (< 400KB), giữ nguyên
  if (!file.type.startsWith('image/') || file.size < 400 * 1024) {
    return file
  }

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxChieu || height > maxChieu) {
          if (width > height) {
            height = Math.round((height * maxChieu) / width)
            width = maxChieu
          } else {
            width = Math.round((width * maxChieu) / height)
            height = maxChieu
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file)
            } else {
              const fileName = file.name.replace(/\.[^/.]+$/, '') + '.jpg'
              resolve(new File([blob], fileName, { type: 'image/jpeg' }))
            }
          },
          'image/jpeg',
          chatLuong,
        )
      }
      img.onerror = () => resolve(file)
      img.src = String(e.target?.result ?? '')
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

/** Gửi ảnh tới backend; backend gọi Gemini trích xuất dữ liệu chi tiết hoá đơn. */
export async function phanTichHoaDon(file: File): Promise<KetQuaHoaDon> {
  const form = new FormData()
  form.append('file', file, file.name)
  try {
    const { data } = await api.post<KetQuaHoaDon>('/api/hoa-don/phan-tich', form, {
      timeout: 120000,
    })
    return data
  } catch (error) {
    const loi = error as {
      response?: { status?: number; data?: { message?: string; error?: string } }
      message?: string
    }
    const status = loi.response?.status
    const message = loi.response?.data?.message || loi.response?.data?.error
    if (message) throw new Error(message, { cause: error })
    if (status === 401) throw new Error(t('Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại rồi quét hoá đơn.'), { cause: error })
    if (status === 413) throw new Error(t('Ảnh quá lớn. Hãy chọn ảnh nhỏ hơn 8 MB.'), { cause: error })
    if (status === 415) throw new Error(t('Định dạng ảnh chưa được hỗ trợ. Hãy dùng JPG, PNG hoặc WebP.'), { cause: error })
    throw new Error(loi.message || t('Không thể gửi ảnh tới Backend. Hãy kiểm tra Backend và kết nối mạng.'), { cause: error })
  }
}
