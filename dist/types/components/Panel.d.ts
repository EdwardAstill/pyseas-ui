import type { CSSProperties, ReactNode } from 'react';
export interface PanelProps {
    title?: string;
    headerActions?: ReactNode;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}
export declare function Panel({ title, headerActions, children, className, style }: PanelProps): import("react/jsx-runtime").JSX.Element;
