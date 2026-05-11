import '../src/styles.css'
import { useState, useEffect } from 'react'
import {
  ThemeProvider,
  DockAppShell,
  DockIconSidebar,
  DockPaneWorkspace,
  DockStatusBar,
  DockTopBar,
  Panel,
  Tabs,
  Toolbar,
  Button,
  TextField,
  NumberField,
  Select,
  StatusBadge,
  LogView,
  type DockLayoutNode,
} from '../src/index'
import { STANDARDS, CONDITIONS, MATERIAL_OPTIONS, DEMO_LOG_LINES } from './demoData'
import { DemoRail } from './DemoRail'
import { DemoDiagram } from './DemoDiagram'
import { DemoResults } from './DemoResults'

const THEME_KEY = 'pyseas-ui-showcase-theme'

type DemoPanel = 'items' | 'setup' | 'diagram' | 'analysis' | 'results' | 'log'

const defaultLayout: DockLayoutNode<DemoPanel> = {
  type: 'split',
  dir: 'row',
  sizes: [0.24, 0.48, 0.28],
  children: [
    { type: 'leaf', id: 'left-leaf', tabs: ['items', 'setup'], activeTab: 'setup' },
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
  const [analysisTab, setAnalysisTab] = useState('standard')
  const [partName, setPartName] = useState('Part A')
  const [thickness, setThickness] = useState<number | null>(25)
  const [width, setWidth] = useState<number | null>(300)
  const [material, setMaterial] = useState<string | null>('mat-a')
  const [standard, setStandard] = useState<string | null>('std-a')
  const [condition, setCondition] = useState<string | null>('cond-1')
  const [running, setRunning] = useState(false)
  const [logLines, setLogLines] = useState<string[]>([])
  const [layoutKey, setLayoutKey] = useState(0)

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

  function renderPanel(panel: DemoPanel) {
    switch (panel) {
      case 'items':
        return (
          <Panel style={{ height: '100%' }}>
            <DemoRail selected={selectedPart} onSelect={setSelectedPart} />
          </Panel>
        )
      case 'setup':
        return (
          <Panel style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Tabs
                items={[
                  { value: 'geometry', label: 'Geometry' },
                  { value: 'material', label: 'Material' },
                  { value: 'loading', label: 'Loading' },
                ]}
                value={setupTab}
                onChange={setSetupTab}
              />
              <div style={panelStackStyle}>
                {setupTab === 'geometry' && (
                  <>
                    <TextField value={partName} onChange={setPartName} label="Item name" />
                    <NumberField value={thickness} onChange={setThickness} label="Thickness (mm)" min={1} step={1} />
                    <NumberField value={width} onChange={setWidth} label="Width (mm)" min={10} step={5} />
                  </>
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
            </div>
          </Panel>
        )
      case 'diagram':
        return (
          <Panel style={{ height: '100%' }}>
            <DemoDiagram />
          </Panel>
        )
      case 'analysis':
        return (
          <Panel style={{ height: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Tabs
                items={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'conditions', label: 'Conditions' },
                ]}
                value={analysisTab}
                onChange={setAnalysisTab}
              />
              <div style={panelStackStyle}>
                {analysisTab === 'standard' && (
                  <Select options={STANDARDS} value={standard} onChange={setStandard} label="Standard" placeholder="Select…" />
                )}
                {analysisTab === 'conditions' && (
                  <Select options={CONDITIONS} value={condition} onChange={setCondition} label="Condition" placeholder="Select…" />
                )}
              </div>
            </div>
          </Panel>
        )
      case 'results':
        return (
          <Panel style={{ height: '100%' }}>
            <DemoResults logLines={logLines} />
          </Panel>
        )
      case 'log':
        return (
          <Panel style={{ height: '100%' }}>
            <LogView lines={logLines} wrapLines={false} />
          </Panel>
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
        <DockAppShell
          topbar={
            <DockTopBar
              title="Workbench"
              subtitle="dock showcase"
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
            <DockIconSidebar
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
            <DockStatusBar
              left={
                <Toolbar>
                  <StatusBadge variant="info" label="DOCK" />
                  <span>{panelLabels.setup}</span>
                  <span>{panelLabels.diagram}</span>
                  <span>{panelLabels.results}</span>
                </Toolbar>
              }
              right={running ? 'running' : 'ready'}
            />
          }
        >
          <DockPaneWorkspace
            key={layoutKey}
            defaultLayout={defaultLayout}
            minPaneSize={180}
            renderPanel={renderPanel}
            renderTabLabel={(panel) => panelLabels[panel]}
            aria-label="Demo dock workspace"
          />
        </DockAppShell>
      </div>
    </ThemeProvider>
  )
}

const panelStackStyle = {
  padding: 'var(--ps-space-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--ps-space-sm)',
  overflow: 'auto',
} satisfies React.CSSProperties
