package com.finora.backend.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/xac-thuc")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/dang-ky")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthDtos.AuthResponse dangKy(@Valid @RequestBody AuthDtos.DangKyRequest request) {
        return authService.dangKy(request);
    }

    @PostMapping("/gui-otp-dang-ky")
    public AuthDtos.GuiOtpResponse guiOtpDangKy(@Valid @RequestBody AuthDtos.GuiOtpDangKyRequest request) {
        return authService.guiOtpDangKy(request);
    }

    @PostMapping("/xac-nhan-dang-ky")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthDtos.AuthResponse xacNhanDangKy(@Valid @RequestBody AuthDtos.XacNhanDangKyRequest request) {
        return authService.xacNhanDangKy(request);
    }

    @PostMapping("/dang-nhap")
    public AuthDtos.AuthResponse dangNhap(@Valid @RequestBody AuthDtos.DangNhapRequest request) {
        return authService.dangNhap(request);
    }

    @PostMapping("/gui-otp-dang-nhap")
    public AuthDtos.DangNhapResponse guiOtpDangNhap(@Valid @RequestBody AuthDtos.DangNhapRequest request) {
        return authService.guiOtpDangNhap(request);
    }

    @PostMapping("/xac-nhan-dang-nhap")
    public AuthDtos.AuthResponse xacNhanDangNhap(@Valid @RequestBody AuthDtos.XacNhanDangNhapRequest request) {
        return authService.xacNhanDangNhap(request);
    }

    @PostMapping("/gui-lai-otp")
    public AuthDtos.GuiOtpResponse guiLaiOtp(@Valid @RequestBody AuthDtos.GuiLaiOtpRequest request) {
        return authService.guiLaiOtp(request);
    }

    @PostMapping("/quen-mat-khau")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void quenMatKhau(@Valid @RequestBody AuthDtos.QuenMatKhauRequest request) {
        authService.quenMatKhau(request);
    }

    @PostMapping("/oauth")
    public AuthDtos.AuthResponse dangNhapOAuth(@Valid @RequestBody AuthDtos.OAuthDangNhapRequest request) {
        return authService.dangNhapOAuth(request);
    }
}
