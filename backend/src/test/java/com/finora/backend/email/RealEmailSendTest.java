package com.finora.backend.email;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Properties;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSenderImpl;

public class RealEmailSendTest {

    @Test
    @org.junit.jupiter.api.Disabled("Chỉ chạy khi kiểm thử gửi email thật thủ công qua Gmail")
    void testGuiMailThat() {
        String user = "";
        String pass = "";
        try {
            Path p = Paths.get("..", ".env");
            if (!Files.exists(p)) p = Paths.get(".env");
            for (String line : Files.readAllLines(p, StandardCharsets.UTF_8)) {
                line = line.trim();
                if (line.startsWith("MAIL_USERNAME=")) user = line.substring("MAIL_USERNAME=".length()).trim();
                if (line.startsWith("MAIL_PASSWORD=")) pass = line.substring("MAIL_PASSWORD=".length()).trim();
            }
        } catch (Exception e) {}

        System.out.println("Testing with user: " + user + ", pass length: " + pass.length());
        Assertions.assertFalse(user.isEmpty(), "MAIL_USERNAME không được rỗng");
        Assertions.assertFalse(pass.isEmpty(), "MAIL_PASSWORD không được rỗng");

        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost("smtp.gmail.com");
        sender.setPort(587);
        sender.setUsername(user);
        sender.setPassword(pass);

        Properties props = sender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        EmailService service = new EmailService(sender, user, "http://localhost:5173");
        service.guiEmailMaXacNhanOTP(user, "Finora Admin", "987654", "dang_ky");
        System.out.println("GỬI THÀNH CÔNG EMAIL OTP THỰC TẾ QUA GMAIL SMTP!");
    }
}
