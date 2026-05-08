import type { CSSProperties, ReactNode } from 'react'
import styles from './Toolbar.module.css'

export interface ToolbarProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Toolbar({ children, className, style }: ToolbarProps) {
  const cls = [styles.toolbar, className].filter(Boolean).join(' ')
  return (
    <div className={cls} style={style} role="toolbar">
      {children}
    </div>
  )
}
