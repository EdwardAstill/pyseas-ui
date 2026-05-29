import type { CSSProperties } from 'react'
import styles from './Result.module.css'
import { StatusBadge } from './StatusBadge'
import type { StatusVariant } from './StatusBadge'

export type ResultStatus = 'ok' | 'warn' | 'err' | 'info' | 'none'

export interface ResultProps {
  label: string
  value: string | number
  unit?: string
  status?: ResultStatus
  ratio?: string
  note?: string
  style?: CSSProperties
}

export function Result({ label, value, unit, status = 'none', ratio, note, style }: ResultProps) {
  return (
    <div className={styles.result} style={style}>
      <div className={styles.left}>
        <span className={styles.label}>{label}</span>
        {note !== undefined && <span className={styles.note}>{note}</span>}
      </div>
      <div className={styles.right}>
        <div className={styles.valueRow}>
          <span className={styles.value}>{value}</span>
          {unit !== undefined && <span className={styles.unit}>{unit}</span>}
          {status !== 'none' && <StatusBadge variant={status as StatusVariant} />}
        </div>
        {ratio !== undefined && <span className={styles.ratio}>{ratio}</span>}
      </div>
    </div>
  )
}
