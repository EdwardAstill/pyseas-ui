import type { CSSProperties, ReactNode } from 'react';
export interface ToolbarProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}
export declare function Toolbar({ children, className, style }: ToolbarProps): import("react/jsx-runtime").JSX.Element;
