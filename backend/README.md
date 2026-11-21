# Finora Backend

Backend REST API cho frontend React + TypeScript trong thư mục `../frontend`.

## Công nghệ

- Java 21
- Spring Boot 3.5.16
- Spring Web, Spring Security, Spring Data JPA, Validation
- Microsoft SQL Server JDBC 13.6.1
- JWT (Bearer token) và BCrypt
- Gemini API tuỳ chọn cho chức năng đọc ảnh hoá đơn

## 1. Chuẩn bị SQL Server

1. Mở SQL Server Configuration Manager.
2. Bật TCP/IP cho đúng instance SQL Server đang chạy.
3. Đặt TCP Port cố định (ví dụ `1433`) trong phần IPAll, sau đó restart SQL Server.
4. Dùng SQL Server Management Studio chạy `../database/create_finora_db.sql`.
5. Bật chế độ **SQL Server and Windows Authentication mode (Mixed Mode)** nếu muốn đăng nhập bằng tài khoản SQL.
6. Tạo một login dành riêng cho Finora trong SSMS (ví dụ script bên dưới), rồi dùng chính username/password đó trong `.env`.

Ví dụ chạy trong SSMS sau khi đã tạo database:

```sql
USE [master];
CREATE LOGIN [finora_app] WITH PASSWORD = N'ThayBangMatKhauManh_Rieng_2026!';
GO
USE [FinoraDb];
CREATE USER [finora_app] FOR LOGIN [finora_app];
-- Quyền phát triển local: cần để Hibernate ddl-auto=update tạo/cập nhật bảng.
ALTER ROLE [db_owner] ADD MEMBER [finora_app];
GO
```

Hãy thay mật khẩu mẫu trước khi chạy. `db_owner` chỉ là quyền tiện dụng cho môi trường phát triển local; khi triển khai thật nên tạo schema bằng migration và cấp quyền tối thiểu.

URL mặc định của dự án:

```text
jdbc:sqlserver://localhost:1433;databaseName=FinoraDb;encrypt=true;trustServerCertificate=true
```

Nếu SQL Server trên máy khác, thay `localhost` bằng hostname/IP. Nếu instance dùng port khác, sửa port. Ví dụ máy tính có tên `LAPTOP-XXXX` và TCP port `1433` thì dùng `jdbc:sqlserver://LAPTOP-XXXX:1433;databaseName=FinoraDb;encrypt=true;trustServerCertificate=true`. Backend dùng SQL Server Authentication; không tự đoán mật khẩu SQL Server của máy bạn.

## 2. Cấu hình backend

1. Cài JDK 21 và Apache Maven 3.9+.
2. Copy `.env.example` thành `.env`.
3. Điền `DB_USERNAME` và `DB_PASSWORD` bằng tài khoản SQL Server của bạn.
4. Đổi `JWT_SECRET` thành chuỗi riêng tối thiểu 32 ký tự.
5. (Tuỳ chọn) Điền `GEMINI_API_KEY` nếu muốn quét hoá đơn bằng Gemini.
   - Key phải đặt trong **`backend/.env`**, ở dòng `GEMINI_API_KEY=...`; không đặt trong `frontend/.env`.
   - Giữ `GEMINI_MODEL=gemini-3.8-flash` nếu model này được bật cho API key của bạn.
   - Sau khi sửa `.env`, phải dừng và chạy lại Backend để Spring Boot đọc giá trị mới.
6. Chạy `run-local.bat` trên Windows hoặc `mvn spring-boot:run` trong thư mục `backend`.

Khi khởi động lần đầu, Hibernate tự tạo các bảng còn thiếu trong `FinoraDb`. Không bật `ddl-auto=create` vì sẽ xoá bảng khi khởi tạo lại.

Kiểm tra backend: `http://localhost:8080/actuator/health`.

## 3. Chạy frontend

Trong thư mục `frontend`, tạo `.env` với nội dung:

```env
VITE_API_URL=http://localhost:8080
```

Sau đó chạy:

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal (thường là `http://localhost:5173`). Backend cho phép CORS origin này theo mặc định.

## 4. API chính

