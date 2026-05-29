import type { CSSProperties, MouseEventHandler } from "react";
export type TagPillVariant = "default" | "accent" | "status";
export type TagPillSize = "sm" | "md";
export interface TagPillProps {
    label: string;
    href?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
    onRemove?: () => void;
    variant?: TagPillVariant;
    size?: TagPillSize;
    className?: string;
    style?: CSSProperties;
}
export declare function TagPill({ label, href, onClick, onRemove, variant, size, className, style, }: TagPillProps): import("react/jsx-runtime").JSX.Element;
