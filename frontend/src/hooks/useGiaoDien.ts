import { useContext } from 'react'
import { GiaoDienContext } from '../contexts/giaoDienContext'

export function useGiaoDien() {
  const ctx = useContext(GiaoDienContext)
  if (!ctx) throw new Error('useGiaoDien phải nằm trong GiaoDienProvider')
  return ctx
}
