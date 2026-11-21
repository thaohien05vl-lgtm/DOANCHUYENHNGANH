import { t } from '../../utils/ngonNgu'

export type ZodiacSignId =
  | 'bach-duong'
  | 'kim-nguu'
  | 'song-tu'
  | 'cu-giai'
  | 'su-tu'
  | 'xu-nu'
  | 'thien-binh'
  | 'bo-cap'
  | 'nhan-ma'
  | 'ma-ket'
  | 'bao-binh'
  | 'song-ngu'

export interface DiemChiTiet {
  tieuDe: string
  moTa: string
  icon?: string
}

export interface ZodiacInfo {
  id: ZodiacSignId
  ten: string
  tenTiengAnh: string
  kyHieu: string
  ngayBatDau: string
  ngayKetThuc: string
  khoangNgay: string
  nguyenTo: 'Lửa' | 'Đất' | 'Khí' | 'Nước'
  hanhTinh: string
  moTaNgan: string
  tinhCach: {
    tieuDe: string
    noiDung: string
    theGioiNoiTam: string
    tongQuan: string
  }
  diemManh: {
    tieuDe: string
    moTaChiTiet: string
    danhSach: DiemChiTiet[]
  }
  diemCanCanBang: {
    tieuDe: string
    moTaChiTiet: string
    danhSach: DiemChiTiet[]
    loiNhac: string
  }
  loiKhuyen: {
    tieuDe: string
    trongMoiQuanHe: string
    phatTrienBanThan: string
    thongDiep: string
  }
}

