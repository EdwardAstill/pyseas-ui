import { type CSSProperties, type ReactNode } from 'react';
export interface FreeformCanvasItem {
    id: string;
    x: number;
    y: number;
}
export interface FreeformCanvasProps<T extends FreeformCanvasItem = FreeformCanvasItem> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    onPositionChange: (id: string, x: number, y: number) => void;
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    cardWidth?: number;
    className?: string;
    style?: CSSProperties;
    'aria-label'?: string;
}
export declare function FreeformCanvas<T extends FreeformCanvasItem = FreeformCanvasItem>({ items, renderItem, onPositionChange, selectedId, onSelect, cardWidth, className, style, 'aria-label': ariaLabel, }: FreeformCanvasProps<T>): import("react/jsx-runtime").JSX.Element;
