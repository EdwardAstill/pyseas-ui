export type DockDropEdge = 'top' | 'right' | 'bottom' | 'left' | 'center'
export type DockSplitDirection = 'row' | 'col'

export interface DockLeafNode<TTab extends string = string> {
  type: 'leaf'
  id: string
  tabs: TTab[]
  activeTab: TTab
}

export interface DockSplitNode<TTab extends string = string> {
  type: 'split'
  dir: DockSplitDirection
  children: DockLayoutNode<TTab>[]
  sizes?: number[]
}

export type DockLayoutNode<TTab extends string = string> = DockLeafNode<TTab> | DockSplitNode<TTab>

export interface DockLeafSearchResult<TTab extends string = string> {
  leaf: DockLeafNode<TTab>
  path: number[]
}

export interface DockRect {
  left: number
  top: number
  width: number
  height: number
}

export interface DockPoint {
  x: number
  y: number
}

export interface MoveDockTabOptions<TTab extends string = string> {
  tab: TTab
  sourceLeafId: string
  targetLeafId: string
  edge: DockDropEdge
  newLeafId?: string
}

export interface MoveDockGroupOptions {
  sourceLeafId: string
  targetLeafId: string
  edge: DockDropEdge
  newLeafId?: string
}

export function cloneDockLayout<TTab extends string>(node: DockLayoutNode<TTab>): DockLayoutNode<TTab> {
  if (node.type === 'leaf') {
    return {
      ...node,
      tabs: [...node.tabs],
    }
  }

  const split: DockSplitNode<TTab> = {
    type: 'split',
    dir: node.dir,
    children: node.children.map((child) => cloneDockLayout(child)),
  }

  if (node.sizes !== undefined) split.sizes = [...node.sizes]
  return split
}

export function normalizeDockSizes(sizes: number[] | undefined, count: number): number[] {
  if (count <= 0) return []

  const values = Array.from({ length: count }, (_, index) => {
    const value = sizes?.[index]
    return value !== undefined && Number.isFinite(value) && value > 0 ? value : 1
  })

  const total = values.reduce((sum, value) => sum + value, 0)
  if (total <= 0) return Array.from({ length: count }, () => 1 / count)

  return values.map((value) => value / total)
}

export function findDockLeafById<TTab extends string>(
  node: DockLayoutNode<TTab>,
  leafId: string,
  path: number[] = [],
): DockLeafSearchResult<TTab> | null {
  if (node.type === 'leaf') {
    return node.id === leafId ? { leaf: node, path } : null
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]
    if (child === undefined) continue
    const result = findDockLeafById(child, leafId, [...path, index])
    if (result !== null) return result
  }

  return null
}

export function findDockLeafOfTab<TTab extends string>(
  node: DockLayoutNode<TTab>,
  tab: TTab,
  path: number[] = [],
): DockLeafSearchResult<TTab> | null {
  if (node.type === 'leaf') {
    return node.tabs.includes(tab) ? { leaf: node, path } : null
  }

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index]
    if (child === undefined) continue
    const result = findDockLeafOfTab(child, tab, [...path, index])
    if (result !== null) return result
  }

  return null
}

export function setDockActiveTab<TTab extends string>(
  node: DockLayoutNode<TTab>,
  leafId: string,
  tab: TTab,
): DockLayoutNode<TTab> {
  if (node.type === 'leaf') {
    if (node.id !== leafId || !node.tabs.includes(tab)) return node
    return { ...node, activeTab: tab }
  }

  return {
    ...node,
    children: node.children.map((child) => setDockActiveTab(child, leafId, tab)),
  }
}

export function setDockSplitSizesAtPath<TTab extends string>(
  node: DockLayoutNode<TTab>,
  path: number[],
  sizes: number[],
): DockLayoutNode<TTab> {
  if (path.length === 0) {
    if (node.type !== 'split') return node
    return {
      ...node,
      sizes: normalizeDockSizes(sizes, node.children.length),
    }
  }

  if (node.type !== 'split') return node
  const [head, ...tail] = path
  if (head === undefined) return node

  return {
    ...node,
    children: node.children.map((child, index) =>
      index === head ? setDockSplitSizesAtPath(child, tail, sizes) : child,
    ),
  }
}

export function removeDockLeafById<TTab extends string>(
  node: DockLayoutNode<TTab>,
  leafId: string,
): DockLayoutNode<TTab> | null {
  if (node.type === 'leaf') {
    return node.id === leafId ? null : node
  }

  const children = node.children
    .map((child) => removeDockLeafById(child, leafId))
    .filter((child): child is DockLayoutNode<TTab> => child !== null)

  return collapseDockSplit({
    ...node,
    children,
    sizes: normalizeDockSizes(node.sizes, children.length),
  })
}

