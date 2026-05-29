import { type CSSProperties, type ReactNode } from 'react';
import { type TabItem } from './Tabs';
export interface PaneRailSpec<T extends string = string> {
    items: TabItem[];
    value: T;
    onChange: (value: T) => void;
}
export interface PaneSectionSpec<T extends string = string> {
    items: TabItem[];
    value: T;
    onChange: (value: T) => void;
}
export interface PaneShellProps {
    rail?: PaneRailSpec | undefined;
    section?: PaneSectionSpec | undefined;
    sectionOptions?: ReactNode;
    children: ReactNode;
    flushBody?: boolean;
    railWidth?: number;
    railMinWidth?: number;
    railMaxWidth?: number;
    railResizable?: boolean;
    onRailWidthChange?: (width: number) => void;
    className?: string;
    style?: CSSProperties;
}
export declare function PaneShell({ rail, section, sectionOptions, children, flushBody, railWidth, railMinWidth, railMaxWidth, railResizable, onRailWidthChange, className, style, }: PaneShellProps): import("react/jsx-runtime").JSX.Element;
