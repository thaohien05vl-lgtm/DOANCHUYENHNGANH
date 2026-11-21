import { api } from './api'

export interface KhoanhKhacData {
  id: string
  ngay: string
  chuThich: string
  anh: string
}

export async function layKhoanhKhac(): Promise<KhoanhKhacData[]> {
  const { data } = await api.get<KhoanhKhacData[]>('/api/khoanh-khac')
  return data
}

export async function themKhoanhKhac(item: Omit<KhoanhKhacData, 'id'>): Promise<KhoanhKhacData> {
  const { data } = await api.post<KhoanhKhacData>('/api/khoanh-khac', item)
  return data
}

export async function xoaKhoanhKhac(id: string): Promise<void> {
  await api.delete(`/api/khoanh-khac/${encodeURIComponent(id)}`)
}
