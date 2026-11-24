package com.finora.backend.email;

import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.CompletableFuture;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String mailUsername;
    private final String frontendUrl;

    public EmailService(@Autowired(required = false) JavaMailSender mailSender,
                        @Value("${spring.mail.username:}") String mailUsername,
                        @Value("${app.frontend-url:http://localhost:5173}") String frontendUrl) {
        this.mailSender = mailSender;
        this.mailUsername = mailUsername != null ? mailUsername.trim() : "";
        this.frontendUrl = frontendUrl != null ? frontendUrl.trim() : "http://localhost:5173";
    }

    /**
     * Gửi email thông báo đăng ký tài khoản thành công tới Gmail của người dùng.
     * Chạy bất đồng bộ (Asynchronous) để không làm chậm luồng phản hồi đăng ký HTTP.
     */
    public void guiEmailThongBaoDangKy(String toEmail, String fullName) {
        CompletableFuture.runAsync(() -> {
            try {
                if (mailSender == null || mailUsername.isEmpty()) {
                    log.info("[EmailService] SMTP chưa được cấu hình (MAIL_USERNAME/MAIL_PASSWORD). Email thông báo đăng ký tới: {} ({}) đã được ghi nhận vào hệ thống.", toEmail, fullName);
                    return;
                }

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailUsername, "Finora - Quản lý Chi tiêu");
                helper.setTo(toEmail);
                helper.setSubject("[Finora] Chúc mừng bạn đã đăng ký tài khoản thành công!");

                String htmlContent = taoNoiDungEmailDangKy(fullName, toEmail, frontendUrl);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("[EmailService] Đã gửi email thông báo đăng ký thành công tới: {}", toEmail);
            } catch (Exception e) {
                log.error("[EmailService] Không thể gửi email thông báo tới {}: {}", toEmail, e.getMessage());
            }
        });
    }

    private String taoNoiDungEmailDangKy(String fullName, String email, String loginUrl) {
        String thoiGian = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"));
        String duongDanDangNhap = loginUrl.replaceAll("/+$", "") + "/dang-nhap";

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Chào mừng bạn đến với Finora</title>
              <style>
                body { margin: 0; padding: 0; background-color: #f1f5f4; font-family: 'Segoe UI', Arial, sans-serif; color: #12262b; }
                .email-wrapper { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .email-header { background: linear-gradient(135deg, #0e2a2d, #163a3e); padding: 36px 30px; text-align: center; color: #ffffff; }
                .email-header h1 { margin: 10px 0 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; color: #ffffff; }
                .email-header p { margin: 4px 0 0; font-size: 13px; color: #a4c2ba; }
                .email-body { padding: 32px 30px; }
                .welcome-title { font-size: 18px; font-weight: 700; color: #0e2a2d; margin-top: 0; }
                .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #14946f; border-radius: 8px; padding: 16px; margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                .info-row:last-child { margin-bottom: 0; }
                .feature-list { list-style: none; padding: 0; margin: 20px 0; }
                .feature-item { padding: 8px 0; font-size: 14px; color: #334155; display: flex; align-items: center; }
                .btn-login { display: inline-block; background-color: #14946f; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; margin: 16px 0; text-align: center; }
                .btn-login:hover { background-color: #0f7a5b; }
                .email-footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
                .badge-success { background-color: #dff3ea; color: #14946f; padding: 3px 8px; border-radius: 6px; font-weight: 600; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="email-header">
                  <div style="display: inline-block; width: 48px; height: 48px; background: #14946f; border-radius: 12px; line-height: 48px; font-size: 24px; font-weight: 900; color: #ffffff;">F</div>
                  <h1>FINORA</h1>
                  <p>HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN THÔNG MINH</p>
                </div>
                
                <div class="email-body">
                  <h2 class="welcome-title">Xin chào %s,</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                    Chúc mừng bạn đã tạo tài khoản thành công tại <strong>Finora</strong>! Tài khoản của bạn đã được kích hoạt và sẵn sàng để quản lý tài chính cá nhân.
                  </p>
                  
                  <div class="info-box">
                    <div style="font-size: 13px; font-weight: 700; color: #0e2a2d; margin-bottom: 8px; text-transform: uppercase;">Thông tin tài khoản:</div>
                    <div style="font-size: 14px; margin-bottom: 6px;">• <strong>Email đăng nhập:</strong> %s</div>
                    <div style="font-size: 14px; margin-bottom: 6px;">• <strong>Thời gian đăng ký:</strong> %s</div>
                    <div style="font-size: 14px;">• <strong>Trạng thái:</strong> <span class="badge-success">Đã kích hoạt</span></div>
                  </div>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                    Để bắt đầu trải nghiệm, bạn vui lòng bấm vào nút bên dưới để tiến hành đăng nhập vào ứng dụng:
                  </p>
                  
                  <div style="text-align: center;">
                    <a href="%s" class="btn-login" target="_blank">ĐĂNG NHẬP VÀO FINORA</a>
                  </div>
                  
                  <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #cbd5e1; font-size: 13px; color: #64748b; line-height: 1.5;">
                    🔒 <strong>Lưu ý bảo mật:</strong> Không chia sẻ mật khẩu tài khoản với bất kỳ ai. Nếu bạn không thực hiện đăng ký tài khoản này, vui lòng bỏ qua email hoặc liên hệ với ban quản trị Finora.
                  </div>
                </div>
                
                <div class="email-footer">
                  <p style="margin: 0 0 6px;">Bản quyền © 2026 Finora Personal Finance. Đã đăng ký bản quyền.</p>
                  <p style="margin: 0;">Email này được gửi tự động, vui lòng không phản hồi trực tiếp vào địa chỉ này.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(fullName, email, thoiGian, duongDanDangNhap);
    }

    /**
     * Gửi email thông báo cảnh báo / đạt ngưỡng / hoàn thành mục tiêu tiết kiệm.
     */
    public void guiEmailCanhBaoMucTieu(String toEmail, String fullName, String goalName,
                                       java.math.BigDecimal targetAmount, java.math.BigDecimal savedAmount,
                                       int phanTram, java.math.BigDecimal conThieuHoacVuot, String loaiCanhBao) {
        CompletableFuture.runAsync(() -> {
            try {
                if (mailSender == null || mailUsername.isEmpty()) {
                    log.info("[EmailService] SMTP chưa cấu hình. Thông báo mục tiêu [{}] ({}%) tới: {} được ghi nhận vào hệ thống.",
                            goalName, phanTram, toEmail);
                    return;
                }

                String tieuDe;
                if (phanTram > 100) {
                    tieuDe = "[Finora] Tuyệt vời! Bạn đã vượt mục tiêu tiết kiệm " + goalName + "!";
                } else if (phanTram == 100) {
                    tieuDe = "[Finora] Chúc mừng! Bạn đã hoàn thành 100% mục tiêu " + goalName + "!";
                } else {
                    tieuDe = "[Finora] Bạn đã đạt " + phanTram + "% mục tiêu tiết kiệm " + goalName + "!";
                }

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailUsername, "Finora - Quản lý Chi tiêu");
                helper.setTo(toEmail);
                helper.setSubject(tieuDe);

                String htmlContent = taoNoiDungEmailMucTieu(fullName, goalName, targetAmount, savedAmount, phanTram, conThieuHoacVuot, frontendUrl);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("[EmailService] Đã gửi email cảnh báo mục tiêu [{}] tới: {}", goalName, toEmail);
            } catch (Exception e) {
                log.error("[EmailService] Không thể gửi email thông báo mục tiêu tới {}: {}", toEmail, e.getMessage());
            }
        });
    }

    private String formatVND(java.math.BigDecimal amount) {
        if (amount == null) return "0 đ";
        return String.format(java.util.Locale.GERMAN, "%,d đ", amount.longValue());
    }

    private String taoNoiDungEmailMucTieu(String fullName, String goalName,
                                          java.math.BigDecimal targetAmount, java.math.BigDecimal savedAmount,
                                          int phanTram, java.math.BigDecimal conThieuHoacVuot, String appUrl) {
        String thoiGian = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy"));
        String duongDanMucTieu = appUrl.replaceAll("/+$", "") + "/muc-tieu";
        int progressWidth = Math.min(Math.max(phanTram, 0), 100);

        String trangThaiHtml;
        String loiKhuyenHtml;
        if (phanTram > 100) {
            trangThaiHtml = "<span style=\"background-color: #d1fae5; color: #059669; padding: 4px 10px; border-radius: 6px; font-weight: 700;\">Vượt mục tiêu (" + formatVND(conThieuHoacVuot) + ")</span>";
            loiKhuyenHtml = "Thật phi thường! Bạn đã hoàn thành vượt mức mục tiêu của mình. Hãy duy trì thói quen tích lũy thông minh này cho những kế hoạch lớn hơn nhé!";
        } else if (phanTram == 100) {
            trangThaiHtml = "<span style=\"background-color: #dff3ea; color: #14946f; padding: 4px 10px; border-radius: 6px; font-weight: 700;\">Đã hoàn thành 100%</span>";
            loiKhuyenHtml = "Tuyệt vời! Bạn đã đạt đúng cột mốc tài chính mà bạn đặt ra. Đây là minh chứng cho sự kiên trì và kỷ luật tài chính tuyệt vời của bạn!";
        } else {
            trangThaiHtml = "<span style=\"background-color: #fef3c7; color: #d97706; padding: 4px 10px; border-radius: 6px; font-weight: 700;\">Đạt " + phanTram + "% (Còn thiếu " + formatVND(conThieuHoacVuot) + ")</span>";
            loiKhuyenHtml = "Chỉ còn một đoạn đường ngắn nữa thôi là bạn sẽ cán đích thành công. Hãy tiếp tục giữ vững kế hoạch chi tiêu nhé!";
        }

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Cập nhật mục tiêu tiết kiệm Finora</title>
              <style>
                body { margin: 0; padding: 0; background-color: #f1f5f4; font-family: 'Segoe UI', Arial, sans-serif; color: #12262b; }
                .email-wrapper { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .email-header { background: linear-gradient(135deg, #0e2a2d, #163a3e); padding: 32px 30px; text-align: center; color: #ffffff; }
                .email-header h1 { margin: 10px 0 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff; }
                .email-header p { margin: 4px 0 0; font-size: 13px; color: #a4c2ba; }
                .email-body { padding: 32px 30px; }
                .goal-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #14946f; border-radius: 12px; padding: 20px; margin: 20px 0; }
                .progress-track { width: 100%%; height: 12px; background-color: #e2e8f0; border-radius: 999px; overflow: hidden; margin: 14px 0 8px; }
                .progress-bar { height: 100%%; background: linear-gradient(90deg, #14946f, #34d399); border-radius: 999px; }
                .btn-view { display: inline-block; background-color: #14946f; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 32px; border-radius: 10px; margin: 16px 0; text-align: center; }
                .email-footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="email-header">
                  <div style="display: inline-block; width: 44px; height: 44px; background: #14946f; border-radius: 10px; line-height: 44px; font-size: 22px; font-weight: 900; color: #ffffff;">F</div>
                  <h1>TIẾN ĐỘ MỤC TIÊU TIẾT KIỆM</h1>
                  <p>HỆ THỐNG QUẢN LÝ TÀI CHÍNH CÁ NHÂN FINORA</p>
                </div>
                
                <div class="email-body">
                  <h2 style="font-size: 18px; font-weight: 700; color: #0e2a2d; margin-top: 0;">Xin chào %s,</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                    Bạn vừa có khoản tích lũy mới cho mục tiêu <strong>%s</strong>! Dưới đây là tiến độ mới nhất của bạn:
                  </p>
                  
                  <div class="goal-card">
                    <div style="font-size: 16px; font-weight: 700; color: #0e2a2d; margin-bottom: 10px;">🎯 %s</div>
                    <div style="font-size: 14px; margin-bottom: 6px; color: #334155;">• <strong>Số tiền mục tiêu:</strong> %s</div>
                    <div style="font-size: 14px; margin-bottom: 6px; color: #334155;">• <strong>Đã tích lũy:</strong> <span style="font-size: 15px; font-weight: 700; color: #14946f;">%s</span></div>
                    <div style="font-size: 14px; margin-bottom: 6px; color: #334155;">• <strong>Tiến độ đạt được:</strong> <strong>%d%%</strong></div>
                    <div style="font-size: 14px; margin-bottom: 12px;">• <strong>Trạng thái:</strong> %s</div>
                    
                    <div class="progress-track">
                      <div class="progress-bar" style="width: %d%%;"></div>
                    </div>
                  </div>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #334155; font-style: italic;">
                    "%s"
                  </p>
                  
                  <div style="text-align: center; margin-top: 24px;">
                    <a href="%s" class="btn-view" target="_blank">XEM CHI TIẾT TRÊN FINORA</a>
                  </div>
                  
                  <div style="margin-top: 24px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b;">
                    🕒 Cập nhật lúc: %s
                  </div>
                </div>
                
                <div class="email-footer">
                  <p style="margin: 0 0 6px;">Bản quyền © 2026 Finora Personal Finance. Đã đăng ký bản quyền.</p>
                  <p style="margin: 0;">Email này được gửi tự động dựa trên thiết lập cảnh báo mục tiêu của bạn.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                fullName != null ? fullName : "bạn",
                goalName,
                goalName,
                formatVND(targetAmount),
                formatVND(savedAmount),
                phanTram,
                trangThaiHtml,
                progressWidth,
                loiKhuyenHtml,
                duongDanMucTieu,
                thoiGian
            );
    }

    /**
     * Gửi email cảnh báo vượt hạn mức chi tiêu ngân sách tới Gmail của người dùng.
     * Chạy bất đồng bộ (Asynchronous).
     */
    public void guiEmailCanhBaoVuotNganSach(String toEmail, String fullName, String categoryName,
                                           java.math.BigDecimal limitAmount, java.math.BigDecimal spentAmount,
                                           java.math.BigDecimal overAmount, int percent, String month) {
        CompletableFuture.runAsync(() -> {
            try {
                if (mailSender == null || mailUsername.isEmpty()) {
                    log.info("[EmailService] SMTP chưa cấu hình. Email cảnh báo vượt ngân sách danh mục [{}] tới: {} đã được ghi nhận.", categoryName, toEmail);
                    return;
                }

                String tieuDe = "[Finora] Cảnh báo: Bạn đã chi tiêu vượt ngân sách " + categoryName + " (" + percent + "%)!";

                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(mailUsername, "Finora - Cảnh báo Tài chính");
                helper.setTo(toEmail);
                helper.setSubject(tieuDe);

                String htmlContent = taoNoiDungEmailVuotNganSach(fullName, categoryName, limitAmount, spentAmount, overAmount, percent, month, frontendUrl);
                helper.setText(htmlContent, true);

                mailSender.send(message);
                log.info("[EmailService] Đã gửi email cảnh báo vượt ngân sách [{}] tới: {}", categoryName, toEmail);
            } catch (Exception e) {
                log.error("[EmailService] Không thể gửi email cảnh báo vượt ngân sách tới {}: {}", toEmail, e.getMessage());
            }
        });
    }

    /**
     * Gửi mã xác nhận OTP (6 chữ số) tới Gmail của người dùng khi đăng ký.
     * Chạy đồng bộ để nếu có lỗi máy chủ / SMTP sẽ phản hồi ngay lập tức cho người dùng.
     */
    public void guiEmailMaXacNhanOTP(String toEmail, String fullName, String otpCode, String loaiXacThuc) {
        if (mailSender == null || mailUsername.isEmpty()) {
            log.error("[EmailService] SMTP chưa được cấu hình (MAIL_USERNAME/MAIL_PASSWORD). Không thể gửi email OTP [{}] cho {} ({})", otpCode, toEmail, loaiXacThuc);
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE,
                    "Máy chủ chưa cấu hình gửi email (SMTP). Vui lòng liên hệ quản trị viên."
            );
        }

        try {
            boolean isDangKy = "dang_ky".equalsIgnoreCase(loaiXacThuc);
            String tieuDe = isDangKy
                    ? "[Finora] Mã xác nhận đăng ký tài khoản của bạn: " + otpCode
                    : "[Finora] Mã xác thực đăng nhập (2FA) của bạn: " + otpCode;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailUsername, "Finora - Bảo mật Tài khoản");
            helper.setTo(toEmail);
            helper.setSubject(tieuDe);

            String htmlContent = taoNoiDungEmailOTP(fullName, otpCode, isDangKy);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("[EmailService] Đã gửi mã OTP [{}] thành công tới: {} ({})", otpCode, toEmail, loaiXacThuc);
        } catch (Exception e) {
            log.error("[EmailService] Lỗi khi gửi email OTP tới {}: {}", toEmail, e.getMessage(), e);
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_GATEWAY,
                    "Không thể gửi email chứa mã OTP đến " + toEmail + ". Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau."
            );
        }
    }

    private String taoNoiDungEmailVuotNganSach(String fullName, String categoryName,
                                              java.math.BigDecimal limitAmount, java.math.BigDecimal spentAmount,
                                              java.math.BigDecimal overAmount, int percent, String month, String frontendUrl) {
        String thoiGian = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm - dd/MM/yyyy"));
        String duongDanNganSach = frontendUrl + "/ngan-sach";

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                .email-wrapper { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .email-header { background: linear-gradient(135deg, #7f1d1d, #991b1b); padding: 32px 30px; text-align: center; color: #ffffff; }
                .email-header h1 { margin: 8px 0 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
                .email-body { padding: 32px 30px; }
                .alert-box { background-color: #fef2f2; border: 1px solid #fecaca; border-left: 5px solid #ef4444; border-radius: 10px; padding: 18px; margin: 20px 0; }
                .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fee2e2; font-size: 14px; }
                .data-row:last-child { border-bottom: none; }
                .btn-view { display: inline-block; background-color: #dc2626; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 13px 28px; border-radius: 10px; margin: 16px 0; text-align: center; }
                .email-footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="email-header">
                  <div style="display: inline-block; width: 44px; height: 44px; background: rgba(255,255,255,0.2); border-radius: 10px; line-height: 44px; font-size: 22px; font-weight: 900; color: #ffffff;">⚠️</div>
                  <h1>CẢNH BÁO VƯỢT NGÂN SÁCH CHI TIÊU</h1>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #fecaca;">KỲ NGÂN SÁCH %s</p>
                </div>
                
                <div class="email-body">
                  <h2 style="font-size: 18px; font-weight: 700; color: #0e2a2d; margin-top: 0;">Xin chào %s,</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                    Finora phát hiện danh mục <strong>%s</strong> của bạn trong tháng này đã <strong>vượt quá hạn mức ngân sách</strong> được thiết lập.
                  </p>
                  
                  <div class="alert-box">
                    <div style="font-size: 16px; font-weight: 700; color: #991b1b; margin-bottom: 12px;">📊 Chi tiết ngân sách: %s</div>
                    <div class="data-row">
                      <span style="color: #64748b;">Hạn mức tối đa:</span>
                      <strong style="color: #0e2a2d;">%s</strong>
                    </div>
                    <div class="data-row">
                      <span style="color: #64748b;">Thực tế đã chi:</span>
                      <strong style="color: #dc2626;">%s</strong>
                    </div>
                    <div class="data-row">
                      <span style="color: #64748b;">Số tiền vượt trần:</span>
                      <strong style="color: #b91c1c;">+%s</strong>
                    </div>
                    <div class="data-row">
                      <span style="color: #64748b;">Tỷ lệ đã sử dụng:</span>
                      <span style="background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 6px; font-weight: 700;">%d%% (Bội chi)</span>
                    </div>
                  </div>
                  
                  <p style="font-size: 14px; line-height: 1.6; color: #475569; background: #f8fafc; border-radius: 8px; padding: 12px 14px;">
                    💡 <strong>Lời khuyên Finora:</strong> Bạn nên cân nhắc hoãn lại các khoản chi chưa cấp thiết cho danh mục này trong những ngày còn lại của tháng hoặc điều chỉnh lại hạn mức ngân sách trong ứng dụng.
                  </p>
                  
                  <div style="text-align: center; margin-top: 24px;">
                    <a href="%s" class="btn-view" target="_blank">ĐIỀU CHỈNH NGÂN SÁCH TRÊN FINORA</a>
                  </div>
                  
                  <div style="margin-top: 20px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 12px; color: #64748b;">
                    🕒 Cảnh báo ghi nhận lúc: %s
                  </div>
                </div>
                
                <div class="email-footer">
                  <p style="margin: 0 0 6px;">Bản quyền © 2026 Finora Personal Finance.</p>
                  <p style="margin: 0;">Email thông báo tự động bảo vệ tài chính cá nhân.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                month,
                fullName != null ? fullName : "bạn",
                categoryName,
                categoryName,
                formatVND(limitAmount),
                formatVND(spentAmount),
                formatVND(overAmount),
                percent,
                duongDanNganSach,
                thoiGian
            );
    }

    private String taoNoiDungEmailOTP(String fullName, String otpCode, boolean isDangKy) {
        String hanDung = "5 phút";
        String hanhDong = isDangKy ? "hoàn tất đăng ký tài khoản Finora" : "đăng nhập vào tài khoản Finora của bạn";

        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
                .email-wrapper { max-width: 560px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .email-header { background: linear-gradient(135deg, #0e2a2d, #163a3e); padding: 32px 30px; text-align: center; color: #ffffff; }
                .email-header h1 { margin: 8px 0 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
                .email-body { padding: 32px 30px; text-align: center; }
                .otp-box { background: #f0fdf4; border: 2px dashed #14946f; border-radius: 14px; padding: 22px 20px; margin: 24px 0; text-align: center; }
                .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; color: #14946f; letter-spacing: 8px; margin: 0; }
                .email-footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="email-wrapper">
                <div class="email-header">
                  <div style="display: inline-block; width: 44px; height: 44px; background: #14946f; border-radius: 10px; line-height: 44px; font-size: 22px; font-weight: 900; color: #ffffff;">F</div>
                  <h1>MÃ XÁC THỰC BẢO MẬT (OTP)</h1>
                  <p style="margin: 4px 0 0; font-size: 13px; color: #a4c2ba;">XÁC MINH DANH TÍNH QUA GMAIL</p>
                </div>
                
                <div class="email-body">
                  <h2 style="font-size: 18px; font-weight: 700; color: #0e2a2d; margin-top: 0; text-align: left;">Xin chào %s,</h2>
                  <p style="font-size: 14px; line-height: 1.6; color: #334155; text-align: left;">
                    Bạn hoặc ai đó đang yêu cầu <strong>%s</strong>. Vui lòng sử dụng mã xác thực bảo mật 6 chữ số dưới đây để tiếp tục:
                  </p>
                  
                  <div class="otp-box">
                    <p style="margin: 0 0 8px; font-size: 13px; color: #166534; font-weight: 600; text-transform: uppercase;">MÃ XÁC THỰC CỦA BẠN</p>
                    <div class="otp-code">%s</div>
                    <p style="margin: 8px 0 0; font-size: 12px; color: #15803d;">Mã có hiệu lực trong vòng <strong>%s</strong></p>
                  </div>
                  
                  <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 14px; text-align: left; font-size: 13px; color: #92400e;">
                    🔒 <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ Finora. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
                  </div>
                </div>
                
                <div class="email-footer">
                  <p style="margin: 0 0 6px;">Bản quyền © 2026 Finora Personal Finance.</p>
                  <p style="margin: 0;">Email bảo mật gửi tự động từ hệ thống Finora.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(
                fullName != null ? fullName : "bạn",
                hanhDong,
                otpCode,
                hanDung
            );
    }
}
