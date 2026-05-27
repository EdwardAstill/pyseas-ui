import "./styles.css";

// pyseas-ui public API

export { ThemeProvider, useTheme } from "./components/ThemeProvider";
export type {
	LegacyThemeName,
	ThemeAppearanceName,
	ThemeColoringName,
	ThemeContextValue,
	ThemeMode,
	ThemeName,
	ThemeProviderProps,
} from "./components/ThemeProvider";

export { Panel } from "./components/Panel";
export type { PanelProps } from "./components/Panel";

export { Tabs } from "./components/Tabs";
export type { TabsProps, TabItem } from "./components/Tabs";

export { Toolbar } from "./components/Toolbar";
export type { ToolbarProps } from "./components/Toolbar";

export { Button } from "./components/Button";
export type {
	ButtonProps,
	ButtonVariant,
	ButtonSize,
} from "./components/Button";

export { IconButton } from "./components/IconButton";
export type { IconButtonProps } from "./components/IconButton";

export { TextField } from "./components/TextField";
export type { TextFieldProps } from "./components/TextField";

export { NumberField } from "./components/NumberField";
export type { NumberFieldProps } from "./components/NumberField";

export { Select } from "./components/Select";
export type { SelectProps, SelectOption } from "./components/Select";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";

export { Toggle } from "./components/Toggle";
export type { ToggleProps } from "./components/Toggle";

export { Dialog } from "./components/Dialog";
export type { DialogProps, DialogSize } from "./components/Dialog";

export { StatusBadge } from "./components/StatusBadge";
export type {
	StatusBadgeProps,
	StatusBadgeSize,
	StatusVariant,
} from "./components/StatusBadge";

export { Result } from "./components/Result";
export type { ResultProps, ResultStatus } from "./components/Result";

export { LogView } from "./components/LogView";
export type { LogViewProps } from "./components/LogView";

export { DrawingViewer } from "./components/DrawingViewer";
export type {
	DrawingDownload,
	DrawingSource,
	DrawingViewerProps,
	DrawingViewerStatus,
} from "./components/DrawingViewer";

export { CadDxfViewer, CadStepViewer } from "./components/CadViewer";
export type {
	CadDxfViewerProps,
	CadStepViewerProps,
	CadViewerDownload,
	CadViewerStatus,
	CadViewerTheme,
} from "./components/CadViewer";

export { Tree } from "./components/Tree";
export type {
	TreeDisclosureArgs,
	TreeDropPosition,
	TreeMoveArgs,
	TreeNode,
	TreeProps,
	TreeRenderArgs,
} from "./components/Tree";

export { Workspace } from "./components/Workspace";
export type { WorkspaceProps } from "./components/Workspace";

export { PaneShell } from "./components/PaneShell";
export type {
	PaneShellProps,
	PaneRailSpec,
	PaneSectionSpec,
} from "./components/PaneShell";

export {
	AppShell,
	TopBar,
	IconSidebar,
	StatusBar,
} from "./components/AppShell";
export type {
	AppShellProps,
	TopBarProps,
	IconSidebarProps,
	IconSidebarItem,
	StatusBarProps,
} from "./components/AppShell";

export { SortableList } from "./components/SortableList";
export type { SortableListProps } from "./components/SortableList";

export { FreeformCanvas } from "./components/FreeformCanvas";
export type {
	FreeformCanvasItem,
	FreeformCanvasProps,
} from "./components/FreeformCanvas";

export { CsvViewer } from "./components/CsvViewer";
export type { CsvData, CsvViewerProps } from "./components/CsvViewer";

export { CodeViewer } from "./components/CodeViewer";
export type { CodeViewerProps } from "./components/CodeViewer";

export { TextViewer } from "./components/TextViewer";
export type { TextViewerProps } from "./components/TextViewer";

export { PdfViewer } from "./components/PdfViewer";
export type { PdfViewerProps } from "./components/PdfViewer";

export {
	cloneLayout,
	computeDropEdge,
	findLeafById,
	findLeafOfTab,
	insertLeafAt,
	insertTabAt,
	moveGroup,
	moveTab,
	normalizeSplitSizes,
	removeLeafById,
	setActiveTab,
	setSplitSizesAtPath,
} from "./components/paneLayout";
export type {
	DropEdge,
	LayoutNode,
	LeafNode,
	LeafSearchResult,
	LayoutPoint,
	LayoutRect,
	SplitDirection,
	SplitNode,
	MoveGroupOptions,
	MoveTabOptions,
} from "./components/paneLayout";
