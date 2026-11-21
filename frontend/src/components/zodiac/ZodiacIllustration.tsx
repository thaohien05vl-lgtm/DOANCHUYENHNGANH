import type { SVGProps } from 'react'
import type { ZodiacSignId } from './zodiacData'

interface ZodiacIllustrationProps extends SVGProps<SVGSVGElement> {
  signId: ZodiacSignId
  size?: number | string
  className?: string
}

/**
 * 1. SONG NGƯ (PISCES) — Bám sát 100% ảnh tham khảo:
 * Hai chú cá bơi vòng tròn thiên văn đối xứng, vây đuôi xếp nếp mềm mại,
 * vảy sáng, bọt nước sao, chòm sao thiên hà và vòng quỹ đạo thần tiên.
 */
export function PiscesSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`zodiac-svg-art ${className}`}
      {...props}
    >
      <defs>
        {/* Hào quang nền thiên văn */}
        <radialGradient id="pisces-celestial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--zodiac-primary)" stopOpacity="0.32" />
          <stop offset="60%" stopColor="var(--zodiac-primary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Gradient thân cá xanh ngọc - tím lavender */}
        <linearGradient id="fish-blue-lavender" x1="15%" y1="15%" x2="85%" y2="85%">
          <stop offset="0%" stopColor="#bfdbfe" />
          <stop offset="45%" stopColor="#818cf8" />
          <stop offset="80%" stopColor="var(--zodiac-primary)" />
          <stop offset="100%" stopColor="var(--zodiac-primary-dark)" />
        </linearGradient>

        <linearGradient id="fish-purple-blue" x1="85%" y1="85%" x2="15%" y2="15%">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="45%" stopColor="var(--zodiac-primary)" />
          <stop offset="85%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Gradient vây cá mỏng trong suốt */}
        <linearGradient id="fin-ethereal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#c4b5fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--zodiac-primary)" stopOpacity="0.2" />
        </linearGradient>

        {/* Glow phát sáng cho sao vàng */}
        <filter id="star-celestial-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Hào quang thiên thể */}
      <circle cx="120" cy="120" r="110" fill="url(#pisces-celestial-glow)" />

      {/* 2. Các chòm sao và đường nối chòm sao phía sau */}
      <g opacity="0.45" stroke="var(--zodiac-primary)" strokeWidth="0.8" strokeDasharray="2 3">
        <line x1="45" y1="55" x2="70" y2="35" />
        <line x1="70" y1="35" x2="105" y2="40" />
        <line x1="165" y1="65" x2="195" y2="85" />
        <line x1="195" y1="85" x2="185" y2="125" />
        <line x1="45" y1="175" x2="75" y2="195" />
        <line x1="75" y1="195" x2="115" y2="190" />
      </g>

      {/* 3. Vòng tròn thiên văn kép & quỹ đạo elip xoay */}
      <circle
        cx="120"
        cy="120"
        r="98"
        stroke="var(--zodiac-primary)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        strokeOpacity="0.38"
        className="zodiac-orbit-spin"
      />
      <circle
        cx="120"
        cy="120"
        r="82"
        stroke="var(--zodiac-primary)"
        strokeWidth="0.85"
        strokeOpacity="0.25"
      />
      <ellipse
        cx="120"
        cy="120"
        rx="106"
        ry="50"
        transform="rotate(-28 120 120)"
        stroke="var(--zodiac-primary)"
        strokeWidth="0.75"
        strokeDasharray="3 7"
        strokeOpacity="0.28"
      />

      {/* 4. Các vì sao thiên thể và bọt nước lung linh */}
      <g className="zodiac-twinkle-group">
        {/* Sao 4 cánh lớn vàng kim đỉnh cao */}
        <path
          d="M120 22 Q122 32 128 34 Q122 36 120 46 Q118 36 112 34 Q118 32 120 22 Z"
          fill="var(--zodiac-star, #f59e0b)"
          filter="url(#star-celestial-glow)"
        />
        {/* Sao 4 cánh bên phải */}
        <path
          d="M205 130 Q206 136 211 138 Q206 140 205 146 Q204 140 199 138 Q204 136 205 130 Z"
          fill="var(--zodiac-star, #f59e0b)"
          opacity="0.85"
        />
        {/* Sao 4 cánh bên trái */}
        <path
          d="M35 110 Q36 115 40 117 Q36 119 35 124 Q34 119 30 117 Q34 115 35 110 Z"
          fill="var(--zodiac-star, #f59e0b)"
          opacity="0.85"
        />

        {/* Các ngôi sao nhỏ trắng & vàng */}
        <circle cx="45" cy="55" r="2.2" fill="#ffffff" />
        <circle cx="70" cy="35" r="1.8" fill="#ffffff" />
        <circle cx="105" cy="40" r="1.6" fill="var(--zodiac-star, #f59e0b)" />
        <circle cx="165" cy="65" r="2.2" fill="#ffffff" />
        <circle cx="195" cy="85" r="1.8" fill="var(--zodiac-star, #f59e0b)" />
        <circle cx="185" cy="125" r="2" fill="#ffffff" />
        <circle cx="190" cy="170" r="1.8" fill="#ffffff" />
        <circle cx="45" cy="175" r="2.2" fill="#ffffff" />
        <circle cx="75" cy="195" r="1.8" fill="var(--zodiac-star, #f59e0b)" />
        <circle cx="115" cy="190" r="1.6" fill="#ffffff" />
        <circle cx="155" cy="200" r="1.8" fill="var(--zodiac-star, #f59e0b)" />

        {/* Bọt nước thiên hà tinh khôi */}
        <circle cx="108" cy="98" r="2.5" fill="#ffffff" fillOpacity="0.75" />
        <circle cx="132" cy="142" r="3" fill="#ffffff" fillOpacity="0.7" />
        <circle cx="120" cy="115" r="2" fill="#ffffff" fillOpacity="0.6" />
        <circle cx="95" cy="125" r="1.8" fill="#ffffff" fillOpacity="0.5" />
      </g>

      {/* 5. Chú cá 1 (Cá phía trên bơi từ trái sang phải rồi uốn lượn xuống) */}
      <g className="zodiac-fish-1">
        {/* Vây đuôi cá 1 xòe rộng mềm mại nhiều tầng */}
        <path
          d="M74 80 C56 62 46 38 52 24 C62 42 82 56 90 72 C82 76 77 78 74 80 Z"
          fill="url(#fin-ethereal)"
        />
        <path
          d="M72 84 C48 74 36 52 38 36 C54 52 68 72 78 82 Z"
          fill="url(#fin-ethereal)"
          fillOpacity="0.8"
        />
        <path
          d="M70 86 C40 88 28 68 28 54 C46 66 62 82 72 86 Z"
          fill="url(#fin-ethereal)"
          fillOpacity="0.65"
        />

        {/* Vây ngực & vây lưng cá 1 */}
        <path
          d="M115 65 C120 48 138 40 148 42 C138 54 126 62 115 65 Z"
          fill="url(#fin-ethereal)"
        />
        <path
          d="M152 98 C165 106 174 102 178 95 C170 90 158 92 152 98 Z"
          fill="url(#fin-ethereal)"
        />

        {/* Thân cá 1 uốn lượn thanh tú */}
        <path
          d="M72 82 C90 62 122 60 148 72 C168 82 180 98 175 116 C170 125 160 128 150 120 C130 106 102 106 79 92 C75 88 72 84 72 82 Z"
          fill="url(#fish-blue-lavender)"
        />

        {/* Đường viền lưng và vảy cá 1 */}
        <path
          d="M96 76 Q112 68 132 76"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <path
          d="M108 86 Q126 78 144 88"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M124 96 Q138 90 152 100"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* Mắt cá 1 long lanh */}
        <circle cx="166" cy="108" r="3.2" fill="#ffffff" />
        <circle cx="166.8" cy="107.6" r="1.6" fill="#0f172a" />
        <circle cx="166.2" cy="107" r="0.8" fill="#ffffff" />
      </g>

      {/* 6. Chú cá 2 (Cá phía dưới bơi từ phải sang trái rồi uốn lượn lên) */}
      <g className="zodiac-fish-2">
        {/* Vây đuôi cá 2 xòe rộng nhiều tầng */}
        <path
          d="M166 160 C184 178 194 202 188 216 C178 198 158 184 150 168 C158 164 163 162 166 160 Z"
          fill="url(#fin-ethereal)"
        />
        <path
          d="M168 156 C192 166 204 188 202 204 C186 188 172 168 162 158 Z"
          fill="url(#fin-ethereal)"
          fillOpacity="0.8"
        />
        <path
          d="M170 154 C200 152 212 172 212 186 C194 174 178 158 168 154 Z"
          fill="url(#fin-ethereal)"
          fillOpacity="0.65"
        />

        {/* Vây ngực & vây bụng cá 2 */}
        <path
          d="M125 175 C120 192 102 200 92 198 C102 186 114 178 125 175 Z"
          fill="url(#fin-ethereal)"
        />
        <path
          d="M88 142 C75 134 66 138 62 145 C70 150 82 148 88 142 Z"
          fill="url(#fin-ethereal)"
        />

        {/* Thân cá 2 uốn lượn nhịp nhàng */}
        <path
          d="M168 158 C150 178 118 180 92 168 C72 158 60 142 65 124 C70 115 80 112 90 120 C110 134 138 134 161 148 C165 152 168 156 168 158 Z"
          fill="url(#fish-purple-blue)"
        />

        {/* Vảy ánh sáng trên thân cá 2 */}
        <path
          d="M144 164 Q128 172 108 164"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.75"
        />
        <path
          d="M132 154 Q114 162 96 152"
          stroke="#ffffff"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M116 144 Q102 150 88 140"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.5"
        />

        {/* Mắt cá 2 */}
        <circle cx="74" cy="132" r="3.2" fill="#ffffff" />
        <circle cx="73.2" cy="132.4" r="1.6" fill="#0f172a" />
        <circle cx="73.8" cy="133" r="0.8" fill="#ffffff" />
      </g>

      {/* 7. Dòng năng lượng kết nối hai chú cá ở tâm (Âm Dương Hoàng Đạo) */}
      <path
        d="M102 108 C115 96 125 144 138 132"
        stroke="var(--zodiac-primary)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeDasharray="2 4"
        strokeOpacity="0.7"
      />
    </svg>
  )
}

