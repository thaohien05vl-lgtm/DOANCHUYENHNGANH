package com.finora.backend.goal;

import com.finora.backend.entity.AppUser;
import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.GoalContributionEntity;
import com.finora.backend.entity.GoalEntity;
import com.finora.backend.entity.TransactionEntity;
import com.finora.backend.entity.WalletEntity;
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
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class MucTieuServiceTest {

    private GoalRepository goals;
    private GoalContributionRepository goalContributions;
    private WalletRepository wallets;
    private CategoryRepository categories;
    private TransactionRepository transactions;
    private AppUserRepository users;
    private ThongBaoService thongBaoService;
    private MucTieuService mucTieuService;

    private final String userId = "user-123";
    private GoalEntity sampleGoal;
    private WalletEntity sampleWallet;

    @BeforeEach
    void setUp() {
        goals = Mockito.mock(GoalRepository.class);
        goalContributions = Mockito.mock(GoalContributionRepository.class);
        wallets = Mockito.mock(WalletRepository.class);
        categories = Mockito.mock(CategoryRepository.class);
        transactions = Mockito.mock(TransactionRepository.class);
        users = Mockito.mock(AppUserRepository.class);
        thongBaoService = Mockito.mock(ThongBaoService.class);

        mucTieuService = new MucTieuService(
                goals, goalContributions, wallets, categories, transactions, users, thongBaoService
        );

        sampleGoal = new GoalEntity();
        sampleGoal.setId("goal-1");
        sampleGoal.setUserId(userId);
        sampleGoal.setName("Mua laptop");
        sampleGoal.setTargetAmount(BigDecimal.valueOf(20000000));
        sampleGoal.setSavedAmount(BigDecimal.valueOf(5000000));
        sampleGoal.setDueDate(LocalDate.now().plusMonths(6));
        sampleGoal.setColor("#14946F");
        sampleGoal.setAlertThreshold(80);

        sampleWallet = new WalletEntity();
        sampleWallet.setId("wallet-1");
        sampleWallet.setUserId(userId);
        sampleWallet.setName("Ví tiền mặt");
        sampleWallet.setType("tien-mat");
        sampleWallet.setInitialBalance(BigDecimal.valueOf(10000000));
        sampleWallet.setColor("#2F6FDB");

        AppUser user = new AppUser();
        user.setId(userId);
        user.setEmail("test@gmail.com");
        user.setFullName("Nguyen Van A");

        when(goals.findById("goal-1")).thenReturn(Optional.of(sampleGoal));
        when(wallets.findById("wallet-1")).thenReturn(Optional.of(sampleWallet));
        when(users.findById(userId)).thenReturn(Optional.of(user));
        when(categories.save(any(CategoryEntity.class))).thenAnswer(i -> i.getArgument(0));
        when(goalContributions.findAllByUserIdAndGoalIdOrderByCreatedAtDesc(eq(userId), eq("goal-1")))
                .thenReturn(Collections.emptyList());
    }

    @Test
    void napTienVaoMucTieu_ThanhCong() {
        // Ví có ban đầu 10.000.000, nạp 2.000.000 vào mục tiêu
        NapTienRequest req = new NapTienRequest(BigDecimal.valueOf(2000000), "wallet-1", "Trích tiết kiệm");

        NapTienResponse resp = mucTieuService.napTienVaoMucTieu(userId, "goal-1", req);

        assertNotNull(resp);
        // Kiểm tra số tiền sau nạp tăng từ 5M lên 7M
        assertEquals(BigDecimal.valueOf(7000000), resp.mucTieu().daTietKiem());
        assertEquals("goal-1", resp.dongGop().goalId());
        assertEquals("wallet-1", resp.dongGop().walletId());
        assertEquals(BigDecimal.valueOf(2000000), resp.dongGop().amount());

        // Xác nhận transaction được lưu
        verify(transactions, times(1)).save(any(TransactionEntity.class));
        // Xác nhận goal được lưu
        verify(goals, times(1)).save(sampleGoal);
        // Xác nhận contribution được lưu
        verify(goalContributions, times(1)).save(any(GoalContributionEntity.class));
        // Xác nhận kiểm tra cảnh báo được gọi
        verify(thongBaoService, times(1)).kiemTraVaTaoCanhBaoMucTieu(
                eq(userId), eq(sampleGoal), eq(BigDecimal.valueOf(5000000)), eq(BigDecimal.valueOf(7000000)),
                eq("Ví tiền mặt"), eq("test@gmail.com"), eq("Nguyen Van A")
        );
    }

    @Test
    void napTienVaoMucTieu_SoTienAmHoacBangKhong_NemLoi() {
        NapTienRequest reqAm = new NapTienRequest(BigDecimal.valueOf(-100000), "wallet-1", "Lỗi");
        assertThrows(ResponseStatusException.class, () ->
                mucTieuService.napTienVaoMucTieu(userId, "goal-1", reqAm));

        NapTienRequest req0 = new NapTienRequest(BigDecimal.ZERO, "wallet-1", "Lỗi");
        assertThrows(ResponseStatusException.class, () ->
                mucTieuService.napTienVaoMucTieu(userId, "goal-1", req0));
    }

    @Test
    void napTienVaoMucTieu_SoDuKhongDu_NemLoi() {
        // Ví chỉ có 10.000.000, yêu cầu nạp 15.000.000
        NapTienRequest req = new NapTienRequest(BigDecimal.valueOf(15000000), "wallet-1", "Quá số dư");

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () ->
                mucTieuService.napTienVaoMucTieu(userId, "goal-1", req));

        assertTrue(ex.getReason().contains("không đủ"));
    }

    @Test
    void napTienVaoMucTieu_DatNguongCanhBao() {
        // Mục tiêu 20.000.000, hiện có 15.000.000 (75%). Nạp thêm 2.000.000 -> 17.000.000 (85% >= ngưỡng 80%)
        sampleGoal.setSavedAmount(BigDecimal.valueOf(15000000));
        NapTienRequest req = new NapTienRequest(BigDecimal.valueOf(2000000), "wallet-1", "Cán mốc 85%");

        NapTienResponse resp = mucTieuService.napTienVaoMucTieu(userId, "goal-1", req);

        assertTrue(resp.datNguong());
        assertEquals(BigDecimal.valueOf(17000000), resp.mucTieu().daTietKiem());
    }

    @Test
    void napTienVaoMucTieu_HoanThanhVaVuotMucTieu() {
        // Mục tiêu 20.000.000, hiện có 19.000.000. Nạp thêm 2.000.000 -> 21.000.000 (105% vượt)
        sampleGoal.setSavedAmount(BigDecimal.valueOf(19000000));
        NapTienRequest req = new NapTienRequest(BigDecimal.valueOf(2000000), "wallet-1", "Vượt mục tiêu");

        NapTienResponse resp = mucTieuService.napTienVaoMucTieu(userId, "goal-1", req);

        assertTrue(resp.datNguong());
        assertTrue(resp.thongDiep().contains("vượt mục tiêu"));
        assertEquals(BigDecimal.valueOf(21000000), resp.mucTieu().daTietKiem());
    }

    @Test
    void capNhatNguongCanhBao_HopLe() {
        var res = mucTieuService.capNhatNguongCanhBao(userId, "goal-1", 90);
        assertEquals(90, res.nguongCanhBao());
        assertEquals(90, sampleGoal.getAlertThreshold());
        verify(goals, times(1)).save(sampleGoal);
    }

    @Test
    void capNhatNguongCanhBao_NgoaiKhoang_NemLoi() {
        assertThrows(ResponseStatusException.class, () ->
                mucTieuService.capNhatNguongCanhBao(userId, "goal-1", 0));
        assertThrows(ResponseStatusException.class, () ->
                mucTieuService.capNhatNguongCanhBao(userId, "goal-1", 250));
    }
}
