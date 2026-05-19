import { useMemo, useState, type CSSProperties, type DragEvent, type ReactNode } from 'react'

import styles from './Tree.module.css'
import { cx } from './cx'

export interface TreeNode<T = unknown> {
  id: string
  label: string
  children?: TreeNode<T>[]
  disabled?: boolean
  icon?: ReactNode
  trailing?: ReactNode
  data?: T
}

export interface TreeRenderArgs<T> {
  node: TreeNode<T>
  depth: number
  expanded: boolean
  selected: boolean
}

export interface TreeDisclosureArgs<T> extends TreeRenderArgs<T> {
  disabled: boolean
}

export type TreeDropPosition = 'before' | 'inside' | 'after'

export interface TreeMoveArgs<T = unknown> {
  draggedId: string
  targetId: string
  position: TreeDropPosition
  draggedNode: TreeNode<T>
  targetNode: TreeNode<T>
}

export interface TreeProps<T = unknown> {
  nodes: TreeNode<T>[]
  expanded: ReadonlySet<string>
  onExpandedChange: (next: Set<string>) => void
  selected?: string | null
  onSelect?: (id: string, node: TreeNode<T>) => void
  onMove?: (args: TreeMoveArgs<T>) => void
  canDrop?: (args: TreeMoveArgs<T>) => boolean
  indent?: number
  renderDisclosure?: (args: TreeDisclosureArgs<T>) => ReactNode
  renderNode?: (args: TreeRenderArgs<T>) => ReactNode
  className?: string
  style?: CSSProperties
  'aria-label'?: string
}

export function Tree<T = unknown>({
  nodes,
  expanded,
  onExpandedChange,
  selected = null,
  onSelect,
  onMove,
  canDrop,
  indent = 14,
  renderDisclosure,
  renderNode,
  className,
  style,
  'aria-label': ariaLabel,
}: TreeProps<T>) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<TreeDropTarget | null>(null)
  const lookup = useMemo(() => buildTreeLookup(nodes), [nodes])

  function toggle(id: string) {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onExpandedChange(next)
  }

  function resolveMove(
    draggedId: string | null,
    targetId: string,
    position: TreeDropPosition,
  ): TreeMoveArgs<T> | null {
    if (draggedId === null || draggedId === targetId || onMove === undefined) return null

    const dragged = lookup.get(draggedId)
    const target = lookup.get(targetId)
    if (dragged === undefined || target === undefined) return null
    if (target.ancestorIds.includes(draggedId)) return null
    if (target.node.disabled === true) return null

    const args = {
      draggedId,
      targetId,
      position,
      draggedNode: dragged.node,
      targetNode: target.node,
    }

    if (canDrop !== undefined && !canDrop(args)) return null
    return args
  }

  function handleRowDragStart(id: string) {
    setDraggingId(id)
  }

  function handleRowDragOver(
    event: DragEvent<HTMLButtonElement>,
    targetId: string,
  ): boolean {
    const position = getDropPosition(event)
    const next = resolveMove(draggingId, targetId, position)
    if (next === null) {
      if (dropTarget !== null) setDropTarget(null)
      return false
    }

    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    setDropTarget({ id: targetId, position })
    return true
  }

  function handleRowDrop(event: DragEvent<HTMLButtonElement>, targetId: string) {
    const position = dropTarget?.id === targetId ? dropTarget.position : getDropPosition(event)
    const move = resolveMove(draggingId, targetId, position)
    setDropTarget(null)
    setDraggingId(null)

    if (move === null || onMove === undefined) return

    event.preventDefault()
    onMove(move)
  }

  function clearDragState() {
    setDropTarget(null)
    setDraggingId(null)
  }

  return (
    <div
      role="tree"
      aria-label={ariaLabel}
      className={cx(styles.tree, className)}
      style={style}
    >
      {nodes.map((node) => (
        <TreeRow
          key={node.id}
          node={node}
          depth={0}
          indent={indent}
          expanded={expanded}
          selected={selected}
          onSelect={onSelect}
          toggle={toggle}
          renderDisclosure={renderDisclosure}
          renderNode={renderNode}
          moveEnabled={onMove !== undefined}
          draggingId={draggingId}
          dropTarget={dropTarget}
          onDragStart={handleRowDragStart}
          onDragOver={handleRowDragOver}
          onDrop={handleRowDrop}
          onDragEnd={clearDragState}
        />
      ))}
    </div>
  )
}

interface TreeLookupEntry<T> {
  node: TreeNode<T>
  ancestorIds: string[]
}

interface TreeDropTarget {
  id: string
  position: TreeDropPosition
}