/**
 * 2. BẠCH DƯƠNG (ARIES)
 */
export function AriesSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="aries-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="aries-horn" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="var(--zodiac-primary)" />
        </linearGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#aries-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      <circle cx="120" cy="120" r="82" stroke="var(--zodiac-primary)" strokeWidth="0.85" strokeOpacity="0.25" />
      {/* Sao trang trí */}
      <path d="M120 22 Q122 32 128 34 Q122 36 120 46 Q118 36 112 34 Q118 32 120 22 Z" fill="#f59e0b" />
      <circle cx="55" cy="65" r="2.2" fill="#fff" />
      <circle cx="185" cy="65" r="2.2" fill="#fff" />
      <circle cx="48" cy="165" r="2" fill="#f59e0b" />
      <circle cx="192" cy="165" r="2" fill="#fff" />

      {/* Sừng xoắn hoàng kim kiêu hãnh */}
      <path
        d="M110 102 C102 78 82 64 58 68 C34 72 26 102 46 118 C60 130 86 124 92 110 C94 102 88 94 78 96 C66 98 62 108 68 112"
        stroke="url(#aries-horn)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M130 102 C138 78 158 64 182 68 C206 72 214 102 194 118 C180 130 154 124 148 110 C146 102 152 94 162 96 C174 98 178 108 172 112"
        stroke="url(#aries-horn)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      {/* Khuôn mặt cừu dũng mãnh */}
      <path
        d="M102 98 C102 84 138 84 138 98 C138 126 132 160 120 176 C108 160 102 126 102 98 Z"
        fill="var(--zodiac-bg)"
        stroke="var(--zodiac-primary)"
        strokeWidth="4"
      />
      {/* Ngôi sao trán */}
      <polygon points="120,102 122,108 128,109 123,113 125,119 120,115 115,119 117,113 112,109 118,108" fill="#f59e0b" />
      {/* Mũi & Mắt */}
      <path d="M115 164 Q120 168 125 164" stroke="var(--zodiac-primary)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="110" cy="118" rx="3" ry="5" transform="rotate(-15 110 118)" fill="var(--zodiac-primary-dark)" />
      <ellipse cx="130" cy="118" rx="3" ry="5" transform="rotate(15 130 118)" fill="var(--zodiac-primary-dark)" />
    </svg>
  )
}

