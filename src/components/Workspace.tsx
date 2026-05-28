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
import styles from './Workspace.module.css'
import { cx } from './cx'
import {
  computeDropEdge,
  moveGroup,
  moveTab,
  normalizeSplitSizes,
  setActiveTab,
  setSplitSizesAtPath,
  type DropEdge,
  type LayoutNode,
  type LeafNode,
  type SplitDirection,
  type SplitNode,
} from './paneLayout'

type DragState<TTab extends string> =
  | { kind: 'tab'; sourceLeafId: string; tab: TTab }
  | { kind: 'group'; sourceLeafId: string }

interface DropTarget {
  leafId: string
  edge: DropEdge
}

interface ResizeState {
  path: number[]
  index: number
  dir: SplitDirection
  startClient: number
  startSizes: number[]
  extentPx: number
}

export interface WorkspaceProps<TTab extends string = string> {
  defaultLayout: LayoutNode<TTab>
  layout?: LayoutNode<TTab>
  onLayoutChange?: (layout: LayoutNode<TTab>) => void
  renderPanel: (tab: TTab) => ReactNode
  renderTabLabel?: (tab: TTab) => ReactNode
  renderToolbar?: (activeTab: TTab, leaf: LeafNode<TTab>) => ReactNode
  minPaneSize?: number
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export function Workspace<TTab extends string = string>({
  defaultLayout,
  layout,
  onLayoutChange,
  renderPanel,
  renderTabLabel,
  renderToolbar,
  minPaneSize = 160,
  className,
  style,
  'aria-label': ariaLabel = 'Workspace',
}: WorkspaceProps<TTab>) {
  const [internalLayout, setInternalLayout] = useState<LayoutNode<TTab>>(defaultLayout)
  const [dragState, setDragState] = useState<DragState<TTab> | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const [resizeState, setResizeState] = useState<ResizeState | null>(null)

  const currentLayout = layout ?? internalLayout

  const updateLayout = useCallback(
    (updater: (current: LayoutNode<TTab>) => LayoutNode<TTab>) => {
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

      updateLayout((current) => setSplitSizesAtPath(current, resizeState.path, sizes))
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

  function renderNode(node: LayoutNode<TTab>, path: number[]): ReactNode {
    if (node.type === 'leaf') return renderLeaf(node)
    return renderSplit(node, path)
  }

  function renderSplit(node: SplitNode<TTab>, path: number[]): ReactNode {
    const sizes = normalizeSplitSizes(node.sizes, node.children.length)
    const splitClass = cx(styles.split, node.dir === 'row' ? styles.splitRow : styles.splitCol)

    return (
      <div className={splitClass} data-ui="workspace-split" data-direction={node.dir}>
        {node.children.map((child, index) => (
          <Fragment key={`${path.join('.')}.${index}.${child.type === 'leaf' ? child.id : child.dir}`}>
            <div className={styles.splitChild} style={{ flex: `${sizes[index]} 1 0px` }}>
              {renderNode(child, [...path, index])}
            </div>
            {index < node.children.length - 1 && (
              <div
                aria-label="Resize pane"
                className={cx(styles.resizeHandle, node.dir === 'row' ? styles.resizeVertical : styles.resizeHorizontal)}
                data-ui="workspace-resize-handle"
                onPointerDown={(event) => startResize(event, node, path, index)}
                role="separator"
              />
            )}
          </Fragment>
        ))}
      </div>
    )
  }

  function renderLeaf(leaf: LeafNode<TTab>): ReactNode {
    const activeDrop = dropTarget?.leafId === leaf.id ? dropTarget.edge : null
    const toolbar = renderToolbar?.(leaf.activeTab, leaf)

    return (
      <section
        className={cx(styles.leaf, activeDrop !== null && styles.dropActive)}
        data-drop-edge={activeDrop ?? undefined}
        data-leaf-id={leaf.id}
        data-ui="pane-leaf"
        onDragOver={(event) => updateDropTarget(event, leaf.id)}
        onDrop={(event) => applyDrop(event, leaf.id)}
        onDragLeave={(event) => clearDropTarget(event)}
      >
        <div
          className={styles.tabStrip}
          data-ui="pane-tabstrip"
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
              data-ui="pane-tab"
              draggable
              key={tab}
              onClick={() => updateLayout((current) => setActiveTab(current, leaf.id, tab))}
              onDragEnd={() => setDragState(null)}
              onDragStart={(event) => startTabDrag(event, leaf.id, tab)}
              role="tab"
              title={String(tab)}
              type="button"
            >
              <span>{renderTabLabel?.(tab) ?? tab}</span>
            </button>
          ))}
          {toolbar !== undefined && <div className={styles.leafToolbar} data-ui="pane-toolbar">{toolbar}</div>}
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
    node: SplitNode<TTab>,
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
      startSizes: normalizeSplitSizes(node.sizes, node.children.length),
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
    if (target instanceof HTMLElement && target.closest('[data-ui="pane-tab"]') !== null) return
    if (target instanceof HTMLElement && target.closest('[data-ui="pane-toolbar"]') !== null) {
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
    const edge = computeDropEdge({ x: event.clientX, y: event.clientY }, rect)
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
        return moveTab(current, {
          tab: dragState.tab,
          sourceLeafId: dragState.sourceLeafId,
          targetLeafId: leafId,
          edge,
          newLeafId,
        })
      }

      return moveGroup(current, {
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

function dropEdgeClass(edge: DropEdge): string {
  if (edge === 'left') return styles.dropLeft ?? ''
  if (edge === 'right') return styles.dropRight ?? ''
  if (edge === 'top') return styles.dropTop ?? ''
  if (edge === 'bottom') return styles.dropBottom ?? ''
  return styles.dropCenter ?? ''
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
