import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  WheelEvent as ReactWheelEvent,
} from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button } from './Button'
import { IconButton } from './IconButton'
import { cx } from './cx'
import styles from './DrawingViewer.module.css'

export type DrawingSource =
  | { kind: 'svg'; content: string; label?: string }
  | { kind: 'svg-url'; url: string; label?: string }
  | { kind: 'image'; url: string; label?: string }

export type DrawingViewerStatus = 'idle' | 'loading' | 'error' | 'ready'

export interface DrawingDownload {
  href: string
  filename?: string
  label?: string
}

export interface DrawingViewerProps {
  source?: DrawingSource | null
  status?: DrawingViewerStatus
  error?: string | null
  emptyMessage?: string
  loadingMessage?: string
  metadata?: ReactNode
  download?: DrawingDownload | null
  className?: string
  style?: CSSProperties
}

interface DragState {
  pointerId: number
  originX: number
  originY: number
  panX: number
  panY: number
}

const MIN_ZOOM = 0.25
const MAX_ZOOM = 6
const ZOOM_STEP = 1.2

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function DrawingViewer({
  source = null,
  status,
  error = null,
  emptyMessage = 'No drawing preview',
  loadingMessage = 'Loading drawing',
  metadata,
  download = null,
  className,
  style,
}: DrawingViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const dragRef = useRef<DragState | null>(null)
  const resolvedStatus: DrawingViewerStatus = status ?? (source === null ? 'idle' : 'ready')
  const canInteract = resolvedStatus === 'ready' && source !== null

  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [source])

  function resetView() {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  function zoomBy(factor: number) {
    setZoom((current) => clamp(current * factor, MIN_ZOOM, MAX_ZOOM))
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!canInteract) return
    event.preventDefault()
    zoomBy(event.deltaY < 0 ? ZOOM_STEP : 1 / ZOOM_STEP)
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!canInteract || event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      panX: pan.x,
      panY: pan.y,
    }
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return
    setPan({
      x: drag.panX + event.clientX - drag.originX,
      y: drag.panY + event.clientY - drag.originY,
    })
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (drag === null || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div className={cx(styles.viewer, className)} style={style} data-pyseas-ui="drawing-viewer">
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <IconButton title="Zoom out" size="sm" icon={<span>−</span>} disabled={!canInteract} onClick={() => zoomBy(1 / ZOOM_STEP)} />
          <IconButton title="Zoom in" size="sm" icon={<span>+</span>} disabled={!canInteract} onClick={() => zoomBy(ZOOM_STEP)} />
          <Button size="sm" disabled={!canInteract} onClick={resetView}>
            Fit
          </Button>
        </div>
        <div className={styles.toolbarMeta}>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          {metadata !== undefined && <span className={styles.metadata}>{metadata}</span>}
        </div>
        {download !== null && (
          <a className={styles.downloadLink} href={download.href} download={download.filename}>
            {download.label ?? 'DXF'}
          </a>
        )}
      </div>

      <div
        className={cx(styles.viewport, canInteract && styles.interactive)}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {resolvedStatus === 'loading' && <div className={styles.stateText}>{loadingMessage}</div>}
        {resolvedStatus === 'error' && <div className={styles.stateText}>{error ?? 'Drawing preview failed'}</div>}
        {resolvedStatus === 'idle' && <div className={styles.stateText}>{emptyMessage}</div>}
        {canInteract && (
          <div
            className={styles.canvas}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            }}
          >
            <DrawingContent source={source} />
          </div>
        )}
      </div>
    </div>
  )
}

function DrawingContent({ source }: { source: DrawingSource }) {
  const label = source.label ?? 'Drawing preview'
  if (source.kind === 'svg') {
    return (
      <div
        className={styles.svgSlot}
        role="img"
        aria-label={label}
        dangerouslySetInnerHTML={{ __html: source.content }}
      />
    )
  }

  return (
    <img
      className={styles.image}
      src={source.kind === 'svg-url' ? source.url : source.url}
      alt={label}
      draggable={false}
    />
  )
}
