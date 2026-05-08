import type { CSSProperties } from 'react'
import styles from './StatusBadge.module.css'

export type StatusVariant = 'ok' | 'warn' | 'err' | 'info'

export interface StatusBadgeProps {
  variant: StatusVariant
  label?: string
  style?: CSSProperties
}

const variantClass: Record<StatusVariant, string> = {
  ok: styles.ok ?? '',
  warn: styles.warn ?? '',
  err: styles.err ?? '',
  info: styles.info ?? '',
}

export function StatusBadge({ variant, label, style }: StatusBadgeProps) {
  const cls = [styles.badge, variantClass[variant]].filter(Boolean).join(' ')
  return (
    <span className={cls} style={style}>
      {label !== undefined ? label : variant}
    </span>
  )
}
