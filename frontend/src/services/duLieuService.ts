import type { DuLieu } from '../types'
import { api } from './api'

export async function layDuLieu(): Promise<DuLieu> {
  const { data } = await api.get<DuLieu>('/api/du-lieu')
  return data
}

export async function luuDuLieu(data: DuLieu, token?: string): Promise<void> {
  await api.put('/api/du-lieu', data, token ? { headers: { Authorization: `Bearer ${token}` } } : undefined)
}
