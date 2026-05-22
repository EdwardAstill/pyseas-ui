import '../src/styles.css'

import { useEffect, useMemo, useState, type ReactNode } from 'react'

import styles from './App.module.css'
import {
  AppShell,
  Button,
  CadDxfViewer,
  CadStepViewer,
  Checkbox,
  Dialog,
  DrawingViewer,
  IconButton,
  IconSidebar,
  LogView,
  NumberField,
  PaneShell,
  Panel,
  Result,
  Select,
  StatusBadge,
  StatusBar,
  Tabs,
  TextField,
  ThemeProvider,
  Toggle,
  Toolbar,
  TopBar,
  Tree,
  Workspace,
  type LayoutNode,
  type ThemeName,
  type TreeDisclosureArgs,
  type TreeMoveArgs,
  type TreeNode,
  type TreeRenderArgs,
} from '../src/index'

type Theme = ThemeName
type InputTab = 'underline' | 'bracket' | 'slash'
type PaneRail = 'rail-a' | 'rail-b' | 'rail-c'
type PaneSection = 'section-a' | 'section-b'
type WorkspaceTab = 'panel-a' | 'panel-b' | 'panel-c' | 'panel-d'
type NavSectionId = 'theming' | 'controls' | 'data-display' | 'layout-components'
type FileSystemNodeMeta =
  | { kind: 'folder'; detail: string }
  | { kind: 'file'; detail: string }
type TreeVisualOption = 'blocks' | 'marks' | 'rail'

const appearanceOptions: Array<{ value: Theme; label: string }> = [
  { value: 'bun', label: 'Bun' },
  { value: 'default', label: 'Default' },
  { value: 'compact', label: 'Compact' },
]

const coloringOptions: Array<{ value: Theme; label: string }> = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'neon-pink', label: 'Neon Pink' },
  { value: 'cobalt', label: 'Cobalt' },
]

const selectOptions = [
  { value: 'alpha', label: 'Option alpha' },
  { value: 'beta', label: 'Option beta' },
  { value: 'gamma', label: 'Option gamma', disabled: true },
]

const treeVisualOptions: Array<{ value: TreeVisualOption; label: string }> = [
  { value: 'blocks', label: 'Blocks' },
  { value: 'marks', label: 'Plus / minus' },
  { value: 'rail', label: 'Rail' },
]

const navItems: Array<{ id: NavSectionId; label: string }> = [
  { id: 'theming', label: 'Themes' },
  { id: 'controls', label: 'Controls' },
  { id: 'data-display', label: 'Data' },
  { id: 'layout-components', label: 'Layout' },
]

const initialFileTreeNodes: TreeNode<FileSystemNodeMeta>[] = [
  {
    id: 'workspace',
    label: 'workspace',
    data: { kind: 'folder', detail: 'root' },
    children: [
      {
        id: 'src',
        label: 'src',
        data: { kind: 'folder', detail: 'folder' },
        children: [
          {
            id: 'src-components',
            label: 'components',
            data: { kind: 'folder', detail: 'folder' },
            children: [
              { id: 'src-components-tree', label: 'Tree.tsx', data: { kind: 'file', detail: 'tsx' } },
              { id: 'src-components-tree-css', label: 'Tree.module.css', data: { kind: 'file', detail: 'css' } },
              { id: 'src-components-panel', label: 'Panel.tsx', data: { kind: 'file', detail: 'tsx' } },
            ],
          },
          { id: 'src-index', label: 'index.ts', data: { kind: 'file', detail: 'ts' } },
          { id: 'src-styles', label: 'styles.css', data: { kind: 'file', detail: 'css' } },
        ],
      },
      {
        id: 'examples',
        label: 'examples',
        data: { kind: 'folder', detail: 'folder' },
        children: [
          { id: 'examples-app', label: 'App.tsx', data: { kind: 'file', detail: 'tsx' } },
          { id: 'examples-data', label: 'demoData.ts', data: { kind: 'file', detail: 'ts' } },
        ],
      },
      {
        id: 'tests',
        label: 'tests',
        data: { kind: 'folder', detail: 'folder' },
        children: [
          { id: 'tests-smoke', label: 'smoke.test.ts', data: { kind: 'file', detail: 'test' } },
          { id: 'tests-number', label: 'numberField.test.ts', data: { kind: 'file', detail: 'test' } },
        ],
      },
      { id: 'package-json', label: 'package.json', data: { kind: 'file', detail: 'json' } },
      { id: 'readme', label: 'README.md', data: { kind: 'file', detail: 'md' } },
    ],
  },
]

