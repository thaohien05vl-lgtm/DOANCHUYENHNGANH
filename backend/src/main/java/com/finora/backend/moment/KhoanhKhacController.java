package com.finora.backend.moment;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/khoanh-khac")
public class KhoanhKhacController {
    private final KhoanhKhacService service;
    public KhoanhKhacController(KhoanhKhacService service) { this.service = service; }

    @GetMapping
    public List<KhoanhKhacDto> lay(@AuthenticationPrincipal String userId) { return service.lay(userId); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public KhoanhKhacDto them(@AuthenticationPrincipal String userId, @RequestBody KhoanhKhacDto request) {
        return service.them(userId, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void xoa(@AuthenticationPrincipal String userId, @PathVariable String id) { service.xoa(userId, id); }
}
