package com.finora.backend.ai;

import java.math.BigDecimal;

public record BocTachGiaoDichResponse(
        boolean laGiaoDich,
        String loai,
        BigDecimal soTien,
        boolean soTienUocLuong,
        String maDanhMuc,
        String tenDanhMuc,
        String ngay,
        String ghiChu,
        String phuongThucThanhToan,
        double doTinCay,
        String phanHoi
) {}

