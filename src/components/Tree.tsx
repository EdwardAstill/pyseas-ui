import type { CSSProperties, ReactNode } from 'react'

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

export interface TreeProps<T = unknown> {
  nodes: TreeNode<T>[]
  expanded: ReadonlySet<string>
  onExpandedChange: (next: Set<string>) => void
  selected?: string | null
  onSelect?: (id: string, node: TreeNode<T>) => void
  indent?: number
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
  indent = 14,
  renderNode,
  className,
  style,
  'aria-label': ariaLabel,
}: TreeProps<T>) {
  function toggle(id: string) {
    const next = new Set(expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onExpandedChange(next)
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
          renderNode={renderNode}
        />
      ))}
    </div>
  )
}

interface TreeRowProps<T> {
  node: TreeNode<T>
  depth: number
  indent: number
  expanded: ReadonlySet<string>
  selected: string | null
  onSelect: ((id: string, node: TreeNode<T>) => void) | undefined
  toggle: (id: string) => void
  renderNode: ((args: TreeRenderArgs<T>) => ReactNode) | undefined
}

function TreeRow<T>({
  node,
  depth,
  indent,
  expanded,
  selected,
  onSelect,
  toggle,
  renderNode,
}: TreeRowProps<T>) {
  const hasChildren = node.children !== undefined && node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const isSelected = selected === node.id
  const isDisabled = node.disabled === true

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

  const rowContent =
    renderNode !== undefined
      ? renderNode({ node, depth, expanded: isExpanded, selected: isSelected })
      : (
        <>
          <span className={styles.label}>{node.label}</span>
          {node.trailing !== undefined && <span className={styles.trailing}>{node.trailing}</span>}
        </>
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
        )}
        style={{ paddingLeft: `calc(var(--ps-space-sm) + ${depth * indent}px)` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {hasChildren ? (
          <span className={styles.caret} aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
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
              renderNode={renderNode}
            />
          ))}
        </div>
      )}
    </>
  )
}
