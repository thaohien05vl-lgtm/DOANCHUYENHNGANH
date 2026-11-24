package com.finora.backend.notification;

import com.finora.backend.email.EmailService;
import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.GoalEntity;
import com.finora.backend.entity.NotificationEntity;
import com.finora.backend.entity.TransactionEntity;
import com.finora.backend.entity.WalletEntity;
import com.finora.backend.repository.AppUserRepository;
import com.finora.backend.repository.NotificationRepository;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ThongBaoService {

    private final NotificationRepository notificationRepository;
    private final EmailService emailService;
    private final AppUserRepository users;

    @Autowired
    public ThongBaoService(NotificationRepository notificationRepository,
                           @Autowired(required = false) EmailService emailService,
                           @Autowired(required = false) AppUserRepository users) {
        this.notificationRepository = notificationRepository;
        this.emailService = emailService;
        this.users = users;
    }

    public ThongBaoService(NotificationRepository notificationRepository) {
        this(notificationRepository, null, null);
    }

    private static String formatTien(BigDecimal amount) {
        if (amount == null) return "0đ";
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.of("vi", "VN"));
        symbols.setGroupingSeparator('.');
        DecimalFormat df = new DecimalFormat("#,###", symbols);
        return df.format(amount) + "đ";
    }

    public ThongBaoDto mapDto(NotificationEntity e) {
        if (e == null) return null;
        return new ThongBaoDto(
                e.getId(),
                e.getTransactionId(),
                e.getType(),
                e.getTitle(),
                e.getContent(),
                e.isRead(),
                e.getCreatedAt() != null ? e.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : "",
                e.getAmount(),
                e.getCategoryName(),
                e.getWalletName(),
                e.getMetadata()
        );
    }

    @Transactional(readOnly = true)
    public List<ThongBaoDto> layDanhSach(String userId) {
        return notificationRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public long demChuaDoc(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void danhDauDaDoc(String userId, String id) {
        NotificationEntity n = notificationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông báo."));
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void danhDauTatCaDaDoc(String userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Transactional
    public void xoa(String userId, String id) {
        NotificationEntity n = notificationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông báo."));
        notificationRepository.delete(n);
    }

    @Transactional
    public void taoThongBaoGiaoDich(String userId, TransactionEntity transaction, CategoryEntity category, WalletEntity wallet) {
        if (transaction == null || transaction.getId() == null) return;
        if (notificationRepository.existsByUserIdAndTransactionId(userId, transaction.getId())) {
            return;
        }

        NotificationEntity n = new NotificationEntity();
        n.setId(UUID.randomUUID().toString());
        n.setUserId(userId);
        n.setTransactionId(transaction.getId());
        n.setCreatedAt(LocalDateTime.now());
        n.setRead(false);

        String tienStr = formatTien(transaction.getAmount());
        String catName = category != null && category.getName() != null ? category.getName() : "Không phân loại";
        String walletName = wallet != null && wallet.getName() != null ? wallet.getName() : "Ví";
        String noteStr = transaction.getNote() != null && !transaction.getNote().isBlank() ? " (" + transaction.getNote() + ")" : "";
        boolean isRecurring = transaction.getRecurringType() != null && !transaction.getRecurringType().isBlank();

        // Phân loại theo type và note
        String txType = transaction.getType() != null ? transaction.getType().toLowerCase() : "";
        boolean isHoanTien = "thu".equals(txType)
                && transaction.getNote() != null
                && transaction.getNote().toLowerCase().contains("hoàn tiền");
        boolean isChuyen = "chuyen".equals(txType) || "chuyen_tien".equals(txType);

        if (isChuyen) {
            n.setType("giao_dich_chuyen_tien");
            n.setTitle("Chuyển tiền thành công");
            n.setContent("Đã chuyển " + tienStr + " từ " + walletName + noteStr + ".");
        } else if (isHoanTien) {
            n.setType("giao_dich_hoan_tien");
            n.setTitle("Hoàn tiền thành công");
            n.setContent("Nhận hoàn tiền +" + tienStr + " vào " + walletName + noteStr + ".");
        } else if ("thu".equals(txType)) {
            if (isRecurring) {
                n.setType("giao_dich_dinh_ky");
                n.setTitle("Giao dịch định kỳ: Thu nhập");
            } else {
                n.setType("giao_dich_thu");
                n.setTitle("Giao dịch thu nhập thành công");
            }
            n.setContent("Bạn vừa nhận +" + tienStr + " từ " + catName + " vào " + walletName + noteStr + ".");
        } else {
            if (isRecurring) {
                n.setType("giao_dich_dinh_ky");
                n.setTitle("Giao dịch định kỳ: Chi tiêu");
            } else {
                n.setType("giao_dich_chi");
                n.setTitle("Giao dịch chi tiêu thành công");
            }
            n.setContent("Bạn vừa chi -" + tienStr + " cho " + catName + " từ " + walletName + noteStr + ".");
        }

        n.setAmount(transaction.getAmount());
        n.setCategoryName(catName);
        n.setWalletName(walletName);
        notificationRepository.save(n);
    }

    @Transactional
    public void kiemTraVaTaoCanhBaoNganSach(String userId, CategoryEntity category, BigDecimal tongChiThang, BigDecimal hanMuc, String thang) {
        if (category == null || hanMuc == null || hanMuc.compareTo(BigDecimal.ZERO) <= 0) return;
        final BigDecimal tongChi = tongChiThang != null ? tongChiThang : BigDecimal.ZERO;

        double tyLe = tongChi.doubleValue() / hanMuc.doubleValue();
        if (tyLe < 0.8) return;

        String catName = category.getName() != null ? category.getName() : "Danh mục";
        String title;
        String content;

        if (tyLe >= 1.0) {
            BigDecimal vuot = tongChi.subtract(hanMuc);
            title = "Cảnh báo vượt ngân sách: " + catName + " (" + thang + ")";
            content = "Chi tiêu cho danh mục " + catName + " trong tháng này đã đạt " + formatTien(tongChi)
                    + ", vượt ngân sách " + formatTien(hanMuc) + (vuot.compareTo(BigDecimal.ZERO) > 0 ? " (vượt " + formatTien(vuot) + ")." : ".");
        } else {
            int phanTram = (int) Math.round(tyLe * 100);
            title = "Cảnh báo ngân sách " + phanTram + "%: " + catName + " (" + thang + ")";
            content = "Bạn đã sử dụng " + phanTram + "% ngân sách cho danh mục " + catName
                    + " trong tháng này (" + formatTien(tongChi) + " / " + formatTien(hanMuc) + ").";
        }

        if (!notificationRepository.existsByUserIdAndTypeAndTitle(userId, "ngan_sach_canh_bao", title)) {
            NotificationEntity n = new NotificationEntity();
            n.setId(UUID.randomUUID().toString());
            n.setUserId(userId);
            n.setTransactionId(null);
            n.setType("ngan_sach_canh_bao");
            n.setTitle(title);
            n.setContent(content);
            n.setAmount(tongChi);
            n.setCategoryName(catName);
            n.setMetadata(hanMuc.toPlainString());
            n.setRead(false);
            n.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(n);

            if (tyLe >= 1.0 && emailService != null && users != null) {
                try {
                    users.findById(userId).ifPresent(u -> {
                        if (u.getEmail() != null && !u.getEmail().isBlank()) {
                            BigDecimal vuot = tongChi.subtract(hanMuc);
                            int pt = (int) Math.round(tyLe * 100);
                            emailService.guiEmailCanhBaoVuotNganSach(
                                    u.getEmail(),
                                    u.getFullName(),
                                    catName,
                                    hanMuc,
                                    tongChi,
                                    vuot,
                                    pt,
                                    thang
                            );
                        }
                    });
                } catch (Exception ignored) {}
            }
        }
    }

    @Transactional
    public void taoThongBaoMucTieu(String userId, String goalId, String goalName, BigDecimal targetAmount, BigDecimal savedAmount) {
        String title = "Đạt mục tiêu tích luỹ: " + (goalName != null ? goalName : "Mục tiêu");
        if (notificationRepository.existsByUserIdAndTypeAndTitle(userId, "tiet_kiem_muc_tieu", title)) {
            return;
        }
        NotificationEntity n = new NotificationEntity();
        n.setId(UUID.randomUUID().toString());
        n.setUserId(userId);
        n.setTransactionId(null);
        n.setType("tiet_kiem_muc_tieu");
        n.setTitle(title);
        n.setContent("Chúc mừng! Bạn đã đạt 100% mục tiêu tích luỹ " + (goalName != null ? goalName : "")
                + " (" + formatTien(savedAmount) + " / " + formatTien(targetAmount) + "). Xuất sắc!");
        n.setAmount(savedAmount);
        n.setCategoryName("Tiết kiệm");
        String meta = goalId != null ? goalId : (targetAmount != null ? targetAmount.toPlainString() : "");
        n.setMetadata(meta);
        n.setRead(false);
        n.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(n);
    }

    @Transactional
    public void kiemTraVaTaoCanhBaoMucTieu(String userId, GoalEntity goal,
                                          BigDecimal oldSaved, BigDecimal newSaved,
                                          String walletName, String userEmail, String userFullName) {
        if (goal == null || goal.getTargetAmount() == null || goal.getTargetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return;
        }

        BigDecimal target = goal.getTargetAmount();
        int threshold = goal.getAlertThreshold() != null ? goal.getAlertThreshold() : 80;

        double oldRatio = oldSaved != null ? oldSaved.doubleValue() / target.doubleValue() : 0.0;
        double newRatio = newSaved != null ? newSaved.doubleValue() / target.doubleValue() : 0.0;
        int oldPercent = (int) Math.round(oldRatio * 100);
        int newPercent = (int) Math.round(newRatio * 100);

        String goalName = goal.getName() != null ? goal.getName() : "Mục tiêu";

        if (newPercent > 100 && oldPercent <= 100) {
            xuLyVuotMucTieu(userId, goal, goalName, target, newSaved, newPercent, walletName, userEmail, userFullName);
        } else if (newPercent >= 100 && oldPercent < 100) {
            xuLyHoanThanhMucTieu(userId, goal, goalName, target, newSaved, walletName, userEmail, userFullName);
        } else if (newPercent >= threshold && oldPercent < threshold && newPercent < 100) {
            xuLyNguongMucTieu(userId, goal, goalName, target, newSaved, newPercent, threshold, walletName, userEmail, userFullName);
        }
    }

    private void xuLyVuotMucTieu(String userId, GoalEntity goal, String goalName,
                                 BigDecimal target, BigDecimal newSaved, int newPercent,
                                 String walletName, String userEmail, String userFullName) {
        BigDecimal vuot = newSaved.subtract(target);
        String title = "Vượt mục tiêu tiết kiệm: " + goalName;
        String content = "Bạn đã vượt mục tiêu tiết kiệm " + goalName + " " + formatTien(vuot) + ". Hãy tiếp tục duy trì thói quen tài chính tích cực!";

        if (!notificationRepository.existsByUserIdAndTypeAndTitle(userId, "muc_tieu_vuot", title)) {
            NotificationEntity n = new NotificationEntity();
            n.setId(UUID.randomUUID().toString());
            n.setUserId(userId);
            n.setType("muc_tieu_vuot");
            n.setTitle(title);
            n.setContent(content);
            n.setAmount(newSaved);
            n.setCategoryName("Tiết kiệm");
            n.setWalletName(walletName);
            n.setMetadata(goal.getId());
            n.setRead(false);
            n.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(n);
            goal.setAlertSentThreshold(Math.max(goal.getAlertSentThreshold(), 101));

            if (emailService != null && userEmail != null && !userEmail.isBlank()) {
                emailService.guiEmailCanhBaoMucTieu(userEmail, userFullName, goalName, target, newSaved, newPercent, vuot, "vuot");
            }
        }
    }

    private void xuLyHoanThanhMucTieu(String userId, GoalEntity goal, String goalName,
                                      BigDecimal target, BigDecimal newSaved,
                                      String walletName, String userEmail, String userFullName) {
        String title = "Chúc mừng! Hoàn thành mục tiêu: " + goalName;
        String content = "Chúc mừng! Bạn đã hoàn thành mục tiêu tiết kiệm " + goalName + " (" + formatTien(newSaved) + " / " + formatTien(target) + ").";

        if (!notificationRepository.existsByUserIdAndTypeAndTitle(userId, "tiet_kiem_muc_tieu", title)) {
            NotificationEntity n = new NotificationEntity();
            n.setId(UUID.randomUUID().toString());
            n.setUserId(userId);
            n.setType("tiet_kiem_muc_tieu");
            n.setTitle(title);
            n.setContent(content);
            n.setAmount(newSaved);
            n.setCategoryName("Tiết kiệm");
            n.setWalletName(walletName);
            n.setMetadata(goal.getId());
            n.setRead(false);
            n.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(n);
            goal.setAlertSentThreshold(Math.max(goal.getAlertSentThreshold(), 100));

            if (emailService != null && userEmail != null && !userEmail.isBlank()) {
                emailService.guiEmailCanhBaoMucTieu(userEmail, userFullName, goalName, target, newSaved, 100, BigDecimal.ZERO, "hoan-thanh");
            }
        }
    }

    private void xuLyNguongMucTieu(String userId, GoalEntity goal, String goalName,
                                   BigDecimal target, BigDecimal newSaved, int newPercent, int threshold,
                                   String walletName, String userEmail, String userFullName) {
        BigDecimal conThieu = target.subtract(newSaved);
        String title = "Cảnh báo mục tiêu đạt " + newPercent + "%: " + goalName;
        String content = "Bạn đã hoàn thành " + newPercent + "% mục tiêu " + goalName + ". Chỉ còn " + formatTien(conThieu) + " nữa để đạt mục tiêu!";

        if (!notificationRepository.existsByUserIdAndTypeAndTitle(userId, "muc_tieu_nguong", title)) {
            NotificationEntity n = new NotificationEntity();
            n.setId(UUID.randomUUID().toString());
            n.setUserId(userId);
            n.setType("muc_tieu_nguong");
            n.setTitle(title);
            n.setContent(content);
            n.setAmount(newSaved);
            n.setCategoryName("Tiết kiệm");
            n.setWalletName(walletName);
            n.setMetadata(goal.getId());
            n.setRead(false);
            n.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(n);
            goal.setAlertSentThreshold(Math.max(goal.getAlertSentThreshold(), threshold));

            if (emailService != null && userEmail != null && !userEmail.isBlank()) {
                emailService.guiEmailCanhBaoMucTieu(userEmail, userFullName, goalName, target, newSaved, newPercent, conThieu, "nguong");
            }
        }
    }
}
