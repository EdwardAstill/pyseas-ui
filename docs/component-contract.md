# Component Contract — pyseas-ui v1

All components are:
- **Controlled** — no internal state beyond UI interaction feedback (hover, focus).
- **Composable** — slot-based where content varies; no implicit layout opinions.
- **Styled via CSS variables** — reference `--ps-*` tokens only. No hard-coded colours.
- **Domain-neutral** — no engineering, app, or product wording in props or defaults.

---

## Architecture

A page has a **fixed** four-slot frame:

```
┌──────────────────────────────────────────────────────────┐
│ Top bar (TopBar) — title + options                   │
├────┬─────────────────────────────────────────────────────┤
│ S  │                                                     │
│ i  │  Workspace (Workspace) — draggable panels   │
│ d  │  ┌────────────────────────────────┐                 │
│ e  │  │ Panel top bar: pane tabs + opts│                 │
│ b  │  │ (Workspace tab strip)  │                 │
│ a  │  ├────────────────────────────────┤                 │
│ r  │  │ Panel main: PaneShell      │                 │
│    │  │  ┌──┬───────────────────────┐  │                 │
│    │  │  │  │ section bar           │  │                 │
│    │  │  │ R│  (slash tabs · opts) ↘│  │                 │
│    │  │  │ a├───────────────────────┤  │                 │
│    │  │  │ i│                       │  │                 │
│    │  │  │ l│   body                │  │                 │
│    │  │  │  │                       │  │                 │
│    │  │  └─↕─┴───────────────────────┘  │                 │
│    │  └────────────────────────────────┘                 │
├────┴─────────────────────────────────────────────────────┤
│ Bottom bar (StatusBar)                               │
└──────────────────────────────────────────────────────────┘
```

Levels of tabbing inside a panel:

| Level | Where | Style | Provider |
|---|---|---|---|
| 1 (pane) | Panel top bar, left | Square block | `<Workspace>` |
| 1-opts | Panel top bar, right | (free) | `<Workspace renderToolbar>` |
| 2 (subtabs) | Rail, left of body | Bracket vertical | `<PaneShell rail>` |
| 3 (sub-sub-tabs) | Section bar, top of body | Slash horizontal | `<PaneShell section>` |
| 3-opts | Section bar, right | (free) | `<PaneShell sectionOptions>` |

The rail is **resizable** by default — a slider on its right edge.

**Forbidden patterns:**
- Raw `<Tabs marker="underline" />` inside a panel. Use the rail/section slots.
- Content that lives outside a panel inside the workspace. Everything in the workspace must be a panel.
- Marker overrides on rail/section. The shell owns those.

---

## `<ThemeProvider>`

Mounts `--ps-*` CSS custom properties on a wrapping element. Switches named token packs with one prop.

```tsx
type ThemeName = "default" | "light" | "bun" | "high-contrast" | "compact" | "dark";
type ThemeMode = "dark" | "light";

interface ThemeProviderProps {
  theme: ThemeName;
  children: ReactNode;
}
```

Built-in packs:
- `default` — dense neutral dark baseline.
- `light` — light counterpart for conventional environments.
- `bun` — warmer Bun-like developer-tool treatment.
- `high-contrast` — larger, stronger borders and brighter status colours.
- `compact` — tighter density for information-heavy screens.
- `dark` — legacy alias of `default`.

The provider writes `data-theme` and `data-theme-mode` so components with canvas/CAD rendering can choose dark or light internals without knowing each pack.

**Not responsible for:** persisting theme preference, OS media-query detection (caller must pass the resolved value).

---

## `<PaneShell>`

Standard interior layout for a panel body. Constrains every panel to the same three-slot composition with **fixed tab markers**:

| Slot | Tab style | Forced by |
|---|---|---|
| Pane tabs (outer) | Square block | `<Workspace>` |
| Rail (subtabs) | Bracket vertical | `<PaneShell rail={...}>` |
| Section (sub-sub-tabs) | Slash horizontal | `<PaneShell section={...}>` |
| Body | (free content) | caller |

