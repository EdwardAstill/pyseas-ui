import type { CSSProperties, ReactNode } from 'react'
import styles from './WorkbenchLayout.module.css'

export interface WorkbenchLayoutProps {
  rail: ReactNode
  setupPanel: ReactNode
  diagramPanel: ReactNode
  analysisPanel: ReactNode
  resultsPanel: ReactNode
  /** Width of the rail in pixels. Default 240. */
  railWidth?: number
  /** Horizontal split between left and right columns of the 2x2 grid. 0..1, default 0.5. */
  columnSplit?: number
  /** Vertical split between top and bottom rows of the 2x2 grid. 0..1, default 0.5. */
  rowSplit?: number
  className?: string
  style?: CSSProperties
}

export function WorkbenchLayout({
  rail,
  setupPanel,
  diagramPanel,
  analysisPanel,
  resultsPanel,
  railWidth = 240,
  columnSplit = 0.5,
  rowSplit = 0.5,
  className,
  style,
}: WorkbenchLayoutProps) {
  const colLeft = `${columnSplit * 100}%`
  const colRight = `${(1 - columnSplit) * 100}%`
  const rowTop = `${rowSplit * 100}%`
  const rowBottom = `${(1 - rowSplit) * 100}%`

  const cssVars = {
    '--_rail-width': `${railWidth}px`,
    '--_col-left': colLeft,
    '--_col-right': colRight,
    '--_row-top': rowTop,
    '--_row-bottom': rowBottom,
  } as CSSProperties

  const cls = [styles.workbench, className].filter(Boolean).join(' ')

  return (
    <div className={cls} style={{ ...cssVars, ...style }}>
      <div className={styles.rail}>{rail}</div>
      <div className={styles.grid}>
        <div className={styles.cell}>{setupPanel}</div>
        <div className={styles.cell}>{analysisPanel}</div>
        <div className={styles.cell}>{diagramPanel}</div>
        <div className={styles.cell}>{resultsPanel}</div>
      </div>
    </div>
  )
}
