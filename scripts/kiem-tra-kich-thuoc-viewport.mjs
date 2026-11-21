import assert from 'node:assert/strict'

const viewports = [
  { ten: 'Điện thoại cực nhỏ', w: 320, h: 568 },
  { ten: 'Android chuẩn', w: 360, h: 800 },
  { ten: 'iPhone tiêu chuẩn', w: 375, h: 667 },
  { ten: 'iPhone Pro', w: 390, h: 844 },
  { ten: 'iPhone Pro Max', w: 430, h: 932 },
  { ten: 'Tablet / iPad', w: 768, h: 1024 },
  { ten: 'Laptop / Desktop', w: 1280, h: 800 },
  { ten: 'Màn hình lớn 2K/4K', w: 1920, h: 1080 },
]

const CHIEU_RONG_A4 = 794
const CHIEU_CAO_A4 = 1123
const TY_LE_CHUAN = CHIEU_RONG_A4 / CHIEU_CAO_A4 // ~0.707

console.log('--- BẮT ĐẦU KIỂM THỬ KHẢ NĂNG THÍCH ỨNG TRÊN TỪNG KÍCH THƯỚC VIEWPORT ---')

for (const vp of viewports) {
  const demNgang = vp.w < 640 ? 16 : 40
  const chieuRongKhaDung = vp.w - demNgang
  const scale = vp.w > 900 ? 1.0 : Math.min(1.0, chieuRongKhaDung / CHIEU_RONG_A4)

  const rongScaled = Math.round(CHIEU_RONG_A4 * scale)
  const caoScaled = Math.round(CHIEU_CAO_A4 * scale)
  const tyLeScaled = rongScaled / caoScaled

  console.log(`\nThiết bị: ${vp.ten} (${vp.w}x${vp.h}px)`)
  console.log(`- Hệ số Fit-Width Scale: ${(scale * 100).toFixed(1)}%`)
  console.log(`- Kích thước trang hiển thị: ${rongScaled}px x ${caoScaled}px`)
  console.log(`- Độ rộng khả dụng: ${chieuRongKhaDung}px >= ${rongScaled}px`)

  // Kiểm tra 1: Trang sau scale PHẢI nhỏ hơn hoặc bằng chiều rộng khả dụng (KHÔNG BAO GIỜ TRÀN MÀN HÌNH)
  assert.ok(
    rongScaled <= chieuRongKhaDung + 1,
    `Lỗi tràn màn hình trên thiết bị ${vp.ten}: ${rongScaled}px > ${chieuRongKhaDung}px`,
  )

  // Kiểm tra 2: Tỷ lệ co dãn phải bảo toàn tuyệt đối tỷ lệ khổ A4 (không bị méo hay biến dạng)
  assert.ok(
    Math.abs(tyLeScaled - TY_LE_CHUAN) < 0.01,
    `Tỷ lệ A4 bị méo trên ${vp.ten}: ${tyLeScaled} khác ${TY_LE_CHUAN}`,
  )
}

console.log('\n✅ 8/8 KÍCH THƯỚC MÀN HÌNH ĐỀU ĐẠT CHUẨN FIT WIDTH & KHÔNG BỊ TRÀN!')
