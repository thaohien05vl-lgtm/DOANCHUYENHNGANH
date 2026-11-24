package com.finora.backend.notification;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.finora.backend.entity.CategoryEntity;
import com.finora.backend.entity.NotificationEntity;
import com.finora.backend.entity.TransactionEntity;
import com.finora.backend.entity.WalletEntity;
import com.finora.backend.repository.NotificationRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class ThongBaoServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private ThongBaoService thongBaoService;

    private final String userId = "user-123";

    @BeforeEach
    void setUp() {}

    @Test
    @DisplayName("Tạo thông báo thu nhập thành công")
    void taoThongBaoGiaoDich_ThuNhap() {
        TransactionEntity tx = new TransactionEntity();
        tx.setId("tx-1");
        tx.setType("thu");
        tx.setAmount(new BigDecimal("5000000"));

        CategoryEntity cat = new CategoryEntity();
        cat.setName("Lương");

        WalletEntity wal = new WalletEntity();
        wal.setName("Ví chính");

        when(notificationRepository.existsByUserIdAndTransactionId(userId, "tx-1")).thenReturn(false);

        thongBaoService.taoThongBaoGiaoDich(userId, tx, cat, wal);

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals(userId, saved.getUserId());
        assertEquals("tx-1", saved.getTransactionId());
        assertEquals("giao_dich_thu", saved.getType());
        assertEquals("Giao dịch thu nhập thành công", saved.getTitle());
        assertEquals(new BigDecimal("5000000"), saved.getAmount());
        assertEquals("Lương", saved.getCategoryName());
        assertEquals("Ví chính", saved.getWalletName());
        assertFalse(saved.isRead());
    }

    @Test
    @DisplayName("Tạo thông báo chi tiêu thành công")
    void taoThongBaoGiaoDich_ChiTieu() {
        TransactionEntity tx = new TransactionEntity();
        tx.setId("tx-2");
        tx.setType("chi");
        tx.setAmount(new BigDecimal("103000"));

        CategoryEntity cat = new CategoryEntity();
        cat.setName("Ăn uống");

        WalletEntity wal = new WalletEntity();
        wal.setName("Tiền mặt");

        when(notificationRepository.existsByUserIdAndTransactionId(userId, "tx-2")).thenReturn(false);

        thongBaoService.taoThongBaoGiaoDich(userId, tx, cat, wal);

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("giao_dich_chi", saved.getType());
        assertEquals("Giao dịch chi tiêu thành công", saved.getTitle());
        assertEquals(new BigDecimal("103000"), saved.getAmount());
    }

    @Test
    @DisplayName("Tạo thông báo chuyển tiền khi loại giao dịch là 'chuyen'")
    void taoThongBaoGiaoDich_ChuyenTien() {
        TransactionEntity tx = new TransactionEntity();
        tx.setId("tx-transfer");
        tx.setType("chuyen");
        tx.setAmount(new BigDecimal("200000"));

        WalletEntity wal = new WalletEntity();
        wal.setName("Ví MoMo");

        when(notificationRepository.existsByUserIdAndTransactionId(userId, "tx-transfer")).thenReturn(false);

        thongBaoService.taoThongBaoGiaoDich(userId, tx, null, wal);

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("giao_dich_chuyen_tien", saved.getType());
        assertEquals("Chuyển tiền thành công", saved.getTitle());
    }

    @Test
    @DisplayName("Tạo thông báo hoàn tiền khi có ghi chú hoàn tiền")
    void taoThongBaoGiaoDich_HoanTien() {
        TransactionEntity tx = new TransactionEntity();
        tx.setId("tx-refund");
        tx.setType("thu");
        tx.setNote("Hoàn tiền mua sắm Lazada");
        tx.setAmount(new BigDecimal("50000"));

        WalletEntity wal = new WalletEntity();
        wal.setName("Thẻ tín dụng");

        when(notificationRepository.existsByUserIdAndTransactionId(userId, "tx-refund")).thenReturn(false);

        thongBaoService.taoThongBaoGiaoDich(userId, tx, null, wal);

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("giao_dich_hoan_tien", saved.getType());
        assertEquals("Hoàn tiền thành công", saved.getTitle());
    }

    @Test
    @DisplayName("Tạo thông báo định kỳ khi recurringType không rỗng")
    void taoThongBaoGiaoDich_DinhKy() {
        TransactionEntity tx = new TransactionEntity();
        tx.setId("tx-rec");
        tx.setType("chi");
        tx.setRecurringType("hang_thang");
        tx.setAmount(new BigDecimal("250000"));

        CategoryEntity cat = new CategoryEntity();
        cat.setName("Internet");

        WalletEntity wal = new WalletEntity();
        wal.setName("Ví chính");

        when(notificationRepository.existsByUserIdAndTransactionId(userId, "tx-rec")).thenReturn(false);

        thongBaoService.taoThongBaoGiaoDich(userId, tx, cat, wal);

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("giao_dich_dinh_ky", saved.getType());
        assertEquals("Giao dịch định kỳ: Chi tiêu", saved.getTitle());
    }

    @Test
    @DisplayName("Chống thông báo trùng lặp khi giao dịch đã tồn tại thông báo")
    void taoThongBaoGiaoDich_ChongTrungLap() {
        TransactionEntity tx = new TransactionEntity();
        tx.setId("tx-existing");

        when(notificationRepository.existsByUserIdAndTransactionId(userId, "tx-existing")).thenReturn(true);

        thongBaoService.taoThongBaoGiaoDich(userId, tx, null, null);

        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Kiểm tra cảnh báo ngân sách: Dưới 80% không tạo thông báo")
    void kiemTraCanhBaoNganSach_DuoiNguong() {
        CategoryEntity cat = new CategoryEntity();
        cat.setName("Ăn uống");

        thongBaoService.kiemTraVaTaoCanhBaoNganSach(userId, cat, new BigDecimal("700000"), new BigDecimal("1000000"), "2026-11");

        verify(notificationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Kiểm tra cảnh báo ngân sách: Đạt 80% tạo cảnh báo một lần duy nhất")
    void kiemTraCanhBaoNganSach_DatNguong80() {
        CategoryEntity cat = new CategoryEntity();
        cat.setName("Ăn uống");

        when(notificationRepository.existsByUserIdAndTypeAndTitle(any(), any(), any())).thenReturn(false);

        thongBaoService.kiemTraVaTaoCanhBaoNganSach(userId, cat, new BigDecimal("850000"), new BigDecimal("1000000"), "2026-11");

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("ngan_sach_canh_bao", saved.getType());
        assertTrue(saved.getTitle().contains("85%"));
    }

    @Test
    @DisplayName("Kiểm tra cảnh báo ngân sách: Vượt 100% tạo cảnh báo vượt ngân sách")
    void kiemTraCanhBaoNganSach_VuotNganSach() {
        CategoryEntity cat = new CategoryEntity();
        cat.setName("Mua sắm");

        when(notificationRepository.existsByUserIdAndTypeAndTitle(any(), any(), any())).thenReturn(false);

        thongBaoService.kiemTraVaTaoCanhBaoNganSach(userId, cat, new BigDecimal("1200000"), new BigDecimal("1000000"), "2026-11");

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("ngan_sach_canh_bao", saved.getType());
        assertTrue(saved.getTitle().contains("Cảnh báo vượt ngân sách"));
    }

    @Test
    @DisplayName("Tạo thông báo mục tiêu tiết kiệm hoàn thành")
    void taoThongBaoMucTieu_ThanhCong() {
        when(notificationRepository.existsByUserIdAndTypeAndTitle(any(), any(), any())).thenReturn(false);

        thongBaoService.taoThongBaoMucTieu(userId, "goal-1", "Mua xe máy", new BigDecimal("30000000"), new BigDecimal("30000000"));

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());

        NotificationEntity saved = captor.getValue();
        assertEquals("tiet_kiem_muc_tieu", saved.getType());
        assertTrue(saved.getTitle().contains("Mua xe máy"));
        assertEquals(new BigDecimal("30000000"), saved.getAmount());
    }

    @Test
    @DisplayName("Kiểm tra cảnh báo mục tiêu đạt ngưỡng 80%")
    void kiemTraVaTaoCanhBaoMucTieu_DatNguong80() {
        com.finora.backend.entity.GoalEntity g = new com.finora.backend.entity.GoalEntity();
        g.setId("g-1");
        g.setUserId(userId);
        g.setName("Mua xe máy");
        g.setTargetAmount(new BigDecimal("20000000"));
        g.setAlertThreshold(80);

        thongBaoService.kiemTraVaTaoCanhBaoMucTieu(userId, g, new BigDecimal("14000000"), new BigDecimal("16000000"), "Ví chính", "test@gmail.com", "User");

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());
        NotificationEntity saved = captor.getValue();
        assertEquals("muc_tieu_nguong", saved.getType());
        assertTrue(saved.getTitle().contains("80%"));
    }

    @Test
    @DisplayName("Kiểm tra cảnh báo vượt mục tiêu > 100%")
    void kiemTraVaTaoCanhBaoMucTieu_VuotMucTieu() {
        com.finora.backend.entity.GoalEntity g = new com.finora.backend.entity.GoalEntity();
        g.setId("g-1");
        g.setUserId(userId);
        g.setName("Quỹ khẩn cấp");
        g.setTargetAmount(new BigDecimal("10000000"));
        g.setAlertThreshold(80);

        thongBaoService.kiemTraVaTaoCanhBaoMucTieu(userId, g, new BigDecimal("9000000"), new BigDecimal("12000000"), "Ví chính", "test@gmail.com", "User");

        ArgumentCaptor<NotificationEntity> captor = ArgumentCaptor.forClass(NotificationEntity.class);
        verify(notificationRepository).save(captor.capture());
        NotificationEntity saved = captor.getValue();
        assertEquals("muc_tieu_vuot", saved.getType());
        assertTrue(saved.getTitle().contains("Vượt mục tiêu"));
    }

    @Test
    @DisplayName("Đánh dấu đã đọc thành công đúng user")
    void danhDauDaDoc_ThanhCong() {
        NotificationEntity n = new NotificationEntity();
        n.setId("n-1");
        n.setUserId(userId);
        n.setRead(false);

        when(notificationRepository.findByIdAndUserId("n-1", userId)).thenReturn(Optional.of(n));

        thongBaoService.danhDauDaDoc(userId, "n-1");

        assertTrue(n.isRead());
        verify(notificationRepository).save(n);
    }

    @Test
    @DisplayName("Xóa thông báo đúng user")
    void xoa_ThanhCong() {
        NotificationEntity n = new NotificationEntity();
        n.setId("n-1");
        n.setUserId(userId);

        when(notificationRepository.findByIdAndUserId("n-1", userId)).thenReturn(Optional.of(n));

        thongBaoService.xoa(userId, "n-1");

        verify(notificationRepository).delete(n);
    }

    @Test
    @DisplayName("Xóa thông báo ném lỗi khi không tìm thấy hoặc sai quyền")
    void xoa_KhongTimThay_NemLoi() {
        when(notificationRepository.findByIdAndUserId("n-unknown", userId)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> thongBaoService.xoa(userId, "n-unknown"));
    }
}
