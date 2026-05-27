import "../src/styles.css";

import { useEffect, useMemo, useState } from "react";

import styles from "./App.module.css";
import {
	AppShell,
	Button,
	CadDxfViewer,
	CadStepViewer,
	Checkbox,
	CodeViewer,
	CsvViewer,
	Dialog,
	DrawingViewer,
	FreeformCanvas,
	IconButton,
	IconSidebar,
	LogView,
	NumberField,
	PaneShell,
	Panel,
	PdfViewer,
	Result,
	Select,
	SortableList,
	StatusBadge,
	SvgViewer,
	StatusBar,
	Tabs,
	TextField,
	TextViewer,
	ThemeProvider,
	Toggle,
	Toolbar,
	TopBar,
	Tree,
	Workspace,
	type FreeformCanvasItem,
	type TreeMoveArgs,
	type TreeNode,
} from "../src/index";
import { classNames, ComponentBlock, DocSection } from "./catalogShared";
import {
	appearanceOptions,
	codeDemoSnippet,
	coloringOptions,
	csvDemoData,
	drawingSvg,
	dxfDemoSrc,
	freeformCardLabels,
	freeformCardTags,
	logLines,
	navItems,
	pdfDemoSrc,
	selectOptions,
	stepDemoMeshSrc,
	textDemoContent,
	workspaceLabels,
	workspaceLayout,
	type InputTab,
	type NavSectionId,
	type PaneRail,
	type PaneSection,
	type ThemeAppearance,
	type ThemeColoring,
	type WorkspacePanelTab,
} from "./catalogData";
import {
	canDropFileTreeNode,
	initialFileTreeNodes,
	moveFileTreeNode,
	renderFileTreeDisclosure,
	renderFileTreeNode,
	treeVisualOptions,
	type FileSystemNodeMeta,
	type TreeVisualOption,
} from "./fileTreeDemo";

