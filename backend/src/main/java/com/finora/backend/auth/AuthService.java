package com.finora.backend.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finora.backend.data.DuLieuService;
import com.finora.backend.email.EmailService;
import com.finora.backend.entity.AppUser;
import com.finora.backend.repository.AppUserRepository;
import com.finora.backend.security.JwtService;
import com.finora.backend.user.NguoiDungDto;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DuLieuService duLieuService;
    private final EmailService emailService;
    private final OtpService otpService;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    /** Danh sách Google OAuth Client ID (loại Web) được phép. Rỗng = bỏ qua kiểm tra (chỉ nên dùng khi dev). */
    private final List<String> googleClientIds;
    private final String facebookAppId;
    private final String facebookAppSecret;

    public record OAuthUserInfo(String email, String fullName, String avatarUrl) {}

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder,
                       JwtService jwtService, DuLieuService duLieuService) {
        this(users, passwordEncoder, jwtService, duLieuService, null, new OtpService(), new ObjectMapper(), "", "", "");
    }

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder,
                       JwtService jwtService, DuLieuService duLieuService, EmailService emailService) {
        this(users, passwordEncoder, jwtService, duLieuService, emailService, new OtpService(), new ObjectMapper(), "", "", "");
    }

    @Autowired
    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder,
                       JwtService jwtService, DuLieuService duLieuService,
                       @Autowired(required = false) EmailService emailService,
                       OtpService otpService,
                       ObjectMapper objectMapper,
                       @Value("${app.oauth.google-client-ids:}") String googleClientIds,
                       @Value("${app.oauth.facebook-app-id:}") String facebookAppId,
                       @Value("${app.oauth.facebook-app-secret:}") String facebookAppSecret) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.duLieuService = duLieuService;
        this.emailService = emailService;
        this.otpService = otpService != null ? otpService : new OtpService();
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
        this.googleClientIds = googleClientIds == null ? List.of()
                : Arrays.stream(googleClientIds.split(",")).map(String::trim).filter(x -> !x.isEmpty()).toList();
        this.facebookAppId = facebookAppId == null ? "" : facebookAppId.trim();
        this.facebookAppSecret = facebookAppSecret == null ? "" : facebookAppSecret.trim();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        if (this.googleClientIds.isEmpty()) {
            log.warn("GOOGLE_CLIENT_IDS chưa cấu hình: backend sẽ KHÔNG kiểm tra token Google có đúng ứng dụng của bạn hay không.");
        }
        if (this.facebookAppId.isEmpty() || this.facebookAppSecret.isEmpty()) {
            log.warn("FACEBOOK_APP_ID/FACEBOOK_APP_SECRET chưa cấu hình: backend sẽ KHÔNG kiểm tra token Facebook có đúng ứng dụng của bạn hay không.");
        }
    }

    @Transactional
    public AuthDtos.AuthResponse dangKy(AuthDtos.DangKyRequest request) {
        if (request.matKhau().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu không được vượt quá 72 byte UTF-8.");
        }
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã được đăng ký.");
        }
        AppUser user = new AppUser();
        user.setId(UUID.randomUUID().toString());
        user.setFullName(request.ten().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.matKhau()));
        users.save(user);
        duLieuService.taoDuLieuMacDinh(user.getId());
        if (emailService != null) {
            emailService.guiEmailThongBaoDangKy(user.getEmail(), user.getFullName());
        }
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse dangNhap(AuthDtos.DangNhapRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác."));
        if (!passwordEncoder.matches(request.matKhau(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác.");
        }
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthDtos.GuiOtpResponse guiOtpDangKy(AuthDtos.GuiOtpDangKyRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã được đăng ký tài khoản.");
        }
        String otp = otpService.taoOtp(email, "dang_ky");
        if (emailService != null) {
            emailService.guiEmailMaXacNhanOTP(email, request.ten().trim(), otp, "dang_ky");
        }
        return new AuthDtos.GuiOtpResponse(true, "Mã xác thực đã được gửi tới " + email, otpService.getRemainingCooldownSeconds(email, "dang_ky"));
    }

    @Transactional
    public AuthDtos.AuthResponse xacNhanDangKy(AuthDtos.XacNhanDangKyRequest request) {
        String email = request.email().trim().toLowerCase();
        otpService.xacThucOtp(email, "dang_ky", request.otp());

        if (request.matKhau().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu không được vượt quá 72 byte UTF-8.");
        }
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã được đăng ký.");
        }
        AppUser user = new AppUser();
        user.setId(UUID.randomUUID().toString());
        user.setFullName(request.ten().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.matKhau()));
        users.save(user);
        duLieuService.taoDuLieuMacDinh(user.getId());
        if (emailService != null) {
            emailService.guiEmailThongBaoDangKy(user.getEmail(), user.getFullName());
        }
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthDtos.DangNhapResponse guiOtpDangNhap(AuthDtos.DangNhapRequest request) {
        String email = request.email().trim().toLowerCase();
        AppUser user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác."));
        if (!passwordEncoder.matches(request.matKhau(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác.");
        }

        String otp = otpService.taoOtp(email, "dang_nhap");
        if (emailService != null) {
            emailService.guiEmailMaXacNhanOTP(user.getEmail(), user.getFullName(), otp, "dang_nhap");
        }
        return new AuthDtos.DangNhapResponse(true, email, null, null);
    }

    @Transactional(readOnly = true)
    public AuthDtos.AuthResponse xacNhanDangNhap(AuthDtos.XacNhanDangNhapRequest request) {
        String email = request.email().trim().toLowerCase();
        otpService.xacThucOtp(email, "dang_nhap", request.otp());

        AppUser user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tài khoản không tồn tại."));
        return response(user);
    }

    @Transactional(readOnly = true)
    public AuthDtos.GuiOtpResponse guiLaiOtp(AuthDtos.GuiLaiOtpRequest request) {
        String email = request.email().trim().toLowerCase();
        String loai = request.loai().trim().toLowerCase();
        String fullName = "bạn";

        if ("dang_nhap".equals(loai)) {
            AppUser u = users.findByEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email chưa đăng ký tài khoản."));
            fullName = u.getFullName();
        } else if ("dang_ky".equals(loai)) {
            if (users.existsByEmailIgnoreCase(email)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Email này đã có tài khoản.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại xác thực không hợp lệ.");
        }

        String otp = otpService.taoOtp(email, loai);
        if (emailService != null) {
            emailService.guiEmailMaXacNhanOTP(email, fullName, otp, loai);
        }
        return new AuthDtos.GuiOtpResponse(true, "Mã xác thực mới đã được gửi tới " + email, otpService.getRemainingCooldownSeconds(email, loai));
    }

    @Transactional
    public void quenMatKhau(AuthDtos.QuenMatKhauRequest request) {
        if (request.matKhauMoi().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới không được vượt quá 72 byte UTF-8.");
        }
        AppUser user = users.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản với email này."));
        user.setPasswordHash(passwordEncoder.encode(request.matKhauMoi()));
        users.save(user);
    }

    @Transactional
    public AuthDtos.AuthResponse dangNhapOAuth(AuthDtos.OAuthDangNhapRequest request) {
        OAuthUserInfo info = xacThucTokenOAuth(request.provider(), request.token());
        String email = info.email().trim().toLowerCase();

        AppUser user = users.findByEmailIgnoreCase(email).orElseGet(() -> {
            AppUser moi = new AppUser();
            moi.setId(UUID.randomUUID().toString());
            moi.setEmail(email);
            moi.setFullName(info.fullName() != null && !info.fullName().isBlank() ? info.fullName().trim() : "Người dùng Finora");
            moi.setAvatarData(info.avatarUrl());
            // Tạo mật khẩu ngẫu nhiên bảo mật cao để bảo vệ tài khoản OAuth
            moi.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            users.save(moi);
            duLieuService.taoDuLieuMacDinh(moi.getId());
            return moi;
        });

        if ((user.getAvatarData() == null || user.getAvatarData().isBlank()) && info.avatarUrl() != null && !info.avatarUrl().isBlank()) {
            user.setAvatarData(info.avatarUrl());
            users.save(user);
        }

        return response(user);
    }

    OAuthUserInfo xacThucTokenOAuth(String provider, String token) {
        if ("google".equalsIgnoreCase(provider)) {
            return xacThucGoogle(token);
        } else if ("facebook".equalsIgnoreCase(provider)) {
            return xacThucFacebook(token);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhà cung cấp OAuth không được hỗ trợ: " + provider);
        }
    }

    /** Gọi GET và trả về JSON; mọi lỗi HTTP đều quy về 401 để app báo "token không hợp lệ". */
    private JsonNode layJson(String url, String bearer, String loiMacDinh) throws Exception {
        HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(10))
                .GET();
        if (bearer != null) {
            builder.header("Authorization", "Bearer " + bearer);
        }
        HttpResponse<String> response = httpClient.send(builder.build(), HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            log.warn("OAuth {} trả về HTTP {}", url.replaceAll("\\?.*$", ""), response.statusCode());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, loiMacDinh);
        }
        return objectMapper.readTree(response.body());
    }

    private void kiemTraAudienceGoogle(String aud) {
        if (googleClientIds.isEmpty()) {
            return;
        }
        if (aud == null || !googleClientIds.contains(aud)) {
            log.warn("Token Google có aud='{}' không nằm trong danh sách GOOGLE_CLIENT_IDS", aud);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google không dành cho ứng dụng này.");
        }
    }

    private OAuthUserInfo xacThucGoogle(String token) {
        final String loi = "Xác thực tài khoản Google thất bại: Token không hợp lệ hoặc đã hết hạn.";
        try {
            boolean laIdToken = token.chars().filter(ch -> ch == '.').count() == 2 && !token.startsWith("ya29.");
            JsonNode root;
            if (laIdToken) {
                // ID token (app Android dùng Credential Manager): Google kiểm tra chữ ký + hạn dùng, trả về aud/email_verified.
                root = layJson("https://oauth2.googleapis.com/tokeninfo?id_token="
                        + URLEncoder.encode(token, StandardCharsets.UTF_8), null, loi);
                kiemTraAudienceGoogle(root.path("aud").asText(null));
            } else {
                // Access token (popup web): kiểm tra token được cấp cho đúng client rồi mới lấy hồ sơ.
                JsonNode info = layJson("https://oauth2.googleapis.com/tokeninfo?access_token="
                        + URLEncoder.encode(token, StandardCharsets.UTF_8), null, loi);
                kiemTraAudienceGoogle(info.path("aud").asText(info.path("azp").asText(null)));
                root = layJson("https://www.googleapis.com/oauth2/v3/userinfo", token, loi);
            }

            String email = root.path("email").asText(null);
            if (email == null || email.isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tài khoản Google không trả về địa chỉ email hợp lệ.");
            }
            JsonNode daXacMinh = root.path("email_verified");
            if (!daXacMinh.isMissingNode() && !"true".equalsIgnoreCase(daXacMinh.asText())) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email của tài khoản Google chưa được xác minh.");
            }
            String name = root.path("name").asText(root.path("given_name").asText("Người dùng Google"));
            String picture = root.path("picture").asText(null);
            return new OAuthUserInfo(email, name, picture);
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            log.error("Lỗi khi kết nối Google OAuth", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Không thể kết nối đến máy chủ Google để xác thực. Vui lòng thử lại.");
        }
    }

    private void kiemTraAppFacebook(String token) throws Exception {
        if (facebookAppId.isEmpty() || facebookAppSecret.isEmpty()) {
            return;
        }
        String url = "https://graph.facebook.com/debug_token?input_token="
                + URLEncoder.encode(token, StandardCharsets.UTF_8)
                + "&access_token=" + URLEncoder.encode(facebookAppId + "|" + facebookAppSecret, StandardCharsets.UTF_8);
        JsonNode data = layJson(url, null, "Xác thực tài khoản Facebook thất bại: Token không hợp lệ hoặc đã hết hạn.").path("data");
        if (!data.path("is_valid").asBoolean(false) || !facebookAppId.equals(data.path("app_id").asText(""))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Facebook không dành cho ứng dụng này.");
        }
    }

    private OAuthUserInfo xacThucFacebook(String token) {
        final String loi = "Xác thực tài khoản Facebook thất bại: Token không hợp lệ hoặc đã hết hạn.";
        try {
            kiemTraAppFacebook(token);
            JsonNode root = layJson("https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token="
                    + URLEncoder.encode(token, StandardCharsets.UTF_8), null, loi);
            String id = root.path("id").asText(null);
            if (id == null || id.isBlank()) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Tài khoản Facebook không hợp lệ.");
            }

            String email = root.path("email").asText(null);
            if (email == null || email.isBlank()) {
                // Facebook cho phép tạo tài khoản qua SĐT không có email -> Định danh email an toàn
                email = "fb_" + id + "@facebook.finora";
            }

            String name = root.path("name").asText("Người dùng Facebook");
            String picture = root.path("picture").path("data").path("url").asText(null);
            return new OAuthUserInfo(email, name, picture);
        } catch (ResponseStatusException rse) {
            throw rse;
        } catch (Exception e) {
            log.error("Lỗi khi kết nối Facebook OAuth", e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Không thể kết nối đến máy chủ Facebook để xác thực. Vui lòng thử lại.");
        }
    }

    private AuthDtos.AuthResponse response(AppUser user) {
        String ngaySinh = user.getBirthDate() == null ? "" : user.getBirthDate().toString();
        NguoiDungDto profile = new NguoiDungDto(user.getFullName(), user.getEmail(), user.getAvatarData(), ngaySinh);
        return new AuthDtos.AuthResponse(jwtService.createToken(user.getId(), user.getEmail()), profile);
    }
}