Tất cả endpoint dưới đây trừ đăng ký/đăng nhập và health check đều cần header `Authorization: Bearer <token>`.

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/api/xac-thuc/dang-ky` | Tạo tài khoản, dữ liệu mặc định và JWT |
| POST | `/api/xac-thuc/dang-nhap` | Đăng nhập và nhận JWT |
| GET | `/api/nguoi-dung/ho-so` | Lấy hồ sơ tài khoản hiện tại |
| PUT | `/api/nguoi-dung/ho-so` | Cập nhật tên, email, ngày sinh, ảnh đại diện |
| GET | `/api/du-lieu` | Lấy ví, danh mục, giao dịch, ngân sách, mục tiêu |
| PUT | `/api/du-lieu` | Lưu snapshot dữ liệu nghiệp vụ của tài khoản hiện tại |
| GET | `/api/khoanh-khac` | Lấy khoảnh khắc của tài khoản |
| POST | `/api/khoanh-khac` | Thêm ảnh/chú thích/ngày vào lịch |
| DELETE | `/api/khoanh-khac/{id}` | Xoá khoảnh khắc của chính tài khoản |
| POST | `/api/tro-ly/hoi` | Phân tích câu hỏi từ số liệu đã lưu trong SQL Server |
| POST | `/api/hoa-don/phan-tich` | Multipart `file`, gửi ảnh đến Gemini để đọc hoá đơn |

### JSON đăng ký

```json
{
  "ten": "Nguyen Van A",
  "email": "a@example.com",
  "matKhau": "matkhau123"
}
```

Đăng nhập dùng `{ "email": "...", "matKhau": "..." }`. Hai endpoint trả `{ "token": "...", "nguoiDung": { "ten": "...", "email": "...", "anhDaiDien": null, "ngaySinh": "" } }`.

## 5. Lưu ý nghiệp vụ và bảo mật

- Mỗi bản ghi nghiệp vụ gắn với `user_id` lấy từ JWT; frontend không thể chọn user ID để đọc/ghi dữ liệu người khác.
- Mật khẩu chỉ lưu dạng BCrypt hash, không lưu mật khẩu gốc.
- Các ảnh avatar/khoảnh khắc được lưu dạng Data URL trong cột `nvarchar(max)` của SQL Server. Với triển khai nhiều người dùng/ảnh lớn, nên chuyển ảnh sang object storage và lưu URL trong DB.
- `/api/du-lieu` là API thay thế snapshot theo một transaction. Frontend đã gửi snapshot sau mỗi thay đổi và tuần tự hoá request để tránh ghi đè request mới.
- Trợ lý tài chính hiện dùng các quy tắc phân tích số liệu từ SQL Server (chi tiêu tháng, ngân sách, mục tiêu), chưa phải chatbot sinh ngôn ngữ Gemini.
- Quét hoá đơn dùng Gemini thật khi có `GEMINI_API_KEY`; nếu chưa cấu hình, backend trả lỗi 503 rõ ràng, không trả dữ liệu mẫu giả.
- Nếu quét hoá đơn thất bại, giao diện hiển thị thông báo lỗi backend thay vì chỉ báo chung. Hãy xem Terminal Backend để biết thêm mã lỗi Gemini. Các lỗi thường gặp: 401/403 (API key hoặc quyền API), 404 (tên model), 429 (hạn mức), 400 (ảnh/yêu cầu không hợp lệ).
- Trường `dinhKy` của giao dịch được lưu/đọc như cấu hình lặp. Backend hiện chưa tự sinh giao dịch mới theo lịch định kỳ; cần bổ sung scheduler/idempotency nếu muốn tự động tạo giao dịch theo ngày/tuần/tháng.
- Các bản ghi `qlct-du-lieu-v1` cũ trong `localStorage` không tự động chuyển sang SQL Server. Hãy sao lưu dữ liệu cũ trước khi đăng nhập vào bản full-stack mới; chưa có chức năng nhập dữ liệu cũ tự động.
- Đăng nhập Google/Facebook và khôi phục mật khẩu chưa được nối vì frontend hiện chưa có luồng OAuth/email backend hoàn chỉnh.
- Mã hiện tại là cấu hình phát triển local. Trước khi triển khai Internet cần dùng HTTPS, secret riêng, backup database, giới hạn tốc độ, kiểm tra bảo mật và object storage cho ảnh.
