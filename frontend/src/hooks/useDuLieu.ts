import { useContext } from 'react'
import { DuLieuContext } from '../contexts/duLieuContext'

export function useDuLieu() {
  const ctx = useContext(DuLieuContext)
  if (!ctx) throw new Error('useDuLieu phải nằm trong DuLieuProvider')
  return ctx
}
