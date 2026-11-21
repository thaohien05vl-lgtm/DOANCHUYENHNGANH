# Finora — Ghi chú bản nâng cấp

## 1. Lỗi đăng nhập Google/Facebook trên điện thoại — nguyên nhân & cách sửa
**Nguyên nhân:** trên máy tính, SDK web (popup) chạy ở `http://localhost` nên được chấp nhận. Trong app Android (WebView) Google chặn OAuth
(`disallowed_useragent`) và popup không hoạt động; mở bằng Chrome qua `http://192.168.x.x` cũng bị từ chối vì chỉ cho phép HTTPS/localhost.

**Đã sửa:** app Android dùng SDK **gốc** (`@capgo/capacitor-social-login`): Google Credential Manager + Facebook SDK. Web vẫn dùng popup, nhưng báo lỗi
rõ ràng thay vì im lặng. Backend nay kiểm tra token có đúng ứng dụng của bạn (audience / app id) và email Google đã xác minh.

### Việc bạn cần cấu hình (code không làm thay được)
**Google**
1. Google Cloud Console → Credentials → *Create credentials → OAuth client ID → Android*: package `com.finora.app` + SHA-1 của keystore dùng build APK.
   - SHA-1 debug: `cd frontend/android && ./gradlew signingReport` (hoặc `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android`).
2. Giữ client **Web** hiện có làm `VITE_GOOGLE_CLIENT_ID` (frontend/.env) và `GOOGLE_CLIENT_IDS` (backend/.env).

**Facebook**
1. Meta for Developers → App settings → Advanced → lấy **Client token** → `VITE_FACEBOOK_CLIENT_TOKEN` (frontend/.env) và thay `THAY_BANG_CLIENT_TOKEN` trong `android/app/src/main/res/values/strings.xml`.
2. Settings → Basic → thêm nền tảng **Android**: Package `com.finora.app`, Class `com.finora.app.MainActivity`, **Key hashes** (từ keystore).
3. (Khuyến nghị) điền `FACEBOOK_APP_SECRET` trong backend/.env để backend xác minh token qua `debug_token`.
4. App ở chế độ Development: chỉ tài khoản Admin/Developer/Tester của app đăng nhập được.

### Build lại app
```
cd frontend
npm install
npm run android        # build web + cap sync android
npx cap open android   # build/chạy trong Android Studio
```
Địa chỉ backend có thể đổi ngay trong app: màn hình Đăng nhập → **Máy chủ kết nối** (không cần build lại khi IP máy tính đổi).

## 2. Hiệu ứng mở app & hộp thoại thoát
- Màn hình khởi động động (logo + vòng vẽ + thanh chạy), chỉ dùng transform/opacity nên mượt; màu nền theo chủ đề đang chọn, không nháy sáng/tối.
- Nút Back của Android: đóng modal đang mở → quay lại trang trước → ở trang gốc hiện hộp **"Thoát ứng dụng?"** mang nền + họa tiết + màu của chủ đề đang chọn, bo tròn.
- Icon launcher và splash gốc Android đã thay bằng logo Finora.

## 3. Đa ngôn ngữ (vi · en · ja · zh · ko)
- Mọi chuỗi trong app (hơn 1.000) dùng `t('chuỗi tiếng Việt')`; bản dịch ở `src/i18n/ban-dich/`.
- Đổi ngôn ngữ → hiện hộp nhắc **khởi động lại**; ngôn ngữ áp dụng sau khi khởi động lại.
- Dịch cả tên danh mục/ví mặc định, thông báo lỗi từ backend, ngày/tháng/số theo từng ngôn ngữ.
- Thêm chuỗi mới: bọc `t('...')`, thêm vào `src/i18n/ban-dich/*.ts`, rồi chạy `npm run kiem-tra-dich` (báo thiếu bản dịch, mã thoát 1).
- Giữ nguyên tiếng Việt có chủ đích: nhận diện giọng nói (bộ phân tích số tiền theo tiếng Việt), tên người dùng/danh mục tự tạo.

## 4. Rà soát & sửa lỗi
- **Lộ khóa:** `backend/.env.example` từng chứa Gemini API key thật → đã xóa khỏi file mẫu. **Hãy thu hồi khóa cũ** và tạo khóa mới.
- CORS: bỏ `*` đi kèm `allowCredentials`; cho phép localhost, Capacitor và mạng LAN.
- Backend: xác minh audience token Google/Facebook (trước đây token từ app khác vẫn được nhận).
- Font Be Vietnam Pro đóng gói sẵn trong app (không phụ thuộc Google Fonts → chạy offline, nhanh hơn).
- Dọn file thừa: `structure.txt`, `test-req.json`, `node_modules` build từ Windows (~260 MB), cache Gradle/IDE. `.gitignore` bổ sung `.env`.
- Chưa chạy được `mvn test` trong môi trường làm việc (không có Maven) — hãy chạy `mvn test` trên máy bạn.
