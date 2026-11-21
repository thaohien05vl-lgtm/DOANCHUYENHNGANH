package com.finora.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.finora.backend.data.DuLieuDto;
import com.finora.backend.data.DuLieuService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class HoaDonService {
    private static final Logger log = LoggerFactory.getLogger(HoaDonService.class);
    private static final List<String> SUPPORTED_IMAGE_TYPES = List.of(
            "image/jpeg", "image/png", "image/webp", "image/gif",
            "image/heic", "image/heif", "image/avif");

    private final RestClient restClient;
    private final ObjectMapper mapper;
    private final DuLieuService duLieuService;
    private final String apiKey;
    private final String model;

    public HoaDonService(RestClient.Builder builder, ObjectMapper mapper, DuLieuService duLieuService,
                         @Value("${gemini.api-key:}") String apiKey,
                         @Value("${gemini.model:gemini-3.5-flash-lite}") String model) {
        var requestFactory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(java.time.Duration.ofSeconds(10));
        requestFactory.setReadTimeout(java.time.Duration.ofSeconds(45));
        this.restClient = builder.requestFactory(requestFactory).baseUrl("https://generativelanguage.googleapis.com").build();
        this.mapper = mapper;
        this.duLieuService = duLieuService;
        this.apiKey = apiKey;
        this.model = model;
    }

    public HoaDonResponse phanTich(String userId, MultipartFile file) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Chưa cấu hình GEMINI_API_KEY. Thêm API key trong file backend/.env rồi khởi động lại backend.");
        }
        if (file == null || file.isEmpty() || file.getSize() > 8L * 1024 * 1024) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ảnh hoá đơn trống hoặc vượt quá 8 MB.");
        }
        String contentType = detectImageContentType(file);
        if (!SUPPORTED_IMAGE_TYPES.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Định dạng ảnh chưa được hỗ trợ. Hãy dùng JPG, PNG, WebP, GIF, HEIC, HEIF hoặc AVIF.");
        }
        var rawCategories = duLieuService.layDuLieu(userId).danhMuc();
        List<DuLieuDto.DanhMucDto> categories = (rawCategories == null ? List.<DuLieuDto.DanhMucDto>of() : rawCategories)
                .stream()
                .filter(x -> x != null && "chi".equals(x.loai()))
                .toList();

        if (categories.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hãy tạo ít nhất một danh mục chi trước khi quét hoá đơn.");
        }

        try {
            String danhMucPrompt = categories.stream()
                    .map(x -> x.ten() + " (id=" + x.id() + ")")
                    .collect(Collectors.joining(", "));

            String prompt = "Bạn là hệ thống OCR và bóc tách hoá đơn chi tiêu tiếng Việt. Đọc kỹ ảnh hoá đơn (kể cả ảnh chụp nghiêng, thiếu sáng, hoá đơn siêu thị/nhà hàng/xăng dầu/mua sắm) và trả về duy nhất một chuỗi JSON chuẩn RFC 8259 (không bọc trong markdown code fence, không giải thích ngoài JSON) có các trường sau:\n" +
                    "- tenCuaHang (string, tên đơn vị bán/cửa hàng/nhà hàng/siêu thị)\n" +
                    "- soTien (number, tổng tiền thanh toán cuối cùng sau thuế, phí và giảm giá)\n" +
                    "- ngay (string YYYY-MM-DD, ngày lập hoá đơn. Nếu không thấy rõ thì dùng ngày hiện tại: " + LocalDate.now() + ")\n" +
                    "- gio (string HH:mm nếu có trên hoá đơn, nếu không có để null)\n" +
                    "- tongTienHang (number, tổng tiền trước giảm giá hoặc bằng soTien)\n" +
                    "- giamGia (number, số tiền chiết khấu/khuyến mãi nếu có, mặc định 0)\n" +
                    "- thuePhi (number, tiền thuế GTGT/VAT/phí dịch vụ nếu có, mặc định 0)\n" +
                    "- phuongThucThanhToan (string, ví dụ 'Tiền mặt', 'Thẻ', 'Chuyển khoản', 'Momo' hoặc null)\n" +
                    "- tenDanhMuc (chọn chính xác 1 tên danh mục phù hợp nhất từ danh sách sau: " + danhMucPrompt + ")\n" +
                    "- ghiChuGiaoDich (string, tóm tắt ngắn gọn nội dung mua, ví dụ 'Ăn trưa Lotteria' hay 'Mua sắm VinMart')\n" +
                    "- doTinCay (number từ 0.0 đến 1.0 đánh giá độ rõ nét và mức độ chắc chắn)\n" +
                    "- matHang (mảng các sản phẩm/dịch vụ: [{ ten: string, soLuong: number, donGia: number, thanhTien: number }])\n" +
                    "Tuyệt đối không tự bịa số tiền; nếu hoá đơn quá mờ hoặc không đọc được tổng tiền thì trả soTien=0 và doTinCay=0.";

            byte[] fileBytes = file.getBytes();
            if (fileBytes == null || fileBytes.length == 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không đọc được dữ liệu ảnh.");
            }
            String imageBase64 = Base64.getEncoder().encodeToString(fileBytes);

            ArrayNode parts = mapper.createArrayNode();
            parts.add(mapper.createObjectNode().put("text", prompt));
            ObjectNode imagePart = mapper.createObjectNode();
            imagePart.putObject("inlineData").put("mimeType", contentType).put("data", imageBase64);
            parts.add(imagePart);

            ObjectNode content = mapper.createObjectNode();
            content.set("parts", parts);
            ArrayNode contents = mapper.createArrayNode();
            contents.add(content);
            ObjectNode body = mapper.createObjectNode();
            body.set("contents", contents);
            body.putObject("generationConfig").put("responseMimeType", "application/json");

            String uri = "/v1beta/models/" + model + ":generateContent";
            JsonNode result = restClient.post().uri(uri)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve().body(JsonNode.class);

            String text = result == null ? null : result.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text").asText(null);

            if (text == null || text.isBlank()) {
                String blockReason = result == null ? "" : result.path("promptFeedback").path("blockReason").asText("");
                if (!blockReason.isBlank()) {
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                            "Gemini đã chặn ảnh hoặc yêu cầu phân tích (" + blockReason + "). Hãy thử ảnh hoá đơn khác.");
                }
                throw new IllegalStateException("Gemini không trả về nội dung phân tích.");
            }

            JsonNode parsed = mapper.readTree(stripFence(text));

            JsonNode amountNode = parsed.path("soTien");
            BigDecimal amount = null;
            if (amountNode.isNumber()) {
                amount = amountNode.decimalValue();
            } else if (amountNode.isTextual()) {
                try {
                    amount = new BigDecimal(amountNode.asText().replaceAll("[^0-9.]", ""));
                } catch (Exception ignored) {
                    amount = null;
                }
            }
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                JsonNode altNode = parsed.path("tongThanhToan");
                if (altNode.isNumber()) amount = altNode.decimalValue();
            }
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Không đọc được tổng tiền trên hoá đơn. Hãy thử ảnh rõ hơn.");
            }

            String categoryName = parsed.path("tenDanhMuc").asText("");
            String categoryId = categories.stream()
                    .filter(x -> x != null && x.ten() != null && x.ten().equalsIgnoreCase(categoryName))
                    .map(x -> x.id())
                    .findFirst()
                    .orElse(categories.get(0).id());

            String date = parsed.path("ngay").asText(LocalDate.now().toString());
            try {
                date = LocalDate.parse(date).toString();
            } catch (Exception ex) {
                date = LocalDate.now().toString();
            }

            String time = parsed.path("gio").asText(null);
            if (time != null && !time.matches("^([01]?\\d|2[0-3]):[0-5]\\d$")) {
                time = null;
            }

            double confidence = Math.max(0, Math.min(1, parsed.path("doTinCay").asDouble(0.75)));
            String store = parsed.path("tenCuaHang").asText("Hoá đơn");
            if (store.isBlank()) store = "Hoá đơn";

            BigDecimal tongTienHang = readDecimal(parsed.path("tongTienHang"), amount);
            BigDecimal giamGia = readDecimal(parsed.path("giamGia"), BigDecimal.ZERO);
            BigDecimal thuePhi = readDecimal(parsed.path("thuePhi"), BigDecimal.ZERO);
            String paymentMethod = parsed.path("phuongThucThanhToan").asText(null);
            String note = parsed.path("ghiChuGiaoDich").asText(store);

            List<HoaDonResponse.MatHangDto> items = new ArrayList<>();
            JsonNode itemsNode = parsed.path("matHang");
            if (itemsNode.isArray()) {
                for (JsonNode item : itemsNode) {
                    String itemName = item.path("ten").asText("");
                    if (!itemName.isBlank()) {
                        BigDecimal qty = readDecimal(item.path("soLuong"), BigDecimal.ONE);
                        BigDecimal price = readDecimal(item.path("donGia"), BigDecimal.ZERO);
                        BigDecimal total = readDecimal(item.path("thanhTien"), qty.multiply(price));
                        items.add(new HoaDonResponse.MatHangDto(itemName, qty, price, total));
                    }
                }
            }

            return new HoaDonResponse(
                    store,
                    amount,
                    date,
                    time,
                    categoryId,
                    confidence,
                    tongTienHang,
                    giamGia,
                    thuePhi,
                    paymentMethod,
                    note,
                    items);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (RestClientResponseException ex) {
            String providerMessage = readProviderError(ex.getResponseBodyAsString());
            log.warn("Gemini API trả lỗi HTTP {}: {}", ex.getStatusCode().value(), providerMessage);
            throw new ResponseStatusException(
                    mapGeminiStatus(ex.getStatusCode().value()),
                    explainGeminiError(ex.getStatusCode().value(), providerMessage));
        } catch (ResourceAccessException ex) {
            log.warn("Không kết nối được Gemini API: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Backend không kết nối được máy chủ Gemini. Hãy kiểm tra Internet hoặc thử lại sau.");
        } catch (Exception ex) {
            log.error("Lỗi khi phân tích hoá đơn bằng Gemini", ex);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                    "Gemini đã nhận ảnh nhưng không trả về kết quả đọc hợp lệ. Hãy thử ảnh rõ nét hơn.");
        }
    }

    private static BigDecimal readDecimal(JsonNode node, BigDecimal fallback) {
        if (node == null || node.isMissingNode() || node.isNull()) return fallback;
        if (node.isNumber()) return node.decimalValue();
        if (node.isTextual()) {
            try {
                String clean = node.asText().replaceAll("[^0-9.]", "");
                if (!clean.isBlank()) return new BigDecimal(clean);
            } catch (Exception ignored) {
                return fallback;
            }
        }
        return fallback;
    }

    private static String detectImageContentType(MultipartFile file) {
        String rawType = file.getContentType();
        String type = (rawType == null) ? "" : rawType.trim().toLowerCase();
        if ("image/jpg".equals(type)) return "image/jpeg";
        if (SUPPORTED_IMAGE_TYPES.contains(type)) return type;

        String rawName = file.getOriginalFilename();
        String name = (rawName == null) ? "" : rawName.toLowerCase();
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".webp")) return "image/webp";
        if (name.endsWith(".gif")) return "image/gif";
        if (name.endsWith(".heic")) return "image/heic";
        if (name.endsWith(".heif")) return "image/heif";
        if (name.endsWith(".avif")) return "image/avif";
        return type;
    }

    private String readProviderError(String body) {
        if (body == null || body.isBlank()) return "Gemini không cung cấp chi tiết lỗi.";
        try {
            JsonNode json = mapper.readTree(body);
            String message = json.path("error").path("message").asText("");
            return message.isBlank() ? "Gemini không cung cấp chi tiết lỗi." : message;
        } catch (Exception ignored) {
            return "Gemini không cung cấp chi tiết lỗi.";
        }
    }

    private static HttpStatusCode mapGeminiStatus(int status) {
        return switch (status) {
            case 400 -> HttpStatus.BAD_REQUEST;
            case 401, 403 -> HttpStatus.BAD_GATEWAY;
            case 404 -> HttpStatus.BAD_GATEWAY;
            case 429 -> HttpStatus.TOO_MANY_REQUESTS;
            case 503 -> HttpStatus.SERVICE_UNAVAILABLE;
            default -> HttpStatus.BAD_GATEWAY;
        };
    }

    private String explainGeminiError(int status, String detail) {
        String safeDetail = detail == null ? "" : detail;
        return switch (status) {
            case 400 -> "Gemini từ chối dữ liệu ảnh hoặc yêu cầu. " + safeDetail;
            case 401, 403 -> "Gemini không chấp nhận API key hoặc API key chưa có quyền sử dụng Gemini API. Hãy kiểm tra lại key và quyền của dự án Google AI Studio. " + safeDetail;
            case 404 -> "Không tìm thấy model Gemini '" + model + "'. Kiểm tra GEMINI_MODEL trong backend/.env. " + safeDetail;
            case 429 -> "Gemini đã hết hạn mức hoặc vượt giới hạn yêu cầu. Hãy kiểm tra quota/billing của API key rồi thử lại. " + safeDetail;
            case 503 -> "Gemini đang quá tải hoặc tạm thời không sẵn sàng. Hãy thử lại sau. " + safeDetail;
            default -> "Gemini trả về lỗi HTTP " + status + ". " + safeDetail;
        };
    }

    private static String stripFence(String value) {
        if (value == null) return "";
        String text = value.trim();
        if (text.startsWith("```") && text.endsWith("```")) {
            text = text.replaceFirst("^```(?:json)?\\s*", "").replaceFirst("\\s*```$", "");
        }
        return text;
    }
}
