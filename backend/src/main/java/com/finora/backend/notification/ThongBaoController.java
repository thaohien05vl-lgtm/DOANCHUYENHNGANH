package com.finora.backend.notification;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/thong-bao")
public class ThongBaoController {

    private final ThongBaoService thongBaoService;

    public ThongBaoController(ThongBaoService thongBaoService) {
        this.thongBaoService = thongBaoService;
    }

    @GetMapping
    public List<ThongBaoDto> layDanhSach(@AuthenticationPrincipal String userId) {
        return thongBaoService.layDanhSach(userId);
    }

    @GetMapping("/dem-chua-doc")
    public Map<String, Long> demChuaDoc(@AuthenticationPrincipal String userId) {
        return Map.of("chuaDoc", thongBaoService.demChuaDoc(userId));
    }

    @PutMapping("/{id}/da-doc")
    public Map<String, Boolean> danhDauDaDoc(@AuthenticationPrincipal String userId, @PathVariable String id) {
        thongBaoService.danhDauDaDoc(userId, id);
        return Map.of("ok", true);
    }

    @PutMapping("/doc-tat-ca")
    public Map<String, Boolean> danhDauTatCaDaDoc(@AuthenticationPrincipal String userId) {
        thongBaoService.danhDauTatCaDaDoc(userId);
        return Map.of("ok", true);
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> xoa(@AuthenticationPrincipal String userId, @PathVariable String id) {
        thongBaoService.xoa(userId, id);
        return Map.of("ok", true);
    }
}