/**
 * 3. KIM NGƯU (TAURUS)
 */
export function TaurusSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="taurus-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#taurus-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Sừng trăng khuyết kiêu hãnh */}
      <path
        d="M58 72 C75 50 102 44 120 44 C138 44 165 50 182 72 C168 66 146 70 130 88 C124 94 116 94 110 88 C94 70 72 66 58 72 Z"
        fill="var(--zodiac-primary)"
      />
      {/* Đầu bò */}
      <circle cx="120" cy="138" r="50" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="4" />
      {/* Tai bò hai bên */}
      <path d="M72 122 C54 118 50 132 62 142 C70 140 73 132 72 122 Z" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="2.5" />
      <path d="M168 122 C186 118 190 132 178 142 C170 140 167 132 168 122 Z" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="2.5" />
      {/* Mõm tròn */}
      <ellipse cx="120" cy="158" rx="28" ry="19" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="2.5" />
      <circle cx="110" cy="158" r="3.5" fill="var(--zodiac-primary)" />
      <circle cx="130" cy="158" r="3.5" fill="var(--zodiac-primary)" />
      <circle cx="102" cy="126" r="4" fill="var(--zodiac-primary-dark)" />
      <circle cx="138" cy="126" r="4" fill="var(--zodiac-primary-dark)" />
      <polygon points="120,98 123,104 129,105 125,109 126,115 120,111 114,115 115,109 111,105 117,104" fill="#f59e0b" />
    </svg>
  )
}

