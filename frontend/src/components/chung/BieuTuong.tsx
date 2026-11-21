import {
  Banknote, BookOpen, Briefcase, Car, Coffee, Gamepad2, Gift, HeartPulse, House,
  Plane, PiggyBank, Shirt, ShoppingBag, Smartphone, TrendingUp, Utensils, Wallet, Zap,
  type LucideIcon,
} from 'lucide-react'

export const BIEU_TUONG: Record<string, LucideIcon> = {
  utensils: Utensils, car: Car, bag: ShoppingBag, home: House, book: BookOpen, heart: HeartPulse,
  game: Gamepad2, banknote: Banknote, gift: Gift, briefcase: Briefcase, coffee: Coffee, plane: Plane,
  phone: Smartphone, zap: Zap, shirt: Shirt, piggy: PiggyBank, trend: TrendingUp, wallet: Wallet,
}

export function BieuTuong({ ten, size = 20 }: { ten: string; size?: number }) {
  const I = BIEU_TUONG[ten] ?? Wallet
  return <I size={size} strokeWidth={2} />
}

/** Ô tròn màu chứa biểu tượng — nền là màu danh mục pha loãng */
export function ONhanDienDanhMuc({ bieuTuong, mau, lon }: { bieuTuong: string; mau: string; lon?: boolean }) {
  return (
    <span className={`icon-tron${lon ? ' lon' : ''}`} style={{ background: `color-mix(in srgb, ${mau} 16%, transparent)`, color: mau }}>
      <BieuTuong ten={bieuTuong} size={lon ? 22 : 19} />
    </span>
  )
}
