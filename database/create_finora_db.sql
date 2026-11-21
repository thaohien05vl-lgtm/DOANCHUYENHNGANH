IF DB_ID(N'FinoraDb') IS NULL
BEGIN
    CREATE DATABASE FinoraDb;
END;
GO

-- Các bảng nghiệp vụ sẽ được Spring Data JPA tạo/cập nhật tự động
-- khi backend khởi động (spring.jpa.hibernate.ddl-auto=update).
