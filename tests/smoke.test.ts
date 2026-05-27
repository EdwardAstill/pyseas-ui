import { expect, test } from "bun:test";
import type {
	ThemeAppearanceName,
	ThemeColoringName,
	ThemeName,
	ThemeProviderProps,
	PanelProps,
	TabsProps,
	TabItem,
	ToolbarProps,
	ButtonProps,
	ButtonVariant,
	ButtonSize,
	IconButtonProps,
	TextFieldProps,
	NumberFieldProps,
	SelectProps,
	SelectOption,
	CheckboxProps,
	ToggleProps,
	DialogProps,
	DialogSize,
	StatusBadgeProps,
	StatusVariant,
	ResultProps,
	ResultStatus,
	LogViewProps,
	TreeDisclosureArgs,
	TreeDropPosition,
	TreeMoveArgs,
	TreeNode,
	TreeProps,
	DrawingDownload,
	DrawingSource,
	DrawingViewerProps,
	DrawingViewerStatus,
	WorkspaceProps,
	AppShellProps,
	TopBarProps,
	IconSidebarProps,
	IconSidebarItem,
	StatusBarProps,
	LayoutNode,
} from "../src/index";

// Type-level smoke: all exports resolve. Runtime check: basic instantiation.
test("all component types are importable", () => {
	// Verify type shapes at runtime by constructing minimal valid objects.
	const themeName: ThemeName = "compact";
	const appearanceName: ThemeAppearanceName = "bun";
	const coloringName: ThemeColoringName = "neon-pink";
	const themeProps: ThemeProviderProps = {
		theme: appearanceName,
		coloring: coloringName,
		children: null,
	};
	expect(themeName).toBe("compact");
	expect(themeProps.theme).toBe("bun");

	const panelProps: PanelProps = { children: null };
	expect(panelProps.children).toBeNull();

	const tabItem: TabItem = { value: "x", label: "X" };
	const tabsProps: TabsProps = {
		items: [tabItem],
		value: "x",
		onChange: () => {},
	};
	expect(tabsProps.value).toBe("x");

	const toolbarProps: ToolbarProps = { children: null };
	expect(toolbarProps.children).toBeNull();

	const variant: ButtonVariant = "primary";
	const btnSize: ButtonSize = "md";
	const buttonProps: ButtonProps = { variant, size: btnSize };
	expect(buttonProps.variant).toBe("primary");

	const iconBtnProps: IconButtonProps = { icon: "⚙", title: "settings" };
	expect(iconBtnProps.title).toBe("settings");

	const tfProps: TextFieldProps = { value: "", onChange: () => {} };
	expect(tfProps.value).toBe("");

	const nfProps: NumberFieldProps = { value: null, onChange: () => {} };
	expect(nfProps.value).toBeNull();

	const opt: SelectOption = { value: "a", label: "A" };
	const selectProps: SelectProps = {
		options: [opt],
		value: null,
		onChange: () => {},
	};
	expect(selectProps.value).toBeNull();

	const cbProps: CheckboxProps = { checked: false, onChange: () => {} };
	expect(cbProps.checked).toBe(false);

	const toggleProps: ToggleProps = { value: true, onChange: () => {} };
	expect(toggleProps.value).toBe(true);

	const dialogSize: DialogSize = "lg";
	const dialogProps: DialogProps = {
		open: false,
		onClose: () => {},
		children: null,
		size: dialogSize,
	};
	expect(dialogProps.open).toBe(false);

	const sv: StatusVariant = "ok";
	const sbProps: StatusBadgeProps = { variant: sv };
	expect(sbProps.variant).toBe("ok");

	const rs: ResultStatus = "warn";
	const resultProps: ResultProps = { label: "L", value: 1, status: rs };
	expect(resultProps.label).toBe("L");

	const lvProps: LogViewProps = { lines: ["line1"] };
	expect(lvProps.lines[0]).toBe("line1");

	const treeNode: TreeNode = { id: "node", label: "Node" };
	const treeDisclosure: TreeDisclosureArgs<unknown> = {
		node: treeNode,
		depth: 0,
		expanded: true,
		selected: false,
		disabled: false,
	};
	const treeDropPosition: TreeDropPosition = "inside";
	const treeMove: TreeMoveArgs = {
		draggedId: "node",
		targetId: "target",
		position: treeDropPosition,
		draggedNode: treeNode,
		targetNode: { id: "target", label: "Target" },
	};
	const treeProps: TreeProps = {
		nodes: [treeNode],
		expanded: new Set(),
		onExpandedChange: () => {},
		onMove: () => {},
		renderDisclosure: () => null,
	};
	expect(treeDisclosure.expanded).toBe(true);
	expect(treeMove.position).toBe("inside");
	expect(treeProps.nodes[0]?.id).toBe("node");

	const drawingSource: DrawingSource = { kind: "svg", content: "<svg />" };
	const drawingStatus: DrawingViewerStatus = "ready";
	const drawingDownload: DrawingDownload = {
		href: "/drawing.dxf",
		label: "DXF",
	};
	const drawingProps: DrawingViewerProps = {
		source: drawingSource,
		status: drawingStatus,
		download: drawingDownload,
	};
	expect(drawingProps.source?.kind).toBe("svg");

	const workspaceLayout: LayoutNode<"one"> = {
		type: "leaf",
		id: "leaf",
		tabs: ["one"],
		activeTab: "one",
	};
	const workspaceProps: WorkspaceProps<"one"> = {
		defaultLayout: workspaceLayout,
		renderPanel: () => null,
	};
	expect(workspaceProps.defaultLayout.type).toBe("leaf");

	const shellProps: AppShellProps = { children: null };
	expect(shellProps.children).toBeNull();

	const topbarProps: TopBarProps = { title: "Title" };
	expect(topbarProps.title).toBe("Title");

	const sidebarItem: IconSidebarItem = {
		id: "parts",
		label: "Parts",
		icon: null,
	};
	const sidebarProps: IconSidebarProps = { items: [sidebarItem] };
	expect(sidebarProps.items[0]!.id).toBe("parts");

	const statusProps: StatusBarProps = { left: "ready" };
	expect(statusProps.left).toBe("ready");
});

test("named exports are present", async () => {
	const mod = await import("../src/index");
	const expected = [
		"ThemeProvider",
		"Panel",
		"Tabs",
		"Toolbar",
		"Button",
		"IconButton",
		"TextField",
		"NumberField",
		"Select",
		"Checkbox",
		"Toggle",
		"Dialog",
		"StatusBadge",
		"Result",
		"LogView",
		"Tree",
		"DrawingViewer",
		"CadDxfViewer",
		"CadStepViewer",
		"SortableList",
		"FreeformCanvas",
		"CsvViewer",
		"CodeViewer",
		"TextViewer",
		"PdfViewer",
		"Workspace",
		"PaneShell",
		"AppShell",
		"TopBar",
		"IconSidebar",
		"StatusBar",
	];
	for (const name of expected) {
		expect(typeof (mod as Record<string, unknown>)[name]).toBe("function");
	}
});