/**
 * 4. SONG TỬ (GEMINI)
 */
export function GeminiSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="gemini-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#gemini-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Cột La Mã Song Tử */}
      <path d="M80 66 H160" stroke="var(--zodiac-primary)" strokeWidth="6" strokeLinecap="round" />
      <path d="M80 174 H160" stroke="var(--zodiac-primary)" strokeWidth="6" strokeLinecap="round" />
      <path d="M100 68 C88 98 88 142 100 172" stroke="var(--zodiac-primary)" strokeWidth="7" strokeLinecap="round" />
      <path d="M140 68 C152 98 152 142 140 172" stroke="var(--zodiac-primary)" strokeWidth="7" strokeLinecap="round" />
      {/* Ngôi sao trung tâm liên kết */}
      <polygon points="120,102 125,114 137,116 128,124 130,136 120,129 110,136 112,124 103,116 115,114" fill="#f59e0b" />
      <circle cx="84" cy="120" r="5" fill="var(--zodiac-primary)" />
      <circle cx="156" cy="120" r="5" fill="var(--zodiac-primary)" />
    </svg>
  )
}

/**
 * 5. CỰ GIẢI (CANCER)
 */
export function CancerSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="cancer-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.25" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#cancer-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Mai cua trăng tròn */}
      <circle cx="120" cy="130" r="38" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="4" />
      {/* Cặp càng mềm mại bảo bọc */}
      <path
        d="M94 106 C72 82 48 92 50 118 C52 132 66 134 74 126 C72 112 82 102 94 106 Z"
        fill="var(--zodiac-tint)"
        stroke="var(--zodiac-primary)"
        strokeWidth="3.5"
      />
      <path
        d="M146 106 C168 82 192 92 190 118 C188 132 174 134 166 126 C168 112 158 102 146 106 Z"
        fill="var(--zodiac-tint)"
        stroke="var(--zodiac-primary)"
        strokeWidth="3.5"
      />
      {/* Mắt cua */}
      <circle cx="106" cy="102" r="5" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <circle cx="107" cy="101" r="2.2" fill="var(--zodiac-primary-dark)" />
      <circle cx="134" cy="102" r="5" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <circle cx="133" cy="101" r="2.2" fill="var(--zodiac-primary-dark)" />
      <path d="M115 120 C110 128 110 140 118 146 C110 142 108 130 115 120 Z" fill="#f59e0b" />
    </svg>
  )
}

/**
 * 6. SƯ TỬ (LEO)
 */
