import { type CSSProperties, type ReactNode } from "react";
export interface TreeNavNode {
    id: string;
    label: string;
    href?: string;
    icon?: ReactNode;
    children?: TreeNavNode[];
    active?: boolean;
    disabled?: boolean;
}
export interface TreeNavProps {
    nodes: TreeNavNode[];
    onNodeClick?: (node: TreeNavNode) => void;
    expandedIds?: Set<string>;
    onToggle?: (id: string) => void;
    className?: string;
    style?: CSSProperties;
}
export declare function TreeNav({ nodes, onNodeClick, expandedIds: controlledExpanded, onToggle, className, style, }: TreeNavProps): import("react/jsx-runtime").JSX.Element;
