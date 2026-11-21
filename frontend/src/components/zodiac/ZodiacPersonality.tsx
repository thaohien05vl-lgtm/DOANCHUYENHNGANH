import { t } from '../../utils/ngonNgu'
import type { ZodiacInfo } from './zodiacData'
import type { ZodiacTabId } from './ZodiacTabs'
import {
  AdviceIllustration,
  BalanceIllustration,
  StarGirlIllustration,
  StrengthsIllustration,
} from './ZodiacIllustration'

interface ZodiacPersonalityProps {
  cung: ZodiacInfo
  tab: ZodiacTabId
}

export function ZodiacPersonality({ cung, tab }: ZodiacPersonalityProps) {
  return (
    <div className="zodiac-noi-dung-khung" role="tabpanel">
      {/* ========================================================
          TAB 1: TÍNH CÁCH (Bám sát trực tiếp bố cục ảnh mẫu)
          ======================================================== */}
      {tab === 'tinh-cach' && (
        <div className="zodiac-tab-pane">
          {/* Thẻ chính lớn: Tính cách đặc trưng */}
          <div className="zodiac-the-chinh-lon">
            <div className="zodiac-the-chinh-hang">
              {/* Cột chữ bên trái */}
              <div className="zodiac-the-chinh-chu">
                <div className="zodiac-tieu-de-nhom">
                  <span className="zodiac-tieu-de-sao">★</span>
                  <h3 className="zodiac-tieu-de-chu">{cung.tinhCach.tieuDe}</h3>
                </div>
                <p className="zodiac-doan-chinh">{cung.tinhCach.noiDung}</p>
              </div>

              {/* Cột hình nhân vật Anime Star Girl bên phải */}
              <div className="zodiac-the-chinh-hinh">
                <StarGirlIllustration className="zodiac-anime-star-girl" />
              </div>
            </div>
          </div>

          {/* Thẻ tổng quan (Card mặt trăng tròn mềm mại) */}
          <div className="zodiac-the-tong-quan">
            <div className="zodiac-the-tong-quan-icon">
              <span>🌙</span>
            </div>
            <div className="zodiac-the-tong-quan-chu">
              <b className="zodiac-tong-quan-nhan">{t('Tổng quan')}</b>
              <p className="zodiac-tong-quan-doan">{cung.tinhCach.tongQuan}</p>
            </div>
          </div>

          {/* Thẻ thế giới nội tâm */}
          <div className="zodiac-the-noi-tam">
            <div className="zodiac-the-noi-tam-dau">
              <span className="zodiac-sao-spark">✦</span>
              <b>{t('Thế giới nội tâm & Cách nhìn nhận cuộc sống')}</b>
            </div>
            <p className="zodiac-noi-tam-doan">{cung.tinhCach.theGioiNoiTam}</p>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 2: ĐIỂM MẠNH
          ======================================================== */}
      {tab === 'diem-manh' && (
        <div className="zodiac-tab-pane">
          <div className="zodiac-the-chinh-lon">
            <div className="zodiac-the-chinh-hang">
              <div className="zodiac-the-chinh-chu">
                <div className="zodiac-tieu-de-nhom">
                  <span className="zodiac-tieu-de-sao tim">♡</span>
                  <h3 className="zodiac-tieu-de-chu">{cung.diemManh.tieuDe}</h3>
                </div>
                <p className="zodiac-doan-chinh">{cung.diemManh.moTaChiTiet}</p>
              </div>
              <div className="zodiac-the-chinh-hinh">
                <StrengthsIllustration className="zodiac-anime-star-girl" />
              </div>
            </div>
          </div>

          {/* Lưới các thẻ điểm mạnh */}
          <div className="zodiac-luoi-tinh-chat">
            {cung.diemManh.danhSach.map((dm, idx) => (
              <div key={idx} className="zodiac-the-tinh-chat">
                <div className="zodiac-tinh-chat-badge">
                  <span>0{idx + 1}</span>
                </div>
                <div className="zodiac-tinh-chat-noi-dung">
                  <b className="zodiac-tinh-chat-ten">{dm.tieuDe}</b>
                  <p className="zodiac-tinh-chat-mota">{dm.moTa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 3: ĐIỂM CẦN CÂN BẰNG (ĐIỂM YẾU)
          ======================================================== */}
      {tab === 'diem-yeu' && (
        <div className="zodiac-tab-pane">
          <div className="zodiac-the-chinh-lon">
            <div className="zodiac-the-chinh-hang">
              <div className="zodiac-the-chinh-chu">
                <div className="zodiac-tieu-de-nhom">
                  <span className="zodiac-tieu-de-sao vang">⚠</span>
                  <h3 className="zodiac-tieu-de-chu">{cung.diemCanCanBang.tieuDe}</h3>
                </div>
                <p className="zodiac-doan-chinh">{cung.diemCanCanBang.moTaChiTiet}</p>
              </div>
              <div className="zodiac-the-chinh-hinh">
                <BalanceIllustration className="zodiac-anime-star-girl" />
              </div>
            </div>
          </div>

          <div className="zodiac-luoi-tinh-chat">
            {cung.diemCanCanBang.danhSach.map((dy, idx) => (
              <div key={idx} className="zodiac-the-tinh-chat chu-y">
                <div className="zodiac-tinh-chat-badge vang">
                  <span>✦</span>
                </div>
                <div className="zodiac-tinh-chat-noi-dung">
                  <b className="zodiac-tinh-chat-ten">{dy.tieuDe}</b>
                  <p className="zodiac-tinh-chat-mota">{dy.moTa}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Lời nhắc chánh niệm */}
          <div className="zodiac-the-tong-quan loi-nhac">
            <div className="zodiac-the-tong-quan-icon">
              <span>🌿</span>
            </div>
            <div className="zodiac-the-tong-quan-chu">
              <b className="zodiac-tong-quan-nhan">{t('Lời nhắc cân bằng bản thân')}</b>
              <p className="zodiac-tong-quan-doan">{cung.diemCanCanBang.loiNhac}</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TAB 4: LỜI KHUYÊN & ĐỊNH HƯỚNG
          ======================================================== */}
      {tab === 'loi-khuyen' && (
        <div className="zodiac-tab-pane">
          <div className="zodiac-the-chinh-lon">
            <div className="zodiac-the-chinh-hang">
              <div className="zodiac-the-chinh-chu">
                <div className="zodiac-tieu-de-nhom">
                  <span className="zodiac-tieu-de-sao">💡</span>
                  <h3 className="zodiac-tieu-de-chu">{cung.loiKhuyen.tieuDe}</h3>
                </div>
                <p className="zodiac-doan-chinh">
                  {t('Những góc nhìn chiêm tinh hữu ích giúp bạn phát huy tối đa tiềm năng và giữ vững sự an yên trong tài chính cũng như đời sống cá nhân.')}
                </p>
              </div>
              <div className="zodiac-the-chinh-hinh">
                <AdviceIllustration className="zodiac-anime-star-girl" />
              </div>
            </div>
          </div>

          <div className="zodiac-the-khuyen-hop">
            <div className="zodiac-the-khuyen-muc">
              <div className="zodiac-khuyen-muc-dau">
                <span className="zodiac-khuyen-icon">❤️</span>
                <b>{t('Trong các mối quan hệ & Giao tiếp')}</b>
              </div>
              <p>{cung.loiKhuyen.trongMoiQuanHe}</p>
            </div>

            <div className="zodiac-the-khuyen-muc">
              <div className="zodiac-khuyen-muc-dau">
                <span className="zodiac-khuyen-icon">🌱</span>
                <b>{t('Phát triển bản thân & Kỷ luật chi tiêu Finora')}</b>
              </div>
              <p>{cung.loiKhuyen.phatTrienBanThan}</p>
            </div>

            {/* Thông điệp vũ trụ */}
            <div className="zodiac-thong-diep-hop">
              <span className="zodiac-thong-diep-sao">🌟</span>
              <p className="zodiac-thong-diep-chu">{cung.loiKhuyen.thongDiep}</p>
            </div>
          </div>
        </div>
      )}

      {/* Chú thích giải trí an toàn */}
      <div className="zodiac-chu-thich-chan">
        <small>
          {t('✦ Nội dung cung hoàng đạo mang tính chất tham khảo, truyền cảm hứng tích cực và tự khám phá bản thân.')}
        </small>
      </div>
    </div>
  )
}
