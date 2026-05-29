# Handoff — ui gap components complete → readrun

Date: 2026-05-29
From: ui repo
To: readrun repo (`/home/eastill/projects/readrun`)

---

## What was built

All 7 gap components identified in the [readrun×ui integration
analysis](./handoff.md) have been implemented in `ui`. The existing
`<ContextMenu>` (added during analysis) was also fleshed out and tested.

### New components in ui

| Component | Priority | Import name | File |
|---|---|---|---|
| Horizontal single-select button strip | P1 | `SegmentedGroup` | `src/components/SegmentedGroup.tsx` |
| Controlled range slider with custom thumb | P1 | `Slider` | `src/components/Slider.tsx` |
| Clickable path segments with separator | P1 | `Breadcrumb` | `src/components/Breadcrumb.tsx` |
| Inline tag/label with remove button | P2 | `TagPill` | `src/components/TagPill.tsx` |
| Full-screen image viewer overlay | P2 | `Lightbox` | `src/components/Lightbox.tsx` |
| Search-as-you-type overlay (Cmd-K) | P2 | `CommandPalette` | `src/components/CommandPalette.tsx` |
| Expandable navigation tree | P2 | `TreeNav` | `src/components/TreeNav.tsx` |
| Right-click context menu | — | `ContextMenu` | `src/components/ContextMenu.tsx` |

All components:
- Use CSS Modules + `--ps-*` design tokens (no hard-coded colours)
- Follow the controlled-value pattern
- Support keyboard navigation where applicable
- Pass `--ps-*` theme compatibility via `ThemeProvider` context
- Are exported from `ui` package root

---

## How readrun can consume ui

### 1. Install the dependency

```json
// readrun/package.json
"dependencies": {
  "ui": "workspace:*"  // or a path reference: "file:../ui"
}
```

If using a workspace:
```json
// root package.json
"workspaces": ["packages/*", "../ui"]
```

### 2. Wrap chrome with ThemeProvider

React 18-compatible. Use the two-axis theming:

```tsx
import { ThemeProvider, AppShell, TopBar, StatusBar, IconSidebar } from "ui";

function App() {
  return (
    <ThemeProvider theme="default" coloring="dark">
      <AppShell>
        <IconSidebar items={[...]} />
        <main>
          <TopBar title="readrun" />
          <YourContent />
          <StatusBar left="ready" />
        </main>
      </AppShell>
    </ThemeProvider>
  );
}
```

### 3. Chrome/content split (theme coexistence)

`ui`'s chrome and readrun's prose rendering coexist on the same page by
scoping their CSS variables to different DOM subtrees:

```html
<body data-theme="default" data-coloring="dark">   <!-- ui shell -->
  <nav>...</nav>
  <article data-theme="solarized">                   <!-- readrun prose -->
    ... markdown body with readrun's --color-* variables ...
  </article>
</body>
```

The prose area keeps readrun's own theme variables (`--color-*`) for syntax
highlighting and readability. The shell uses `--ps-*` tokens from ui's three
appearance packs and four colouring packs. They don't conflict because they
target different DOM scopes with different variable names.

### 4. Component migration map

| readrun hand-rolled | ui replacement | Import |
|---|---|---|
| `.settings__segmented` | `<SegmentedGroup>` | `ui` |
| `.settings__range` | `<Slider>` | `ui` |
| `.entered-folder-bar` | `<Breadcrumb>` | `ui` |
| `.tag-pill` | `<TagPill>` | `ui` |
| `.lightbox` | `<Lightbox>` | `ui` |
| `.site-search-palette` | `<CommandPalette>` | `ui` |
| `.sidebar-nav` | `<TreeNav>` | `ui` |
| `.context-menu` | `<ContextMenu>` | `ui` |
| `.settings__switch` | `<Toggle>` | `ui` |
| Theme picker overlay | `<Dialog>` + custom grid | `ui` |
| Shortcuts overlay | `<Dialog>` | `ui` |
| `.resource-switcher` | `<Tabs marker="bracket">` | `ui` |
| Topbar | `<TopBar>` | `ui` |
| Status bar | `<StatusBar>` | `ui` |
| `.search-bar` input | `<TextField>` | `ui` |
| Buttons | `<Button>` | `ui` |

### 5. Theme mapping for readrun→ui

When rendering ui chrome, translate readrun's theme to ui's appearance+coloring:

