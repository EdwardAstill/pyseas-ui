# Component Contract — pyseas-ui v1

All components are:
- **Controlled** — no internal state beyond UI interaction feedback (hover, focus).
- **Composable** — slot-based where content varies; no implicit layout opinions.
- **Styled via CSS variables** — reference `--ps-*` tokens only. No hard-coded colours.
- **Domain-neutral** — no engineering, app, or product wording in props or defaults.

---

## `<ThemeProvider>`

Mounts `--ps-*` CSS custom properties on a wrapping element. Switches between `dark` and `light` token sets.

```tsx
interface ThemeProviderProps {
  theme: "dark" | "light";
  children: ReactNode;
}
```

**Not responsible for:** persisting theme preference, OS media-query detection (caller must pass the resolved value).

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

Controlled horizontal tab strip. Renders tab buttons; host renders the active panel body.

```tsx
interface TabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}
```

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

Controlled numeric input. Enforces numeric-only characters; exposes parsed value.

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

## `<Modal>` / `<Dialog>`

Shell only. Manages overlay, focus trap, Escape-to-close, and portal mounting. No built-in form wiring.

```tsx
type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;         // default: "md"
  children: ReactNode;
}
```

Size guide (width):
- `sm` — 360 px
- `md` — 520 px
- `lg` — 720 px

**States:** closed (renders null), open.

**Not responsible for:** form submission, button wiring, confirm/cancel patterns (caller composes those in `children`).

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

## `<WorkbenchLayout>`

Four-pane workbench skeleton. All slots are optional ReactNode. Handles proportional column layout; individual pane scroll is managed by the panel content.

```tsx
interface WorkbenchLayoutProps {
  rail?: ReactNode;           // narrow left nav column
  setupPanel?: ReactNode;     // left-of-centre input area
  diagramPanel?: ReactNode;   // centre visual/diagram area
  analysisPanel?: ReactNode;  // right-of-centre analysis pane
  resultsPanel?: ReactNode;   // far-right results / output pane
  className?: string;
  style?: CSSProperties;
}
```

Default column proportions (CSS `grid-template-columns`):
```
48px  240px  1fr  280px  300px
```
(rail, setup, diagram, analysis, results)

Columns with no content (`undefined` slot) collapse to zero. The layout does not scroll the viewport — each pane manages its own overflow.

**Not responsible for:** pane resize handles (may be added in a later version), routing or tab state, pane visibility toggles.