export function LeoSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="leo-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#leo-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Bờm sư tử mặt trời */}
      <path
        d="M120 52 Q127 68 136 74 Q154 66 163 80 Q173 90 170 108 Q185 118 180 134 Q173 146 166 156 Q166 172 151 180 Q139 182 130 190 Q120 194 110 190 Q101 182 89 180 Q74 172 74 156 Q67 146 60 134 Q55 118 70 108 Q67 90 77 80 Q86 66 104 74 Q113 68 120 52 Z"
        fill="var(--zodiac-tint)"
        stroke="var(--zodiac-primary)"
        strokeWidth="3.5"
      />
      <circle cx="120" cy="126" r="34" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3.5" />
      <circle cx="92" cy="100" r="11" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <circle cx="148" cy="100" r="11" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <ellipse cx="107" cy="120" rx="3.5" ry="5" fill="var(--zodiac-primary-dark)" />
      <ellipse cx="133" cy="120" rx="3.5" ry="5" fill="var(--zodiac-primary-dark)" />
      <polygon points="120,132 113,126 127,126" fill="var(--zodiac-primary)" />
      <path d="M120 132 V139 M113 139 Q120 144 127 139" stroke="var(--zodiac-primary)" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="120,40 122,46 128,47 124,51 125,57 120,54 115,57 116,51 112,47 118,46" fill="#f59e0b" />
    </svg>
  )
}

/**
 * 7. XỬ NỮ (VIRGO)
 */
export function VirgoSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="virgo-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#virgo-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Đôi cánh thiên thần */}
      <path
        d="M120 132 C96 96 60 78 42 94 C30 106 38 132 66 150 C90 166 114 150 120 132 Z"
        fill="var(--zodiac-tint)"
        stroke="var(--zodiac-primary)"
        strokeWidth="3"
      />
      <path
        d="M120 132 C144 96 180 78 198 94 C210 106 202 132 174 150 C150 166 126 150 120 132 Z"
        fill="var(--zodiac-tint)"
        stroke="var(--zodiac-primary)"
        strokeWidth="3"
      />
      {/* Đầu & mái tóc */}
      <circle cx="120" cy="86" r="17" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3.5" />
      <path d="M105 84 C105 67 135 67 135 84 C135 94 125 101 120 101 C115 101 105 94 105 84 Z" fill="var(--zodiac-primary)" />
      {/* Bó lúa thần Spica */}
      <path d="M115 178 Q122 138 142 108" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="142" cy="106" rx="5" ry="8" transform="rotate(35 142 106)" fill="#f59e0b" />
      <ellipse cx="134" cy="120" rx="4.5" ry="7" transform="rotate(30 134 120)" fill="#f59e0b" />
      <polygon points="152,91 154,97 160,98 155,103 156,109 152,105 147,109 148,103 143,98 149,97" fill="#fff" />
    </svg>
  )
}

/**
 * 8. THIÊN BÌNH (LIBRA)
 */
export function LibraSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="libra-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.28" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#libra-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Đỉnh cán cân với vầng trăng khuyết */}
      <circle cx="120" cy="65" r="6" fill="var(--zodiac-primary)" />
      <line x1="120" y1="65" x2="120" y2="182" stroke="var(--zodiac-primary)" strokeWidth="4" strokeLinecap="round" />
      <path d="M60 94 C96 86 144 86 180 94" stroke="var(--zodiac-primary)" strokeWidth="5" strokeLinecap="round" />
      {/* Đĩa cân trái */}
      <line x1="68" y1="94" x2="53" y2="137" stroke="var(--zodiac-primary)" strokeWidth="1.8" />
      <line x1="68" y1="94" x2="82" y2="137" stroke="var(--zodiac-primary)" strokeWidth="1.8" />
      <path d="M46 137 C46 151 89 151 89 137 Z" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <polygon points="68,125 70,130 75,131 71,135 72,140 68,137 63,140 64,135 60,131 65,130" fill="#f59e0b" />
      {/* Đĩa cân phải */}
      <line x1="172" y1="94" x2="157" y2="137" stroke="var(--zodiac-primary)" strokeWidth="1.8" />
      <line x1="172" y1="94" x2="187" y2="137" stroke="var(--zodiac-primary)" strokeWidth="1.8" />
      <path d="M150 137 C150 151 193 151 193 137 Z" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <polygon points="172,125 174,130 179,131 175,135 176,140 172,137 167,140 168,135 164,131 169,130" fill="#f59e0b" />
      <path d="M94 182 H146" stroke="var(--zodiac-primary)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * 9. BỌ CẠP (SCORPIO)
 */
