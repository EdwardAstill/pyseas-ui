# ui

Domain-neutral React component library for web-based engineering workbench applications. Provides the visual layer — layout, primitives, and theming — shared by `pyseas-yard-gui` and `pyseas-dock-gui`. No engineering logic, no domain wording, no API calls.

---

## What it is

A collection of controlled, composable UI primitives and layout building blocks. The visual language is dense, precise, and flat: compact controls, square corners, monospace labels, dark-first theming. It is designed for engineering tooling, not consumer or marketing interfaces.

The design direction is tracked in [`docs/ui-brief.md`](docs/ui-brief.md), with external inspiration recorded in [`docs/design-references.md`](docs/design-references.md).

## Stack policy

`ui` uses React, CSS Modules, and package-owned `--ps-*` design tokens. It does not require Tailwind, shadcn/ui, or app-level styling configuration. If an accessibility primitive becomes too expensive to maintain locally, adopt focused Radix primitives behind the existing `ui` component API rather than switching the library to a shadcn/Tailwind component model.

## What it is NOT

- No Yard or Dock domain logic (no padeye geometry, no lift conditions, no check results)
- No engineering math or unit conversion
- No API calls or data fetching
- No application or project state
- No domain wording in prop names or default labels
- No marketing patterns (hero sections, feature cards, pricing grids)

---

## Status

Version 0.1.0. Pre-publish. The package is not published to npm yet; sibling apps consume it through local path or workspace links.

---

## Installing locally

In a consuming app's `package.json`, add a path reference:

```json
{
  "dependencies": {
    "ui": "file:../ui"
  }
}
```

Or, if both packages share a workspace root (e.g. a Bun or pnpm workspace), declare it as a workspace dependency:

```json
{
  "dependencies": {
    "ui": "workspace:*"
  }
}
```