The rail / section slots take **tab specs**, not raw `ReactNode`. The shell renders `<Tabs>` internally with the correct orientation + marker. Apps cannot accidentally use underline tabs inside a pane.

```tsx
interface PaneRailSpec<T extends string = string> {
  items: TabItem[];
  value: T;
  onChange: (value: T) => void;
}

interface PaneSectionSpec<T extends string = string> {
  items: TabItem[];
  value: T;
  onChange: (value: T) => void;
}

interface PaneShellProps {
  rail?: PaneRailSpec | undefined;
  section?: PaneSectionSpec | undefined;
  sectionOptions?: ReactNode;       // right-aligned content in the section bar (e.g. <Toolbar>)
  children: ReactNode;
  flushBody?: boolean;
  railWidth?: number;               // controlled rail width (px). Omit for uncontrolled (default 132).
  railMinWidth?: number;            // default 80
  railMaxWidth?: number;            // default 320
  railResizable?: boolean;          // default true — drag handle on the right edge of the rail
  onRailWidthChange?: (width: number) => void;
  className?: string;
  style?: CSSProperties;
}
```

**Layout:**
- CSS Grid: `[rail | section-on-top + body]`. Rail spans full height; section is a flush bar above the body.
- Rail uses `--ps-panel-elevated` background; section bar matches.
- Body is padded (`14px 16px`) and scrolls. `flushBody` removes both for canvases / log views that own their own chrome.
- Both rail and section are independently optional.

**Forbidden inside a pane:** raw `<Tabs marker="underline" />`. Use the rail/section slots. Underline tabs are reserved for free-standing surfaces (e.g. inside a `<Dialog>`).

**Not responsible for:** the pane's outer tab strip / drag handling (use `<Workspace>`), or the pane's contents themselves.

---

## `<Panel>`

Rectangular container with an optional title bar and header action slot.

```tsx
interface PanelProps {
  title?: string;
  headerActions?: ReactNode;   // renders right-side of title bar
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

**States:** default only (no interactive states on the shell).

**Not responsible for:** scroll behaviour (use `overflow` on `children` wrapper), resize logic.

---

## `<Tabs>`

Controlled tab strip. Renders tab buttons; host renders the active panel body. Two orientations and two active-marker styles.

```tsx
interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

