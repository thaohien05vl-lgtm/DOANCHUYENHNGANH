import type { CSSProperties } from 'react'

export type GlyphSize = 'sm' | 'md' | 'lg' | number

export interface GlyphProps {
  size?: GlyphSize
  className?: string
  style?: CSSProperties
  animated?: boolean
  category?: string
}

export type FinanceGlyphType =
  | 'INCOME'
  | 'EXPENSE'
  | 'TRANSFER'
  | 'BUDGET'
  | 'SAVINGS'
  | 'REMINDER'
  | 'RECURRING'
  | 'REFUND'
  | 'STATEMENT'
  | 'ALERT'
  | 'GENERAL'
  | string

export function resolveGlyphSize(size?: GlyphSize, defaultPx: number = 42): number {
  if (typeof size === 'number') return size
  if (size === 'sm') return 36
  if (size === 'md') return 42
  if (size === 'lg') return 48
  return defaultPx
}
