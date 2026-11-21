package com.finora.backend.notification;

import java.math.BigDecimal;

public record ThongBaoDto(
        String id,
        String transactionId,
        String type,
        String title,
        String content,
        boolean read,
        String createdAt,
        BigDecimal amount,
        String categoryName,
        String walletName,
        String metadata
) {
    public ThongBaoDto(String id, String transactionId, String type, String title, String content, boolean read, String createdAt) {
        this(id, transactionId, type, title, content, read, createdAt, null, null, null, null);
    }
}
