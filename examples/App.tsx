import '../src/styles.css'
import { useState, useEffect } from 'react'
import {
  ThemeProvider,
  AppShell,
  IconSidebar,
  PaneShell,
  Workspace,
  StatusBar,
  TopBar,
  Toolbar,
  Button,
  TextField,
  NumberField,
  Select,
  StatusBadge,
  LogView,
  Tree,
  type LayoutNode,
  type TreeNode,
} from '../src/index'
import { STANDARDS, CONDITIONS, MATERIAL_OPTIONS, DEMO_LOG_LINES } from './demoData'
import { DemoRail } from './DemoRail'
import { DEMO_TREE } from './demoData'
import { DemoDiagram } from './DemoDiagram'
import { DemoResults, type DemoResultsView } from './DemoResults'

const THEME_KEY = 'pyseas-ui-showcase-theme'

type DemoPanel = 'items' | 'setup' | 'diagram' | 'analysis' | 'results' | 'log'

const defaultLayout: LayoutNode<DemoPanel> = {
  type: 'split',
  dir: 'row',
  sizes: [0.24, 0.48, 0.28],
  children: [
    { type: 'leaf', id: 'left-leaf', tabs: ['items', 'setup'], activeTab: 'items' },
    {
      type: 'split',
      dir: 'col',
      sizes: [0.68, 0.32],
      children: [
        { type: 'leaf', id: 'drawing-leaf', tabs: ['diagram'], activeTab: 'diagram' },
        { type: 'leaf', id: 'log-leaf', tabs: ['log'], activeTab: 'log' },
      ],
    },
    { type: 'leaf', id: 'right-leaf', tabs: ['analysis', 'results'], activeTab: 'results' },
  ],
}

const panelLabels: Record<DemoPanel, string> = {
  items: 'Items',
  setup: 'Setup',
  diagram: 'Diagram',
  analysis: 'Analysis',
  results: 'Results',
  log: 'Log',
}