export function ScorpioSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="scorpio-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#scorpio-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Càng bọ cạp */}
      <path d="M86 126 C66 108 54 84 65 66 C78 74 78 94 94 110" stroke="var(--zodiac-primary)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M154 126 C174 108 186 84 175 66 C162 74 162 94 146 110" stroke="var(--zodiac-primary)" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* Thân giáp */}
      <ellipse cx="120" cy="130" rx="22" ry="29" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3.5" />
      <path d="M103 123 H137 M105 135 H135 M110 147 H130" stroke="var(--zodiac-primary)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Đuôi nọc sao cong vút */}
      <path
        d="M120 159 C120 186 150 194 166 174 C178 158 170 130 154 110 C149 105 154 96 161 98"
        stroke="var(--zodiac-primary)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="162,91 164,96 170,97 165,101 167,107 162,103 157,107 158,101 154,97 159,96" fill="#f59e0b" />
    </svg>
  )
}

/**
 * 10. NHÂN MÃ (SAGITTARIUS)
 */
export function SagittariusSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="sag-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#sag-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Cánh cung tinh tú */}
      <path d="M74 175 C72 132 108 84 173 72" stroke="var(--zodiac-primary)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <line x1="74" y1="175" x2="106" y2="144" stroke="var(--zodiac-primary)" strokeWidth="2.5" strokeDasharray="4 4" />
      <line x1="173" y1="72" x2="106" y2="144" stroke="var(--zodiac-primary)" strokeWidth="2.5" strokeDasharray="4 4" />
      <line x1="86" y1="163" x2="182" y2="67" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
      <polygon points="182,67 163,70 179,86" fill="#f59e0b" />
      <path d="M81 168 L72 177 M89 175 L80 184" stroke="var(--zodiac-primary)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="190" cy="60" r="3.5" fill="#fff" />
    </svg>
  )
}

/**
 * 11. MA KẾT (CAPRICORN)
 */
export function CapricornSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="capri-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#capri-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Sừng dê núi uốn cong */}
      <path
        d="M102 102 C96 72 114 48 144 50 C162 53 170 67 163 82 C156 91 142 94 139 103"
        stroke="var(--zodiac-primary)"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M90 106 C90 94 114 94 114 106 C114 126 106 144 96 154 C89 144 90 126 90 106 Z"
        fill="var(--zodiac-bg)"
        stroke="var(--zodiac-primary)"
        strokeWidth="3.5"
      />
      <path
        d="M110 142 C138 142 162 156 156 178 C150 194 130 192 137 178 C142 168 162 170 174 162"
        stroke="var(--zodiac-primary)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="175,161 185,151 187,170" fill="#f59e0b" />
      <circle cx="102" cy="113" r="3" fill="var(--zodiac-primary-dark)" />
    </svg>
  )
}

/**
 * 12. BẢO BÌNH (AQUARIUS)
 */