export function insertDockLeafAt<TTab extends string>(
  node: DockLayoutNode<TTab>,
  targetLeafId: string,
  leaf: DockLeafNode<TTab>,
  edge: DockDropEdge,
): DockLayoutNode<TTab> {
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

    const dir: DockSplitDirection = edge === 'left' || edge === 'right' ? 'row' : 'col'
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
    children: node.children.map((child) => insertDockLeafAt(child, targetLeafId, leaf, edge)),
  }
}

export function insertDockTabAt<TTab extends string>(
  node: DockLayoutNode<TTab>,
  targetLeafId: string,
  tab: TTab,
  edge: DockDropEdge,
  newLeafId?: string,
): DockLayoutNode<TTab> {
  const leaf: DockLeafNode<TTab> = {
    type: 'leaf',
    id: newLeafId ?? nextDockLeafId(node, String(tab)),
    tabs: [tab],
    activeTab: tab,
  }

  return insertDockLeafAt(node, targetLeafId, leaf, edge)
}

export function moveDockTab<TTab extends string>(
  node: DockLayoutNode<TTab>,
  options: MoveDockTabOptions<TTab>,
): DockLayoutNode<TTab> {
  const source = findDockLeafById(node, options.sourceLeafId)
  if (source === null || !source.leaf.tabs.includes(options.tab)) return node

  if (options.sourceLeafId === options.targetLeafId && options.edge === 'center') {
    return setDockActiveTab(node, options.sourceLeafId, options.tab)
  }

  if (options.sourceLeafId === options.targetLeafId && source.leaf.tabs.length <= 1) {
    return node
  }

  const afterRemoval = removeDockTabFromLeaf(node, options.sourceLeafId, options.tab)
  if (afterRemoval === null || findDockLeafById(afterRemoval, options.targetLeafId) === null) return node

  return insertDockTabAt(
    afterRemoval,
    options.targetLeafId,
    options.tab,
    options.edge,
    options.newLeafId ?? nextDockLeafId(afterRemoval, String(options.tab)),
  )
}

export function moveDockGroup<TTab extends string>(
  node: DockLayoutNode<TTab>,
  options: MoveDockGroupOptions,
): DockLayoutNode<TTab> {
  if (options.sourceLeafId === options.targetLeafId) return node

  const source = findDockLeafById(node, options.sourceLeafId)
  if (source === null) return node

  const sourceLeaf: DockLeafNode<TTab> = {
    ...source.leaf,
    id: options.newLeafId ?? source.leaf.id,
    tabs: [...source.leaf.tabs],
  }

  const afterRemoval = removeDockLeafById(node, options.sourceLeafId)
  if (afterRemoval === null || findDockLeafById(afterRemoval, options.targetLeafId) === null) return node

  return insertDockLeafAt(afterRemoval, options.targetLeafId, sourceLeaf, options.edge)
}

export function computeDockDropEdge(
  point: DockPoint,
  rect: DockRect,
  threshold = 0.24,
): DockDropEdge {
  if (rect.width <= 0 || rect.height <= 0) return 'center'

  const x = clamp((point.x - rect.left) / rect.width, 0, 1)
  const y = clamp((point.y - rect.top) / rect.height, 0, 1)
  const distances: Array<[DockDropEdge, number]> = [
    ['left', x],
    ['right', 1 - x],
    ['top', y],
    ['bottom', 1 - y],
  ]

  const [edge, distance] = distances.reduce((best, current) => (current[1] < best[1] ? current : best))
  return distance <= threshold ? edge : 'center'
}

function removeDockTabFromLeaf<TTab extends string>(
  node: DockLayoutNode<TTab>,
  leafId: string,
  tab: TTab,
): DockLayoutNode<TTab> | null {
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
    .map((child) => removeDockTabFromLeaf(child, leafId, tab))
    .filter((child): child is DockLayoutNode<TTab> => child !== null)

  return collapseDockSplit({
    ...node,
    children,
    sizes: normalizeDockSizes(node.sizes, children.length),
  })
}

function collapseDockSplit<TTab extends string>(node: DockSplitNode<TTab>): DockLayoutNode<TTab> | null {
  if (node.children.length === 0) return null
  if (node.children.length === 1) return node.children[0]!
  return {
    ...node,
    sizes: normalizeDockSizes(node.sizes, node.children.length),
  }
}

function nextDockLeafId<TTab extends string>(node: DockLayoutNode<TTab>, label: string): string {
  const base = `${sanitizeId(label)}-leaf`
  let suffix = 1
  let candidate = base

  while (findDockLeafById(node, candidate) !== null) {
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