type TabsOrientation = 'horizontal' | 'vertical';
type TabsMarker = 'underline' | 'bracket' | 'slash';

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  orientation?: TabsOrientation; // default 'horizontal'
  marker?: TabsMarker;           // default 'underline'
  className?: string;
}
```

**Orientation:** `horizontal` renders a top tab strip. `vertical` renders a left rail with a right border and panel background — caller should wrap the tabs + body in a row flex container.

**Marker:** `underline` is the default outer tab style (accent underline + accent text on active). `bracket` is the inner-subtab style: mono caps, no underline, active label flanked by accent `[ ]` brackets with reserved space on inactive rows so labels do not shift. `slash` is a crumb-style strip — mono caps with `/` separators between labels, active label brightens to `--ps-text` with no underline; intended for a third level nested below a bracket rail, where it deliberately reads lighter than the rail above it.

**States per tab:** default, hover, active (selected), disabled.

**Not responsible for:** rendering tab panel content (caller renders based on `value`).

---

## `<Toolbar>`

Horizontal row of tightly-spaced small controls. Wraps with `gap: --ps-space-xs`.

```tsx
interface ToolbarProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
```

**Not responsible for:** overflow/collapse behaviour — host manages at larger scales.

---

## `<Button>`

```tsx
type ButtonVariant = "default" | "primary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps {
  variant?: ButtonVariant;       // default: "default"
  size?: ButtonSize;             // default: "md"
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon?: ReactNode;              // rendered before label
  children?: ReactNode;
  title?: string;
  autoFocus?: boolean;
  style?: CSSProperties;
}
```

**States:** default, hover, active, disabled, loading (shows spinner, disables click).

Size guide:
- `sm` — ~22 px height, 10.5 px font
- `md` — ~28 px height, 11 px font

**Not responsible for:** routing, form submission side-effects, icon library choice.

---

## `<IconButton>`

Square icon-only button. Same variant/size/state model as `<Button>`.

```tsx
interface IconButtonProps {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title: string;              // required for accessibility
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
}
```

**States:** same as `<Button>`.

**Not responsible for:** tooltip rendering (caller may layer `<Tooltip>` if desired).

---

## `<TextField>`

Controlled single-line text input.

```tsx
interface TextFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  label?: string;
  hint?: string;
  name?: string;
  autoFocus?: boolean;
  style?: CSSProperties;
}
```

**States:** default, focus, disabled, readOnly, error (red border).

**Not responsible for:** validation logic, debouncing, form submission.

---

## `<NumberField>`

Controlled numeric input. Renders without native browser spinner arrows while
keeping decimal keyboard hints and `spinbutton` semantics. Exposes parsed
`number | null` values only; nonnumeric text is rejected.

```tsx
interface NumberFieldProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  label?: string;
  hint?: string;
  style?: CSSProperties;
}
```

**Interaction:** `ArrowUp` / `ArrowDown` and mouse-wheel events over the input
step by `step` (default `1`) and respect `min` / `max`. Input wheel events use a
native non-passive listener and call `preventDefault()` so the page does not
scroll while the pointer is over the field.

**States:** same as `<TextField>`.

**Not responsible for:** unit conversion, SI formatting, engineering-specific validation.

---

## `<Select>`

Controlled single-select dropdown.

```tsx
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  style?: CSSProperties;
}
```

**States:** default, open, focus, disabled, error.

**Not responsible for:** async option loading, multi-select, virtualised lists.

---

## `<Checkbox>`

Controlled checkbox with optional label.

```tsx
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  style?: CSSProperties;
}
```

**States:** unchecked, checked, indeterminate, disabled.

---

## `<Toggle>`

Controlled boolean toggle switch.

```tsx
interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  style?: CSSProperties;
}
```

**States:** off, on, disabled.

**Not responsible for:** persisting state, triggering side-effects.

---

## `<Dialog>`

Three-slot dialog shell: **title bar** (mono caps title + optional actions + close X), **body** (scrollable), **footer** (right-aligned action buttons). Manages overlay, focus trap, Escape-to-close, and portal mounting. No built-in form wiring.

```tsx
type DialogSize = "sm" | "md" | "lg";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleActions?: ReactNode;   // header trailing slot (before the close X)
  footer?: ReactNode;         // typically right-aligned action <Button>s
  size?: DialogSize;          // default: "md"
  children: ReactNode;
  className?: string;
}
```

Size guide (width):
- `sm` — 360 px
- `md` — 520 px
- `lg` — 720 px

**States:** closed (renders null), open.

**Visual:** title bar uses `--ps-panel`, body uses `--ps-panel-elevated`, footer uses `--ps-panel`. Title is mono uppercase to match panel headers.

**Not responsible for:** form submission, button wiring, confirm/cancel patterns (caller composes those in `footer`).

---

## `<StatusBadge>`

Small inline badge indicating a status level.

```tsx
type StatusVariant = "ok" | "warn" | "err" | "info";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;          // if omitted renders the variant name
  style?: CSSProperties;
}
```

Colour map (uses theme tokens):
- `ok` → `--ps-success`
- `warn` → `--ps-warning`
- `err` → `--ps-danger`
- `info` → `--ps-info`

**Not responsible for:** computing status from data, animations, counts.

---

## `<Result>`

Display block for a single result row: label, value, units, and status. Pure presentation — receives already-computed data.

```tsx
type ResultStatus = "ok" | "warn" | "err" | "info" | "none";

