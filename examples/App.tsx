import '../src/styles.css'
import { useState, useEffect } from 'react'
import {
  ThemeProvider,
  WorkbenchLayout,
  Panel,
  Tabs,
  Toolbar,
  Button,
  TextField,
  NumberField,
  Select,
} from '../src/index'
import { STANDARDS, CONDITIONS, MATERIAL_OPTIONS, DEMO_LOG_LINES } from './demoData'
import { DemoRail } from './DemoRail'
import { DemoDiagram } from './DemoDiagram'
import { DemoResults } from './DemoResults'

const THEME_KEY = 'pyseas-ui-showcase-theme'

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

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--ps-surface)',
          color: 'var(--ps-text)',
          fontFamily: 'var(--ps-font-mono)',
          fontSize: 'var(--ps-text-sm)',
          overflow: 'hidden',
        }}
      >
        {/* Top toolbar */}
        <div style={{ borderBottom: '1px solid var(--ps-border)', background: 'var(--ps-panel)', flexShrink: 0 }}>
          <Toolbar style={{ padding: '0 var(--ps-space-md)', height: 40, alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--ps-text-md)', fontWeight: 700, marginRight: 'var(--ps-space-md)' }}>
              Workbench
            </span>
            <Button variant="primary" size="sm" loading={running} onClick={handleRun}>
              {running ? 'Running…' : 'Run'}
            </Button>
            <div style={{ flex: 1 }} />
            <Button size="sm" variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </Toolbar>
        </div>

        {/* Workbench */}
        <div style={{ flex: 1, minHeight: 0 }}>
          <WorkbenchLayout
            railWidth={180}
            columnSplit={0.4}
            rowSplit={0.55}
            rail={<DemoRail selected={selectedPart} onSelect={setSelectedPart} />}
            setupPanel={
              <Panel title="Setup" style={{ height: '100%' }}>
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
                  <div style={{ padding: 'var(--ps-space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--ps-space-sm)', overflow: 'auto' }}>
                    {setupTab === 'geometry' && (
                      <>
                        <TextField value={partName} onChange={setPartName} label="Part name" />
                        <NumberField value={thickness} onChange={setThickness} label="Thickness (mm)" min={1} step={1} />
                        <NumberField value={width} onChange={setWidth} label="Width (mm)" min={10} step={5} />
                      </>
                    )}
                    {setupTab === 'material' && (
                      <Select options={MATERIAL_OPTIONS} value={material} onChange={setMaterial} label="Material grade" placeholder="Select…" />
                    )}
                    {setupTab === 'loading' && (
                      <>
                        <NumberField value={null} onChange={() => {}} label="Applied load (kN)" placeholder="0.00" />
                        <NumberField value={null} onChange={() => {}} label="Dynamic factor" placeholder="1.00" step={0.05} />
                      </>
                    )}
                  </div>
                </div>
              </Panel>
            }
            diagramPanel={
              <Panel title="Diagram" style={{ height: '100%' }}>
                <DemoDiagram />
              </Panel>
            }
            analysisPanel={
              <Panel title="Analysis" style={{ height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Tabs
                    items={[
                      { value: 'standard', label: 'Standard' },
                      { value: 'conditions', label: 'Conditions' },
                    ]}
                    value={analysisTab}
                    onChange={setAnalysisTab}
                  />
                  <div style={{ padding: 'var(--ps-space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--ps-space-sm)', overflow: 'auto' }}>
                    {analysisTab === 'standard' && (
                      <Select options={STANDARDS} value={standard} onChange={setStandard} label="Standard" placeholder="Select…" />
                    )}
                    {analysisTab === 'conditions' && (
                      <Select options={CONDITIONS} value={condition} onChange={setCondition} label="Condition" placeholder="Select…" />
                    )}
                  </div>
                </div>
              </Panel>
            }
            resultsPanel={
              <Panel title="Results" style={{ height: '100%' }}>
                <DemoResults logLines={logLines} />
              </Panel>
            }
          />
        </div>
      </div>
    </ThemeProvider>
  )
}
