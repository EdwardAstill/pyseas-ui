import { type ReactNode } from "react";
export interface ContextMenuItem {
    label?: string;
    icon?: ReactNode;
    shortcut?: string;
    disabled?: boolean;
    onClick?: () => void;
    /**
     * `"divider"` renders a horizontal separator. All other fields except `type` are ignored.
     */
    type?: "item" | "divider";
}
export interface ContextMenuProps {
    items: ContextMenuItem[];
    /** Cursor X coordinate (e.g. `clientX` from a mouse event). */
    x: number;
    /** Cursor Y coordinate (e.g. `clientY` from a mouse event). */
    y: number;
    /** Called when the menu should close (Escape, click-outside, scroll, resize, or item selection). */
    onClose: () => void;
}
export declare function ContextMenu({ items, x, y, onClose }: ContextMenuProps): import("react").ReactPortal;
