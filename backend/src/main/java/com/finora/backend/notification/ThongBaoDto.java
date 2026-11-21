package com.finora.backend.notification;

public record ThongBaoDto(
        String id,
        String transactionId,
        String type,
        String title,
        String content,
        boolean read,
        String createdAt
) {}

