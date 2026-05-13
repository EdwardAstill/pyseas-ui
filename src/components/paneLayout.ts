export type DropEdge = 'top' | 'right' | 'bottom' | 'left' | 'center'
export type SplitDirection = 'row' | 'col'

export interface LeafNode<TTab extends string = string> {
  type: 'leaf'
  id: string
  tabs: TTab[]
  activeTab: TTab
}

export interface SplitNode<TTab extends string = string> {
  type: 'split'
  dir: SplitDirection
  children: LayoutNode<TTab>[]
  sizes?: number[]
}

export type LayoutNode<TTab extends string = string> = LeafNode<TTab> | SplitNode<TTab>

export interface LeafSearchResult<TTab extends string = string> {
  leaf: LeafNode<TTab>
  path: number[]
}

export interface LayoutRect {
  left: number
  top: number
  width: number
  height: number
}

export interface LayoutPoint {
  x: number
  y: number
}

export interface MoveTabOptions<TTab extends string = string> {
  tab: TTab
  sourceLeafId: string
  targetLeafId: string
  edge: DropEdge
  newLeafId?: string
}

export interface MoveGroupOptions {
  sourceLeafId: string
  targetLeafId: string
  edge: DropEdge
  newLeafId?: string
}

export function cloneLayout<TTab extends string>(node: LayoutNode<TTab>): LayoutNode<TTab> {
  if (node.type === 'leaf') {
    return {
      ...node,
      tabs: [...node.tabs],
    }
  }

  const split: SplitNode<TTab> = {
    type: 'split',
    dir: node.dir,
    children: node.children.map((child) => cloneLayout(child)),
  }

  if (node.sizes !== undefined) split.sizes = [...node.sizes]
  return split
}

export function normalizeSplitSizes(sizes: number[] | undefined, count: number): number[] {
  if (count <= 0) return []

  const values = Array.from({ length: count }, (_, index) => {
    const value = sizes?.[index]
    return value !== undefined && Number.isFinite(value) && value > 0 ? value : 1
  })

  const total = values.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return Array.from({ length: count }, () => 1 / count)

  return values.map((value) => value / total)
}

export function findLeafById<TTab extends string>(
  node: LayoutNode<TTab>,
  leafId: string,
  path: number[] = [],
): LeafSearchResult<TTab> | null {
  if (node.type === 'leaf') {
    return node.id === leafId ? { leaf: node, path } : null
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]
    if (child === undefined) continue
    const result = findLeafById(child, leafId, [...path, index])
    if (result !== null) return result
  }

  return null
}

export function findLeafOfTab<TTab extends string>(
  node: LayoutNode<TTab>,
  tab: TTab,
  path: number[] = [],
): LeafSearchResult<TTab> | null {
  if (node.type === 'leaf') {
    return node.tabs.includes(tab) ? { leaf: node, path } : null
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]
    if (child === undefined) continue
    const result = findLeafOfTab(child, tab, [...path, index])
    if (result !== null) return result
  }

  return null
}

export function setActiveTab<TTab extends string>(
  node: LayoutNode<TTab>,
  leafId: string,
  tab: TTab,
): LayoutNode<TTab> {
  if (node.type === 'leaf') {
    if (node.id !== leafId || !node.tabs.includes(tab)) return node
    return { ...node, activeTab: tab }
  }

  return {
    ...node,
    children: node.children.map((child) => setActiveTab(child, leafId, tab)),
  }
}

export function setSplitSizesAtPath<TTab extends string>(
  node: LayoutNode<TTab>,
  path: number[],
  sizes: number[],
): LayoutNode<TTab> {
  if (path.length === 0) {
    if (node.type !== 'split') return node
    return {
      ...node,
      sizes: normalizeSplitSizes(sizes, node.children.length),
    }
  }

  if (node.type !== 'split') return node
  const [head, ...tail] = path
  if (head === undefined) return node

  return {
    ...node,
    children: node.children.map((child, index) =>
      index === head ? setSplitSizesAtPath(child, tail, sizes) : child,
    ),
  }
}

export function removeLeafById<TTab extends string>(
  node: LayoutNode<TTab>,
  leafId: string,
): LayoutNode<TTab> | null {
  if (node.type === 'leaf') {
    return node.id === leafId ? null : node
  }

  const children = node.children
    .map((child) => removeLeafById(child, leafId))
    .filter((child): child is LayoutNode<TTab> => child !== null)

  return collapseSplit({
    ...node,
    children,
    sizes: normalizeSplitSizes(node.sizes, children.length),
  })
}

