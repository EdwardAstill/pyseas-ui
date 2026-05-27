import type {
	CsvData,
	LayoutNode,
	ThemeAppearanceName,
	ThemeColoringName,
} from "../src/index";

type WorkspaceTab = "panel-a" | "panel-b" | "panel-c" | "panel-d";

export type ThemeAppearance = ThemeAppearanceName;
export type ThemeColoring = ThemeColoringName;
export type InputTab = "underline" | "bracket" | "slash";
export type PaneRail = "rail-a" | "rail-b" | "rail-c";
export type PaneSection = "section-a" | "section-b";
export type WorkspacePanelTab = WorkspaceTab;
export type NavSectionId =
	| "theming"
	| "controls"
	| "data-display"
	| "layout-components"
	| "viewers";

export const appearanceOptions: Array<{
	value: ThemeAppearance;
	label: string;
}> = [
	{ value: "bun", label: "Bun" },
	{ value: "default", label: "Default" },
	{ value: "compact", label: "Compact" },
];

export const coloringOptions: Array<{
	value: ThemeColoring;
	label: string;
}> = [
	{ value: "dark", label: "Dark" },
	{ value: "light", label: "Light" },
	{ value: "neon-pink", label: "Neon Pink" },
	{ value: "cobalt", label: "Cobalt" },
];

export const selectOptions = [
	{ value: "alpha", label: "Option alpha" },
	{ value: "beta", label: "Option beta" },
	{ value: "gamma", label: "Option gamma", disabled: true },
];

export const navItems: Array<{ id: NavSectionId; label: string }> = [
	{ id: "theming", label: "Themes" },
	{ id: "controls", label: "Controls" },
	{ id: "data-display", label: "Data" },
	{ id: "layout-components", label: "Layout" },
	{ id: "viewers", label: "Viewers" },
];

export const workspaceLayout: LayoutNode<WorkspaceTab> = {
	type: "split",
	dir: "row",
	sizes: [0.34, 0.66],
	children: [
		{
			type: "leaf",
			id: "workspace-left",
			tabs: ["panel-a", "panel-b"],
			activeTab: "panel-a",
		},
		{
			type: "split",
			dir: "col",
			sizes: [0.58, 0.42],
			children: [
				{
					type: "leaf",
					id: "workspace-top",
					tabs: ["panel-c"],
					activeTab: "panel-c",
				},
				{
					type: "leaf",
					id: "workspace-bottom",
					tabs: ["panel-d"],
					activeTab: "panel-d",
				},
			],
		},
	],
};

export const workspaceLabels: Record<WorkspaceTab, string> = {
	"panel-a": "<PaneShell>",
	"panel-b": "<Tabs>",
	"panel-c": "<DrawingViewer>",
	"panel-d": "<LogView>",
};

export const drawingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 160" role="img" aria-label="DrawingViewer sample">
  <rect x="28" y="42" width="204" height="76" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="96" cy="80" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="164" cy="80" r="22" fill="none" stroke="currentColor" stroke-width="2"/>
  <path d="M52 132 H208" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="5 5"/>
  <path d="M96 34 V126 M164 34 V126" fill="none" stroke="currentColor" stroke-width="1"/>
  <text x="130" y="150" text-anchor="middle" font-size="10" font-family="monospace" fill="currentColor">DrawingSource.kind = svg</text>
</svg>`;

// -- Viewer demo data --

export const csvDemoData: CsvData = {
	headers: ["ID", "Name", "Type", "Mass (kg)", "Status"],
	rows: [
		["SH-001", "Shackle GN ROV H7", "Component", "12.4", "OK"],
		["PD-042", "Padeye design check", "Analysis", "—", "PASS"],
		["SL-018", "Sling assembly 12m", "Component", "8.7", "OK"],
		["LP-003", "Lift point 1", "Arrangement", "—", "REVIEW"],
		["LC-007", "Load case: offshore", "Load", "—", "PASS"],
		["SB-01", "Spreader bar SB-01", "Component", "164.0", "OK"],
		["WR-202", "Weight report", "Report", "—", "DRAFT"],
		["PD-101", "Padeye weld check", "Analysis", "—", "PASS"],
		["SL-022", "Sling assembly 8m", "Component", "6.1", "OK"],
		["LP-007", "Lift point 2", "Arrangement", "—", "REVIEW"],
		["LC-012", "Load case: inshore", "Load", "—", "PASS"],
		["SH-019", "Shackle GN ROV H3", "Component", "9.8", "OK"],
	],
};

export const codeDemoSnippet = `import { Button, Panel, Toolbar } from "pyseas-ui";

interface LiftPointProps {
  id: string;
  capacity: number;
  onCheck: (id: string) => void;
}

