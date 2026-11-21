export function BieuTrungLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Finora">
      <defs>
        <linearGradient id="finora-mark" x1="10" y1="8" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--muc-2, #24564b)" />
          <stop offset="1" stopColor="var(--muc, #143b32)" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="19" fill="url(#finora-mark)" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="var(--ngoc, #2fc39a)" strokeOpacity=".25" strokeWidth="1.5" />
      <path d="M21 45V19h23v6H28v6h13v6H28v8h-7Z" fill="#fff" />
      <path d="M44.5 41.5c0 3.04-2.46 5.5-5.5 5.5s-5.5-2.46-5.5-5.5S35.96 36 39 36s5.5 2.46 5.5 5.5Z" fill="var(--ngoc, #2fc39a)" stroke="var(--muc, #143b32)" strokeWidth="2" />
      <path d="m36.7 41.6 1.6 1.6 3.2-3.5" fill="none" stroke="var(--muc, #143b32)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
