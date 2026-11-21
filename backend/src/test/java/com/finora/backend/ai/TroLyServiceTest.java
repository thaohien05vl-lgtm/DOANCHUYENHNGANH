package com.finora.backend.ai;

import com.finora.backend.data.DuLieuDto;
import com.finora.backend.data.DuLieuDto.DanhMucDto;
import com.finora.backend.data.DuLieuDto.GiaoDichDto;
import com.finora.backend.data.DuLieuDto.MucTieuDto;
import com.finora.backend.data.DuLieuDto.NganSachDto;
import com.finora.backend.data.DuLieuService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

class TroLyServiceTest {
    private DuLieuService duLieuService;
    private TroLyService troLyService;

    @BeforeEach
    void setUp() {
        duLieuService = Mockito.mock(DuLieuService.class);
        troLyService = new TroLyService(duLieuService);
    }

    @Test
    void testHoiWithEmptyUser() {
        TroLyResponse resp = troLyService.hoi("", "Tôi đã tiêu bao nhiêu?");
        assertNotNull(resp);
        assertTrue(resp.traLoi().contains("Vui lòng đăng nhập"));
    }

    @Test
    void testHoiChiTieuThangNay() {
        String today = LocalDate.now().toString();
        DuLieuDto data = new DuLieuDto(
                List.of(),
                List.of(new DanhMucDto("cat-1", "Ăn uống", "chi", "utensils", "#E5593F")),
                List.of(new GiaoDichDto("tx-1", "chi", BigDecimal.valueOf(150000), "cat-1", "wallet-1", today, "Ăn trưa", null)),
                List.of(),
                List.of()
        );
        when(duLieuService.layDuLieu("user-1")).thenReturn(data);

        TroLyResponse resp = troLyService.hoi("user-1", "Tháng này tôi chi bao nhiêu tiền?");
        assertNotNull(resp);
        assertTrue(resp.traLoi().contains("Ăn uống"));
        assertTrue(resp.traLoi().contains("150.000"));
    }

    @Test
    void testHoiNganSachVuot() {
        String today = LocalDate.now().toString();
        DuLieuDto data = new DuLieuDto(
                List.of(),
                List.of(new DanhMucDto("cat-1", "Ăn uống", "chi", "utensils", "#E5593F")),
                List.of(new GiaoDichDto("tx-1", "chi", BigDecimal.valueOf(2500000), "cat-1", "wallet-1", today, "Tiệc", null)),
                List.of(new NganSachDto("ns-1", "cat-1", BigDecimal.valueOf(2000000))),
                List.of()
        );
        when(duLieuService.layDuLieu("user-1")).thenReturn(data);

        TroLyResponse resp = troLyService.hoi("user-1", "Kiểm tra ngân sách xem có khoản nào vượt không?");
        assertNotNull(resp);
        assertTrue(resp.traLoi().contains("VƯỢT") || resp.traLoi().contains("chú ý"));
    }

    @Test
    void testHoiMucTieuTietKiem() {
        DuLieuDto data = new DuLieuDto(
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(new MucTieuDto("mt-1", "Mua Macbook", BigDecimal.valueOf(30000000), BigDecimal.valueOf(15000000), "2026-12-31", "#14946F"))
        );
        when(duLieuService.layDuLieu("user-1")).thenReturn(data);

        TroLyResponse resp = troLyService.hoi("user-1", "Tiến độ mục tiêu tiết kiệm thế nào?");
        assertNotNull(resp);
        assertTrue(resp.traLoi().contains("Mua Macbook"));
        assertTrue(resp.traLoi().contains("50%"));
    }

    @Test
    void testBocTachGiaoDichTuGiongNoi() {
        DuLieuDto data = new DuLieuDto(
                List.of(),
                List.of(
                        new DanhMucDto("cat-1", "Ăn uống", "chi", "utensils", "#E5593F"),
                        new DanhMucDto("cat-2", "Lương", "thu", "banknote", "#14946F")
                ),
                List.of(),
                List.of(),
                List.of()
        );
        when(duLieuService.layDuLieu("user-1")).thenReturn(data);

        BocTachGiaoDichResponse resp = troLyService.bocTachGiaoDich("user-1", "Hôm nay tôi ăn sáng hết 35 nghìn");
        assertNotNull(resp);
        assertTrue(resp.laGiaoDich());
        assertEquals("chi", resp.loai());
        assertEquals(BigDecimal.valueOf(35000), resp.soTien());
        assertEquals("cat-1", resp.maDanhMuc());
    }

    @Test
    void testBocTachCauHoiThongThuongKhongPhaiGiaoDich() {
        DuLieuDto data = new DuLieuDto(List.of(), List.of(), List.of(), List.of(), List.of());
        when(duLieuService.layDuLieu("user-1")).thenReturn(data);

        BocTachGiaoDichResponse resp = troLyService.bocTachGiaoDich("user-1", "Theo bạn uống cà phê mỗi ngày có tốt không?");
        assertNotNull(resp);
        assertFalse(resp.laGiaoDich());
    }
}