interface ResultProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: ResultStatus;     // default: "none" (no badge)
  ratio?: string;            // e.g. "0.82 / 1.00" — optional utilisation string
  note?: string;             // secondary line beneath value
  style?: CSSProperties;
}
```

**Not responsible for:** any computation, unit conversion, pass/fail logic.

---

## `<LogView>`

Scrollable monospace area for streamed text output. Auto-scrolls to bottom when new lines arrive unless the user has scrolled up.

```tsx
interface LogViewProps {
  lines: string[];
  maxHeight?: number | string;   // default: "100%"
  wrapLines?: boolean;           // default: false
  style?: CSSProperties;
}
```

**Not responsible for:** fetching log data, ANSI colour parsing, timestamps.

---

## `<DrawingViewer>`

Source-agnostic drawing preview surface for engineering workbenches. Supports
inline SVG, SVG URLs, image URLs, loading/error/empty states, pan, zoom, fit
reset, metadata display, and an optional download link.

```tsx
type DrawingSource =
  | { kind: 'svg'; content: string; label?: string }
  | { kind: 'svg-url'; url: string; label?: string }
  | { kind: 'image'; url: string; label?: string };

type DrawingViewerStatus = 'idle' | 'loading' | 'error' | 'ready';

interface DrawingDownload {
  href: string;
  filename?: string;
  label?: string;
}

interface DrawingViewerProps {
  source?: DrawingSource | null;
  status?: DrawingViewerStatus;
  error?: string | null;
  emptyMessage?: string;
  loadingMessage?: string;
  metadata?: ReactNode;
  download?: DrawingDownload | null;
  className?: string;
  style?: CSSProperties;
}
```

**Not responsible for:** DXF parsing, CAD geometry generation, API calls,
engineering units, layer semantics, entity selection, or domain-specific labels.

---

## `<Tree>`

Controlled hierarchical tree view. Caller owns node shape, expanded set, and
selected id. No internal state.

```tsx
interface TreeNode<T = unknown> {
  id: string;
  label: string;
  children?: TreeNode<T>[];
  disabled?: boolean;
  icon?: ReactNode;
  trailing?: ReactNode;
  data?: T;
}

interface TreeRenderArgs<T> {
  node: TreeNode<T>;
  depth: number;
  expanded: boolean;
  selected: boolean;
}

interface TreeDisclosureArgs<T> extends TreeRenderArgs<T> {
  disabled: boolean;
}

type TreeDropPosition = 'before' | 'inside' | 'after';

interface TreeMoveArgs<T = unknown> {
  draggedId: string;
  targetId: string;
  position: TreeDropPosition;
  draggedNode: TreeNode<T>;
  targetNode: TreeNode<T>;
}

interface TreeProps<T = unknown> {
  nodes: TreeNode<T>[];
  expanded: ReadonlySet<string>;
  onExpandedChange: (next: Set<string>) => void;
  selected?: string | null;
  onSelect?: (id: string, node: TreeNode<T>) => void;
  onMove?: (args: TreeMoveArgs<T>) => void;
  canDrop?: (args: TreeMoveArgs<T>) => boolean;
  indent?: number;                              // px per depth level, default 14
  renderDisclosure?: (args: TreeDisclosureArgs<T>) => ReactNode;
  renderNode?: (args: TreeRenderArgs<T>) => ReactNode;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}
```

**Interaction:** click a row to select it; click a row with children to toggle
expansion (selection also fires). Arrow Right expands a collapsed row; Arrow
Left collapses an expanded row. Supplying `onMove` enables drag-to-move rows.
The tree reports `before`, `inside`, or `after` drop intent; caller updates
`nodes` and may use `canDrop` to reject moves such as dropping into leaf nodes.
The tree prevents dropping a node onto itself, onto a descendant, or onto a
disabled target.

**States per row:** default, hover, selected (uses `--ps-accent`), disabled,
focused (focus ring inside the row), dragging, drop-before, drop-inside,
drop-after.

**Not responsible for:** loading children async, virtualisation, multi-select,
checkbox selection, filtering or search, persisting expansion state, or mutating
the caller-owned node data.
