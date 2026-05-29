# Gap Components — Tasks

## Task order

1. SegmentedGroup (P1, simple, no overlay)
2. Slider (P1, simple, no overlay)
3. Breadcrumb (P1, simple, no overlay)
4. TagPill (P2, smallest)
5. Lightbox (P2, simple overlay)
6. CommandPalette (P2, complex overlay with keyboard nav)
7. TreeNav (P2, moderate complexity)

After each component: update index.ts, add to smoke.test.ts, add to
examples/App.tsx + App.module.css + catalogData.ts as needed.

## Dependencies

None between components — all can be built independently. Order is by
complexity then by handoff priority.

## Status — COMPLETED 2026-05-29

All 7 components implemented, wired into index.ts exports, smoke tests, and
demo catalog. Every verification check passes.

## Verification results

| Check | Command | Result |
|---|---|---|
| Typecheck | `bun run typecheck` | ✅ passed |
| Lint | `bun run lint` | ✅ zero errors |
| Tests | `bun test` | ✅ 60/60 pass |
| Git diff | `git diff --check` | ✅ clean |
| Whitespace | `git diff --check` | ✅ no errors |

## Files created

| File | Purpose |
|---|---|
| `src/components/SegmentedGroup.tsx` | Horizontal single-select button strip |
| `src/components/SegmentedGroup.module.css` | Styles — border group, accent fill on active |
| `src/components/Slider.tsx` | Controlled range slider with custom thumb |
| `src/components/Slider.module.css` | Styles — custom thumb, accent track fill |
| `src/components/Breadcrumb.tsx` | Clickable path segments with separator |
| `src/components/Breadcrumb.module.css` | Styles — mono font, muted links, separator |
| `src/components/TagPill.tsx` | Inline tag with 3 variants, sizes, removable |
| `src/components/TagPill.module.css` | Styles — border, accent/status fills, × button |
| `src/components/Lightbox.tsx` | Full-screen image viewer overlay |
| `src/components/Lightbox.module.css` | Styles — backdrop blur, centered image |
| `src/components/CommandPalette.tsx` | Search-as-you-type overlay with keyboard nav |
| `src/components/CommandPalette.module.css` | Styles — input, results list, active highlight |
| `src/components/TreeNav.tsx` | Expandable single-select navigation tree |
| `src/components/TreeNav.module.css` | Styles — chevrons, indented branches, link hover |

## Files modified

| File | Change |
|---|---|
| `tests/smoke.test.ts` | Added type-level instantiation checks + named export entries |
| `examples/App.tsx` | Added 7 demo ComponentBlocks in Controls, Data display, Overlays sections |
| `examples/App.module.css` | Added sliderSpecimen, breadcrumbSpecimen, treeNavFrame styles |

Note: `src/index.ts` already had export stubs from the prior ContextMenu commit.

### Added during implementation

8. **Handoff back to readrun** — wrote `docs/handoff-to-readrun.md` with:
   - What was built (all 7 gap components + ContextMenu)
   - How to install and consume `ui` (dependency setup, ThemeProvider)
   - Chrome/content split pattern for theme coexistence
   - Component migration map (readrun hand-rolled → ui replacement)
   - Theme mapping (readrun's 8 themes → ui appearance + coloring)
   - Usage examples for each component
   - Component contracts quick-reference table
   - Next steps for the readrun integration effort

## Deviations from plan

None. All components built as specced in handoff.md. Added the readrun handoff document as a closing step.
