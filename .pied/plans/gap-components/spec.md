# Gap Components — Spec

Implement 7 new components identified in the [readrun×ui integration
handoff](../../docs/handoff.md) that `ui` does not currently provide but that
readrun and other Pyseas apps need.

## Context

`ui` is a domain-neutral React component library (target: engineering
workbench). It uses CSS Modules + `--ps-*` design tokens, a two-axis theming
system (appearance × colouring), and follows compact, dense UI principles.

readrun (`/home/eastill/projects/readrun`) wants to consume `ui` as its
chrome layer. The handoff identified 8 components readrun needs that `ui`
does not provide. One (ContextMenu) was already added during the analysis
phase. This plan covers the remaining 7.

## Components

### Priority 1 — SegmentedGroup, Slider, Breadcrumb

**1. SegmentedGroup**
Horizontal button strip for mutually exclusive single-select options. Dense
alternative to `<Select>` or radio groups. Same pattern: filter toggles,
chart type selectors, view mode switches.

- Props: `options` (value+label), `value`, `onChange`, `disabled?`, `size?`, `className?`, `style?`
- States: default, hover, active (selected), disabled
- Tokens: `--ps-control-height-*`, `--ps-border`, `--ps-accent`, `--ps-text-muted`, `--ps-text`

**2. Slider**
Styled range slider using `<input type="range">` underneath with custom
`--ps-accent` track styling.

- Props: `value`, `onChange`, `min`, `max`, `step?`, `label?`, `disabled?`, `size?`, `className?`, `style?`
- States: default, hover, focus, disabled
- Tokens: `--ps-control-thumb`, `--ps-accent`, `--ps-border`

**3. Breadcrumb**
Clickable path segments with separator. For navigation bars, file paths,
multi-step workflows. Compact for status bar; expandable for full nav.

- Props: `items` (label + onClick/href), `separator?`, `maxItems?`, `className?`, `style?`
- Tokens: `--ps-text`, `--ps-text-muted`, `--ps-accent`, `--ps-font-mono`

### Priority 2 — CommandPalette, TagPill, Lightbox, TreeNav

**4. CommandPalette (Cmd-K)**
Search-as-you-type overlay with filtered results, keyboard navigation.
Portaled overlay with controlled `open`/`onClose`.

- Props: `open`, `onClose`, `items` (id+label+description+icon+keywords+onSelect),
  `placeholder?`, `emptyMessage?`, `className?`, `style?`
- Complex sub-structure: search input, filtered list, active index tracking
- Tokens: all standard `--ps-*`; `--ps-overlay` for scrim

**5. TagPill**
Small inline tag/label with compact border.

- Props: `label`, `href?`, `onClick?`, `onRemove?`, `variant?`, `size?`, `className?`, `style?`
- States: default, hover, removable (× on hover)
- Tokens: `--ps-text-muted`, `--ps-border`, `--ps-accent`, `--ps-radius-xs`

**6. Lightbox**
Image full-screen viewer with backdrop blur.

- Props: `open`, `onClose`, `src`, `alt?`, `className?`, `style?`
- Overlay with backdrop blur, centered image, Escape/click-outside to close

**7. TreeNav**
Expandable single-select navigation tree for link-based sidebar navigation.
Different from existing `<Tree>` (which targets data trees with drag-to-move).
TreeNav is lighter: no drag, no per-node trailing actions, route-style active
tracking.

- Props: `nodes` (id+label+href+icon+children+active+disabled), `onNodeClick?`,
  `expandedIds?`, `onToggle?`, `className?`, `style?`

## Non-goals

- No new CSS global styles or tokens (components only reference existing
  `--ps-*` tokens)
- No new state management or data fetching
- No domain language in prop names or defaults
- No animations beyond functional state transitions
