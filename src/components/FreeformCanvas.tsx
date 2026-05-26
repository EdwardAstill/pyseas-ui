import { useRef, useState, useCallback, type CSSProperties, type ReactNode } from 'react'

import styles from './FreeformCanvas.module.css'
import { cx } from './cx'

export interface FreeformCanvasItem {
  id: string
  x: number
  y: number
}

export interface FreeformCanvasProps<T extends FreeformCanvasItem = FreeformCanvasItem> {
  items: T[]
  renderItem: (item: T) => ReactNode
  onPositionChange: (id: string, x: number, y: number) => void
  selectedId?: string | null
  onSelect?: (id: string) => void
  cardWidth?: number
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export function FreeformCanvas<T extends FreeformCanvasItem = FreeformCanvasItem>({
  items,
  renderItem,
  onPositionChange,
  selectedId = null,
  onSelect,
  cardWidth = 210,
  className,
  style,
  'aria-label': ariaLabel,
}: FreeformCanvasProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, item: T) => {
    if (e.button !== 0) return
    const container = containerRef.current
    if (!container) return

    const card = e.currentTarget
    const startX = e.clientX
    const startY = e.clientY
    const origX = card.offsetLeft
    const origY = card.offsetTop

    card.style.zIndex = '100'
    if (styles.dragging) card.classList.add(styles.dragging)

    // Clone ghost at original position
    const ghost = card.cloneNode(true) as HTMLElement
    if (styles.dragging) ghost.classList.remove(styles.dragging)
    ghost.style.opacity = '0.3'
    ghost.style.pointerEvents = 'none'
    container.appendChild(ghost)

    setDraggingId(item.id)

    function onPointerMove(ev: PointerEvent) {
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      const rect = container!.getBoundingClientRect()
      const newX = Math.max(0, Math.min(origX + dx, rect.width - card.offsetWidth))
      const newY = Math.max(0, Math.min(origY + dy, rect.height - card.offsetHeight))
      card.style.left = `${newX}px`
      card.style.top = `${newY}px`
    }

    function onPointerUp() {
      card.style.zIndex = ''
      if (styles.dragging) card.classList.remove(styles.dragging)
      if (ghost.parentNode) ghost.remove()

      const newX = card.offsetLeft
      const newY = card.offsetTop
      if (newX !== origX || newY !== origY) {
        onPositionChange(item.id, newX, newY)
      }

      setDraggingId(null)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }, [onPositionChange])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      className={cx(styles.canvas, className)}
      style={style}
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          aria-selected={selectedId === item.id}
          className={cx(
            styles.card,
            selectedId === item.id && styles.selected,
            draggingId === item.id && styles.dragging,
          )}
          style={{ left: item.x, top: item.y, width: cardWidth }}
          onPointerDown={(e) => handlePointerDown(e, item)}
          onDoubleClick={() => onSelect?.(item.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onSelect?.(item.id)
            }
          }}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
