import { type CSSProperties, type ReactNode } from "react";
import { type LayoutNode, type LeafNode } from "./paneLayout";
export interface WorkspaceProps<TTab extends string = string> {
    defaultLayout: LayoutNode<TTab>;
    layout?: LayoutNode<TTab>;
    onLayoutChange?: (layout: LayoutNode<TTab>) => void;
    renderPanel: (tab: TTab) => ReactNode;
    renderTabLabel?: (tab: TTab) => ReactNode;
    renderToolbar?: (activeTab: TTab, leaf: LeafNode<TTab>) => ReactNode;
    minPaneSize?: number;
    className?: string;
    style?: CSSProperties;
    "aria-label"?: string;
}
export declare function Workspace<TTab extends string = string>({ defaultLayout, layout, onLayoutChange, renderPanel, renderTabLabel, renderToolbar, minPaneSize, className, style, "aria-label": ariaLabel, }: WorkspaceProps<TTab>): import("react/jsx-runtime").JSX.Element;
