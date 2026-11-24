-- =========================================================================
-- FINORA DATABASE MIGRATION: NÂNG CẤP MỤC TIÊU TIẾT KIỆM & CẢNH BÁO NGƯỠNG
-- Tương thích Microsoft SQL Server - An toàn, Idempotent (chạy nhiều lần không lỗi)
-- =========================================================================

-- 1. Bổ sung cột alert_threshold (ngưỡng cảnh báo %, mặc định 80) vào bảng goals
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('goals') AND name = 'alert_threshold'
)
BEGIN
    ALTER TABLE goals ADD alert_threshold INT NOT NULL CONSTRAINT DF_goals_alert_threshold DEFAULT 80;
    PRINT 'Đã thêm cột alert_threshold vào bảng goals.';
END
ELSE
BEGIN
    PRINT 'Cột alert_threshold đã tồn tại trong bảng goals.';
END
GO

-- 2. Bổ sung cột alert_sent_threshold (mốc đã gửi cảnh báo để chống spam) vào bảng goals
IF NOT EXISTS (
    SELECT 1 FROM sys.columns 
    WHERE object_id = OBJECT_ID('goals') AND name = 'alert_sent_threshold'
)
BEGIN
    ALTER TABLE goals ADD alert_sent_threshold INT NOT NULL CONSTRAINT DF_goals_alert_sent_threshold DEFAULT 0;
    PRINT 'Đã thêm cột alert_sent_threshold vào bảng goals.';
END
ELSE
BEGIN
    PRINT 'Cột alert_sent_threshold đã tồn tại trong bảng goals.';
END
GO

-- 3. Tạo bảng lưu lịch sử nạp tiền đóng góp mục tiêu (goal_contributions)
IF NOT EXISTS (
    SELECT 1 FROM sys.tables 
    WHERE name = 'goal_contributions'
)
BEGIN
    CREATE TABLE goal_contributions (
        id VARCHAR(64) NOT NULL PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        goal_id VARCHAR(64) NOT NULL,
        wallet_id VARCHAR(64) NOT NULL,
        wallet_name NVARCHAR(80) NOT NULL,
        amount DECIMAL(19, 4) NOT NULL,
        saved_amount_after DECIMAL(19, 4) NOT NULL,
        note NVARCHAR(500) NULL,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_goal_contributions_user FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
    );

    CREATE INDEX IX_goal_contributions_user_goal ON goal_contributions(user_id, goal_id, created_at DESC);
    PRINT 'Đã tạo bảng goal_contributions và chỉ mục liên quan.';
END
ELSE
BEGIN
    PRINT 'Bảng goal_contributions đã tồn tại.';
END
GO
