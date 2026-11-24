import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { taoDuLieuMau } from '../data/duLieuMau'
import type { DuLieu } from '../types'
import { taoId } from '../utils/dinhDang'
import { DuLieuContext, type DuLieuNguCanh, type KhoaDuLieu } from './duLieuContext'
import { layDuLieu, luuDuLieu } from '../services/duLieuService'
import { useXacThuc } from '../hooks/useXacThuc'
import { useGiaoDien } from '../hooks/useGiaoDien'
import { t } from '../utils/ngonNgu'

const DU_LIEU_RONG: DuLieu = { vi: [], danhMuc: [], giaoDich: [], nganSach: [], mucTieu: [] }

export function DuLieuProvider({ children }: { children: ReactNode }) {
  const { nguoiDung, dangXuat } = useXacThuc()
  const { thongBao } = useGiaoDien()
  const [du, setDu] = useState<DuLieu>(DU_LIEU_RONG)
  const [emailDaTai, setEmailDaTai] = useState<string | null>(null)
  const [loiTaiDuLieu, setLoiTaiDuLieu] = useState<string | null>(null)
  const [lanTaiLai, setLanTaiLai] = useState(0)
  const duRef = useRef<DuLieu>(DU_LIEU_RONG)
  const hangDoiLuu = useRef<Promise<void>>(Promise.resolve())

  const taiDuLieu = useCallback((value: DuLieu) => {
    duRef.current = value
    setDu(value)
  }, [])

  const emailHienTai = nguoiDung?.email

  useEffect(() => {
    let conHieuLuc = true
    const token = localStorage.getItem('qlct-token')
    if (!emailHienTai) {
      return () => { conHieuLuc = false }
    }
    if (!token) {
      dangXuat()
      return () => { conHieuLuc = false }
    }

    layDuLieu()
      .then((data) => {
        if (!conHieuLuc) return
        taiDuLieu(data)
        setEmailDaTai(emailHienTai)
        setLoiTaiDuLieu(null)
      })
      .catch((error: unknown) => {
        if (!conHieuLuc) return
        const loi = error as { response?: { status?: number; data?: { message?: string } }; message?: string }
        if (loi.response?.status === 401) {
          dangXuat()
          return
        }
        const thongDiep = loi.response?.data?.message || t('Không thể tải dữ liệu từ máy chủ. Hãy kiểm tra kết nối mạng hoặc backend.')
        setLoiTaiDuLieu(thongDiep)
        thongBao(thongDiep, 'loi')
      })
    return () => { conHieuLuc = false }
  }, [emailHienTai, taiDuLieu, thongBao, lanTaiLai, dangXuat])

  const capNhat = useCallback((bienDoi: (cu: DuLieu) => DuLieu) => {
    const moi = bienDoi(duRef.current)
    duRef.current = moi
    setDu(moi)
    const token = localStorage.getItem('qlct-token')
    if (token) {
      // Gửi tuần tự để request cũ không ghi đè snapshot mới hơn.
      hangDoiLuu.current = hangDoiLuu.current
        .catch(() => undefined)
        .then(() => luuDuLieu(moi, token))
        .catch((error: unknown) => {
          const loi = error as { response?: { data?: { message?: string } }; message?: string }
          thongBao(loi.response?.data?.message || t('Không thể đồng bộ dữ liệu. Hãy kiểm tra kết nối backend.'), 'loi')
        })
    }
  }, [thongBao])

  const capNhatCucBo = useCallback((bienDoi: (cu: DuLieu) => DuLieu) => {
    const moi = bienDoi(duRef.current)
    duRef.current = moi
    setDu(moi)
  }, [])

  const luu = useCallback<DuLieuNguCanh['luu']>((khoa, muc) => {
    capNhat((cu) => {
      const ds = cu[khoa] as { id: string }[]
      const moi = { ...muc, id: muc.id ?? taoId() } as { id: string }
      const coRoi = ds.some((x) => x.id === moi.id)
      const ketQua = coRoi ? ds.map((x) => (x.id === moi.id ? moi : x)) : [moi, ...ds]
      return { ...cu, [khoa]: ketQua } as DuLieu
    })
  }, [capNhat])

  const xoa = useCallback<DuLieuNguCanh['xoa']>((khoa: KhoaDuLieu, id: string) => {
    const cu = duRef.current
    if (khoa === 'vi' && cu.giaoDich.some((g) => g.maVi === id)) return t('Ví này đang có giao dịch. Hãy chuyển hoặc xoá các giao dịch trước.')
    if (khoa === 'danhMuc' && cu.giaoDich.some((g) => g.maDanhMuc === id)) return t('Danh mục này đang được dùng trong giao dịch.')
    capNhat((state) => {
      const moi = { ...state, [khoa]: (state[khoa] as { id: string }[]).filter((x) => x.id !== id) }
      if (khoa === 'danhMuc') moi.nganSach = state.nganSach.filter((n) => n.maDanhMuc !== id)
      return moi as DuLieu
    })
    return null
  }, [capNhat])

  const datLaiMau = useCallback(() => capNhat(() => taoDuLieuMau()), [capNhat])
  const duHienThi = nguoiDung ? du : DU_LIEU_RONG
  const value = useMemo<DuLieuNguCanh>(
    () => ({ ...duHienThi, luu, capNhatCucBo, xoa, datLaiMau }),
    [duHienThi, luu, capNhatCucBo, xoa, datLaiMau],
  )

  // Không hiển thị màn hình nghiệp vụ khi dữ liệu từ tài khoản chưa tải xong,
  // tránh việc người dùng lưu snapshot rỗng và ghi đè dữ liệu đã có trên server.
  if (nguoiDung && emailDaTai !== nguoiDung.email) {
    return (
      <div className="trang" role="status" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16, padding: 24 }}>
        <div style={{ width: 44, height: 44, border: '3px solid var(--mau-vien, #e2e8f0)', borderTopColor: 'var(--mau-chinh, #2563eb)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <strong style={{ fontSize: '1.15rem' }}>{loiTaiDuLieu ? t('Chưa thể tải dữ liệu Finora') : t('Đang tải dữ liệu tài khoản…')}</strong>
        {loiTaiDuLieu ? (
          <>
            <p className="nho mo" style={{ maxWidth: 440 }}>{loiTaiDuLieu}</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-chinh" onClick={() => { setLoiTaiDuLieu(null); setLanTaiLai((x) => x + 1) }}>{t('Thử tải lại')}</button>
              <button type="button" className="btn btn-phu" onClick={dangXuat}>{t('Đăng xuất')}</button>
            </div>
          </>
        ) : (
          <p className="nho mo">{t('Đang đồng bộ sổ thu chi và ví tiền từ máy chủ...')}</p>
        )}
      </div>
    )
  }
  return <DuLieuContext.Provider value={value}>{children}</DuLieuContext.Provider>
}
