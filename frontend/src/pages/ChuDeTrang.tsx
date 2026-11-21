import { useMemo, useState } from 'react'
import { Check, Heart, Monitor, Moon, Palette, Sparkles, Sun } from 'lucide-react'
import { HoaTietChuDe } from '../components/chung/HoaTietChuDe'
import { TieuDeTrang } from '../components/chung/TieuDeTrang'
import { XemTruocChuDe } from '../components/chung/XemTruocChuDe'
import { DANH_SACH_CHU_DE, type ChuDe, type NhomChuDe } from '../data/chuDe'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { t } from '../utils/ngonNgu'

export function ChuDeTrang() {
  const {
    theme,
    toi,
    cheDoHeThong,
    doiCheDoHeThong,
    giamChuyenDong,
    doiGiamChuyenDong,
    chuyenDongHoaTiet,
    doiChuyenDongHoaTiet,
    danhSachYeuThich,
    toggleYeuThich,
    themeXemThu,
    xemThuTheme,
    apDungThemeXemThu,
    huyThemeXemThu,
    thongBao,
  } = useGiaoDien()

  const [nhomLoc, setNhomLoc] = useState<NhomChuDe>('de-xuat')

  // Danh sách chủ đề sau khi lọc
  const danhSachLoc = useMemo(() => {
    return DANH_SACH_CHU_DE.filter((c) => {
      if (nhomLoc === 'tat-ca') return true
      if (nhomLoc === 'yeu-thich') return danhSachYeuThich.includes(c.id)
      return c.nhom.includes(nhomLoc as 'de-xuat' | 'toi-gian' | 'cao-cap')
    })
  }, [nhomLoc, danhSachYeuThich])

  const chuDeXemThuInfo = useMemo(() => {
    if (!themeXemThu) return null
    return DANH_SACH_CHU_DE.find((c) => c.id === themeXemThu) ?? null
  }, [themeXemThu])

  function handleChonTheme(c: ChuDe) {
    if (c.id === theme && !themeXemThu) {
      thongBao(t('Bạn đang sử dụng chủ đề {0}', [c.ten]), 'thongtin')
      return
    }
    xemThuTheme(c.id)
  }

  return (
    <div className="trang" style={{ maxWidth: 860, margin: '0 auto', gap: 18 }}>
      <TieuDeTrang
        tieuDe={t('Chủ đề & Hiển thị')}
        moTa={t('Cá nhân hóa không gian tài chính với 15 bảng màu chuẩn mực, chuyển động êm dịu và Dark Mode cao cấp.')}
        coNutQuayVe
        duongDanQuayVe="/ca-nhan"
      />

      <XemTruocChuDe />

      {/* ============================================================
          1. CHẾ ĐỘ SÁNG / TỐI / HỆ THỐNG & GIẢM CHUYỂN ĐỘNG (THEO HÌNH 2)
          ============================================================ */}
      <section className="the" style={{ padding: '16px 20px', borderRadius: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Segmented Sáng / Tối / Hệ thống */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 650, color: 'var(--chu)' }}>
              {t('Chế độ hiển thị')}
            </span>
            <div className="doan" role="group" aria-label={t('Chế độ hiển thị')}>
              <button
                type="button"
                aria-pressed={cheDoHeThong === 'sang' || (!cheDoHeThong && !toi)}
                onClick={() => doiCheDoHeThong('sang')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Sun size={15} /> {t('Sáng')}
              </button>
              <button
                type="button"
                aria-pressed={cheDoHeThong === 'toi' || (!cheDoHeThong && toi)}
                onClick={() => doiCheDoHeThong('toi')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Moon size={15} /> {t('Tối')}
              </button>
              <button
                type="button"
                aria-pressed={cheDoHeThong === 'he-thong'}
                onClick={() => doiCheDoHeThong('he-thong')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Monitor size={15} /> {t('Hệ thống')}
              </button>
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--vien)' }} />

          {/* Toggle Giảm chuyển động */}
          <div
            onClick={doiGiamChuyenDong}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '0.9rem', color: 'var(--chu)' }}>
                {t('Giảm chuyển động')}
              </b>
              <small className="mo" style={{ display: 'block', fontSize: '0.78rem' }}>
                {t('Tắt hiệu ứng chuyển cảnh và hoạt ảnh để tối ưu tốc độ và độ nhạy')}
              </small>
            </div>

            {/* Switch iOS style */}
            <div
              style={{
                width: 44,
                height: 26,
                borderRadius: 999,
                background: giamChuyenDong ? 'var(--ngoc)' : 'var(--vien)',
                position: 'relative',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: giamChuyenDong ? 21 : 3,
                  transition: 'left 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>

          <div style={{ height: 1, background: 'var(--vien)' }} />

          {/* Toggle Chuyển động họa tiết */}
          <div
            onClick={doiChuyenDongHoaTiet}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
            }}
          >
            <div>
              <b style={{ display: 'block', fontSize: '0.9rem', color: 'var(--chu)' }}>
                {t('Hiệu ứng chuyển động họa tiết')}
              </b>
              <small className="mo" style={{ display: 'block', fontSize: '0.78rem' }}>
                {t('Bật chuyển động trôi nhẹ, lượn sóng của các hoa văn trang trí nền')}
              </small>
            </div>

            {/* Switch iOS style */}
            <div
              style={{
                width: 44,
                height: 26,
                borderRadius: 999,
                background: chuyenDongHoaTiet && !giamChuyenDong ? 'var(--ngoc)' : 'var(--vien)',
                position: 'relative',
                transition: 'background-color 0.2s',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 3,
                  left: chuyenDongHoaTiet && !giamChuyenDong ? 21 : 3,
                  transition: 'left 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. THANH PHÂN LOẠI CHỦ ĐỀ (PILL TABS THEO HÌNH 2)
          ============================================================ */}
      <div className="gd-pills" role="tablist" aria-label={t('Bộ lọc chủ đề')}>
        {(
          [
            ['de-xuat', t('Đề xuất')],
            ['yeu-thich', t('Yêu thích ({0})', [danhSachYeuThich.length])],
            ['toi-gian', t('Tối giản')],
            ['cao-cap', t('Cao cấp')],
            ['tat-ca', t('Tất cả ({0})', [DANH_SACH_CHU_DE.length])],
          ] as const
        ).map(([id, label]) => {
          const active = nhomLoc === id
          return (
            <button
              key={id}
              type="button"
              className="gd-pill"
              aria-pressed={active}
              onClick={() => setNhomLoc(id)}
            >
              {id === 'yeu-thich' && <Heart size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />}
              {id === 'de-xuat' && <Sparkles size={13} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />}
              {label}
            </button>
          )
        })}
      </div>

      {/* ============================================================
          3. LƯỚI THẺ CHỦ ĐỀ NÂNG CẤP (THEME MOCKUP CARDS THEO HÌNH 2)
          ============================================================ */}
      <div className="chu-de-luoi">
        {danhSachLoc.map((item) => {
          const laThemeHienTai = (themeXemThu ? themeXemThu === item.id : theme === item.id)
          const laYeuThich = danhSachYeuThich.includes(item.id)

          return (
            <div
              key={item.id}
              className={`chu-de-card ${laThemeHienTai ? 'dang-chon' : ''}`}
              onClick={() => handleChonTheme(item)}
            >
              {/* Nút tim yêu thích */}
              <button
                type="button"
                className={`chu-de-heart ${laYeuThich ? 'yeu-thich' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  toggleYeuThich(item.id)
                  thongBao(
                    laYeuThich
                      ? t('Đã bỏ {0} khỏi danh sách yêu thích', [item.ten])
                      : t('Đã thêm {0} vào danh sách yêu thích', [item.ten]),
                    'ok',
                  )
                }}
                title={laYeuThich ? t('Bỏ yêu thích') : t('Thêm vào yêu thích')}
                aria-label={t('Yêu thích')}
              >
                <Heart size={15} fill={laYeuThich ? '#ef4444' : 'none'} color={laYeuThich ? '#ef4444' : 'currentColor'} />
              </button>

              {/* MOCKUP PREVIEW GIAO DIỆN TÀI CHÍNH THỰC TẾ (HÌNH 2) */}
              <div
                className="chu-de-mockup"
                style={{
                  background: item.mauNen,
                  borderColor: item.cheDo === 'toi' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* SVG Họa tiết riêng của từng chủ đề */}
                <HoaTietChuDe themeId={item.id} mini />

                {/* Mini Balance Card */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    background: item.mauThe,
                    borderRadius: 10,
                    padding: '8px 10px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: `1px solid ${item.cheDo === 'toi' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: item.mauChinh,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      ₫ 12.4M
                    </span>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: item.mauChinh,
                      }}
                    />
                  </div>

                  {/* 4 mini chart bars */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 18, marginTop: 6 }}>
                    <div style={{ flex: 1, height: '40%', background: item.mauChinh, opacity: 0.85, borderRadius: 2 }} />
                    <div style={{ flex: 1, height: '70%', background: item.mauChinh, opacity: 0.95, borderRadius: 2 }} />
                    <div style={{ flex: 1, height: '100%', background: item.mauChinh, borderRadius: 2 }} />
                    <div style={{ flex: 1, height: '55%', background: item.mauChinh, opacity: 0.75, borderRadius: 2 }} />
                  </div>
                </div>

                {/* 3 mini color palette dots */}
                <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'flex-end', zIndex: 1, position: 'relative' }}>
                  {item.mau.map((mau, idx) => (
                    <span
                      key={idx}
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: '50%',
                        background: mau,
                        border: '1px solid rgba(0,0,0,0.15)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* TÊN CHỦ ĐỀ & TRẠNG THÁI */}
              <div style={{ padding: '0 2px' }}>
                <b className="chu-de-ten">{item.ten}</b>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  {laThemeHienTai ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 3,
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: 'var(--ngoc)',
                      }}
                    >
                      <Check size={13} strokeWidth={3} />
                      {themeXemThu === item.id ? t('Đang xem thử') : t('Đang dùng')}
                    </span>
                  ) : (
                    <small className="mo" style={{ fontSize: '0.73rem' }}>
                      {item.cheDo === 'toi' ? t('Tối') : t('Sáng')} · {item.nhom.includes('cao-cap') ? t('Cao cấp') : t('Tối giản')}
                    </small>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {danhSachLoc.length === 0 && (
        <div className="the" style={{ padding: 40, textAlign: 'center', borderRadius: 18 }}>
          <Palette size={32} style={{ color: 'var(--chu-mo)', margin: '0 auto 10px' }} />
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--chu)' }}>{t('Chưa có chủ đề nào trong mục này')}</h3>
          <p className="nho mo" style={{ marginTop: 4 }}>
            {t('Nhấn vào biểu tượng trái tim ở góc thẻ để thêm các bảng màu yêu thích vào đây.')}
          </p>
          <button type="button" className="btn btn-vien btn-sm" style={{ marginTop: 12 }} onClick={() => setNhomLoc('tat-ca')}>
            {t('Xem tất cả 15 chủ đề')}
          </button>
        </div>
      )}

      {/* ============================================================
          4. THANH NỔI XEM THỬ & ÁP DỤNG (THEO HÌNH 2)
          ============================================================ */}
      {themeXemThu && chuDeXemThuInfo && (
        <div className="thanh-xem-thu">
          <div>
            <span className="nho mo" style={{ display: 'block', fontSize: '0.74rem' }}>
              {t('Đang xem thử')}
            </span>
            <b style={{ fontSize: '0.98rem', color: 'var(--chu)' }}>{chuDeXemThuInfo.ten}</b>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-nhe btn-sm"
              onClick={huyThemeXemThu}
              style={{ minHeight: 36, padding: '0 14px' }}
            >
              {t('Hủy')}
            </button>
            <button
              type="button"
              className="btn btn-chinh btn-sm"
              onClick={apDungThemeXemThu}
              style={{ minHeight: 36, padding: '0 16px' }}
            >
              {t('Áp dụng')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
