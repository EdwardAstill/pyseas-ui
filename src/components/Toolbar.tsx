import type { CSSProperties, ReactNode } from 'react'
import styles from './Toolbar.module.css'
import { cx } from './cx'

export interface ToolbarProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Toolbar({ children, className, style }: ToolbarProps) {
  const cls = cx(styles.toolbar, className)
  return (
    <div className={cls} style={style} role="toolbar">
      {children}
    </div>
  )
}
