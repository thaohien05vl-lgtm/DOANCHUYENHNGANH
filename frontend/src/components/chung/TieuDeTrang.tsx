import type { ReactNode } from 'react'
import { NutQuayVe } from './NutQuayVe'

interface TieuDeTrangProps {
  tieuDe: string
  moTa?: string
  coNutQuayVe?: boolean
  duongDanQuayVe?: string
  children?: ReactNode
}

export function TieuDeTrang({
  tieuDe,
  moTa,
  coNutQuayVe = false,
  duongDanQuayVe,
  children,
}: TieuDeTrangProps) {

  return (
    <header className="tieu-de-trang">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {coNutQuayVe && (
          <div style={{ marginTop: 2 }}>
            <NutQuayVe duongDanMacDinh={duongDanQuayVe} />
          </div>
        )}
        <div>
          <h1>{tieuDe}</h1>
          {moTa && <p>{moTa}</p>}
        </div>
      </div>
      {children && <div className="hanh-dong">{children}</div>}
    </header>
  )
}
