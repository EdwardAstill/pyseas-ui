import {
  Fragment,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import styles from './DockPaneWorkspace.module.css'
import { cx } from './cx'
import {
  computeDockDropEdge,
  moveDockGroup,
  moveDockTab,
  normalizeDockSizes,
  setDockActiveTab,
  setDockSplitSizesAtPath,
  type DockDropEdge,
  type DockLayoutNode,
  type DockLeafNode,
  type DockSplitDirection,
  type DockSplitNode,
} from './dockPaneLayout'

type DockDragState<TTab extends string> =
  | { kind: 'tab'; sourceLeafId: string; tab: TTab }
  | { kind: 'group'; sourceLeafId: string }

interface DockDropTarget {
  leafId: string
  edge: DockDropEdge
}

interface ResizeState {
  path: number[]
  index: number
  dir: DockSplitDirection
  startClient: number
  startSizes: number[]
  extentPx: number
}

export interface DockPaneWorkspaceProps<TTab extends string = string> {
  defaultLayout: DockLayoutNode<TTab>
  layout?: DockLayoutNode<TTab>
  onLayoutChange?: (layout: DockLayoutNode<TTab>) => void
  renderPanel: (tab: TTab) => ReactNode
  renderTabLabel?: (tab: TTab) => ReactNode
  renderToolbar?: (activeTab: TTab, leaf: DockLeafNode<TTab>) => ReactNode
  minPaneSize?: number
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export function DockPaneWorkspace<TTab extends string = string>({
  defaultLayout,
  layout,
  onLayoutChange,
  renderPanel,
  renderTabLabel,
  renderToolbar,
  minPaneSize = 160,
  className,
  style,
  'aria-label': ariaLabel = 'Dock workspace',
}: DockPaneWorkspaceProps<TTab>) {
  const [internalLayout, setInternalLayout] = useState<DockLayoutNode<TTab>>(defaultLayout)
  const [dragState, setDragState] = useState<DockDragState<TTab> | null>(null)
  const [dropTarget, setDropTarget] = useState<DockDropTarget | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

  const currentLayout = layout ?? internalLayout

  const updateLayout = useCallback(
    (updater: (current: DockLayoutNode<TTab>) => DockLayoutNode<TTab>) => {
      const nextLayout = updater(layout ?? internalLayout)
      if (layout === undefined) setInternalLayout(nextLayout)
      onLayoutChange?.(nextLayout)
    },
    [internalLayout, layout, onLayoutChange],
  )

  useEffect(() => {
    if (resizeState === null) return

    const onPointerMove = (event: globalThis.PointerEvent) => {
      const client = resizeState.dir === 'row' ? event.clientX : event.clientY
      const deltaRatio = (client - resizeState.startClient) / resizeState.extentPx
      const sizes = [...resizeState.startSizes]
      const firstStart = sizes[resizeState.index] ?? 0
      const secondStart = sizes[resizeState.index + 1] ?? 0
      const pairTotal = firstStart + secondStart
      const minRatio = Math.min(pairTotal / 2, minPaneSize / resizeState.extentPx)
      const first = clamp(firstStart + deltaRatio, minRatio, pairTotal - minRatio)

      sizes[resizeState.index] = first
      sizes[resizeState.index + 1] = pairTotal - first

      updateLayout((current) => setDockSplitSizesAtPath(current, resizeState.path, sizes))
    }

    const onPointerUp = () => {
      setResizeState(null)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp, { once: true })
    window.addEventListener('pointercancel', onPointerUp, { once: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [minPaneSize, resizeState, updateLayout])

  const workspaceClass = cx(styles.workspace, resizeState !== null && styles.resizing, className)

  return (
    <div className={workspaceClass} style={style} aria-label={ariaLabel}>
      {renderNode(currentLayout, [])}
    </div>
  )

  function renderNode(node: DockLayoutNode<TTab>, path: number[]): ReactNode {
    if (node.type === 'leaf') return renderLeaf(node)
    return renderSplit(node, path)
  }

  function renderSplit(node: DockSplitNode<TTab>, path: number[]): ReactNode {
    const sizes = normalizeDockSizes(node.sizes, node.children.length)
    const splitClass = cx(styles.split, node.dir === 'row' ? styles.splitRow : styles.splitCol)

    return (
      <div className={splitClass} data-pyseas-ui="dock-split" data-direction={node.dir}>
        {node.children.map((child, index) => (
          <Fragment key={`${path.join('.')}.${index}.${child.type === 'leaf' ? child.id : child.dir}`}>
            <div className={styles.splitChild} style={{ flex: `${sizes[index]} 1 0px` }}>
              {renderNode(child, [...path, index])}
            </div>
            {index < node.children.length - 1 && (
              <div
                aria-label="Resize pane"
                className={cx(styles.resizeHandle, node.dir === 'row' ? styles.resizeVertical : styles.resizeHorizontal)}
                data-pyseas-ui="dock-resize-handle"
                onPointerDown={(event) => startResize(event, node, path, index)}
                role="separator"
              />
            )}
          </Fragment>
        ))}
      </div>
    )
  }

  function renderLeaf(leaf: DockLeafNode<TTab>): ReactNode {
    const activeDrop = dropTarget?.leafId === leaf.id ? dropTarget.edge : null
    const toolbar = renderToolbar?.(leaf.activeTab, leaf)

    return (
      <section
        className={cx(styles.leaf, activeDrop !== null && styles.dropActive)}
        data-drop-edge={activeDrop ?? undefined}
        data-leaf-id={leaf.id}
        data-pyseas-ui="dock-leaf"
        onDragOver={(event) => updateDropTarget(event, leaf.id)}
        onDrop={(event) => applyDrop(event, leaf.id)}
        onDragLeave={(event) => clearDropTarget(event)}
      >
        <div
          className={styles.tabStrip}
          data-pyseas-ui="dock-tabstrip"
          draggable
          onDragEnd={() => setDragState(null)}
          onDragStart={(event) => startTabStripDrag(event, leaf.id)}
          role="tablist"
          title="Drag empty tab bar area to move pane"
        >
          {leaf.tabs.map((tab) => (
            <button
              aria-selected={leaf.activeTab === tab}
              className={cx(styles.tab, leaf.activeTab === tab && styles.tabActive)}
              data-pyseas-ui="dock-tab"
              draggable
              key={tab}
              onClick={() => updateLayout((current) => setDockActiveTab(current, leaf.id, tab))}
              onDragEnd={() => setDragState(null)}
              onDragStart={(event) => startTabDrag(event, leaf.id, tab)}
              role="tab"
              title={String(tab)}
              type="button"
            >
              <span>{renderTabLabel?.(tab) ?? tab}</span>
            </button>
          ))}
          {toolbar !== undefined && <div className={styles.leafToolbar} data-pyseas-ui="dock-toolbar">{toolbar}</div>}
        </div>
        <div className={styles.panelBody} role="tabpanel">
          {renderPanel(leaf.activeTab)}
        </div>
        {activeDrop !== null && <div className={cx(styles.dropIndicator, dropEdgeClass(activeDrop))} aria-hidden="true" />}
      </section>
    )
  }

  function startResize(
    event: ReactPointerEvent<HTMLDivElement>,
    node: DockSplitNode<TTab>,
    path: number[],
    index: number,
  ) {
    const rect = event.currentTarget.parentElement?.getBoundingClientRect()
    if (rect === undefined) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    setResizeState({
      path,
      index,
      dir: node.dir,
      startClient: node.dir === 'row' ? event.clientX : event.clientY,
      startSizes: normalizeDockSizes(node.sizes, node.children.length),
      extentPx: Math.max(1, node.dir === 'row' ? rect.width : rect.height),
    })
  }

  function startTabDrag(event: DragEvent<HTMLButtonElement>, sourceLeafId: string, tab: TTab) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', `${sourceLeafId}:${tab}`)
    setDragState({ kind: 'tab', sourceLeafId, tab })
  }

  function startTabStripDrag(event: DragEvent<HTMLDivElement>, sourceLeafId: string) {
    const target = event.target
    if (target instanceof HTMLElement && target.closest('[data-pyseas-ui="dock-tab"]') !== null) return
    if (target instanceof HTMLElement && target.closest('[data-pyseas-ui="dock-toolbar"]') !== null) {
      event.preventDefault()
      return
    }

    startGroupDrag(event, sourceLeafId)
  }

  function startGroupDrag(event: DragEvent<HTMLElement>, sourceLeafId: string) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', sourceLeafId)
    setDragState({ kind: 'group', sourceLeafId })
  }

  function updateDropTarget(event: DragEvent<HTMLElement>, leafId: string) {
    if (dragState === null) return

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'

    const rect = event.currentTarget.getBoundingClientRect()
    const edge = computeDockDropEdge({ x: event.clientX, y: event.clientY }, rect)
    setDropTarget({ leafId, edge })
  }

  function clearDropTarget(event: DragEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return
    setDropTarget(null)
  }

  function applyDrop(event: DragEvent<HTMLElement>, leafId: string) {
    if (dragState === null) return

    event.preventDefault()
    const edge = dropTarget?.leafId === leafId ? dropTarget.edge : 'center'
    const newLeafId = `${dragState.kind}-${Date.now()}-${Math.round(Math.random() * 100_000)}`

    updateLayout((current) => {
      if (dragState.kind === 'tab') {
        return moveDockTab(current, {
          tab: dragState.tab,
          sourceLeafId: dragState.sourceLeafId,
          targetLeafId: leafId,
          edge,
          newLeafId,
        })
      }

      return moveDockGroup(current, {
        sourceLeafId: dragState.sourceLeafId,
        targetLeafId: leafId,
        edge,
        newLeafId,
      })
    })

    setDragState(null)
    setDropTarget(null)
  }
}

function dropEdgeClass(edge: DockDropEdge): string {
  if (edge === 'left') return styles.dropLeft ?? ''
  if (edge === 'right') return styles.dropRight ?? ''
  if (edge === 'top') return styles.dropTop ?? ''
  if (edge === 'bottom') return styles.dropBottom ?? ''
  return styles.dropCenter ?? ''
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
