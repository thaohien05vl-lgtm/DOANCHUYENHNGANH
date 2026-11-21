package com.finora.backend.user;

import com.finora.backend.entity.AppUser;
import com.finora.backend.repository.AppUserRepository;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    private AppUserRepository users;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setUp() {
        users = Mockito.mock(AppUserRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);
        userService = new UserService(users, passwordEncoder);
    }

    @Test
    void testLayHoSoThanhCong() {
        AppUser user = new AppUser();
        user.setId("u-1");
        user.setFullName("Lê Thị B");
        user.setEmail("lethib@example.com");
        user.setBirthDate(LocalDate.of(2000, 5, 20));

        when(users.findById("u-1")).thenReturn(Optional.of(user));

        NguoiDungDto dto = userService.layHoSo("u-1");
        assertNotNull(dto);
        assertEquals("Lê Thị B", dto.ten());
        assertEquals("lethib@example.com", dto.email());
        assertEquals("2000-05-20", dto.ngaySinh());
    }

    @Test
    void testCapNhatHoSoThanhCong() {
        AppUser user = new AppUser();
        user.setId("u-1");
        user.setFullName("Lê Thị B");
        user.setEmail("lethib@example.com");

        when(users.findById("u-1")).thenReturn(Optional.of(user));
        when(users.findByEmailIgnoreCase("b_moi@example.com")).thenReturn(Optional.empty());
        when(users.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NguoiDungDto request = new NguoiDungDto("Lê Thị B (Mới)", "b_moi@example.com", null, "1999-12-31");
        NguoiDungDto dto = userService.capNhatHoSo("u-1", request);

        assertEquals("Lê Thị B (Mới)", dto.ten());
        assertEquals("b_moi@example.com", dto.email());
        assertEquals("1999-12-31", dto.ngaySinh());
    }

    @Test
    void testDoiMatKhauThanhCong() {
        AppUser user = new AppUser();
        user.setId("u-1");
        user.setPasswordHash("hashed_old");

        when(users.findById("u-1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPassword123", "hashed_old")).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456", "hashed_old")).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456")).thenReturn("hashed_new");

        DoiMatKhauRequest request = new DoiMatKhauRequest("OldPassword123", "NewPassword456", "NewPassword456");
        assertDoesNotThrow(() -> userService.doiMatKhau("u-1", request));
        assertEquals("hashed_new", user.getPasswordHash());
        verify(users).save(user);
    }

    @Test
    void testDoiMatKhauSaiMatKhauCu() {
        AppUser user = new AppUser();
        user.setId("u-1");
        user.setPasswordHash("hashed_old");

        when(users.findById("u-1")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "hashed_old")).thenReturn(false);

        DoiMatKhauRequest request = new DoiMatKhauRequest("WrongPassword", "NewPassword456", "NewPassword456");
        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> userService.doiMatKhau("u-1", request));
        assertTrue(ex.getReason().contains("Mật khẩu hiện tại không chính xác"));
    }
}
