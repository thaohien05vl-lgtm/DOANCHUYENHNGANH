package com.finora.backend.ai;

import java.math.BigDecimal;
import java.util.List;

public record HoaDonResponse(
        String tenCuaHang,
        BigDecimal soTien,
        String ngay,
        String gio,
        String maDanhMuc,
        double doTinCay,
        BigDecimal tongTienHang,
        BigDecimal giamGia,
        BigDecimal thuePhi,
        String phuongThucThanhToan,
        String ghiChuGiaoDich,
        List<MatHangDto> matHang) {

    public record MatHangDto(
            String ten,
            BigDecimal soLuong,
            BigDecimal donGia,
            BigDecimal thanhTien) {}

    public HoaDonResponse(String tenCuaHang, BigDecimal soTien, String ngay, String maDanhMuc, double doTinCay) {
        this(tenCuaHang, soTien, ngay, null, maDanhMuc, doTinCay, soTien, BigDecimal.ZERO, BigDecimal.ZERO, null, tenCuaHang, List.of());
    }
}
