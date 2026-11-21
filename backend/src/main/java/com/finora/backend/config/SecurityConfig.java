package com.finora.backend.config;

import com.finora.backend.security.JwtAuthenticationFilter;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, ex) -> response.sendError(401))
                        .accessDeniedHandler((request, response, ex) -> response.sendError(403)))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/xac-thuc/**", "/actuator/health", "/actuator/info").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    /**
     * CORS: cho phép web dev (Vite), WebView của app Capacitor (http://localhost, capacitor://localhost)
     * và trình duyệt trong mạng LAN (điện thoại thật). Không dùng "*" cùng với allowCredentials.
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origin:http://localhost:5173}") String origin) {
        CorsConfiguration config = new CorsConfiguration();
        List<String> patterns = new java.util.ArrayList<>();
        if (origin != null && !origin.isBlank()) {
            java.util.Arrays.stream(origin.split(",")).map(String::trim).filter(x -> !x.isEmpty()).forEach(patterns::add);
        }
        patterns.addAll(List.of(
                "http://localhost", "http://localhost:*", "https://localhost", "https://localhost:*",
                "capacitor://localhost", "ionic://localhost",
                "http://127.0.0.1:*", "http://10.0.2.2:*",
                "http://192.168.*.*", "http://192.168.*.*:*",
                "http://10.*.*.*", "http://10.*.*.*:*",
                "http://172.*.*.*", "http://172.*.*.*:*"));

        config.setAllowedOriginPatterns(patterns.stream().distinct().toList());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Location"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    FilterRegistrationBean<JwtAuthenticationFilter> jwtFilterServletRegistration(JwtAuthenticationFilter filter) {
        FilterRegistrationBean<JwtAuthenticationFilter> registration = new FilterRegistrationBean<>(filter);
        registration.setEnabled(false); // Chỉ chạy bên trong Spring Security chain, tránh bị đăng ký hai lần.
        return registration;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
