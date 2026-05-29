import { type CSSProperties } from 'react';
export interface LogViewProps {
    lines: string[];
    maxHeight?: number | string;
    wrapLines?: boolean;
    style?: CSSProperties;
}
export declare function LogView({ lines, maxHeight, wrapLines, style }: LogViewProps): import("react/jsx-runtime").JSX.Element;
