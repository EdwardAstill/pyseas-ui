# ui

**A living style reference for every app I build.**

This repo exists for one reason: when I start a browser UI, I point the
thing I'm building here and say *"your UI should look like one of these."*
It holds opinionated, copy‑pasteable reference designs showing up in
three forms:

- **Showcase** — a realistic, opinionated product screen. What the whole
  thing feels like once components are composed: dashboards, feature
  explorers, navigation, the works.
- **Style guide** — the token + component reference. Colour palette,
  borders, buttons, inputs, cards, alerts, typography. The atoms.
- **Viz** — interactive visualizations rendered in the same theme shell.

When I hand another agent / app off to "match the style", they open this
repo and browse. That's the whole product.

---

## How to run it

The dispatcher is `bin/ui` (symlink or `PATH`-add it). No args starts the
main browser app at `http://localhost:3000/`. The site has Themes, Style,
and Viz sections in the same shell.

```
ui                             start the main web site
ui help                        show CLI help
```

---

## Layout

```
ui/
├── bin/ui                      # dispatcher (Bun)
├── index.html                  # web entry
├── server.ts                   # bun dev server
├── src/
│   └── web/                    # browser UI — TypeScript + React only
│       ├── frontend.tsx        # unified web shell: themes, style, viz
│       ├── showcase/
│       │   ├── themes/         # 23 theme components (Terminal, Glass, …)
│       │   └── components/     # shared helpers (FeatureCard)
│       ├── viz/                # interactive JSX visualizations
│       └── style/
│           └── StyleGuide.tsx
```

**Rules of the house:**

- Anything web = TypeScript + React. No frameworks, no build config beyond
  what Bun gives us for free.
- The web app includes `showcase/`, `style/`, and `viz/` in one shell.

---

## Pointing an agent here

> "Build this feature. The UI should match the `ui` repo at
> `<path>/ui`. Run `ui` and browse the browser themes, style guide, and
> visualizations. Copy the idiom, not the exact markup."

That's it. The showcase says *what a composed screen feels like*, the
style guide says *which atoms to build from*, and Viz shows how motion
and interaction fit the same theme shell.
