package com.finora.backend.ai;

import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tro-ly")
public class TroLyController {
    private final TroLyService service;

    public TroLyController(TroLyService service) {
        this.service = service;
    }

    @PostMapping("/hoi")
    public TroLyResponse hoi(@AuthenticationPrincipal String userId, @Valid @RequestBody TroLyRequest request) {
        return service.hoi(userId, request);
    }

    @PostMapping("/boc-tach-giao-dich")
    public BocTachGiaoDichResponse bocTachGiaoDich(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody BocTachGiaoDichRequest request) {
        return service.bocTachGiaoDich(userId, request.noiDung());
    }
}
