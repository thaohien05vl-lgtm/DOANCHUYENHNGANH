package com.finora.backend.goal;

import com.finora.backend.data.DuLieuDto.GiaoDichDto;
import com.finora.backend.data.DuLieuDto.MucTieuDto;
import com.finora.backend.entity.AppUser;
import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.GoalContributionEntity;
import com.finora.backend.entity.GoalEntity;
import com.finora.backend.entity.TransactionEntity;
import com.finora.backend.entity.WalletEntity;
import com.finora.backend.goal.MucTieuDtos.GoalContributionDto;
import com.finora.backend.goal.MucTieuDtos.NapTienRequest;
import com.finora.backend.goal.MucTieuDtos.NapTienResponse;
import com.finora.backend.notification.ThongBaoService;
import com.finora.backend.repository.AppUserRepository;
import com.finora.backend.repository.CategoryRepository;
import com.finora.backend.repository.GoalContributionRepository;
import com.finora.backend.repository.GoalRepository;
import com.finora.backend.repository.TransactionRepository;
import com.finora.backend.repository.WalletRepository;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
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
public class MucTieuService {

    private final GoalRepository goals;
    private final GoalContributionRepository goalContributions;
    private final WalletRepository wallets;
    private final CategoryRepository categories;
    private final TransactionRepository transactions;
    private final AppUserRepository users;
    private final ThongBaoService thongBaoService;

    public MucTieuService(GoalRepository goals,
                          GoalContributionRepository goalContributions,
                          WalletRepository wallets,
                          CategoryRepository categories,
                          TransactionRepository transactions,
                          AppUserRepository users,
                          ThongBaoService thongBaoService) {
        this.goals = goals;
        this.goalContributions = goalContributions;
        this.wallets = wallets;
        this.categories = categories;
        this.transactions = transactions;
        this.users = users;
        this.thongBaoService = thongBaoService;
    }

    private static String formatTien(BigDecimal amount) {
        if (amount == null) return "0đ";
        DecimalFormatSymbols symbols = new DecimalFormatSymbols(Locale.of("vi", "VN"));
        symbols.setGroupingSeparator('.');
        DecimalFormat df = new DecimalFormat("#,###", symbols);
        return df.format(amount) + "đ";
    }

    @Transactional
    public NapTienResponse napTienVaoMucTieu(String userId, String goalId, NapTienRequest request) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        if (request == null || request.soTien() == null || request.soTien().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số tiền nạp phải lớn hơn 0.");
        }
        if (request.maVi() == null || request.maVi().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui lòng chọn ví nguồn trích tiền.");
        }

