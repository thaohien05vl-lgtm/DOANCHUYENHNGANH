package com.finora.backend.data;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/du-lieu")
public class DuLieuController {
    private final DuLieuService service;
    public DuLieuController(DuLieuService service) { this.service = service; }

    @GetMapping
    public DuLieuDto lay(@AuthenticationPrincipal String userId) { return service.layDuLieu(userId); }

    @PutMapping
    public DuLieuDto luu(@AuthenticationPrincipal String userId, @RequestBody DuLieuDto request) {
        return service.luuDuLieu(userId, request);
    }
}
