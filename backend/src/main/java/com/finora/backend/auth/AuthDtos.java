package com.finora.backend.auth;

import com.finora.backend.user.NguoiDungDto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record DangKyRequest(
            @NotBlank(message = "Vui lòng nhập họ tên.")
            @Size(max = 80, message = "Họ tên tối đa 80 ký tự.") String ten,
            @NotBlank(message = "Vui lòng nhập email.")
            @Email(message = "Email không đúng định dạng.")
            @Size(max = 180, message = "Email tối đa 180 ký tự.") String email,
            @NotBlank(message = "Vui lòng nhập mật khẩu.")
            @Size(min = 6, max = 72, message = "Mật khẩu phải có từ 6 đến 72 ký tự.") String matKhau) {}

    public record DangNhapRequest(
            @NotBlank(message = "Vui lòng nhập email.") @Email(message = "Email không đúng định dạng.") String email,
            @NotBlank(message = "Vui lòng nhập mật khẩu.") @Size(max = 72, message = "Mật khẩu tối đa 72 ký tự.") String matKhau) {}

    public record QuenMatKhauRequest(
            @NotBlank(message = "Vui lòng nhập email.")
            @Email(message = "Email không đúng định dạng.") String email,
            @NotBlank(message = "Vui lòng nhập mật khẩu mới.")
            @Size(min = 6, max = 72, message = "Mật khẩu mới phải có từ 6 đến 72 ký tự.") String matKhauMoi) {}

    public record OAuthDangNhapRequest(
            @NotBlank(message = "Thiếu nhà cung cấp dịch vụ xác thực (google hoặc facebook).") String provider,
            @NotBlank(message = "Thiếu token xác thực.") String token) {}

    public record AuthResponse(String token, NguoiDungDto nguoiDung) {}
}
