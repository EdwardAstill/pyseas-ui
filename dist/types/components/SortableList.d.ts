import { type CSSProperties, type ReactNode } from 'react';
export interface SortableListProps<T = unknown> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    onReorder: (items: T[]) => void;
    getKey?: (item: T, index: number) => string | number;
    className?: string;
    style?: CSSProperties;
    'aria-label'?: string;
}
export declare function SortableList<T = unknown>({ items, renderItem, onReorder, getKey, className, style, 'aria-label': ariaLabel, }: SortableListProps<T>): import("react/jsx-runtime").JSX.Element;
