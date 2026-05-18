import '../src/styles.css'

import { useMemo, useState, type ReactNode } from 'react'

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
  Modal,
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
  WorkbenchLayout,
  Workspace,
  type LayoutNode,
  type TreeNode,
} from '../src/index'

type Theme = 'dark' | 'light'
type InputTab = 'underline' | 'bracket' | 'slash'
type PaneRail = 'rail-a' | 'rail-b' | 'rail-c'
type PaneSection = 'section-a' | 'section-b'
type WorkspaceTab = 'panel-a' | 'panel-b' | 'panel-c' | 'panel-d'

const selectOptions = [
  { value: 'alpha', label: 'Option alpha' },
  { value: 'beta', label: 'Option beta' },
  { value: 'gamma', label: 'Option gamma', disabled: true },
]

const treeNodes: TreeNode[] = [
  {
    id: 'root',
    label: 'Root node',
    trailing: '3',
    children: [
      {
        id: 'group-a',
        label: 'Group node',
        trailing: '2',
        children: [
          { id: 'item-a', label: 'Leaf node A', trailing: 'ready' },
          { id: 'item-b', label: 'Leaf node B', trailing: 'locked', disabled: true },
        ],
      },
      { id: 'item-c', label: 'Leaf node C', trailing: 'idle' },
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

const workspaceLabels: Record<WorkspaceTab, string> = {
  'panel-a': '<PaneShell>',
  'panel-b': '<Tabs>',
  'panel-c': '<DrawingViewer>',
  'panel-d': '<LogView>',
}

export function App() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [textValue, setTextValue] = useState('Controlled text')
  const [numberValue, setNumberValue] = useState<number | null>(42)
  const [selectValue, setSelectValue] = useState<string | null>('beta')
  const [checked, setChecked] = useState(true)
  const [indeterminate, setIndeterminate] = useState(false)
  const [toggleValue, setToggleValue] = useState(true)
  const [inputTab, setInputTab] = useState<InputTab>('underline')
  const [paneRail, setPaneRail] = useState<PaneRail>('rail-a')
  const [paneSection, setPaneSection] = useState<PaneSection>('section-a')
  const [treeExpanded, setTreeExpanded] = useState<Set<string>>(
    () => new Set(['root', 'group-a']),
  )
  const [treeSelected, setTreeSelected] = useState<string | null>('item-a')
  const [sidebarItem, setSidebarItem] = useState('one')
  const [modalOpen, setModalOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

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
    <ThemeProvider theme={theme}>
      <div className={styles.catalog}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.packageName}>pyseas-ui</span>
            <h1 className={styles.title}>Component catalog</h1>
            <p className={styles.summary}>
              Public UI exports rendered as documentation specimens, not as an application screen.
            </p>
          </div>
          <Toolbar>
            <Button
              size="sm"
              variant={theme === 'dark' ? 'primary' : 'default'}
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            <Button
              size="sm"
              variant={theme === 'light' ? 'primary' : 'default'}
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
          </Toolbar>
        </header>

        <main className={styles.sections}>
          <DocSection title="Theming">
            <ComponentBlock
              name="<ThemeProvider>"
              source="src/components/ThemeProvider.tsx"
              meta="ThemeProviderProps.theme: dark | light"
            >
              <div className={styles.themeGrid}>
                <ThemeProvider theme="dark">
                  <div className={styles.themeSample}>
                    <StatusBadge variant="info" label="dark" />
                    <span>data-theme=&quot;dark&quot;</span>
                  </div>
                </ThemeProvider>
                <ThemeProvider theme="light">
                  <div className={styles.themeSample}>
                    <StatusBadge variant="info" label="light" />
                    <span>data-theme=&quot;light&quot;</span>
                  </div>
                </ThemeProvider>
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
                meta="controlled expanded set and selected id"
              >
                <Tree
                  nodes={treeNodes}
                  expanded={treeExpanded}
                  onExpandedChange={setTreeExpanded}
                  selected={treeSelected}
                  onSelect={(id) => setTreeSelected(id)}
                  aria-label="Component Tree specimen"
                />
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
                name="<WorkbenchLayout>"
                source="src/components/WorkbenchLayout.tsx"
                meta="rail plus four fixed content slots"
              >
                <div className={styles.workbenchFrame}>
                  <WorkbenchLayout
                    rail={<SpecimenSlot label="rail" />}
                    setupPanel={<SpecimenSlot label="setupPanel" />}
                    diagramPanel={<SpecimenSlot label="diagramPanel" />}
                    analysisPanel={<SpecimenSlot label="analysisPanel" />}
                    resultsPanel={<SpecimenSlot label="resultsPanel" />}
                    railWidth={112}
                    columnSplit={0.46}
                    rowSplit={0.54}
                  />
                </div>
              </ComponentBlock>

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
                name="<Modal>"
                source="src/components/Modal.tsx"
                meta="portal overlay with title, body, footer, close action"
              >
                <div className={styles.wrapRow}>
                  <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                  <StatusBadge variant="info" label="open=false by default" />
                </div>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  title="<Modal>"
                  titleActions={<StatusBadge variant="ok" label="titleActions" />}
                  footer={
                    <Toolbar>
                      <Button size="sm" variant="ghost" onClick={() => setModalOpen(false)}>
                        Close
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => setModalOpen(false)}>
                        Confirm
                      </Button>
                    </Toolbar>
                  }
                >
                  <div className={styles.specimenText}>Modal children render in the body slot.</div>
                </Modal>
              </ComponentBlock>

              <ComponentBlock
                name="<Dialog>"
                source="src/components/Modal.tsx"
                meta="Dialog is an alias export of Modal"
              >
                <div className={styles.wrapRow}>
                  <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                  <StatusBadge variant="info" label="alias" />
                </div>
                <Dialog
                  open={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  title="<Dialog>"
                  size="sm"
                  footer={
                    <Button size="sm" onClick={() => setDialogOpen(false)}>
                      Close
                    </Button>
                  }
                >
                  <div className={styles.specimenText}>Dialog uses the Modal implementation.</div>
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

function DocSection({ title, children }: DocSectionProps) {
  return (
    <section className={styles.section}>
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
        <code className={styles.componentSource}>{source}</code>
      </div>
      <div className={styles.componentBody}>{children}</div>
    </article>
  )
}

function SpecimenSlot({ label }: { label: string }) {
  return <div className={styles.specimenSlot}>{label}</div>
}
