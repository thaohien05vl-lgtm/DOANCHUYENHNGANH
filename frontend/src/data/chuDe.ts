import { t } from '../utils/ngonNgu'
export type ThemeId =
  | 'ngoc'
  | 'hoa-tim'
  | 'dem'
  | 'bien'
  | 'phu-dung'
  | 'kem'
  | 'ho-phach'
  | 'la'
  | 'dai-duong'
  | 'than'
  | 'hoa-hong'
  | 'rung-dem'
  | 'thu'
  | 'troi'
  | 'thach-anh'
  | 'xuan-sang'
  | 'xuan-toi'
  | 'ha-sang'
  | 'ha-toi'
  | 'thu-sang'
  | 'thu-toi'
  | 'dong-sang'
  | 'dong-toi'

export type NhomChuDe = 'tat-ca' | 'de-xuat' | 'yeu-thich' | 'toi-gian' | 'cao-cap' | 'theo-mua'

export interface ChuDe {
  id: ThemeId
  ten: string
  tenTiengAnh: string
  moTa: string
  cheDo: 'sang' | 'toi'
  mau: [string, string, string] // 3 màu đại diện
  mauChinh: string
  mauNen: string
  mauThe: string
  nhom: ('de-xuat' | 'toi-gian' | 'cao-cap' | 'theo-mua')[]
}

