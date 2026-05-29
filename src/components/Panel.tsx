import type { CSSProperties, ReactNode } from 'react'
import styles from './Panel.module.css'
import { cx } from './cx'

export interface PanelProps {
  title?: string
  headerActions?: ReactNode
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Panel({ title, headerActions, children, className, style }: PanelProps) {
  const cls = cx(styles.panel, className)
  return (
    <div className={cls} style={style}>
      {(title !== undefined || headerActions !== undefined) && (
        <div className={styles.titleBar}>
          {title !== undefined && <span className={styles.title}>{title}</span>}
          {headerActions !== undefined && (
            <div className={styles.headerActions}>{headerActions}</div>
          )}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
