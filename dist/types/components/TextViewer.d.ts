import type { CSSProperties } from "react";
export interface TextViewerProps {
    /** Plain text to display. */
    text: string;
    /** Show line numbers. Default: false. */
    showLineNumbers?: boolean;
    /** Maximum height before scrolling. Omit for auto-height. */
    maxHeight?: number;
    /** CSS overrides on the root element. */
    style?: CSSProperties;
}
export declare function TextViewer({ text, showLineNumbers, maxHeight, style, }: TextViewerProps): import("react/jsx-runtime").JSX.Element;