export function insertLeafAt<TTab extends string>(
  node: LayoutNode<TTab>,
  targetLeafId: string,
  leaf: LeafNode<TTab>,
  edge: DropEdge,
): LayoutNode<TTab> {
  if (node.type === 'leaf') {
    if (node.id !== targetLeafId) return node

    if (edge === 'center') {
      const tabs = [...node.tabs]
      for (const tab of leaf.tabs) {
        if (!tabs.includes(tab)) tabs.push(tab)
      }
      return {
        ...node,
        tabs,
        activeTab: leaf.activeTab,
      }
    }

    const dir: SplitDirection = edge === 'left' || edge === 'right' ? 'row' : 'col'
    const children = edge === 'left' || edge === 'top' ? [leaf, node] : [node, leaf]

    return {
      type: 'split',
      dir,
      children,
      sizes: [0.5, 0.5],
    }
  }

  return {
    ...node,
    children: node.children.map((child) => insertLeafAt(child, targetLeafId, leaf, edge)),
  }
}

export function insertTabAt<TTab extends string>(
  node: LayoutNode<TTab>,
  targetLeafId: string,
  tab: TTab,
  edge: DropEdge,
  newLeafId?: string,
): LayoutNode<TTab> {
  const leaf: LeafNode<TTab> = {
    type: 'leaf',
    id: newLeafId ?? nextLeafId(node, String(tab)),
    tabs: [tab],
    activeTab: tab,
  }

  return insertLeafAt(node, targetLeafId, leaf, edge)
}

export function moveTab<TTab extends string>(
  node: LayoutNode<TTab>,
  options: MoveTabOptions<TTab>,
): LayoutNode<TTab> {
  const source = findLeafById(node, options.sourceLeafId)
  if (source === null || !source.leaf.tabs.includes(options.tab)) return node

  if (options.sourceLeafId === options.targetLeafId && options.edge === 'center') {
    return setActiveTab(node, options.sourceLeafId, options.tab)
  }

  if (options.sourceLeafId === options.targetLeafId && source.leaf.tabs.length <= 1) {
    return node
  }

  const afterRemoval = removeTabFromLeaf(node, options.sourceLeafId, options.tab)
  if (afterRemoval === null || findLeafById(afterRemoval, options.targetLeafId) === null) return node

  return insertTabAt(
    afterRemoval,
    options.targetLeafId,
    options.tab,
    options.edge,
    options.newLeafId ?? nextLeafId(afterRemoval, String(options.tab)),
  )
}

export function moveGroup<TTab extends string>(
  node: LayoutNode<TTab>,
  options: MoveGroupOptions,
): LayoutNode<TTab> {
  if (options.sourceLeafId === options.targetLeafId) return node

  const source = findLeafById(node, options.sourceLeafId)
  if (source === null) return node

  const sourceLeaf: LeafNode<TTab> = {
    ...source.leaf,
    id: options.newLeafId ?? source.leaf.id,
    tabs: [...source.leaf.tabs],
  }

  const afterRemoval = removeLeafById(node, options.sourceLeafId)
  if (afterRemoval === null || findLeafById(afterRemoval, options.targetLeafId) === null) return node

  return insertLeafAt(afterRemoval, options.targetLeafId, sourceLeaf, options.edge)
}

export function computeDropEdge(
  point: LayoutPoint,
  rect: LayoutRect,
  threshold = 0.24,
): DropEdge {
  if (rect.width <= 0 || rect.height <= 0) return 'center'

  const x = clamp((point.x - rect.left) / rect.width, 0, 1)
  const y = clamp((point.y - rect.top) / rect.height, 0, 1)
  const distances: Array<[DropEdge, number]> = [
    ['left', x],
    ['right', 1 - x],
    ['top', y],
    ['bottom', 1 - y],
  ]

  const [edge, distance] = distances.reduce((best, current) => (current[1] < best[1] ? current : best))
  return distance <= threshold ? edge : 'center'
}

function removeTabFromLeaf<TTab extends string>(
  node: LayoutNode<TTab>,
  leafId: string,
  tab: TTab,
): LayoutNode<TTab> | null {
  if (node.type === 'leaf') {
    if (node.id !== leafId) return node

    const tabs = node.tabs.filter((candidate) => candidate !== tab)
    if (tabs.length === 0) return null

    return {
      ...node,
      tabs,
      activeTab: node.activeTab === tab ? tabs[0]! : node.activeTab,
    }
  }

  const children = node.children
    .map((child) => removeTabFromLeaf(child, leafId, tab))
    .filter((child): child is LayoutNode<TTab> => child !== null)

  return collapseSplit({
    ...node,
    children,
    sizes: normalizeSplitSizes(node.sizes, children.length),
  })
}

function collapseSplit<TTab extends string>(node: SplitNode<TTab>): LayoutNode<TTab> | null {
  if (node.children.length === 0) return null
  if (node.children.length === 1) return node.children[0]!
  return {
    ...node,
    sizes: normalizeSplitSizes(node.sizes, node.children.length),
  }
}

function nextLeafId<TTab extends string>(node: LayoutNode<TTab>, label: string): string {
  const base = `${sanitizeId(label)}-leaf`
  let suffix = 1
  let candidate = base

  while (findLeafById(node, candidate) !== null) {
    suffix += 1
    candidate = `${base}-${suffix}`
  }

  return candidate
}

function sanitizeId(label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return slug.length > 0 ? slug : 'pane'
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
