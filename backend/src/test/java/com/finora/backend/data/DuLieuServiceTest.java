package com.finora.backend.data;

import com.finora.backend.data.DuLieuDto.DanhMucDto;
import com.finora.backend.data.DuLieuDto.GiaoDichDto;
import com.finora.backend.data.DuLieuDto.ViDto;
import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.WalletEntity;
import com.finora.backend.repository.BudgetRepository;
import com.finora.backend.repository.CategoryRepository;
import com.finora.backend.repository.GoalRepository;
import com.finora.backend.repository.TransactionRepository;
import com.finora.backend.repository.WalletRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DuLieuServiceTest {
    private WalletRepository wallets;
    private CategoryRepository categories;
    private TransactionRepository transactions;
    private BudgetRepository budgets;
    private GoalRepository goals;
    private DuLieuService duLieuService;

    @BeforeEach
    void setUp() {
        wallets = Mockito.mock(WalletRepository.class);
        categories = Mockito.mock(CategoryRepository.class);
        transactions = Mockito.mock(TransactionRepository.class);
        budgets = Mockito.mock(BudgetRepository.class);
        goals = Mockito.mock(GoalRepository.class);
        duLieuService = new DuLieuService(wallets, categories, transactions, budgets, goals);
    }

    @Test
    void testLayDuLieuUserIdNull() {
        assertThrows(ResponseStatusException.class, () -> duLieuService.layDuLieu(null));
        assertThrows(ResponseStatusException.class, () -> duLieuService.layDuLieu(""));
    }

    @Test
    void testLayDuLieuThanhCong() {
        WalletEntity w = new WalletEntity();
        w.setId("w-1");
        w.setUserId("u-1");
        w.setName("Tiền mặt");
        w.setType("tien-mat");
        w.setInitialBalance(BigDecimal.valueOf(1000000));
        w.setColor("#D79A22");

        CategoryEntity c = new CategoryEntity();
        c.setId("c-1");
        c.setUserId("u-1");
        c.setName("Ăn uống");
        c.setType("chi");
        c.setIcon("utensils");
        c.setColor("#E5593F");

        when(wallets.findAllByUserId("u-1")).thenReturn(List.of(w));
        when(categories.findAllByUserId("u-1")).thenReturn(List.of(c));
        when(transactions.findAllByUserId("u-1")).thenReturn(List.of());
        when(budgets.findAllByUserId("u-1")).thenReturn(List.of());
        when(goals.findAllByUserId("u-1")).thenReturn(List.of());

        DuLieuDto dto = duLieuService.layDuLieu("u-1");
        assertNotNull(dto);
        assertEquals(1, dto.vi().size());
        assertEquals("Tiền mặt", dto.vi().get(0).ten());
        assertEquals(1, dto.danhMuc().size());
        assertEquals("Ăn uống", dto.danhMuc().get(0).ten());
    }

    @Test
    void testLuuDuLieuKhongChoSoTienAm() {
        DuLieuDto input = new DuLieuDto(
                List.of(new ViDto("w-1", "Ví", "tien-mat", BigDecimal.ZERO, "#14946F")),
                List.of(new DanhMucDto("c-1", "Ăn uống", "chi", "utensils", "#E5593F")),
                List.of(new GiaoDichDto("tx-1", "chi", BigDecimal.valueOf(-50000), "c-1", "w-1", "2026-11-09", "Lỗi", null)),
                List.of(),
                List.of()
        );

        assertThrows(ResponseStatusException.class, () -> duLieuService.luuDuLieu("u-1", input));
    }
}

