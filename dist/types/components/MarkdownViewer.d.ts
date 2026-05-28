import type { CSSProperties } from "react";
import "katex/dist/katex.min.css";
export interface MarkdownViewerProps {
    /** Raw markdown content. Supports $$/display/$$ and $inline$ LaTeX via KaTeX. */
    content: string;
    /** Maximum height before scrolling. Omit for auto-height. */
    maxHeight?: number;
    /** CSS overrides on the root element. */
    style?: CSSProperties;
}
export declare function MarkdownViewer({ content, maxHeight, style, }: MarkdownViewerProps): import("react/jsx-runtime").JSX.Element;
