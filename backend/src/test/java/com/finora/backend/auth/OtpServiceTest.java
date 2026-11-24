package com.finora.backend.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;

class OtpServiceTest {

    private OtpService otpService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService();
    }

    @Test
    void testTaoVaXacThucOtpThanhCong() {
        String email = "test@example.com";
        String purpose = "dang_ky";

        String code = otpService.taoOtp(email, purpose);
        assertNotNull(code);
        assertEquals(6, code.length());

        boolean ok = otpService.xacThucOtp(email, purpose, code);
        assertTrue(ok);
    }

    @Test
    void testXacThucOtpSaiMa() {
        String email = "test@example.com";
        String purpose = "dang_nhap";

        otpService.taoOtp(email, purpose);

        assertThrows(ResponseStatusException.class, () ->
                otpService.xacThucOtp(email, purpose, "000000")
        );
    }

    @Test
    void testChongSpamCooldown() {
        String email = "spam@example.com";
        String purpose = "dang_ky";

        otpService.taoOtp(email, purpose);

        // Gọi ngay lập tức lần thứ 2 phải ném ResponseStatusException TOO_MANY_REQUESTS
        assertThrows(ResponseStatusException.class, () ->
                otpService.taoOtp(email, purpose)
        );
    }
}
