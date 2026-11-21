# Finora Frontend (React + TypeScript + Vite)

Frontend React kết nối backend Spring Boot trong thư mục `../backend`.

## Chạy dự án

Tạo file `.env` cạnh `package.json`:

```env
VITE_API_URL=http://localhost:8080
```

Sau khi backend đã chạy, thực hiện:

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Các chức năng giao diện

- Tổng quan, giao dịch, ví tiền, danh mục, ngân sách, mục tiêu tiết kiệm, báo cáo.
- Quét ảnh hoá đơn bằng Gemini (backend cần `GEMINI_API_KEY`).
- Trợ lý tài chính phân tích số liệu từ SQL Server theo tài khoản.
- 15 chủ đề sáng/tối, tuỳ chọn ẩn số dư và ngôn ngữ Việt/Anh/Hàn/Nhật/Trung.
- Hồ sơ cá nhân: tên, email, ảnh đại diện, ngày sinh và cung hoàng đạo.
- Khoảnh khắc: tải/chụp ảnh, chú thích và lịch tháng.

## Kết nối backend

Các request dùng `src/services/api.ts`; JWT được gắn tự động trong header `Authorization`. Đăng ký/đăng nhập nhận token từ `/api/xac-thuc`. Dữ liệu tài chính được tải/lưu qua `/api/du-lieu`; hồ sơ và khoảnh khắc cũng được lưu trên máy chủ.

Xem `../backend/README.md` để tạo database SQL Server và chạy API. Không đặt Gemini API key hoặc JWT secret trong frontend.
