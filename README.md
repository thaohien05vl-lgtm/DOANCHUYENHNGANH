# Finora Full-stack

- `frontend/`: React + TypeScript + Vite (đã nối API backend).
- `backend/`: Java 21 + Spring Boot + Spring Security + JWT + Spring Data JPA.
- `database/create_finora_db.sql`: tạo database SQL Server `FinoraDb`; bảng được Hibernate tạo/cập nhật ở lần chạy đầu.

## Chạy lần đầu trên Windows

1. Cài JDK 21, Maven 3.9+ và SQL Server.
2. Mở SSMS, chạy `database/create_finora_db.sql`. Bật TCP/IP, đặt TCP Port cho instance SQL Server (ví dụ `1433`) và restart dịch vụ.
3. Tạo SQL login riêng cho ứng dụng (xem mẫu trong `backend/README.md`).
4. Sao chép `backend/.env.example` thành `backend/.env`, thay `DB_USERNAME`, `DB_PASSWORD`, `DB_URL` nếu cần và thay `JWT_SECRET` bằng chuỗi bí mật riêng.
5. Chạy `backend/run-local.bat`. Khi thấy Spring Boot started, mở `http://localhost:8080/actuator/health`.
6. Trong `frontend`, tạo `.env` với `VITE_API_URL=http://localhost:8080`; chạy `npm install` rồi `npm run dev`.

Đọc `backend/README.md` để xem cấu hình SQL Server, tài khoản DB, Gemini API key, API endpoints và các phạm vi chưa triển khai. Không đưa file `.env` hoặc secret lên Git. Dữ liệu localStorage từ bản demo không được tự động chuyển sang database.