export function LiftPointCard({ id, capacity, onCheck }: LiftPointProps) {
  const ratio = capacity / 120; // 120 kN reference
  const status = ratio >= 1.0 ? "ok" : ratio >= 0.85 ? "warn" : "err";

  return (
    <Panel title={\`Lift point \${id}\`}>
      <Toolbar>
        <StatusBadge variant={status} label={\`\${(ratio * 100).toFixed(0)}%\`} />
        <Button size="sm" variant="primary" onClick={() => onCheck(id)}>
          Check
        </Button>
      </Toolbar>
    </Panel>
  );
}`;

export const textDemoContent = `Shipment manifest — Gorgon Phase 2
=======================================

Vessel:       "Ocean Hercules"
Departure:    2026-06-14 08:00 UTC
Destination:  Barrow Island, AU

Cargo items:
  1. Spreader bar SB-01          12 400 kg
  2. Shackle GN ROV H7 × 4        3 200 kg
  3. Sling assembly 12m × 2       1 740 kg
  4. Padeye weldment PD-042         880 kg
  5. Lift point fixture LP-003      420 kg
  -----------------------------------------
  Total:                         18 640 kg

Certification:  DNV-ST-N001 (2021)
Inspected by:   A. Morrison, 2026-06-12

Notes:
  - All shackles torqued to 180 N·m per maintenance log
  - Spreader bar SB-01 tag updated after June inspection
  - Padeye PD-042 re-checked; OK per weld report WR-202
  - Lift point LP-007 was removed from manifest (deferred)

End of manifest.
`;

export const pdfDemoSrc =
	"data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL01lZGlhQm94WzAgMCAzMDAgMTUwXS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDw+Pj4+ZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKdHJhaWxlcjw8L1NpemUgNC9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjIwNgolJUVPRA==";

const dxfDemoContent = `0
SECTION
2
ENTITIES
0
LINE
8
0
10
0
20
0
30
0
11
100
21
0
31
0
0
CIRCLE
8
0
10
50
20
30
30
0
40
20
0
ENDSEC
0
EOF`;

export const markdownDemoContent = `# Lift Point Design Check

## Input parameters

| Parameter | Value | Unit |
|---|---|---|
| Shackle diameter | 32 | mm |
| Material grade | S355 | — |
| Design load | 120 | kN |
| Safety factor | 2.5 | — |

## Check results

The padeye passes all checks at the reference orientation.

### Shear capacity

Phrase it as a limit-equilibrium check:

$$V_{Rd} = \\frac{0.6 \\cdot f_y \\cdot A_v}{\\gamma_M} = \\frac{0.6 \\cdot 355 \\cdot 2010}{1.0} = 428\\ \\text{kN}$$

The utilisation ratio is comfortable:

$$ U = \\frac{V_{Ed}}{V_{Rd}} = \\frac{120}{428} = 0.28 $$

### Bearing check

For a 32 mm pin in a 34 mm hole:

$$ \\sigma_{br} = \\frac{F}{d \\cdot t} = \\frac{120 \\times 10^3}{32 \\cdot 25} = 150\\ \\text{MPa} $$

### Weld check

Two 8 mm fillets, 100 mm long each:

$$ \\tau_{\\parallel} = \\frac{F}{2 \\cdot a \\cdot L} = \\frac{120 \\times 10^3}{2 \\cdot 8 \\cdot 100} = 75\\ \\text{MPa} $$

> **Note:** All welds are full-penetration and were inspected per DNV-ST-N001.

## Summary

- [x] Shear capacity OK
- [x] Bearing capacity OK
- [x] Weld strength OK
- [x] Edge distance OK

**Recommendation:** Approve for offshore lift.
`;

export const dxfDemoSrc = `data:application/dxf;charset=utf-8,${encodeURIComponent(
	dxfDemoContent,
)}`;

const stepDemoMesh = {
	success: true,
	meshes: [
		{
			name: "demo-cube",
			color: [0.42, 0.55, 0.74],
			attributes: {
				position: {
					array: [
						-1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1,
						1, 1, -1, 1, 1,
					],
				},
			},
			index: {
				array: [
					0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6,
					2, 2, 6, 7, 2, 7, 3, 3, 7, 4, 3, 4, 0,
				],
			},
		},
	],
};

export const stepDemoMeshSrc = `data:application/json;charset=utf-8,${encodeURIComponent(
	JSON.stringify(stepDemoMesh),
)}`;

export const logLines = [
	"[info] component mounted",
	"[info] controlled value changed",
	"[warn] disabled option skipped",
	"[ok] render complete",
];

export const freeformCardLabels = [
	"Shackle GN ROV H7",
	"Padeye design check",
	"Sling assembly 12m",
	"Lift point 1",
	"Load case: offshore",
	"Spreader bar SB-01",
	"Weight report",
];

export const freeformCardTags = [
	"Component",
	"Analysis",
	"Component",
	"Arrangement",
	"Load",
	"Component",
	"Report",
];