export const ZODIAC_DATA: Record<ZodiacSignId, ZodiacInfo> = {
  'song-ngu': {
    id: 'song-ngu',
    ten: t('Song Ngư'),
    tenTiengAnh: 'Pisces',
    kyHieu: '♓',
    ngayBatDau: '19/02',
    ngayKetThuc: '20/03',
    khoangNgay: '19/02 – 20/03',
    nguyenTo: 'Nước',
    hanhTinh: 'Sao Hải Vương & Sao Mộc',
    moTaNgan: t('Tinh tế, giàu cảm xúc và trực giác'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Song Ngư là người nhạy cảm, giàu lòng trắc ẩn và luôn hướng về những điều tốt đẹp. Bạn có trực giác mạnh, dễ đồng cảm và thường đặt cảm xúc của người khác lên hàng đầu.',
      ),
      theGioiNoiTam: t(
        'Tâm hồn của Song Ngư như một đại dương sâu thẳm, nơi cảm xúc và trí tưởng tượng hòa quyện. Bạn cảm nhận cuộc sống bằng trái tim nhiều hơn lý trí, luôn khao khát tìm kiếm sự chân thành và những rung cảm nghệ thuật thuần khiết.',
      ),
      tongQuan: t(
        'Bạn là người mơ mộng, giàu trí tưởng tượng và luôn muốn tìm kiếm sự bình yên trong tâm hồn.',
      ),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t(
        'Sức mạnh lớn nhất của Song Ngư bắt nguồn từ sự thấu cảm sâu sắc và nguồn sáng tạo nghệ thuật không bao giờ cạn.',
      ),
      danhSach: [
        {
          tieuDe: t('Trực giác sắc bén'),
          moTa: t('Cảm nhận được những biến chuyển cảm xúc tinh tế của người xung quanh ngay cả khi họ chưa nói ra.'),
        },
        {
          tieuDe: t('Giàu lòng vị tha'),
          moTa: t('Sẵn lòng lắng nghe, đồng hành và nâng đỡ người khác khi họ gặp khó khăn.'),
        },
        {
          tieuDe: t('Trí tưởng tượng phong phú'),
          moTa: t('Sở hữu năng khiếu thẩm mỹ tự nhiên, nhạy bén với cái đẹp, âm nhạc và ngôn từ.'),
        },
        {
          tieuDe: t('Khả năng thích nghi mềm dẻo'),
          moTa: t('Như dòng nước uốn lượn, Song Ngư biết cách xoa dịu các xung đột và tạo nên bầu không khí ấm áp.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t(
        'Bản tính bao dung và nhạy cảm đôi khi khiến Song Ngư gánh vác quá nhiều tâm sự của người khác.',
      ),
      danhSach: [
        {
          tieuDe: t('Dễ suy nghĩ quá nhiều'),
          moTa: t('Có xu hướng đắm chìm trong suy tư hoặc lo âu về những điều chưa xảy ra.'),
        },
        {
          tieuDe: t('Khó từ chối người khác'),
          moTa: t('Vì sợ làm tổn thương người khác nên đôi lúc quên mất việc bảo vệ giới hạn cá nhân.'),
        },
        {
          tieuDe: t('Đôi khi thiếu quyết đoán'),
          moTa: t('Cần thêm sự lý trí và kỷ luật khi phải đưa ra các quyết định tài chính hoặc cuộc sống quan trọng.'),
        },
      ],
      loiNhac: t(
        'Hãy dành thời gian nạp lại năng lượng cho bản thân và học cách nói "không" khi cần thiết để bảo vệ sự an yên của chính mình.',
      ),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t(
        'Trong tình cảm và tình bạn, sự chân thành là món quà vô giá của bạn. Hãy chia sẻ thẳng thắn nhu cầu của mình thay vì chỉ im lặng hy sinh.',
      ),
      phatTrienBanThan: t(
        'Kết hợp trực giác nhạy bén với một kế hoạch hành động cụ thể, đặc biệt là trong quản lý chi tiêu và công việc, sẽ giúp bạn biến ước mơ thành hiện thực.',
      ),
      thongDiep: t('“Hãy để sự dịu dàng làm sức mạnh và để ước mơ dẫn lối từng bước chân kiên định.”'),
    },
  },

  'bach-duong': {
    id: 'bach-duong',
    ten: t('Bạch Dương'),
    tenTiengAnh: 'Aries',
    kyHieu: '♈',
    ngayBatDau: '21/03',
    ngayKetThuc: '19/04',
    khoangNgay: '21/03 – 19/04',
    nguyenTo: 'Lửa',
    hanhTinh: 'Sao Hỏa',
    moTaNgan: t('Nhiệt huyết, chủ động và quyết đoán'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Bạch Dương mang trong mình ngọn lửa tiên phong, luôn tràn đầy năng lượng tích cực và sẵn sàng dấn thân trước mọi thử thách mới.',
      ),
      theGioiNoiTam: t(
        'Là cung hoàng đạo đầu tiên của vòng hoàng đạo, nội tâm Bạch Dương luôn hướng về phía trước với sự trong sáng, thẳng thắn và khao khát tự khẳng định giá trị bản thân.',
      ),
      tongQuan: t(
        'Bạn là người dũng cảm, tràn đầy nhiệt huyết và luôn truyền cảm hứng hành động cho những người xung quanh.',
      ),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Tinh thần dám nghĩ dám làm và tốc độ hành động chớp nhoáng là vũ khí mạnh nhất của Bạch Dương.'),
      danhSach: [
        {
          tieuDe: t('Khả năng lãnh đạo tiên phong'),
          moTa: t('Không ngần ngại bước lên phía trước mở đường và dẫn dắt tập thể vượt qua khó khăn.'),
        },
        {
          tieuDe: t('Chân thành và thẳng thắn'),
          moTa: t('Rõ ràng, minh bạch, ghét sự giả tạo và luôn sống thật với cảm xúc của mình.'),
        },
        {
          tieuDe: t('Năng lượng dồi dào'),
          moTa: t('Sức bật và tinh thần lạc quan giúp bạn nhanh chóng hồi phục sau mỗi lần vấp ngã.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Ngọn lửa nhiệt huyết đôi lúc biến thành sự nóng vội nếu không được kiểm soát tốt.'),
      danhSach: [
        {
          tieuDe: t('Dễ mất kiên nhẫn'),
          moTa: t('Muốn thấy kết quả ngay lập tức và dễ nản lòng với các công việc đòi hỏi sự tỉ mỉ dài hạn.'),
        },
        {
          tieuDe: t('Bốc đồng trong chi tiêu'),
          moTa: t('Dễ mua sắm theo cảm hứng nhất thời trước khi cân nhắc kế hoạch ngân sách.'),
        },
      ],
      loiNhac: t('Chậm lại một nhịp trước khi quyết định sẽ giúp bạn tránh được những sai lầm đáng tiếc.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t(
        'Lắng nghe nhiều hơn và tôn trọng góc nhìn của người khác sẽ giúp bạn xây dựng những mối liên kết bền chặt.',
      ),
      phatTrienBanThan: t(
        'Rèn luyện tính kiên nhẫn và duy trì sự kỷ luật đều đặn trong việc theo dõi ngân sách tài chính cá nhân.',
      ),
      thongDiep: t('“Lòng can đảm là bước khởi đầu, nhưng sự kiên định mới là thứ đưa bạn về đích.”'),
    },
  },

  'kim-nguu': {
    id: 'kim-nguu',
    ten: t('Kim Ngưu'),
    tenTiengAnh: 'Taurus',
    kyHieu: '♉',
    ngayBatDau: '20/04',
    ngayKetThuc: '20/05',
    khoangNgay: '20/04 – 20/05',
    nguyenTo: 'Đất',
    hanhTinh: 'Sao Kim',
    moTaNgan: t('Bền bỉ, ổn định và yêu sự thoải mái'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Kim Ngưu tượng trưng cho sự vững chãi, điềm tĩnh và đáng tin cậy. Bạn coi trọng sự ổn định, an toàn và có mắt nhìn tinh tế về nghệ thuật cuộc sống.',
      ),
      theGioiNoiTam: t(
        'Bên trong vẻ ngoài trầm lặng là một tâm hồn yêu chuộng sự hài hòa, trân trọng những giá trị bền vững và luôn kiên trì xây dựng nền tảng vững chắc cho tương lai.',
      ),
      tongQuan: t(
        'Bạn là điểm tựa an toàn, kiên định và luôn mang lại cảm giác bình yên, ấm cúng cho người thân yêu.',
      ),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Sự kiên nhẫn phi thường và tư duy quản lý tài chính bẩm sinh là thế mạnh vượt trội của Kim Ngưu.'),
      danhSach: [
        {
          tieuDe: t('Quản lý tài chính thực tế'),
          moTa: t('Biết cách tích lũy, đầu tư an toàn và chi tiêu thông minh cho những điều xứng đáng.'),
        },
        {
          tieuDe: t('Độ tin cậy tuyệt đối'),
          moTa: t('Một khi đã hứa, Kim Ngưu sẽ dốc lòng thực hiện trọn vẹn và không bao giờ bỏ cuộc.'),
        },
        {
          tieuDe: t('Gu thẩm mỹ tinh tế'),
          moTa: t('Được bảo hộ bởi sao Kim, bạn có sự nhạy cảm tuyệt vời với ẩm thực, nghệ thuật và không gian sống.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Sự kiên định nếu thái quá có thể trở thành sự cố chấp và ngại thay đổi.'),
      danhSach: [
        {
          tieuDe: t('Khó thích ứng với sự đổi mới'),
          moTa: t('Thường do dự hoặc cảm thấy bất an khi môi trường quen thuộc có sự xáo trộn bất ngờ.'),
        },
        {
          tieuDe: t('Xu hướng nuông chiều bản thân'),
          moTa: t('Cần lưu ý kiểm soát các khoản chi dành cho thú vui hưởng thụ để không vượt hạn mức.'),
        },
      ],
      loiNhac: t('Hãy đón nhận những góc nhìn mới mẻ như một cơ hội để làm phong phú thêm cuộc sống của bạn.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t(
        'Mở lòng đón nhận sự khác biệt của đối phương và thể hiện tình cảm qua những lời nói ngọt ngào ngoài hành động.',
      ),
      phatTrienBanThan: t(
        'Tiếp tục phát huy thế mạnh tiết kiệm và lập ngân sách định kỳ để xây dựng sự tự do tài chính vững chắc.',
      ),
      thongDiep: t('“Sự bền bỉ từng ngày kiến tạo nên những thành quả vĩ đại và lâu bền.”'),
    },
  },

  'song-tu': {
    id: 'song-tu',
    ten: t('Song Tử'),
    tenTiengAnh: 'Gemini',
    kyHieu: '♊',
    ngayBatDau: '21/05',
    ngayKetThuc: '20/06',
    khoangNgay: '21/05 – 20/06',
    nguyenTo: 'Khí',
    hanhTinh: 'Sao Thủy',
    moTaNgan: t('Linh hoạt, tò mò và giao tiếp tốt'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Song Tử nổi bật với trí tuệ nhanh nhạy, tính cách dí dỏm và niềm say mê bất tận với thế giới tri thức đa dạng xung quanh.',
      ),
      theGioiNoiTam: t(
        'Tâm trí của Song Tử như một cơn gió nhẹ liên tục luân chuyển, luôn khao khát kết nối, học hỏi điều mới và chia sẻ những ý tưởng thú vị với mọi người.',
      ),
      tongQuan: t('Bạn là người hoạt ngôn, thông minh, mang lại sự tươi vui và luồng sinh khí mới ở bất cứ nơi đâu.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Khả năng giao tiếp khéo léo và tư duy đa chiều giúp Song Tử dễ dàng thành công trong mọi môi trường.'),
      danhSach: [
        {
          tieuDe: t('Giao tiếp và kết nối tài tình'),
          moTa: t('Dễ dàng bắt chuyện, lắng nghe và truyền đạt thông điệp một cách thuyết phục, lôi cuốn.'),
        },
        {
          tieuDe: t('Thích ứng cực nhanh'),
          moTa: t('Nhanh chóng nắm bắt công nghệ mới, thông tin mới và thích nghi với mọi hoàn cảnh biến đổi.'),
        },
        {
          tieuDe: t('Tư duy sáng tạo phong phú'),
          moTa: t('Luôn nhìn thấy nhiều phương án giải quyết cho một vấn đề phức tạp.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Sự tò mò đa dạng đôi khi khiến Song Tử bị phân tán năng lượng.'),
      danhSach: [
        {
          tieuDe: t('Dễ mất tập trung'),
          moTa: t('Có xu hướng bắt đầu nhiều dự án cùng lúc nhưng gặp khó khăn khi phải theo đuổi đến cùng.'),
        },
        {
          tieuDe: t('Tâm trạng thay đổi nhanh'),
          moTa: t('Cảm xúc dễ bị dao động trước các luồng thông tin nhiều chiều trên mạng xã hội.'),
        },
      ],
      loiNhac: t('Chọn một mục tiêu ưu tiên duy nhất tại mỗi thời điểm sẽ giúp bạn đạt được kết quả sâu sắc hơn.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t(
        'Dành thời gian lắng nghe sâu sắc cảm xúc của người đối diện thay vì chỉ trao đổi thông tin bề nổi.',
      ),
      phatTrienBanThan: t(
        'Tập thói quen ghi chép tài chính hàng ngày để rèn luyện tính kiên định và tập trung vào các mục tiêu dài hạn.',
      ),
      thongDiep: t('“Tri thức là đôi cánh, nhưng sự kiên trì mới là ngọn gió nâng bạn bay cao.”'),
    },
  },

  'cu-giai': {
    id: 'cu-giai',
    ten: t('Cự Giải'),
    tenTiengAnh: 'Cancer',
    kyHieu: '♋',
    ngayBatDau: '21/06',
    ngayKetThuc: '22/07',
    khoangNgay: '21/06 – 22/07',
    nguyenTo: 'Nước',
    hanhTinh: 'Mặt Trăng',
    moTaNgan: t('Ấm áp, quan tâm và coi trọng gia đình'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Cự Giải là hiện thân của sự chu đáo, tấm lòng trắc ẩn và tình cảm chân thành. Bạn luôn bảo bọc, chở che và tạo dựng sự gắn kết bền chặt giữa những người thân yêu.',
      ),
      theGioiNoiTam: t(
        'Được cai trị bởi Mặt Trăng, tâm hồn Cự Giải giàu xúc cảm và trân trọng ký ức. Bạn có trực giác nhạy cảm với không khí xung quanh và luôn hướng về tổ ấm bình yên.',
      ),
      tongQuan: t('Bạn là người ấm áp, biết lắng nghe và luôn mang lại cảm giác an toàn, che chở cho người khác.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Trái tim yêu thương và khả năng bảo vệ, vun đắp mối quan hệ là sức mạnh tự nhiên của Cự Giải.'),
      danhSach: [
        {
          tieuDe: t('Khả năng chăm sóc bẩm sinh'),
          moTa: t('Luôn tinh ý nhận ra ai đang cần sự giúp đỡ và sẵn sàng sẻ chia ấm áp.'),
        },
        {
          tieuDe: t('Trực giác nội tâm nhạy bén'),
          moTa: t('Linh cảm chính xác về tính cách con người và sự biến chuyển của các tình huống.'),
        },
        {
          tieuDe: t('Ý thức tích lũy tài chính cao'),
          moTa: t('Cẩn trọng, biết lo xa và luôn chuẩn bị quỹ dự phòng an toàn cho gia đình.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Vỏ bọc tự vệ đôi khi khiến Cự Giải giấu kín cảm xúc thật và giữ nỗi buồn trong lòng.'),
      danhSach: [
        {
          tieuDe: t('Dễ bị tổn thương'),
          moTa: t('Thường nhớ rất lâu những lời nói vô tình và suy diễn tiêu cực.'),
        },
        {
          tieuDe: t('Ngại bước khỏi vùng an toàn'),
          moTa: t('Cần thêm sự tự tin khi đối mặt với những thử thách mới ngoài môi trường quen thuộc.'),
        },
      ],
      loiNhac: t('Bộc lộ cảm xúc một cách nhẹ nhàng sẽ giúp bạn giải tỏa áp lực và được thấu hiểu nhiều hơn.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Hãy tin tưởng đối phương và chia sẻ thẳng thắn những nỗi lo thầm kín trong lòng.'),
      phatTrienBanThan: t(
        'Đặt ra ranh giới cảm xúc rõ ràng để không bị hút cạn năng lượng bởi những xung đột không liên quan đến mình.',
      ),
      thongDiep: t('“Sự dịu dàng chân thành có thể làm tan chảy những bức tường băng giá nhất.”'),
    },
  },

  'su-tu': {
    id: 'su-tu',
    ten: t('Sư Tử'),
    tenTiengAnh: 'Leo',
    kyHieu: '♌',
    ngayBatDau: '23/07',
    ngayKetThuc: '22/08',
    khoangNgay: '23/07 – 22/08',
    nguyenTo: 'Lửa',
    hanhTinh: 'Mặt Trời',
    moTaNgan: t('Tự tin, hào phóng và giàu năng lượng'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Sư Tử sở hữu phong thái rạng rỡ, tự tin và trái tim ấm áp, nghĩa hiệp. Bạn sinh ra để tỏa sáng và truyền cảm hứng sống tích cực đến cộng đồng.',
      ),
      theGioiNoiTam: t(
        'Được Mặt Trời chiếu rọi, nội tâm Sư Tử khao khát khẳng định giá trị bản thân thông qua sự cống hiến, hào sảng và tình yêu thương chân thành dành cho những người bạn yêu quý.',
      ),
      tongQuan: t('Bạn là người dẫn đầu tự tin, hào hiệp, luôn mang lại ánh sáng và niềm vui cho mọi người xung quanh.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Khí chất vương giả, tinh thần trách nhiệm và lòng hào phóng tạo nên sức hút khó cưỡng của Sư Tử.'),
      danhSach: [
        {
          tieuDe: t('Khả năng truyền cảm hứng'),
          moTa: t('Thu hút đám đông, khích lệ tinh thần và dẫn dắt đội ngũ bằng sự nhiệt thành lôi cuốn.'),
        },
        {
          tieuDe: t('Rộng lượng và nghĩa khí'),
          moTa: t('Không tiếc công sức giúp đỡ bạn bè và bảo vệ những người yếu thế hơn mình.'),
        },
        {
          tieuDe: t('Sáng tạo và bản lĩnh'),
          moTa: t('Dám nghĩ lớn, dám hành động lớn và luôn thể hiện cá tính riêng biệt.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Lòng kiêu hãnh cao đôi khi khiến Sư Tử khó chấp nhận lời góp ý trái chiều.'),
      danhSach: [
        {
          tieuDe: t('Cái tôi quá lớn'),
          moTa: t('Ngại thừa nhận sai sót hoặc xin sự trợ giúp khi gặp khó khăn cá nhân.'),
        },
        {
          tieuDe: t('Chi tiêu phóng khoáng quá mức'),
          moTa: t('Dễ chi tiền mua sắm xa xỉ hoặc đãi tiệc để giữ thể diện trước bạn bè.'),
        },
      ],
      loiNhac: t('Sự khiêm nhường không làm giảm giá trị của bạn, mà chính là viên ngọc quý làm tôn lên vẻ đẹp bản lĩnh.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Hãy học cách lắng nghe và để những người thân yêu cùng tỏa sáng bên cạnh bạn.'),
      phatTrienBanThan: t(
        'Kiểm soát chi tiêu có kế hoạch, hướng năng lượng hào phóng vào các mục tiêu đầu tư sinh lời bền vững.',
      ),
      thongDiep: t('“Ánh mặt trời rạng rỡ nhất là ánh sáng mang lại hơi ấm và hy vọng cho muôn loài.”'),
    },
  },

  'xu-nu': {
    id: 'xu-nu',
    ten: t('Xử Nữ'),
    tenTiengAnh: 'Virgo',
    kyHieu: '♍',
    ngayBatDau: '23/08',
    ngayKetThuc: '22/09',
    khoangNgay: '23/08 – 22/09',
    nguyenTo: 'Đất',
    hanhTinh: 'Sao Thủy',
    moTaNgan: t('Tỉ mỉ, thực tế và chú trọng chi tiết'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Xử Nữ nổi tiếng với óc phân tích sắc sảo, sự cẩn trọng, kỷ luật và tinh thần phụng sự không mệt mỏi. Bạn luôn hướng tới sự hoàn thiện và trật tự ngăn nắp.',
      ),
      theGioiNoiTam: t(
        'Bên trong sự điềm tĩnh là một tâm trí luôn hoạt động để cải thiện mọi thứ tốt đẹp hơn. Xử Nữ quan tâm sâu sắc đến những người xung quanh bằng những hành động cụ thể, thiết thực.',
      ),
      tongQuan: t('Bạn là người chu đáo, thông minh, đáng tin cậy và có khả năng tổ chức công việc khoa học vượt trội.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Óc quan sát tinh tường và năng lực quản lý hệ thống biến Xử Nữ thành chuyên gia xử lý khủng hoảng.'),
      danhSach: [
        {
          tieuDe: t('Tỉ mỉ và chính xác cao'),
          moTa: t('Nhìn thấy những chi tiết nhỏ mà người khác dễ bỏ qua, hạn chế tối đa rủi ro.'),
        },
        {
          tieuDe: t('Kỷ luật và quản lý tài chính mẫu mực'),
          moTa: t('Theo dõi ngân sách chi tiết, có kế hoạch tài chính rõ ràng và tiết kiệm khoa học.'),
        },
        {
          tieuDe: t('Tinh thần trách nhiệm cao độ'),
          moTa: t('Luôn hoàn thành mọi nhiệm vụ được giao với tiêu chuẩn chất lượng cao nhất.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Tiêu chuẩn cầu toàn đôi lúc gây áp lực vô hình lên chính bản thân bạn.'),
      danhSach: [
        {
          tieuDe: t('Tự phê bình quá khắt khe'),
          moTa: t('Thường dằn vặt bản thân vì những thiếu sót nhỏ không đáng kể.'),
        },
        {
          tieuDe: t('Dễ căng thẳng lo âu'),
          moTa: t('Luôn lo nghĩ trước mọi tình huống phát sinh, khó thả lỏng tâm trí nghỉ ngơi.'),
        },
      ],
      loiNhac: t('Chấp nhận những điều chưa hoàn hảo là một phần quan trọng để tìm thấy sự an lạc trong tâm hồn.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Bớt phán xét chi tiết và ghi nhận nhiều hơn những nỗ lực chân thành của đối phương.'),
      phatTrienBanThan: t(
        'Dành thời gian thư giãn không làm việc để nạp lại năng lượng tinh thần sau những giờ lao động tập trung.',
      ),
      thongDiep: t('“Sự hoàn hảo không nằm ở việc không có lỗi sai, mà nằm ở hành trình không ngừng vươn lên.”'),
    },
  },

  'thien-binh': {
    id: 'thien-binh',
    ten: t('Thiên Bình'),
    tenTiengAnh: 'Libra',
    kyHieu: '♎',
    ngayBatDau: '23/09',
    ngayKetThuc: '22/10',
    khoangNgay: '23/09 – 22/10',
    nguyenTo: 'Khí',
    hanhTinh: 'Sao Kim',
    moTaNgan: t('Hài hòa, tinh tế và yêu cái đẹp'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Thiên Bình là biểu tượng của cán cân công lý, sự hòa nhã, thanh lịch và tinh thần tôn trọng hòa bình. Bạn có khả năng kết nối mọi người bằng sự công tâm và duyên dáng.',
      ),
      theGioiNoiTam: t(
        'Tâm hồn Thiên Bình luôn khao khát sự cân bằng tuyệt đối giữa lý trí và cảm xúc, giữa cái tôi và xã hội. Bạn yêu cái đẹp và luôn nỗ lực kiến tạo một không gian sống văn minh, yên bình.',
      ),
      tongQuan: t('Bạn là người lịch thiệp, công bằng, có năng khiếu ngoại giao và mắt thẩm mỹ nghệ thuật tinh tế.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Khả năng nhìn nhận sự việc khách quan từ nhiều góc độ giúp Thiên Bình trở thành người giải hòa xuất sắc.'),
      danhSach: [
        {
          tieuDe: t('Ngoại giao khéo léo'),
          moTa: t('Biết cách ứng xử nhã nhặn, tôn trọng đối phương và giải quyết xung đột êm đẹp.'),
        },
        {
          tieuDe: t('Mắt nhìn thẩm mỹ xuất sắc'),
          moTa: t('Biết cách phối hợp màu sắc, bài trí không gian và lựa chọn phong cách sống thanh lịch.'),
        },
        {
          tieuDe: t('Công bằng và chính trực'),
          moTa: t('Luôn đứng về lẽ phải và tìm kiếm giải pháp có lợi cho tất cả các bên tham gia.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Cố gắng làm hài lòng mọi người đôi khi khiến Thiên Bình quên đi chính kiến của bản thân.'),
      danhSach: [
        {
          tieuDe: t('Thường xuyên do dự'),
          moTa: t('Cân nhắc quá nhiều mặt lợi hại dẫn đến việc chậm trễ đưa ra quyết định quan trọng.'),
        },
        {
          tieuDe: t('Né tránh đối đầu trực tiếp'),
          moTa: t('Có xu hướng im lặng hoặc né tránh khi cần giải quyết thẳng thắn các khúc mắc.'),
        },
      ],
      loiNhac: t('Tin tưởng vào tiếng nói trực giác bên trong và dũng cảm chọn lựa con đường của riêng bạn.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Dũng cảm bộc lộ quan điểm cá nhân, sự bất đồng lành mạnh là nền tảng của sự thấu hiểu lâu dài.'),
      phatTrienBanThan: t(
        'Lập bảng theo dõi thu chi rõ ràng để giữ cán cân tài chính luôn ở trạng thái thặng dư vững chắc.',
      ),
      thongDiep: t('“Sự hòa hợp đích thực bắt đầu từ sự bình an và dứt khoát trong chính tâm hồn bạn.”'),
    },
  },

  'bo-cap': {
    id: 'bo-cap',
    ten: t('Bọ Cạp'),
    tenTiengAnh: 'Scorpio',
    kyHieu: '♏',
    ngayBatDau: '23/10',
    ngayKetThuc: '21/11',
    khoangNgay: '23/10 – 21/11',
    nguyenTo: 'Nước',
    hanhTinh: 'Sao Diêm Vương & Sao Hỏa',
    moTaNgan: t('Sâu sắc, quyết tâm và giàu nội lực'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Bọ Cạp mang vẻ đẹp bí ẩn, nội lực mãnh liệt và tinh thần kiên cường phi thường. Khi đã quyết định điều gì, bạn sẽ theo đuổi với niềm đam mê cháy bỏng và sự tập trung tuyệt đối.',
      ),
      theGioiNoiTam: t(
        'Nội tâm Bọ Cạp sâu thẳm như đại dương đêm huyền bí. Bạn có khả năng nhìn thấu bản chất vấn đề và trân trọng sự trung thành, tính chân thật hơn bất cứ điều gì trên đời.',
      ),
      tongQuan: t('Bạn là người kiên định, sâu sắc, trung thành tuyệt đối và sở hữu sức mạnh nội tâm đáng nể.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Sức bền ý chí và khả năng tự tái sinh sau nghịch cảnh là đặc ân lớn nhất của Bọ Cạp.'),
      danhSach: [
        {
          tieuDe: t('Tập trung cao độ và quyết tâm'),
          moTa: t('Không có chướng ngại nào có thể ngăn cản bạn khi mục tiêu đã được xác lập rõ ràng.'),
        },
        {
          tieuDe: t('Trực giác thấu thị'),
          moTa: t('Dễ dàng nhận ra sự thật đằng sau những lời nói dối hoặc sự giả tạo.'),
        },
        {
          tieuDe: t('Trung thành và bảo bọc'),
          moTa: t('Sẵn sàng làm mọi điều để chở che và sát cánh cùng những người thực sự quan trọng.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Sự phòng thủ cẩn mật đôi khi biến thành sự hoài nghi không cần thiết.'),
      danhSach: [
        {
          tieuDe: t('Khó tha thứ và buông bỏ'),
          moTa: t('Thường giữ nỗi đau quá khứ lâu trong lòng khiến tâm trạng nặng nề.'),
        },
        {
          tieuDe: t('Tính sở hữu và kiểm soát'),
          moTa: t('Cần học cách thả lỏng và tin tưởng để đối phương có không gian riêng thở.'),
        },
      ],
      loiNhac: t('Buông bỏ không phải là thất bại, mà là trao cho chính mình món quà của sự tự do tinh thần.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Hạ thấp hàng rào phòng thủ và cho phép bản thân được yếu đuối trước người thực sự yêu thương bạn.'),
      phatTrienBanThan: t(
        'Sử dụng khả năng hoạch định chiến lược để đầu tư thông minh và xây dựng nguồn tài sản thầm lặng vững mạnh.',
      ),
      thongDiep: t('“Sức mạnh vĩ đại nhất của đại bàng là khả năng vút bay từ tro tàn để đón nhận bầu trời mới.”'),
    },
  },

  'nhan-ma': {
    id: 'nhan-ma',
    ten: t('Nhân Mã'),
    tenTiengAnh: 'Sagittarius',
    kyHieu: '♐',
    ngayBatDau: '22/11',
    ngayKetThuc: '21/12',
    khoangNgay: '22/11 – 21/12',
    nguyenTo: 'Lửa',
    hanhTinh: 'Sao Mộc',
    moTaNgan: t('Lạc quan, ham khám phá và thẳng thắn'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Nhân Mã là lãng tử tự do của bầu trời, luôn yêu đời, hào sảng và không ngừng tìm kiếm chân trời tri thức mới thông qua những chuyến phiêu lưu trải nghiệm.',
      ),
      theGioiNoiTam: t(
        'Được Sao Mộc ban phước, tinh thần Nhân Mã luôn tràn đầy niềm tin vào điều kỳ diệu và sự công bằng. Bạn nhìn cuộc đời qua lăng kính triết học rộng mở, bao dung.',
      ),
      tongQuan: t('Bạn là người phóng khoáng, tích cực, ham học hỏi và luôn truyền niềm tin yêu cuộc sống đến mọi người.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Tầm nhìn xa trông rộng và tinh thần lạc quan bẩm sinh giúp Nhân Mã luôn tìm thấy lối thoát trong nghịch cảnh.'),
      danhSach: [
        {
          tieuDe: t('Tinh thần lạc quan bất tận'),
          moTa: t('Luôn nhìn thấy cơ hội ngay giữa những khó khăn và không bao giờ chịu đầu hàng số phận.'),
        },
        {
          tieuDe: t('Tư duy mở và ham hiểu biết'),
          moTa: t('Đam mê du lịch, văn hóa, triết học và không ngừng nâng cấp tầm nhìn cá nhân.'),
        },
        {
          tieuDe: t('Thẳng thắn và trung thực'),
          moTa: t('Nói đúng sự thật, không toan tính vụ lợi và tôn trọng quyền tự do của mọi người.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Sự phóng khoáng đôi khi đi kèm với tính bất cẩn trong các vấn đề chi tiết.'),
      danhSach: [
        {
          tieuDe: t('Lời nói quá bộc trực'),
          moTa: t('Đôi lúc vô tình làm tổn thương người khác vì sự thẳng thắn thiếu khéo léo.'),
        },
        {
          tieuDe: t('Chi tiêu bốc đồng cho trải nghiệm'),
          moTa: t('Dễ vung tay quá trán cho những chuyến đi hoặc sở thích nhất thời.'),
        },
      ],
      loiNhac: t('Một chút cẩn trọng trong lời nói và tiền bạc sẽ bảo vệ trọn vẹn hành trình tự do của bạn.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Hãy hiểu rằng cam kết gắn bó không làm mất đi sự tự do, mà là nơi bạn tìm thấy bạn đồng hành đích thực.'),
      phatTrienBanThan: t(
        'Đặt ra quỹ du lịch cố định trong Finora để thỏa sức khám phá thế giới mà không lo hụt ngân sách an toàn.',
      ),
      thongDiep: t('“Mũi tên starlight hướng lên bầu trời cao nhất chỉ khi cây cung được kéo bằng sự tập trung kiên nhẫn.”'),
    },
  },

  'ma-ket': {
    id: 'ma-ket',
    ten: t('Ma Kết'),
    tenTiengAnh: 'Capricorn',
    kyHieu: '♑',
    ngayBatDau: '22/12',
    ngayKetThuc: '19/01',
    khoangNgay: '22/12 – 19/01',
    nguyenTo: 'Đất',
    hanhTinh: 'Sao Thổ',
    moTaNgan: t('Kiên trì, thực tế và có trách nhiệm'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Ma Kết là bậc thầy của sự bền bỉ, ý chí sắt đá và tư duy chiến lược dài hạn. Bạn từng bước chậm rãi nhưng vững chắc leo lên đỉnh cao thành công bằng chính sức lực của mình.',
      ),
      theGioiNoiTam: t(
        'Được tôi luyện bởi Sao Thổ, nội tâm Ma Kết sâu sắc, chững chạc và giàu lòng tự trọng. Bạn thể hiện tình thương bằng trách nhiệm, sự che chở vững bền và những hành động thiết thực.',
      ),
      tongQuan: t('Bạn là trụ cột vững chắc, có ý chí phi thường, bản lĩnh kiên cường và tinh thần trách nhiệm mẫu mực.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Kỷ luật thép và khả năng hoạch định tương lai biến Ma Kết thành người hiện thực hóa những hoài bão lớn.'),
      danhSach: [
        {
          tieuDe: t('Kiên định phi thường'),
          moTa: t('Không có gian nan nào làm nản lòng bạn trên con đường hướng tới mục tiêu đã chọn.'),
        },
        {
          tieuDe: t('Quản lý tài chính xuất sắc'),
          moTa: t('Có tầm nhìn đầu tư dài hạn, tích lũy bài bản và quản trị rủi ro thông minh.'),
        },
        {
          tieuDe: t('Trách nhiệm và chữ tín'),
          moTa: t('Luôn là điểm tựa đáng tin cậy nhất trong gia đình và tổ chức.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Quá chú tâm vào công việc đôi khi khiến Ma Kết quên đi niềm vui hiện tại.'),
      danhSach: [
        {
          tieuDe: t('Quá nghiêm khắc với bản thân'),
          moTa: t('Khó thư giãn và luôn cảm thấy có lỗi nếu không làm việc hiệu quả.'),
        },
        {
          tieuDe: t('Kín đáo quá mức'),
          moTa: t('Ít khi chia sẻ gánh nặng trong lòng, thường tự mình gánh vác mọi áp lực.'),
        },
      ],
      loiNhac: t('Cuộc sống không chỉ là những đích đến cần chinh phục, mà còn là hành trình tận hưởng từng khoảnh khắc.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Hãy thả lỏng để bộc lộ cảm xúc dịu dàng và đón nhận sự chăm sóc từ người khác.'),
      phatTrienBanThan: t(
        'Thiết lập mục tiêu giải trí song hành cùng mục tiêu tiết kiệm tài chính để cuộc sống thêm phần cân bằng.',
      ),
      thongDiep: t('“Ngọn núi cao nhất luôn thuộc về người có đôi chân kiên trì từng bước một.”'),
    },
  },

  'bao-binh': {
    id: 'bao-binh',
    ten: t('Bảo Bình'),
    tenTiengAnh: 'Aquarius',
    kyHieu: '♒',
    ngayBatDau: '20/01',
    ngayKetThuc: '18/02',
    khoangNgay: '20/01 – 18/02',
    nguyenTo: 'Khí',
    hanhTinh: 'Sao Thiên Vương & Sao Thổ',
    moTaNgan: t('Độc lập, sáng tạo và yêu tự do'),
    tinhCach: {
      tieuDe: t('Tính cách đặc trưng'),
      noiDung: t(
        'Bảo Bình là người có tư duy đi trước thời đại, độc lập, sáng tạo và mang trong mình trái tim nhân văn sâu sắc. Bạn luôn khát khao đổi mới và tạo nên sự khác biệt tích cực.',
      ),
      theGioiNoiTam: t(
        'Tâm trí Bảo Bình như một dải ngân hà vô tận của những ý tưởng độc đáo. Bạn tôn trọng sự tự do cá nhân, ghét sự rập khuôn và luôn đấu tranh cho sự tiến bộ của cộng đồng.',
      ),
      tongQuan: t('Bạn là nhà đổi mới sáng tạo, độc lập, chân thành và luôn mang góc nhìn mới mẻ đến cho thế giới.'),
    },
    diemManh: {
      tieuDe: t('Điểm mạnh nổi bật'),
      moTaChiTiet: t('Trí tuệ đổi mới và tinh thần nhân đạo là nguồn cảm hứng bất tận của Bảo Bình.'),
      danhSach: [
        {
          tieuDe: t('Tư duy đột phá và độc đáo'),
          moTa: t('Luôn tìm ra những giải pháp công nghệ và cách làm mới chưa ai từng nghĩ tới.'),
        },
        {
          tieuDe: t('Trực giác xã hội và tinh thần nhân văn'),
          moTa: t('Coi trọng tình bạn, sự bình đẳng và luôn quan tâm đến lợi ích chung của tập thể.'),
        },
        {
          tieuDe: t('Độc lập và tự chủ cao'),
          moTa: t('Không bị chi phối bởi định kiến dư luận, kiên định với con đường đúng đắn của mình.'),
        },
      ],
    },
    diemCanCanBang: {
      tieuDe: t('Điểm cần cân bằng'),
      moTaChiTiet: t('Xu hướng lý trí hóa cảm xúc đôi khi khiến Bảo Bình tạo khoảng cách với người thân.'),
      danhSach: [
        {
          tieuDe: t('Có vẻ xa cách và lạnh lùng'),
          moTa: t('Thường dùng logic để giải quyết các vấn đề tình cảm thay vì lắng nghe bằng trái tim.'),
        },
        {
          tieuDe: t('Bướng bỉnh bảo vệ quan điểm'),
          moTa: t('Khi đã tin vào một lý tưởng, bạn rất khó chấp nhận sự thay đổi từ người khác.'),
        },
      ],
      loiNhac: t('Kết nối cảm xúc chân thành là chiếc cầu nối hoàn hảo để những ý tưởng vĩ đại của bạn chạm tới trái tim con người.'),
    },
    loiKhuyen: {
      tieuDe: t('Lời khuyên & Định hướng'),
      trongMoiQuanHe: t('Hãy dũng cảm bộc lộ những rung cảm mềm mại của bản thân để xây dựng sự gắn kết sâu sắc.'),
      phatTrienBanThan: t(
        'Áp dụng công nghệ số và tự động hóa trong quản lý tài chính cá nhân để tối ưu hóa nguồn lực sáng tạo.',
      ),
      thongDiep: t('“Hãy là ngọn gió mang mưa sao băng tưới mát cho những hạt mầm hy vọng của tương lai.”'),
    },
  },
}
