import { type GlyphProps, resolveGlyphSize } from './types'

/**
 * Chi tiêu (EXPENSE) - Finora Finance Glyph System
 * - Minh họa: Tờ hóa đơn thanh toán (Receipt/Bill) với mép răng cưa chân thực,
 *   kết hợp đồng xu vàng chi trả nổi 3D và mũi tên động thể hiện dòng tiền chi ra.
 * - Hỗ trợ hiển thị dấu ấn danh mục (Ăn uống, Mua sắm, Di chuyển, Hóa đơn...) nếu có.
 * - Tuyệt đối không sử dụng hình chiếc ví hay thẻ bo góc đơn điệu.
 */
export function ChiTieu({ size = 'md', className = '', style, animated = true, category }: GlyphProps) {
  const px = resolveGlyphSize(size, 42)
  const cat = (category || '').toLowerCase()

  // Nhận diện nhóm danh mục phổ biến để khắc họa dấu ấn phụ (nếu có dữ liệu)
  const isAnUong = cat.includes('ăn') || cat.includes('uống') || cat.includes('ẩm thực') || cat.includes('food') || cat.includes('cafe') || cat.includes('nhà hàng')
  const isMuaSam = cat.includes('mua') || cat.includes('sắm') || cat.includes('shop') || cat.includes('siêu thị') || cat.includes('quần áo')
  const isDiChuyen = cat.includes('xe') || cat.includes('xăng') || cat.includes('di chuyển') || cat.includes('grab') || cat.includes('taxi')
  const isHoaDon = cat.includes('điện') || cat.includes('nước') || cat.includes('mạng') || cat.includes('internet') || cat.includes('sinh hoạt')

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`finora-glyph finora-glyph--expense ${animated ? 'finora-glyph--animated' : ''} ${className}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <defs>
        {/* Đổ bóng 3D dịu cho tờ hóa đơn */}
        <filter id="glyph-exp-bill-shadow" x="4" y="4" width="30" height="40" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.2" floodColor="#64748b" floodOpacity="0.22" />
        </filter>

        {/* Gradient nền giấy hóa đơn: Trắng sáng sang ngọc trai nhẹ */}
        <linearGradient id="glyph-exp-paper" x1="8" y1="6" x2="28" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.75" stopColor="#f8fafc" />
          <stop offset="1" stopColor="#f1f5f9" />
        </linearGradient>

        {/* Gradient nếp gấp góc trên tờ hóa đơn */}
        <linearGradient id="glyph-exp-paper-fold" x1="22" y1="6" x2="27" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Đổ bóng cho đồng xu 3D */}
        <filter id="glyph-exp-coin-glow" x="24" y="15" width="22" height="22" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" floodColor="#d97706" floodOpacity="0.38" />
        </filter>

        {/* Gradient kim loại đồng xu vàng */}
        <linearGradient id="glyph-exp-coin-gold" x1="27" y1="18" x2="43" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fef08a" />
          <stop offset="0.45" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>

        {/* Gradient mũi tên chi tiền ra */}
        <linearGradient id="glyph-exp-arrow-grad" x1="25" y1="20" x2="43" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--san-ho, #f43f5e)" />
          <stop offset="1" stopColor="#e11d48" />
        </linearGradient>
      </defs>

      {/* 1. TỜ HÓA ĐƠN THANH TOÁN (RECEIPT / BILL) VỚI MÉP RĂNG CƯA ĐẶC TRƯNG */}
      <g filter="url(#glyph-exp-bill-shadow)">
        <path
          d="M9 8C9 6.89543 9.89543 6 11 6H22L27 11V37.5L24.5 36L22 37.5L19.5 36L17 37.5L14.5 36L12 37.5L9.5 36L9 36.3V8Z"
          fill="url(#glyph-exp-paper)"
          stroke="#e2e8f0"
          strokeWidth="0.8"
        />
        {/* Nếp gấp góc trên tờ hóa đơn */}
        <path
          d="M22 6V10C22 10.5523 22.4477 11 23 11H27L22 6Z"
          fill="url(#glyph-exp-paper-fold)"
        />
      </g>

      {/* 2. DÒNG NỘI DUNG VÀ CHI TIẾT TRÊN HÓA ĐƠN */}
      {/* Tiêu đề hóa đơn */}
      <rect x="12" y="11" width="7" height="1.8" rx="0.9" fill="#94a3b8" />

      {/* Các dòng mục chi tiêu */}
      <rect x="12" y="15" width="11" height="1.4" rx="0.7" fill="#cbd5e1" />
      <rect x="12" y="18.5" width="9" height="1.4" rx="0.7" fill="#cbd5e1" />
      <rect x="12" y="22" width="12" height="1.4" rx="0.7" fill="#cbd5e1" />

      {/* Đường phân cách nét đứt chuẩn hóa đơn */}
      <line x1="12" y1="25.5" x2="24" y2="25.5" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

      {/* Dòng tổng tiền hóa đơn (nhấn màu san hô thanh thoát) */}
      <rect x="12" y="28" width="11" height="2" rx="1" fill="var(--san-ho, #f43f5e)" fillOpacity="0.8" />

      {/* Dấu ấn danh mục phụ (nếu có) tạo chiều sâu trực quan */}
      {isAnUong && (
        <g opacity="0.45" stroke="#f43f5e" strokeWidth="1" strokeLinecap="round">
          <path d="M19 11V14M18 11V12.5M20 11V12.5" />
        </g>
      )}
      {isMuaSam && (
        <path d="M18.5 11.5H20.5V13.5H18.5Z" stroke="#f43f5e" strokeWidth="0.8" opacity="0.45" fill="none" />
      )}
      {isDiChuyen && (
        <circle cx="19.5" cy="12.5" r="1.5" stroke="#f43f5e" strokeWidth="0.8" opacity="0.45" fill="none" />
      )}
      {isHoaDon && (
        <path d="M19.5 11L18.5 13H20.5L19.5 15" stroke="#f43f5e" strokeWidth="0.8" opacity="0.45" fill="none" />
      )}

      {/* 3. MŨI TÊN CHI TIỀN RA (DÒNG TIỀN BAY RA NGOÀI) */}
      <g className="finora-glyph__arrow-out">
        {/* Quỹ đạo cong biểu diễn luồng tiền xuất quỹ */}
        <path
          d="M26 31C30 30 35 26 37 18"
          stroke="url(#glyph-exp-arrow-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="3 2"
        />
        {/* Đầu mũi tên hướng ra ngoài góc trên bên phải */}
        <path
          d="M33 16L38 16L38 21"
          stroke="url(#glyph-exp-arrow-grad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* 4. ĐỒNG XU CHI TIÊU NỔI 3D (GOLDEN COIN CÓ DẤU TRỪ CHI TRẢ) */}
      <g filter="url(#glyph-exp-coin-glow)" className="finora-glyph__coin-float">
        <circle cx="34" cy="26" r="7.5" fill="url(#glyph-exp-coin-gold)" />
        {/* Viền nổi ánh kim */}
        <circle cx="34" cy="26" r="5.8" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="1" />
        {/* Dấu trừ chi trả thanh mảnh nổi bật trên đồng xu */}
        <path
          d="M31 26H37"
          stroke="#78350f"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>

      {/* 5. CÁC NGÔI SAO TÀI CHÍNH LẤP LÁNH TẠO CHIỀU SÂU THẨM MỸ */}
      {/* Sao lấp lánh góc trên bên trái */}
      <path
        d="M6 13L6.8 14.8L8.6 15.6L6.8 16.4L6 18.2L5.2 16.4L3.4 15.6L5.2 14.8L6 13Z"
        fill="#f59e0b"
        opacity="0.85"
      />
      {/* Sao lấp lánh nhỏ góc dưới bên phải */}
      <path
        d="M41 33L41.6 34.4L43 35L41.6 35.6L41 37L40.4 35.6L39 35L40.4 34.4L41 33Z"
        fill="var(--san-ho, #f43f5e)"
        opacity="0.8"
      />
    </svg>
  )
}

export { ChiTieu as ExpenseGlyph }
