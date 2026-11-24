package com.finora.backend.common;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
        String message = ex.getReason() == null ? "Yêu cầu không hợp lệ." : ex.getReason();
        return response(ex.getStatusCode().value(), message);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fieldError -> {
                    String msg = fieldError.getDefaultMessage();
                    return msg != null ? msg : "Dữ liệu trường " + fieldError.getField() + " không hợp lệ.";
                })
                .orElse("Dữ liệu gửi lên không hợp lệ.");
        return response(400, message);
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResource(org.springframework.web.servlet.resource.NoResourceFoundException ex) {
        return response(404, "Không tìm thấy đường dẫn yêu cầu.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnexpected(Exception ex) {
        log.error("Lỗi không mong muốn trong quá trình xử lý yêu cầu", ex);
        return response(500, "Máy chủ gặp lỗi. Vui lòng thử lại sau.");
    }

    private ResponseEntity<Map<String, Object>> response(int status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
