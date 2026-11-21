import { ZODIAC_DATA, type ZodiacInfo, type ZodiacSignId } from './zodiacData'

// Mốc chuyển cung cho 12 tháng (tháng 1 đến tháng 12)
// Tháng 1: 20 -> Ngày < 20 là Ma Kết, >= 20 là Bảo Bình
// Tháng 2: 19 -> Ngày < 19 là Bảo Bình, >= 19 là Song Ngư
// Tháng 3: 21 -> Ngày < 21 là Song Ngư, >= 21 là Bạch Dương
// Tháng 4: 20 -> Ngày < 20 là Bạch Dương, >= 20 là Kim Ngưu
// Tháng 5: 21 -> Ngày < 21 là Kim Ngưu, >= 21 là Song Tử
// Tháng 6: 21 -> Ngày < 21 là Song Tử, >= 21 là Cự Giải
// Tháng 7: 23 -> Ngày < 23 là Cự Giải, >= 23 là Sư Tử
// Tháng 8: 23 -> Ngày < 23 là Sư Tử, >= 23 là Xử Nữ
// Tháng 9: 23 -> Ngày < 23 là Xử Nữ, >= 23 là Thiên Bình
// Tháng 10: 23 -> Ngày < 23 là Thiên Bình, >= 23 là Bọ Cạp
// Tháng 11: 22 -> Ngày < 22 là Bọ Cạp, >= 22 là Nhân Mã
// Tháng 12: 22 -> Ngày < 22 là Nhân Mã, >= 22 là Ma Kết
const MOC_CHUYEN_CUNG = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22]

const THU_TU_CUNG: ZodiacSignId[] = [
  'ma-ket', // 0: Ma Kết (22/12 - 19/01)
  'bao-binh', // 1: Bảo Bình (20/01 - 18/02)
  'song-ngu', // 2: Song Ngư (19/02 - 20/03)
  'bach-duong', // 3: Bạch Dương (21/03 - 19/04)
  'kim-nguu', // 4: Kim Ngưu (20/04 - 20/05)
  'song-tu', // 5: Song Tử (21/05 - 20/06)
  'cu-giai', // 6: Cự Giải (21/06 - 22/07)
  'su-tu', // 7: Sư Tử (23/07 - 22/08)
  'xu-nu', // 8: Xử Nữ (23/08 - 22/09)
  'thien-binh', // 9: Thiên Bình (23/09 - 22/10)
  'bo-cap', // 10: Bọ Cạp (23/10 - 21/11)
  'nhan-ma', // 11: Nhân Mã (22/11 - 21/12)
]

/**
 * Xác định cung hoàng đạo dựa vào chuỗi ngày sinh (định dạng YYYY-MM-DD hoặc DD/MM/YYYY)
 */
export function xacDinhCung(ngaySinh?: string | null): ZodiacInfo | null {
  if (!ngaySinh || typeof ngaySinh !== 'string') return null
  const trim = ngaySinh.trim()
  if (!trim) return null

  let thang = 0
  let ngay = 0

  if (trim.includes('-')) {
    const parts = trim.split('-')
    if (parts.length >= 3) {
      // YYYY-MM-DD
      thang = Number(parts[1])
      ngay = Number(parts[2])
    }
  } else if (trim.includes('/')) {
    const parts = trim.split('/')
    if (parts.length >= 3) {
      // Có thể là MM/DD/YYYY hoặc DD/MM/YYYY
      // Thường nếu parts[0] > 12 thì chắc chắn là DD/MM/YYYY
      if (Number(parts[0]) > 12) {
        ngay = Number(parts[0])
        thang = Number(parts[1])
      } else {
        // Mặc định chuẩn ngày quốc tế / date picker MM/DD/YYYY nếu năm ở cuối
        thang = Number(parts[0])
        ngay = Number(parts[1])
      }
    }
  }

  if (isNaN(thang) || isNaN(ngay) || thang < 1 || thang > 12 || ngay < 1 || ngay > 31) {
    return null
  }

  const moc = MOC_CHUYEN_CUNG[thang - 1]
  const index = (thang - 1 + (ngay >= moc ? 1 : 0)) % 12
  const idCung = THU_TU_CUNG[index]

  return ZODIAC_DATA[idCung] ?? null
}

/**
 * Trả về danh sách tất cả 12 cung theo thứ tự hoàng đạo truyền thống (Bạch Dương -> Song Ngư)
 */
export function layTatCaCung(): ZodiacInfo[] {
  const thuTuHoangDao: ZodiacSignId[] = [
    'bach-duong',
    'kim-nguu',
    'song-tu',
    'cu-giai',
    'su-tu',
    'xu-nu',
    'thien-binh',
    'bo-cap',
    'nhan-ma',
    'ma-ket',
    'bao-binh',
    'song-ngu',
  ]
  return thuTuHoangDao.map((id) => ZODIAC_DATA[id])
}
