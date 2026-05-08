import type { CSSProperties, ReactNode } from 'react'
import styles from './fields.module.css'

export interface FieldRootProps {
  label?: string | undefined
  hint?: string | undefined
  children: ReactNode
  style?: CSSProperties | undefined
}

export function FieldRoot({ label, hint, children, style }: FieldRootProps) {
  return (
    <div className={styles.fieldRoot} style={style}>
      {label !== undefined && <label className={styles.label}>{label}</label>}
      {children}
      {hint !== undefined && <span className={styles.hint}>{hint}</span>}
    </div>
  )
}