export function App() {
	const [theme, setTheme] = useState<ThemeAppearance>("bun");
	const [coloring, setColoring] = useState<ThemeColoring>("neon-pink");
	const [textValue, setTextValue] = useState("Controlled text");
	const [numberValue, setNumberValue] = useState<number | null>(42);
	const [selectValue, setSelectValue] = useState<string | null>("beta");
	const [checked, setChecked] = useState(true);
	const [indeterminate, setIndeterminate] = useState(false);
	const [toggleValue, setToggleValue] = useState(true);
	const [inputTab, setInputTab] = useState<InputTab>("underline");
	const [paneRail, setPaneRail] = useState<PaneRail>("rail-a");
	const [paneSection, setPaneSection] = useState<PaneSection>("section-a");
	const [treeNodes, setTreeNodes] =
		useState<TreeNode<FileSystemNodeMeta>[]>(initialFileTreeNodes);
	const [treeExpanded, setTreeExpanded] = useState<Set<string>>(
		() => new Set(["workspace", "src", "src-components", "examples", "tests"]),
	);
	const [treeSelected, setTreeSelected] = useState<string | null>(
		"src-components-tree",
	);
	const [treeVisual, setTreeVisual] = useState<TreeVisualOption>("blocks");
	const [sortableValues, setSortableValues] = useState([
		"Shackle GN ROV H7",
		"Padeye design check",
		"Sling assembly 12m",
		"Lift point 1",
		"Load case: offshore",
		"Spreader bar SB-01",
		"Weight report",
	]);
	const [freeformItems, setFreeformItems] = useState<FreeformCanvasItem[]>([
		{ id: "a", x: 20, y: 20 },
		{ id: "b", x: 240, y: 20 },
		{ id: "c", x: 460, y: 20 },
		{ id: "d", x: 20, y: 150 },
		{ id: "e", x: 240, y: 150 },
		{ id: "f", x: 460, y: 150 },
		{ id: "g", x: 20, y: 280 },
	]);
	const [freeformSelected, setFreeformSelected] = useState<string | null>(null);
	const [sidebarItem, setSidebarItem] = useState("one");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [navOpen, setNavOpen] = useState(false);
	const [activeSection, setActiveSection] = useState<NavSectionId>("theming");

	useEffect(() => {
		function updateActiveSection() {
			const anchorY = window.scrollY + 140;
			let nextSection: NavSectionId = navItems[0]!.id;

			for (const item of navItems) {
				const section = document.getElementById(item.id);
				if (section !== null && section.offsetTop <= anchorY)
					nextSection = item.id;
			}

			setActiveSection(nextSection);
		}

		updateActiveSection();
		window.addEventListener("scroll", updateActiveSection, { passive: true });
		window.addEventListener("resize", updateActiveSection);

		return () => {
			window.removeEventListener("scroll", updateActiveSection);
			window.removeEventListener("resize", updateActiveSection);
		};
	}, []);

	const paneRailItems = useMemo(
		() => [
			{ value: "rail-a", label: "Rail A" },
			{ value: "rail-b", label: "Rail B" },
			{ value: "rail-c", label: "Rail C", disabled: true },
		],
		[],
	);
	const paneSectionItems = useMemo(
		() => [
			{ value: "section-a", label: "Section A" },
			{ value: "section-b", label: "Section B" },
		],
		[],
	);

	function handleTreeMove(args: TreeMoveArgs<FileSystemNodeMeta>) {
		setTreeNodes((nodes) => moveFileTreeNode(nodes, args));
		setTreeSelected(args.draggedId);

		if (args.position === "inside") {
			setTreeExpanded((expanded) => {
				const next = new Set(expanded);
				next.add(args.targetId);
				return next;
			});
		}
	}

	function renderWorkspacePanel(tab: WorkspacePanelTab) {
		if (tab === "panel-c") {
			return (
				<PaneShell flushBody>
					<DrawingViewer
						source={{
							kind: "svg",
							content: drawingSvg,
							label: "<DrawingViewer>",
						}}
						metadata="status=ready"
					/>
				</PaneShell>
			);
		}

		if (tab === "panel-d") {
			return (
				<PaneShell flushBody>
					<LogView lines={logLines} style={{ height: "100%", border: 0 }} />
				</PaneShell>
			);
		}

		return (
			<PaneShell>
				<div className={styles.specimenText}>
					{tab === "panel-a"
						? "Workspace renderPanel: panel-a"
						: "Workspace renderPanel: panel-b"}
				</div>
			</PaneShell>
		);
	}

	return (
		<ThemeProvider theme={theme} coloring={coloring}>
			<div className={styles.catalog}>
				<div className={styles.announcement}>
					pyseas-ui demo, tuned toward bun.com →
				</div>

				<header className={styles.header}>
					<a className={styles.brand} href="#" aria-label="pyseas-ui demo home">
						<span className={styles.bunMark} aria-hidden="true">
							ps
						</span>
						<span>pyseas-ui</span>
					</a>
					<nav
						className={classNames(
							styles.headerNav,
							navOpen && styles.headerNavOpen,
						)}
						aria-label="Catalog sections"
					>
						{navItems.map((item) => (
							<a
								key={item.id}
								className={
									activeSection === item.id
										? styles.headerNavLinkActive
										: undefined
								}
								href={`#${item.id}`}
								aria-current={
									activeSection === item.id ? "location" : undefined
								}
								onClick={() => {
									setActiveSection(item.id);
									setNavOpen(false);
								}}
							>
								{item.label}
							</a>
						))}
					</nav>
					<Toolbar>
						<button
							className={classNames(
								styles.hamburger,
								navOpen && styles.hamburgerOpen,
							)}
							type="button"
							aria-label={navOpen ? "Close navigation" : "Open navigation"}
							aria-expanded={navOpen}
							onClick={() => setNavOpen((open) => !open)}
						>
							<span className={styles.hamburgerBar} />
							<span className={styles.hamburgerBar} />
						</button>
					</Toolbar>
				</header>

				<section className={styles.hero} aria-labelledby="demo-title">
					<div className={styles.headerText}>
						<span className={styles.releasePill}>Bun theme for the demo →</span>
						<h1 id="demo-title" className={styles.title}>
							<span className={styles.titleCode}>bun demo</span>
							<span>component catalog</span>
						</h1>
						<p className={styles.summary}>
							Same exported pyseas-ui components, presented with a bun.com-style
							shell: charcoal surfaces, pink accents, rounded code panels, and
							dense developer-tool chrome.
						</p>
						<div className={styles.heroActions}>
							<Button
								variant="primary"
								onClick={() =>
									document
										.getElementById("controls")
										?.scrollIntoView({ behavior: "smooth" })
								}
							>
								Browse components
							</Button>
							<Button
								onClick={() =>
									document
										.getElementById("theming")
										?.scrollIntoView({ behavior: "smooth" })
								}
							>
								Token packs
							</Button>
						</div>
						<div className={styles.installCard} aria-label="Demo command">
							<span className={styles.prompt}>$</span>
							<code>bun run demo</code>
							<span className={styles.copyGlyph} aria-hidden="true">
								⌘
							</span>
						</div>
						<p className={styles.heroFootnote}>
							Theme switcher stays available; the demo opens on the Bun pack by
							default.
						</p>
					</div>

					<aside
						className={styles.previewCard}
						aria-label="Bun-style component preview"
					>
						<Tabs
							items={[
								{ value: "underline", label: "Controls" },
								{ value: "bracket", label: "Surfaces" },
								{ value: "slash", label: "Layout" },
							]}
							value={inputTab}
							onChange={(value) => setInputTab(value as InputTab)}
						/>
						<div className={styles.previewBody}>
							<div className={styles.metricRows}>
								<div className={styles.metricRow}>
									<span>Button</span>
									<span className={styles.metricBarTrack}>
										<span
											className={classNames(
												styles.metricBarFill,
												styles.metricBarFillSm,
											)}
										/>
									</span>
									<code>24 px</code>
								</div>
								<div className={styles.metricRow}>
									<span>Field</span>
									<span className={styles.metricBarTrack}>
										<span
											className={classNames(
												styles.metricBarFill,
												styles.metricBarFillMd,
											)}
										/>
									</span>
									<code>30 px</code>
								</div>
								<div className={styles.metricRow}>
									<span>Panel</span>
									<span className={styles.metricBarTrack}>
										<span
											className={classNames(
												styles.metricBarFill,
												styles.metricBarFillLg,
											)}
										/>
									</span>
									<code>34 px</code>
								</div>
								<div className={styles.metricRow}>
									<span>Workspace</span>
									<span className={styles.metricBarTrack}>
										<span
											className={classNames(
												styles.metricBarFill,
												styles.metricBarFillXl,
											)}
										/>
									</span>
									<code>4 panes</code>
								</div>
							</div>
							<Result
								label="Reference fit"
								value={0.92}
								status="ok"
								ratio="bun.com-inspired"
							/>
							<Toolbar>
								<StatusBadge variant="info" label={theme} size="control" />
								<Button size="sm" variant="primary">
									Primary
								</Button>
								<Button size="sm">Default</Button>
							</Toolbar>
						</div>
					</aside>
				</section>

				<main className={styles.sections}>
					<DocSection title="Theming">
						<ComponentBlock
							name="<ThemeProvider>"
							source="src/components/ThemeProvider.tsx"
							meta={`theme={appearance} coloring={color scheme} overrides={custom vars}`}
						>
							<div className={styles.themePickerLabel}>Appearance pack</div>
							<div className={styles.themeGrid}>
								{appearanceOptions.map((option) => (
									<ThemeProvider
										key={option.value}
										theme={option.value}
										coloring={coloring}
									>
										<button
											type="button"
											className={classNames(
												styles.themeSample,
												theme === option.value && styles.themeSampleActive,
											)}
											onClick={() => setTheme(option.value)}
										>
											<span className={styles.themeSampleTopline}>
												<StatusBadge variant="info" label={option.label} />
												<span
													className={styles.themeSampleTicks}
													aria-hidden="true"
												>
													<span />
													<span />
													<span />
												</span>
											</span>
											<span>{option.value}</span>
										</button>
									</ThemeProvider>
								))}
							</div>
							<div
								className={classNames(
									styles.themePickerLabel,
									styles.themePickerLabelSpaced,
								)}
							>
								Coloring scheme
							</div>
							<div className={styles.themeGrid}>
								{coloringOptions.map((option) => (
									<ThemeProvider
										key={option.value}
										theme={theme}
										coloring={option.value}
									>
										<button
											type="button"
											className={classNames(
												styles.coloringSample,
												coloring === option.value &&
													styles.coloringSampleActive,
											)}
											onClick={() => setColoring(option.value)}
										>
											<span className={styles.coloringSwatch}>
												<span
													className={styles.coloringDot}
													style={{ background: "var(--ps-surface)" }}
												/>
												<span
													className={styles.coloringDot}
													style={{ background: "var(--ps-accent)" }}
												/>
												<span
													className={styles.coloringDot}
													style={{ background: "var(--ps-text-muted)" }}
												/>
											</span>
											<span>{option.label}</span>
										</button>
									</ThemeProvider>
								))}
							</div>
						</ComponentBlock>
					</DocSection>

					<DocSection title="Controls">
						<div className={styles.grid}>
							<ComponentBlock
								name="<Button>"
								source="src/components/Button.tsx"
								meta="variants: default | primary | danger | ghost; sizes: sm | md"
							>
								<div className={styles.wrapRow}>
									<Button>Default</Button>
									<Button variant="primary">Primary</Button>
									<Button variant="danger">Danger</Button>
									<Button variant="ghost">Ghost</Button>
									<Button size="sm">Small</Button>
									<Button icon={<span>+</span>}>Icon</Button>
									<Button loading>Loading</Button>
									<Button disabled>Disabled</Button>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<IconButton>"
								source="src/components/IconButton.tsx"
								meta="icon-only Button variant; title is required"
							>
								<div className={styles.wrapRow}>
									<IconButton
										title="Default icon button"
										icon={<span>A</span>}
									/>
									<IconButton
										title="Primary icon button"
										variant="primary"
										icon={<span>B</span>}
									/>
									<IconButton
										title="Danger icon button"
										variant="danger"
										icon={<span>C</span>}
									/>
									<IconButton
										title="Small icon button"
										size="sm"
										icon={<span>+</span>}
									/>
									<IconButton
										title="Loading icon button"
										loading
										icon={<span>L</span>}
									/>
									<IconButton
										title="Disabled icon button"
										disabled
										icon={<span>D</span>}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<Toolbar>"
								source="src/components/Toolbar.tsx"
								meta="horizontal control cluster"
							>
								<Toolbar>
									<Button size="sm">One</Button>
									<Button size="sm" variant="primary">
										Two
									</Button>
									<IconButton
										title="Toolbar action"
										size="sm"
										icon={<span>+</span>}
									/>
									<StatusBadge variant="ok" label="ok" size="control" />
								</Toolbar>
							</ComponentBlock>

							<ComponentBlock
								name="<Tabs>"
								source="src/components/Tabs.tsx"
								meta="orientation: horizontal | vertical; marker: underline | bracket | slash"
							>
								<div className={styles.tabsGrid}>
									<Tabs
										items={[
											{ value: "underline", label: "Underline" },
											{ value: "bracket", label: "Bracket" },
											{ value: "slash", label: "Slash" },
										]}
										value={inputTab}
										onChange={(value) => setInputTab(value as InputTab)}
									/>
									<Tabs
										items={[
											{ value: "underline", label: "Underline" },
											{ value: "bracket", label: "Bracket" },
											{ value: "slash", label: "Slash" },
										]}
										value={inputTab}
										marker="slash"
										onChange={(value) => setInputTab(value as InputTab)}
									/>
									<div className={styles.verticalTabsFrame}>
										<Tabs
											items={[
												{ value: "underline", label: "Alpha" },
												{ value: "bracket", label: "Beta" },
												{ value: "slash", label: "Gamma", disabled: true },
											]}
											value={inputTab}
											orientation="vertical"
											marker="bracket"
											onChange={(value) => setInputTab(value as InputTab)}
										/>
									</div>
								</div>
							</ComponentBlock>
						</div>
					</DocSection>

					<DocSection title="Fields">
						<ComponentBlock
							name="<TextField> / <NumberField> / <Select> / <Checkbox> / <Toggle>"
							source="src/components/FieldRoot.tsx"
							meta="shared field chrome, hints, error, read-only, disabled, and boolean states"
						>
							<div className={styles.fieldGrid}>
								<TextField
									label="<TextField>"
									hint="controlled string value"
									value={textValue}
									onChange={setTextValue}
								/>
								<TextField
									label="<TextField error>"
									value="Invalid"
									onChange={() => {}}
									error
								/>
								<TextField
									label="<TextField readOnly>"
									value="Read only"
									onChange={() => {}}
									readOnly
								/>
								<NumberField
									label="<NumberField>"
									hint="number | null"
									value={numberValue}
									onChange={setNumberValue}
									min={0}
									step={1}
								/>
								<NumberField
									label="<NumberField empty>"
									value={null}
									onChange={() => {}}
									placeholder="0"
								/>
								<Select
									label="<Select>"
									options={selectOptions}
									value={selectValue}
									onChange={setSelectValue}
									placeholder="Select option"
								/>
								<div className={styles.controlStack}>
									<Checkbox
										checked={checked}
										onChange={setChecked}
										label="<Checkbox checked>"
									/>
									<Checkbox
										checked={false}
										onChange={() => {}}
										label="<Checkbox disabled>"
										disabled
									/>
									<Checkbox
										checked={false}
										indeterminate={indeterminate}
										onChange={(next) => {
											setIndeterminate(false);
											setChecked(next);
										}}
										label="<Checkbox indeterminate>"
									/>
									<Button
										size="sm"
										variant="ghost"
										onClick={() => setIndeterminate((value) => !value)}
									>
										Toggle indeterminate
									</Button>
								</div>
								<div className={styles.controlStack}>
									<Toggle
										value={toggleValue}
										onChange={setToggleValue}
										label="<Toggle md>"
									/>
									<Toggle
										value={!toggleValue}
										onChange={() => {}}
										label="<Toggle sm>"
										size="sm"
									/>
									<Toggle
										value={false}
										onChange={() => {}}
										label="<Toggle disabled>"
										disabled
									/>
								</div>
							</div>
						</ComponentBlock>
					</DocSection>

					<DocSection title="Status and output">
						<div className={styles.grid}>
							<ComponentBlock
								name="<StatusBadge>"
								source="src/components/StatusBadge.tsx"
								meta="variants: ok | warn | err | info"
							>
								<div className={styles.wrapRow}>
									<StatusBadge variant="ok" />
									<StatusBadge variant="warn" />
									<StatusBadge variant="err" />
									<StatusBadge variant="info" />
									<StatusBadge variant="info" label="custom label" />
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<Result>"
								source="src/components/Result.tsx"
								meta="label, value, unit, ratio, note, status"
							>
								<div className={styles.resultStack}>
									<Result
										label="Result ok"
										value={0.72}
										status="ok"
										ratio="0.72 / 1.00"
									/>
									<Result
										label="Result warn"
										value={0.94}
										status="warn"
										ratio="0.94 / 1.00"
										note="note prop"
									/>
									<Result
										label="Result err"
										value="ERR"
										status="err"
										ratio="1.08 / 1.00"
									/>
									<Result label="Result none" value={120} unit="unit" />
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<LogView>"
								source="src/components/LogView.tsx"
								meta="streamed monospace lines; wrapLines optional"
							>
								<LogView lines={logLines} maxHeight={160} />
							</ComponentBlock>
						</div>
					</DocSection>

					<DocSection title="Data display">
						<div className={styles.grid}>
							<ComponentBlock
								name="<Tree>"
								source="src/components/Tree.tsx"
								meta="controlled filesystem mockup with drag-to-move"
							>
								<div
									className={styles.treeVisualPanel}
									aria-label="Tree visual options"
								>
									{treeVisualOptions.map((option) => (
										<button
											key={option.value}
											type="button"
											className={classNames(
												styles.treeVisualOption,
												treeVisual === option.value &&
													styles.treeVisualOptionActive,
											)}
											onClick={() => setTreeVisual(option.value)}
										>
											<span
												className={styles.treeVisualPreview}
												aria-hidden="true"
											>
												<span className={styles.treeVisualPreviewLine}>
													{renderFileTreeDisclosure(
														{
															node: initialFileTreeNodes[0]!,
															depth: 0,
															expanded: true,
															selected: false,
															disabled: false,
														},
														option.value,
													)}
													<span className={styles.treeVisualPreviewFolder} />
													<span className={styles.treeVisualPreviewText} />
												</span>
												<span className={styles.treeVisualPreviewLine}>
													<span className={styles.treeVisualPreviewIndent} />
													<span className={styles.treeVisualPreviewSpacer} />
													<span className={styles.treeVisualPreviewFile} />
													<span className={styles.treeVisualPreviewTextShort} />
												</span>
											</span>
											<span>{option.label}</span>
										</button>
									))}
								</div>
								<div className={styles.fileTreeFrame}>
									<Tree
										nodes={treeNodes}
										expanded={treeExpanded}
										onExpandedChange={setTreeExpanded}
										selected={treeSelected}
										onSelect={(id) => setTreeSelected(id)}
										onMove={handleTreeMove}
										canDrop={canDropFileTreeNode}
										renderDisclosure={(args) =>
											renderFileTreeDisclosure(args, treeVisual)
										}
										renderNode={(args) => renderFileTreeNode(args, treeVisual)}
										aria-label="Filesystem Tree specimen"
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<SortableList>"
								source="src/components/SortableList.tsx"
								meta="manual pointer-tracking drag-to-reorder list"
							>
								<div className={styles.sortableListFrame}>
									<SortableList
										items={sortableValues}
										onReorder={setSortableValues}
										getKey={(item) => item}
										renderItem={(item) => (
											<div className={styles.sortableRow}>
												<span className={styles.sortableLabel}>{item}</span>
											</div>
										)}
										aria-label="Sortable list specimen"
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<FreeformCanvas>"
								source="src/components/FreeformCanvas.tsx"
								meta="absolute-positioned cards, drag anywhere, double-click to select"
							>
								<FreeformCanvas
									items={freeformItems}
									renderItem={(item) => {
										const i = freeformItems.findIndex(
											(fi) => fi.id === item.id,
										);
										return (
											<div>
												<div className={styles.cardTitle}>
													{freeformCardLabels[i] ?? item.id}
												</div>
												<div className={styles.cardMeta}>
													Card at ({item.x}, {item.y})
												</div>
												<div className={styles.cardTag}>
													{freeformCardTags[i] ?? "Item"}
												</div>
											</div>
										);
									}}
									onPositionChange={(id, x, y) =>
										setFreeformItems((prev) =>
											prev.map((fi) => (fi.id === id ? { ...fi, x, y } : fi)),
										)
									}
									selectedId={freeformSelected}
									onSelect={setFreeformSelected}
									aria-label="Freeform canvas specimen"
								/>
							</ComponentBlock>

							<ComponentBlock
								name="<DrawingViewer>"
								source="src/components/DrawingViewer.tsx"
								meta="DrawingSource: svg | svg-url | image"
							>
								<div className={styles.viewerFrame}>
									<DrawingViewer
										source={{
											kind: "svg",
											content: drawingSvg,
											label: "<DrawingViewer>",
										}}
										metadata="inline svg"
										download={{ href: "#", label: "download" }}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<CadDxfViewer> / <CadStepViewer>"
								source="src/components/CadViewer.tsx"
								meta="CAD frames for DXF and STEP states"
							>
								<div className={styles.cadGrid}>
									<CadDxfViewer
										status="idle"
										title="<CadDxfViewer>"
										metadata="status=idle"
										style={{ height: 190 }}
									/>
									<CadStepViewer
										status="error"
										error="error prop"
										title="<CadStepViewer>"
										metadata="status=error"
										style={{ height: 190 }}
									/>
								</div>
							</ComponentBlock>
						</div>
					</DocSection>

					<DocSection title="Surfaces">
						<div className={styles.grid}>
							<ComponentBlock
								name="<Panel>"
								source="src/components/Panel.tsx"
								meta="title bar, headerActions slot, body slot"
							>
								<Panel
									title="<Panel>"
									headerActions={
										<Toolbar>
											<StatusBadge variant="info" label="slot" size="control" />
											<IconButton
												title="Panel action"
												size="sm"
												icon={<span>+</span>}
											/>
										</Toolbar>
									}
								>
									<div className={styles.panelBodySpecimen}>
										Panel children render inside the body slot.
									</div>
								</Panel>
							</ComponentBlock>

							<ComponentBlock
								name="<PaneShell>"
								source="src/components/PaneShell.tsx"
								meta="rail, section, sectionOptions, body"
							>
								<div className={styles.paneFrame}>
									<PaneShell
										rail={{
											items: paneRailItems,
											value: paneRail,
											onChange: (value) => setPaneRail(value as PaneRail),
										}}
										section={{
											items: paneSectionItems,
											value: paneSection,
											onChange: (value) => setPaneSection(value as PaneSection),
										}}
										sectionOptions={
											<Toolbar>
												<Button size="sm">Option</Button>
											</Toolbar>
										}
										railResizable={false}
									>
										<div className={styles.specimenText}>
											PaneShell body. Rail and section tabs are rendered by
											PaneShell.
										</div>
									</PaneShell>
								</div>
							</ComponentBlock>
						</div>
					</DocSection>

					<DocSection title="Layout components">
						<ComponentBlock
							name="<AppShell> / <TopBar> / <IconSidebar> / <StatusBar>"
							source="src/components/AppShell.tsx"
							meta="four exported shell components rendered as one specimen"
						>
							<div className={styles.appShellFrame}>
								<AppShell
									topbar={
										<TopBar
											title="<TopBar>"
											subtitle="topbar slot"
											right={
												<Toolbar>
													<Button size="sm">Action</Button>
												</Toolbar>
											}
										/>
									}
									sidebar={
										<IconSidebar
											brand={<span className={styles.sidebarBrand}>UI</span>}
											items={[
												{ id: "one", label: "One", icon: <span>1</span> },
												{ id: "two", label: "Two", icon: <span>2</span> },
												{
													id: "three",
													label: "Three disabled",
													icon: <span>3</span>,
													disabled: true,
												},
											]}
											footerItems={[
												{ id: "four", label: "Four", icon: <span>4</span> },
											]}
											activeItem={sidebarItem}
											onItemSelect={setSidebarItem}
										/>
									}
									statusbar={
										<StatusBar
											left={
												<Toolbar>
													<StatusBadge
														variant="ok"
														label="<StatusBar>"
														size="control"
													/>
												</Toolbar>
											}
											right="right slot"
										/>
									}
								>
									<div className={styles.appShellContent}>
										AppShell children slot
									</div>
								</AppShell>
							</div>
						</ComponentBlock>

						<div className={styles.layoutGrid}>
							<ComponentBlock
								name="<Workspace>"
								source="src/components/Workspace.tsx"
								meta="draggable tabbed pane tree"
							>
								<div className={styles.workspaceFrame}>
									<Workspace
										defaultLayout={workspaceLayout}
										renderPanel={renderWorkspacePanel}
										renderTabLabel={(tab) => workspaceLabels[tab]}
										renderToolbar={(_activeTab, leaf) => (
											<Toolbar>
												<StatusBadge
													variant="info"
													label={leaf.id}
													size="control"
												/>
											</Toolbar>
										)}
										aria-label="Workspace specimen"
									/>
								</div>
							</ComponentBlock>
						</div>
					</DocSection>

					<DocSection title="Viewers">
						<div className={styles.grid}>
							<ComponentBlock
								name="<SvgViewer>"
								source="src/components/SvgViewer.tsx"
								meta="dedicated SVG viewer with pan, zoom, and fit reset"
							>
								<div className={styles.viewerFrame} style={{ height: 280 }}>
									<SvgViewer
										svg={drawingSvg}
										label="<SvgViewer>"
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>
							<ComponentBlock
								name="<CadDxfViewer>"
								source="src/components/CadDxfViewer.tsx"
								meta="DXF preview powered by dxf-viewer and Three.js"
							>
								<div className={styles.viewerFrame} style={{ height: 280 }}>
									<CadDxfViewer
										fileUrl={dxfDemoSrc}
										title="<CadDxfViewer>"
										metadata="inline demo DXF"
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<CadStepViewer>"
								source="src/components/CadStepViewer.tsx"
								meta="STEP mesh preview powered by occt-import-js output and Three.js"
							>
								<div className={styles.viewerFrame} style={{ height: 280 }}>
									<CadStepViewer
										meshUrl={stepDemoMeshSrc}
										title="<CadStepViewer>"
										metadata="demo tessellated mesh"
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<CsvViewer>"
								source="src/components/CsvViewer.tsx"
								meta="sortable columns, filter, pagination"
							>
								<div className={styles.viewerFrame} style={{ height: 280 }}>
									<CsvViewer
										data={csvDemoData}
										rowsPerPage={6}
										filter
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<CodeViewer>"
								source="src/components/CodeViewer.tsx"
								meta="monospace code block with language badge and line numbers"
							>
								<div className={styles.viewerFrame} style={{ height: 280 }}>
									<CodeViewer
										code={codeDemoSnippet}
										language="tsx"
										maxHeight={280}
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<TextViewer>"
								source="src/components/TextViewer.tsx"
								meta="plain text display with optional line numbers"
							>
								<div className={styles.viewerFrame} style={{ height: 280 }}>
									<TextViewer
										text={textDemoContent}
										maxHeight={280}
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>

							<ComponentBlock
								name="<PdfViewer>"
								source="src/components/PdfViewer.tsx"
								meta="sandboxed iframe; src is a URL or data URI"
							>
								<div className={styles.viewerFrame} style={{ height: 240 }}>
									<PdfViewer
										src={pdfDemoSrc}
										height={240}
										title="Sample PDF"
										style={{ border: 0 }}
									/>
								</div>
							</ComponentBlock>
						</div>
					</DocSection>

					<DocSection title="Overlays">
						<div className={styles.grid}>
							<ComponentBlock
								name="<Dialog>"
								source="src/components/Dialog.tsx"
								meta="portal overlay with title, body, footer, close action"
							>
								<div className={styles.wrapRow}>
									<Button onClick={() => setDialogOpen(true)}>
										Open Dialog
									</Button>
									<StatusBadge
										variant="info"
										label="open=false by default"
										size="control"
									/>
								</div>
								<Dialog
									open={dialogOpen}
									onClose={() => setDialogOpen(false)}
									title="<Dialog>"
									titleActions={
										<StatusBadge
											variant="ok"
											label="titleActions"
											size="control"
										/>
									}
									footer={
										<Toolbar>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => setDialogOpen(false)}
											>
												Close
											</Button>
											<Button
												size="sm"
												variant="primary"
												onClick={() => setDialogOpen(false)}
											>
												Confirm
											</Button>
										</Toolbar>
									}
								>
									<div className={styles.specimenText}>
										Dialog children render in the body slot.
									</div>
								</Dialog>
							</ComponentBlock>
						</div>
					</DocSection>
				</main>
			</div>
		</ThemeProvider>
	);
}
