package com.finora.backend;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FinoraBackendApplication {
    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(FinoraBackendApplication.class, args);
    }

    private static void loadDotenv() {
        Path[] possiblePaths = new Path[] {
            Paths.get(".env"),
            Paths.get("backend", ".env"),
            Paths.get("..", "backend", ".env")
        };

        for (Path p : possiblePaths) {
            if (Files.exists(p) && Files.isRegularFile(p)) {
                try {
                    for (String line : Files.readAllLines(p, StandardCharsets.UTF_8)) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#")) continue;
                        int eqIdx = line.indexOf('=');
                        if (eqIdx <= 0) continue;
                        String key = line.substring(0, eqIdx).trim();
                        String val = line.substring(eqIdx + 1).trim();
                        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.substring(1, val.length() - 1);
                        }
                        if (System.getProperty(key) == null) {
                            System.setProperty(key, val);
                        }
                    }
                    System.out.println("[Finora] Đã nạp biến môi trường từ: " + p.toAbsolutePath());
                    break;
                } catch (Exception e) {
                    System.err.println("[Finora] Lỗi nạp .env từ " + p + ": " + e.getMessage());
                }
            }
        }
    }
}
