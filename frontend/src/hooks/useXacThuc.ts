import { useContext } from 'react'
import { XacThucContext } from '../contexts/xacThucContext'

export function useXacThuc() {
  const ctx = useContext(XacThucContext)
  if (!ctx) throw new Error('useXacThuc phải nằm trong XacThucProvider')
  return ctx
}