export function App() {
  const stored =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null)
      : null
  const [theme, setTheme] = useState<'dark' | 'light'>(stored ?? 'dark')
  const [selectedPart, setSelectedPart] = useState('part-a')
  const [setupTab, setSetupTab] = useState('geometry')
  const [geometrySection, setGeometrySection] = useState('plate')
  const [analysisTab, setAnalysisTab] = useState('standard')
  const [resultsView, setResultsView] = useState<DemoResultsView>('summary')
  const [partName, setPartName] = useState('Part A')
  const [thickness, setThickness] = useState<number | null>(25)
  const [width, setWidth] = useState<number | null>(300)
  const [material, setMaterial] = useState<string | null>('mat-a')
  const [standard, setStandard] = useState<string | null>('std-a')
  const [condition, setCondition] = useState<string | null>('cond-1')
  const [running, setRunning] = useState(false)
  const [logLines, setLogLines] = useState<string[]>([])
  const [layoutKey, setLayoutKey] = useState(0)
  const [treeExpanded, setTreeExpanded] = useState<Set<string>>(
    () => new Set(['project', 'structures', 'rigging']),
  )
  const [treeSelected, setTreeSelected] = useState<string | null>('padeye-b')

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  function handleRun() {
    setRunning(true)
    setLogLines([])
    let i = 0
    const interval = setInterval(() => {
      const line = DEMO_LOG_LINES[i]
      if (line !== undefined) setLogLines((prev) => [...prev, line])
      i++
      if (i >= DEMO_LOG_LINES.length) {
        clearInterval(interval)
        setRunning(false)
      }
    }, 150)
  }

  function renderSetup() {
    return (
      <PaneShell
        rail={{
          items: [
            { value: 'geometry', label: 'Geometry' },
            { value: 'material', label: 'Material' },
            { value: 'loading', label: 'Loading' },
          ],
          value: setupTab,
          onChange: setSetupTab,
        }}
        section={
          setupTab === 'geometry'
            ? {
                items: [
                  { value: 'plate', label: 'Plate' },
                  { value: 'hole', label: 'Hole' },
                  { value: 'edge', label: 'Edge' },
                ],
                value: geometrySection,
                onChange: setGeometrySection,
              }
            : undefined
        }
      >
        <div style={formStackStyle}>
          {setupTab === 'geometry' && geometrySection === 'plate' && (
            <>
              <TextField value={partName} onChange={setPartName} label="Item name" />
              <NumberField value={thickness} onChange={setThickness} label="Thickness (mm)" min={1} step={1} />
              <NumberField value={width} onChange={setWidth} label="Width (mm)" min={10} step={5} />
            </>
          )}
          {setupTab === 'geometry' && geometrySection === 'hole' && (
            <>
              <NumberField value={null} onChange={() => {}} label="Hole diameter (mm)" min={1} step={1} />
              <NumberField value={null} onChange={() => {}} label="Edge distance (mm)" min={1} step={1} />
            </>
          )}
          {setupTab === 'geometry' && geometrySection === 'edge' && (
            <NumberField value={null} onChange={() => {}} label="Edge radius (mm)" min={1} step={1} />
          )}
          {setupTab === 'material' && (
            <Select options={MATERIAL_OPTIONS} value={material} onChange={setMaterial} label="Material grade" placeholder="Select…" />
          )}
          {setupTab === 'loading' && (
            <>
              <NumberField value={null} onChange={() => {}} label="Applied value" placeholder="0.00" />
              <NumberField value={null} onChange={() => {}} label="Scale factor" placeholder="1.00" step={0.05} />
            </>
          )}
        </div>
      </PaneShell>
    )
  }

  function renderAnalysis() {
    return (
      <PaneShell
        rail={{
          items: [
            { value: 'standard', label: 'Standard' },
            { value: 'conditions', label: 'Conditions' },
          ],
          value: analysisTab,
          onChange: setAnalysisTab,
        }}
      >
        <div style={formStackStyle}>
          {analysisTab === 'standard' && (
            <Select options={STANDARDS} value={standard} onChange={setStandard} label="Standard" placeholder="Select…" />
          )}
          {analysisTab === 'conditions' && (
            <Select options={CONDITIONS} value={condition} onChange={setCondition} label="Condition" placeholder="Select…" />
          )}
        </div>
      </PaneShell>
    )
  }

  function renderPanel(panel: DemoPanel) {
    switch (panel) {
      case 'items':
        return (
          <PaneShell flushBody>
            <div style={{ height: '100%', overflow: 'auto' }}>
              <Tree
                nodes={DEMO_TREE as unknown as TreeNode[]}
                expanded={treeExpanded}
                onExpandedChange={setTreeExpanded}
                selected={treeSelected}
                onSelect={(id) => setTreeSelected(id)}
                aria-label="Project tree"
              />
              <div style={{ borderTop: '1px solid var(--ps-border)', marginTop: 'var(--ps-space-sm)' }}>
                <DemoRail selected={selectedPart} onSelect={setSelectedPart} />
              </div>
            </div>
          </PaneShell>
        )
      case 'setup':
        return renderSetup()
      case 'diagram':
        return (
          <PaneShell flushBody>
            <DemoDiagram />
          </PaneShell>
        )
      case 'analysis':
        return renderAnalysis()
      case 'results':
        return (
          <PaneShell
            flushBody
            section={{
              items: [
                { value: 'summary', label: 'Summary' },
                { value: 'log', label: 'Log' },
              ],
              value: resultsView,
              onChange: (v) => setResultsView(v as DemoResultsView),
            }}
          >
            <DemoResults view={resultsView} logLines={logLines} />
          </PaneShell>
        )
      case 'log':
        return (
          <PaneShell flushBody>
            <LogView lines={logLines} wrapLines={false} style={{ height: '100%', border: 0, background: 'transparent' }} />
          </PaneShell>
        )
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: '100vh',
          background: 'var(--ps-surface)',
          color: 'var(--ps-text)',
          fontFamily: 'var(--ps-font-mono)',
          fontSize: 'var(--ps-text-sm)',
          overflow: 'hidden',
        }}
      >
        <AppShell
          topbar={
            <TopBar
              title="Workbench"
              subtitle="workspace showcase"
              right={
                <Toolbar>
                  <Button variant="primary" size="sm" loading={running} onClick={handleRun}>
                    {running ? 'Running…' : 'Run'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setLayoutKey((value) => value + 1)}>
                    Reset layout
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {theme === 'dark' ? 'Light' : 'Dark'}
                  </Button>
                </Toolbar>
              }
            />
          }
          sidebar={
            <IconSidebar
              activeItem={selectedPart}
              brand={<span style={{ fontSize: 13, fontWeight: 700 }}>PS</span>}
              items={[
                { id: 'part-a', label: 'Item A', icon: <span aria-hidden="true">A</span> },
                { id: 'part-b', label: 'Item B', icon: <span aria-hidden="true">B</span> },
                { id: 'part-c', label: 'Item C', icon: <span aria-hidden="true">C</span> },
              ]}
              onItemSelect={setSelectedPart}
            />
          }
          statusbar={
            <StatusBar
              left={
                <Toolbar>
                  <StatusBadge variant="info" label="DEMO" />
                  <span>{panelLabels.setup}</span>
                  <span>{panelLabels.diagram}</span>
                  <span>{panelLabels.results}</span>
                </Toolbar>
              }
              right={running ? 'running' : 'ready'}
            />
          }
        >
          <Workspace
            key={layoutKey}
            defaultLayout={defaultLayout}
            minPaneSize={180}
            renderPanel={renderPanel}
            renderTabLabel={(panel) => panelLabels[panel]}
            aria-label="Demo workspace"
          />
        </AppShell>
      </div>
    </ThemeProvider>
  )
}

const formStackStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}
