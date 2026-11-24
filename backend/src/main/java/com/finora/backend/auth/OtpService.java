package com.finora.backend.auth;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int COOLDOWN_SECONDS = 45;
    private static final int MAX_ATTEMPTS = 5;

    public record OtpData(String code, Instant expiresAt, Instant lastSentAt, int attempts) {}

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    private String buildKey(String email, String purpose) {
        return (email == null ? "" : email.trim().toLowerCase()) + ":" + (purpose == null ? "" : purpose.trim().toLowerCase());
    }

    public synchronized String taoOtp(String email, String purpose) {
        String key = buildKey(email, purpose);
        OtpData current = otpStorage.get(key);
        Instant now = Instant.now();

        if (current != null && current.lastSentAt() != null) {
            long secondsSinceLast = Duration.between(current.lastSentAt(), now).getSeconds();
            if (secondsSinceLast < COOLDOWN_SECONDS) {
                long waitTime = COOLDOWN_SECONDS - secondsSinceLast;
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Vui lòng chờ " + waitTime + " giây trước khi yêu cầu gửi lại mã xác nhận.");
            }
        }

        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiresAt = now.plus(Duration.ofMinutes(OTP_EXPIRY_MINUTES));
        otpStorage.put(key, new OtpData(code, expiresAt, now, 0));
        return code;
    }

    public synchronized boolean xacThucOtp(String email, String purpose, String inputCode) {
        String key = buildKey(email, purpose);
        OtpData data = otpStorage.get(key);
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã xác nhận không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu mã mới.");
        }

        if (Instant.now().isAfter(data.expiresAt())) {
            otpStorage.remove(key);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã xác nhận đã hết hạn (chỉ có hiệu lực trong 5 phút). Vui lòng yêu cầu mã mới.");
        }

        if (data.attempts() >= MAX_ATTEMPTS) {
            otpStorage.remove(key);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Bạn đã nhập sai mã quá 5 lần. Mã đã bị hủy để bảo mật, vui lòng yêu cầu mã mới.");
        }

        if (inputCode == null || !data.code().equals(inputCode.trim())) {
            otpStorage.put(key, new OtpData(data.code(), data.expiresAt(), data.lastSentAt(), data.attempts() + 1));
            int remaining = MAX_ATTEMPTS - (data.attempts() + 1);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã xác nhận không chính xác. Bạn còn " + remaining + " lần thử.");
        }

        // Xác thực thành công: xóa mã
        otpStorage.remove(key);
        return true;
    }

    public int getRemainingCooldownSeconds(String email, String purpose) {
        String key = buildKey(email, purpose);
        OtpData data = otpStorage.get(key);
        if (data == null || data.lastSentAt() == null) return 0;
        long elapsed = Duration.between(data.lastSentAt(), Instant.now()).getSeconds();
        return (int) Math.max(0, COOLDOWN_SECONDS - elapsed);
    }
}
