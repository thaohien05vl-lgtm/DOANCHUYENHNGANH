package com.finora.backend.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BocTachGiaoDichRequest(
        @NotBlank(message = "Nội dung câu nói không được để trống.")
        @Size(max = 1000, message = "Nội dung quá dài.")
        String noiDung
) {}

