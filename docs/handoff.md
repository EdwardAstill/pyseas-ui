# Handoff — ui

This is session state for maintainers, not public package documentation. `package.json` excludes this file from npm package contents.

## Project status

Local/workspace component library. All checks pass (typecheck, lint, test, build).
Demo runs via `bun run demo`.

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

- Dialog has focus trap, focus restore, title labelling, Escape close, and theme propagation.
- TextField, NumberField, and Select labels are programmatically associated; hints use `aria-describedby` when an `id` is supplied.
- Tabs and Workspace pane tabs support roving keyboard activation with arrow/Home/End keys.
- Tree supports visible-row keyboard navigation with ArrowUp/ArrowDown/Home/End plus ArrowLeft/ArrowRight expand/collapse.
- Styling contract is CSS Modules + `--ps-*` tokens. Do not require Tailwind or shadcn/ui in consumers; use focused Radix primitives only if hidden behind existing `ui` APIs.
- Component CSS no longer has raw hex/rgb colours outside token definitions.

## Verification

- `bun run typecheck` — clean
- `bun run lint` — clean
- `bun test` — 60 pass
- `bun run build` — dist/ builds cleanly
- Demo smoke: `ui showcase` served from `bun run demo -- --host 127.0.0.1 --port 5174 --strict-port`

## Next build step

None — library is ready. Next work likely on consuming apps (yard-gui / dock-gui).