const workspaceLayout: LayoutNode<WorkspaceTab> = {
  type: 'split',
  dir: 'row',
  sizes: [0.34, 0.66],
  children: [
    { type: 'leaf', id: 'workspace-left', tabs: ['panel-a', 'panel-b'], activeTab: 'panel-a' },
    {
      type: 'split',
      dir: 'col',
      sizes: [0.58, 0.42],
      children: [
        { type: 'leaf', id: 'workspace-top', tabs: ['panel-c'], activeTab: 'panel-c' },
        { type: 'leaf', id: 'workspace-bottom', tabs: ['panel-d'], activeTab: 'panel-d' },
      ],
    },
  ],
}

const drawingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 160" role="img" aria-label="DrawingViewer sample">
  <rect x="28" y="42" width="204" height="76" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="96" cy="80" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="164" cy="80" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M52 132 H208" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="5 5"/>
  <path d="M96 34 V126 M164 34 V126" fill="none" stroke="currentColor" stroke-width="1"/>
  <text x="130" y="150" text-anchor="middle" font-size="10" font-family="monospace" fill="currentColor">DrawingSource.kind = svg</text>
</svg>`

const logLines = [
  '[info] component mounted',
  '[info] controlled value changed',
  '[warn] disabled option skipped',
  '[ok] render complete',
]

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ')
}

function renderFileTreeNode(
  { node, selected }: TreeRenderArgs<FileSystemNodeMeta>,
  visual: TreeVisualOption,
) {
  const kind = node.data?.kind ?? 'file'

  return (
    <span
      className={classNames(
        styles.fileTreeNode,
        selected && styles.fileTreeNodeSelected,
        visual === 'rail' && styles.fileTreeNodeRail,
      )}
    >
      <span
        className={classNames(
          styles.fileTreeIcon,
          kind === 'folder' ? styles.fileTreeFolderIcon : styles.fileTreeFileIcon,
        )}
        aria-hidden="true"
      />
      <span className={styles.fileTreeLabel}>{node.label}</span>
      <span className={styles.fileTreeDetail}>{node.data?.detail}</span>
    </span>
  )
}

function renderFileTreeDisclosure(
  { expanded, selected }: TreeDisclosureArgs<FileSystemNodeMeta>,
  visual: TreeVisualOption,
) {
  if (visual === 'marks') {
    return (
      <span
        className={classNames(
          styles.treeDisclosure,
          styles.treeDisclosureMark,
          expanded && styles.treeDisclosureMarkExpanded,
          selected && styles.treeDisclosureSelected,
        )}
        aria-hidden="true"
      >
        {expanded ? '−' : '+'}
      </span>
    )
  }

  if (visual === 'rail') {
    return (
      <span
        className={classNames(
          styles.treeDisclosure,
          styles.treeDisclosureRail,
          expanded && styles.treeDisclosureRailExpanded,
          selected && styles.treeDisclosureSelected,
        )}
        aria-hidden="true"
      />
    )
  }

  return (
    <span
      className={classNames(
        styles.treeDisclosure,
        styles.treeDisclosureBlock,
        expanded && styles.treeDisclosureBlockExpanded,
        selected && styles.treeDisclosureSelected,
      )}
      aria-hidden="true"
    />
  )
}

function canDropFileTreeNode({ position, targetNode }: TreeMoveArgs<FileSystemNodeMeta>) {
  return position !== 'inside' || targetNode.data?.kind === 'folder'
}

function moveFileTreeNode(
  nodes: TreeNode<FileSystemNodeMeta>[],
  args: TreeMoveArgs<FileSystemNodeMeta>,
) {
  const { nodes: withoutDragged, removed } = removeTreeNode(nodes, args.draggedId)
  if (removed === null) return nodes

  const { nodes: nextNodes, inserted } = insertTreeNode(
    withoutDragged,
    args.targetId,
    args.position,
    removed,
  )

  return inserted ? nextNodes : nodes
}

function removeTreeNode(
  nodes: TreeNode<FileSystemNodeMeta>[],
  id: string,
): { nodes: TreeNode<FileSystemNodeMeta>[]; removed: TreeNode<FileSystemNodeMeta> | null } {
  let removed: TreeNode<FileSystemNodeMeta> | null = null
  const nextNodes: TreeNode<FileSystemNodeMeta>[] = []

  for (const node of nodes) {
    if (node.id === id) {
      removed = node
      continue
    }

    if (node.children === undefined) {
      nextNodes.push(node)
      continue
    }

    const childResult = removeTreeNode(node.children, id)
    if (childResult.removed !== null) removed = childResult.removed
    nextNodes.push({ ...node, children: childResult.nodes })
  }

  return { nodes: nextNodes, removed }
}

function insertTreeNode(
  nodes: TreeNode<FileSystemNodeMeta>[],
  targetId: string,
  position: TreeMoveArgs<FileSystemNodeMeta>['position'],
  nodeToInsert: TreeNode<FileSystemNodeMeta>,
): { nodes: TreeNode<FileSystemNodeMeta>[]; inserted: boolean } {
  let inserted = false
  const nextNodes: TreeNode<FileSystemNodeMeta>[] = []

  for (const node of nodes) {
    if (node.id === targetId && position === 'before') {
      nextNodes.push(nodeToInsert)
      inserted = true
    }

    if (node.id === targetId && position === 'inside') {
      nextNodes.push({
        ...node,
        children: [...(node.children ?? []), nodeToInsert],
      })
      inserted = true
      continue
    }

    if (node.children === undefined) {
      nextNodes.push(node)
    } else {
      const childResult = insertTreeNode(node.children, targetId, position, nodeToInsert)
      if (childResult.inserted) inserted = true
      nextNodes.push({ ...node, children: childResult.nodes })
    }

    if (node.id === targetId && position === 'after') {
      nextNodes.push(nodeToInsert)
      inserted = true
    }
  }

  return { nodes: nextNodes, inserted }
}

const workspaceLabels: Record<WorkspaceTab, string> = {
  'panel-a': '<PaneShell>',
  'panel-b': '<Tabs>',
  'panel-c': '<DrawingViewer>',
  'panel-d': '<LogView>',
}

export function App() {
  const [theme, setTheme] = useState<Theme>('bun')
  const [coloring, setColoring] = useState<Theme>('neon-pink')
  const [textValue, setTextValue] = useState('Controlled text')
  const [numberValue, setNumberValue] = useState<number | null>(42)
  const [selectValue, setSelectValue] = useState<string | null>('beta')
  const [checked, setChecked] = useState(true)
  const [indeterminate, setIndeterminate] = useState(false)
  const [toggleValue, setToggleValue] = useState(true)
  const [inputTab, setInputTab] = useState<InputTab>('underline')
  const [paneRail, setPaneRail] = useState<PaneRail>('rail-a')
  const [paneSection, setPaneSection] = useState<PaneSection>('section-a')
  const [treeNodes, setTreeNodes] = useState<TreeNode<FileSystemNodeMeta>[]>(initialFileTreeNodes)
  const [treeExpanded, setTreeExpanded] = useState<Set<string>>(
    () => new Set(['workspace', 'src', 'src-components', 'examples', 'tests']),
  )
  const [treeSelected, setTreeSelected] = useState<string | null>('src-components-tree')
  const [treeVisual, setTreeVisual] = useState<TreeVisualOption>('blocks')
  const [sidebarItem, setSidebarItem] = useState('one')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<NavSectionId>('theming')

  useEffect(() => {
    function updateActiveSection() {
      const anchorY = window.scrollY + 140
      let nextSection: NavSectionId = navItems[0]!.id

      for (const item of navItems) {
        const section = document.getElementById(item.id)
        if (section !== null && section.offsetTop <= anchorY) nextSection = item.id
      }

      setActiveSection(nextSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
  }, [])

  const paneRailItems = useMemo(
    () => [
      { value: 'rail-a', label: 'Rail A' },
      { value: 'rail-b', label: 'Rail B' },
      { value: 'rail-c', label: 'Rail C', disabled: true },
    ],
    [],
  )
  const paneSectionItems = useMemo(
    () => [
      { value: 'section-a', label: 'Section A' },
      { value: 'section-b', label: 'Section B' },
    ],
    [],
  )

  function handleTreeMove(args: TreeMoveArgs<FileSystemNodeMeta>) {
    setTreeNodes((nodes) => moveFileTreeNode(nodes, args))
    setTreeSelected(args.draggedId)

    if (args.position === 'inside') {
      setTreeExpanded((expanded) => {
        const next = new Set(expanded)
        next.add(args.targetId)
        return next
      })
    }
  }

  function renderWorkspacePanel(tab: WorkspaceTab) {
    if (tab === 'panel-c') {
      return (
        <PaneShell flushBody>
          <DrawingViewer
            source={{ kind: 'svg', content: drawingSvg, label: '<DrawingViewer>' }}
            metadata="status=ready"
          />
        </PaneShell>
      )
    }

    if (tab === 'panel-d') {
      return (
        <PaneShell flushBody>
          <LogView lines={logLines} style={{ height: '100%', border: 0 }} />
        </PaneShell>
      )
    }

    return (
      <PaneShell>
        <div className={styles.specimenText}>
          {tab === 'panel-a' ? 'Workspace renderPanel: panel-a' : 'Workspace renderPanel: panel-b'}
        </div>
      </PaneShell>
    )
  }

  return (
    <ThemeProvider theme={theme} coloring={coloring}>
      <div className={styles.catalog}>
        <div className={styles.announcement}>pyseas-ui demo, tuned toward bun.com →</div>

        <header className={styles.header}>
          <a className={styles.brand} href="#" aria-label="pyseas-ui demo home">
            <span className={styles.bunMark} aria-hidden="true">ps</span>
            <span>pyseas-ui</span>
          </a>
          <nav className={classNames(styles.headerNav, navOpen && styles.headerNavOpen)} aria-label="Catalog sections">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={activeSection === item.id ? styles.headerNavLinkActive : undefined}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
                onClick={() => {
                  setActiveSection(item.id)
                  setNavOpen(false)
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <Toolbar>
            <button
              className={classNames(styles.hamburger, navOpen && styles.hamburgerOpen)}
              type="button"
              aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((open) => !open)}
            >
              <span className={styles.hamburgerBar} />
              <span className={styles.hamburgerBar} />
            </button>
          </Toolbar>
        </header>

        <section className={styles.hero} aria-labelledby="demo-title">
          <div className={styles.headerText}>
            <span className={styles.releasePill}>Bun theme for the demo →</span>
            <h1 id="demo-title" className={styles.title}>
              <span className={styles.titleCode}>bun demo</span>
              <span>component catalog</span>
            </h1>
            <p className={styles.summary}>
              Same exported pyseas-ui components, presented with a bun.com-style shell: charcoal
              surfaces, pink accents, rounded code panels, and dense developer-tool chrome.
            </p>
            <div className={styles.heroActions}>
              <Button
                variant="primary"
                onClick={() => document.getElementById('controls')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Browse components
              </Button>
              <Button onClick={() => document.getElementById('theming')?.scrollIntoView({ behavior: 'smooth' })}>
                Token packs
              </Button>
            </div>
            <div className={styles.installCard} aria-label="Demo command">
              <span className={styles.prompt}>$</span>
              <code>bun run demo</code>
              <span className={styles.copyGlyph} aria-hidden="true">⌘</span>
            </div>
            <p className={styles.heroFootnote}>Theme switcher stays available; the demo opens on the Bun pack by default.</p>
          </div>

          <aside className={styles.previewCard} aria-label="Bun-style component preview">
            <Tabs
              items={[
                { value: 'underline', label: 'Controls' },
                { value: 'bracket', label: 'Surfaces' },
                { value: 'slash', label: 'Layout' },
              ]}
              value={inputTab}
              onChange={(value) => setInputTab(value as InputTab)}
            />
            <div className={styles.previewBody}>
              <div className={styles.metricRows}>
                <div className={styles.metricRow}>
                  <span>Button</span>
                  <span className={styles.metricBarTrack}><span className={classNames(styles.metricBarFill, styles.metricBarFillSm)} /></span>
                  <code>24 px</code>
                </div>
                <div className={styles.metricRow}>
                  <span>Field</span>
                  <span className={styles.metricBarTrack}><span className={classNames(styles.metricBarFill, styles.metricBarFillMd)} /></span>
                  <code>30 px</code>
                </div>
                <div className={styles.metricRow}>
                  <span>Panel</span>
                  <span className={styles.metricBarTrack}><span className={classNames(styles.metricBarFill, styles.metricBarFillLg)} /></span>
                  <code>34 px</code>
                </div>
                <div className={styles.metricRow}>
                  <span>Workspace</span>
                  <span className={styles.metricBarTrack}><span className={classNames(styles.metricBarFill, styles.metricBarFillXl)} /></span>
                  <code>4 panes</code>
                </div>
              </div>
              <Result label="Reference fit" value={0.92} status="ok" ratio="bun.com-inspired" />
              <Toolbar>
                <StatusBadge variant="info" label={theme} />
                <Button size="sm" variant="primary">Primary</Button>
                <Button size="sm">Default</Button>
              </Toolbar>
            </div>
          </aside>
        </section>

        <main className={styles.sections}>
          <DocSection title="Theming">
            <ComponentBlock
              name="<ThemeProvider>"
              source="src/components/ThemeProvider.tsx"
              meta={`theme={appearance} coloring={color scheme} overrides={custom vars}`}
            >
              <div className={styles.themePickerLabel}>Appearance pack</div>
              <div className={styles.themeGrid}>
                {appearanceOptions.map((option) => (
                  <ThemeProvider key={option.value} theme={option.value} coloring={coloring}>
                    <button
                      type="button"
                      className={classNames(styles.themeSample, theme === option.value && styles.themeSampleActive)}
                      onClick={() => setTheme(option.value)}
                    >
                      <span className={styles.themeSampleTopline}>
                        <StatusBadge variant="info" label={option.label} />
                        <span className={styles.themeSampleTicks} aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      </span>
                      <span>{option.value}</span>
                    </button>
                  </ThemeProvider>
                ))}
              </div>
              <div className={classNames(styles.themePickerLabel, styles.themePickerLabelSpaced)}>
                Coloring scheme
              </div>
              <div className={styles.themeGrid}>
                {coloringOptions.map((option) => (
                  <ThemeProvider key={option.value} theme={theme} coloring={option.value}>
                    <button
                      type="button"
                      className={classNames(styles.coloringSample, coloring === option.value && styles.coloringSampleActive)}
                      onClick={() => setColoring(option.value)}
                    >
                      <span className={styles.coloringSwatch}>
                        <span className={styles.coloringDot} style={{ background: 'var(--ps-surface)' }} />
                        <span className={styles.coloringDot} style={{ background: 'var(--ps-accent)' }} />
                        <span className={styles.coloringDot} style={{ background: 'var(--ps-text-muted)' }} />
                      </span>
                      <span>{option.label}</span>
                    </button>
                  </ThemeProvider>
                ))}
              </div>
            </ComponentBlock>
          </DocSection>

          <DocSection title="Controls">
            <div className={styles.grid}>
              <ComponentBlock
                name="<Button>"
                source="src/components/Button.tsx"
                meta="variants: default | primary | danger | ghost; sizes: sm | md"
              >
                <div className={styles.wrapRow}>
                  <Button>Default</Button>
                  <Button variant="primary">Primary</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button size="sm">Small</Button>
                  <Button icon={<span>+</span>}>Icon</Button>
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </ComponentBlock>

              <ComponentBlock
                name="<IconButton>"
                source="src/components/IconButton.tsx"
                meta="icon-only Button variant; title is required"
              >
                <div className={styles.wrapRow}>
                  <IconButton title="Default icon button" icon={<span>A</span>} />
                  <IconButton title="Primary icon button" variant="primary" icon={<span>B</span>} />
                  <IconButton title="Danger icon button" variant="danger" icon={<span>C</span>} />
                  <IconButton title="Small icon button" size="sm" icon={<span>+</span>} />
                  <IconButton title="Loading icon button" loading icon={<span>L</span>} />
                  <IconButton title="Disabled icon button" disabled icon={<span>D</span>} />
                </div>
              </ComponentBlock>

              <ComponentBlock
                name="<Toolbar>"
                source="src/components/Toolbar.tsx"
                meta="horizontal control cluster"
              >
                <Toolbar>
                  <Button size="sm">One</Button>
                  <Button size="sm" variant="primary">Two</Button>
                  <IconButton title="Toolbar action" size="sm" icon={<span>+</span>} />
                  <StatusBadge variant="ok" label="ok" />
                </Toolbar>
              </ComponentBlock>

              <ComponentBlock
                name="<Tabs>"
                source="src/components/Tabs.tsx"
                meta="orientation: horizontal | vertical; marker: underline | bracket | slash"
              >
                <div className={styles.tabsGrid}>
                  <Tabs
                    items={[
                      { value: 'underline', label: 'Underline' },
                      { value: 'bracket', label: 'Bracket' },
                      { value: 'slash', label: 'Slash' },
                    ]}
                    value={inputTab}
                    onChange={(value) => setInputTab(value as InputTab)}
                  />
                  <Tabs
                    items={[
                      { value: 'underline', label: 'Underline' },
                      { value: 'bracket', label: 'Bracket' },
                      { value: 'slash', label: 'Slash' },
                    ]}
                    value={inputTab}
                    marker="slash"
                    onChange={(value) => setInputTab(value as InputTab)}
                  />
                  <div className={styles.verticalTabsFrame}>
                    <Tabs
                      items={[
                        { value: 'underline', label: 'Alpha' },
                        { value: 'bracket', label: 'Beta' },
                        { value: 'slash', label: 'Gamma', disabled: true },
                      ]}
                      value={inputTab}
                      orientation="vertical"
                      marker="bracket"
                      onChange={(value) => setInputTab(value as InputTab)}
                    />
                  </div>
                </div>
              </ComponentBlock>
            </div>
          </DocSection>

          <DocSection title="Fields">
            <ComponentBlock
              name="<TextField> / <NumberField> / <Select> / <Checkbox> / <Toggle>"
              source="src/components/FieldRoot.tsx"
              meta="shared field chrome, hints, error, read-only, disabled, and boolean states"
            >
              <div className={styles.fieldGrid}>
                <TextField
                  label="<TextField>"
                  hint="controlled string value"
                  value={textValue}
                  onChange={setTextValue}
                />
                <TextField
                  label="<TextField error>"
                  value="Invalid"
                  onChange={() => {}}
                  error
                />
                <TextField
                  label="<TextField readOnly>"
                  value="Read only"
                  onChange={() => {}}
                  readOnly
                />
                <NumberField
                  label="<NumberField>"
                  hint="number | null"
                  value={numberValue}
                  onChange={setNumberValue}
                  min={0}
                  step={1}
                />
                <NumberField
                  label="<NumberField empty>"
                  value={null}
                  onChange={() => {}}
                  placeholder="0"
                />
                <Select
                  label="<Select>"
                  options={selectOptions}
                  value={selectValue}
                  onChange={setSelectValue}
                  placeholder="Select option"
                />
                <div className={styles.controlStack}>
                  <Checkbox checked={checked} onChange={setChecked} label="<Checkbox checked>" />
                  <Checkbox checked={false} onChange={() => {}} label="<Checkbox disabled>" disabled />
                  <Checkbox
                    checked={false}
                    indeterminate={indeterminate}
                    onChange={(next) => {
                      setIndeterminate(false)
                      setChecked(next)
                    }}
                    label="<Checkbox indeterminate>"
                  />
                  <Button size="sm" variant="ghost" onClick={() => setIndeterminate((value) => !value)}>
                    Toggle indeterminate
                  </Button>
                </div>
                <div className={styles.controlStack}>
                  <Toggle value={toggleValue} onChange={setToggleValue} label="<Toggle md>" />
                  <Toggle value={!toggleValue} onChange={() => {}} label="<Toggle sm>" size="sm" />
                  <Toggle value={false} onChange={() => {}} label="<Toggle disabled>" disabled />
                </div>
              </div>
            </ComponentBlock>
          </DocSection>

          <DocSection title="Status and output">
            <div className={styles.grid}>
              <ComponentBlock
                name="<StatusBadge>"
                source="src/components/StatusBadge.tsx"
                meta="variants: ok | warn | err | info"
              >
                <div className={styles.wrapRow}>
                  <StatusBadge variant="ok" />
                  <StatusBadge variant="warn" />
                  <StatusBadge variant="err" />
                  <StatusBadge variant="info" />
                  <StatusBadge variant="info" label="custom label" />
                </div>
              </ComponentBlock>

              <ComponentBlock
                name="<Result>"
                source="src/components/Result.tsx"
                meta="label, value, unit, ratio, note, status"
              >
                <div className={styles.resultStack}>
                  <Result label="Result ok" value={0.72} status="ok" ratio="0.72 / 1.00" />
                  <Result label="Result warn" value={0.94} status="warn" ratio="0.94 / 1.00" note="note prop" />
                  <Result label="Result err" value="ERR" status="err" ratio="1.08 / 1.00" />
                  <Result label="Result none" value={120} unit="unit" />
                </div>
              </ComponentBlock>

              <ComponentBlock
                name="<LogView>"
                source="src/components/LogView.tsx"
                meta="streamed monospace lines; wrapLines optional"
              >
                <LogView lines={logLines} maxHeight={160} />
              </ComponentBlock>
            </div>
          </DocSection>

          <DocSection title="Data display">
            <div className={styles.grid}>
              <ComponentBlock
                name="<Tree>"
                source="src/components/Tree.tsx"
                meta="controlled filesystem mockup with drag-to-move"
              >
                <div className={styles.treeVisualPanel} aria-label="Tree visual options">
                  {treeVisualOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={classNames(
                        styles.treeVisualOption,
                        treeVisual === option.value && styles.treeVisualOptionActive,
                      )}
                      onClick={() => setTreeVisual(option.value)}
                    >
                      <span className={styles.treeVisualPreview} aria-hidden="true">
                        <span className={styles.treeVisualPreviewLine}>
                          {renderFileTreeDisclosure({
                            node: initialFileTreeNodes[0]!,
                            depth: 0,
                            expanded: true,
                            selected: false,
                            disabled: false,
                          }, option.value)}
                          <span className={styles.treeVisualPreviewFolder} />
                          <span className={styles.treeVisualPreviewText} />
                        </span>
                        <span className={styles.treeVisualPreviewLine}>
                          <span className={styles.treeVisualPreviewIndent} />
                          <span className={styles.treeVisualPreviewSpacer} />
                          <span className={styles.treeVisualPreviewFile} />
                          <span className={styles.treeVisualPreviewTextShort} />
                        </span>
                      </span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
                <div className={styles.fileTreeFrame}>
                  <Tree
                    nodes={treeNodes}
                    expanded={treeExpanded}
                    onExpandedChange={setTreeExpanded}
                    selected={treeSelected}
                    onSelect={(id) => setTreeSelected(id)}
                    onMove={handleTreeMove}
                    canDrop={canDropFileTreeNode}
                    renderDisclosure={(args) => renderFileTreeDisclosure(args, treeVisual)}
                    renderNode={(args) => renderFileTreeNode(args, treeVisual)}
                    aria-label="Filesystem Tree specimen"
                  />
                </div>
              </ComponentBlock>

              <ComponentBlock
                name="<DrawingViewer>"
                source="src/components/DrawingViewer.tsx"
                meta="DrawingSource: svg | svg-url | image"
              >
                <div className={styles.viewerFrame}>
                  <DrawingViewer
                    source={{ kind: 'svg', content: drawingSvg, label: '<DrawingViewer>' }}
                    metadata="inline svg"
                    download={{ href: '#', label: 'download' }}
                  />
                </div>
              </ComponentBlock>

              <ComponentBlock
                name="<CadDxfViewer> / <CadStepViewer>"
                source="src/components/CadViewer.tsx"
                meta="CAD frames for DXF and STEP states"
              >
                <div className={styles.cadGrid}>
                  <CadDxfViewer
                    status="idle"
                    title="<CadDxfViewer>"
                    metadata="status=idle"
                    style={{ height: 190 }}
                  />
                  <CadStepViewer
                    status="error"
                    error="error prop"
                    title="<CadStepViewer>"
                    metadata="status=error"
                    style={{ height: 190 }}
                  />
                </div>
              </ComponentBlock>
            </div>
          </DocSection>

          <DocSection title="Surfaces">
            <div className={styles.grid}>
              <ComponentBlock
                name="<Panel>"
                source="src/components/Panel.tsx"
                meta="title bar, headerActions slot, body slot"
              >
                <Panel
                  title="<Panel>"
                  headerActions={
                    <Toolbar>
                      <StatusBadge variant="info" label="slot" />
                      <IconButton title="Panel action" size="sm" icon={<span>+</span>} />
                    </Toolbar>
                  }
                >
                  <div className={styles.panelBodySpecimen}>
                    Panel children render inside the body slot.
                  </div>
                </Panel>
              </ComponentBlock>

              <ComponentBlock
                name="<PaneShell>"
                source="src/components/PaneShell.tsx"
                meta="rail, section, sectionOptions, body"
              >
                <div className={styles.paneFrame}>
                  <PaneShell
                    rail={{
                      items: paneRailItems,
                      value: paneRail,
                      onChange: (value) => setPaneRail(value as PaneRail),
                    }}
                    section={{
                      items: paneSectionItems,
                      value: paneSection,
                      onChange: (value) => setPaneSection(value as PaneSection),
                    }}
                    sectionOptions={
                      <Toolbar>
                        <Button size="sm">Option</Button>
                      </Toolbar>
                    }
                    railResizable={false}
                  >
                    <div className={styles.specimenText}>
                      PaneShell body. Rail and section tabs are rendered by PaneShell.
                    </div>
                  </PaneShell>
                </div>
              </ComponentBlock>
            </div>
          </DocSection>

          <DocSection title="Layout components">
            <ComponentBlock
              name="<AppShell> / <TopBar> / <IconSidebar> / <StatusBar>"
              source="src/components/AppShell.tsx"
              meta="four exported shell components rendered as one specimen"
            >
              <div className={styles.appShellFrame}>
                <AppShell
                  topbar={
                    <TopBar
                      title="<TopBar>"
                      subtitle="topbar slot"
                      right={
                        <Toolbar>
                          <Button size="sm">Action</Button>
                        </Toolbar>
                      }
                    />
                  }
                  sidebar={
                    <IconSidebar
                      brand={<span className={styles.sidebarBrand}>UI</span>}
                      items={[
                        { id: 'one', label: 'One', icon: <span>1</span> },
                        { id: 'two', label: 'Two', icon: <span>2</span> },
                        { id: 'three', label: 'Three disabled', icon: <span>3</span>, disabled: true },
                      ]}
                      footerItems={[{ id: 'four', label: 'Four', icon: <span>4</span> }]}
                      activeItem={sidebarItem}
                      onItemSelect={setSidebarItem}
                    />
                  }
                  statusbar={
                    <StatusBar
                      left={
                        <Toolbar>
                          <StatusBadge variant="ok" label="<StatusBar>" />
                        </Toolbar>
                      }
                      right="right slot"
                    />
                  }
                >
                  <div className={styles.appShellContent}>AppShell children slot</div>
                </AppShell>
              </div>
            </ComponentBlock>

            <div className={styles.layoutGrid}>
              <ComponentBlock
                name="<Workspace>"
                source="src/components/Workspace.tsx"
                meta="draggable tabbed pane tree"
              >
                <div className={styles.workspaceFrame}>
                  <Workspace
                    defaultLayout={workspaceLayout}
                    renderPanel={renderWorkspacePanel}
                    renderTabLabel={(tab) => workspaceLabels[tab]}
                    renderToolbar={(_activeTab, leaf) => (
                      <Toolbar>
                        <StatusBadge variant="info" label={leaf.id} />
                      </Toolbar>
                    )}
                    aria-label="Workspace specimen"
                  />
                </div>
              </ComponentBlock>
            </div>
          </DocSection>

          <DocSection title="Overlays">
            <div className={styles.grid}>
              <ComponentBlock
                name="<Dialog>"
                source="src/components/Dialog.tsx"
                meta="portal overlay with title, body, footer, close action"
              >
                <div className={styles.wrapRow}>
                  <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                  <StatusBadge variant="info" label="open=false by default" />
                </div>
                <Dialog
                  open={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  title="<Dialog>"
                  titleActions={<StatusBadge variant="ok" label="titleActions" />}
                  footer={
                    <Toolbar>
                      <Button size="sm" variant="ghost" onClick={() => setDialogOpen(false)}>
                        Close
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => setDialogOpen(false)}>
                        Confirm
                      </Button>
                    </Toolbar>
                  }
                >
                  <div className={styles.specimenText}>Dialog children render in the body slot.</div>
                </Dialog>
              </ComponentBlock>
            </div>
          </DocSection>
        </main>
      </div>
    </ThemeProvider>
  )
}

interface DocSectionProps {
  title: string
  children: ReactNode
}

function sectionIdFromTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function sourceLabelFromPath(source: string) {
  return source.split('/').pop() ?? source
}

function DocSection({ title, children }: DocSectionProps) {
  return (
    <section id={sectionIdFromTitle(title)} className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

interface ComponentBlockProps {
  name: string
  source: string
  meta: string
  children: ReactNode
}

function ComponentBlock({ name, source, meta, children }: ComponentBlockProps) {
  return (
    <article className={styles.componentBlock}>
      <div className={styles.componentHeader}>
        <div>
          <h3 className={styles.componentName}>{name}</h3>
          <p className={styles.componentMeta}>{meta}</p>
        </div>
        <code className={styles.componentSource} title={source}>{sourceLabelFromPath(source)}</code>
      </div>
      <div className={styles.componentBody}>{children}</div>
    </article>
  )
}
