-- =========================================================================
-- FINORA DATABASE MIGRATION: BỔ SUNG KỲ THÁNG NĂM CHO NGÂN SÁCH (BUDGETS)
-- Tương thích Microsoft SQL Server - An toàn, Idempotent (chạy nhiều lần không lỗi)
-- =========================================================================

-- 1. Bổ sung cột ky_ngan_sach (định dạng YYYY-MM, ví dụ '2026-11')
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('budgets') AND name = 'ky_ngan_sach'
)
BEGIN
    ALTER TABLE budgets ADD ky_ngan_sach VARCHAR(7) NULL;
    PRINT 'Đã thêm cột ky_ngan_sach vào bảng budgets.';
END
ELSE
BEGIN
    PRINT 'Cột ky_ngan_sach đã tồn tại trong bảng budgets.';
END
GO

-- 2. Bổ sung cột thang (1 - 12)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('budgets') AND name = 'thang'
)
BEGIN
    ALTER TABLE budgets ADD thang INT NULL;
    PRINT 'Đã thêm cột thang vào bảng budgets.';
END
ELSE
BEGIN
    PRINT 'Cột thang đã tồn tại trong bảng budgets.';
END
GO

-- 3. Bổ sung cột nam (ví dụ 2026)
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('budgets') AND name = 'nam'
)
BEGIN
    ALTER TABLE budgets ADD nam INT NULL;
    PRINT 'Đã thêm cột nam vào bảng budgets.';
END
ELSE
BEGIN
    PRINT 'Cột nam đã tồn tại trong bảng budgets.';
END
GO

-- 4. Cập nhật dữ liệu cũ chưa có kỳ ngân sách thành kỳ của tháng hiện tại
UPDATE budgets
SET 
    ky_ngan_sach = FORMAT(GETDATE(), 'yyyy-MM'),
    thang = MONTH(GETDATE()),
    nam = YEAR(GETDATE())
WHERE ky_ngan_sach IS NULL;
GO
