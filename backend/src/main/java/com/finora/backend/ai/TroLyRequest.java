package com.finora.backend.ai;

import jakarta.validation.constraints.Size;
import java.util.List;

public record TroLyRequest(
        @Size(max = 4000, message = "Câu hỏi quá dài.") String cauHoi,
        List<TinNhanLichSu> lichSu,
        String anhBase64,
        String anhMimeType
) {
    public record TinNhanLichSu(String vai, String noiDung, String anhBase64) {}

    public TroLyRequest(String cauHoi) {
        this(cauHoi, List.of(), null, null);
    }
}
