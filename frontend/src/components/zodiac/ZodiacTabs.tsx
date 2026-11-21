import { t } from '../../utils/ngonNgu'

export type ZodiacTabId = 'tinh-cach' | 'diem-manh' | 'diem-yeu' | 'loi-khuyen'

interface ZodiacTabsProps {
  tabHienTai: ZodiacTabId
  onChonTab: (tab: ZodiacTabId) => void
}

export function ZodiacTabs({ tabHienTai, onChonTab }: ZodiacTabsProps) {
  const cacTab: {
    id: ZodiacTabId
    nhan: string
    iconSvg: (active: boolean) => React.ReactNode
  }[] = [
    {
      id: 'tinh-cach',
      nhan: t('Tính cách'),
      iconSvg: (active) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      id: 'diem-manh',
      nhan: t('Điểm mạnh'),
      iconSvg: (active) => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
    {
      id: 'diem-yeu',
      nhan: t('Điểm yếu'),
      iconSvg: () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      id: 'loi-khuyen',
      nhan: t('Lời khuyên'),
      iconSvg: () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      ),
    },
  ]

  return (
    <div className="zodiac-tabs-thanh" role="tablist" aria-label={t('Danh mục khám phá thiên thể')}>
      {cacTab.map((tab) => {
        const dangChon = tabHienTai === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={dangChon}
            className={`zodiac-tab-nut ${dangChon ? 'dang-chon' : ''}`}
            onClick={() => onChonTab(tab.id)}
          >
            <span className="zodiac-tab-icon">{tab.iconSvg(dangChon)}</span>
            <span className="zodiac-tab-chu">{tab.nhan}</span>
          </button>
        )
      })}
    </div>
  )
}
