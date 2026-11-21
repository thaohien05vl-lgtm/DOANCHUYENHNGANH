import { t } from '../../utils/ngonNgu'
export function VongTienDo({ phanTram, mau, kichThuoc = 84, doDay = 9 }: { phanTram: number; mau: string; kichThuoc?: number; doDay?: number }) {
  const r = (kichThuoc - doDay) / 2
  const chuVi = 2 * Math.PI * r
  const p = Math.min(Math.max(phanTram, 0), 100)
  return (
    <div className="vong" style={{ width: kichThuoc, height: kichThuoc }} role="img" aria-label={t('{0} phần trăm', [Math.round(phanTram)])}>
      <svg width={kichThuoc} height={kichThuoc}>
        <circle className="nen-vong" cx={kichThuoc / 2} cy={kichThuoc / 2} r={r} strokeWidth={doDay} />
        <circle className="tien-do" cx={kichThuoc / 2} cy={kichThuoc / 2} r={r} strokeWidth={doDay} stroke={mau} strokeDasharray={chuVi} strokeDashoffset={chuVi * (1 - p / 100)} />
      </svg>
      <span style={{ fontSize: kichThuoc * 0.22 }}>{Math.round(phanTram)}%</span>
    </div>
  )
}
