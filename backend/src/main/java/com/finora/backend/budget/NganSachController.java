package com.finora.backend.budget;

import com.finora.backend.data.DuLieuDto.NganSachDto;
import com.finora.backend.entity.BudgetEntity;
import com.finora.backend.repository.BudgetRepository;
import java.util.List;
import java.util.Objects;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller tra cứu ngân sách theo kỳ tháng / năm
 * Hỗ trợ GET /api/ngan-sach?thang=11&nam=2026 hoặc GET /ngan-sach?thang=11&nam=2026
 */
@RestController
@RequestMapping({"/api/ngan-sach", "/ngan-sach"})
public class NganSachController {

    private final BudgetRepository budgetRepository;

    public NganSachController(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    @GetMapping
    public List<NganSachDto> layTheoThangNam(
            @AuthenticationPrincipal String userId,
            @RequestParam(required = false) Integer thang,
            @RequestParam(required = false) Integer nam) {

        if (userId == null || userId.isBlank()) {
            return List.of();
        }

        List<BudgetEntity> danhSach;
        if (thang != null && nam != null) {
            String ky = String.format("%04d-%02d", nam, thang);
            danhSach = budgetRepository.findAllByUserId(userId).stream()
                    .filter(b -> (b.getKyNganSach() != null && b.getKyNganSach().equals(ky))
                            || (Objects.equals(b.getThang(), thang) && Objects.equals(b.getNam(), nam))
                            || (b.getKyNganSach() == null && b.getThang() == null))
                    .toList();
        } else {
            danhSach = budgetRepository.findAllByUserId(userId);
        }

        return danhSach.stream()
                .filter(Objects::nonNull)
                .map(x -> new NganSachDto(
                        x.getId(),
                        x.getCategoryId(),
                        x.getLimitAmount(),
                        x.getKyNganSach(),
                        x.getThang(),
                        x.getNam()))
                .toList();
    }
}
