import type { DanhMuc, GiaoDich, NganSach, Vi } from '../types'
import {
  congThang,
  dinhDangNgay,
  dinhDangTien,
  homNayISO,
  nhanThang,
  nhanThangNgan,
  thangHienTai,
} from './dinhDang'
import { chiTheoDanhMuc, soDuVi, tongThuChi } from './thongKe'
import { t } from './ngonNgu'

export type KyBaoCao =
  | 'hom-nay'
  | '7-ngay'
  | 'thang-nay'
  | '3-thang'
  | '6-thang'
  | '12-thang'
  | 'nam-nay'
  | 'tat-ca'
  | 'tuy-chinh'

export interface ThongKeThangChiTiet {
  thang: string // YYYY-MM
  nhan: string // "Tháng 11/2026"
  nhanNgan: string // "T11"
  thu: number
  chi: number
  tienGiuLai: number // thu - chi (chính xác âm/dương)
  tiLeTietKiem: number // % (có thể âm)
}

export interface ChiTietCoCauDanhMuc {
  danhMuc: DanhMuc
  soTien: number
  soLuong: number
  tyTrong: number // % trên tổng chi
}

export interface CanhBaoNganSachItem {
  loai: 'canh-bao' | 'nhac-nho'
  maDanhMuc: string
  tenDanhMuc: string
  hanMuc: number
  daChi: number
  chenhLech: number // daChi - hanMuc
  phanTram: number // (daChi / hanMuc) * 100
  noiDung: string
}

export interface KetQuaBaoCaoChuanHoa {
  // Khoảng thời gian
  ky: KyBaoCao
  tieuDeKy: string
  tuNgay: string
  denNgay: string

  // Dữ liệu giao dịch đã lọc
  giaoDichTrongKy: GiaoDich[]
  soLuongGiaoDich: number

  // 5 KPIs tài chính cốt lõi
  tongThu: number
  tongChi: number
  chenhLech: number // Thu - Chi
  tienGiuLai: number // Thu - Chi (dòng tiền thặng dư/thâm hụt trong kỳ)
  tiLeTietKiem: number // % tiết kiệm (có thể âm khi chi > thu)
  tiLeTietKiemHienThi: string // Ví dụ: "+25%", "-15%", "0%"
  tongSoDuVi: number // Tổng số dư hiện tại của tất cả các ví (phân biệt với tiền giữ lại)

  // Dữ liệu biểu đồ chuẩn hóa
  chuoiThang: ThongKeThangChiTiet[]
  coCauChi: ChiTietCoCauDanhMuc[]

  // So sánh kỳ trước
  soSanhKyTruoc: {
    coSoLieu: boolean
    tangChi: number // % tăng giảm chi so với kỳ trước
    tangThu: number // % tăng giảm thu so với kỳ trước
  }

  // Cảnh báo & Nhận xét tài chính thông minh
  canhBaoNganSach: CanhBaoNganSachItem[]
  nhanXetTongQuan: string
  dienGiaiThuChi: string
  dienGiaiTienGiuLai: string
  dienGiaiCoCauChi: string
  goiYTietKiem: string[]
}

export interface BoLocBaoCao {
  ky: KyBaoCao
  tuNgay?: string
  denNgay?: string
  loaiGiaoDich: 'tat-ca' | 'chi' | 'thu'
  locDanhMuc?: string
  locVi?: string
}

/**
 * Hàm trung tâm chuẩn hóa và tính toán toàn bộ số liệu Báo cáo Tài chính
 * Được dùng chung 100% giữa Dashboard web, Modal In PDF, và Xuất file Excel.
 */