export const DANH_SACH_CHU_DE: ChuDe[] = [
  {
    id: 'ngoc',
    ten: t('Emerald Finance'),
    tenTiengAnh: t('Emerald Finance'),
    moTa: t('Xanh ngọc lục bảo thanh lịch, cân bằng tài chính và thịnh vượng'),
    cheDo: 'sang',
    mau: ['#f1f6f3', '#137b5d', '#d6eee3'],
    mauChinh: '#137b5d',
    mauNen: '#f1f6f3',
    mauThe: '#ffffff',
    nhom: ['de-xuat', 'cao-cap'],
  },
  {
    id: 'hoa-tim',
    ten: t('Finora Tím'),
    tenTiengAnh: t('Lavender Dream'),
    moTa: t('Tím hoa oải hương hiện đại, sáng tạo và tinh tế'),
    cheDo: 'sang',
    mau: ['#f5f2fa', '#8064b2', '#eae2f7'],
    mauChinh: '#8064b2',
    mauNen: '#f5f2fa',
    mauThe: '#ffffff',
    nhom: ['de-xuat', 'cao-cap'],
  },
  {
    id: 'dem',
    ten: t('Graphite Luxury'),
    tenTiengAnh: t('Graphite Luxury'),
    moTa: t('Đen than chì sang trọng, độ tương phản dịu mắt và đẳng cấp'),
    cheDo: 'toi',
    mau: ['#0b1718', '#43b896', '#173b32'],
    mauChinh: '#43b896',
    mauNen: '#0b1718',
    mauThe: '#122329',
    nhom: ['de-xuat', 'cao-cap', 'toi-gian'],
  },
  {
    id: 'bien',
    ten: t('Ocean Breeze'),
    tenTiengAnh: t('Ocean Breeze'),
    moTa: t('Xanh biển tươi mát, trong trẻo và ổn định'),
    cheDo: 'sang',
    mau: ['#eff5fa', '#3478b9', '#dceafa'],
    mauChinh: '#3478b9',
    mauNen: '#eff5fa',
    mauThe: '#ffffff',
    nhom: ['de-xuat'],
  },
  {
    id: 'phu-dung',
    ten: t('Sakura Garden'),
    tenTiengAnh: t('Sakura Garden'),
    moTa: t('Hồng anh đào dịu dàng, nhẹ nhàng và quý phái'),
    cheDo: 'sang',
    mau: ['#fbeff2', '#b4476b', '#f8e1e8'],
    mauChinh: '#b4476b',
    mauNen: '#fbeff2',
    mauThe: '#ffffff',
    nhom: ['cao-cap'],
  },
  {
    id: 'kem',
    ten: t('Vanilla Cream'),
    tenTiengAnh: t('Vanilla Cream'),
    moTa: t('Kem sữa và nâu caramel ấm cúng, đậm chất tối giản'),
    cheDo: 'sang',
    mau: ['#f7f3ea', '#8e632f', '#efe4d0'],
    mauChinh: '#8e632f',
    mauNen: '#f7f3ea',
    mauThe: '#fffefa',
    nhom: ['toi-gian'],
  },
  {
    id: 'ho-phach',
    ten: t('Sunset Amber'),
    tenTiengAnh: t('Sunset Amber'),
    moTa: t('Hổ phách hoàng hôn ấm áp, ánh vàng kim quý phái'),
    cheDo: 'toi',
    mau: ['#211b14', '#d8a45c', '#483622'],
    mauChinh: '#d8a45c',
    mauNen: '#211b14',
    mauThe: '#30271c',
    nhom: ['cao-cap'],
  },
  {
    id: 'la',
    ten: t('Forest Nature'),
    tenTiengAnh: t('Forest Nature'),
    moTa: t('Xanh lá non mát mẻ, gần gũi thiên nhiên và bền vững'),
    cheDo: 'sang',
    mau: ['#f2f6ed', '#507538', '#e4efd9'],
    mauChinh: '#507538',
    mauNen: '#f2f6ed',
    mauThe: '#ffffff',
    nhom: ['toi-gian'],
  },
  {
    id: 'dai-duong',
    ten: t('Midnight Blue'),
    tenTiengAnh: t('Midnight Blue'),
    moTa: t('Biển đêm navy sâu thẳm, tĩnh lặng và tập trung'),
    cheDo: 'toi',
    mau: ['#101a28', '#7aa6dc', '#1e3550'],
    mauChinh: '#7aa6dc',
    mauNen: '#101a28',
    mauThe: '#18283a',
    nhom: ['cao-cap'],
  },
  {
    id: 'than',
    ten: t('Silver Mist'),
    tenTiengAnh: t('Silver Mist'),
    moTa: t('Sương bạc và xám chì thanh lịch, trung tính không chói'),
    cheDo: 'toi',
    mau: ['#171a1d', '#a9b4bd', '#343a40'],
    mauChinh: '#a9b8c1',
    mauNen: '#171a1d',
    mauThe: '#242a2f',
    nhom: ['toi-gian'],
  },
  {
    id: 'hoa-hong',
    ten: t('Burgundy Elegance'),
    tenTiengAnh: t('Burgundy Elegance'),
    moTa: t('Đỏ mận rượu vang trầm ấm, sang trọng và kiêu sa'),
    cheDo: 'toi',
    mau: ['#21171c', '#d88a9c', '#482b38'],
    mauChinh: '#d88a9c',
    mauNen: '#21171c',
    mauThe: '#302129',
    nhom: ['cao-cap'],
  },
  {
    id: 'rung-dem',
    ten: t('Sage Minimal'),
    tenTiengAnh: t('Sage Minimal'),
    moTa: t('Xanh rêu xô thơm trầm tĩnh, tối giản và thư thái'),
    cheDo: 'toi',
    mau: ['#121d18', '#9fbd86', '#293d30'],
    mauChinh: '#9fbd86',
    mauNen: '#121d18',
    mauThe: '#1d2c24',
    nhom: ['toi-gian'],
  },
  {
    id: 'thu',
    ten: t('Coffee Premium'),
    tenTiengAnh: t('Coffee Premium'),
    moTa: t('Cà phê mocha và cam đất ấm nồng, hài hòa'),
    cheDo: 'sang',
    mau: ['#f8f2e9', '#96602b', '#f4e5ce'],
    mauChinh: '#96602b',
    mauNen: '#f8f2e9',
    mauThe: '#fffdfa',
    nhom: ['toi-gian'],
  },
  {
    id: 'troi',
    ten: t('Arctic Frost'),
    tenTiengAnh: t('Arctic Frost'),
    moTa: t('Băng tuyết trong lành, xanh ngọc dịu mát và hiện đại'),
    cheDo: 'sang',
    mau: ['#f0f6f8', '#347487', '#dceef3'],
    mauChinh: '#347487',
    mauNen: '#f0f6f8',
    mauThe: '#ffffff',
    nhom: ['toi-gian'],
  },
  {
    id: 'thach-anh',
    ten: t('Amethyst Luxury'),
    tenTiengAnh: t('Amethyst Luxury'),
    moTa: t('Thạch anh tím khói huyền bí, sang trọng và thu hút'),
    cheDo: 'toi',
    mau: ['#191624', '#b09add', '#352b4b'],
    mauChinh: '#b09add',
    mauNen: '#191624',
    mauThe: '#252035',
    nhom: ['cao-cap'],
  },
  /* ==================== BỘ SƯU TẬP BỐN MÙA (FOUR SEASONS) ==================== */
  {
    id: 'xuan-sang',
    ten: t('Xuân Sáng'),
    tenTiengAnh: t('Spring Blossom (Light)'),
    moTa: t('Hoa đào anh đào hồng phấn, xanh lá non dịu mát đón chào xuân mới'),
    cheDo: 'sang',
    mau: ['#fcf1f4', '#b85272', '#d9e8dc'],
    mauChinh: '#b85272',
    mauNen: '#fcf1f4',
    mauThe: '#ffffff',
    nhom: ['theo-mua', 'cao-cap'],
  },
  {
    id: 'xuan-toi',
    ten: t('Xuân Tối'),
    tenTiengAnh: t('Spring Night (Dark)'),
    moTa: t('Hoa anh đào nở trong đêm xuân, sắc hồng dịu trên nền than ấm'),
    cheDo: 'toi',
    mau: ['#1c1418', '#c2708b', '#2c3a30'],
    mauChinh: '#c2708b',
    mauNen: '#1c1418',
    mauThe: '#271c22',
    nhom: ['theo-mua', 'cao-cap'],
  },
  {
    id: 'ha-sang',
    ten: t('Hạ Sáng'),
    tenTiengAnh: t('Summer Breeze (Light)'),
    moTa: t('Biển ngọc trong vắt và nắng vàng cát nhạt, tươi mát và tràn đầy năng lượng'),
    cheDo: 'sang',
    mau: ['#f0f8f8', '#267d8a', '#edd9aa'],
    mauChinh: '#267d8a',
    mauNen: '#f0f8f8',
    mauThe: '#ffffff',
    nhom: ['theo-mua', 'de-xuat'],
  },
  {
    id: 'ha-toi',
    ten: t('Hạ Tối'),
    tenTiengAnh: t('Summer Deep (Dark)'),
    moTa: t('Biển đêm sâu thẳm tĩnh mịch, ngọc lam dịu nhẹ và ánh trăng biển'),
    cheDo: 'toi',
    mau: ['#0f1a1e', '#4ca5b3', '#3d3420'],
    mauChinh: '#4ca5b3',
    mauNen: '#0f1a1e',
    mauThe: '#16242a',
    nhom: ['theo-mua', 'cao-cap'],
  },
  {
    id: 'thu-sang',
    ten: t('Thu Sáng'),
    tenTiengAnh: t('Autumn Warmth (Light)'),
    moTa: t('Lá vàng rơi, cam đất nâu ấm và vàng mù tạt cổ điển nồng nàn'),
    cheDo: 'sang',
    mau: ['#fcf6ee', '#96562c', '#ebd097'],
    mauChinh: '#96562c',
    mauNen: '#fcf6ee',
    mauThe: '#ffffff',
    nhom: ['theo-mua', 'toi-gian'],
  },
  {
    id: 'thu-toi',
    ten: t('Thu Tối'),
    tenTiengAnh: t('Autumn Dusk (Dark)'),
    moTa: t('Rừng thu chạng vạng, ấm cúng ánh lửa và sắc lá phong khô'),
    cheDo: 'toi',
    mau: ['#1b1511', '#be7b4e', '#3c301c'],
    mauChinh: '#be7b4e',
    mauNen: '#1b1511',
    mauThe: '#251c16',
    nhom: ['theo-mua', 'toi-gian'],
  },
  {
    id: 'dong-sang',
    ten: t('Đông Sáng'),
    tenTiengAnh: t('Winter Frost (Light)'),
    moTa: t('Tuyết trắng đầu mùa, lam xám băng sương và ánh bạc thanh nhã'),
    cheDo: 'sang',
    mau: ['#f2f5f8', '#4a6880', '#d8e1e8'],
    mauChinh: '#4a6880',
    mauNen: '#f2f5f8',
    mauThe: '#ffffff',
    nhom: ['theo-mua', 'toi-gian'],
  },
  {
    id: 'dong-toi',
    ten: t('Đông Tối'),
    tenTiengAnh: t('Winter Night (Dark)'),
    moTa: t('Bầu trời đêm đông băng giá, ánh sao bắc cực và bông tuyết bạc dịu'),
    cheDo: 'toi',
    mau: ['#11161d', '#7293af', '#2a3542'],
    mauChinh: '#7293af',
    mauNen: '#11161d',
    mauThe: '#19202a',
    nhom: ['theo-mua', 'cao-cap'],
  },
]

export const CHU_DE_MAC_DINH: ThemeId = 'ngoc'
