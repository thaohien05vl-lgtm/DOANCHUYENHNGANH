import type { ThongBao } from '../types'
import { api } from './api'

export async function layDanhSachThongBao(): Promise<ThongBao[]> {
  const { data } = await api.get<ThongBao[]>('/api/thong-bao')
  return data
}

export async function laySoLuongChuaDoc(): Promise<number> {
  const { data } = await api.get<{ chuaDoc: number }>('/api/thong-bao/dem-chua-doc')
  return data?.chuaDoc ?? 0
}

export async function danhDauDaDoc(id: string): Promise<void> {
  await api.put(`/api/thong-bao/${id}/da-doc`)
}

export async function danhDauTatCaDaDoc(): Promise<void> {
  await api.put('/api/thong-bao/doc-tat-ca')
}

export async function xoaThongBao(id: string): Promise<void> {
  await api.delete(`/api/thong-bao/${id}`)
}

