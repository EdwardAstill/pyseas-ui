import { type CSSProperties, type ReactNode } from "react";
export interface CommandPaletteItem {
    id: string;
    label: string;
    description?: string;
    icon?: ReactNode;
    keywords?: string[];
    onSelect: () => void;
}
export interface CommandPaletteProps {
    open: boolean;
    onClose: () => void;
    items: CommandPaletteItem[];
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    style?: CSSProperties;
}
export declare function CommandPalette({ open, onClose, items, placeholder, emptyMessage, className, style, }: CommandPaletteProps): import("react").ReactPortal | null;
