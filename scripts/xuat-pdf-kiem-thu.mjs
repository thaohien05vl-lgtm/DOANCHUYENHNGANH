import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outDir = path.join(rootDir, 'test-output')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

// 1. Đọc file CSS
const cssBaoCao = fs.readFileSync(path.join(rootDir, 'frontend/src/components/bao-cao/bao-cao.css'), 'utf-8')
const cssIndex = fs.readFileSync(path.join(rootDir, 'frontend/src/index.css'), 'utf-8')

// 2. Tạo trang HTML mô phỏng chuẩn xác tài liệu A4 được render từ TaiLieuBaoCaoA4
const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>FINORA - BÁO CÁO TÀI CHÍNH CÁ NHÂN</title>
  <style>
    ${cssIndex}
    ${cssBaoCao}
  </style>
</head>
<body>
  <div id="tai-lieu-bao-cao-a4" class="tai-lieu-bao-cao-a4">
    <!-- TRANG 1: TỔNG QUAN, KPIS VÀ BIỂU ĐỒ VECTOR -->
    <div class="trang-giay-a4" data-page="1">
      <div class="than-trang-a4">
        <header class="dau-trang-bao-cao">
          <div class="dau-trang-thuong-hieu">
            <div class="logo-finora-in" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="16" fill="#0e2a2d" />
                <rect x="18" y="15" width="8" height="34" rx="3" fill="#ffffff" />
                <rect x="18" y="15" width="28" height="8" rx="3" fill="#ffffff" />
                <rect x="18" y="29" width="19" height="7.5" rx="3" fill="#ffffff" />
                <circle cx="44" cy="43" r="9" fill="#10b981" stroke="#0e2a2d" stroke-width="2.5" />
                <path d="M40 47L47 40M41 40h6v6" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <h1 class="ten-thuong-hieu-finora">FINORA</h1>
              <p class="slogan-finora-in">Hệ thống Quản lý Tài chính Cá nhân</p>
            </div>
          </div>
          <div class="dau-trang-phai">
            <h2 class="tieu-de-bao-cao-in">BÁO CÁO PHÂN TÍCH TÀI CHÍNH CÁ NHÂN</h2>
            <div class="thong-tin-ky-in">Tháng 11/2026 (01/11/2026 – 21/11/2026)</div>
            <div class="thong-tin-nguoi-xuat-in">Người lập: <strong>Chủ tài khoản Finora</strong> (bunsreals@gmail.com)</div>
            <div class="thong-tin-nguoi-xuat-in" style="font-size: 0.7rem">Xuất lúc: 21/11/2026 15:30 • Mã: FIN-20261121-RPT</div>
          </div>
        </header>

        <!-- 5 Thẻ KPIs -->
        <div class="luoi-kpi-bao-cao-in">
          <div class="the-kpi-in thu">
            <span class="nhan-kpi-in">Tổng thu nhập</span>
            <div class="so-kpi-in">30.000.000 ₫</div>
            <span class="chu-thich-kpi-in">Các khoản thu trong kỳ</span>
          </div>
          <div class="the-kpi-in chi">
            <span class="nhan-kpi-in">Tổng chi tiêu</span>
            <div class="so-kpi-in">11.700.000 ₫</div>
            <span class="chu-thich-kpi-in">Các khoản chi thực tế</span>
          </div>
          <div class="the-kpi-in thang-du">
            <span class="nhan-kpi-in">Chênh lệch (Thu - Chi)</span>
            <div class="so-kpi-in">+18.300.000 ₫</div>
            <span class="chu-thich-kpi-in">Thặng dư tài chính</span>
          </div>
          <div class="the-kpi-in thang-du">
            <span class="nhan-kpi-in">Tiền giữ lại</span>
            <div class="so-kpi-in">+18.300.000 ₫</div>
            <span class="chu-thich-kpi-in">Dòng tiền tích lũy kỳ</span>
          </div>
          <div class="the-kpi-in tiet-kiem">
            <span class="nhan-kpi-in">Tỷ lệ tiết kiệm</span>
            <div class="so-kpi-in" style="color: #059669">+61%</div>
            <span class="chu-thich-kpi-in">Mức tiết kiệm tốt</span>
          </div>
        </div>

        <!-- Nhận định tài chính -->
        <div class="khoi-nhan-dinh-in">
          <div><strong>Nhận định tổng quan:</strong> Tình hình tài chính trong kỳ rất tích cực. Bạn đạt thặng dư 18.300.000 ₫ và duy trì tỷ lệ tích lũy xuất sắc 61%.</div>
          <div><strong>Dòng tiền & Thặng dư:</strong> Thu nhập định kỳ từ tiền lương và tiền thưởng vượt trội so với mức sinh hoạt phí.</div>
          <div><strong>Cơ cấu chi tiêu:</strong> Ăn uống và mua sắm chiếm 65% tổng chi tiêu, nằm trong giới hạn kiểm soát an toàn.</div>
        </div>

        <!-- Cảnh báo ngân sách -->
        <div class="khoi-canh-bao-in">
          <strong>Lưu ý ngân sách:</strong> Danh mục Mua sắm đã chạm 85% hạn mức ngân sách tháng 11/2026.
        </div>

        <!-- Biểu đồ chất lượng cao -->
        <div class="khu-vuc-bieu-do-in">
          <div class="hop-bieu-do-in">
            <h4>
              <span>Thu nhập & Chi tiêu qua các tháng</span>
              <div style="display: flex; gap: 8px; font-size: 0.72rem;">
                <span style="color: #10b981">■ Thu</span>
                <span style="color: #ef4444">■ Chi</span>
              </div>
            </h4>
            <div style="height: 160px;">
              <svg viewBox="0 0 420 150" style="width: 100%; height: 100%;">
                <line x1="30" y1="120" x2="410" y2="120" stroke="#cbd5e1" stroke-width="1" />
                <line x1="30" y1="70" x2="410" y2="70" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="3 3" />
                <!-- Tháng 6 -->
                <rect x="50" y="45" width="14" height="75" rx="2" fill="#10b981" />
                <rect x="66" y="70" width="14" height="50" rx="2" fill="#ef4444" />
                <text x="65" y="136" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">T06</text>
                <!-- Tháng 7 -->
                <rect x="110" y="40" width="14" height="80" rx="2" fill="#10b981" />
                <rect x="126" y="65" width="14" height="55" rx="2" fill="#ef4444" />
                <text x="125" y="136" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">T07</text>
                <!-- Tháng 8 -->
                <rect x="170" y="35" width="14" height="85" rx="2" fill="#10b981" />
                <rect x="186" y="60" width="14" height="60" rx="2" fill="#ef4444" />
                <text x="185" y="136" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">T08</text>
                <!-- Tháng 9 -->
                <rect x="230" y="42" width="14" height="78" rx="2" fill="#10b981" />
                <rect x="246" y="68" width="14" height="52" rx="2" fill="#ef4444" />
                <text x="245" y="136" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">T09</text>
                <!-- Tháng 10 -->
                <rect x="290" y="30" width="14" height="90" rx="2" fill="#10b981" />
                <rect x="306" y="62" width="14" height="58" rx="2" fill="#ef4444" />
                <text x="305" y="136" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">T10</text>
                <!-- Tháng 11 -->
                <rect x="350" y="25" width="14" height="95" rx="2" fill="#10b981" />
                <rect x="366" y="80" width="14" height="40" rx="2" fill="#ef4444" />
                <text x="365" y="136" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600">T11</text>
              </svg>
            </div>
          </div>

          <div class="hop-bieu-do-in">
            <h4>
              <span>Cơ cấu chi tiêu theo danh mục</span>
              <span style="font-size: 0.72rem; color: #64748b">3 danh mục</span>
            </h4>
            <div style="display: flex; align-items: center; gap: 12px; height: 160px;">
              <svg viewBox="0 0 160 160" style="width: 110px; height: 110px; flex-shrink: 0;">
                <circle cx="80" cy="80" r="50" fill="none" stroke="#e2e8f0" stroke-width="24" />
                <!-- Ăn uống: 65.8% (stroke-dasharray) -->
                <circle cx="80" cy="80" r="50" fill="none" stroke="#ef4444" stroke-width="24" stroke-dasharray="206.7 314.1" stroke-dashoffset="0" transform="rotate(-90 80 80)" />
                <!-- Mua sắm: 23.9% -->
                <circle cx="80" cy="80" r="50" fill="none" stroke="#f59e0b" stroke-width="24" stroke-dasharray="75.1 314.1" stroke-dashoffset="-206.7" transform="rotate(-90 80 80)" />
                <!-- Di chuyển: 10.3% -->
                <circle cx="80" cy="80" r="50" fill="none" stroke="#3b82f6" stroke-width="24" stroke-dasharray="32.3 314.1" stroke-dashoffset="-281.8" transform="rotate(-90 80 80)" />
                <circle cx="80" cy="80" r="34" fill="#ffffff" />
                <text x="80" y="84" text-anchor="middle" fill="#0f172a" font-size="11" font-weight="800">11.7M</text>
              </svg>
              <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.74rem;">
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                  <span style="color: #ef4444; font-weight: 600;">● Ăn uống</span>
                  <strong style="color: #0f172a">65.8%</strong>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                  <span style="color: #f59e0b; font-weight: 600;">● Mua sắm</span>
                  <strong style="color: #0f172a">23.9%</strong>
                </div>
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                  <span style="color: #3b82f6; font-weight: 600;">● Di chuyển</span>
                  <strong style="color: #0f172a">10.3%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="chan-trang-bao-cao">
        <div><strong>Finora</strong> • Báo cáo phân tích dòng tiền chính thức</div>
        <div>Tháng 11/2026</div>
        <div>Trang <span class="so-trang-badge">1 / 2</span></div>
      </footer>
    </div>

    <!-- TRANG 2: CÁC BẢNG DỮ LIỆU VÀ KHUYẾN NGHỊ -->
    <div class="trang-giay-a4" data-page="2">
      <div class="than-trang-a4">
        <div style="display: flex; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 8px;">
          <strong style="color: #2563eb; text-transform: uppercase;">CHI TIẾT CƠ CẤU & BIẾN ĐỘNG DÒNG TIỀN</strong>
          <span style="color: #64748b; font-size: 0.74rem;">Tháng 11/2026</span>
        </div>

        <div class="khu-vuc-bang-in">
          <h3 class="tieu-de-phan-in">1. Cơ cấu chi tiêu theo danh mục</h3>
          <table class="bang-tai-lieu-in">
            <thead>
              <tr>
                <th style="width: 40px" class="can-giua">STT</th>
                <th>Danh mục</th>
                <th class="can-giua" style="width: 75px">Số lượt</th>
                <th class="can-phai" style="width: 140px">Số tiền (VND)</th>
                <th class="can-phai" style="width: 90px">Tỷ trọng</th>
                <th style="width: 120px">Biểu đồ tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="can-giua so">1</td>
                <td><strong>Ăn uống</strong></td>
                <td class="can-giua so">2</td>
                <td class="can-phai so" style="color: #dc2626; font-weight: 700">7.700.000 ₫</td>
                <td class="can-phai so">65.8%</td>
                <td><div style="width: 66%; height: 6px; background: #ef4444; border-radius: 3px;"></div></td>
              </tr>
              <tr>
                <td class="can-giua so">2</td>
                <td><strong>Mua sắm</strong></td>
                <td class="can-giua so">1</td>
                <td class="can-phai so" style="color: #dc2626; font-weight: 700">2.800.000 ₫</td>
                <td class="can-phai so">23.9%</td>
                <td><div style="width: 24%; height: 6px; background: #f59e0b; border-radius: 3px;"></div></td>
              </tr>
              <tr>
                <td class="can-giua so">3</td>
                <td><strong>Di chuyển</strong></td>
                <td class="can-giua so">1</td>
                <td class="can-phai so" style="color: #dc2626; font-weight: 700">1.200.000 ₫</td>
                <td class="can-phai so">10.3%</td>
                <td><div style="width: 10%; height: 6px; background: #3b82f6; border-radius: 3px;"></div></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">Tổng cộng</td>
                <td class="can-giua so">4</td>
                <td class="can-phai so" style="color: #dc2626">11.700.000 ₫</td>
                <td class="can-phai so">100%</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="khu-vuc-bang-in">
          <h3 class="tieu-de-phan-in">2. Biến động thu chi và tiền giữ lại qua các tháng</h3>
          <table class="bang-tai-lieu-in">
            <thead>
              <tr>
                <th>Tháng</th>
                <th class="can-phai" style="width: 140px">Thu nhập</th>
                <th class="can-phai" style="width: 140px">Chi tiêu</th>
                <th class="can-phai" style="width: 140px">Tiền giữ lại</th>
                <th class="can-giua" style="width: 100px">Tỷ lệ tiết kiệm</th>
                <th class="can-giua" style="width: 110px">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tháng 09/2026</td>
                <td class="can-phai so" style="color: #059669">26.000.000 ₫</td>
                <td class="can-phai so" style="color: #dc2626">14.500.000 ₫</td>
                <td class="can-phai so" style="color: #059669; font-weight: 700">+11.500.000 ₫</td>
                <td class="can-giua so">44%</td>
                <td class="can-giua"><span style="background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">Thặng dư</span></td>
              </tr>
              <tr>
                <td>Tháng 10/2026</td>
                <td class="can-phai so" style="color: #059669">28.500.000 ₫</td>
                <td class="can-phai so" style="color: #dc2626">16.200.000 ₫</td>
                <td class="can-phai so" style="color: #059669; font-weight: 700">+12.300.000 ₫</td>
                <td class="can-giua so">43%</td>
                <td class="can-giua"><span style="background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">Thặng dư</span></td>
              </tr>
              <tr>
                <td>Tháng 11/2026</td>
                <td class="can-phai so" style="color: #059669">30.000.000 ₫</td>
                <td class="can-phai so" style="color: #dc2626">11.700.000 ₫</td>
                <td class="can-phai so" style="color: #059669; font-weight: 700">+18.300.000 ₫</td>
                <td class="can-giua so">61%</td>
                <td class="can-giua"><span style="background: #ecfdf5; color: #059669; padding: 2px 8px; border-radius: 10px; font-size: 0.72rem; font-weight: 700;">Thặng dư</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 10px; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.78rem;">
          <strong style="color: #10b981; display: block; margin-bottom: 4px;">Khuyến nghị tối ưu tài chính cá nhân:</strong>
          <ul style="margin: 0; padding-left: 18px; color: #334155;">
            <li>Chuyển 10.000.000 ₫ từ khoản thặng dư tháng 11 vào Quỹ Dự phòng Khẩn cấp hoặc Sổ tiết kiệm mục tiêu.</li>
            <li>Theo dõi chặt chẽ hạn mức chi tiêu danh mục Mua sắm trong 9 ngày còn lại của tháng.</li>
          </ul>
        </div>
      </div>
      <footer class="chan-trang-bao-cao">
        <div><strong>Finora</strong> • Báo cáo phân tích dòng tiền chính thức</div>
        <div>Tháng 11/2026</div>
        <div>Trang <span class="so-trang-badge">2 / 2</span></div>
      </footer>
    </div>
  </div>
</body>
</html>`

const htmlPath = path.join(outDir, 'bao-cao-tai-chinh.html')
const pdfPath = path.join(outDir, 'Finora-Bao-Cao-Tai-Chinh-A4.pdf')

fs.writeFileSync(htmlPath, htmlContent, 'utf-8')
console.log(`Đã xuất HTML mẫu tại: ${htmlPath}`)

// 3. Gọi Microsoft Edge hoặc Google Chrome Headless để tạo file PDF thực tế
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const browserPath = fs.existsSync(edgePath) ? edgePath : chromePath

console.log(`Đang chạy trình duyệt headless (${browserPath}) để in file PDF chuẩn A4...`)
const cmd = `"${browserPath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "${htmlPath}"`
execSync(cmd)

if (fs.existsSync(pdfPath)) {
  const stats = fs.statSync(pdfPath)
  console.log(`✅ Xuất PDF thành công!`)
  console.log(`- Đường dẫn file: ${pdfPath}`)
  console.log(`- Kích thước file: ${(stats.size / 1024).toFixed(1)} KB`)
} else {
  console.error(`❌ Không tìm thấy file PDF được tạo!`)
  process.exit(1)
}
