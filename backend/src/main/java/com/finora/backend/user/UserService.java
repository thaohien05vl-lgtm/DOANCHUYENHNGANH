package com.finora.backend.user;

import com.finora.backend.entity.AppUser;
import com.finora.backend.repository.AppUserRepository;
import java.time.LocalDate;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;

    public UserService(AppUserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public NguoiDungDto layHoSo(String userId) {
        return map(find(userId));
    }

    @Transactional
    public NguoiDungDto capNhatHoSo(String userId, NguoiDungDto request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu yêu cầu không hợp lệ.");
        }
        AppUser user = find(userId);
        String rawEmail = request.email();
        String email = rawEmail == null ? "" : rawEmail.trim().toLowerCase();
        if (email.isBlank() || email.length() > 180 || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không hợp lệ hoặc vượt quá 180 ký tự.");
        }
        users.findByEmailIgnoreCase(email).filter(other -> !other.getId().equals(userId)).ifPresent(other -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã được tài khoản khác sử dụng.");
        });
        String rawTen = request.ten();
        String fullName = rawTen == null ? "" : rawTen.trim();
        if (fullName.isBlank() || fullName.length() > 80) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên hiển thị phải từ 1 đến 80 ký tự.");
        }
        user.setFullName(fullName);
        user.setEmail(email);
        String avatar = request.anhDaiDien();
        if (avatar != null && !avatar.isBlank()) {
            if (avatar.length() > 2_000_000 || !avatar.matches("^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$")) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ảnh đại diện không đúng định dạng hoặc vượt quá dung lượng cho phép.");
            }
        }
        user.setAvatarData(avatar);
        try {
            String date = request.ngaySinh();
            user.setBirthDate(date == null || date.isBlank() ? null : LocalDate.parse(date));
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày sinh không hợp lệ.");
        }
        return map(users.save(user));
    }

    @Transactional
    public void doiMatKhau(String userId, DoiMatKhauRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu yêu cầu không hợp lệ.");
        }
        AppUser user = find(userId);
        if (request.matKhauCu() == null || !passwordEncoder.matches(request.matKhauCu(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không chính xác.");
        }
        String matKhauMoi = request.matKhauMoi();
        if (matKhauMoi == null || matKhauMoi.length() < 6 || matKhauMoi.length() > 64) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới phải từ 6 đến 64 ký tự.");
        }
        if (request.xacNhanMatKhau() == null || !matKhauMoi.equals(request.xacNhanMatKhau())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Xác nhận mật khẩu mới không khớp.");
        }
        if (passwordEncoder.matches(matKhauMoi, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới không được trùng với mật khẩu cũ.");
        }
        user.setPasswordHash(passwordEncoder.encode(matKhauMoi));
        users.save(user);
    }

    private AppUser find(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        return users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản."));
    }

    private NguoiDungDto map(AppUser user) {
        String name = user.getFullName() == null ? "" : user.getFullName();
        String email = user.getEmail() == null ? "" : user.getEmail();
        String birth = user.getBirthDate() == null ? "" : user.getBirthDate().toString();
        return new NguoiDungDto(name, email, user.getAvatarData(), birth);
    }
}