export function AquariusSvg({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-svg-art ${className}`} {...props}>
      <defs>
        <radialGradient id="aqua-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="120" cy="120" r="110" fill="url(#aqua-aura-2)" />
      <circle cx="120" cy="120" r="98" stroke="var(--zodiac-primary)" strokeWidth="1.2" strokeDasharray="4 6" strokeOpacity="0.38" className="zodiac-orbit-spin" />
      {/* Bình gốm rót sao */}
      <g transform="rotate(-35 108 90)">
        <ellipse cx="108" cy="84" rx="19" ry="26" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3.5" />
        <path d="M96 60 H120" stroke="var(--zodiac-primary)" strokeWidth="5" strokeLinecap="round" />
        <path d="M89 78 C77 78 77 94 89 94" stroke="var(--zodiac-primary)" strokeWidth="3.5" fill="none" />
      </g>
      {/* Sóng nước sao */}
      <path d="M72 138 Q90 126 108 138 T144 138 T180 138" stroke="var(--zodiac-primary)" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M72 162 Q90 150 108 162 T144 162 T180 162" stroke="#06b6d4" strokeWidth="5" strokeLinecap="round" fill="none" />
      <polygon points="126,106 128,111 133,112 129,116 131,121 126,118 121,121 123,116 119,112 124,111" fill="#f59e0b" />
      <circle cx="102" cy="118" r="3" fill="#fff" />
    </svg>
  )
}

/**
 * NHÂN VẬT THIÊN THẦN SAO (STAR GIRL)
 * Tái hiện 100% hình ảnh trong ảnh tham khảo: Cô gái anime pastel tóc tím/lavender,
 * ôm ngôi sao vàng phát sáng, ngồi trên sóng mây thiên hà huyền diệu.
 */
export function StarGirlIllustration({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`zodiac-stargirl-svg ${className}`}
      {...props}
    >
      <defs>
        <radialGradient id="girl-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--zodiac-primary)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--zodiac-tint)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="hair-lavender" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--zodiac-primary)" />
          <stop offset="60%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <linearGradient id="star-glow-radiant" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="star-burst" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Vầng hào quang mộng mơ */}
      <circle cx="100" cy="100" r="92" fill="url(#girl-halo)" />

      {/* Sóng nước & mây thiên hà nâng đỡ */}
      <path
        d="M30 162 C50 150 75 168 100 156 C125 144 150 162 170 152 C182 168 150 185 100 181 C50 177 25 172 30 162 Z"
        fill="var(--zodiac-tint)"
        opacity="0.85"
      />
      <path
        d="M42 172 C67 162 92 177 117 167 C142 157 161 172 174 165"
        stroke="var(--zodiac-primary)"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Mái tóc dài xoăn bồng bềnh buông hai bên */}
      <path
        d="M56 100 C44 118 48 150 62 162 C56 144 62 118 68 106 Z"
        fill="url(#hair-lavender)"
        opacity="0.95"
      />
      <path
        d="M144 100 C156 118 152 150 138 162 C144 144 138 118 132 106 Z"
        fill="url(#hair-lavender)"
        opacity="0.95"
      />

      {/* Trang phục váy trắng tinh khôi */}
      <path
        d="M81 118 C81 106 119 106 119 118 C122 144 112 156 100 156 C88 156 78 144 81 118 Z"
        fill="#ffffff"
        stroke="var(--zodiac-border)"
        strokeWidth="1.2"
      />

      {/* Gương mặt anime xinh xắn */}
      <ellipse cx="100" cy="81" rx="22" ry="20" fill="#fff1f2" />

      {/* Tóc mái & búi tóc bồng bềnh */}
      <path
        d="M75 77 C75 52 125 52 125 77 C125 65 100 57 75 77 Z"
        fill="url(#hair-lavender)"
      />
      <path
        d="M80 72 C90 80 98 80 100 72 C105 81 115 80 120 72 C118 62 85 62 80 72 Z"
        fill="url(#hair-lavender)"
      />

      {/* Đôi mắt khép hờ an yên và lông mi mềm */}
      <path d="M90 82 Q94 86 98 82" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M102 82 Q106 86 110 82" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Má hồng hào dễ thương */}
      <circle cx="87" cy="87" r="3.2" fill="#fca5a5" opacity="0.65" />
      <circle cx="113" cy="87" r="3.2" fill="#fca5a5" opacity="0.65" />

      {/* NGÔI SAO VÀNG DẠ QUANG TO TỎA SÁNG ĐƯỢC CÔ GÁI ÔM TRƯỚC NGỰC */}
      <g className="zodiac-star-glow-anim">
        <polygon
          points="100,97 108,114 125,117 111,129 115,147 100,137 85,147 89,129 75,117 92,114"
          fill="url(#star-glow-radiant)"
          filter="url(#star-burst)"
        />
        {/* Đôi bàn tay ôm sao */}
        <circle cx="90" cy="125" r="4.5" fill="#fff1f2" />
        <circle cx="110" cy="125" r="4.5" fill="#fff1f2" />
      </g>

      {/* Các hạt sao lấp lánh xung quanh */}
      <circle cx="40" cy="56" r="2.2" fill="#f59e0b" />
      <circle cx="160" cy="50" r="2.6" fill="#ffffff" />
      <circle cx="35" cy="122" r="1.8" fill="#ffffff" />
      <circle cx="168" cy="115" r="2.2" fill="#f59e0b" />
    </svg>
  )
}

/**
 * HÌNH MINH HỌA NỘI DUNG 2: ĐIỂM MẠNH
 */
export function StrengthsIllustration({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-stargirl-svg ${className}`} {...props}>
      <defs>
        <radialGradient id="str-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#str-aura-2)" />
      <polygon points="100,30 170,100 100,170 30,100" stroke="var(--zodiac-primary)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.45" />
      <path d="M100 50 C88 81 63 94 50 106 C69 119 88 106 100 150 C112 106 131 119 150 106 C137 94 112 81 100 50 Z" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <polygon points="100,85 104,95 114,97 106,105 109,115 100,109 91,115 94,105 86,97 96,95" fill="#f59e0b" />
    </svg>
  )
}

