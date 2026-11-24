package com.finora.backend.auth;

import com.finora.backend.data.DuLieuService;
import com.finora.backend.email.EmailService;
import com.finora.backend.entity.AppUser;
import com.finora.backend.repository.AppUserRepository;
import com.finora.backend.security.JwtService;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private AppUserRepository users;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private DuLieuService duLieuService;
    private EmailService emailService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        users = Mockito.mock(AppUserRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        jwtService = Mockito.mock(JwtService.class);
        duLieuService = Mockito.mock(DuLieuService.class);
        emailService = Mockito.mock(EmailService.class);
        authService = new AuthService(users, passwordEncoder, jwtService, duLieuService, emailService);
    }

    @Test
    void testDangKyThanhCong() {
        var req = new AuthDtos.DangKyRequest("Nguyễn Văn A", "vana@example.com", "MatKhau123!");
        when(users.existsByEmailIgnoreCase("vana@example.com")).thenReturn(false);
        when(passwordEncoder.encode("MatKhau123!")).thenReturn("hashed_pass");
        when(jwtService.createToken(anyString(), anyString())).thenReturn("mock_token");

        var resp = authService.dangKy(req);
        assertNotNull(resp);
        assertEquals("mock_token", resp.token());
        assertEquals("Nguyễn Văn A", resp.nguoiDung().ten());
        assertEquals("vana@example.com", resp.nguoiDung().email());
        verify(duLieuService, times(1)).taoDuLieuMacDinh(anyString());
        verify(emailService, times(1)).guiEmailThongBaoDangKy("vana@example.com", "Nguyễn Văn A");
    }

    @Test
    void testDangKyTrungEmail() {
        var req = new AuthDtos.DangKyRequest("Nguyễn Văn A", "vana@example.com", "MatKhau123!");
        when(users.existsByEmailIgnoreCase("vana@example.com")).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> authService.dangKy(req));
        verify(users, never()).save(any());
    }

    @Test
    void testDangNhapThanhCong() {
        AppUser user = new AppUser();
        user.setId("user-1");
        user.setFullName("Nguyễn Văn A");
        user.setEmail("vana@example.com");
        user.setPasswordHash("hashed_pass");

        when(users.findByEmailIgnoreCase("vana@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("MatKhau123!", "hashed_pass")).thenReturn(true);
        when(jwtService.createToken("user-1", "vana@example.com")).thenReturn("mock_token");

        var req = new AuthDtos.DangNhapRequest("vana@example.com", "MatKhau123!");
        var resp = authService.dangNhap(req);

        assertNotNull(resp);
        assertEquals("mock_token", resp.token());
        assertEquals("Nguyễn Văn A", resp.nguoiDung().ten());
    }

    @Test
    void testDangNhapSaiMatKhau() {
        AppUser user = new AppUser();
        user.setId("user-1");
        user.setFullName("Nguyễn Văn A");
        user.setEmail("vana@example.com");
        user.setPasswordHash("hashed_pass");

        when(users.findByEmailIgnoreCase("vana@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("SaiMatKhau", "hashed_pass")).thenReturn(false);

        var req = new AuthDtos.DangNhapRequest("vana@example.com", "SaiMatKhau");
        assertThrows(ResponseStatusException.class, () -> authService.dangNhap(req));
    }

    @Test
    void testQuenMatKhauThanhCong() {
        AppUser user = new AppUser();
        user.setId("user-1");
        user.setEmail("vana@example.com");
        user.setPasswordHash("old_pass");

        when(users.findByEmailIgnoreCase("vana@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("MatKhauMoi123!")).thenReturn("new_hashed_pass");

        var req = new AuthDtos.QuenMatKhauRequest("vana@example.com", "MatKhauMoi123!");
        assertDoesNotThrow(() -> authService.quenMatKhau(req));
        assertEquals("new_hashed_pass", user.getPasswordHash());
        verify(users, times(1)).save(user);
    }

    @Test
    void testQuenMatKhauKhongTonTai() {
        when(users.findByEmailIgnoreCase("notfound@example.com")).thenReturn(Optional.empty());
        var req = new AuthDtos.QuenMatKhauRequest("notfound@example.com", "MatKhauMoi123!");
        assertThrows(ResponseStatusException.class, () -> authService.quenMatKhau(req));
    }

    @Test
    void testDangNhapOAuthProviderKhongHopLe() {
        var req = new AuthDtos.OAuthDangNhapRequest("unsupported", "some_token");
        assertThrows(ResponseStatusException.class, () -> authService.dangNhapOAuth(req));
    }

    @Test
    void testDangNhapOAuthUserMoi() {
        AuthService spyAuth = Mockito.spy(authService);
        doReturn(new AuthService.OAuthUserInfo("oauth_user@example.com", "OAuth User", "https://avatar.url/img.png"))
                .when(spyAuth).xacThucTokenOAuth("google", "valid_google_token");

        when(users.findByEmailIgnoreCase("oauth_user@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("random_hashed");
        when(jwtService.createToken(anyString(), eq("oauth_user@example.com"))).thenReturn("jwt_oauth_token");

        var req = new AuthDtos.OAuthDangNhapRequest("google", "valid_google_token");
        var resp = spyAuth.dangNhapOAuth(req);

        assertNotNull(resp);
        assertEquals("jwt_oauth_token", resp.token());
        assertEquals("OAuth User", resp.nguoiDung().ten());
        assertEquals("oauth_user@example.com", resp.nguoiDung().email());
        assertEquals("https://avatar.url/img.png", resp.nguoiDung().anhDaiDien());
        verify(users, times(1)).save(any(AppUser.class));
        verify(duLieuService, times(1)).taoDuLieuMacDinh(anyString());
    }

    @Test
    void testDangNhapOAuthUserDaTonTai() {
        AuthService spyAuth = Mockito.spy(authService);
        doReturn(new AuthService.OAuthUserInfo("existing@example.com", "Google Name", "https://avatar.url/new.png"))
                .when(spyAuth).xacThucTokenOAuth("google", "valid_google_token");

        AppUser existingUser = new AppUser();
        existingUser.setId("user-existing");
        existingUser.setFullName("Existing User");
        existingUser.setEmail("existing@example.com");
        existingUser.setAvatarData(null);

        when(users.findByEmailIgnoreCase("existing@example.com")).thenReturn(Optional.of(existingUser));
        when(jwtService.createToken("user-existing", "existing@example.com")).thenReturn("jwt_existing_token");

        var req = new AuthDtos.OAuthDangNhapRequest("google", "valid_google_token");
        var resp = spyAuth.dangNhapOAuth(req);

        assertNotNull(resp);
        assertEquals("jwt_existing_token", resp.token());
        assertEquals("existing@example.com", resp.nguoiDung().email());
        verify(duLieuService, never()).taoDuLieuMacDinh(anyString());
        assertEquals("https://avatar.url/new.png", existingUser.getAvatarData());
    }
}

