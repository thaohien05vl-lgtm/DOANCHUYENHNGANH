import { useId } from 'react'

export function BieuTrungLogo({ size = 36 }: { size?: number }) {
  // id riêng cho từng bản vẽ: nếu dùng chung, gradient trong SVG bị display:none (thanh bên desktop) sẽ làm hỏng bản còn lại
  const uid = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Finora">
      <defs>
        <linearGradient id={`${uid}-tile`} x1="8" y1="4" x2="58" y2="62" gradientUnits="userSpaceOnUse">
          <stop style={{ stopColor: 'var(--muc-2, #33705f)' }} />
          <stop offset="1" style={{ stopColor: 'var(--muc, #0f342c)' }} />
        </linearGradient>
        <radialGradient id={`${uid}-gloss`} cx="0.2" cy="0.1" r="0.85">
          <stop stopColor="#fff" stopOpacity=".30" />
          <stop offset=".55" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-chu`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#d3ebe2" />
        </linearGradient>
        <linearGradient id={`${uid}-huy`} x1="0" y1="0" x2="1" y2="1">
          <stop style={{ stopColor: 'color-mix(in srgb, var(--ngoc, #43b896) 62%, #fff)' }} />
          <stop offset="1" style={{ stopColor: 'var(--ngoc, #3ea88a)' }} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill={`url(#${uid}-tile)`} />
      <rect width="64" height="64" rx="18" fill={`url(#${uid}-gloss)`} />
      <rect x=".5" y=".5" width="63" height="63" rx="17.5" fill="none" stroke="#fff" strokeOpacity=".12" />
      <rect x="19" y="16" width="8.5" height="32" rx="3.2" fill={`url(#${uid}-chu)`} />
      <rect x="19" y="16" width="26" height="8" rx="3.2" fill={`url(#${uid}-chu)`} />
      <rect x="19" y="29.5" width="18" height="7.4" rx="3.2" fill={`url(#${uid}-chu)`} />
      <circle cx="43.5" cy="42.5" r="9.2" fill={`url(#${uid}-huy)`} stroke="#123b32" strokeWidth="2.4" />
      <path d="M39.8 46.2 46.4 39.6M41.2 39.4h5.4v5.4" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
