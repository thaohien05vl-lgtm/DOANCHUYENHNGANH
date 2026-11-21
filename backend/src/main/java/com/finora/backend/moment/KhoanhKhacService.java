package com.finora.backend.moment;

import com.finora.backend.entity.MomentEntity;
import com.finora.backend.repository.MomentRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KhoanhKhacService {
    private final MomentRepository moments;

    public KhoanhKhacService(MomentRepository moments) {
        this.moments = moments;
    }

    @Transactional(readOnly = true)
    public List<KhoanhKhacDto> lay(String userId) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        return moments.findAllByUserId(userId).stream()
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(MomentEntity::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(x -> {
                    String d = x.getMomentDate() == null ? "" : x.getMomentDate().toString();
                    String c = x.getCaption() == null ? "" : x.getCaption();
                    String img = x.getImageData() == null ? "" : x.getImageData();
                    return new KhoanhKhacDto(x.getId(), d, c, img);
                })
                .toList();
    }

    @Transactional
    public KhoanhKhacDto them(String userId, KhoanhKhacDto request) {
        if (userId == null || userId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa xác thực người dùng.");
        }
        if (request == null || request.anh() == null || request.anh().isBlank() || request.anh().length() > 5_500_000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ảnh không hợp lệ hoặc quá lớn.");
        }
        if (!request.anh().startsWith("data:image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ảnh cần ở định dạng JPEG, PNG hoặc WebP.");
        }
        if (request.ngay() == null || request.ngay().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày lưu khoảnh khắc không hợp lệ.");
        }
        LocalDate date;
        try {
            date = LocalDate.parse(request.ngay());
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày lưu khoảnh khắc không hợp lệ.");
        }
        String caption = request.chuThich() == null ? "" : request.chuThich().trim();
        if (caption.length() > 240) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chú thích tối đa 240 ký tự.");
        }
        MomentEntity entity = new MomentEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setUserId(userId);
        entity.setMomentDate(date);
        entity.setCaption(caption);
        entity.setImageData(request.anh());
        entity.setCreatedAt(Instant.now());
        moments.save(entity);
        return new KhoanhKhacDto(entity.getId(), date.toString(), caption, request.anh());
    }

    @Transactional
    public void xoa(String userId, String id) {
        if (userId == null || userId.isBlank() || id == null || id.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tham số không hợp lệ.");
        }
        MomentEntity entity = moments.findById(id)
                .filter(x -> userId.equals(x.getUserId()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khoảnh khắc."));
        moments.delete(entity);
    }
}