        GoalEntity goal = goals.findById(goalId)
                .filter(g -> userId.equals(g.getUserId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mục tiêu tiết kiệm."));

        WalletEntity wallet = wallets.findById(request.maVi())
                .filter(w -> userId.equals(w.getUserId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ví nguồn."));

        // Chống gửi trùng lặp / double-click nạp tiền (trong vòng 1.5 giây với cùng số tiền và ví)
        LocalDateTime ganDay = LocalDateTime.now().minusSeconds(2);
        List<GoalContributionEntity> lichSuGanDay = goalContributions.findAllByUserIdAndGoalIdOrderByCreatedAtDesc(userId, goalId);
        boolean duplicate = lichSuGanDay.stream().anyMatch(c ->
                c.getWalletId().equals(wallet.getId())
                && c.getAmount().compareTo(request.soTien()) == 0
                && c.getCreatedAt().isAfter(ganDay));
        if (duplicate) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Giao dịch nạp tiền đang được xử lý, vui lòng không nhấn liên tục.");
        }

        // Tính số dư khả dụng hiện tại của ví nguồn
        List<TransactionEntity> walletTxs = transactions.findAllByUserId(userId).stream()
                .filter(t -> wallet.getId().equals(t.getWalletId()))
                .toList();
        BigDecimal tongThu = walletTxs.stream()
                .filter(t -> "thu".equalsIgnoreCase(t.getType()))
                .map(TransactionEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tongChi = walletTxs.stream()
                .filter(t -> "chi".equalsIgnoreCase(t.getType()))
                .map(TransactionEntity::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal soDuKhaDung = wallet.getInitialBalance().add(tongThu).subtract(tongChi);

        if (request.soTien().compareTo(soDuKhaDung) > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Số dư khả dụng của ví " + wallet.getName() + " không đủ (" + formatTien(soDuKhaDung) + "). Vui lòng nạp thêm hoặc chọn ví khác.");
        }

        // Tìm hoặc tạo danh mục "Tiết kiệm"
        CategoryEntity category = categories.findAllByUserId(userId).stream()
                .filter(c -> "chi".equalsIgnoreCase(c.getType()) && (c.getName().toLowerCase().contains("tiết kiệm") || "dm-tietkiem".equals(c.getId())))
                .findFirst()
                .orElseGet(() -> {
                    CategoryEntity newCat = new CategoryEntity();
                    newCat.setId("dm-tietkiem-" + UUID.randomUUID().toString().substring(0, 8));
                    newCat.setUserId(userId);
                    newCat.setName("Tiết kiệm");
                    newCat.setType("chi");
                    newCat.setIcon("piggy-bank");
                    newCat.setColor("#14946F");
                    categories.save(newCat);
                    return newCat;
                });

        // 1. Tạo giao dịch tài chính trừ tiền từ ví nguồn
        String ghiChuGiaoDich = "Nạp mục tiêu: " + goal.getName() + (request.ghiChu() != null && !request.ghiChu().isBlank() ? " - " + request.ghiChu().trim() : "");
        TransactionEntity tx = new TransactionEntity();
        tx.setId(UUID.randomUUID().toString());
        tx.setUserId(userId);
        tx.setType("chi");
        tx.setAmount(request.soTien());
        tx.setCategoryId(category.getId());
        tx.setWalletId(wallet.getId());
        tx.setTransactionDate(LocalDate.now());
        tx.setNote(ghiChuGiaoDich);
        transactions.save(tx);

        // 2. Cập nhật số tiền tích lũy của mục tiêu
        BigDecimal oldSaved = goal.getSavedAmount() != null ? goal.getSavedAmount() : BigDecimal.ZERO;
        BigDecimal newSaved = oldSaved.add(request.soTien());
        goal.setSavedAmount(newSaved);
        goals.save(goal);

        // 3. Ghi nhận lịch sử đóng góp vào mục tiêu
        GoalContributionEntity contrib = new GoalContributionEntity();
        contrib.setId(UUID.randomUUID().toString());
        contrib.setUserId(userId);
        contrib.setGoalId(goal.getId());
        contrib.setWalletId(wallet.getId());
        contrib.setWalletName(wallet.getName());
        contrib.setAmount(request.soTien());
        contrib.setSavedAmountAfter(newSaved);
        contrib.setNote(request.ghiChu() != null ? request.ghiChu().trim() : "");
        contrib.setCreatedAt(LocalDateTime.now());
        goalContributions.save(contrib);

        // 4. Kiểm tra cảnh báo ngưỡng & hoàn thành & gửi Gmail
        AppUser user = users.findById(userId).orElse(null);
        String userEmail = user != null ? user.getEmail() : null;
        String userFullName = user != null ? user.getFullName() : null;

        if (thongBaoService != null) {
            thongBaoService.kiemTraVaTaoCanhBaoMucTieu(userId, goal, oldSaved, newSaved, wallet.getName(), userEmail, userFullName);
        }

        // Tạo thông điệp phản hồi thân thiện
        int phanTram = goal.getTargetAmount() != null && goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0
                ? (int) Math.round((newSaved.doubleValue() / goal.getTargetAmount().doubleValue()) * 100)
                : 0;
        String thongDiep;
        if (phanTram > 100) {
            BigDecimal vuot = newSaved.subtract(goal.getTargetAmount());
            thongDiep = "Nạp tiền thành công! Bạn đã vượt mục tiêu " + goal.getName() + " " + formatTien(vuot) + " (" + phanTram + "%).";
        } else if (phanTram == 100) {
            thongDiep = "Chúc mừng! Bạn đã hoàn thành 100% mục tiêu " + goal.getName() + "!";
        } else {
            thongDiep = "Nạp " + formatTien(request.soTien()) + " thành công vào mục tiêu " + goal.getName() + " (Đạt " + phanTram + "%).";
        }

        MucTieuDto mucTieuDto = new MucTieuDto(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getSavedAmount(),
                goal.getDueDate() != null ? goal.getDueDate().toString() : "",
                goal.getColor(),
                goal.getAlertThreshold()
        );

        GiaoDichDto giaoDichDto = new GiaoDichDto(
                tx.getId(),
                tx.getType(),
                tx.getAmount(),
                tx.getCategoryId(),
                tx.getWalletId(),
                tx.getTransactionDate().toString(),
                tx.getNote(),
                null
        );

        GoalContributionDto contribDto = new GoalContributionDto(
                contrib.getId(),
                contrib.getGoalId(),
                contrib.getWalletId(),
                contrib.getWalletName(),
                contrib.getAmount(),
                contrib.getSavedAmountAfter(),
                contrib.getNote(),
                contrib.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
        );

        boolean datNguong = phanTram >= (goal.getAlertThreshold() != null ? goal.getAlertThreshold() : 80);

        return new NapTienResponse(mucTieuDto, giaoDichDto, contribDto, thongDiep, datNguong);
    }

    @Transactional(readOnly = true)
    public List<GoalContributionDto> layLichSuDongGop(String userId, String goalId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        return goalContributions.findAllByUserIdAndGoalIdOrderByCreatedAtDesc(userId, goalId).stream()
                .map(c -> new GoalContributionDto(
                        c.getId(),
                        c.getGoalId(),
                        c.getWalletId(),
                        c.getWalletName(),
                        c.getAmount(),
                        c.getSavedAmountAfter(),
                        c.getNote(),
                        c.getCreatedAt() != null ? c.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : ""
                ))
                .toList();
    }

    @Transactional
    public MucTieuDto capNhatNguongCanhBao(String userId, String goalId, int nguong) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        if (nguong <= 0 || nguong > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngưỡng cảnh báo phải nằm trong khoảng 1% - 200%.");
        }

        GoalEntity goal = goals.findById(goalId)
                .filter(g -> userId.equals(g.getUserId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mục tiêu tiết kiệm."));

        goal.setAlertThreshold(nguong);
        // Reset lại mốc đã gửi nếu ngưỡng mới cao hơn tiến độ hiện tại
        goals.save(goal);

        return new MucTieuDto(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getSavedAmount(),
                goal.getDueDate() != null ? goal.getDueDate().toString() : "",
                goal.getColor(),
                goal.getAlertThreshold()
        );
    }
}
