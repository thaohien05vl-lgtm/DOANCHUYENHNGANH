/**
 * Ngăn xếp xử lý nút Back của Android.
 * Modal/hộp thoại đăng ký hàm đóng của mình; khi bấm Back, mục trên cùng được đóng trước
 * (thay vì thoát trang hoặc thoát ứng dụng).
 */
const ngan: Array<() => void> = []

export function dangKyNutQuayLai(dong: () => void): () => void {
  ngan.push(dong)
  return () => {
    const i = ngan.lastIndexOf(dong)
    if (i >= 0) ngan.splice(i, 1)
  }
}

/** Trả về true nếu đã có một lớp phủ nhận xử lý nút Back. */
export function xuLyQuayLaiTrongGiaoDien(): boolean {
  const fn = ngan[ngan.length - 1]
  if (!fn) return false
  fn()
  return true
}
