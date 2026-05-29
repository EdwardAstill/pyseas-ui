import type { CSSProperties } from "react";
export interface CsvData {
    headers: string[];
    rows: string[][];
}
export interface CsvViewerProps {
    /** Parsed CSV data. Pass `{ headers: [], rows: [] }` for empty state. */
    data: CsvData;
    /** Rows per page. Default: 50. */
    rowsPerPage?: number;
    /** Show filter input. Default: true. */
    filter?: boolean;
    /** Height in pixels. Omit for auto-height. */
    height?: number;
    /** Text shown when the CSV has no rows. */
    emptyMessage?: string;
    /** CSS overrides on the root element. */
    style?: CSSProperties;
}
export declare function CsvViewer({ data, rowsPerPage, filter, height, emptyMessage, style, }: CsvViewerProps): import("react/jsx-runtime").JSX.Element;
