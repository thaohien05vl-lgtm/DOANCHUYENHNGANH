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

export type NhomChuDe = 'tat-ca' | 'de-xuat' | 'yeu-thich' | 'toi-gian' | 'cao-cap'

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
  nhom: ('de-xuat' | 'toi-gian' | 'cao-cap')[]
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
    mau: ['#0b1718', '#2fc39a', '#173b32'],
    mauChinh: '#2fc39a',
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
    ten: t('Rose Garden'),
    tenTiengAnh: t('Rose Garden'),
    moTa: t('Hồng đất nhung ấm áp, nhẹ nhàng và quý phái'),
    cheDo: 'sang',
    mau: ['#faf2f1', '#99545c', '#f5e0e0'],
    mauChinh: '#99545c',
    mauNen: '#faf2f1',
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
    mau: ['#101a28', '#6aa5e8', '#1e3550'],
    mauChinh: '#6aa5e8',
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
]

export const CHU_DE_MAC_DINH: ThemeId = 'ngoc'
