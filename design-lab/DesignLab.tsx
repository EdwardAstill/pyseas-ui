import "../src/styles.css";

import { useState, type CSSProperties } from "react";

import { Button } from "../src/components/Button";
import {
	ContextMenu,
	type ContextMenuItem,
} from "../src/components/ContextMenu";
import { NumberField } from "../src/components/NumberField";
import { Panel } from "../src/components/Panel";
import { Result } from "../src/components/Result";
import { StatusBadge } from "../src/components/StatusBadge";
import { TextField } from "../src/components/TextField";
import { ThemeProvider } from "../src/components/ThemeProvider";
import { Toolbar } from "../src/components/Toolbar";
import styles from "./DesignLab.module.css";

type Theme = "dark" | "light";
type FontMode = "bun" | "inter" | "plex";

const monoStack =
	'"JetBrains Mono", "Fira Code", "Hack", "Source Code Pro", "SF Mono", ui-monospace, monospace';

const fontModes: Record<
	FontMode,
	{ label: string; sans: string; mono: string; note: string }
> = {
	bun: {
		label: "Bun-like",
		sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
		mono: monoStack,
		note: "system UI with JetBrains Mono numbers",
	},
	inter: {
		label: "Inter",
		sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		mono: monoStack,
		note: "cleaner custom sans, same Bun-like mono",
	},
	plex: {
		label: "IBM Plex Sans",
		sans: '"IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
		mono: monoStack,
		note: "more engineered, still restrained",
	},
};

interface ContextMenuState {
	x: number;
	y: number;
}

const ctxMenuItems: ContextMenuItem[] = [
	{ label: "Rename", shortcut: "F2", onClick: () => alert("Rename") },
	{ label: "Duplicate", shortcut: "Ctrl+D", onClick: () => alert("Duplicate") },
	{ type: "divider" },
	{ label: "Cut", shortcut: "Ctrl+X", onClick: () => alert("Cut") },
	{ label: "Copy", shortcut: "Ctrl+C", onClick: () => alert("Copy") },
	{
		label: "Paste",
		shortcut: "Ctrl+V",
		disabled: true,
		onClick: () => alert("Paste"),
	},
	{ type: "divider" },
	{
		label: "Delete",
		shortcut: "Del",
		disabled: true,
		onClick: () => alert("Delete"),
	},
];

export function DesignLab() {
	const [theme, setTheme] = useState<Theme>("dark");
	const [fontMode, setFontMode] = useState<FontMode>("bun");
	const [label, setLabel] = useState("Controlled field");
	const [primaryValue, setPrimaryValue] = useState<number | null>(128.5);
	const [secondaryValue, setSecondaryValue] = useState<number | null>(250);
	const [ratio, setRatio] = useState<number | null>(0.72);
	const [ctxMenu, setCtxMenu] = useState<ContextMenuState | null>(null);

	return (
		<ThemeProvider theme={theme}>
			<main
				className={styles.page}
				style={
					{
						"--lab-font-sans": fontModes[fontMode].sans,
						"--lab-font-mono": fontModes[fontMode].mono,
					} as CSSProperties
				}
			>
				<header className={styles.header}>
					<div>
						<span className={styles.kicker}>ui design lab</span>
						<h1 className={styles.title}>Font and number field direction</h1>
						<p className={styles.copy}>
							Separate live surface for comparing Bun-style typography and
							spinner-free numeric input treatment.
						</p>
					</div>
					<Toolbar>
						<Button
							size="sm"
							variant={theme === "dark" ? "primary" : "default"}
							onClick={() => setTheme("dark")}
						>
							Dark
						</Button>
						<Button
							size="sm"
							variant={theme === "light" ? "primary" : "default"}
							onClick={() => setTheme("light")}
						>
							Light
						</Button>
					</Toolbar>
				</header>

				<section className={styles.fontPanel}>
					<Panel
						title="Font direction"
						headerActions={
							<StatusBadge
								variant="info"
								label={fontModes[fontMode].label}
								size="control"
							/>
						}
					>
						<div className={styles.fontOptions}>
							{(Object.keys(fontModes) as FontMode[]).map((mode) => (
								<button
									key={mode}
									type="button"
									className={styles.fontOption}
									data-active={fontMode === mode ? "true" : undefined}
									onClick={() => setFontMode(mode)}
									style={
										{
											"--font-option-sans": fontModes[mode].sans,
											"--font-option-mono": fontModes[mode].mono,
										} as CSSProperties
									}
								>
									<span className={styles.fontOptionName}>
										{fontModes[mode].label}
									</span>
									<span className={styles.fontOptionSample}>
										Number fields 128.5 / 250 / 0.72
									</span>
									<span className={styles.fontOptionNote}>
										{fontModes[mode].note}
									</span>
								</button>
							))}
						</div>
					</Panel>
				</section>

				<section className={styles.stage}>
					<Panel
						title="Form specimen"
						headerActions={
							<StatusBadge variant="ok" label="spinner-free" size="control" />
						}
					>
						<div className={styles.formGrid}>
							<TextField
								label="Label"
								hint="context field"
								value={label}
								onChange={setLabel}
							/>
							<NumberField
								label="Value"
								hint="click, hover, then wheel; ArrowUp / ArrowDown also step"
								value={primaryValue}
								onChange={setPrimaryValue}
								min={0}
								step={0.5}
							/>
							<NumberField
								label="Limit"
								hint="right aligned, no browser spinner"
								value={secondaryValue}
								onChange={setSecondaryValue}
								min={0}
								step={5}
							/>
							<NumberField
								label="Ratio"
								hint="wheel while focused steps by 0.01"
								value={ratio}
								onChange={setRatio}
								min={0}
								max={2}
								step={0.01}
							/>
						</div>
					</Panel>

					<Panel title="Readout specimen">
						<div className={styles.readout}>
							<Result
								label="Primary value"
								value={primaryValue ?? "empty"}
								unit="unit"
								status="ok"
							/>
							<Result
								label="Limit"
								value={secondaryValue ?? "empty"}
								unit="unit"
							/>
							<Result
								label="Ratio"
								value={ratio ?? "empty"}
								status="info"
								ratio={`${ratio ?? "-"} / 1.00`}
							/>
						</div>
					</Panel>
				</section>

				{/* Context menu demo */}
				<section className={styles.ctxSection}>
					<Panel
						title="Context menu specimen"
						headerActions={
							<StatusBadge variant="info" label="right-click" size="control" />
						}
					>
						<div
							className={styles.ctxTarget}
							onContextMenu={(e) => {
								e.preventDefault();
								setCtxMenu({ x: e.clientX, y: e.clientY });
							}}
						>
							<span className={styles.ctxHint}>
								Right-click anywhere in this area
							</span>
							<div className={styles.ctxGrid}>
								{[
									"index.tsx",
									"App.tsx",
									"utils.ts",
									"types.d.ts",
									"styles.module.css",
								].map((f) => (
									<div key={f} className={styles.ctxFile}>
										<span className={styles.ctxFileIcon}>📄</span>
										<span className={styles.ctxFileName}>{f}</span>
									</div>
								))}
							</div>
						</div>
					</Panel>
				</section>

				{ctxMenu !== null && (
					<ContextMenu
						items={ctxMenuItems}
						x={ctxMenu.x}
						y={ctxMenu.y}
						onClose={() => setCtxMenu(null)}
					/>
				)}
			</main>
		</ThemeProvider>
	);
}
