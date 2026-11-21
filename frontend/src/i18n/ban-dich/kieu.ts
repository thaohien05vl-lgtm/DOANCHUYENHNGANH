/** Thứ tự: [English, 한국어, 日本語, 简体中文] */
export type BanDichMuc = readonly [string, string, string, string]
export type BanDich = Record<string, BanDichMuc>
