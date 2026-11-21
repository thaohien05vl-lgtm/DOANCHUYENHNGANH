import { dinhDangSoThuong } from '../../utils/dinhDang'

interface Props {
  gia: number
  doi: (n: number) => void
  lon?: boolean
  id?: string
  placeholder?: string
}

/** Ô nhập tiền: tự thêm dấu chấm ngăn cách hàng nghìn, trả về số nguyên */
export function OTien({ gia, doi, lon, id, placeholder = '0' }: Props) {
  return (
    <div className="o-co-hau-to">
      <input
        id={id}
        className={`o-nhap so${lon ? ' o-nhap-tien' : ''}`}
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={gia ? dinhDangSoThuong(gia) : ''}
        onChange={(e) => doi(Number(e.target.value.replace(/\D/g, '').slice(0, 12)) || 0)}
      />
      <span className="hau-to">₫</span>
    </div>
  )
}
