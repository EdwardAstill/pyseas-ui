import { useRef, useState, useCallback, type CSSProperties, type ReactNode } from 'react'

import styles from './SortableList.module.css'
import { cx } from './cx'

export interface SortableListProps<T = unknown> {
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
  onReorder: (items: T[]) => void
  getKey?: (item: T, index: number) => string | number
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export function SortableList<T = unknown>({
  items,
  renderItem,
  onReorder,
  getKey,
  className,
  style,
  'aria-label': ariaLabel,
}: SortableListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>, index: number) => {
    if (e.button !== 0) return
    const container = containerRef.current
    if (!container) return

    const card = e.currentTarget
    const allCards = [...container.querySelectorAll<HTMLElement>(`.${styles.card}`)]
    const gap = 8

    const startY = e.clientY
    const cardTop = card.getBoundingClientRect().top
    let targetIndex = index

    card.style.zIndex = '1000'
    if (styles.dragging) card.classList.add(styles.dragging)

    function onPointerMove(ev: PointerEvent) {
      const dy = ev.clientY - startY
      card.style.transform = `translateY(${dy}px)`

      // Compute target: count non-dragged card centers above dragged center
      const draggedCenter = cardTop + dy + card.offsetHeight / 2
      let countAbove = 0
      for (let i = 0; i < allCards.length; i++) {
        if (i === index) continue
        const rect = allCards[i]!.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        if (mid < draggedCenter) countAbove++
      }
      const newTarget = countAbove

      if (newTarget !== targetIndex) {
        targetIndex = newTarget
        const cardH = card.offsetHeight + gap

        allCards.forEach((c, i) => {
          if (i === index) return
          c.style.transform = ''

          if (index < targetIndex) {
            if (i > index && i <= targetIndex) {
              c.style.transform = `translateY(-${cardH}px)`
            }
          } else {
            if (i >= targetIndex && i < index) {
              c.style.transform = `translateY(${cardH}px)`
            }
          }
        })
      }
    }

    function onPointerUp() {
      // Disable transitions for clean commit
      allCards.forEach(c => { c.style.transition = 'none' })

      // Reorder in DOM
      if (targetIndex !== index && container) {
        const ref = allCards[targetIndex] ?? null
        if (targetIndex > index) {
          container.insertBefore(card, ref?.nextSibling ?? null)
        } else {
          container.insertBefore(card, ref)
        }
      }

      // Reset all cards
      allCards.forEach(c => {
        c.style.transform = ''
        c.style.zIndex = ''
      })
      if (styles.dragging) card.classList.remove(styles.dragging)

      // Force reflow, restore transitions
      if (container) {
        void container.offsetHeight
        allCards.forEach(c => { c.style.transition = '' })
      }

      // Notify parent of new order
      if (targetIndex !== index) {
        const next = [...items]
        const [moved] = next.splice(index, 1)
        next.splice(targetIndex, 0, moved!)
        onReorder(next)
      }

      setDraggingIndex(null)
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerup', onPointerUp)
    }

    setDraggingIndex(index)
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
  }, [items, onReorder])

  return (
    <div
      ref={containerRef}
      role="list"
      aria-label={ariaLabel}
      className={cx(styles.list, className)}
      style={style}
    >
      {items.map((item, i) => (
        <div
          key={getKey ? getKey(item, i) : i}
          role="listitem"
          className={cx(styles.card, draggingIndex === i && styles.dragging)}
          onPointerDown={(e) => handlePointerDown(e, i)}
        >
          {renderItem(item, i)}
        </div>
      ))}
    </div>
  )
}
