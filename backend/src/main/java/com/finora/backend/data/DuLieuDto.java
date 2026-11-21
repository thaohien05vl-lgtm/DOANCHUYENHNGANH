package com.finora.backend.data;

import java.math.BigDecimal;
import java.util.List;

/** JSON names intentionally match src/types/index.ts in Finora frontend. */
public record DuLieuDto(
        List<ViDto> vi,
        List<DanhMucDto> danhMuc,
        List<GiaoDichDto> giaoDich,
        List<NganSachDto> nganSach,
        List<MucTieuDto> mucTieu) {

    public record ViDto(String id, String ten, String loai, BigDecimal soDuBanDau, String mau) {}
    public record DanhMucDto(String id, String ten, String loai, String bieuTuong, String mau) {}
    public record GiaoDichDto(String id, String loai, BigDecimal soTien, String maDanhMuc,
                              String maVi, String ngay, String ghiChu, String dinhKy) {}
    public record NganSachDto(String id, String maDanhMuc, BigDecimal hanMuc) {}
    public record MucTieuDto(String id, String ten, BigDecimal soTienMucTieu,
                             BigDecimal daTietKiem, String han, String mau) {}
}