/**
 * HÌNH MINH HỌA NỘI DUNG 3: ĐIỂM CÂN BẰNG
 */
export function BalanceIllustration({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-stargirl-svg ${className}`} {...props}>
      <defs>
        <radialGradient id="bal-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--zodiac-primary)" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-tint)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#bal-aura-2)" />
      <path d="M60 50 C94 37 144 56 153 100 C160 138 131 165 100 169 C131 156 140 119 122 88 C106 60 75 52 60 50 Z" fill="var(--zodiac-primary)" opacity="0.45" />
      <ellipse cx="100" cy="150" rx="45" ry="17" fill="var(--zodiac-bg)" stroke="var(--zodiac-primary)" strokeWidth="3.5" />
      <ellipse cx="100" cy="125" rx="32" ry="14" fill="var(--zodiac-tint)" stroke="var(--zodiac-primary)" strokeWidth="3.5" />
      <ellipse cx="100" cy="102" rx="20" ry="10" fill="#ffffff" stroke="var(--zodiac-primary)" strokeWidth="3" />
      <polygon points="100,72 102,80 110,81 104,86 106,94 100,90 94,94 96,86 90,81 98,80" fill="#f59e0b" />
    </svg>
  )
}

/**
 * HÌNH MINH HỌA NỘI DUNG 4: LỜI KHUYÊN
 */
export function AdviceIllustration({ className = '', ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`zodiac-stargirl-svg ${className}`} {...props}>
      <defs>
        <radialGradient id="adv-aura-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="65%" stopColor="var(--zodiac-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#adv-aura-2)" />
      <circle cx="100" cy="100" r="60" stroke="var(--zodiac-primary)" strokeWidth="1.8" strokeDasharray="4 4" opacity="0.55" />
      <path d="M62 175 C81 138 119 144 100 100" stroke="var(--zodiac-primary)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="5 5" fill="none" />
      <polygon points="100,45 107,72 135,80 111,95 117,122 100,105 83,122 89,95 65,80 93,72" fill="#f59e0b" filter="drop-shadow(0 0 10px rgba(245, 158, 11, 0.7))" />
      <circle cx="100" cy="84" r="5" fill="#ffffff" />
    </svg>
  )
}

/**
 * Bộ điều phối Illustration chính xác theo từng SignId
 */
export function ZodiacIllustration({ signId, size, className = '', ...props }: ZodiacIllustrationProps) {
  const style = size ? { width: size, height: size } : undefined

  switch (signId) {
    case 'song-ngu':
      return <PiscesSvg className={className} style={style} {...props} />
    case 'bach-duong':
      return <AriesSvg className={className} style={style} {...props} />
    case 'kim-nguu':
      return <TaurusSvg className={className} style={style} {...props} />
    case 'song-tu':
      return <GeminiSvg className={className} style={style} {...props} />
    case 'cu-giai':
      return <CancerSvg className={className} style={style} {...props} />
    case 'su-tu':
      return <LeoSvg className={className} style={style} {...props} />
    case 'xu-nu':
      return <VirgoSvg className={className} style={style} {...props} />
    case 'thien-binh':
      return <LibraSvg className={className} style={style} {...props} />
    case 'bo-cap':
      return <ScorpioSvg className={className} style={style} {...props} />
    case 'nhan-ma':
      return <SagittariusSvg className={className} style={style} {...props} />
    case 'ma-ket':
      return <CapricornSvg className={className} style={style} {...props} />
    case 'bao-binh':
      return <AquariusSvg className={className} style={style} {...props} />
    default:
      return <PiscesSvg className={className} style={style} {...props} />
  }
}
