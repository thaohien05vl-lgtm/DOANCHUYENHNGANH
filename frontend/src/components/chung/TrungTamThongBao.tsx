import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, Bell, CheckCheck, Loader2, Trash2 } from 'lucide-react'
import type { ThongBao } from '../../types'
import { danhDauDaDoc, danhDauTatCaDaDoc, layDanhSachThongBao, xoaThongBao } from '../../services/thongBaoService'
import { Modal } from './Modal'
import { t } from '../../utils/ngonNgu'

interface Props {
  mo: boolean
  dong: () => void
  onCapNhatSoLuong?: () => void
  onChonGiaoDich?: (transactionId: string) => void
}

function dinhDangThoiGian(iso: string): string {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diffSec < 60) return t('Vừa xong')
    if (diffSec < 3600) return t('{0} phút trước', [Math.floor(diffSec / 60)])
    if (diffSec < 86400) return t('{0} giờ trước', [Math.floor(diffSec / 3600)])
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const mins = String(d.getMinutes()).padStart(2, '0')
    return `${hours}:${mins} - ${day}/${month}`
  } catch {
    return iso
  }
}

export function TrungTamThongBao(props: Props) {
  return (
    <Modal mo={props.mo} dong={props.dong} tieuDe={t('Thông báo')}>
      {props.mo && <TrungTamThongBaoNoiDung {...props} />}
    </Modal>
  )
}

function TrungTamThongBaoNoiDung({ dong, onCapNhatSoLuong, onChonGiaoDich }: Props) {
  const [ds, setDs] = useState<ThongBao[]>([])
  const [dangTai, setDangTai] = useState(true)
  const [tab, setTab] = useState<'tat-ca' | 'chua-doc'>('tat-ca')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    layDanhSachThongBao()
      .then((data) => {
        if (!active) return
        setDs(data)
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setDangTai(false)
      })
    return () => { active = false }
  }, [])

  async function xuLyDoc(tb: ThongBao) {
    if (!tb.read) {
      await danhDauDaDoc(tb.id).catch(() => undefined)
      setDs((cu) => cu.map((item) => (item.id === tb.id ? { ...item, read: true } : item)))
      onCapNhatSoLuong?.()
    }
    if (tb.transactionId) {
      dong()
      if (onChonGiaoDich) {
        onChonGiaoDich(tb.transactionId)
      } else {
        navigate(`/giao-dich?id=${tb.transactionId}`)
      }
    }
  }

  async function xuLyDocTatCa() {
    await danhDauTatCaDaDoc().catch(() => undefined)
    setDs((cu) => cu.map((item) => ({ ...item, read: true })))
    onCapNhatSoLuong?.()
  }

  async function xuLyXoa(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    await xoaThongBao(id).catch(() => undefined)
    setDs((cu) => cu.filter((item) => item.id !== id))
    onCapNhatSoLuong?.()
  }

  const chuaDocDem = ds.filter((x) => !x.read).length
  const dsHienThi = tab === 'chua-doc' ? ds.filter((x) => !x.read) : ds

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div className="doan" role="group" aria-label={t('Bộ lọc thông báo')}>
          <button type="button" aria-pressed={tab === 'tat-ca'} onClick={() => setTab('tat-ca')}>
            {t('Tất cả ({0})', [ds.length])}
          </button>
          <button type="button" aria-pressed={tab === 'chua-doc'} onClick={() => setTab('chua-doc')}>
            {t('Chưa đọc ({0})', [chuaDocDem])}
          </button>
        </div>
        {chuaDocDem > 0 && (
          <button type="button" className="btn btn-nhe btn-sm" onClick={xuLyDocTatCa} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCheck size={15} /> {t('Đánh dấu tất cả đã đọc')}
          </button>
        )}
      </div>

      {dangTai ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 0', gap: 8, color: 'var(--chu-mo)' }}>
          <Loader2 size={20} className="xoay" />
          <span>{t('Đang tải thông báo…')}</span>
        </div>
      ) : dsHienThi.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--chu-mo)' }}>
          <Bell size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <p><strong>{tab === 'chua-doc' ? t('Không có thông báo chưa đọc') : t('Chưa có thông báo nào')}</strong></p>
          <small>{t('Mọi khoản chi tiêu, thu nhập và cảnh báo ngân sách sẽ xuất hiện tại đây.')}</small>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
          {dsHienThi.map((tb) => {
            const laThu = tb.type === 'giao_dich_thu'
            const laNganSach = tb.type === 'ngan_sach_canh_bao'
            return (
              <div
                key={tb.id}
                onClick={() => xuLyDoc(tb)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: tb.read ? 'transparent' : 'color-mix(in srgb, var(--mau-chinh, #2563eb) 8%, transparent)',
                  border: '1px solid var(--mau-vien, rgba(148, 163, 184, 0.2))',
                  cursor: tb.transactionId ? 'pointer' : 'default',
                  transition: 'background 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    background: laThu ? '#10b98120' : laNganSach ? '#f59e0b20' : '#ef444420',
                    color: laThu ? '#10b981' : laNganSach ? '#f59e0b' : '#ef4444',
                  }}
                >
                  {laThu ? <ArrowDownLeft size={18} /> : laNganSach ? <AlertTriangle size={18} /> : <ArrowUpRight size={18} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <strong style={{ fontSize: '0.92rem', color: tb.read ? 'inherit' : 'var(--mau-chinh, #2563eb)' }}>
                      {tb.title}
                    </strong>
                    <span className="nho mo" style={{ flexShrink: 0 }}>{dinhDangThoiGian(tb.createdAt)}</span>
                  </div>
                  <p className="nho" style={{ margin: '4px 0 0', color: 'var(--chu-mo)', lineHeight: 1.45 }}>
                    {tb.content}
                  </p>
                  {tb.transactionId && (
                    <span className="nho" style={{ display: 'inline-block', marginTop: 4, color: 'var(--mau-chinh, #2563eb)', fontWeight: 500 }}>
                      {t('Nhấn để xem chi tiết giao dịch →')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn-icon btn-sm btn-nhe"
                  onClick={(e) => xuLyXoa(e, tb.id)}
                  aria-label={t('Xoá thông báo')}
                  title={t('Xoá thông báo này')}
                  style={{ opacity: 0.6, alignSelf: 'center' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
