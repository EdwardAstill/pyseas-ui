import type { CSSProperties } from "react";
export interface CodeViewerProps {
    /** Source code to display. */
    code: string;
    /** Language identifier shown in the badge. */
    language?: string;
    /** Show line numbers. Default: true. */
    showLineNumbers?: boolean;
    /** Maximum height before scrolling. Omit for auto-height. */
    maxHeight?: number;
    /** CSS overrides on the root element. */
    style?: CSSProperties;
}
export declare function CodeViewer({ code, language, showLineNumbers, maxHeight, style, }: CodeViewerProps): import("react/jsx-runtime").JSX.Element;
