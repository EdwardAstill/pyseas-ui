import { useEffect, useRef, type CSSProperties } from 'react'
import styles from './LogView.module.css'
import { cx } from './cx'

export interface LogViewProps {
  lines: string[]
  maxHeight?: number | string
  wrapLines?: boolean
  style?: CSSProperties
}

export function LogView({ lines, maxHeight = '100%', wrapLines = false, style }: LogViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  const prevLinesLenRef = useRef(0)

  useEffect(() => {
    const el = containerRef.current
    if (el === null) return

    // Reset auto-scroll state when lines shrink (log cleared)
    if (lines.length < prevLinesLenRef.current) {
      userScrolledRef.current = false
    }
    prevLinesLenRef.current = lines.length

    if (!userScrolledRef.current) {
      el.scrollTop = el.scrollHeight
    }
  }, [lines])

  function handleScroll() {
    const el = containerRef.current
    if (el === null) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8
    userScrolledRef.current = !atBottom
  }

  const cls = cx(styles.logView, wrapLines && styles.wrap)

  return (
    <div
      ref={containerRef}
      className={cls}
      style={{ maxHeight, ...style }}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
    >
      {lines.map((line, i) => (
        <span key={i} className={styles.line}>
          {line}
        </span>
      ))}
    </div>
  )
}