interface TreeRowProps<T> {
  node: TreeNode<T>
  depth: number
  indent: number
  expanded: ReadonlySet<string>
  selected: string | null
  onSelect: ((id: string, node: TreeNode<T>) => void) | undefined
  toggle: (id: string) => void
  renderDisclosure: ((args: TreeDisclosureArgs<T>) => ReactNode) | undefined
  renderNode: ((args: TreeRenderArgs<T>) => ReactNode) | undefined
  moveEnabled: boolean
  draggingId: string | null
  dropTarget: TreeDropTarget | null
  onDragStart: (id: string) => void
  onDragOver: (event: DragEvent<HTMLButtonElement>, targetId: string) => boolean
  onDrop: (event: DragEvent<HTMLButtonElement>, targetId: string) => void
  onDragEnd: () => void
}

function TreeRow<T>({
  node,
  depth,
  indent,
  expanded,
  selected,
  onSelect,
  toggle,
  renderDisclosure,
  renderNode,
  moveEnabled,
  draggingId,
  dropTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TreeRowProps<T>) {
  const hasChildren = node.children !== undefined && node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const isSelected = selected === node.id
  const isDisabled = node.disabled === true
  const isDragging = draggingId === node.id
  const isDraggable = moveEnabled && !isDisabled
  const dropPosition = dropTarget?.id === node.id ? dropTarget.position : null

  function handleClick() {
    if (isDisabled) return
    if (hasChildren) toggle(node.id)
    if (onSelect !== undefined) onSelect(node.id, node)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (isDisabled) return
    if (event.key === 'ArrowRight' && hasChildren && !isExpanded) {
      event.preventDefault()
      toggle(node.id)
    } else if (event.key === 'ArrowLeft' && hasChildren && isExpanded) {
      event.preventDefault()
      toggle(node.id)
    }
  }

  function handleDragStart(event: DragEvent<HTMLButtonElement>) {
    if (!isDraggable) return

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', node.id)
    onDragStart(node.id)
  }

  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    if (!moveEnabled) return
    const accepted = onDragOver(event, node.id)
    if (!accepted) event.dataTransfer.dropEffect = 'none'
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    onDrop(event, node.id)
  }

  const rowContent =
    renderNode !== undefined
      ? renderNode({ node, depth, expanded: isExpanded, selected: isSelected })
      : (
        <>
          <span className={styles.label}>{node.label}</span>
          {node.trailing !== undefined && <span className={styles.trailing}>{node.trailing}</span>}
        </>
      )
  const disclosureContent =
    renderDisclosure !== undefined
      ? renderDisclosure({
        node,
        depth,
        expanded: isExpanded,
        selected: isSelected,
        disabled: isDisabled,
      })
      : (
        <svg className={styles.caret} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path
            d={isExpanded ? 'M3 5L7 9L11 5' : 'M5 3L9 7L5 11'}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

  return (
    <>
      <button
        type="button"
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        className={cx(
          styles.row,
          isSelected && styles.rowSelected,
          isDisabled && styles.rowDisabled,
          isDraggable && styles.rowDraggable,
          isDragging && styles.rowDragging,
          dropPosition === 'before' && styles.rowDropBefore,
          dropPosition === 'inside' && styles.rowDropInside,
          dropPosition === 'after' && styles.rowDropAfter,
        )}
        style={{ paddingLeft: `calc(var(--ps-space-sm) + ${depth * indent}px)` }}
        draggable={isDraggable}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={onDragEnd}
      >
        {hasChildren ? (
          disclosureContent
        ) : (
          <span className={styles.caretSpacer} aria-hidden="true" />
        )}
        {node.icon !== undefined && <span className={styles.icon} aria-hidden="true">{node.icon}</span>}
        {rowContent}
      </button>
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              indent={indent}
              expanded={expanded}
              selected={selected}
              onSelect={onSelect}
              toggle={toggle}
              renderDisclosure={renderDisclosure}
              renderNode={renderNode}
              moveEnabled={moveEnabled}
              draggingId={draggingId}
              dropTarget={dropTarget}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}
    </>
  )
}

function buildTreeLookup<T>(
  nodes: TreeNode<T>[],
  ancestorIds: string[] = [],
  lookup = new Map<string, TreeLookupEntry<T>>(),
) {
  for (const node of nodes) {
    lookup.set(node.id, { node, ancestorIds })
    if (node.children !== undefined) {
      buildTreeLookup(node.children, [...ancestorIds, node.id], lookup)
    }
  }
  return lookup
}

function getDropPosition(event: DragEvent<HTMLElement>): TreeDropPosition {
  const rect = event.currentTarget.getBoundingClientRect()
  const offset = event.clientY - rect.top
  const edgeSize = Math.min(6, rect.height * 0.28)

  if (offset <= edgeSize) return 'before'
  if (offset >= rect.height - edgeSize) return 'after'
  return 'inside'
}
