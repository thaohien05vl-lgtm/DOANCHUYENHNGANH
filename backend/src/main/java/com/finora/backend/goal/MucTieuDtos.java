package com.finora.backend.goal;

import com.finora.backend.data.DuLieuDto.GiaoDichDto;
import com.finora.backend.data.DuLieuDto.MucTieuDto;
import java.math.BigDecimal;

public class MucTieuDtos {

    public record NapTienRequest(
            BigDecimal soTien,
            String maVi,
            String ghiChu
    ) {}

    public record NguongCanhBaoRequest(
            int nguong
    ) {}

    public record GoalContributionDto(
            String id,
            String goalId,
            String walletId,
            String walletName,
            BigDecimal amount,
            BigDecimal savedAmountAfter,
            String note,
            String createdAt
    ) {}

    public record NapTienResponse(
            MucTieuDto mucTieu,
            GiaoDichDto giaoDich,
            GoalContributionDto dongGop,
            String thongDiep,
            boolean datNguong
    ) {}
}
