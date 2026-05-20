import { type CSSProperties, type ReactNode } from 'react';
export interface TreeNode<T = unknown> {
    id: string;
    label: string;
    children?: TreeNode<T>[];
    disabled?: boolean;
    icon?: ReactNode;
    trailing?: ReactNode;
    data?: T;
}
export interface TreeRenderArgs<T> {
    node: TreeNode<T>;
    depth: number;
    expanded: boolean;
    selected: boolean;
}
export interface TreeDisclosureArgs<T> extends TreeRenderArgs<T> {
    disabled: boolean;
}
export type TreeDropPosition = 'before' | 'inside' | 'after';
export interface TreeMoveArgs<T = unknown> {
    draggedId: string;
    targetId: string;
    position: TreeDropPosition;
    draggedNode: TreeNode<T>;
    targetNode: TreeNode<T>;
}
export interface TreeProps<T = unknown> {
    nodes: TreeNode<T>[];
    expanded: ReadonlySet<string>;
    onExpandedChange: (next: Set<string>) => void;
    selected?: string | null;
    onSelect?: (id: string, node: TreeNode<T>) => void;
    onMove?: (args: TreeMoveArgs<T>) => void;
    canDrop?: (args: TreeMoveArgs<T>) => boolean;
    indent?: number;
    renderDisclosure?: (args: TreeDisclosureArgs<T>) => ReactNode;
    renderNode?: (args: TreeRenderArgs<T>) => ReactNode;
    className?: string;
    style?: CSSProperties;
    'aria-label'?: string;
}
export declare function Tree<T = unknown>({ nodes, expanded, onExpandedChange, selected, onSelect, onMove, canDrop, indent, renderDisclosure, renderNode, className, style, 'aria-label': ariaLabel, }: TreeProps<T>): import("react/jsx-runtime").JSX.Element;
