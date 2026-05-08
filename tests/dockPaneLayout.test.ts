import { describe, expect, test } from 'bun:test'
import {
  computeDockDropEdge,
  findDockLeafById,
  findDockLeafOfTab,
  moveDockGroup,
  moveDockTab,
  normalizeDockSizes,
  setDockSplitSizesAtPath,
  type DockLayoutNode,
} from '../src/index'

type PanelId = 'part' | 'condition' | 'analysis' | 'result'

function baseLayout(): DockLayoutNode<PanelId> {
  return {
    type: 'split',
    dir: 'row',
    sizes: [0.5, 0.5],
    children: [
      {
        type: 'leaf',
        id: 'setup',
        tabs: ['part', 'condition'],
        activeTab: 'part',
      },
      {
        type: 'leaf',
        id: 'output',
        tabs: ['analysis', 'result'],
        activeTab: 'analysis',
      },
    ],
  }
}

describe('dock pane layout helpers', () => {
  test('normalizes split sizes', () => {
    expect(normalizeDockSizes([2, 1], 2)).toEqual([2 / 3, 1 / 3])
    expect(normalizeDockSizes(undefined, 3)).toEqual([1 / 3, 1 / 3, 1 / 3])
  })

  test('computes center and edge drop zones from rectangular coordinates', () => {
    const rect = { left: 0, top: 0, width: 100, height: 80 }

    expect(computeDockDropEdge({ x: 50, y: 40 }, rect)).toBe('center')
    expect(computeDockDropEdge({ x: 6, y: 40 }, rect)).toBe('left')
    expect(computeDockDropEdge({ x: 94, y: 40 }, rect)).toBe('right')
    expect(computeDockDropEdge({ x: 50, y: 5 }, rect)).toBe('top')
    expect(computeDockDropEdge({ x: 50, y: 76 }, rect)).toBe('bottom')
  })

  test('moves a tab into another pane as a merged tab', () => {
    const layout = moveDockTab(baseLayout(), {
      tab: 'condition',
      sourceLeafId: 'setup',
      targetLeafId: 'output',
      edge: 'center',
    })

    const setup = findDockLeafById(layout, 'setup')
    const output = findDockLeafById(layout, 'output')

    expect(setup?.leaf.tabs).toEqual(['part'])
    expect(output?.leaf.tabs).toEqual(['analysis', 'result', 'condition'])
    expect(output?.leaf.activeTab).toBe('condition')
  })

  test('moves a tab to an edge by creating a new leaf', () => {
    const layout = moveDockTab(baseLayout(), {
      tab: 'condition',
      sourceLeafId: 'setup',
      targetLeafId: 'output',
      edge: 'left',
      newLeafId: 'condition-leaf',
    })

    const condition = findDockLeafOfTab(layout, 'condition')
    const output = findDockLeafById(layout, 'output')

    expect(condition?.leaf.id).toBe('condition-leaf')
    expect(condition?.path).toEqual([1, 0])
    expect(output?.path).toEqual([1, 1])
  })

  test('moves a pane group into another leaf', () => {
    const layout = moveDockGroup(baseLayout(), {
      sourceLeafId: 'setup',
      targetLeafId: 'output',
      edge: 'center',
    })

    const output = findDockLeafById(layout, 'output')

    expect(output?.leaf.tabs).toEqual(['analysis', 'result', 'part', 'condition'])
    expect(output?.leaf.activeTab).toBe('part')
  })

  test('updates split sizes by path', () => {
    const layout = setDockSplitSizesAtPath(baseLayout(), [], [0.7, 0.3])

    expect(layout.type).toBe('split')
    if (layout.type === 'split') {
      expect(layout.sizes).toEqual([0.7, 0.3])
    }
  })
})
