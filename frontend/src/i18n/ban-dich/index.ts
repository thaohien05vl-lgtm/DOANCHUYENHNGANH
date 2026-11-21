import type { BanDich } from './kieu'
import { banDichCu } from './cu'
import { banDichMoi } from './moi'
import { banDichThem } from './them'

/** Gộp tất cả bản dịch. Các file sau ghi đè file trước. */
export const BAN_DICH: BanDich = { ...banDichCu, ...banDichMoi, ...banDichThem }
