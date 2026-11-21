# Ghi chú cập nhật Finora Frontend

## Đã bổ sung

1. Hệ thống 15 chủ đề màu gồm 8 chủ đề sáng và 7 chủ đề tối; lựa chọn được lưu trên trình duyệt.
2. Chế độ riêng tư có thể bật/tắt ở phần số dư trang Tổng quan hoặc trong Cài đặt. Các số liệu có class `.so` và biểu đồ được làm mờ khi bật.
3. Hồ sơ cá nhân: ảnh đại diện (nén trước khi lưu), tên, email, ngày sinh và cung hoàng đạo tự tính. Hồ sơ được lưu theo email để không mất khi đăng xuất/đăng nhập lại trên cùng trình duyệt.
4. Khoảnh khắc: chọn/chụp ảnh, chú thích, ngày lưu, lịch tháng và danh sách ảnh theo ngày. Có thể xoá ảnh đã lưu.
5. Bộ chọn ngôn ngữ Việt/Anh/Hàn/Nhật/Trung. Menu, điều hướng và tiêu đề trang đã có bản dịch; một số nội dung nghiệp vụ sâu trong các màn hiện có vẫn là tiếng Việt.
6. Cập nhật nhận diện Finora bằng biểu trưng SVG tự vẽ và favicon cùng phong cách.
7. Giữ lại các trang và luồng nghiệp vụ thu chi, ví, danh mục, ngân sách, mục tiêu, báo cáo, hoá đơn AI và trợ lý AI.

## Chạy dự án

```bash
npm install
npm run dev
```

## Lưu ý dữ liệu

Bản frontend hiện tại đang dùng `localStorage`. Ảnh đại diện và khoảnh khắc chỉ lưu trên trình duyệt hiện tại, chưa upload lên backend. Để đồng bộ nhiều thiết bị cần bổ sung API lưu hồ sơ/ảnh/khoảnh khắc ở Spring Boot.

Ảnh được nén về JPEG trước khi lưu, nhưng `localStorage` vẫn có giới hạn dung lượng. Khi bộ nhớ trình duyệt đầy, trang Khoảnh khắc sẽ báo lỗi thay vì âm thầm bỏ ảnh.

## Kiểm tra

- Đã kiểm tra cú pháp TS/TSX, cú pháp CSS và các import tương đối nội bộ.
- Chưa xác nhận được `npm run build`: cài dependency (`npm ci`) không hoàn tất trong môi trường đóng gói do thiếu kết nối/tarball npm. Sau khi tải ZIP, chạy `npm install` rồi `npm run build` trên máy có kết nối npm để kiểm tra đầy đủ.
