import { useEffect, useRef, useState } from 'react'
import { useGiaoDien } from '../../hooks/useGiaoDien'

interface Props {
  /** Giá trị đích. */
  gia: number
  /** Hàm định dạng hiển thị (mặc định: làm tròn số nguyên). */
  dinhDang?: (n: number) => string
  /** Thời gian chạy (ms). */
  thoiGian?: number
}

/**
 * Số "chạy" từ giá trị cũ tới giá trị mới (ease-out). Chỉ cập nhật văn bản qua rAF,
 * tắt hẳn khi người dùng bật "Giảm chuyển động".
 */
export function SoChay({ gia, dinhDang = (n) => String(Math.round(n)), thoiGian = 900 }: Props) {
  const { giamChuyenDong } = useGiaoDien()
  const [hienThi, setHienThi] = useState(giamChuyenDong ? gia : 0)
  const truoc = useRef(giamChuyenDong ? gia : 0)

  useEffect(() => {
    if (giamChuyenDong || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      truoc.current = gia
      const id = requestAnimationFrame(() => setHienThi(gia))
      return () => cancelAnimationFrame(id)
    }
    const tu = truoc.current
    const bat = performance.now()
    let id = 0
    const buoc = (now: number) => {
      const p = Math.min(1, (now - bat) / thoiGian)
      const e = 1 - Math.pow(1 - p, 3)
      const v = tu + (gia - tu) * e
      truoc.current = v
      setHienThi(v)
      if (p < 1) id = requestAnimationFrame(buoc)
    }
    id = requestAnimationFrame(buoc)
    return () => cancelAnimationFrame(id)
  }, [gia, giamChuyenDong, thoiGian])

  return <>{dinhDang(hienThi)}</>
}
