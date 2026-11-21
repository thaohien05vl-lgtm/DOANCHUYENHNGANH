package com.finora.backend.ai;

import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/hoa-don")
public class HoaDonController {
    private final HoaDonService service;
    public HoaDonController(HoaDonService service) { this.service = service; }

    @PostMapping(value = "/phan-tich", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public HoaDonResponse phanTich(@AuthenticationPrincipal String userId, @RequestPart("file") MultipartFile file) {
        return service.phanTich(userId, file);
    }
}
