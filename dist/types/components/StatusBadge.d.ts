import type { CSSProperties } from 'react';
export type StatusVariant = 'ok' | 'warn' | 'err' | 'info';
export interface StatusBadgeProps {
    variant: StatusVariant;
    label?: string;
    style?: CSSProperties;
}
export declare function StatusBadge({ variant, label, style }: StatusBadgeProps): import("react/jsx-runtime").JSX.Element;
