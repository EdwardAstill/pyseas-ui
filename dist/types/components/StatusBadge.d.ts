import type { CSSProperties } from 'react';
export type StatusVariant = 'ok' | 'warn' | 'err' | 'info';
export type StatusBadgeSize = 'badge' | 'control';
export interface StatusBadgeProps {
    variant: StatusVariant;
    label?: string;
    size?: StatusBadgeSize;
    style?: CSSProperties;
}
export declare function StatusBadge({ variant, label, size, style }: StatusBadgeProps): import("react/jsx-runtime").JSX.Element;
