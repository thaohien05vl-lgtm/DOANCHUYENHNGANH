import { dinhDangTien } from '../../utils/dinhDang'
import { t } from '../../utils/ngonNgu'

interface TongQuanSoLieuBaoCaoProps {
  tongThu: number
  tongChi: number
  chenhLech: number
  tienGiuLai: number
  tiLeTietKiemHienThi: string
  tiLeTietKiem: number
}

export function TongQuanSoLieuBaoCao({
  tongThu,
  tongChi,
  chenhLech,
  tienGiuLai,
  tiLeTietKiemHienThi,
  tiLeTietKiem,
}: TongQuanSoLieuBaoCaoProps) {
  const laThangDu = chenhLech >= 0

  return (
    <div className="luoi-kpi-bao-cao-in">
      {/* 1. Tổng thu nhập */}
      <div className="the-kpi-in thu">
        <span className="nhan-kpi-in">{t('Tổng thu nhập')}</span>
        <div className="so-kpi-in" title={dinhDangTien(tongThu)}>
          {dinhDangTien(tongThu)}
        </div>
        <span className="chu-thich-kpi-in">{t('Các khoản thu trong kỳ')}</span>
      </div>

      {/* 2. Tổng chi tiêu */}
      <div className="the-kpi-in chi">
        <span className="nhan-kpi-in">{t('Tổng chi tiêu')}</span>
        <div className="so-kpi-in" title={dinhDangTien(tongChi)}>
          {dinhDangTien(tongChi)}
        </div>
        <span className="chu-thich-kpi-in">{t('Các khoản chi thực tế')}</span>
      </div>

      {/* 3. Chênh lệch thu - chi */}
      <div className={`the-kpi-in ${laThangDu ? 'thang-du' : 'tham-hut'}`}>
        <span className="nhan-kpi-in">{t('Chênh lệch (Thu - Chi)')}</span>
        <div className="so-kpi-in" title={dinhDangTien(chenhLech)}>
          {laThangDu ? '+' : ''}{dinhDangTien(chenhLech)}
        </div>
        <span className="chu-thich-kpi-in">
          {laThangDu ? t('Thặng dư tài chính') : t('Thâm hụt dòng tiền')}
        </span>
      </div>

      {/* 4. Dòng tiền giữ lại */}
      <div className={`the-kpi-in ${tienGiuLai >= 0 ? 'thang-du' : 'tham-hut'}`}>
        <span className="nhan-kpi-in">{t('Tiền giữ lại')}</span>
        <div className="so-kpi-in" title={dinhDangTien(tienGiuLai)}>
          {tienGiuLai > 0 ? '+' : ''}{dinhDangTien(tienGiuLai)}
        </div>
        <span className="chu-thich-kpi-in">{t('Dòng tiền tích lũy kỳ')}</span>
      </div>

      {/* 5. Tỷ lệ tiết kiệm */}
      <div className="the-kpi-in tiet-kiem">
        <span className="nhan-kpi-in">{t('Tỷ lệ tiết kiệm')}</span>
        <div
          className="so-kpi-in"
          style={{
            color: tiLeTietKiem >= 20 ? '#059669' : tiLeTietKiem < 0 ? '#dc2626' : '#d97706',
          }}
        >
          {tiLeTietKiemHienThi}
        </div>
        <span className="chu-thich-kpi-in">
          {tiLeTietKiem >= 20 ? t('Mức tiết kiệm tốt') : tiLeTietKiem < 0 ? t('Chi tiêu vượt thu') : t('Tiết kiệm vừa phải')}
        </span>
      </div>
    </div>
  )
}
