package com.finora.backend.user;

import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/nguoi-dung")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/ho-so")
    public NguoiDungDto lay(@AuthenticationPrincipal String userId) {
        return userService.layHoSo(userId);
    }

    @PutMapping("/ho-so")
    public NguoiDungDto capNhat(@AuthenticationPrincipal String userId, @RequestBody NguoiDungDto request) {
        return userService.capNhatHoSo(userId, request);
    }

    @PutMapping("/doi-mat-khau")
    public Map<String, String> doiMatKhau(@AuthenticationPrincipal String userId, @RequestBody DoiMatKhauRequest request) {
        userService.doiMatKhau(userId, request);
        return Map.of("message", "Đổi mật khẩu thành công.");
    }
}
