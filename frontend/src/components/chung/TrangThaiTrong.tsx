import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function TrangThaiTrong({ icon: I, tieuDe, moTa, children }: { icon: LucideIcon; tieuDe: string; moTa: string; children?: ReactNode }) {
  return (
    <div className="trong">
      <span className="icon-tron"><I size={26} /></span>
      <h3>{tieuDe}</h3>
      <p>{moTa}</p>
      {children}
    </div>
  )
}
