# Handoff — pyseas-ui

## Project status

Pre-publish component library. All checks pass (typecheck, lint, test, build).
Demo runs via `bun run demo` on port 5178.

## Theme system

ThemeProvider now composes two independent concerns:
- `theme` — appearance pack (bun | default | compact): spacing, rounding, fonts, density
- `coloring` — color scheme (dark | light | neon-pink | cobalt): surface/text/accent/status colors
- `overrides` — optional inline CSS variable map

`[data-theme]` and `[data-coloring]` CSS selectors are separate in tokens.css.
Legacy ThemeName values (`bun`, `default`, `light`, `dark`, `high-contrast`, `compact`) still work.

Coloring schemes:
- dark — neutral dark workbench (white accent)
- light — conventional light
- neon-pink — charcoal + pink accent (bun.com-inspired)
- cobalt — cream surfaces + blue accent + orange warn

## Recent changes

- Dialog replaces Modal (new component, backsplash + focus trap + theme propagation)
- useTheme() hook exported for portal components
- Tree: disclosure uses rounded SVG chevron (stroke-linecap: round), with 3 visual modes
- NumberField: native non-passive wheel listener prevents page scroll on hover/focus
- StatusBadge, AppShell subtitle/statusbar, Dialog title all use system sans (not mono)
- Demo redesigned: bun.com-style hero, hamburger dropdown nav, Theming section with clickable appearance/coloring cards
- WorkbenchLayout removed (replaced by Workspace)
- CadViewer: CadDxfViewer / CadStepViewer status/error props wired through

## Verification

- `bun run typecheck` — clean
- `bun run lint` — clean
- `bun test` — 29 pass
- `bun run build` — dist/ builds cleanly
- Browser: NumberField wheel prevents page scroll, Dialog updates with theme changes

## Next build step

None — library is ready. Next work likely on consuming apps (yard-gui / dock-gui).
