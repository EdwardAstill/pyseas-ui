import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

import { cx } from './cx'
import styles from './PaneShell.module.css'
import { Tabs, type TabItem } from './Tabs'

export interface PaneRailSpec<T extends string = string> {
  items: TabItem[]
  value: T
  onChange: (value: T) => void
}

export interface PaneSectionSpec<T extends string = string> {
  items: TabItem[]
  value: T
  onChange: (value: T) => void
}

export interface PaneShellProps {
  rail?: PaneRailSpec | undefined
  section?: PaneSectionSpec | undefined
  sectionOptions?: ReactNode
  children: ReactNode
  flushBody?: boolean
  railWidth?: number
  railMinWidth?: number
  railMaxWidth?: number
  railResizable?: boolean
  onRailWidthChange?: (width: number) => void
  className?: string
  style?: CSSProperties
}

const DEFAULT_RAIL_WIDTH = 132
const DEFAULT_RAIL_MIN = 80
const DEFAULT_RAIL_MAX = 320

export function PaneShell({
  rail,
  section,
  sectionOptions,
  children,
  flushBody = false,
  railWidth,
  railMinWidth = DEFAULT_RAIL_MIN,
  railMaxWidth = DEFAULT_RAIL_MAX,
  railResizable = true,
  onRailWidthChange,
  className,
  style,
}: PaneShellProps) {
  const hasRail = rail !== undefined
  const hasSection = section !== undefined
  const isControlledWidth = railWidth !== undefined
  const [internalWidth, setInternalWidth] = useState<number>(railWidth ?? DEFAULT_RAIL_WIDTH)
  const activeWidth = isControlledWidth ? railWidth : internalWidth

  useEffect(() => {
    if (isControlledWidth && railWidth !== undefined) setInternalWidth(railWidth)
  }, [isControlledWidth, railWidth])

  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!hasRail || !railResizable) return
      dragStateRef.current = { startX: event.clientX, startWidth: activeWidth }
      setIsDragging(true)
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
    },
    [hasRail, railResizable, activeWidth],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragStateRef.current
      if (drag === null) return
      const delta = event.clientX - drag.startX
      const next = Math.min(railMaxWidth, Math.max(railMinWidth, drag.startWidth + delta))
      if (!isControlledWidth) setInternalWidth(next)
      onRailWidthChange?.(next)
    },
    [isControlledWidth, onRailWidthChange, railMaxWidth, railMinWidth],
  )

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = null
    setIsDragging(false)
    if ((event.target as HTMLElement).hasPointerCapture(event.pointerId)) {
      ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
    }
  }, [])

  const cls = cx(
    styles.shell,
    !hasRail && styles.shellNoRail,
    hasSection && styles.shellWithSection,
    className,
  )
  const combinedStyle: CSSProperties = {
    ...style,
    ['--ps-pane-rail-width' as string]: `${activeWidth}px`,
  }

  return (
    <div className={cls} style={combinedStyle} data-ui="pane-shell">
      {hasRail && (
        <aside className={styles.rail} data-ui="pane-rail">
          <Tabs
            orientation="vertical"
            marker="bracket"
            items={rail.items}
            value={rail.value}
            onChange={rail.onChange}
          />
          {railResizable && (
            <div
              className={styles.railResizeHandle}
              data-ui="pane-rail-handle"
              data-dragging={isDragging ? 'true' : undefined}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize rail"
            />
          )}
        </aside>
      )}
      {hasSection && (
        <div className={styles.section} data-ui="pane-section">
          <div className={styles.sectionTabs}>
            <Tabs
              marker="slash"
              items={section.items}
              value={section.value}
              onChange={section.onChange}
            />
          </div>
          {sectionOptions !== undefined && sectionOptions !== null && (
            <div className={styles.sectionOptions} data-ui="pane-section-options">
              {sectionOptions}
            </div>
          )}
        </div>
      )}
      <div className={cx(styles.body, flushBody && styles.bodyFlush)} data-ui="pane-body">
        {children}
      </div>
    </div>
  )
}