Then run `bun install` (or the workspace manager's equivalent) in the consuming app.

---

## CSS import

The package ships a single CSS file containing all design tokens and component styles. Import it once, near the root of the consuming app (e.g. in `main.tsx` or the top-level entry module):

```ts
import 'ui/dist/ui.css'
```

This must load before any `ui` component renders. Without it the theme tokens are absent and components will be unstyled.

---

## Theming

Wrap the application (or any sub-tree) in `<ThemeProvider>`. The provider composes three concerns:

- `theme` — appearance pack: `default`, `bun`, or `compact`.
- `coloring` — colour scheme: `dark`, `light`, `neon-pink`, or `cobalt`.
- `overrides` — optional CSS custom-property overrides for one subtree.

Legacy single-value themes still work: `dark`, `light`, `high-contrast`, `bun`, `default`, `compact`, `neon-pink`, and `cobalt` are accepted as `ThemeName` values. `ThemeProvider` does not read `prefers-color-scheme` or localStorage itself; callers must pass the resolved values.

```tsx
import {
  ThemeProvider,
  type ThemeAppearanceName,
  type ThemeColoringName,
} from 'ui'

function App() {
  const [theme, setTheme] = useState<ThemeAppearanceName>('default')
  const [coloring, setColoring] = useState<ThemeColoringName>('dark')

  useEffect(() => {
    localStorage.setItem('app-theme', theme)
    localStorage.setItem('app-coloring', coloring)
  }, [theme, coloring])

  return (
    <ThemeProvider theme={theme} coloring={coloring}>
      {/* rest of app */}
    </ThemeProvider>
  )
}
```

On mount, read the stored values and validate them before passing them to the provider.

---

## Component catalogue

| Component | Purpose |
|---|---|
| `ThemeProvider` | Mounts `--ps-*` CSS tokens; composes appearance, colouring, and overrides |
| `Panel` | Rectangular container with optional title bar and header action slot |
| `Tabs` | Controlled horizontal tab strip; caller renders panel body |
| `Toolbar` | Horizontal row of tightly-spaced small controls |
| `Button` | Action button — variants: `default`, `primary`, `danger`, `ghost` |
| `IconButton` | Square icon-only button; same variant / size model as `Button` |
| `TextField` | Controlled single-line text input |
| `NumberField` | Spinner-free controlled numeric input; exposes parsed `number \| null` and supports arrow-key/input-wheel stepping |
| `Select` | Controlled single-select dropdown |
| `Checkbox` | Controlled checkbox with optional label; supports indeterminate |
| `Toggle` | Controlled boolean toggle switch |
| `Dialog` | Overlay shell with focus trap and Escape-to-close; no built-in form wiring |
| `StatusBadge` | Inline status badge — `ok`, `warn`, `err`, `info` |
| `Result` | Display row for a pre-computed result: label, value, unit, status, utilisation |
| `LogView` | Scrollable monospace area for streamed text; auto-scrolls to bottom |
| `Tree` | Controlled hierarchical tree view with expand/collapse, selection, drag-to-move, and per-node icon/trailing slots |
| `SortableList` | Controlled pointer-drag list that reports reordered items |
| `FreeformCanvas` | Absolute-positioned card canvas with drag-to-position and selection hooks |
| `DrawingViewer` | Source-agnostic SVG/image drawing preview with pan, zoom, fit reset, metadata, and download action |
| `CadDxfViewer` | DXF preview frame around `dxf-viewer`, with theme-aware background and status messages |
| `CadStepViewer` | STEP mesh preview frame for pre-tessellated mesh JSON, with orbit controls and status messages |
| `CsvViewer` | Parsed CSV table with filtering, sortable columns, pagination, and empty state |
| `CodeViewer` | Monospace code block with optional line numbers and language badge |
| `TextViewer` | Plain-text block with optional line numbers |
| `PdfViewer` | Sandboxed PDF iframe wrapper |
| `AppShell` | workbench app frame with top bar, icon sidebar, content slot, and status bar |
| `TopBar` | Compact application top bar with title, subtitle, and action slots |
| `IconSidebar` | 48px icon rail matching the workbench icon-rail pattern |
| `StatusBar` | Compact bottom status row |
| `Workspace` | pane tree with square tabs, split resizing, tab moves, and pane moves |

Full prop interfaces are in [`docs/component-contract.md`](docs/component-contract.md).

`DrawingViewer` renders supplied drawing sources only. It does not parse DXF,
generate geometry, fetch API data, calculate units, or know about Yard/Dock
domain objects. Apps that need DXF previews should convert or serve a browser
preview format such as SVG before passing it to this component.

---

## Workspace example

Use `Workspace` for workspace-driven applications where panels must be
resizable and movable. The app owns the panel IDs and panel content; `ui`
owns only the generic layout tree and interaction behavior.

```tsx
import 'ui/dist/ui.css'
import {
  AppShell,
  IconSidebar,
  Workspace,
  StatusBar,
  TopBar,
  ThemeProvider,
  type LayoutNode,
} from 'ui'

type PanelId = 'parts' | 'part' | 'condition' | 'analysis' | 'standards' | 'diagram' | 'result'

const layout: LayoutNode<PanelId> = {
  type: 'split',
  dir: 'col',
  sizes: [0.48, 0.52],
  children: [
    {
      type: 'split',
      dir: 'row',
      sizes: [0.18, 0.5, 0.32],
      children: [
        { type: 'leaf', id: 'parts-leaf', tabs: ['parts'], activeTab: 'parts' },
        { type: 'leaf', id: 'setup-leaf', tabs: ['part', 'condition'], activeTab: 'part' },
        { type: 'leaf', id: 'checks-leaf', tabs: ['analysis', 'standards'], activeTab: 'analysis' },
      ],
    },
    {
      type: 'split',
      dir: 'row',
      children: [
        { type: 'leaf', id: 'diagram-leaf', tabs: ['diagram'], activeTab: 'diagram' },
        { type: 'leaf', id: 'result-leaf', tabs: ['result'], activeTab: 'result' },
      ],
    },
  ],
}

function MyApp() {
  return (
    <ThemeProvider theme="default">
      <AppShell
        topbar={<TopBar title="Engineering App" subtitle="workflow" />}
        sidebar={<IconSidebar activeItem="parts" items={[]} />}
        statusbar={<StatusBar left="ready" />}
      >
        <Workspace
          defaultLayout={layout}
          renderPanel={(panel) => <PanelBody panel={panel} />}
          renderTabLabel={(panel) => panel}
        />
      </AppShell>
    </ThemeProvider>
  )
}
```

The exported pure helpers (`moveTab`, `moveGroup`,
`setSplitSizesAtPath`, `computeDropEdge`, and related functions) are
available for tests, persistence, or app-specific layout commands.

## Boundaries with pyseas-yard-gui and pyseas-dock-gui

`ui` owns:

- Presentation primitives (buttons, fields, panels, badges, log view)
- Source-agnostic drawing preview presentation (`DrawingViewer`)
- Workbench pane shell, tabstrips, splitters, and drag/drop layout state
- Design tokens (`--ps-*` CSS custom properties)
- Theme switching mechanics

Consuming apps (`pyseas-yard-gui`, `pyseas-dock-gui`) own:

- All domain wording (lift conditions, check names, standard references, padeye geometry labels)
- Engineering calculations and unit conversion
- API calls and data fetching
- Project and session state
- Persistence (localStorage keys, file I/O)
- Pass / fail logic and utilisation ratios (values are passed to `<Result>` as pre-computed strings)

Neither library nor app should encode the other's concerns.

---

## Development

```sh
bun install          # install dependencies
bun run dev          # start Vite dev server (serves examples/showcase)
bun run demo         # start the examples/showcase through the ui CLI wrapper
bun run typecheck    # TypeScript type-check (no emit)
bun run build        # build library to dist/
bun test             # run tests
```

The dev server serves `examples/` as the root. Open `http://localhost:5173` to see the component showcase.

The package also exposes a Bun-native developer CLI:

```sh
ui demo [--port <port>] [--host <host>] [--open] [--strict-port]
```

Install the local CLI globally with `bun link`. If installing through Bun's
global package store, use `bun install -g --backend=symlink .` so the command
serves this checkout's `examples/` and local dev dependencies.

Build output goes to `dist/`:
- `dist/ui.es.js` — ES module bundle
- `dist/ui.css` — all tokens and styles
- `dist/types/` — TypeScript declarations

---

## Further reading

- [`docs/ui-brief.md`](docs/ui-brief.md) — visual language, token reference, anti-goals
- [`docs/component-contract.md`](docs/component-contract.md) — full prop interfaces and component responsibilities
