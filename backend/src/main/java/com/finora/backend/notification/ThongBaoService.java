package com.finora.backend.notification;

import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.NotificationEntity;
import com.finora.backend.entity.TransactionEntity;
import com.finora.backend.entity.WalletEntity;
import com.finora.backend.repository.NotificationRepository;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ThongBaoService {

    private final NotificationRepository notificationRepository;

    public ThongBaoService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    private static String formatTien(BigDecimal amount) {
        if (amount == null) return "0đ";
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.of("vi", "VN"));
        symbols.setGroupingSeparator('.');
        DecimalFormat df = new DecimalFormat("#,###", symbols);
        return df.format(amount) + "đ";
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
            return; // Đã có thông báo cho giao dịch này, tránh tạo lặp
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

        if ("thu".equalsIgnoreCase(transaction.getType())) {
            n.setType("giao_dich_thu");
            n.setTitle("Giao dịch thu nhập thành công");
            n.setContent("Bạn vừa ghi nhận khoản thu " + tienStr + " từ " + catName + noteStr + " vào ví " + walletName + ".");
        } else {
            n.setType("giao_dich_chi");
            n.setTitle("Giao dịch chi tiêu thành công");
            n.setContent("Bạn vừa ghi nhận khoản chi " + tienStr + " cho " + catName + noteStr + " từ ví " + walletName + ".");
        }

        notificationRepository.save(n);
    }

    @Transactional
    public void kiemTraVaTaoCanhBaoNganSach(String userId, CategoryEntity category, BigDecimal tongChiThang, BigDecimal hanMuc, String thang) {
        if (category == null || hanMuc == null || hanMuc.compareTo(BigDecimal.ZERO) <= 0 || tongChiThang == null) return;

        double tyLe = tongChiThang.doubleValue() / hanMuc.doubleValue();
        if (tyLe < 0.8) return; // Chưa tới ngưỡng 80%

        String catName = category.getName() != null ? category.getName() : "Danh mục";
        String title;
        String content;

        if (tyLe >= 1.0) {
            BigDecimal vuot = tongChiThang.subtract(hanMuc);
            title = "Cảnh báo vượt ngân sách: " + catName + " (" + thang + ")";
            content = "Chi tiêu cho danh mục " + catName + " trong tháng này đã đạt " + formatTien(tongChiThang)
                    + ", vượt ngân sách " + formatTien(hanMuc) + (vuot.compareTo(BigDecimal.ZERO) > 0 ? " (vượt " + formatTien(vuot) + ")." : ".");
        } else {
            int phanTram = (int) Math.round(tyLe * 100);
            title = "Cảnh báo ngân sách " + phanTram + "%: " + catName + " (" + thang + ")";
            content = "Bạn đã sử dụng " + phanTram + "% ngân sách cho danh mục " + catName
                    + " trong tháng này (" + formatTien(tongChiThang) + " / " + formatTien(hanMuc) + ").";
        }

        // Kiểm tra chống spam thông báo cùng mốc cảnh báo trong cùng chu kỳ tháng
        if (!notificationRepository.existsByUserIdAndTypeAndTitle(userId, "ngan_sach_canh_bao", title)) {
            NotificationEntity n = new NotificationEntity();
            n.setId(UUID.randomUUID().toString());
            n.setUserId(userId);
            n.setTransactionId(null);
            n.setType("ngan_sach_canh_bao");
            n.setTitle(title);
            n.setContent(content);
            n.setRead(false);
            n.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(n);
        }
    }

    private ThongBaoDto mapDto(NotificationEntity e) {
        return new ThongBaoDto(
                e.getId(),
                e.getTransactionId(),
                e.getType(),
                e.getTitle(),
                e.getContent(),
                e.isRead(),
                e.getCreatedAt() != null ? e.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : ""
        );
    }
}

