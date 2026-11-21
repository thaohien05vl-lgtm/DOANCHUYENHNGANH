package com.finora.backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.finora.backend.data.DuLieuDto;
import com.finora.backend.data.DuLieuDto.DanhMucDto;
import com.finora.backend.data.DuLieuDto.GiaoDichDto;
import com.finora.backend.data.DuLieuDto.MucTieuDto;
import com.finora.backend.data.DuLieuDto.NganSachDto;
import com.finora.backend.data.DuLieuDto.ViDto;
import com.finora.backend.data.DuLieuService;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;

@Service
public class TroLyService {
    private static final Logger log = LoggerFactory.getLogger(TroLyService.class);
    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final Locale LOCALE_VN = Locale.of("vi", "VN");

    private final DuLieuService duLieuService;
    private final RestClient restClient;
    private final ObjectMapper mapper;
    private final String apiKey;
    private final String model;

    public TroLyService(DuLieuService duLieuService) {
        this(duLieuService, RestClient.builder(), new ObjectMapper(), "", "gemini-3.5-flash-lite");
    }

    @Autowired
    public TroLyService(DuLieuService duLieuService,
                        RestClient.Builder builder,
                        ObjectMapper mapper,
                        @Value("${gemini.api-key:}") String apiKey,
                        @Value("${gemini.model:gemini-3.5-flash-lite}") String model) {
        this.duLieuService = duLieuService;
        this.mapper = mapper != null ? mapper : new ObjectMapper();
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = (model == null || model.isBlank()) ? "gemini-3.5-flash-lite" : model.trim();

        var factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(10));
        factory.setReadTimeout(Duration.ofSeconds(45));
        this.restClient = builder.requestFactory(factory).baseUrl("https://generativelanguage.googleapis.com").build();
    }

    public TroLyResponse hoi(String userId, String question) {
        return hoi(userId, new TroLyRequest(question));
    }

    public TroLyResponse hoi(String userId, TroLyRequest request) {
        if (userId == null || userId.isBlank()) {
            return new TroLyResponse("Vui lòng đăng nhập để mình có thể hỗ trợ phân tích chi tiêu nhé.");
        }

        String cauHoi = request != null && request.cauHoi() != null ? request.cauHoi().trim() : "";
        String anhBase64 = request != null ? request.anhBase64() : null;

        if (cauHoi.isBlank() && (anhBase64 == null || anhBase64.isBlank())) {
            return new TroLyResponse("Bạn hãy nhập câu hỏi hoặc gửi một hình ảnh để mình hỗ trợ nhé!");
        }

        DuLieuDto data = duLieuService.layDuLieu(userId);

        // Nếu chưa cấu hình API Key, chuyển sang rule-based fallback và có thông báo nhắc nhở
        if (apiKey.isBlank()) {
            return hoiBangRuleBasedFallback(userId, cauHoi, data,
                    "Lưu ý: Hệ thống đang dùng phản hồi nhanh dự phòng do chưa cấu hình GEMINI_API_KEY trong file backend/.env.");
        }

        try {
            String systemPrompt = buildSystemPrompt(data);
            ObjectNode body = mapper.createObjectNode();

            // system_instruction
            ObjectNode sysInst = body.putObject("system_instruction");
            ArrayNode sysParts = sysInst.putArray("parts");
            sysParts.addObject().put("text", systemPrompt);

            // contents (hỗ trợ ngữ cảnh lịch sử hội thoại nhiều lượt)
            ArrayNode contents = body.putArray("contents");

            if (request != null && request.lichSu() != null && !request.lichSu().isEmpty()) {
                for (TroLyRequest.TinNhanLichSu msg : request.lichSu()) {
                    if (msg == null || msg.noiDung() == null || msg.noiDung().isBlank()) continue;
                    ObjectNode msgNode = contents.addObject();
                    msgNode.put("role", "nguoi".equals(msg.vai()) || "user".equals(msg.vai()) ? "user" : "model");
                    ArrayNode parts = msgNode.putArray("parts");
                    parts.addObject().put("text", msg.noiDung());
                }
            }

            // Tin nhắn hiện tại của người dùng
            ObjectNode currentUserMsg = contents.addObject();
            currentUserMsg.put("role", "user");
            ArrayNode userParts = currentUserMsg.putArray("parts");

            if (anhBase64 != null && !anhBase64.isBlank()) {
                String cleanBase64 = anhBase64;
                String mimeType = "image/jpeg";
                if (cleanBase64.contains(",")) {
                    String prefix = cleanBase64.substring(0, cleanBase64.indexOf(","));
                    cleanBase64 = cleanBase64.substring(cleanBase64.indexOf(",") + 1);
                    if (prefix.contains("image/png")) mimeType = "image/png";
                    else if (prefix.contains("image/webp")) mimeType = "image/webp";
                    else if (prefix.contains("image/gif")) mimeType = "image/gif";
                }
                if (request.anhMimeType() != null && !request.anhMimeType().isBlank()) {
                    mimeType = request.anhMimeType();
                }
                ObjectNode imagePart = userParts.addObject();
                imagePart.putObject("inlineData").put("mimeType", mimeType).put("data", cleanBase64);
            }

            userParts.addObject().put("text", cauHoi.isBlank() ? "Hãy phân tích và mô tả hình ảnh này giúp tôi." : cauHoi);

            String uri = "/v1beta/models/" + model + ":generateContent";
            JsonNode result = restClient.post().uri(uri)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve().body(JsonNode.class);

            String text = result == null ? null : result.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text").asText(null);

            if (text != null && !text.isBlank()) {
                return new TroLyResponse(text.trim());
            }

            return hoiBangRuleBasedFallback(userId, cauHoi, data, "Không nhận được phản hồi chi tiết từ AI.");
        } catch (RestClientResponseException ex) {
            log.warn("Lỗi gọi Gemini API (HTTP {}): {}", ex.getStatusCode().value(), ex.getResponseBodyAsString());
            return hoiBangRuleBasedFallback(userId, cauHoi, data,
                    "Không thể kết nối AI Gemini (mã " + ex.getStatusCode().value() + "). Đang dùng số liệu tài chính nội bộ.");
        } catch (ResourceAccessException ex) {
            log.warn("Gemini API timeout hoặc mất mạng: {}", ex.getMessage());
            return hoiBangRuleBasedFallback(userId, cauHoi, data,
                    "Kết nối tới AI Gemini bị gián đoạn. Đang hiển thị kết quả phân tích nội bộ từ dữ liệu của bạn.");
        } catch (Exception ex) {
            log.error("Lỗi khi xử lý hội thoại Trợ lý AI", ex);
            return hoiBangRuleBasedFallback(userId, cauHoi, data, null);
        }
    }

    public BocTachGiaoDichResponse bocTachGiaoDich(String userId, String noiDung) {
        if (userId == null || userId.isBlank() || noiDung == null || noiDung.isBlank()) {
            return new BocTachGiaoDichResponse(false, null, null, false, null, null, null, null, null, 0.0,
                    "Nội dung giọng nói chưa có dữ liệu để phân tích.");
        }

        DuLieuDto data = duLieuService.layDuLieu(userId);
        List<DanhMucDto> categories = data.danhMuc() == null ? List.of() : data.danhMuc();
        LocalDate today = LocalDate.now(ZONE);

        if (apiKey.isBlank()) {
            return bocTachBangRuleBased(noiDung, categories, today);
        }

        try {
            String danhMucStr = categories.stream()
                    .map(d -> "{id: '" + d.id() + "', ten: '" + d.ten() + "', loai: '" + d.loai() + "'}")
                    .collect(Collectors.joining(", "));

            String prompt = "Bạn là bộ trích xuất giao dịch tài chính cá nhân tiếng Việt từ giọng nói.\n"
                    + "Ngày hôm nay là: " + today + " (YYYY-MM-DD).\n"
                    + "Danh sách danh mục có sẵn của người dùng: [" + danhMucStr + "]\n\n"
                    + "Câu nói của người dùng: \"" + noiDung.replace("\"", "\\\"") + "\"\n\n"
                    + "Nhiệm vụ: Phân tích xem câu nói trên có phải là một giao dịch thu hoặc chi tiền thực tế hay không.\n"
                    + "- Nếu KHÔNG PHẢI là giao dịch (ví dụ: câu hỏi thông thường, hỏi kiến thức, hỏi quan điểm như 'uống cà phê có tốt không?'), trả về JSON với laGiaoDich=false và phanHoi giải thích thân thiện.\n"
                    + "- Nếu LÀ GIAO DỊCH (vd: 'ăn sáng 35 nghìn', 'nhận lương 15 triệu', 'mua xăng 50k', 'chiều qua đi chợ hết khoảng 120k'):\n"
                    + "  + laGiaoDich: true\n"
                    + "  + loai: 'chi' hoặc 'thu'\n"
                    + "  + soTien: số tiền dạng số nguyên/thập phân (vd: 35000, 15000000). Nếu người dùng nói '35 nghìn', '35k' -> 35000; '12 triệu' -> 12000000. Nếu không rõ số tiền -> null\n"
                    + "  + soTienUocLuong: true nếu người dùng dùng từ ước lượng như 'khoảng', 'tầm', 'chừng', ngược lại false\n"
                    + "  + maDanhMuc: id của danh mục phù hợp nhất từ danh sách trên\n"
                    + "  + tenDanhMuc: tên danh mục tương ứng\n"
                    + "  + ngay: ngày diễn ra dạng YYYY-MM-DD (nếu nói 'hôm qua', 'chiều qua' -> " + today.minusDays(1) + ", 'hôm nay' -> " + today + ")\n"
                    + "  + ghiChu: tóm tắt nội dung giao dịch ngắn gọn\n"
                    + "  + phuongThucThanhToan: 'Tiền mặt', 'Chuyển khoản' hoặc null nếu không nhắc tới\n"
                    + "  + doTinCay: số thực từ 0.0 đến 1.0\n"
                    + "  + phanHoi: câu tóm tắt ngắn gọn xác nhận giao dịch nháp cho người dùng kiểm tra\n\n"
                    + "Trả về DUY NHẤT một chuỗi JSON hợp lệ RFC 8259, không bọc trong markdown code block.";

            ObjectNode body = mapper.createObjectNode();
            ArrayNode contents = body.putArray("contents");
            ObjectNode content = contents.addObject();
            content.put("role", "user");
            content.putArray("parts").addObject().put("text", prompt);
            body.putObject("generationConfig").put("responseMimeType", "application/json");

            String uri = "/v1beta/models/" + model + ":generateContent";
            JsonNode result = restClient.post().uri(uri)
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve().body(JsonNode.class);

            String text = result == null ? null : result.path("candidates").path(0)
                    .path("content").path("parts").path(0).path("text").asText(null);

            if (text != null && !text.isBlank()) {
                JsonNode parsed = mapper.readTree(stripFence(text));
                boolean laGiaoDich = parsed.path("laGiaoDich").asBoolean(false);
                if (!laGiaoDich) {
                    String phanHoi = parsed.path("phanHoi").asText("Câu nói này chưa chứa thông tin một giao dịch thu chi cụ thể.");
                    return new BocTachGiaoDichResponse(false, null, null, false, null, null, null, null, null, 0.0, phanHoi);
                }

                String loai = parsed.path("loai").asText("chi");
                BigDecimal soTien = null;
                JsonNode amountNode = parsed.path("soTien");
                if (amountNode.isNumber()) soTien = amountNode.decimalValue();
                else if (amountNode.isTextual()) {
                    try {
                        soTien = new BigDecimal(amountNode.asText().replaceAll("[^0-9.]", ""));
                    } catch (Exception ignored) {}
                }

                boolean soTienUocLuong = parsed.path("soTienUocLuong").asBoolean(false);
                String maDanhMuc = parsed.path("maDanhMuc").asText(null);
                String tenDanhMuc = parsed.path("tenDanhMuc").asText(null);
                String ngay = parsed.path("ngay").asText(today.toString());
                String ghiChu = parsed.path("ghiChu").asText(noiDung);
                String phuongThuc = parsed.path("phuongThucThanhToan").asText(null);
                double doTinCay = parsed.path("doTinCay").asDouble(0.85);
                String phanHoi = parsed.path("phanHoi").asText("Đã tạo bản nháp giao dịch từ giọng nói.");

                // Validate maDanhMuc có tồn tại trong danh mục của user
                final String targetId = maDanhMuc;
                final String targetLoai = loai;
                String finalMaDanhMuc = maDanhMuc;
                String finalTenDanhMuc = tenDanhMuc;

                if (targetId == null || categories.stream().noneMatch(c -> c.id().equals(targetId))) {
                    var fallbackCat = categories.stream()
                            .filter(c -> targetLoai.equals(c.loai()))
                            .findFirst()
                            .orElse(categories.isEmpty() ? null : categories.get(0));
                    if (fallbackCat != null) {
                        finalMaDanhMuc = fallbackCat.id();
                        finalTenDanhMuc = fallbackCat.ten();
                    }
                }

                return new BocTachGiaoDichResponse(true, loai, soTien, soTienUocLuong, finalMaDanhMuc, finalTenDanhMuc,
                        ngay, ghiChu, phuongThuc, doTinCay, phanHoi);
            }
        } catch (Exception ex) {
            log.warn("Không thể bóc tách qua Gemini API: {}. Dùng fallback cục bộ.", ex.getMessage());
        }

        return bocTachBangRuleBased(noiDung, categories, today);
    }

    private BocTachGiaoDichResponse bocTachBangRuleBased(String noiDung, List<DanhMucDto> categories, LocalDate today) {
        String lower = noiDung.toLowerCase(Locale.ROOT);
        boolean isIncome = lower.contains("lương") || lower.contains("thu nhập") || lower.contains("thưởng")
                || lower.contains("được nhận") || lower.contains("nhận được") || lower.contains("bán được");
        String loai = isIncome ? "thu" : "chi";

        BigDecimal soTien = null;
        boolean uocLuong = lower.contains("khoảng") || lower.contains("tầm") || lower.contains("chừng") || lower.contains("cỡ");

        // Tìm số tiền trong câu
        java.util.regex.Matcher mK = java.util.regex.Pattern.compile("(\\d+(?:[.,]\\d+)?)\\s*(triệu|tr|nghìn|ngàn|k|vnd|đ)").matcher(lower);
        if (mK.find()) {
            double val = Double.parseDouble(mK.group(1).replace(",", "."));
            String donVi = mK.group(2);
            if (donVi.startsWith("triệu") || "tr".equals(donVi)) {
                soTien = BigDecimal.valueOf((long) (val * 1_000_000));
            } else {
                soTien = BigDecimal.valueOf((long) (val * 1_000));
            }
        } else {
            java.util.regex.Matcher mRaw = java.util.regex.Pattern.compile("(\\d{1,3}(?:[.,]\\d{3})+|\\d{4,})").matcher(lower);
            if (mRaw.find()) {
                soTien = new BigDecimal(mRaw.group(1).replaceAll("[.,]", ""));
            }
        }

        if (soTien == null && !lower.contains("chi") && !lower.contains("tiêu") && !lower.contains("mua") && !isIncome) {
            return new BocTachGiaoDichResponse(false, null, null, false, null, null, null, null, null, 0.0,
                    "Câu nói của bạn chưa rõ thông tin thu chi. Bạn hãy nói rõ số tiền (ví dụ: 'ăn trưa 45 nghìn').");
        }

        LocalDate txDate = today;
        if (lower.contains("hôm qua") || lower.contains("chiều qua") || lower.contains("tối qua") || lower.contains("sáng qua")) {
            txDate = today.minusDays(1);
        }

        DanhMucDto chosenCat = categories.stream()
                .filter(c -> loai.equals(c.loai()) && lower.contains(c.ten().toLowerCase(Locale.ROOT)))
                .findFirst()
                .orElse(categories.stream().filter(c -> loai.equals(c.loai())).findFirst().orElse(null));

        String maDm = chosenCat != null ? chosenCat.id() : null;
        String tenDm = chosenCat != null ? chosenCat.ten() : null;

        return new BocTachGiaoDichResponse(true, loai, soTien, uocLuong, maDm, tenDm,
                txDate.toString(), noiDung, null, soTien != null ? 0.8 : 0.4,
                "Đã tạo bản nháp giao dịch " + (isIncome ? "thu nhập" : "chi tiêu") + " từ câu nói của bạn.");
    }

    private String buildSystemPrompt(DuLieuDto data) {
        YearMonth month = YearMonth.now(ZONE);
        YearMonth lastMonth = month.minusMonths(1);
        String curPrefix = month.toString();
        String lastPrefix = lastMonth.toString();

        List<GiaoDichDto> allTx = data.giaoDich() == null ? List.of() : data.giaoDich();
        List<GiaoDichDto> monthTx = allTx.stream().filter(x -> x != null && x.ngay() != null && x.ngay().startsWith(curPrefix)).toList();
        List<GiaoDichDto> lastMonthTx = allTx.stream().filter(x -> x != null && x.ngay() != null && x.ngay().startsWith(lastPrefix)).toList();

        BigDecimal curIncome = sum(monthTx, "thu");
        BigDecimal curExpense = sum(monthTx, "chi");
        BigDecimal lastIncome = sum(lastMonthTx, "thu");
        BigDecimal lastExpense = sum(lastMonthTx, "chi");

        List<DanhMucDto> categories = data.danhMuc() == null ? List.of() : data.danhMuc();
        Map<String, String> catNames = categories.stream().collect(Collectors.toMap(DanhMucDto::id, DanhMucDto::ten, (a, b) -> a));

        Map<String, BigDecimal> expenseByCategory = monthTx.stream()
                .filter(x -> x != null && "chi".equals(x.loai()) && x.maDanhMuc() != null && x.soTien() != null)
                .collect(Collectors.groupingBy(GiaoDichDto::maDanhMuc, Collectors.reducing(BigDecimal.ZERO, GiaoDichDto::soTien, BigDecimal::add)));

        String topCatInfo = expenseByCategory.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(5)
                .map(e -> catNames.getOrDefault(e.getKey(), "Khác") + ": " + money(e.getValue()))
                .collect(Collectors.joining(", "));

        List<NganSachDto> budgets = data.nganSach() == null ? List.of() : data.nganSach();
        String budgetStatus = budgets.stream()
                .map(b -> {
                    BigDecimal spent = expenseByCategory.getOrDefault(b.maDanhMuc(), BigDecimal.ZERO);
                    String name = catNames.getOrDefault(b.maDanhMuc(), "Danh mục");
                    BigDecimal limit = b.hanMuc() != null ? b.hanMuc() : BigDecimal.ZERO;
                    if (limit.compareTo(BigDecimal.ZERO) <= 0) return null;
                    int pct = spent.multiply(BigDecimal.valueOf(100)).divide(limit, 0, RoundingMode.HALF_UP).intValue();
                    return name + " (" + pct + "% hạn mức, đã chi " + money(spent) + "/" + money(limit) + (pct >= 100 ? " -> ĐÃ VƯỢT" : pct >= 80 ? " -> SẮP VƯỢT" : "") + ")";
                })
                .filter(Objects::nonNull)
                .collect(Collectors.joining("; "));

        List<MucTieuDto> goals = data.mucTieu() == null ? List.of() : data.mucTieu();
        String goalsStatus = goals.stream()
                .map(g -> {
                    BigDecimal target = g.soTienMucTieu() != null ? g.soTienMucTieu() : BigDecimal.ZERO;
                    BigDecimal saved = g.daTietKiem() != null ? g.daTietKiem() : BigDecimal.ZERO;
                    int pct = target.compareTo(BigDecimal.ZERO) <= 0 ? 0 : saved.multiply(BigDecimal.valueOf(100)).divide(target, 0, RoundingMode.HALF_UP).intValue();
                    return g.ten() + " (" + pct + "%, hiện có " + money(saved) + "/" + money(target) + ", hạn " + (g.han() != null ? g.han() : "chưa rõ") + ")";
                })
                .collect(Collectors.joining("; "));

        List<ViDto> wallets = data.vi() == null ? List.of() : data.vi();
        String walletStatus = wallets.stream().map(ViDto::ten).collect(Collectors.joining(", "));

        return "Bạn là Trợ lý AI Thông minh Finora – người đồng hành tài chính và cuộc sống cho người dùng.\n\n"
                + "=== NGUỒN DỮ LIỆU TÀI CHÍNH THỰC TẾ CỦA TÀI KHOẢN (NGÀY HÔM NAY: " + LocalDate.now(ZONE) + ") ===\n"
                + "• Tháng hiện tại (" + month + "): Thu nhập " + money(curIncome) + ", Chi tiêu " + money(curExpense) + ", Chênh lệch " + money(curIncome.subtract(curExpense)) + ".\n"
                + "• Top danh mục chi nhiều nhất tháng này: " + (topCatInfo.isBlank() ? "Chưa có giao dịch chi" : topCatInfo) + ".\n"
                + "• Tháng trước (" + lastMonth + "): Thu nhập " + money(lastIncome) + ", Chi tiêu " + money(lastExpense) + ".\n"
                + "• Tình hình ngân sách: " + (budgetStatus.isBlank() ? "Chưa thiết lập ngân sách nào" : budgetStatus) + ".\n"
                + "• Mục tiêu tiết kiệm: " + (goalsStatus.isBlank() ? "Chưa tạo mục tiêu" : goalsStatus) + ".\n"
                + "• Các ví tiền hiện có: " + (walletStatus.isBlank() ? "Chưa có ví" : walletStatus) + ".\n\n"
                + "=== QUY TẮC PHỤC VỤ VÀ ỨNG XỬ ===\n"
                + "1. CÂU HỎI VỀ TÀI CHÍNH CÁ NHÂN: Phải lấy số liệu thật từ khối dữ liệu trên để trả lời. Không được tự bịa số tiền, ngày tháng hoặc danh mục. Nếu chưa có giao dịch hoặc chưa đủ số liệu, hãy nói rõ thân thiện.\n"
                + "2. CÂU HỎI NGOÀI TÀI CHÍNH: Người dùng có thể hỏi bất kỳ chủ đề nào (công nghệ, lập trình, học tiếng Anh, thực đơn, khoa học, mẹo vặt, giải thích đời sống...). Bạn PHẢI trả lời tự nhiên, nhiệt tình, đầy đủ và thông minh như một AI tổng quát hàng đầu. TUYỆT ĐỐI KHÔNG được từ chối bằng các câu máy móc như 'Tôi chỉ là trợ lý tài chính'.\n"
                + "3. KHI CÓ HÌNH ẢNH: Hãy quan sát kỹ lưỡng ảnh được gửi, giải thích, mô tả, đọc chữ hoặc giải đáp theo đúng câu hỏi của người dùng.\n"
                + "4. GHI NHỚ NGỮ CẢNH: Khi người dùng hỏi tiếp nối (vd: 'vậy tháng trước thì sao?', 'còn ăn uống thì thế nào?'), hãy liên kết chặt chẽ với các câu hỏi trước trong hội thoại.\n"
                + "5. PHONG CÁCH: Lịch sự, ân cần, định dạng Markdown rõ ràng, dùng gạch đầu dòng, in đậm các con số quan trọng.";
    }

    private TroLyResponse hoiBangRuleBasedFallback(String userId, String question, DuLieuDto data, String note) {
        YearMonth month = YearMonth.now(ZONE);
        String currentMonthPrefix = month.toString();

        List<GiaoDichDto> allTransactions = data.giaoDich() == null ? List.of() : data.giaoDich();
        List<GiaoDichDto> monthTx = allTransactions.stream()
                .filter(x -> x != null && x.ngay() != null && x.ngay().startsWith(currentMonthPrefix))
                .toList();

        BigDecimal income = sum(monthTx, "thu");
        BigDecimal expense = sum(monthTx, "chi");

        Map<String, BigDecimal> expenseByCategory = monthTx.stream()
                .filter(x -> x != null && "chi".equals(x.loai()) && x.maDanhMuc() != null && x.soTien() != null)
                .collect(Collectors.groupingBy(
                        GiaoDichDto::maDanhMuc,
                        Collectors.reducing(BigDecimal.ZERO, GiaoDichDto::soTien, BigDecimal::add)));

        String topId = expenseByCategory.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        List<DanhMucDto> categories = data.danhMuc() == null ? List.of() : data.danhMuc();
        String topName = topId == null ? null : categories.stream()
                .filter(x -> x != null && topId.equals(x.id()))
                .map(DanhMucDto::ten)
                .findFirst()
                .orElse(null);

        String q = (question == null ? "" : question).toLowerCase(Locale.ROOT);
        String answer;

        if (q.matches("(?s).*(tiêu|chi).*(bao nhiêu|tháng).*|.*tháng này.*")) {
            if (monthTx.isEmpty()) {
                answer = "Tháng " + month.getMonthValue() + "/" + month.getYear() + ", bạn chưa có giao dịch nào được ghi nhận.";
            } else {
                answer = "Tháng " + month.getMonthValue() + "/" + month.getYear() + ", bạn đã chi " + money(expense) + " và thu " + money(income) + ".";
                if (topName != null && topId != null) {
                    BigDecimal topAmount = expenseByCategory.getOrDefault(topId, BigDecimal.ZERO);
                    answer += " Danh mục chi nhiều nhất là " + topName + " (" + money(topAmount) + ").";
                }
            }
        } else if (q.contains("ngân sách") || q.contains("vượt") || q.contains("hạn mức")) {
            var budgets = data.nganSach() == null ? List.<NganSachDto>of() : data.nganSach();
            if (budgets.isEmpty()) {
                answer = "Bạn chưa thiết lập ngân sách nào cho các danh mục chi tiêu.";
            } else {
                List<String> alerts = budgets.stream()
                        .map(b -> {
                            if (b == null || b.maDanhMuc() == null || b.hanMuc() == null) return null;
                            String name = categories.stream()
                                    .filter(c -> c != null && b.maDanhMuc().equals(c.id()))
                                    .map(DanhMucDto::ten)
                                    .findFirst()
                                    .orElse("Danh mục");
                            BigDecimal spent = expenseByCategory.getOrDefault(b.maDanhMuc(), BigDecimal.ZERO);
                            if (b.hanMuc().signum() <= 0) return null;
                            int pct = spent.multiply(BigDecimal.valueOf(100)).divide(b.hanMuc(), 0, RoundingMode.HALF_UP).intValue();
                            if (pct >= 100) {
                                return name + " đã VƯỢT ngân sách (" + pct + "% hạn mức, đã chi " + money(spent) + "/" + money(b.hanMuc()) + ")";
                            } else if (pct >= 80) {
                                return name + " sắp chạm hạn mức (" + pct + "%, đã chi " + money(spent) + "/" + money(b.hanMuc()) + ")";
                            }
                            return null;
                        })
                        .filter(Objects::nonNull)
                        .toList();
                answer = alerts.isEmpty()
                        ? "Hiện tại mọi danh mục đều đang nằm trong hạn mức ngân sách an toàn (dưới 80%)."
                        : "Các khoản cần chú ý: " + String.join("; ", alerts) + ".";
            }
        } else if (q.contains("mục tiêu") || q.contains("kế hoạch") || q.contains("laptop") || q.contains("du lịch")) {
            var goals = data.mucTieu() == null ? List.<MucTieuDto>of() : data.mucTieu();
            if (goals.isEmpty()) {
                answer = "Bạn chưa tạo mục tiêu tiết kiệm nào. Hãy tạo mục tiêu để lên kế hoạch tài chính rõ ràng nhé.";
            } else {
                answer = goals.stream()
                        .filter(Objects::nonNull)
                        .map(g -> {
                            BigDecimal target = g.soTienMucTieu() == null ? BigDecimal.ZERO : g.soTienMucTieu();
                            BigDecimal saved = g.daTietKiem() == null ? BigDecimal.ZERO : g.daTietKiem();
                            int pct = target.signum() <= 0 ? 0 : saved.multiply(BigDecimal.valueOf(100)).divide(target, 0, RoundingMode.HALF_UP).intValue();
                            return "• " + (g.ten() == null ? "Mục tiêu" : g.ten()) + ": " + pct + "% (hiện có " + money(saved) + " / cần " + money(target) + ", hạn: " + (g.han() == null ? "chưa đặt" : g.han()) + ")";
                        })
                        .collect(Collectors.joining("\n"));
            }
        } else if (q.contains("tiết kiệm") || q.contains("gợi ý") || q.contains("cắt giảm")) {
            if (income.signum() <= 0 && expense.signum() <= 0) {
                answer = "Chưa có đủ số liệu thu chi trong tháng này để mình tính tỷ lệ tiết kiệm. Hãy ghi nhận các giao dịch chi tiêu nhé.";
            } else {
                BigDecimal remaining = income.subtract(expense);
                int rate = income.signum() <= 0 ? 0 : remaining.multiply(BigDecimal.valueOf(100)).divide(income, 0, RoundingMode.HALF_UP).intValue();
                answer = "Tỷ lệ tích lũy sau chi tiêu trong tháng là " + rate + "% (thu " + money(income) + ", chi " + money(expense) + ", chênh lệch " + money(remaining) + ").";
                if (topName != null) {
                    answer += " Khoản chiếm tỷ trọng lớn nhất là " + topName + ". Bạn có thể đặt ngân sách tuần cho khoản này để tối ưu khả năng tiết kiệm.";
                }
            }
        } else {
            answer = "Chào bạn! Mình có thể phân tích chi tiêu tháng này, rà soát hạn mức ngân sách, theo dõi tiến độ mục tiêu và gợi ý tối ưu chi tiêu. Bạn muốn kiểm tra nội dung nào?";
        }

        if (note != null && !note.isBlank()) {
            answer = answer + "\n\n(" + note + ")";
        }
        return new TroLyResponse(answer);
    }

    private static BigDecimal sum(List<GiaoDichDto> tx, String type) {
        if (tx == null) return BigDecimal.ZERO;
        return tx.stream()
                .filter(x -> x != null && type.equals(x.loai()) && x.soTien() != null)
                .map(GiaoDichDto::soTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private static String money(BigDecimal amount) {
        BigDecimal val = amount == null ? BigDecimal.ZERO : amount;
        return NumberFormat.getCurrencyInstance(LOCALE_VN).format(val).replace("₫", "đ");
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
