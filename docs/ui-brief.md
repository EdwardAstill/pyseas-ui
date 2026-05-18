# UI Brief — pyseas-ui

## Purpose & Scope

`pyseas-ui` is a domain-neutral component library. It provides the visual layer for web apps built on the pyseas platform (e.g. `pyseas-yard-gui`, `pyseas-dock-gui`). It contains no engineering logic, no domain wording, and no API calls. Any app using it must supply its own data layer.

Target aesthetic: engineering workbench, not marketing. Dense, precise, legible.

---

## Visual Language

- **Density** — compact controls. Small button heights (sm: ~22 px, md: ~28 px). Small font sizes for tables and forms (10.5–12 px). Bodies of panels use tight line-height.
- **Corners** — square by default (`radius: 0`). An optional `xs` radius (2–4 px) is available for inputs and badges; never decorative.
- **Shadows** — structural only (modal backdrop). No shadow as ambient decoration.
- **Gradients** — none. Flat fills only.
- **Motion** — state transitions only (color, opacity, border). No entrance/exit animations. No spring physics.
- **Typography** — monospace for labels, headings, numeric values, and unit strings. Sans-serif for body/prose content.
- **Themes** — dark-first. Light mode supported via the same token layer. No hard-coded colour values in components.

---

## Design References

Keep a short, current list of external sites that express the visual direction
we want `pyseas-ui` to learn from. The list is for taste calibration only: copy
the useful principles, not the site layout or brand.

Current reference list: [`docs/design-references.md`](design-references.md).

The current baseline is Bun's website: clean developer-tool UI, restrained
system typography, dark-first surfaces, and JetBrains Mono for code-like and
numeric content.

`pyseas-ui` adopts this as the default token direction: system sans for normal
UI text, and packaged JetBrains Mono for technical labels, code-like text, and
numeric fields.

---

## Theme Tokens

All tokens are CSS custom properties on `:root` (or a scoped container). Components reference only these variables — never raw hex values.

### Colour tokens

| Token | Dark default | Light default | Purpose |
|---|---|---|---|
| `--ps-surface` | `#0F0F0F` | `#F0F0F0` | App background |
| `--ps-panel` | `#1A1A1A` | `#FFFFFF` | Panel background |
| `--ps-panel-elevated` | `#222222` | `#F7F7F7` | Raised panel / modal |
| `--ps-border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.10)` | Borders and dividers |
| `--ps-border-strong` | `rgba(255,255,255,0.18)` | `rgba(0,0,0,0.22)` | Focused/active borders |
| `--ps-text` | `#E8E8E8` | `#111111` | Primary text |
| `--ps-text-muted` | `#888888` | `#666666` | Secondary/placeholder text |
| `--ps-accent` | `#4D9CFF` | `#0068D6` | Interactive highlight |
| `--ps-danger` | `#DD3333` | `#C02020` | Destructive / error |
| `--ps-success` | `#3A9E6A` | `#1D7A4E` | Pass / ok |
| `--ps-warning` | `#C88A18` | `#A06800` | Warning / caution |
| `--ps-info` | `#5588BB` | `#2255AA` | Informational |
| `--ps-overlay` | `rgba(0,0,0,0.60)` | `rgba(0,0,0,0.40)` | Modal backdrop |

### Spacing scale

| Token | Value | Usage |
|---|---|---|
| `--ps-space-xs` | `4px` | Gap between inline items |
| `--ps-space-sm` | `8px` | Control padding, small gaps |
| `--ps-space-md` | `12px` | Panel padding, section gaps |
| `--ps-space-lg` | `20px` | Layout gaps |
| `--ps-space-xl` | `32px` | Major section separation |

### Radius scale

| Token | Value |
|---|---|
| `--ps-radius-none` | `0px` |
| `--ps-radius-xs` | `2px` |
| `--ps-radius-sm` | `4px` |

Default component radius: `--ps-radius-none`. Inputs and badges may use `--ps-radius-xs`.

### Type scale

| Token | Value | Usage |
|---|---|---|
| `--ps-font-sans` | `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif` | Body text |
| `--ps-font-mono` | `'JetBrains Mono', 'Fira Code', 'Hack', 'Source Code Pro', 'SF Mono', ui-monospace, monospace` | Labels, headings, values |
| `--ps-text-xs` | `10.5px` | Table cells, compact labels |
| `--ps-text-sm` | `11px` | Most UI chrome |
| `--ps-text-md` | `12px` | Body, descriptions |
| `--ps-text-lg` | `13px` | Panel titles, modal headings |

---

## Layout Philosophy

Engineering apps use a **workbench** composition: a persistent navigation rail on the left, and three to four working panes filling the remaining space. Panes are resizable by the host app but `WorkbenchLayout` provides the skeleton.

```
┌──────────────────────────────────────────────────────┐
│ rail  │  setup panel  │  diagram/visual  │  results  │
│       │               │                  │           │
│       │               │                  │           │
└──────────────────────────────────────────────────────┘
```

Panes do not scroll the viewport — each panel manages its own internal scroll. This keeps the workbench stable while content updates.

---

## Anti-Goals

- No domain logic, engineering math, or unit conversion.
- No API calls or data fetching of any kind.
- No project, session, or application state.
- No domain wording in prop names, default labels, or ARIA text (e.g. `"calculation"`, `"check"`, `"padeye"` must never appear in this package).
- No marketing/landing patterns (hero sections, feature cards, pricing grids).
- No animations beyond functional state transitions (color, border, opacity, cursor).
- No copying Dock's inline style values literally — all colours and spacing re-expressed as CSS variable references.
- No peer dependencies beyond React 19.