export function tinhTongHopBaoCao(
  giaoDich: GiaoDich[],
  danhMuc: DanhMuc[],
  vi: Vi[],
  nganSach: NganSach[],
  boLoc: BoLocBaoCao,
): KetQuaBaoCaoChuanHoa {
  const homNay = homNayISO()
  const thangCuoi = thangHienTai()
  const namHienTai = String(new Date().getFullYear())

  const { ky, loaiGiaoDich, locDanhMuc, locVi } = boLoc
  let tuNgay = boLoc.tuNgay || ''
  let denNgay = boLoc.denNgay || homNay

  // Xác định khoảng ngày và tiêu đề kỳ
  let tieuDeKy = ''
  switch (ky) {
    case 'hom-nay':
      tuNgay = homNay
      denNgay = homNay
      tieuDeKy = t('Hôm nay ({0})', [dinhDangNgay(homNay)])
      break
    case '7-ngay': {
      const d = new Date()
      d.setDate(d.getDate() - 6)
      tuNgay = d.toISOString().slice(0, 10)
      denNgay = homNay
      tieuDeKy = t('7 ngày gần đây ({0} – {1})', [dinhDangNgay(tuNgay), dinhDangNgay(denNgay)])
      break
    }
    case 'thang-nay':
      tuNgay = `${thangCuoi}-01`
      denNgay = homNay
      tieuDeKy = t('Tháng này ({0})', [nhanThang(thangCuoi)])
      break
    case '3-thang': {
      const tuThang = congThang(thangCuoi, -2)
      tuNgay = `${tuThang}-01`
      denNgay = homNay
      tieuDeKy = t('3 tháng gần đây ({0} – {1})', [nhanThang(tuThang), nhanThang(thangCuoi)])
      break
    }
    case '6-thang': {
      const tuThang = congThang(thangCuoi, -5)
      tuNgay = `${tuThang}-01`
      denNgay = homNay
      tieuDeKy = t('6 tháng gần đây ({0} – {1})', [nhanThang(tuThang), nhanThang(thangCuoi)])
      break
    }
    case '12-thang': {
      const tuThang = congThang(thangCuoi, -11)
      tuNgay = `${tuThang}-01`
      denNgay = homNay
      tieuDeKy = t('12 tháng gần đây ({0} – {1})', [nhanThang(tuThang), nhanThang(thangCuoi)])
      break
    }
    case 'nam-nay':
      tuNgay = `${namHienTai}-01-01`
      denNgay = homNay
      tieuDeKy = t('Năm {0}', [namHienTai])
      break
    case 'tat-ca':
      tuNgay = ''
      denNgay = ''
      tieuDeKy = t('Toàn bộ thời gian (Tất cả lịch sử)')
      break
    case 'tuy-chinh':
      tieuDeKy = t('Tùy chọn: Từ {0} đến {1}', [tuNgay ? dinhDangNgay(tuNgay) : 'đầu', denNgay ? dinhDangNgay(denNgay) : 'nay'])
      break
  }

  // 1. Lọc danh sách giao dịch theo điều kiện
  const giaoDichTrongKy = giaoDich.filter((g) => {
    if (!g.ngay) return false

    // Lọc ngày
    if (tuNgay && g.ngay < tuNgay) return false
    if (denNgay && g.ngay > denNgay) return false

    // Lọc loại
    if (loaiGiaoDich !== 'tat-ca' && g.loai !== loaiGiaoDich) return false

    // Lọc danh mục
    if (locDanhMuc && g.maDanhMuc !== locDanhMuc) return false

    // Lọc ví
    if (locVi && g.maVi !== locVi) return false

    return true
  })

  // 2. Tính 5 chỉ số KPIs chuẩn xác
  const { thu: tongThu, chi: tongChi } = tongThuChi(giaoDichTrongKy)
  const chenhLech = tongThu - tongChi
  const tienGiuLai = chenhLech // Tiền giữ lại trong kỳ = Thu - Chi

  // Tỷ lệ tiết kiệm chuẩn hóa:
  // Nếu thu > 0: (Thu - Chi) / Thu * 100 (có thể âm)
  // Nếu thu = 0 và chi = 0: 0%
  // Nếu thu = 0 và chi > 0: -100% (bội chi toàn phần)
  let tiLeTietKiem: number
  let tiLeTietKiemHienThi: string

  if (tongThu > 0) {
    tiLeTietKiem = Math.round((chenhLech / tongThu) * 100)
    tiLeTietKiemHienThi = `${tiLeTietKiem > 0 ? '+' : ''}${tiLeTietKiem}%`
  } else if (tongChi > 0) {
    tiLeTietKiem = -100
    tiLeTietKiemHienThi = t('-100% (Thu 0đ)')
  } else {
    tiLeTietKiem = 0
    tiLeTietKiemHienThi = '0%'
  }

  // Tổng số dư các ví hiện tại
  const tongSoDuVi = vi.reduce((sum, v) => sum + soDuVi(v, giaoDich), 0)

  // 3. Chuỗi dữ liệu các tháng theo thời gian tăng dần
  let soThang = 6
  if (ky === 'thang-nay' || ky === 'hom-nay' || ky === '7-ngay') soThang = 3
  else if (ky === '3-thang') soThang = 3
  else if (ky === '6-thang') soThang = 6
  else if (ky === '12-thang' || ky === 'nam-nay') soThang = 12
  else if (ky === 'tat-ca') soThang = 12

  const chuoiThang: ThongKeThangChiTiet[] = Array.from({ length: soThang }, (_, i) => {
    const key = congThang(thangCuoi, i - (soThang - 1))
    // Lọc giao dịch của riêng tháng đó (áp dụng cả lọc ví và lọc danh mục nếu có)
    const gdThang = giaoDich.filter((g) => {
      if (!g.ngay || !g.ngay.startsWith(key)) return false
      if (locDanhMuc && g.maDanhMuc !== locDanhMuc) return false
      if (locVi && g.maVi !== locVi) return false
      return true
    })
    const { thu, chi } = tongThuChi(gdThang)
    const tienThang = thu - chi
    const tiLe = thu > 0 ? Math.round(((thu - chi) / thu) * 100) : chi > 0 ? -100 : 0
    return {
      thang: key,
      nhan: nhanThang(key),
      nhanNgan: nhanThangNgan(key),
      thu,
      chi,
      tienGiuLai: tienThang,
      tiLeTietKiem: tiLe,
    }
  })

  // 4. Cơ cấu chi tiêu theo danh mục
  const thongKeChi = chiTheoDanhMuc(giaoDichTrongKy, danhMuc)
  const coCauChi: ChiTietCoCauDanhMuc[] = thongKeChi.map((item) => {
    const tyTrong = tongChi > 0 ? Number(((item.soTien / tongChi) * 100).toFixed(1)) : 0
    return {
      danhMuc: item.danhMuc,
      soTien: item.soTien,
      soLuong: item.soLuong,
      tyTrong,
    }
  })

  // 5. So sánh với kỳ trước (nếu có dữ liệu)
  let coSoLieuKyTruoc = false
  let tangChi = 0
  let tangThu = 0

  if (chuoiThang.length >= 2) {
    const thangNay = chuoiThang[chuoiThang.length - 1]
    const thangTruoc = chuoiThang[chuoiThang.length - 2]
    if (thangTruoc.chi > 0 || thangTruoc.thu > 0) {
      coSoLieuKyTruoc = true
      if (thangTruoc.chi > 0) {
        tangChi = Math.round(((thangNay.chi - thangTruoc.chi) / thangTruoc.chi) * 100)
      }
      if (thangTruoc.thu > 0) {
        tangThu = Math.round(((thangNay.thu - thangTruoc.thu) / thangTruoc.thu) * 100)
      }
    }
  }

  // 6. Kiểm tra Cảnh báo & Nhắc nhở Ngân sách thực tế
  const canhBaoNganSach: CanhBaoNganSachItem[] = []
  // Lấy chi tiêu tháng hiện tại để đối chiếu với ngân sách tháng
  const gdThangNay = giaoDich.filter((g) => g.ngay && g.ngay.startsWith(thangCuoi) && g.loai === 'chi')
  const chiThangNayTheoDm = new Map<string, number>()
  for (const g of gdThangNay) {
    chiThangNayTheoDm.set(g.maDanhMuc, (chiThangNayTheoDm.get(g.maDanhMuc) ?? 0) + g.soTien)
  }

  for (const ns of nganSach) {
    if (ns.hanMuc <= 0) continue
    const dm = danhMuc.find((d) => d.id === ns.maDanhMuc)
    if (!dm) continue

    const daChi = chiThangNayTheoDm.get(ns.maDanhMuc) ?? 0
    const phanTram = Number(((daChi / ns.hanMuc) * 100).toFixed(1))
    const chenhLechNs = daChi - ns.hanMuc

    if (daChi > ns.hanMuc) {
      // Cảnh báo thực sự: Đã vượt ngân sách
      canhBaoNganSach.push({
        loai: 'canh-bao',
        maDanhMuc: ns.maDanhMuc,
        tenDanhMuc: dm.ten,
        hanMuc: ns.hanMuc,
        daChi,
        chenhLech: chenhLechNs,
        phanTram,
        noiDung: t('Danh mục "{0}" đã chi {1}, vượt ngân sách {2} (+{3}%). Cần tạm dừng các khoản chi phát sinh thêm trong tháng này.', [dm.ten, dinhDangTien(daChi), dinhDangTien(chenhLechNs), (phanTram - 100).toFixed(1)]),
      })
    } else if (phanTram >= 80) {
      // Nhắc nhở: Đã dùng từ 80% trở lên
      const conLai = ns.hanMuc - daChi
      canhBaoNganSach.push({
        loai: 'nhac-nho',
        maDanhMuc: ns.maDanhMuc,
        tenDanhMuc: dm.ten,
        hanMuc: ns.hanMuc,
        daChi,
        chenhLech: chenhLechNs,
        phanTram,
        noiDung: t('Danh mục "{0}" đã sử dụng {1}% hạn mức (còn lại {2}). Hãy cân nhắc trước các khoản chi sắp tới.', [dm.ten, phanTram, dinhDangTien(conLai)]),
      })
    }
  }

  // 7. Nhận xét tổng quan (Executive Summary) dựa trên dữ liệu thật
  let nhanXetTongQuan: string
  if (giaoDichTrongKy.length === 0) {
    nhanXetTongQuan = t('Chưa ghi nhận giao dịch nào trong khoảng thời gian này. Hãy thêm giao dịch hoặc điều chỉnh bộ lọc để xem số liệu phân tích.')
  } else if (chenhLech < 0) {
    const dmMax = coCauChi[0]
    nhanXetTongQuan = t('Trong kỳ này, tổng chi tiêu ({0}) đang vượt tổng thu nhập ({1}), dẫn đến thâm hụt dòng tiền {2}. {3} Bạn nên chủ động rà soát lại các khoản chi không thiết yếu.', [dinhDangTien(tongChi), dinhDangTien(tongThu), dinhDangTien(Math.abs(chenhLech)), dmMax ? `Khoản chi lớn nhất là "${dmMax.danhMuc.ten}" với ${dinhDangTien(dmMax.soTien)} (chiếm ${dmMax.tyTrong}% tổng chi).` : ''])
  } else if (tiLeTietKiem >= 25) {
    nhanXetTongQuan = t('Tình hình tài chính trong kỳ rất tích cực. Bạn đạt tỷ lệ tích lũy {0}% (giữ lại {1} trên tổng thu {2}). Dòng tiền thặng dư đang tạo nền tảng vững chắc cho các mục tiêu tiết kiệm dài hạn.', [tiLeTietKiem, dinhDangTien(tienGiuLai), dinhDangTien(tongThu)])
  } else if (tiLeTietKiem > 0) {
    nhanXetTongQuan = t('Thu chi trong kỳ ở mức tương đối cân bằng. Bạn giữ lại được {0} (tương đương {1}% thu nhập). Để tối ưu hơn, bạn có thể thiết lập thêm ngân sách cho các danh mục chi tiêu lớn.', [dinhDangTien(tienGiuLai), tiLeTietKiem])
  } else {
    nhanXetTongQuan = t('Tổng thu và tổng chi trong kỳ xấp xỉ ngang nhau. Hãy theo dõi sát dòng tiền để tránh phát sinh chi tiêu vượt mức thu nhập.')
  }

  // 8. Diễn giải tự động bên dưới từng biểu đồ
  // Diễn giải Biểu đồ Thu & Chi
  let dienGiaiThuChi = ''
  if (chuoiThang.length > 0) {
    const thangGanNhat = chuoiThang[chuoiThang.length - 1]
    if (thangGanNhat.thu === 0 && thangGanNhat.chi === 0) {
      dienGiaiThuChi = t('{0} chưa có giao dịch thu hoặc chi phát sinh.', [thangGanNhat.nhan])
    } else {
      dienGiaiThuChi = t('Trong {0}, tổng thu nhập đạt {1} và tổng chi tiêu là {2}. {3}', [thangGanNhat.nhan, dinhDangTien(thangGanNhat.thu), dinhDangTien(thangGanNhat.chi), thangGanNhat.thu >= thangGanNhat.chi ? 'Thu nhập đủ bù đắp chi tiêu.' : 'Chi tiêu đang cao hơn thu nhập trong tháng.'])
    }
  }

  // Diễn giải Biểu đồ Tiền giữ lại
  let dienGiaiTienGiuLai: string
  const cacThangCoGd = chuoiThang.filter((m) => m.thu > 0 || m.chi > 0)
  if (cacThangCoGd.length === 0) {
    dienGiaiTienGiuLai = t('Chưa có dữ liệu biến động dòng tiền giữa các tháng.')
  } else {
    const thangAm = cacThangCoGd.filter((m) => m.tienGiuLai < 0)
    const thangDuong = cacThangCoGd.filter((m) => m.tienGiuLai > 0)
    if (thangAm.length > 0 && thangDuong.length > 0) {
      const maxAm = [...thangAm].sort((a, b) => a.tienGiuLai - b.tienGiuLai)[0]
      const maxDuong = [...thangDuong].sort((a, b) => b.tienGiuLai - a.tienGiuLai)[0]
      dienGiaiTienGiuLai = t('{0} có mức giữ lại cao nhất (+{1}), trong khi {2} ghi nhận thâm hụt ({3}). Cột xanh thể hiện thặng dư nằm trên mốc 0, cột đỏ thể hiện thâm hụt nằm dưới mốc 0.', [maxDuong.nhan, dinhDangTien(maxDuong.tienGiuLai), maxAm.nhan, dinhDangTien(maxAm.tienGiuLai)])
    } else if (thangAm.length > 0) {
      const maxAm = [...thangAm].sort((a, b) => a.tienGiuLai - b.tienGiuLai)[0]
      dienGiaiTienGiuLai = t('Ghi nhận chi tiêu vượt thu nhập trong các tháng gần đây (lớn nhất tại {0} với mức thâm hụt {1}). Cột màu đỏ thể hiện số tiền chi tiêu vượt thu nhập.', [maxAm.nhan, dinhDangTien(Math.abs(maxAm.tienGiuLai))])
    } else {
      dienGiaiTienGiuLai = t('Tất cả các tháng đều duy trì thặng dư tài chính dương (thu nhập luôn lớn hơn hoặc bằng chi tiêu). Cột màu xanh thể hiện số tiền còn lại sau chi tiêu.')
    }
  }

  // Diễn giải Biểu đồ Cơ cấu chi tiêu
  let dienGiaiCoCauChi: string
  if (coCauChi.length === 0) {
    dienGiaiCoCauChi = t('Không có khoản chi nào trong kỳ báo cáo này.')
  } else {
    const top1 = coCauChi[0]
    const top2 = coCauChi[1]
    dienGiaiCoCauChi = t('Danh mục "{0}" chiếm tỷ trọng lớn nhất với {1}% ({2}, {3} lượt). {4} Bạn có thể bấm trực tiếp vào danh mục để lọc xem các giao dịch liên quan.', [top1.danhMuc.ten, top1.tyTrong, dinhDangTien(top1.soTien), top1.soLuong, top2 ? `Kế tiếp là "${top2.danhMuc.ten}" chiếm ${top2.tyTrong}%.` : ''])
  }

  // 9. Gợi ý cải thiện tài chính
  const goiYTietKiem: string[] = []
  if (chenhLech < 0) {
    goiYTietKiem.push(t('Đặt giới hạn chi tiêu chặt chẽ cho danh mục lớn nhất để cắt giảm thâm hụt.'))
    goiYTietKiem.push(t('Ưu tiên thanh toán các nhu cầu thiết yếu, hoãn lại các khoản mua sắm tùy ý.'))
  }
  if (canhBaoNganSach.length > 0) {
    goiYTietKiem.push(t('Có danh mục vượt hoặc cận kề ngân sách. Hãy điều chỉnh hạn mức hoặc kiểm soát các khoản chi mới.'))
  }
  if (tiLeTietKiem >= 20) {
    goiYTietKiem.push(t('Trích một phần tiền thặng dư vào Mục tiêu tiết kiệm để tối ưu hóa giá trị đồng tiền.'))
  }
  if (goiYTietKiem.length === 0) {
    goiYTietKiem.push(t('Duy trì thói quen ghi chép giao dịch ngay sau khi phát sinh để báo cáo luôn chính xác.'))
    goiYTietKiem.push(t('Đặt mục tiêu tích lũy tối thiểu 15-20% thu nhập mỗi tháng để xây dựng quỹ khẩn cấp.'))
  }

  return {
    ky,
    tieuDeKy,
    tuNgay,
    denNgay,
    giaoDichTrongKy,
    soLuongGiaoDich: giaoDichTrongKy.length,
    tongThu,
    tongChi,
    chenhLech,
    tienGiuLai,
    tiLeTietKiem,
    tiLeTietKiemHienThi,
    tongSoDuVi,
    chuoiThang,
    coCauChi,
    soSanhKyTruoc: {
      coSoLieu: coSoLieuKyTruoc,
      tangChi,
      tangThu,
    },
    canhBaoNganSach,
    nhanXetTongQuan,
    dienGiaiThuChi,
    dienGiaiTienGiuLai,
    dienGiaiCoCauChi,
    goiYTietKiem,
  }
}
