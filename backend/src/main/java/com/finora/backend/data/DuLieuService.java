package com.finora.backend.data;

import com.finora.backend.data.DuLieuDto.DanhMucDto;
import com.finora.backend.data.DuLieuDto.GiaoDichDto;
import com.finora.backend.data.DuLieuDto.MucTieuDto;
import com.finora.backend.data.DuLieuDto.NganSachDto;
import com.finora.backend.data.DuLieuDto.ViDto;
import com.finora.backend.entity.BudgetEntity;
import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.GoalEntity;
import com.finora.backend.entity.OwnedEntity;
import com.finora.backend.entity.TransactionEntity;
import com.finora.backend.entity.WalletEntity;
import com.finora.backend.notification.ThongBaoService;
import com.finora.backend.repository.BudgetRepository;
import com.finora.backend.repository.CategoryRepository;
import com.finora.backend.repository.GoalRepository;
import com.finora.backend.repository.TransactionRepository;
import com.finora.backend.repository.WalletRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class DuLieuService {
    private final WalletRepository wallets;
    private final CategoryRepository categories;
    private final TransactionRepository transactions;
    private final BudgetRepository budgets;
    private final GoalRepository goals;
    private final ThongBaoService thongBaoService;

    @org.springframework.beans.factory.annotation.Autowired
    public DuLieuService(WalletRepository wallets, CategoryRepository categories,
                         TransactionRepository transactions, BudgetRepository budgets, GoalRepository goals,
                         ThongBaoService thongBaoService) {
        this.wallets = wallets;
        this.categories = categories;
        this.transactions = transactions;
        this.budgets = budgets;
        this.goals = goals;
        this.thongBaoService = thongBaoService;
    }

    public DuLieuService(WalletRepository wallets, CategoryRepository categories,
                         TransactionRepository transactions, BudgetRepository budgets, GoalRepository goals) {
        this(wallets, categories, transactions, budgets, goals, null);
    }

    @Transactional(readOnly = true)
    public DuLieuDto layDuLieu(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        List<ViDto> viList = wallets.findAllByUserId(userId).stream()
                .filter(Objects::nonNull)
                .map(x -> new ViDto(x.getId(), x.getName(), x.getType(), x.getInitialBalance(), x.getColor()))
                .toList();

        List<DanhMucDto> dmList = categories.findAllByUserId(userId).stream()
                .filter(Objects::nonNull)
                .map(x -> new DanhMucDto(x.getId(), x.getName(), x.getType(), x.getIcon(), x.getColor()))
                .toList();

        List<GiaoDichDto> gdList = transactions.findAllByUserId(userId).stream()
                .filter(Objects::nonNull)
                .map(x -> new GiaoDichDto(
                        x.getId(),
                        x.getType(),
                        x.getAmount(),
                        x.getCategoryId(),
                        x.getWalletId(),
                        x.getTransactionDate() == null ? "" : x.getTransactionDate().toString(),
                        x.getNote() == null ? "" : x.getNote(),
                        x.getRecurringType()))
                .toList();

        List<NganSachDto> nsList = budgets.findAllByUserId(userId).stream()
                .filter(Objects::nonNull)
                .map(x -> new NganSachDto(x.getId(), x.getCategoryId(), x.getLimitAmount()))
                .toList();

        List<MucTieuDto> mtList = goals.findAllByUserId(userId).stream()
                .filter(Objects::nonNull)
                .map(x -> new MucTieuDto(
                        x.getId(),
                        x.getName(),
                        x.getTargetAmount(),
                        x.getSavedAmount(),
                        x.getDueDate() == null ? "" : x.getDueDate().toString(),
                        x.getColor()))
                .toList();

        return new DuLieuDto(viList, dmList, gdList, nsList, mtList);
    }

    @Transactional
    public DuLieuDto luuDuLieu(String userId, DuLieuDto input) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        List<ViDto> vi = list(input == null ? null : input.vi());
        List<DanhMucDto> dms = list(input == null ? null : input.danhMuc());
        List<GiaoDichDto> gds = list(input == null ? null : input.giaoDich());
        List<NganSachDto> nss = list(input == null ? null : input.nganSach());
        List<MucTieuDto> mts = list(input == null ? null : input.mucTieu());

        Set<String> walletIds = uniqueIds(vi.stream().map(v -> v.id()).toList(), "ví");
        Set<String> categoryIds = uniqueIds(dms.stream().map(d -> d.id()).toList(), "danh mục");
        Map<String, String> categoryTypes = new HashMap<>();
        for (DanhMucDto category : dms) {
            categoryTypes.put(category.id(), category.loai());
        }
        uniqueIds(gds.stream().map(g -> g.id()).toList(), "giao dịch");
        uniqueIds(nss.stream().map(n -> n.id()).toList(), "ngân sách");
        uniqueIds(mts.stream().map(m -> m.id()).toList(), "mục tiêu");

        for (GiaoDichDto gd : gds) {
            require(categoryIds.contains(gd.maDanhMuc()), "Danh mục của giao dịch không hợp lệ.");
            require(walletIds.contains(gd.maVi()), "Ví của giao dịch không hợp lệ.");
            require(Objects.equals(categoryTypes.get(gd.maDanhMuc()), gd.loai()), "Loại giao dịch phải khớp với loại danh mục.");
            require(gd.soTien() != null && gd.soTien().compareTo(BigDecimal.ZERO) > 0, "Số tiền giao dịch phải lớn hơn 0.");
            parseDate(gd.ngay(), "Ngày giao dịch không hợp lệ.");
        }
        for (NganSachDto ns : nss) {
            require(categoryIds.contains(ns.maDanhMuc()), "Danh mục ngân sách không hợp lệ.");
            require("chi".equals(categoryTypes.get(ns.maDanhMuc())), "Ngân sách chỉ áp dụng cho danh mục chi.");
            require(ns.hanMuc() != null && ns.hanMuc().compareTo(BigDecimal.ZERO) >= 0, "Hạn mức không hợp lệ.");
        }

        sync(vi, wallets.findAllByUserId(userId), v -> v.id(), WalletEntity::new, (e, x) -> {
            e.setName(text(x.ten(), "Ví", 40));
            e.setType(enumValue(x.loai(), Set.of("tien-mat", "ngan-hang", "vi-dien-tu"), "Loại ví không hợp lệ."));
            e.setInitialBalance(nonNegative(x.soDuBanDau(), "Số dư ban đầu không hợp lệ."));
            e.setColor(color(x.mau()));
        }, wallets, userId);

        sync(dms, categories.findAllByUserId(userId), d -> d.id(), CategoryEntity::new, (e, x) -> {
            e.setName(text(x.ten(), "Danh mục", 40));
            e.setType(enumValue(x.loai(), Set.of("thu", "chi"), "Loại danh mục không hợp lệ."));
            e.setIcon(text(x.bieuTuong(), "circle", 40));
            e.setColor(color(x.mau()));
        }, categories, userId);

        sync(gds, transactions.findAllByUserId(userId), g -> g.id(), TransactionEntity::new, (e, x) -> {
            e.setType(enumValue(x.loai(), Set.of("thu", "chi"), "Loại giao dịch không hợp lệ."));
            e.setAmount(nonNegative(x.soTien(), "Số tiền không hợp lệ."));
            e.setCategoryId(x.maDanhMuc());
            e.setWalletId(x.maVi());
            e.setTransactionDate(parseDate(x.ngay(), "Ngày giao dịch không hợp lệ."));
            e.setNote(limitNullable(x.ghiChu(), 1200));
            e.setRecurringType(x.dinhKy() == null || x.dinhKy().isBlank() ? null : enumValue(x.dinhKy(), Set.of("ngay", "tuan", "thang"), "Chu kỳ lặp không hợp lệ."));
        }, transactions, userId);

        sync(nss, budgets.findAllByUserId(userId), n -> n.id(), BudgetEntity::new, (e, x) -> {
            e.setCategoryId(x.maDanhMuc());
            e.setLimitAmount(nonNegative(x.hanMuc(), "Hạn mức không hợp lệ."));
        }, budgets, userId);

        sync(mts, goals.findAllByUserId(userId), m -> m.id(), GoalEntity::new, (e, x) -> {
            e.setName(text(x.ten(), "Mục tiêu", 80));
            e.setTargetAmount(nonNegative(x.soTienMucTieu(), "Số tiền mục tiêu không hợp lệ."));
            e.setSavedAmount(nonNegative(x.daTietKiem(), "Số tiền đã tiết kiệm không hợp lệ."));
            e.setDueDate(parseDate(x.han(), "Hạn mục tiêu không hợp lệ."));
            e.setColor(color(x.mau()));
        }, goals, userId);

        // Tạo thông báo giao dịch và kiểm tra cảnh báo ngân sách
        if (thongBaoService != null) {
            Map<String, CategoryEntity> catMap = new HashMap<>();
            for (CategoryEntity c : categories.findAllByUserId(userId)) {
                catMap.put(c.getId(), c);
            }
            Map<String, WalletEntity> walMap = new HashMap<>();
            for (WalletEntity w : wallets.findAllByUserId(userId)) {
                walMap.put(w.getId(), w);
            }

            List<TransactionEntity> allTx = transactions.findAllByUserId(userId);
            for (TransactionEntity tx : allTx) {
                thongBaoService.taoThongBaoGiaoDich(userId, tx, catMap.get(tx.getCategoryId()), walMap.get(tx.getWalletId()));
            }

            LocalDate now = LocalDate.now();
            String currentMonth = String.format("%04d-%02d", now.getYear(), now.getMonthValue());
            for (BudgetEntity b : budgets.findAllByUserId(userId)) {
                CategoryEntity cat = catMap.get(b.getCategoryId());
                if (cat != null) {
                    BigDecimal tongChiThang = allTx.stream()
                            .filter(t -> "chi".equalsIgnoreCase(t.getType())
                                    && b.getCategoryId().equals(t.getCategoryId())
                                    && t.getTransactionDate() != null
                                    && t.getTransactionDate().getYear() == now.getYear()
                                    && t.getTransactionDate().getMonthValue() == now.getMonthValue())
                            .map(TransactionEntity::getAmount)
                            .filter(Objects::nonNull)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    thongBaoService.kiemTraVaTaoCanhBaoNganSach(userId, cat, tongChiThang, b.getLimitAmount(), currentMonth);
                }
            }
        }

        return layDuLieu(userId);
    }

    private <D, E extends OwnedEntity> void sync(
            List<D> incoming, List<E> existing, Function<D, String> idGetter,
            Supplier<E> factory, BiConsumer<E, D> mapper,
            JpaRepository<E, String> repository, String userId) {
        Map<String, E> current = new HashMap<>();
        for (E entity : existing) {
            if (entity != null && entity.getId() != null) {
                current.put(entity.getId(), entity);
            }
        }

        Set<String> retained = new HashSet<>();
        List<E> save = new ArrayList<>();
        for (D item : incoming) {
            String rawId = idGetter.apply(item);
            String safeId = id(rawId);
            retained.add(safeId);
            E entity = current.get(safeId);
            if (entity == null) {
                E collision = repository.findById(safeId).orElse(null);
                if (collision != null && !userId.equals(collision.getUserId())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không được sử dụng mã dữ liệu của tài khoản khác.");
                }
                entity = collision == null ? factory.get() : collision;
            }
            entity.setId(safeId);
            entity.setUserId(userId);
            mapper.accept(entity, item);
            save.add(entity);
        }
        if (!save.isEmpty()) {
            repository.saveAll(save);
        }
        List<E> removed = existing.stream()
                .filter(entity -> entity != null && entity.getId() != null && !retained.contains(entity.getId()))
                .toList();
        if (!removed.isEmpty()) {
            repository.deleteAll(removed);
        }
    }

    @Transactional
    public void taoDuLieuMacDinh(String userId) {
        if (!wallets.findAllByUserId(userId).isEmpty()) return;
        String[][] walletData = {
                {"Tiền mặt", "tien-mat", "#D79A22"},
                {"Ví điện tử", "vi-dien-tu", "#DB2777"},
                {"Ngân hàng", "ngan-hang", "#14946F"}
        };
        for (String[] w : walletData) {
            WalletEntity e = new WalletEntity();
            e.setId(UUID.randomUUID().toString());
            e.setUserId(userId);
            e.setName(w[0]);
            e.setType(w[1]);
            e.setColor(w[2]);
            e.setInitialBalance(BigDecimal.ZERO);
            wallets.save(e);
        }
        String[][] categoryData = {
                {"Ăn uống", "chi", "utensils", "#E5593F"},
                {"Mua sắm", "chi", "shopping-bag", "#D79A22"},
                {"Đi lại", "chi", "car", "#2F6FDB"},
                {"Hóa đơn", "chi", "file-text", "#0891B2"},
                {"Nhà cửa", "chi", "home", "#F59E0B"},
                {"Học tập", "chi", "book", "#8B5CF6"},
                {"Sức khỏe", "chi", "heart", "#14946F"},
                {"Giải trí", "chi", "game", "#0891B2"},
                {"Lương", "thu", "banknote", "#14946F"},
                {"Thưởng", "thu", "gift", "#D79A22"},
                {"Làm thêm", "thu", "briefcase", "#2F6FDB"}
        };
        for (String[] d : categoryData) {
            CategoryEntity e = new CategoryEntity();
            e.setId(UUID.randomUUID().toString());
            e.setUserId(userId);
            e.setName(d[0]);
            e.setType(d[1]);
            e.setIcon(d[2]);
            e.setColor(d[3]);
            categories.save(e);
        }
    }

    private static <T> List<T> list(List<T> input) {
        return input == null ? List.of() : input;
    }

    private static String id(String value) {
        if (value == null || value.isBlank() || value.length() > 64) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã dữ liệu không hợp lệ.");
        }
        return value;
    }

    private static Set<String> uniqueIds(List<String> values, String type) {
        Set<String> ids = new HashSet<>();
        for (String value : values) {
            if (!ids.add(id(value))) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã " + type + " bị trùng.");
            }
        }
        return ids;
    }

    private static void require(boolean condition, String message) {
        if (!condition) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    private static BigDecimal nonNegative(BigDecimal x, String message) {
        require(x != null && x.compareTo(BigDecimal.ZERO) >= 0, message);
        return x;
    }

    private static LocalDate parseDate(String x, String message) {
        try {
            return LocalDate.parse(x);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
    }

    private static String text(String x, String fallback, int max) {
        String v = (x == null || x.isBlank()) ? fallback : x.trim();
        if (v.length() > max) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Một trường văn bản vượt quá độ dài cho phép.");
        }
        return v;
    }

    private static String limitNullable(String x, int max) {
        if (x == null) return null;
        if (x.length() > max) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ghi chú quá dài.");
        }
        return x;
    }

    private static String color(String x) {
        String v = (x == null || x.isBlank()) ? "#14946F" : x;
        if (!v.matches("^#[0-9A-Fa-f]{6}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã màu không hợp lệ.");
        }
        return v;
    }

    private static String enumValue(String value, Set<String> allowed, String message) {
        require(value != null && allowed.contains(value), message);
        return value;
    }
}
