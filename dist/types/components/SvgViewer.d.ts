import type { CSSProperties } from "react";
export interface SvgViewerProps {
    /** Raw SVG markup string. */
    svg: string;
    /** Accessible label for the SVG. */
    label?: string;
    /** CSS class on the root element. */
    className?: string;
    /** CSS overrides on the root element. */
    style?: CSSProperties;
}
export declare function SvgViewer({ svg, label, className, style }: SvgViewerProps): import("react/jsx-runtime").JSX.Element;
