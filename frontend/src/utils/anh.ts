import { t } from './ngonNgu'
/** Nén ảnh về JPEG để giảm dung lượng trước khi gửi lên backend. */
export function nenAnh(file: File, canhToiDa = 900, chatLuong = 0.78): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(t('Vui lòng chọn một tệp hình ảnh.')))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(t('Không thể đọc ảnh đã chọn.')))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error(t('Định dạng ảnh này chưa được trình duyệt hỗ trợ.')))
      img.onload = () => {
        const tiLe = Math.min(1, canhToiDa / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * tiLe))
        canvas.height = Math.max(1, Math.round(img.height * tiLe))
        const context = canvas.getContext('2d')
        if (!context) {
          reject(new Error(t('Trình duyệt không thể xử lý ảnh này.')))
          return
        }
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', chatLuong))
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
