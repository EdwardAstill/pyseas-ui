import type { CSSProperties } from "react";
export interface PdfViewerProps {
    /** URL to the PDF file. */
    src: string;
    /** Height in pixels. Default: 600. */
    height?: number;
    /** Accessible title for the iframe. Defaults to "PDF viewer". */
    title?: string;
    /** CSS overrides on the root element. */
    style?: CSSProperties;
}
export declare function PdfViewer({ src, height, title, style, }: PdfViewerProps): import("react/jsx-runtime").JSX.Element;