| readrun theme | ui `theme` | ui `coloring` |
|---|---|---|
| `light` | `"default"` | `"light"` |
| `dark` | `"default"` | `"dark"` |
| `solarized` | `"default"` | `"light"` |
| `nord` | `"default"` | `"dark"` |
| `dracula` | `"default"` | `"dark"` |
| `monokai` | `"default"` | `"dark"` |
| `gruvbox` | `"default"` | `"dark"` |
| `catppuccin` | `"default"` | `"dark"` |

---

## Usage examples

### SegmentedGroup (table view mode)

```tsx
import { SegmentedGroup } from "ui";

function ViewModeSwitch() {
  const [mode, setMode] = useState("auto");
  return (
    <SegmentedGroup
      options={[
        { value: "auto", label: "Auto" },
        { value: "scroll", label: "Scroll" },
        { value: "sticky", label: "Sticky" },
        { value: "cards", label: "Cards" },
      ]}
      value={mode}
      onChange={setMode}
      size="sm"
    />
  );
}
```

### Slider (font size / content width)

```tsx
import { Slider } from "ui";

function FontSizeControl() {
  const [size, setSize] = useState(16);
  return (
    <Slider
      value={size}
      onChange={setSize}
      min={10}
      max={32}
      step={1}
      label="Font size"
    />
  );
}
```

### Breadcrumb (folder navigation)

```tsx
import { Breadcrumb } from "ui";

function FolderNav({ path, onNavigate }) {
  return (
    <Breadcrumb
      items={path.map((segment) => ({
        label: segment.name,
        onClick: () => onNavigate(segment.path),
      }))}
      separator="›"
      maxItems={5}
    />
  );
}
```

### CommandPalette (Cmd-K / site search)

```tsx
import { CommandPalette } from "ui";

function SearchOverlay({ open, onClose, searchResults, onSelect }) {
  return (
    <CommandPalette
      open={open}
      onClose={onClose}
      items={searchResults.map((r) => ({
        id: r.id,
        label: r.title,
        description: r.path,
        keywords: [r.title, r.path],
        onSelect: () => onSelect(r),
      }))}
      placeholder="Search pages…"
      emptyMessage="No pages found."
    />
  );
}
```

### TreeNav (sidebar navigation)

```tsx
import { TreeNav } from "ui";

function SidebarNav({ nodes, activeId, onNavigate }) {
  const [expanded, setExpanded] = useState(new Set(["docs"]));

  return (
    <TreeNav
      nodes={nodes.map((n) => ({ ...n, active: n.id === activeId }))}
      expandedIds={expanded}
      onToggle={(id) => {
        setExpanded((prev) => {
          const next = new Set(prev);
          next.has(id) ? next.delete(id) : next.add(id);
          return next;
        });
      }}
      onNodeClick={(node) => node.href && onNavigate(node.href)}
    />
  );
}
```

---

## Component contracts summary

| Component | Controlled prop | Change handler | Overlay? | Keyboard nav | Notes |
|---|---|---|---|---|---|
| `SegmentedGroup` | `value: string` | `onChange(v: string)` | No | ← → Home End | Roving tabindex (like Tabs) |
| `Slider` | `value: number` | `onChange(v: number)` | No | Native (← →) | Native `<input type="range">` |
| `Breadcrumb` | `items: BreadcrumbItem[]` | Per-item `onClick` | No | — | Truncation via `maxItems` |
| `TagPill` | — | `onClick`, `onRemove` | No | — | 3 variants, 2 sizes |
| `Lightbox` | `open: boolean` | `onClose: () => void` | Portal | Escape | Backdrop blur |
| `CommandPalette` | `open: boolean` | `onClose: () => void` | Portal | ↑↓ Enter Escape Home End | Filtered search, `aria-combobox` |
| `TreeNav` | `expandedIds: Set<string>` | `onToggle(id: string)` | No | — | Controlled or uncontrolled |
| `ContextMenu` | — | `onClose: () => void` | Portal | ↑↓ Enter Escape Home End | Auto-position, flip on overflow |

---

## Next steps for readrun

1. **Add `ui` as a dependency** — either workspace or file path reference
2. **Wrap the app shell** with `ThemeProvider` + `AppShell` + `TopBar` + `StatusBar`
3. **Replace chrome components** incrementally, starting with the P1 items
   (SegmentedGroup for view mode, Slider for font/width controls, Breadcrumb
   for folder nav)
4. **Keep prose themes untouched** — use the chrome/content split pattern
5. **Replace overlays** (ContextMenu, CommandPalette, Lightbox, Dialog) as time
   allows — they're self-contained and don't affect layout

The `ui` demo catalog (`bun run demo` in the ui repo) shows all components
live with theme switching to verify appearance across all 12 theme combinations.
