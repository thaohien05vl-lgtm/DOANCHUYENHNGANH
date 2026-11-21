import { useGiaoDien } from '../../hooks/useGiaoDien'
import type { ThemeId } from '../../data/chuDe'

interface Props {
  themeId?: ThemeId
  mini?: boolean
  className?: string
  height?: number | string
}

export function HoaTietChuDe({ themeId, mini = false, className = '', height }: Props) {
  const { theme: themeHienTai, chuyenDongHoaTiet, giamChuyenDong } = useGiaoDien()
  const activeId = themeId || themeHienTai
  const coChuyenDong = chuyenDongHoaTiet && !giamChuyenDong && !mini

  const containerStyle: React.CSSProperties = {
    position: mini ? 'absolute' : 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height ?? (mini ? '100%' : '260px'),
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
  }

  // Khối SVG họa tiết tùy chỉnh riêng cho từng chủ đề
  return (
    <div
      className={`hoa-tiet-chu-de hoa-tiet-${activeId} ${coChuyenDong ? 'chuyen-dong' : ''} ${className}`}
      style={containerStyle}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMin slice"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          {/* Emerald Finance Gradients */}
          <linearGradient id="em-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#137b5d" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2fd3a0" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="em-g2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
          </linearGradient>

          {/* Finora Tím / Lavender Dream */}
          <linearGradient id="lav-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8064b2" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c084fc" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="lav-orb" cx="70%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#8064b2" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#8064b2" stopOpacity="0" />
          </radialGradient>

          {/* Graphite Luxury */}
          <linearGradient id="graph-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2fc39a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#122329" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="graph-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2fc39a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e3e3b" stopOpacity="0.05" />
          </linearGradient>

          {/* Ocean Breeze */}
          <linearGradient id="oc-wave1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3478b9" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="oc-wave2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.02" />
          </linearGradient>

          {/* Rose Garden / Sakura Garden */}
          <linearGradient id="rg-grad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b4476b" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="sakura-petal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fda4af" stopOpacity="0.12" />
          </linearGradient>
          <radialGradient id="sakura-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#f472b6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0" />
          </radialGradient>

          {/* Vanilla Cream */}
          <linearGradient id="van-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8e632f" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.02" />
          </linearGradient>

          {/* Sunset Amber */}
          <linearGradient id="sun-grad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="70%" stopColor="#d97706" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.01" />
          </linearGradient>

          {/* Forest Nature */}
          <linearGradient id="for-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#507538" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0.03" />
          </linearGradient>

          {/* Midnight Blue */}
          <linearGradient id="mid-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6aa5e8" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.04" />
          </linearGradient>

          {/* Silver Mist */}
          <linearGradient id="sil-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.03" />
          </linearGradient>

          {/* Burgundy Elegance */}
          <linearGradient id="bur-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d88a9c" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#881337" stopOpacity="0.04" />
          </linearGradient>

          {/* Sage Minimal */}
          <linearGradient id="sage-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9fbd86" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.03" />
          </linearGradient>

          {/* Coffee Premium */}
          <linearGradient id="cof-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#96602b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.03" />
          </linearGradient>

          {/* Arctic Frost */}
          <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#347487" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.04" />
          </linearGradient>

          {/* Amethyst Luxury */}
          <linearGradient id="ame-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b09add" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* 1. EMERALD FINANCE: Organic curves, leaves, and emerald arcs */}
        {activeId === 'ngoc' && (
          <g className="lop-hoa-tiet">
            <path
              className="phan-tu-troi-1"
              d="M 260 -40 C 330 20, 420 40, 440 140 C 450 200, 360 210, 290 190 C 210 165, 230 40, 260 -40 Z"
              fill="url(#em-g1)"
            />
            <path
              className="phan-tu-troi-2"
              d="M -30 20 C 60 -20, 150 30, 160 110 C 170 170, 90 200, 30 180 C -30 160, -80 70, -30 20 Z"
              fill="url(#em-g2)"
            />
            {/* Stylized leaf curves */}
            <path
              d="M 320 30 Q 360 70 340 120 Q 300 80 320 30 Z"
              fill="none"
              stroke="#137b5d"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <circle cx="340" cy="120" r="4" fill="#137b5d" fillOpacity="0.4" />
            <circle cx="100" cy="60" r="48" fill="none" stroke="#2fd3a0" strokeWidth="1.5" strokeOpacity="0.2" />
            <circle cx="100" cy="60" r="28" fill="none" stroke="#2fd3a0" strokeWidth="1" strokeOpacity="0.15" />
          </g>
        )}

        {/* 2. FINORA TÍM / LAVENDER DREAM: Soft floating spheres and concentric lilac orbs */}
        {activeId === 'hoa-tim' && (
          <g className="lop-hoa-tiet">
            <circle className="phan-tu-troi-1" cx="330" cy="60" r="90" fill="url(#lav-orb)" />
            <circle className="phan-tu-troi-2" cx="70" cy="50" r="60" fill="url(#lav-g1)" />
            <circle cx="330" cy="60" r="115" fill="none" stroke="#8064b2" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="6 6" />
            <circle cx="330" cy="60" r="140" fill="none" stroke="#8064b2" strokeWidth="1" strokeOpacity="0.15" />
            <circle cx="200" cy="30" r="35" fill="url(#lav-g1)" opacity="0.6" />
            <circle cx="215" cy="22" r="8" fill="#e9d5ff" fillOpacity="0.4" />
          </g>
        )}

        {/* 3. GRAPHITE LUXURY: Modern minimal diagonal lines and cyber-glow slices */}
        {activeId === 'dem' && (
          <g className="lop-hoa-tiet">
            <polygon
              className="phan-tu-troi-1"
              points="220,-20 420,-20 440,160 270,180"
              fill="url(#graph-g1)"
            />
            <line x1="160" y1="-10" x2="380" y2="210" stroke="url(#graph-line)" strokeWidth="2" />
            <line x1="200" y1="-10" x2="420" y2="210" stroke="url(#graph-line)" strokeWidth="1" strokeDasharray="8 6" />
            <line x1="240" y1="-10" x2="460" y2="210" stroke="url(#graph-line)" strokeWidth="1.5" />
            <rect x="290" y="30" width="60" height="60" rx="14" fill="none" stroke="#2fc39a" strokeWidth="1.5" strokeOpacity="0.3" transform="rotate(25 320 60)" />
            <circle cx="60" cy="80" r="70" fill="none" stroke="#2fc39a" strokeWidth="1" strokeOpacity="0.15" />
          </g>
        )}

        {/* 4. OCEAN BREEZE: Layered ripples and rolling nautical waves */}
        {activeId === 'bien' && (
          <g className="lop-hoa-tiet">
            <path
              className="phan-tu-song-1"
              d="M -20 100 C 60 70, 140 130, 220 90 C 300 50, 360 110, 440 80 L 440 -20 L -20 -20 Z"
              fill="url(#oc-wave1)"
            />
            <path
              className="phan-tu-song-2"
              d="M -20 140 C 70 110, 160 160, 250 120 C 330 80, 380 140, 440 110 L 440 -20 L -20 -20 Z"
              fill="url(#oc-wave2)"
            />
            <circle cx="340" cy="50" r="50" fill="none" stroke="#3478b9" strokeWidth="1.5" strokeOpacity="0.2" />
            <circle cx="340" cy="50" r="30" fill="none" stroke="#3478b9" strokeWidth="1" strokeOpacity="0.15" />
          </g>
        )}

        {/* 5. ROSE GARDEN / SAKURA GARDEN: Elegant floral petals, cherry blossoms and soft rosy sweeps */}
        {activeId === 'phu-dung' && (
          <g className="lop-hoa-tiet">
            <circle cx="340" cy="55" r="75" fill="url(#sakura-glow)" />
            <path
              className="phan-tu-troi-1"
              d="M 330 -30 C 400 30, 410 130, 340 180 C 270 210, 240 140, 260 80 C 280 20, 300 -60, 330 -30 Z"
              fill="url(#rg-grad1)"
            />
            <path
              className="phan-tu-troi-2"
              d="M 60 -10 C 120 40, 130 110, 80 150 C 30 180, -20 140, 0 80 C 20 20, 30 -30, 60 -10 Z"
              fill="url(#rg-grad1)"
              opacity="0.7"
            />
            {/* Stylized 5-petal cherry blossom (Sakura) */}
            <g transform="translate(340, 55)" className="phan-tu-troi-1">
              {[0, 72, 144, 216, 288].map((goc, i) => (
                <path
                  key={i}
                  d="M 0 0 C -8 -18, -14 -28, 0 -34 C 14 -28, 8 -18, 0 0 Z"
                  fill="url(#sakura-petal)"
                  transform={`rotate(${goc})`}
                />
              ))}
              <circle cx="0" cy="0" r="4" fill="#fb7185" fillOpacity="0.8" />
            </g>
            {/* Secondary smaller flower */}
            <g transform="translate(190, 30) scale(0.65)" className="phan-tu-troi-2">
              {[0, 72, 144, 216, 288].map((goc, i) => (
                <path
                  key={i}
                  d="M 0 0 C -8 -18, -14 -28, 0 -34 C 14 -28, 8 -18, 0 0 Z"
                  fill="url(#sakura-petal)"
                  transform={`rotate(${goc})`}
                />
              ))}
              <circle cx="0" cy="0" r="3.5" fill="#fb7185" fillOpacity="0.7" />
            </g>
            {/* Drifting petals */}
            <path
              className="phan-tu-troi-1"
              d="M 120 70 C 130 60, 145 65, 140 80 C 135 90, 115 85, 120 70 Z"
              fill="url(#sakura-petal)"
            />
            <path
              className="phan-tu-troi-2"
              d="M 260 95 C 268 87, 280 91, 276 103 C 272 111, 256 107, 260 95 Z"
              fill="url(#sakura-petal)"
            />
            <circle cx="310" cy="90" r="45" fill="none" stroke="#b4476b" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="5 5" />
            <circle cx="310" cy="90" r="22" fill="none" stroke="#b4476b" strokeWidth="1" strokeOpacity="0.2" />
          </g>
        )}

        {/* 6. VANILLA CREAM: Warm circular arcs and soothing cream swirls */}
        {activeId === 'kem' && (
          <g className="lop-hoa-tiet">
            <circle className="phan-tu-troi-1" cx="350" cy="60" r="100" fill="url(#van-grad)" />
            <circle cx="350" cy="60" r="120" fill="none" stroke="#8e632f" strokeWidth="1.5" strokeOpacity="0.2" />
            <circle cx="350" cy="60" r="140" fill="none" stroke="#8e632f" strokeWidth="1" strokeOpacity="0.12" />
            <path
              className="phan-tu-troi-2"
              d="M -30 60 C 50 10, 130 70, 150 140 C 160 190, 90 220, 20 200 Z"
              fill="url(#van-grad)"
              opacity="0.6"
            />
          </g>
        )}

        {/* 7. SUNSET AMBER: Radiant twilight semi-circles and amber sunset discs */}
        {activeId === 'ho-phach' && (
          <g className="lop-hoa-tiet">
            <circle className="phan-tu-troi-1" cx="310" cy="70" r="75" fill="url(#sun-grad)" />
            <path d="M 180 70 L 440 70" stroke="#d8a45c" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="8 6" />
            <circle cx="310" cy="70" r="95" fill="none" stroke="#d8a45c" strokeWidth="1.5" strokeOpacity="0.25" />
            <circle cx="310" cy="70" r="120" fill="none" stroke="#d8a45c" strokeWidth="1" strokeOpacity="0.15" />
            <path
              className="phan-tu-troi-2"
              d="M -20 120 C 50 90, 120 130, 180 90 L 180 -20 L -20 -20 Z"
              fill="url(#sun-grad)"
              opacity="0.5"
            />
          </g>
        )}

        {/* 8. FOREST NATURE: Botanical canopy curves and nature foliage */}
        {activeId === 'la' && (
          <g className="lop-hoa-tiet">
            <path
              className="phan-tu-troi-1"
              d="M 280 -30 C 370 10, 420 80, 400 160 C 360 210, 270 180, 240 120 C 220 70, 240 -30, 280 -30 Z"
              fill="url(#for-grad)"
            />
            <path
              d="M 240 120 C 280 80, 320 60, 380 50"
              fill="none"
              stroke="#507538"
              strokeWidth="2"
              strokeOpacity="0.35"
            />
            <circle cx="80" cy="50" r="55" fill="url(#for-grad)" opacity="0.6" />
            <circle cx="80" cy="50" r="75" fill="none" stroke="#507538" strokeWidth="1.2" strokeOpacity="0.2" />
          </g>
        )}

        {/* 9. MIDNIGHT BLUE: Deep celestial concentric rings and cosmic dark depth */}
        {activeId === 'dai-duong' && (
          <g className="lop-hoa-tiet">
            <circle className="phan-tu-troi-1" cx="320" cy="60" r="85" fill="url(#mid-grad)" />
            <circle cx="320" cy="60" r="110" fill="none" stroke="#6aa5e8" strokeWidth="1.5" strokeOpacity="0.25" />
            <circle cx="320" cy="60" r="135" fill="none" stroke="#6aa5e8" strokeWidth="1" strokeOpacity="0.15" strokeDasharray="4 6" />
            <circle cx="320" cy="60" r="160" fill="none" stroke="#6aa5e8" strokeWidth="1" strokeOpacity="0.08" />
            {/* Celestial stars */}
            <circle cx="120" cy="40" r="2.5" fill="#6aa5e8" fillOpacity="0.7" />
            <circle cx="180" cy="80" r="2" fill="#6aa5e8" fillOpacity="0.5" />
            <circle cx="70" cy="110" r="1.5" fill="#6aa5e8" fillOpacity="0.6" />
          </g>
        )}

        {/* 10. SILVER MIST: Refined metallic ribbons and clean isometric contours */}
        {activeId === 'than' && (
          <g className="lop-hoa-tiet">
            <path
              className="phan-tu-troi-1"
              d="M 240 -20 L 420 -20 L 380 160 L 210 140 Z"
              fill="url(#sil-grad)"
            />
            <line x1="160" y1="20" x2="400" y2="20" stroke="#a9b8c1" strokeWidth="1.5" strokeOpacity="0.25" />
            <line x1="180" y1="60" x2="420" y2="60" stroke="#a9b8c1" strokeWidth="1.2" strokeOpacity="0.2" strokeDasharray="6 4" />
            <line x1="200" y1="100" x2="440" y2="100" stroke="#a9b8c1" strokeWidth="1" strokeOpacity="0.15" />
            <circle cx="70" cy="70" r="60" fill="none" stroke="#a9b8c1" strokeWidth="1.5" strokeOpacity="0.2" />
          </g>
        )}

        {/* 11. BURGUNDY ELEGANCE: Royal velvet arcs and deep wine crescent ribbons */}
        {activeId === 'hoa-hong' && (
          <g className="lop-hoa-tiet">
            <path
              className="phan-tu-troi-1"
              d="M 270 -30 C 370 10, 440 90, 390 170 C 340 220, 260 170, 240 100 C 220 30, 240 -40, 270 -30 Z"
              fill="url(#bur-grad)"
            />
            <path
              className="phan-tu-troi-2"
              d="M 80 -10 C 150 40, 140 120, 70 160 C 10 190, -30 130, -10 60 Z"
              fill="url(#bur-grad)"
              opacity="0.5"
            />
            <circle cx="320" cy="80" r="50" fill="none" stroke="#d88a9c" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="6 4" />
          </g>
        )}

        {/* 12. SAGE MINIMAL: Zen harmonic curves and peaceful stone balance contours */}
        {activeId === 'rung-dem' && (
          <g className="lop-hoa-tiet">
            <ellipse className="phan-tu-troi-1" cx="320" cy="65" rx="90" ry="60" fill="url(#sage-grad)" />
            <ellipse cx="320" cy="65" rx="115" ry="80" fill="none" stroke="#9fbd86" strokeWidth="1.5" strokeOpacity="0.25" />
            <ellipse cx="320" cy="65" rx="140" ry="100" fill="none" stroke="#9fbd86" strokeWidth="1" strokeOpacity="0.15" />
            <circle cx="90" cy="60" r="50" fill="url(#sage-grad)" opacity="0.6" />
          </g>
        )}

        {/* 13. COFFEE PREMIUM: Warm mocha aroma spirals and roasted latte waves */}
        {activeId === 'thu' && (
          <g className="lop-hoa-tiet">
            <circle className="phan-tu-troi-1" cx="330" cy="60" r="85" fill="url(#cof-grad)" />
            <path
              className="phan-tu-troi-2"
              d="M 290 120 Q 330 60 300 20 Q 280 80 320 110"
              fill="none"
              stroke="#96602b"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <circle cx="330" cy="60" r="110" fill="none" stroke="#96602b" strokeWidth="1.5" strokeOpacity="0.25" strokeDasharray="8 6" />
            <circle cx="80" cy="60" r="55" fill="url(#cof-grad)" opacity="0.5" />
          </g>
        )}

        {/* 14. ARCTIC FROST: Angular crystalline facets and geometric icy prisms */}
        {activeId === 'troi' && (
          <g className="lop-hoa-tiet">
            <polygon
              className="phan-tu-troi-1"
              points="280,-20 400,20 440,140 320,180 240,80"
              fill="url(#arc-grad)"
            />
            <polygon
              points="280,-20 400,20 320,80"
              fill="none"
              stroke="#347487"
              strokeWidth="1.5"
              strokeOpacity="0.3"
            />
            <polygon
              points="400,20 440,140 320,80"
              fill="none"
              stroke="#347487"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
            <circle cx="90" cy="60" r="55" fill="none" stroke="#347487" strokeWidth="1.2" strokeOpacity="0.2" />
          </g>
        )}

        {/* 15. AMETHYST LUXURY: Prismatic crystal shards and glowing violet rings */}
        {activeId === 'thach-anh' && (
          <g className="lop-hoa-tiet">
            <circle className="phan-tu-troi-1" cx="320" cy="60" r="85" fill="url(#ame-grad)" />
            <polygon
              className="phan-tu-troi-2"
              points="320,-10 390,40 360,130 280,120 250,50"
              fill="none"
              stroke="#b09add"
              strokeWidth="1.8"
              strokeOpacity="0.35"
            />
            <circle cx="320" cy="60" r="115" fill="none" stroke="#b09add" strokeWidth="1.2" strokeOpacity="0.2" strokeDasharray="5 5" />
            <circle cx="80" cy="60" r="50" fill="url(#ame-grad)" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  )
}

